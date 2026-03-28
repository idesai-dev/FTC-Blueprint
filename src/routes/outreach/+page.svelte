<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte';
	import type { Post } from '$lib/utils/posts';
	import { tagColor } from '$lib/utils/posts';
	import Collapsible from '$lib/components/Collapsible.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';

	let { data }: { data: { posts: Post[] } } = $props();

	let searchQuery = $state('');
	let activeTags = $state<string[]>([]);

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

			const matchTag = activeTags.length === 0 || activeTags.every((t) => {
				const postTags = (p.meta.tags || []).map(tag => typeof tag === 'string' ? tag.toLowerCase().trim() : '');
				const lowerT = t.toLowerCase();
				if (lowerT === 'novideo') return !postTags.includes('video');
				if (lowerT === 'completed-guide') return postTags.includes('completed guide');
				if (lowerT === 'uncompleted-guide') return !postTags.includes('completed guide');
				return postTags.includes(lowerT);
			});

			return matchSearch && matchTag;
		})
	);
</script>

<svelte:head>
	<title>Outreach — Blueprint</title>
	<meta name="description" content="All Prints and posts published on Blueprint." />
</svelte:head>
<div style="display: flex; width:100%; justify-content:flex-end;">
	<div style="width:24vw; background-color:var(--sidebar-bg); border-right:5px solid var(--accent-green); padding:1rem;">
		<h3>Blueprint Guide</h3>
		<br />
		
		<p class="sub" style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;">Outreach</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			<li style="padding-left:1.25rem; margin-top:0.25rem;"><a href="/outreach/mentoring-teams">Mentoring Teams</a></li>
		</ol>
	</div>
	<div style="width: 100%;">
		<section class="blog-header">
			<div class="container">
				<div class="animate-fade-up">
					<span class="tag tag--cyan">All Prints</span>
				</div>
				<h1 class="animate-fade-up" style="animation-delay:60ms">The Outreach Guide</h1>
				<p class="sub animate-fade-up" style="animation-delay:120ms">
					{data.posts.length} article{data.posts.length !== 1 ? 's' : ''}
				</p>
			</div>
		</section>

		
		<!-- Filters -->
		<section class="filters-section">
			<div class="container animate-fade-up" style="animation-delay:160ms">
				<FilterBar category="outreach" bind:activeTags={activeTags} bind:searchQuery={searchQuery} />
			</div>
		</section>

		<!-- Post list -->
		<section class="posts-section">
			<div class="container">
				{#if filteredPosts.length > 0}
					<div class="post-grid stagger">
						{#each filteredPosts as post}
							<BlogCard {post} basePath="/outreach" />
						{/each}
					</div>
				{:else}
					<div class="empty animate-fade-up">
						<p>No posts match your search.</p>
						<button class="btn-reset" onclick={() => { searchQuery = ''; activeTags = []; }}>
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
