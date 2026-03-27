<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import type { Post } from '$lib/utils/posts';
	import { onMount } from 'svelte';

	let { data }: { data: { recentPosts: Post[] } } = $props();

	let typedText = $state('');
	let showCursor = $state(true);

	onMount(() => {
		const typeSequence = async () => {
			const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
			const str1 = 'made simple.';
			const str2 = 'the right way.';

			await sleep(500);

			// Type str1
			for (let i = 0; i <= str1.length; i++) {
				typedText = str1.substring(0, i);
				await sleep(Math.random() * 50 + 50);
			}

			// Pause before deleting
			await sleep(1500);

			// Delete str1
			for (let i = str1.length; i >= 0; i--) {
				typedText = str1.substring(0, i);
				await sleep(40);
			}

			await sleep(500);

			// Type str2
			for (let i = 0; i <= str2.length; i++) {
				typedText = str2.substring(0, i);
				await sleep(Math.random() * 50 + 50);
			}

			await sleep(1500); // Wait briefly before removing cursor completely
			showCursor = false;
		};

		typeSequence();
	});
</script>

<svelte:head>
<<<<<<< HEAD
	<title>Blueprint — FTC Made Easy</title>
=======
	<title>The Complete Blueprint</title>
>>>>>>> 4f10d48ee04e585d7215284933b71c616c5b4df2
	<meta name="description" content="Blueprint is an FTC guide made easy" />
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="hero-bg" aria-hidden="true">
		<div class="orb orb-1"></div>
		<div class="orb orb-2"></div>
		<div class="grid-overlay"></div>
	</div>

	<div class="container hero-content animate-fade-up">
		<div class="eyebrow">
			<span class="tag tag--cyan">Est. 2026</span>
		</div>
		<h1>
			FTC<br />
			<span class="gradient-text">{typedText}</span>{#if showCursor}<span class="cursor">|</span>{/if}
		</h1>
		<p class="hero-desc">
			The complete blueprint for FTC — coding, hardware, and strategy, all made simple.
		</p>
		<div class="hero-cta">
			<a href="/articles" class="btn btn-primary" id="hero-read-btn">Read the articles</a>
<<<<<<< HEAD
			<a href="/about" class="btn btn-ghost" id="hero-about-btn">About</a>
=======
			<a href="/about" class="btn btn-ghost" id="hero-about-btn">The Chuds</a>
>>>>>>> 4f10d48ee04e585d7215284933b71c616c5b4df2
		</div>
	</div>
</section>

<!-- Recent Posts -->
{#if data.recentPosts.length > 0}
	<section class="recent section">
		<div class="container">
			<div class="section-header stagger">
				<div class="section-label animate-fade-up">
					<span class="tag tag--green">Recent</span>
				</div>
				<h2 class="animate-fade-up">Latest articles</h2>
			</div>

			<div class="post-grid stagger">
				{#each data.recentPosts as post}
					<BlogCard {post} />
				{/each}
			</div>

			{#if data.recentPosts.length >= 3}
				<div class="view-all animate-fade-up">
<<<<<<< HEAD
					<a href="/articles" class="btn btn-ghost" id="home-view-all-btn">View all articles →</a>
=======
					<a href="/articles" class="btn btn-ghost" id="home-view-all-btn">View all posts →</a>
>>>>>>> 4f10d48ee04e585d7215284933b71c616c5b4df2
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	/* Hero */
	.hero {
		position: relative;
		min-height: calc(100vh - var(--header-height));
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		animation: pulse-glow 6s ease-in-out infinite;
	}

	.orb-1 {
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(116, 215, 237, 0.12) 0%, transparent 70%);
		top: -100px;
		right: -100px;
	}

	.orb-2 {
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(126, 255, 160, 0.08) 0%, transparent 70%);
		bottom: -50px;
		left: 5%;
		animation-delay: 3s;
	}

	.grid-overlay {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(116, 215, 237, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(116, 215, 237, 0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(0, 0, 0, 0.5) 20%,
			rgba(0, 0, 0, 0.5) 80%,
			transparent 100%
		);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		padding: 6rem 1.5rem 5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.eyebrow {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	h1 {
		max-width: 600px;
	}

	.cursor {
		font-weight: 300;
		color: var(--text-primary);
		animation: blink 1s step-end infinite;
		display: inline-block;
		margin-left: 4px;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	.hero-desc {
		max-width: 520px;
		font-size: 1.1rem;
		color: var(--text-secondary);
		line-height: 1.7;
	}

	.hero-cta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.65em 1.5em;
		border-radius: var(--radius-md);
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		border: 1px solid transparent;
		transition:
			background var(--transition-base),
			border-color var(--transition-base),
			color var(--transition-base),
			box-shadow var(--transition-base),
			transform var(--transition-fast);
	}

	.btn:hover {
		transform: translateY(-1px);
	}
	.btn:active {
		transform: translateY(0);
	}

	.btn-primary {
		background: var(--text-primary);
		color: var(--bg);
		border-color: var(--text-primary);
	}

	.btn-primary:hover {
		background: var(--accent-green);
		border-color: var(--accent-green);
		color: var(--bg);
		box-shadow: var(--glow-green);
	}

	.btn-ghost {
		background: transparent;
		color: var(--text-secondary);
		border-color: var(--border);
	}

	.btn-ghost:hover {
		background: rgba(116, 215, 237, 0.06);
		border-color: var(--text-primary);
		color: var(--text-primary);
	}

	/* Recent section */
	.section {
		padding: 5rem 0;
	}

	.section-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2.5rem;
	}

	.section-label {
	}

	.post-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.25rem;
	}

	.view-all {
		display: flex;
		justify-content: center;
		margin-top: 2.5rem;
	}
</style>
