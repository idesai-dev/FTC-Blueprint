<script lang="ts">
	import { devModeState } from '$lib/stores/devMode.svelte';
	import { fade, fly } from 'svelte/transition';

	let {
		slug,
		section = 'software'
	}: {
		slug: string;
		section?: 'software' | 'hardware' | 'outreach';
	} = $props();

	const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
	const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER as string;
	const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO as string;

	const PRESET_TAGS = [
		{ label: 'completed', color: '#7EFFA0' },
		{ label: 'coming soon', color: '#f0c040' },
		{ label: 'beginner', color: '#74D7ED' },
		{ label: 'intermediate', color: '#a78bfa' },
		{ label: 'advanced', color: '#f87171' },
		{ label: 'software', color: '#60a5fa' },
		{ label: 'hardware', color: '#fb923c' },
		{ label: 'outreach', color: '#f472b6' }
	];

	let isOpen = $state(false);
	let activeTab = $state<'editor' | 'tags'>('editor');
	let content = $state('');
	let status = $state<'idle' | 'loading' | 'saving' | 'success' | 'error'>('idle');
	let statusMsg = $state('');
	let fileSha = $state('');
	let editorEl = $state<HTMLTextAreaElement | null>(null);
	let tagSearch = $state('');
	let currentTags = $state<string[]>([]);

	const filePath = $derived(`src/posts/${slug}.md`);

	function parseTags(raw: string): string[] {
		const match = raw.match(/tags:\s*\[([^\]]*)\]/);
		if (!match) return [];
		return match[1]
			.split(',')
			.map((t) => t.trim().replace(/['"]/g, ''))
			.filter(Boolean);
	}

	function applyTagsToContent(raw: string, tags: string[]): string {
		const line = `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`;
		if (/tags:\s*\[[^\]]*\]/.test(raw)) {
			return raw.replace(/tags:\s*\[[^\]]*\]/, line);
		}
		// Insert before closing ---
		return raw.replace(/^(---[\s\S]*?)(---)/, `$1${line}\n$2`);
	}

	function toggleTag(tag: string) {
		const exists = currentTags.some((t) => t.toLowerCase() === tag.toLowerCase());
		if (exists) {
			currentTags = currentTags.filter((t) => t.toLowerCase() !== tag.toLowerCase());
		} else {
			currentTags = [...currentTags, tag];
		}
		content = applyTagsToContent(content, currentTags);
	}

	function addCustomTag() {
		const t = tagSearch.trim();
		if (!t || currentTags.some((ct) => ct.toLowerCase() === t.toLowerCase())) {
			tagSearch = '';
			return;
		}
		currentTags = [...currentTags, t];
		content = applyTagsToContent(content, currentTags);
		tagSearch = '';
	}

	function removeTag(tag: string) {
		currentTags = currentTags.filter((t) => t !== tag);
		content = applyTagsToContent(content, currentTags);
	}

	const filteredPresets = $derived(
		PRESET_TAGS.filter((p) => p.label.includes(tagSearch.toLowerCase()))
	);

	async function fetchRawContent() {
		status = 'loading';
		try {
			const res = await fetch(
				`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
				{
					headers: {
						Authorization: `Bearer ${GITHUB_TOKEN}`,
						Accept: 'application/vnd.github.v3+json'
					}
				}
			);
			if (!res.ok) throw new Error(`GitHub API ${res.status}`);
			const data = await res.json();
			fileSha = data.sha;
			content = atob(data.content.replace(/\n/g, ''));
			currentTags = parseTags(content);
			status = 'idle';
		} catch (e) {
			status = 'error';
			statusMsg = 'Failed to load file from GitHub.';
		}
	}

	async function open() {
		isOpen = true;
		await fetchRawContent();
	}

	function close() {
		isOpen = false;
		status = 'idle';
		statusMsg = '';
	}

	async function save() {
		if (!content.trim() || status === 'saving') return;
		status = 'saving';
		statusMsg = 'Committing to GitHub...';
		try {
			const encoded = btoa(unescape(encodeURIComponent(content)));
			const res = await fetch(
				`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${GITHUB_TOKEN}`,
						Accept: 'application/vnd.github.v3+json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						message: `docs: update ${slug} via editor`,
						content: encoded,
						sha: fileSha
					})
				}
			);
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.message || `GitHub API ${res.status}`);
			}
			const data = await res.json();
			fileSha = data.content.sha;
			status = 'success';
			statusMsg = 'Saved! Triggering deploy…';

			// Trigger the GitHub Actions workflow to rebuild & deploy
			try {
				await fetch(
					`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/deploy.yml/dispatches`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${GITHUB_TOKEN}`,
							Accept: 'application/vnd.github.v3+json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ ref: 'main' })
					}
				);
				statusMsg = 'Saved! CI building… live in ~60s ✓';
			} catch {
				statusMsg = 'Saved! (trigger deploy manually)';
			}
			setTimeout(() => {
				status = 'idle';
				statusMsg = '';
			}, 6000);
		} catch (e: unknown) {
			status = 'error';
			statusMsg = e instanceof Error ? e.message : 'Unknown error';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			save();
		}
		if (e.key === 'Escape') close();
		if (e.key === 'Tab') {
			e.preventDefault();
			const el = e.target as HTMLTextAreaElement;
			const start = el.selectionStart;
			const end = el.selectionEnd;
			content = content.substring(0, start) + '  ' + content.substring(end);
			setTimeout(() => {
				el.selectionStart = el.selectionEnd = start + 2;
			}, 0);
		}
	}
