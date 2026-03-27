<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import type { Post } from '$lib/utils/posts';

	let { data }: { data: { posts: Post[] } } = $props();

	let searchQuery = $state('');
	let activeTag = $state<string | null>(null);

	// Collect all unique tags
	const allTags = $derived(
		[...new Set(data.posts.flatMap((p) => p.meta.tags || []))]
	);

	// Filtered posts
	const filteredPosts = $derived(
		data.posts.filter((p) => {
			const matchSearch =
				!searchQuery ||
				p.meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.meta.description || '').toLowerCase().includes(searchQuery.toLowerCase());

			const matchTag = !activeTag || (p.meta.tags || []).includes(activeTag);

			return matchSearch && matchTag;
		})
	);
</script>

<svelte:head>
	<title>Blog — Blueprint</title>
	<meta name="description" content="All articles and posts published on Blueprint." />
</svelte:head>

<section class="blog-header">
	<div class="container">
		<div class="animate-fade-up">
			<span class="tag tag--cyan">All posts</span>
		</div>
		<h1 class="animate-fade-up" style="animation-delay:60ms">The Blog</h1>
		<p class="sub animate-fade-up" style="animation-delay:120ms">
			{data.posts.length} article{data.posts.length !== 1 ? 's' : ''}
		</p>
	</div>
</section>

<!-- Filters -->
<section class="filters-section">
	<div class="container">
		<div class="filters animate-fade-up" style="animation-delay:160ms">
			<div class="search-wrap">
				<svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
				</svg>
				<input
					id="blog-search"
					type="search"
					placeholder="Search posts…"
					bind:value={searchQuery}
					aria-label="Search posts"
					class="search-input"
				/>
			</div>

			{#if allTags.length > 0}
				<div class="tag-filters">
					<button
						class="tag-btn"
						class:active={!activeTag}
						onclick={() => (activeTag = null)}
						aria-pressed={!activeTag}
					>All</button>
					{#each allTags as tag, i}
						<button
							class="tag-btn tag-btn--{i % 3 === 0 ? 'cyan' : i % 3 === 1 ? 'green' : 'yellow'}"
							class:active={activeTag === tag}
							onclick={() => (activeTag = activeTag === tag ? null : tag)}
							aria-pressed={activeTag === tag}
						>{tag}</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Post list -->
<section class="posts-section">
	<div class="container">
		{#if filteredPosts.length > 0}
			<div class="post-grid stagger">
				{#each filteredPosts as post}
					<BlogCard {post} />
				{/each}
			</div>
		{:else}
			<div class="empty animate-fade-up">
				<p>No posts match your search.</p>
				<button class="btn-reset" onclick={() => { searchQuery = ''; activeTag = null; }}>
					Clear filters
				</button>
			</div>
		{/if}
	</div>
</section>

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

	/* Filters */
	.filters-section {
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--border-subtle);
		background: var(--bg-secondary);
		position: sticky;
		top: var(--header-height);
		z-index: 10;
		backdrop-filter: blur(12px);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 200px;
		max-width: 320px;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.55em 0.75em 0.55em 2.2em;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-body);
		font-family: var(--font-body);
		font-size: 0.88rem;
		transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
		outline: none;
	}

	.search-input::placeholder { color: var(--text-muted); }
	.search-input:focus {
		border-color: var(--text-primary);
		box-shadow: var(--glow-cyan);
	}

	.tag-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.tag-btn {
		padding: 0.3em 0.8em;
		border-radius: var(--radius-pill);
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--text-muted);
		font-size: 0.78rem;
		font-family: var(--font-mono);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-fast);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.tag-btn:hover, .tag-btn.active {
		border-color: var(--text-primary);
		color: var(--text-primary);
		background: rgba(116, 215, 237, 0.08);
	}

	.tag-btn--green:hover, .tag-btn--green.active {
		border-color: var(--accent-green);
		color: var(--accent-green);
		background: rgba(126, 255, 160, 0.07);
	}

	.tag-btn--yellow:hover, .tag-btn--yellow.active {
		border-color: var(--accent-yellow);
		color: var(--accent-yellow);
		background: rgba(245, 230, 66, 0.06);
	}

	/* Posts */
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
