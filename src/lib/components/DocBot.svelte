<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	interface Message {
		role: 'user' | 'assistant';
		content: string;
		links?: { title: string; href: string }[];
	}

	type DocItem = {
		title: string;
		href: string;
		content: string;
		excerpt: string;
		tags: string[];
	};

	let isOpen = $state(false);
	let query = $state('');
	let isThinking = $state(false);
	let messages = $state<Message[]>([
		{
			role: 'assistant',
			content:
				"Hi! I'm DocBot. Ask me anything about Blueprint, FTC software, robot tuning, wiring, odometry, or pathing."
		}
	]);

	let chatContainer: HTMLElement | null = $state(null);
	let docs = $state<DocItem[]>([]);
	const CACHE_KEY = 'docbot_blueprint_data';
	const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

	function normalize(text: string) {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
	}

	function snippet(text: string, limit = 220) {
		const clean = text.replace(/\s+/g, ' ').trim();
		return clean.length > limit ? clean.slice(0, limit).trim() + '...' : clean;
	}

	async function loadBlueprintDocs(force = false) {
		// 1. Try Cache First
		if (!force) {
			const cached = localStorage.getItem(CACHE_KEY);
			if (cached) {
				try {
					const { timestamp, data } = JSON.parse(cached);
					if (Date.now() - timestamp < CACHE_TTL) {
						docs = data;
						return;
					}
				} catch (e) {
					localStorage.removeItem(CACHE_KEY);
				}
			}
		}

		console.log('DocBot: Fetching fresh documentation data...');
		const sources = ['/software', '/hardware', '/outreach'];
		const collected: DocItem[] = [];

		const parseHtml = async (href: string) => {
			try {
				const res = await fetch(href);
				if (!res.ok) return;

				const html = await res.text();
				const doc = new DOMParser().parseFromString(html, 'text/html');
				const title =
					doc.querySelector('h1')?.textContent?.trim() ||
					doc.querySelector('title')?.textContent?.trim() ||
					href;

				const text = Array.from(doc.querySelectorAll('p, li, h2, h3, h4'))
					.map((el) => el.textContent?.trim() || '')
					.filter(Boolean)
					.join(' ')
					.slice(0, 5000); // Limit context size for performance

				collected.push({
					title,
					href,
					content: text,
					excerpt: snippet(text),
					tags: []
				});
			} catch {}
		};

		// Batch processing to avoid network congestion
		const processBatch = async (links: string[]) => {
			const batchSize = 5;
			for (let i = 0; i < links.length; i += batchSize) {
				const batch = links.slice(i, i + batchSize);
				await Promise.all(batch.map(link => parseHtml(link)));
				// Yield to main thread
				await new Promise(r => setTimeout(r, 0));
			}
		};

		for (const src of sources) {
			try {
				const res = await fetch(src);
				if (!res.ok) continue;
				const html = await res.text();
				const doc = new DOMParser().parseFromString(html, 'text/html');

				const links = Array.from(doc.querySelectorAll('a[href]'))
					.map((a) => (a as HTMLAnchorElement).getAttribute('href') || '')
					.filter((h) => h.startsWith('/') && h.length > 2);

				const unique = [...new Set(links)];
				
				// Limit depth for performance (20 pages per section)
				await processBatch(unique.slice(0, 20));
			} catch {}
		}

		docs = collected;
		localStorage.setItem(CACHE_KEY, JSON.stringify({
			timestamp: Date.now(),
			data: collected
		}));
	}

	function scoreItem(item: DocItem, q: string) {
		const text = normalize(
			item.title + ' ' + item.content + ' ' + item.excerpt + ' ' + item.tags.join(' ')
		);
		const qWords = normalize(q).split(' ').filter(Boolean);
		let score = 0;

		for (const word of qWords) {
			if (item.title.toLowerCase().includes(word)) score += 6;
			if (item.excerpt.toLowerCase().includes(word)) score += 3;
			if (text.includes(word)) score += 2;
		}

		if (text.includes(normalize(q))) score += 12;
		return score;
	}

	function searchDocs(q: string) {
		return docs
			.map((item) => ({ item, score: scoreItem(item, q) }))
			.filter((x) => x.score > 0)
			.sort((a, b) => b.score - a.score)
			.filter((val, index, self) => index === self.findIndex((t) => t.item.href === val.item.href))
			.slice(0, 4)
			.map((x) => x.item);
	}

	function fallbackAnswer(q: string): Message {
		const n = normalize(q);

		const ftcTopics: { match: string[]; content: string }[] = [
			{
				match: ['pid', 'pidf', 'tuning', 'overshoot'],
				content:
					'For PID tuning, start with P until the robot responds quickly, then add D to reduce overshoot, and only add I if you need to eliminate small steady-state error.'
			},
			{
				match: ['odometry', 'localization', 'pose'],
				content:
					'For odometry, check wheel calibration, encoder direction, track width, and whether your pose estimate matches the drivetrain geometry.'
			},
			{
				match: ['mecanum', 'drive', 'wheel'],
				content:
					'For mecanum drive, make sure your wheel vectors are normalized and that each motor direction matches the physical orientation of the drivetrain.'
			},
			{
				match: ['path', 'pedro', 'trajectory', 'pathing'],
				content:
					'For pathing, verify your waypoint order, heading targets, and that your robot starts from the same pose used in the planner.'
			},
			{
				match: ['telemetry', 'debug', 'log'],
				content:
					'Good debugging usually starts with telemetry for encoder values, target values, heading error, and controller output.'
			}
		];

		const match = ftcTopics.find((t) => t.match.some((m) => n.includes(m)));
		if (match) return { role: 'assistant', content: match.content };

		return {
			role: 'assistant',
			content:
				'I did not find an exact Blueprint page for that, but I can still help if you ask about PID, odometry, drivetrain code, pathing, FTC hardware, or a specific page on ftcblueprint.com'
		};
	}

	async function scrollToEnd() {
		await tick();
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	async function handleSubmit() {
		if (!query.trim() || isThinking) return;

		const userQuery = query.trim();
		messages = [...messages, { role: 'user', content: userQuery }];
		query = '';
		isThinking = true;
		await scrollToEnd();

		try {
			const results = searchDocs(userQuery);
			const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

			if (!apiKey) {
				// Keep the old fallback if no API key is provided
				let response: Message;
				if (results.length > 0) {
					response = {
						role: 'assistant',
						content: `(API KEY MISSING - Add VITE_GEMINI_API_KEY to .env to use AI) I found these relevant pages:`,
						links: results.map((r) => ({ title: r.title, href: r.href }))
					};
				} else {
					response = {
						role: 'assistant',
						content: `(API KEY MISSING) ${fallbackAnswer(userQuery).content}`
					};
				}
				messages = [...messages, response];
			} else {
				let contextText = results
					.map((d) => `TITLE: ${d.title}\nCONTENT:\n${d.content}`)
					.join('\n\n');
				let systemStr = `You are DocBot, a helpful AI assistant for Blueprint FTC (a FIRST Tech Challenge software/hardware guide).
Answer the user's questions based on the following context pulled dynamically from our website. 
If the context doesn't have the answer, draw from your knowledge of FTC. Be concise, friendly, and write in PLAIN TEXT without markdown bold/italics (no asterisks).
Keep your responses as SHORT and concise as possible.
IMPORTANT: Do NOT invent, assume, or suggest guides/post titles that are not explicitly present in the provided CONTEXT.

CONTEXT:
${contextText}
`;
				const geminiMessages = messages
					.filter((m) => m.role === 'user' || m.role === 'assistant')
					.map((m) => ({
						role: m.role === 'assistant' ? 'model' : 'user',
						parts: [{ text: m.content }]
					}));

				const req = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							systemInstruction: { parts: [{ text: systemStr }] },
							contents: geminiMessages
						})
					}
				);

				const data = await req.json();
				if (data.error) {
					messages = [
						...messages,
						{ role: 'assistant', content: `Error from AI: ${data.error.message}` }
					];
				} else {
					const textContent = data.candidates[0].content.parts[0].text;
					const msg: Message = { role: 'assistant', content: textContent };
					if (results.length > 0) {
						msg.links = results.map((r) => ({ title: r.title, href: r.href }));
					}
					messages = [...messages, msg];
				}
			}
		} catch (e) {
			messages = [...messages, { role: 'assistant', content: `Connection error: ${e}` }];
		}

		isThinking = false;
		await scrollToEnd();
	}

	function toggle(e?: Event) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		isOpen = !isOpen;
		if (isOpen) scrollToEnd();
	}

	onMount(async () => {
		await loadBlueprintDocs();
	});
