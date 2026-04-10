<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import type { Post } from '$lib/utils/posts';
	import { onMount } from 'svelte';
	import { devModeState, initDevMode } from '$lib/stores/devMode.svelte';

	let { data }: { data: { recentPosts: Post[], completedCount: number } } = $props();

	onMount(() => {
		initDevMode();
	});

	const visiblePosts = $derived(
		data.recentPosts
			.filter((p) => {
				if (devModeState.active) return true;
				const tags = (p.meta.tags || []).map((t) =>
					typeof t === 'string' ? t.toLowerCase().trim() : ''
				);
				return tags.includes('completed') || tags.includes('coming soon');
			})
			.slice(0, 3)
	);

	let typedText = $state('');
	let showCursor = $state(true);

	onMount(() => {
		// --- Typing animation ---
		const typeSequence = async () => {
			const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
			const str1 = 'made simple.';
			const str2 = 'the right way.';

			await sleep(500);

			for (let i = 0; i <= str1.length; i++) {
				typedText = str1.substring(0, i);
				await sleep(Math.random() * 50 + 50);
			}

			await sleep(1500);

			for (let i = str1.length; i >= 0; i--) {
				typedText = str1.substring(0, i);
				await sleep(40);
			}

			await sleep(500);

			for (let i = 0; i <= str2.length; i++) {
				typedText = str2.substring(0, i);
				await sleep(Math.random() * 50 + 50);
			}

			await sleep(1500);
		};

		typeSequence();

		// --- Cursor glow effect ---
		// A large soft radial-gradient div that lazily follows the cursor.
		// The lag creates the "trail" — no dots, just a smooth wash of color.
		const glow = document.getElementById('cursor-glow') as HTMLElement;
		if (!glow) return;

		let targetX = -600;
		let targetY = -600;
		let currentX = -600;
		let currentY = -600;
		const EASE = 0.07; // lower = more lag = longer visible trail

		const onMouseMove = (e: MouseEvent) => {
			targetX = e.clientX;
			targetY = e.clientY;
		};
		window.addEventListener('mousemove', onMouseMove);

		let raf: number;
		const render = () => {
			// Lerp toward target — this is what makes the trail smooth
			currentX += (targetX - currentX) * EASE;
			currentY += (targetY - currentY) * EASE;

			glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
			raf = requestAnimationFrame(render);
		};
		render();

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			cancelAnimationFrame(raf);
		};
	});
</script>

<svelte:head>
	<title>Blueprint — FTC Made Easy</title>
	<meta name="description" content="Blueprint is an FTC guide made easy" />
</svelte:head>

<!-- Cursor glow — fixed, pointer-events: none, lazily follows cursor -->
<div id="cursor-glow" aria-hidden="true"></div>

<!-- Hero -->
<section class="hero">
	<div class="hero-bg" aria-hidden="true">

		<!-- Hexagon decoration: left half peeks from right edge -->
		<div class="hex-wrap" aria-hidden="true">
			<svg class="hex-svg" viewBox="0 0 760 760" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stop-color="#74D7ED" />
						<stop offset="100%" stop-color="#7EFFA0" />
					</linearGradient>
					<!-- Soft glow filter -->
					<filter id="hex-glow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<!--
                    Flat-top hexagon, center (380,380), R=310
                    Points: (690,380) (535,649) (225,649) (70,380) (225,111) (535,111)
                    stroke-width=58 with stroke-linejoin=round gives the chunky rounded look
                -->
				<polygon
					points="690,380 535,649 225,649 70,380 225,111 535,111"
					fill="none"
					stroke="url(#hex-grad)"
					stroke-width="58"
					stroke-linejoin="round"
					filter="url(#hex-glow)"
					class="hex-poly"
				/>
			</svg>
		</div>
	</div>

	<div class="container hero-content animate-fade-up">
		<div class="eyebrow">
			<span class="tag tag--cyan">{__APP_VERSION__}</span>
			{#if devModeState.active}
				<span class="tag tag--green" style="font-family: var(--font-mono); font-size: 0.7rem;">
					Last Deployment: {__BUILD_TIME__}
				</span>
			{/if}
		</div>
		<h1 class="gradient-text">
			FTC<br />
			{typedText}{#if showCursor}<span class="cursor"></span>{/if}
		</h1>
		<p class="hero-desc">
			The complete blueprint for FTC — coding, hardware, and strategy, all made simple.
		</p>
		<div class="hero-cta">
			<a href="/software" class="btn btn-primary" id="hero-read-btn">Read the prints</a>
			<a href="/about" class="btn btn-ghost" id="hero-about-btn">Chuds</a>
		</div>
	</div>
</section>

<!-- Recent Posts -->
{#if visiblePosts.length > 0}
	<section class="recent section">
		<div class="container">
			<div class="section-header stagger">
				<div class="section-label animate-fade-up">
					<span class="tag tag--green">Recent</span>
				</div>
				<h2 class="animate-fade-up">Latest articles</h2>
			</div>

			<div class="post-grid stagger">
				{#each visiblePosts as post}
					<BlogCard {post} />
				{/each}
			</div>

			{#if visiblePosts.length >= 3}
				<div class="view-all animate-fade-up">
					<a href="/software" class="btn btn-ghost" id="home-view-all-btn">View all prints →</a>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	/* Cursor glow */
	#cursor-glow {
		position: fixed;
		top: 0;
		left: 0;
		width: 240px;
		height: 240px;
		margin-left: -120px;
		margin-top: -120px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		background: radial-gradient(
			circle,
			rgba(116, 215, 237, 0.05) 0%,
			rgba(126, 255, 160, 0.02) 45%,
			transparent 70%
		);
		will-change: transform;
	}

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

	/* Hexagon decoration */
	.hex-wrap {
		position: absolute;
		/* Position so roughly the left half of the hex is visible */
		right: -380px;
		top: 50%;
		transform: translateY(-50%);
		width: 760px;
		height: 760px;
		pointer-events: none;
		z-index: 0;
		/* Fade left edge so it blends into the page naturally */
		-webkit-mask-image: linear-gradient(to right, transparent 0%, black 18%, black 100%);
		mask-image: linear-gradient(to right, transparent 0%, black 18%, black 100%);
	}

	.hex-svg {
		width: 100%;
		height: 100%;
		opacity: 0.85;
		animation: hex-drift 8s ease-in-out infinite;
		will-change: transform;
	}

	.hex-poly {
		/* Subtle paint-on entrance */
		stroke-dasharray: 2200;
		stroke-dashoffset: 2200;
		animation: hex-draw 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
	}

	@keyframes hex-draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes hex-drift {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-12px);
		}
	}

	/* Hero content */
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
		display: inline-block;
		width: 3px;
		height: 1.1em;
		background-color: var(--text-primary);
		vertical-align: text-bottom;
		margin-left: 4px;
		animation: blink 1s step-end infinite;
		border-radius: 1px;

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
