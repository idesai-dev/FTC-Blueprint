<script lang="ts">
	import { getAllPosts } from '$lib/utils/posts';
	import type { Post } from '$lib/utils/posts';
	import { onMount, tick } from 'svelte';
	import { fade, slide, scale } from 'svelte/transition';

	interface Message {
		role: 'user' | 'assistant';
		content: string;
		links?: { title: string; href: string }[];
	}

	let isOpen = $state(false);
	let query = $state('');
	let isThinking = $state(false);
	let messages = $state<Message[]>([
		{ 
			role: 'assistant', 
			content: "Hi! I'm DocBot. I can help you find hardware guides, software prints, or outreach tips. What are you looking for?" 
		}
	]);

	let posts = $state<Post[]>([]);
	let chatContainer: HTMLElement | null = $state(null);

	onMount(async () => {
		posts = await getAllPosts();
	});

	async function scrollToEnd() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
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
		messages.push({ role: 'user', content: userQuery });
		query = '';
		isThinking = true;
		scrollToEnd();

		// Simulate "AI" thinking
		setTimeout(async () => {
			const results = posts.filter(p => {
				const q = userQuery.toLowerCase();
				return (
					p.meta.title.toLowerCase().includes(q) ||
					(p.meta.description || '').toLowerCase().includes(q) ||
					(p.meta.tags || []).some(t => t.toLowerCase().includes(q))
				);
			}).slice(0, 3);

			let response: Message = { role: 'assistant', content: '' };

			if (results.length > 0) {
				response.content = `I found some helpful guides for "${userQuery}":`;
				response.links = results.map(r => ({
					title: r.meta.title,
					href: `/software/${r.slug}` // Defaulting to software, though we should handle others
				}));
			} else {
				response.content = "I couldn't find a specific guide for that, but you can try searching for 'Mecanum', 'Pedro Pathing', or 'Wiring'. Or check the Suggest page!";
			}

			messages.push(response);
			isThinking = false;
			scrollToEnd();
		}, 800);
	}

	function toggle() {
		isOpen = !isOpen;
		if (isOpen) scrollToEnd();
	}
</script>

<div class="docbot-wrapper">
	<!-- Chat Window -->
	{#if isOpen}
		<div class="chat-window" transition:scale={{ duration: 300, start: 0.9, opacity: 0 }}>
			<header class="chat-header">
				<div class="bot-info">
					<span class="bot-avatar">⬡</span>
					<div>
						<h3>DocBot</h3>
						<span class="status">Online & Ready</span>
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
										<a href={link.href} class="doc-link" onclick={toggle}>
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

			<form class="chat-input" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<input 
					type="text" 
					placeholder="Ask DocBot..." 
					bind:value={query}
					onkeydown={handleKeydown}
				/>
				<button type="submit" disabled={!query.trim() || isThinking}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
					</svg>
				</button>
			</form>
		</div>
	{/if}

	<!-- FAB Button -->
	<button 
		class="bot-trigger" 
		class:active={isOpen}
		onclick={toggle}
		aria-label="Open documentation assistant"
	>
		{#if !isOpen}
			<span class="bot-icon" transition:fade>🤖</span>
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

	/* FAB Button */
	.bot-trigger {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--gradient-accent);
		border: none;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), var(--glow-cyan);
		transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.bot-trigger:hover {
		transform: scale(1.1);
	}

	.bot-trigger.active {
		background: var(--bg-card);
		color: var(--text-primary);
		border: 1px solid var(--border);
	}

	/* Chat Window */
	.chat-window {
		position: absolute;
		bottom: 4.5rem;
		right: 0;
		width: 350px;
		max-width: 90vw;
		height: 480px;
		max-height: 70vh;
		background: rgba(28, 28, 28, 0.85);
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

	/* Messages */
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

	.message.assistant { align-self: flex-start; }
	.message.user { align-self: flex-end; }

	.bubble {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		line-height: 1.5;
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

	/* Thinking Dots */
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

	.thinking span:nth-child(2) { animation-delay: 0.2s; }
	.thinking span:nth-child(3) { animation-delay: 0.4s; }

	@keyframes dot-pulse {
		0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
		40% { transform: scale(1); opacity: 1; }
	}

	/* Input Area */
	.chat-input {
		padding: 1rem;
		background: rgba(21, 21, 21, 0.5);
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
