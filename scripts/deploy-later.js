#!/usr/bin/env node
/**
 * deploy-later.js
 * ---------------
 * Schedules a deployment using macOS launchd + pmset wake.
 * The machine will physically wake from sleep at the scheduled time,
 * even with the lid closed (requires power adapter).
 *
 * Usage:
 *   npm run deploylater              → prompts for delay in hours
 *   npm run deploylater -- 2         → deploys in 2 hours
 *   npm run deploylater -- 0.5       → deploys in 30 minutes
 *   npm run deploylater -- cancel    → cancels pending deploy + wake event
 *   npm run deploylater -- status    → shows scheduled deploy info
 *   npm run deploylater -- setup     → prints one-time sudo setup instructions
 */

import { execSync, spawnSync } from 'child_process';
import { writeFileSync, existsSync, unlinkSync, readFileSync } from 'fs';
import { createInterface } from 'readline';
import path from 'path';
import os from 'os';

const PLIST_LABEL      = 'dev.blueprint-ftc.deploy-later';
const PLIST_PATH       = path.join(os.homedir(), 'Library', 'LaunchAgents', `${PLIST_LABEL}.plist`);
const PROJECT_DIR      = path.resolve(import.meta.dirname, '..');
const USERNAME         = os.userInfo().username;

// ── Helpers ────────────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, '0'); }

/** Human-readable local timestamp: 2026-04-10 02:30 */
function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** pmset date format: MM/DD/YY HH:MM:SS */
function pmsetDate(d) {
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const yy = String(d.getFullYear()).slice(-2);
  const HH = pad(d.getHours());
  const MM = pad(d.getMinutes());
  const SS = '00';
  return `${mm}/${dd}/${yy} ${HH}:${MM}:${SS}`;
}

function which(cmd) {
  try { return execSync(`which ${cmd}`, { stdio: ['pipe','pipe','pipe'] }).toString().trim(); }
  catch { return cmd; }
}

// ── pmset wake scheduling ─────────────────────────────────────────────────

/**
 * Schedule a hardware wake via pmset.
 * Returns { ok: true } or { ok: false, needsSudo: true, err: string }
 */
function schedulePmsetWake(fireAt) {
  const dateStr = pmsetDate(fireAt);
  const result = spawnSync('sudo', ['-n', '/usr/bin/pmset', 'schedule', 'wake', dateStr], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  if (result.status === 0) return { ok: true };

  // sudo -n fails if a password is needed
  const stderr = result.stderr?.toString() ?? '';
  if (stderr.includes('password') || stderr.includes('sudoers') || result.status === 1) {
    return { ok: false, needsSudo: true, err: stderr };
  }
  return { ok: false, needsSudo: false, err: stderr };
}

/** Cancel the pmset wake event (best-effort) */
function cancelPmsetWake() {
  // pmset schedule cancelall cancels ALL scheduled events — instead we
  // cancel only the "wake" type by rescheduling to nothing (not possible
  // directly), so we use cancelall for simplicity since launchd is the
  // real backstop.
  spawnSync('sudo', ['-n', '/usr/bin/pmset', 'schedule', 'cancelall'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
}

// ── launchd plist ─────────────────────────────────────────────────────────

function unloadPlist() {
  if (existsSync(PLIST_PATH)) {
    spawnSync('launchctl', ['unload', PLIST_PATH], { stdio: 'pipe' });
    unlinkSync(PLIST_PATH);
    return true;
  }
  return false;
}

function writePlist(fireAt, deployScriptPath) {
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${PLIST_LABEL}</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>${deployScriptPath}</string>
  </array>

  <!-- Fire at exact calendar time; also fires on next wake if machine was asleep -->
  <key>StartCalendarInterval</key>
  <dict>
    <key>Month</key>  <integer>${fireAt.getMonth() + 1}</integer>
    <key>Day</key>    <integer>${fireAt.getDate()}</integer>
    <key>Hour</key>   <integer>${fireAt.getHours()}</integer>
    <key>Minute</key> <integer>${fireAt.getMinutes()}</integer>
  </dict>

  <key>RunAtLoad</key>
  <false/>

  <key>StandardOutPath</key>
  <string>${path.join(PROJECT_DIR, '.deploy-later.log')}</string>
  <key>StandardErrorPath</key>
  <string>${path.join(PROJECT_DIR, '.deploy-later.log')}</string>
</dict>
</plist>`;

  writeFileSync(PLIST_PATH, plist);
  const r = spawnSync('launchctl', ['load', PLIST_PATH], { stdio: 'pipe' });
  return r.status === 0;
}

// ── Status ─────────────────────────────────────────────────────────────────

function status() {
  if (!existsSync(PLIST_PATH)) {
    console.log('ℹ️  No deployment is currently scheduled.');
    return;
  }
  try {
    const xml   = readFileSync(PLIST_PATH, 'utf8');
    const hour  = xml.match(/<key>Hour<\/key>\s*<integer>(\d+)<\/integer>/)?.[1];
    const min   = xml.match(/<key>Minute<\/key>\s*<integer>(\d+)<\/integer>/)?.[1];
    const day   = xml.match(/<key>Day<\/key>\s*<integer>(\d+)<\/integer>/)?.[1];
    const month = xml.match(/<key>Month<\/key>\s*<integer>(\d+)<\/integer>/)?.[1];

    if (hour && min) {
      const now  = new Date();
      const fire = new Date(
        now.getFullYear(),
        Number(month ?? now.getMonth() + 1) - 1,
        Number(day ?? now.getDate()),
        Number(hour),
        Number(min)
      );
      const diff  = fire - Date.now();
      const hLeft = Math.floor(diff / 3600000);
      const mLeft = Math.floor((diff % 3600000) / 60000);
      console.log(`⏰  Deployment scheduled for ${formatDate(fire)}`);
      if (diff > 0)  console.log(`    Time remaining: ${hLeft}h ${mLeft}m`);
      else           console.log(`    (overdue — will fire on next wake)`);
    }
  } catch {
    console.log('⏰  A deployment is scheduled (could not parse details).');
  }

  // Also show any pmset scheduled events
  try {
    const pmOut = execSync('pmset -g sched 2>/dev/null', { stdio: ['pipe','pipe','pipe'] }).toString().trim();
    if (pmOut && pmOut !== 'Scheduled power events:') {
      console.log('\n📟  pmset scheduled wake:');
      console.log('   ', pmOut.split('\n').filter(l => l.trim()).join('\n    '));
    }
  } catch { /* ignore */ }
}

// ── Setup instructions ─────────────────────────────────────────────────────

function printSetupInstructions() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          deploy-later — One-Time sudo Setup                  ║
╚══════════════════════════════════════════════════════════════╝

To allow deploy-later to physically wake your Mac from sleep,
pmset needs to run with sudo WITHOUT a password prompt.

Run this ONE TIME in your terminal:

  sudo sh -c 'echo "${USERNAME} ALL=(ALL) NOPASSWD: /usr/bin/pmset" > /etc/sudoers.d/blueprint-deploylater'

Then verify it worked:

  sudo -n pmset -g sched

If no password was asked, you're all set! ✅

Without this setup, deploy-later still works via launchd — it
just won't physically wake the machine (fires on next wake instead).
`);
}

// ── Sub-commands ───────────────────────────────────────────────────────────

const arg = process.argv[2];

if (arg === 'setup') {
  printSetupInstructions();
  process.exit(0);
}

if (arg === 'cancel') {
  const removed = unloadPlist();
  cancelPmsetWake();
  console.log(removed
    ? '🗑️  Scheduled deployment cancelled (launchd + pmset wake removed).'
    : 'ℹ️  Nothing to cancel.');
  process.exit(0);
}

if (arg === 'status') {
  status();
  process.exit(0);
}

// ── Get delay in hours ─────────────────────────────────────────────────────

async function getHours() {
  if (arg && !isNaN(parseFloat(arg))) return parseFloat(arg);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('⏱️  Deploy in how many hours? (e.g. 2 or 0.5): ', (ans) => {
      rl.close();
      const h = parseFloat(ans.trim());
      if (isNaN(h) || h <= 0) {
        console.error('❌  Please enter a positive number of hours.');
        process.exit(1);
      }
      resolve(h);
    });
  });
}

