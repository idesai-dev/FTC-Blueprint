<script lang="ts">
	import { page } from '$app/stores';
	import BlogCard from '$lib/components/BlogCard.svelte';
	import type { Post } from '$lib/utils/posts';
	import { goto } from '$app/navigation';

	let { data }: { data: { posts: Post[] } } = $props();

	let searchQuery = $state($page.url.searchParams.get('q') || '');

	const filteredPosts = $derived(
		data.posts.filter((p) => {
			const query = searchQuery.toLowerCase();
			if (!query) return true;
			return (
				p.meta.title.toLowerCase().includes(query) ||
				(p.meta.description || '').toLowerCase().includes(query) ||
				(p.meta.tags || []).some(t => t.toLowerCase().includes(query))
			);
		})
	);

	function updateSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value;
		// Update URL without reloading
		const url = new URL(window.location.href);
		if (searchQuery) url.searchParams.set('q', searchQuery);
		else url.searchParams.delete('q');
		window.history.replaceState({}, '', url);
	}
</script>

<svelte:head>
	<title>Search — Blueprint</title>
</svelte:head>

<section class="search-page">
	<div class="container">
		<header class="search-header animate-fade-up">
			<h1>Search Blueprint</h1>
			<div class="search-input-wrap">
				<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
				</svg>
				<input
					type="text"
					placeholder="Search for articles, prints, or keywords..."
					value={searchQuery}
					oninput={updateSearch}
					class="search-input"
				/>
			</div>
			<p class="results-count">
				Found {filteredPosts.length} result{filteredPosts.length === 1 ? '' : 's'}
			</p>
		</header>

		<div class="results-grid stagger">
			{#each filteredPosts as post}
				<BlogCard {post} />
			{:else}
				<div class="empty-state animate-fade-up">
					<h3>No results found</h3>
					<p>Try different keywords or browse our guides.</p>
					<a href="/software" class="btn">Browse Software Prints</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.search-page {
		padding: 6rem 0;
		min-height: 80vh;
	}

	.search-header {
		text-align: center;
		margin-bottom: 4rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	h1 {
		margin-bottom: 2rem;
		font-size: clamp(2.5rem, 8vw, 4rem);
	}

	.search-input-wrap {
		position: relative;
		margin-bottom: 1rem;
	}

	.search-icon {
		position: absolute;
		left: 1.25rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
	}

	.search-input {
		width: 100%;
		padding: 1.25rem 1.5rem 1.25rem 3.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-xl);
		color: var(--text-primary);
		font-size: 1.15rem;
		transition: all var(--transition-base);
		outline: none;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	.search-input:focus {
		border-color: var(--text-primary);
		box-shadow: var(--glow-cyan);
		background: var(--bg);
	}

	.results-count {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 2rem;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem 2rem;
		background: var(--bg-card);
		border-radius: var(--radius-lg);
		border: 1px dashed var(--border);
	}

	.empty-state h3 {
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.empty-state p {
		margin-bottom: 2rem;
		color: var(--text-secondary);
	}

	.btn {
		display: inline-block;
		padding: 0.8rem 1.5rem;
		background: var(--gradient-accent);
		color: white;
		border-radius: var(--radius-md);
		font-family: var(--font-sans);
		font-weight: 600;
		transition: transform var(--transition-fast);
	}

	.btn:hover {
		transform: translateY(-2px);
	}
</style>
