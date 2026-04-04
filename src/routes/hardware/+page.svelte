<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import type { Post } from '$lib/utils/posts';
	import { tagColor } from '$lib/utils/posts';
	import Collapsible from '$lib/components/Collapsible.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import { devModeState, initDevMode } from '$lib/stores/devMode.svelte';
	import { onMount } from 'svelte';

	let { data }: { data: { posts: Post[] } } = $props();

	onMount(() => {
		initDevMode();
	});

	let searchQuery = $state('');
	let activeTags = $state<string[]>([]);

	const allTags = $derived([...new Set(data.posts.flatMap((p) => p.meta.tags || []))]);

	const completedSlugs = $derived(data.posts.filter((p) => (p.meta.tags || []).includes('completed')).map((p) => p.slug));
	const showLink = (href: string) => devModeState.active || completedSlugs.includes(href.split('/').pop() || '');
	const showGroup = (hrefs: string[]) => hrefs.some(showLink);

	const visiblePosts = $derived(
		data.posts.filter((p) => {
			if (devModeState.active) return true;
			const tags = (p.meta.tags || []).map((t) =>
				typeof t === 'string' ? t.toLowerCase().trim() : ''
			);
			return tags.includes('completed') || tags.includes('coming soon');
		})
	);

	const filteredPosts = $derived(
		visiblePosts.filter((p) => {
			const matchSearch =
				!searchQuery ||
				p.meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.meta.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.meta.tags || []).some(
					(t) => typeof t === 'string' && t.toLowerCase().includes(searchQuery.toLowerCase())
				);

			const matchTag =
				activeTags.length === 0 ||
				activeTags.every((t) => {
					const postTags = (p.meta.tags || []).map((tag) =>
						typeof tag === 'string' ? tag.toLowerCase().trim() : ''
					);
					const lowerT = t.toLowerCase();
					if (lowerT === 'novideo') return !postTags.includes('video');
					return postTags.includes(lowerT);
				});

			return matchSearch && matchTag;
		})
	);
</script>

<svelte:head>
	<title>Hardware — Blueprint</title>
	<meta name="description" content="All Hardware guides and prints published on Blueprint." />
</svelte:head>

<div style="display: flex; width:100%; justify-content:flex-end;">
	<div
		style="width:24vw; background-color:var(--sidebar-bg); border-right:2px solid var(--border); padding:1rem;"
	>
		<h3>Blueprint Guide</h3>
		<br />

		{#if showGroup(["/hardware/hardware-drivetrain-overview", "/hardware/hardware-mecanum-wheels", "/hardware/hardware-tank-drive"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Drivetrain
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showLink("/hardware/hardware-drivetrain-overview")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-drivetrain-overview">Drivetrain Overview</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-mecanum-wheels")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-mecanum-wheels">Mecanum Wheels</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-tank-drive")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-tank-drive">Tank Drive</a>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/hardware/hardware-linear-slides", "/hardware/hardware-arms", "/hardware/hardware-intakes", "/hardware/hardware-claws"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Mechanisms
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showLink("/hardware/hardware-linear-slides")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-linear-slides">Linear Slides</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-arms")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-arms">Arms</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-intakes")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-intakes">Intakes</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-claws")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-claws">Claws & End Effectors</a>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/hardware/hardware-control-hub", "/hardware/hardware-motors-servos-guide", "/hardware/hardware-wiring-best-practices"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Electronics
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showLink("/hardware/hardware-control-hub")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-control-hub">Control Hub</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-motors-servos-guide")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-motors-servos-guide">Motors & Servos Guide</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-wiring-best-practices")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-wiring-best-practices">Wiring Best Practices</a>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/hardware/hardware-cad-intro", "/hardware/hardware-design-principles"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			CAD & Design
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showLink("/hardware/hardware-cad-intro")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-cad-intro">CAD Introduction</a>
			</li>
			{/if}
			{#if showLink("/hardware/hardware-design-principles")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/hardware/hardware-design-principles">Design Principles</a>
			</li>
			{/if}
		</ol>
		{/if}
	</div>

	<div style="width: 100%;">
		<section class="blog-header">
			<div class="container">
				<div class="animate-fade-up">
					<span class="tag tag--cyan">All Prints</span>
				</div>
				<h1 class="animate-fade-up" style="animation-delay:60ms">The Hardware Guide</h1>
				<p class="sub animate-fade-up" style="animation-delay:120ms">
					{data.posts.length} article{data.posts.length !== 1 ? 's' : ''}
				</p>
			</div>
		</section>

		<!-- Filters -->
		<section class="filters-section">
			<div class="container animate-fade-up" style="animation-delay:160ms">
				<FilterBar category="hardware" bind:activeTags bind:searchQuery />
			</div>
		</section>

		<!-- Post list -->
		<section class="posts-section">
			<div class="container">
				{#if filteredPosts.length > 0}
					<div class="post-grid stagger">
						{#each filteredPosts as post}
							<BlogCard {post} basePath="/hardware" />
						{/each}
					</div>
				{:else}
					<div class="empty animate-fade-up">
						<p>No posts match your search.</p>
						<button
							class="btn-reset"
							onclick={() => {
								searchQuery = '';
								activeTags = [];
							}}
						>
							Clear filters
						</button>
					</div>
				{/if}
			</div>
		</section>
	</div>
</div>

<style>
	.blog-header {
		padding: 4rem 0 1.5rem;
		background: var(--gradient-hero);
		border-bottom: 1px solid var(--border-subtle);
	}
	.blog-header .container {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.sub {
		font-size: 0.85rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
	}
	.filters-section {
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--border-subtle);
		background: var(--bg-secondary);
		position: sticky;
		top: var(--header-height);
		z-index: 10;
		backdrop-filter: blur(12px);
	}
	.posts-section {
		padding: 2.5rem 0 5rem;
	}
	.post-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.25rem;
	}
	.empty {
		text-align: center;
		padding: 4rem 1rem;
		color: var(--text-muted);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.btn-reset {
		padding: 0.5em 1.2em;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		font-size: 0.85rem;
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.btn-reset:hover {
		border-color: var(--text-primary);
		color: var(--text-primary);
	}
</style>
