<script lang="ts">
	import { formatDate, tagColor } from '$lib/utils/posts';
	import type { PostMeta } from '$lib/utils/posts';
	import type { Component } from 'svelte';
	import { setupCopyButtons } from '$lib/utils/codeCopyButton';
	import SectionSidebar from '$lib/components/sectionSidebar.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	let { data }: { data: { content: Component; meta: PostMeta } } = $props();

	$effect(() => {
		setupCopyButtons();
	});
</script>


<svelte:head>
	<title>{data.meta.title} — Blueprint</title>
	<meta name="description" content={data.meta.description || data.meta.title} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description || ''} />
</svelte:head>

<article class="post-page">
	<!-- Header -->
	<header class="post-header">
		<div class="post-header-bg" aria-hidden="true">
			<div class="header-orb"></div>
		</div>
		<div class="container">
			<a href="/software" class="back-link animate-fade-up">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M19 12H5M12 5l-7 7 7 7"/>
				</svg>
				Back to prints
			</a>

			<div class="post-meta animate-fade-up" style="animation-delay:60ms">
				<time class="date" datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
				{#if data.meta.author}
					<span class="meta-sep">·</span>
					<span class="author">{data.meta.author}</span>
				{/if}
			</div>

			<h1 class="post-title animate-fade-up" style="animation-delay:120ms">
				{data.meta.title}
			</h1>

			{#if data.meta.description}
				<p class="post-description animate-fade-up" style="animation-delay:180ms">
					{data.meta.description}
				</p>
			{/if}

			{#if data.meta.tags && data.meta.tags.length > 0}
				<div class="post-tags animate-fade-up" style="animation-delay:240ms">
					{#each data.meta.tags as tag, i}
						<span class="tag {tagColor(tag)}">{tag}</span>
					{/each}
				</div>
			{/if}

			<div class="title-rule animate-fade-up" style="animation-delay:300ms" aria-hidden="true"></div>
		</div>
	</header>

	<!-- Content -->
	<div class="post-body animate-fade-up" style="animation-delay:360ms;">
		<div class="post-body-inner">
			<LeftSidebar />
			<div class="container">
				<div class="prose">
					<data.content />
				</div>
			</div>
			<SectionSidebar contentSelector=".prose" />
		</div>
	</div>

	<!-- Footer nav -->
	<div class="post-footer animate-fade-up">
		<div class="container">
			<a href="/software" class="back-link">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M19 12H5M12 5l-7 7 7 7"/>
				</svg>
				Back to all prints
			</a>
		</div>
	</div>
</article>

<style>
	/* Header */
	.post-header {
		position: relative;
		padding: 4rem 0 3rem;
		border-bottom: 1px solid var(--border-subtle);
		background: var(--gradient-hero);
		overflow: hidden;
	}

	.post-header-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.header-orb {
		position: absolute;
		width: 600px;
		height: 300px;
		top: -150px;
		right: -100px;
		background: radial-gradient(ellipse, rgba(116, 215, 237, 0.08) 0%, transparent 60%);
		border-radius: 50%;
		filter: blur(40px);
	}

	.post-header .container {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
		text-decoration: none;
		transition: color var(--transition-fast);
		width: fit-content;
	}

	.back-link:hover { color: var(--text-primary); }

	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
	}

	.meta-sep { opacity: 0.4; }
	.author { color: var(--accent-green); }

	.post-title {
		font-size: clamp(1.8rem, 5vw, 3rem);
		line-height: 1.2;
		max-width: 780px;
	}

	.post-description {
		font-size: 1.05rem;
		color: var(--text-secondary);
		max-width: 640px;
		line-height: 1.65;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.title-rule {
		height: 2px;
		background: var(--gradient-accent);
		border-radius: 2px;
		width: 60px;
		opacity: 0.6;
		margin-top: 0.5rem;
	}

	/* Body */
	.post-body {
		padding: 3.5rem 0 4rem;
	}

	.post-body-inner {
		display: flex;
		align-items: flex-start;
		gap: 3rem;
		max-width: calc(var(--container-max) + 220px + 3rem);
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* Override container inside post-body-inner so it doesn't add extra padding */
	.post-body-inner .container {
		padding: 0;
		flex: 1;
		min-width: 0;
	}


	/* Prose styles */
	:global(.prose) {
		max-width: 720px;
		font-size: 1.05rem;
		line-height: 1.8;
		color: var(--text-body);
	}

	:global(.prose h1),
	:global(.prose h2),
	:global(.prose h3),
	:global(.prose h4) {
		font-family: var(--font-sans);
		color: var(--text-primary);
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		line-height: 1.3;
	}

	:global(.prose h2) { font-size: 1.6rem; }
	:global(.prose h3) { font-size: 1.25rem; }
	:global(.prose h4) { font-size: 1.1rem; }

	:global(.prose p) {
		margin-bottom: 1.4rem;
		color: var(--text-body);
	}

	:global(.prose a) {
		color: var(--text-primary);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: rgba(116, 215, 237, 0.4);
		transition: color var(--transition-fast), text-decoration-color var(--transition-fast);
	}

	:global(.prose a:hover) {
		color: var(--accent-green);
		text-decoration-color: var(--accent-green);
	}

	:global(.prose strong) {
		color: var(--text-primary);
		font-weight: 600;
	}

	:global(.prose em) { color: var(--text-secondary); }

	:global(.prose ul),
	:global(.prose ol) {
		margin-bottom: 1.4rem;
		padding-left: 1.5rem;
	}

	:global(.prose li) {
		margin-bottom: 0.4rem;
		color: var(--text-body);
	}

	:global(.prose li::marker) { color: var(--accent-green); }

	:global(.prose blockquote) {
		border-left: 3px solid var(--text-primary);
		margin: 1.75rem 0;
		padding: 0.75rem 1.25rem;
		background: rgba(116, 215, 237, 0.04);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		color: var(--text-secondary);
		font-style: italic;
	}

	:global(.prose code) {
		font-family: var(--font-mono);
		font-size: 0.88em;
		padding: 0.15em 0.45em;
		background: rgba(116, 215, 237, 0.08);
		border: 1px solid rgba(116, 215, 237, 0.15);
		border-radius: var(--radius-sm);
		color: var(--accent-green);
	}



	:global(.prose hr) {
		border: none;
		height: 1px;
		background: var(--gradient-accent);
		opacity: 0.2;
		margin: 2.5rem 0;
	}

	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.9rem;
	}

	:global(.prose th) {
		background: var(--bg-secondary);
		color: var(--text-primary);
		padding: 0.6rem 1rem;
		text-align: left;
		font-family: var(--font-sans);
		font-weight: 600;
		border-bottom: 2px solid var(--border);
	}

	:global(.prose td) {
		padding: 0.55rem 1rem;
		border-bottom: 1px solid var(--border-subtle);
		color: var(--text-body);
	}

	:global(.prose tr:last-child td) { border-bottom: none; }

	:global(.prose img) {
		max-width: 100%;
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		margin: 1.5rem 0;
	}

	/* Post footer */
	.post-footer {
		padding: 2rem 0 4rem;
		border-top: 1px solid var(--border-subtle);
	}
</style>