</script>

{#if devModeState.active}
	<button class="edit-fab" onclick={open} aria-label="Edit this page" title="Edit page (Dev Mode)">
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
		</svg>
		Edit Page
	</button>

	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="editor-overlay" transition:fade={{ duration: 200 }} onclick={(e) => { if (e.target === e.currentTarget) close(); }}>
			<div class="editor-panel" transition:fly={{ y: 60, duration: 300 }}>

				<!-- Header -->
				<div class="editor-header">
					<div class="editor-title">
						<span class="editor-badge">DEV</span>
						<span class="editor-filename">{filePath}</span>
					</div>
					<div class="tab-row">
						<button class="tab-btn" class:active={activeTab === 'editor'} onclick={() => (activeTab = 'editor')}>
							✏️ Markdown
						</button>
						<button class="tab-btn" class:active={activeTab === 'tags'} onclick={() => (activeTab = 'tags')}>
							🏷 Tags
							{#if currentTags.length > 0}
								<span class="tag-count">{currentTags.length}</span>
							{/if}
						</button>
					</div>
					<div class="editor-actions">
						{#if status === 'loading'}
							<span class="status-msg loading">Loading…</span>
						{:else if status === 'saving'}
							<span class="status-msg saving"><span class="spinner"></span>{statusMsg}</span>
						{:else if status === 'success'}
							<span class="status-msg success">✓ {statusMsg}</span>
						{:else if status === 'error'}
							<span class="status-msg error">✗ {statusMsg}</span>
						{/if}
						<button class="save-btn" onclick={save} disabled={status === 'saving' || status === 'loading'}>
							{status === 'saving' ? 'Saving…' : 'Save & Deploy'}
							<kbd>⌘S</kbd>
						</button>
						<button class="close-btn" onclick={close} aria-label="Close editor">✕</button>
					</div>
				</div>

				<!-- Body -->
				<div class="editor-body">
					{#if status === 'loading'}
						<div class="editor-loading">
							<span class="spinner large"></span>
							<p>Fetching file from GitHub…</p>
						</div>
					{:else if activeTab === 'editor'}
						<textarea
							class="editor-textarea"
							bind:this={editorEl}
							bind:value={content}
							onkeydown={handleKeydown}
							spellcheck={false}
							autocomplete="off"
							autocapitalize="off"
							placeholder="Markdown content…"
						></textarea>
					{:else}
						<!-- Tags panel -->
						<div class="tags-panel">
							<div class="tags-section">
								<h4>Current Tags</h4>
								<div class="current-tags">
									{#if currentTags.length === 0}
										<span class="no-tags">No tags yet — add some below</span>
									{/if}
									{#each currentTags as tag}
										<span class="tag-chip">
											{tag}
											<button class="tag-remove" onclick={() => removeTag(tag)} aria-label="Remove {tag}">×</button>
										</span>
									{/each}
								</div>
							</div>

							<div class="tags-section">
								<h4>Add Tag</h4>
								<div class="tag-search-row">
									<input
										class="tag-search"
										type="text"
										bind:value={tagSearch}
										placeholder="Search or type custom tag…"
										onkeydown={(e) => { if (e.key === 'Enter') addCustomTag(); }}
									/>
									<button class="tag-add-btn" onclick={addCustomTag} disabled={!tagSearch.trim()}>
										+ Add
									</button>
								</div>
							</div>

							<div class="tags-section">
								<h4>Presets</h4>
								<div class="preset-tags">
									{#each filteredPresets as preset}
										{@const active = currentTags.some(t => t.toLowerCase() === preset.label.toLowerCase())}
										<button
											class="preset-tag"
											class:active
											style="--tag-color: {preset.color}"
											onclick={() => toggleTag(preset.label)}
										>
											{#if active}<span class="check">✓</span>{/if}
											{preset.label}
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="editor-footer">
					<span>Markdown · Tab = 2 spaces · Esc to close · ⌘S to save</span>
					<span>Repo: <code>{GITHUB_OWNER}/{GITHUB_REPO}</code></span>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	.edit-fab {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.55rem 1.25rem;
		color: var(--text-secondary);
		font-family: var(--font-sans);
		font-size: 0.82rem;
		font-weight: 500;
		cursor: pointer;
		z-index: 900;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.edit-fab:hover {
		background: var(--bg-card-hover, var(--bg-secondary));
		border-color: var(--accent-cyan);
		color: var(--text-primary);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), var(--glow-cyan);
		transform: translateX(-50%) translateY(-2px);
	}

	.editor-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.72);
		backdrop-filter: blur(4px);
		z-index: 2000;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}

	.editor-panel {
		width: 100%;
		max-width: 1100px;
		height: 78vh;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 -16px 48px rgba(0, 0, 0, 0.5);
	}

	.editor-header {
		display: flex;
		align-items: center;
		padding: 0.65rem 1.25rem;
		background: var(--bg-card);
		border-bottom: 1px solid var(--border);
		gap: 1rem;
		flex-shrink: 0;
		flex-wrap: wrap;
	}

	.editor-title {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
	}

	.editor-badge {
		background: var(--accent-cyan);
		color: #000;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
		padding: 0.18rem 0.45rem;
		border-radius: var(--radius-sm);
	}

	.editor-filename {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-muted);
		max-width: 280px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tab-row {
		display: flex;
		gap: 0.25rem;
		flex: 1;
	}

	.tab-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		background: none;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		padding: 0.3rem 0.75rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.15s;
	}

	.tab-btn:hover { color: var(--text-primary); }

	.tab-btn.active {
		color: var(--text-primary);
		background: var(--bg-secondary);
		border-color: var(--border);
	}

	.tag-count {
		background: var(--accent-cyan);
		color: #000;
		font-size: 0.65rem;
		font-weight: 700;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
	}

	.editor-actions {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin-left: auto;
		flex-shrink: 0;
	}

	.status-msg {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		max-width: 260px;
	}
	.status-msg.loading { color: var(--text-muted); }
	.status-msg.saving  { color: var(--accent-cyan); }
	.status-msg.success { color: var(--accent-green); }
	.status-msg.error   { color: #f87171; }

	.spinner {
		display: inline-block;
		width: 10px;
		height: 10px;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		flex-shrink: 0;
	}
	.spinner.large { width: 30px; height: 30px; border-width: 3px; color: var(--accent-cyan); }

	@keyframes spin { to { transform: rotate(360deg); } }

	.save-btn {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		background: var(--accent-green);
		color: #151515;
		border: none;
		border-radius: var(--radius-sm);
		padding: 0.42rem 0.9rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.18s;
		white-space: nowrap;
	}
	.save-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
	.save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
	.save-btn kbd {
		background: rgba(0,0,0,0.18);
		padding: 0.08rem 0.32rem;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.close-btn {
		background: none;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		color: var(--text-muted);
		font-size: 1rem;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s;
	}
	.close-btn:hover { color: var(--text-primary); border-color: var(--text-primary); }

	.editor-body {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.editor-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 1rem;
		color: var(--text-muted);
		font-family: var(--font-sans);
	}

	.editor-textarea {
		flex: 1;
		width: 100%;
		height: 100%;
		background: var(--bg-code, #111);
		color: var(--text-body);
		font-family: var(--font-mono);
		font-size: 0.86rem;
		line-height: 1.75;
		border: none;
		outline: none;
		resize: none;
		padding: 1.5rem;
		tab-size: 2;
		caret-color: var(--accent-cyan);
	}

	/* Tags panel */
	.tags-panel {
		padding: 1.5rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		height: 100%;
	}

	.tags-section h4 {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}

	.current-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		min-height: 32px;
		align-items: center;
	}

	.no-tags {
		font-size: 0.82rem;
		color: var(--text-muted);
		font-style: italic;
	}

	.tag-chip {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		background: rgba(116, 215, 237, 0.1);
		border: 1px solid rgba(116, 215, 237, 0.3);
		border-radius: 999px;
		padding: 0.25rem 0.5rem 0.25rem 0.75rem;
		font-size: 0.8rem;
		color: var(--text-primary);
		font-family: var(--font-sans);
	}

	.tag-remove {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		padding: 0;
		display: flex;
		align-items: center;
		transition: color 0.15s;
	}
	.tag-remove:hover { color: #f87171; }

	.tag-search-row {
		display: flex;
		gap: 0.5rem;
	}

	.tag-search {
		flex: 1;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.5rem 0.85rem;
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--text-primary);
		outline: none;
		transition: border-color 0.15s;
	}
	.tag-search:focus { border-color: var(--accent-cyan); }

	.tag-add-btn {
		background: var(--accent-cyan);
		color: #000;
		border: none;
		border-radius: var(--radius-sm);
		padding: 0.5rem 1rem;
		font-family: var(--font-sans);
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.15s;
		white-space: nowrap;
	}
	.tag-add-btn:hover:not(:disabled) { filter: brightness(1.1); }
	.tag-add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

	.preset-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.preset-tag {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.3rem 0.85rem;
		font-family: var(--font-sans);
		font-size: 0.82rem;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s;
	}
	.preset-tag:hover {
		border-color: var(--tag-color);
		color: var(--tag-color);
	}
	.preset-tag.active {
		background: color-mix(in srgb, var(--tag-color) 15%, transparent);
		border-color: var(--tag-color);
		color: var(--tag-color);
	}
	.preset-tag .check { font-size: 0.7rem; }

	.editor-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.38rem 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
		background: var(--bg-card);
		border-top: 1px solid var(--border);
		flex-shrink: 0;
	}
	.editor-footer code { color: var(--accent-cyan); }

	@media (max-width: 640px) {
		.editor-panel { height: 92vh; }
		.editor-filename { display: none; }
	}
</style>
