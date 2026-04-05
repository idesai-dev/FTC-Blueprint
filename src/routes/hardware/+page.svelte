<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import type { Post } from '$lib/utils/posts';
	import { tagColor } from '$lib/utils/posts';
	import Collapsible from '$lib/components/Collapsible.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import HardwareLeftSidebar from '$lib/components/HardwareLeftSidebar.svelte';
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
			return tags.includes('completed');
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

<div class="directory-container">
	<div class="main-layout">
		<HardwareLeftSidebar mode="section" />
		<div class="content-feed">
			<section class="blog-header">
				<div class="blog-header-inner animate-fade-up">
					<span class="tag tag--orange">All Prints</span>
					<h1>The Hardware Guide</h1>
					<p class="sub">
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
</div>

<style>
	.directory-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
	}

	.main-layout {
		display: flex;
		flex-direction: column;
		gap: 0;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.content-feed {
		flex: 1;
		min-width: 0;
		padding-top: 0;
	}

	@media (min-width: 1101px) {
		.main-layout {
			flex-direction: row;
			padding: 0;
			gap: 0;
		}
	}

	.blog-header {
		padding: 5rem 3rem;
		background: var(--gradient-hero);
		border-bottom: 1px solid var(--border-subtle);
		margin-bottom: 3rem;
		width: 100%;
	}

	.blog-header-inner {
		max-width: 1150px;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		align-items: flex-start;
	}

	.tag {
		width: fit-content;
	}

	h1 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		line-height: 1.1;
		margin: 0.5rem 0;
	}
	.sub {
		font-size: 0.85rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
	}
	.filters-section {
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--border-subtle);
		background: transparent;
		position: sticky;
		top: var(--header-height);
		z-index: 10;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
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