const delayHours = await getHours();
const fireAt     = new Date(Date.now() + delayHours * 3600 * 1000);

// ── Find executables ───────────────────────────────────────────────────────

const nodeBin = which('node');
const gitBin  = which('git');
const npmBin  = which('npm');

// ── Write the deploy shell script ─────────────────────────────────────────

const deployScript = [
  `#!/bin/sh`,
  `set -e`,
  `cd "${PROJECT_DIR}"`,

  // Bump version (matches existing "deploy" npm script)
  `${npmBin} version patch --no-git-tag-version`,

  // Stage, commit, push → triggers GitHub Actions → deploys to GitHub Pages
  `${gitBin} add -A`,
  `VERSION=$(${nodeBin} -p "require('./package.json').version")`,
  `${gitBin} commit -m "chore: scheduled deploy v\${VERSION}"`,
  `${gitBin} push origin main`,

  // Self-cleanup so launchd doesn't fire again
  `launchctl unload "${PLIST_PATH}" 2>/dev/null || true`,
  `rm -f "${PLIST_PATH}"`,

  // Also clean up the shell script itself
  `rm -f "${path.join(PROJECT_DIR, '.deploy-later-run.sh')}"`,

  `echo "🚀 Deployed v\${VERSION} at \$(date)"`,
].join('\n');

const deployScriptPath = path.join(PROJECT_DIR, '.deploy-later-run.sh');
writeFileSync(deployScriptPath, deployScript, { mode: 0o755 });

// ── Cancel any existing scheduled deploy ──────────────────────────────────

unloadPlist();

// ── Schedule pmset hardware wake ──────────────────────────────────────────

const wakeResult = schedulePmsetWake(fireAt);
let wakeScheduled = wakeResult.ok;

// ── Register launchd plist ─────────────────────────────────────────────────

const plistOk = writePlist(fireAt, deployScriptPath);

if (!plistOk) {
  console.error('❌  Failed to register with launchd. Check that ~/Library/LaunchAgents/ is writable.');
  process.exit(1);
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log();
console.log(`✅  Deployment scheduled!`);
console.log(`   🕐  Fires at:    ${formatDate(fireAt)}`);
console.log(`   ⏱️  In:          ${delayHours} hour(s) from now`);

if (wakeScheduled) {
  console.log(`   🌙  Wake:       Mac will wake from sleep automatically (even lid closed)`);
} else {
  console.log(`   ⚠️  Wake:       pmset needs sudo setup — run: npm run deploylater -- setup`);
  console.log(`                  Without it, deploy fires on next manual wake instead.`);
}

console.log(`   📝  Log:        ${path.join(PROJECT_DIR, '.deploy-later.log')}`);
console.log(`   ❌  To cancel:  npm run deploylater -- cancel`);
console.log(`   📊  Status:     npm run deploylater -- status`);
console.log();

if (wakeScheduled) {
  console.log(`💡  Mac plugged in? You're all set — close the lid and walk away.`);
} else {
  console.log(`💡  Tip: run  npm run deploylater -- setup  to enable lid-closed wake.`);
}

console.log();