</script>

<div class="docbot-wrapper">
	{#if isOpen}
		<div class="chat-window" transition:scale={{ duration: 300, start: 0.9, opacity: 0 }}>
			<header class="chat-header">
				<div class="bot-info">
					<div class="bot-avatar">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 2l9 4.5v11L12 22l-9-4.5v-11z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
					</div>
					<div>
						<h3>DocBot</h3>
						<span class="status">Site-aware helper</span>
					</div>
				</div>
				<button class="close-btn" onclick={toggle}>×</button>
			</header>

			<div class="chat-messages" bind:this={chatContainer}>
				{#each messages as msg}
					<div class="message {msg.role}">
						<div class="bubble">
							{msg.content}
							{#if msg.links}
								<div class="links">
									{#each msg.links as link}
										<a href={link.href} class="doc-link" onclick={() => (isOpen = false)}>
											{link.title} →
										</a>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}

				{#if isThinking}
					<div class="message assistant">
						<div class="bubble thinking">
							<span></span><span></span><span></span>
						</div>
					</div>
				{/if}
			</div>

			<form
				class="chat-input"
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<input
					type="text"
					placeholder="Ask DocBot..."
					bind:value={query}
					onkeydown={handleKeydown}
				/>
				<button type="submit" disabled={!query.trim() || isThinking} aria-label="Send message">
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
						<path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
					</svg>
				</button>
			</form>
		</div>
	{/if}

	<button
		class="bot-trigger"
		class:active={isOpen}
		onclick={toggle}
		aria-label="Open documentation assistant"
	>
		{#if !isOpen}
			<div class="bot-icon-wrap" transition:scale={{ duration: 300, start: 0.5 }}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 2l9 4.5v11L12 22l-9-4.5v-11z" />
					<circle cx="12" cy="12" r="3" />
					<path d="M12 9v1" />
					<path d="M12 14v1" />
				</svg>
				<span class="bot-pulse"></span>
			</div>
		{:else}
			<span class="bot-icon" transition:fade>↓</span>
		{/if}
	</button>
</div>

<style>
	.docbot-wrapper {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 1000;
		font-family: var(--font-sans);
	}

	.bot-trigger {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: var(--bg-card);
		border: 1px solid var(--border);
		color: var(--text-primary);
		font-size: 1.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.3),
			var(--glow-cyan);
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		position: relative;
	}

	.bot-trigger:hover {
		transform: scale(1.05) translateY(-4px);
		border-color: var(--text-primary);
		background: var(--bg-card-hover);
	}

	.bot-trigger.active {
		background: var(--bg-card);
		color: var(--text-primary);
		border: 1px solid var(--border);
		transform: rotate(180deg);
	}

	.bot-icon-wrap {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--accent-cyan);
	}

	.bot-pulse {
		position: absolute;
		inset: -8px;
		border: 2px solid var(--accent-cyan);
		border-radius: 50%;
		opacity: 0;
		animation: pulse-ring 2s infinite;
	}

	@keyframes pulse-ring {
		0% {
			transform: scale(0.5);
			opacity: 0;
		}
		50% {
			opacity: 0.3;
		}
		100% {
			transform: scale(1.2);
			opacity: 0;
		}
	}

	.chat-window {
		position: absolute;
		bottom: 4.5rem;
		right: 0;
		width: min(440px, 92vw);
		height: 560px;
		max-height: 76vh;
		background: var(--bg-card);
		backdrop-filter: blur(20px);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transform-origin: bottom right;
	}

	.chat-header {
		padding: 1rem 1.25rem;
		background: rgba(116, 215, 237, 0.05);
		border-bottom: 1px solid var(--border-subtle);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bot-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.bot-avatar {
		width: 32px;
		height: 32px;
		background: var(--gradient-accent);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
	}

	.bot-info h3 {
		font-size: 0.95rem;
		margin: 0;
		color: var(--text-primary);
	}

	.status {
		font-size: 0.7rem;
		color: var(--accent-green);
		opacity: 0.8;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		line-height: 1;
	}

	.chat-messages {
		flex: 1;
		padding: 1.25rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		scroll-behavior: smooth;
	}

	.message {
		display: flex;
		flex-direction: column;
		max-width: 85%;
	}

	.message.assistant {
		align-self: flex-start;
	}
	.message.user {
		align-self: flex-end;
	}

	.bubble {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	.assistant .bubble {
		background: var(--bg-secondary);
		color: var(--text-body);
		border-bottom-left-radius: 2px;
		border: 1px solid var(--border-subtle);
	}

	.user .bubble {
		background: var(--accent-cyan);
		color: #151515;
		font-weight: 500;
		border-bottom-right-radius: 2px;
	}

	.links {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.doc-link {
		font-size: 0.82rem;
		color: var(--text-primary);
		text-decoration: none;
		background: rgba(116, 215, 237, 0.1);
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
		transition: background 0.2s;
	}

	.doc-link:hover {
		background: rgba(116, 215, 237, 0.2);
	}

	.thinking {
		display: flex;
		gap: 4px;
		padding: 0.8rem 1rem;
	}

	.thinking span {
		width: 6px;
		height: 6px;
		background: var(--text-muted);
		border-radius: 50%;
		animation: dot-pulse 1.4s infinite ease-in-out;
	}

	.thinking span:nth-child(2) {
		animation-delay: 0.2s;
	}
	.thinking span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes dot-pulse {
		0%,
		80%,
		100% {
			transform: scale(0.6);
			opacity: 0.4;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.chat-input {
		padding: 1rem;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border-subtle);
		display: flex;
		gap: 0.75rem;
	}

	.chat-input input {
		flex: 1;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		color: var(--text-primary);
		outline: none;
	}

	.chat-input input:focus {
		border-color: var(--text-primary);
	}

	.chat-input button {
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		padding: 0 0.25rem;
		transition: transform 0.2s;
	}

	.chat-input button:disabled {
		color: var(--text-muted);
		cursor: not-allowed;
	}

	.chat-input button:not(:disabled):hover {
		transform: scale(1.1);
	}
</style>
