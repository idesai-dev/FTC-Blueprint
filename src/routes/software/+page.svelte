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

	// Collect all unique tags
	const allTags = $derived([...new Set(data.posts.flatMap((p) => p.meta.tags || []))]);

	// Visibility filter: only show completed or coming soon posts (unless dev mode)
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

	// Filtered posts (search + tag filters on top of visibility)
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
	<title>Prints — Blueprint</title>
	<meta name="description" content="All Prints and posts published on Blueprint." />
</svelte:head>
<div class="directory-container">
	<div class="sidebar">
		<h3>Blueprint Guide</h3>
		<br />

		{#if showGroup(["/software/pedro-introduction", "/software/pedro-tuning", "/software/pedro-making-an-auto", "/software/pedro-localization", "/software/roadrunner-introduction", "/software/roadrunner-how-to-tune", "/software/roadrunner-actions", "/software/roadrunner-making-an-auto", "/software/roadrunner-localization", "/software/roadrunner-meepmeep", "/software/encoder-autonomous-introduction", "/software/encoder-autonomous-drivetrain-functions", "/software/encoder-autonomous-subsystem-functions"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Autonomous
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showGroup(["/software/pedro-introduction", "/software/pedro-tuning", "/software/pedro-making-an-auto", "/software/pedro-localization"])}
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="Pedro" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:1.5rem;" type="1">
						{#if showLink("/software/pedro-introduction")}
				<li><a href="/software/pedro-introduction">Introduction</a></li>
			{/if}
						{#if showLink("/software/pedro-tuning")}
				<li><a href="/software/pedro-tuning">How to Tune</a></li>
			{/if}
						{#if showLink("/software/pedro-making-an-auto")}
				<li><a href="/software/pedro-making-an-auto">Making an Auto</a></li>
			{/if}
						{#if showLink("/software/pedro-localization")}
				<li><a href="/software/pedro-localization">Localization</a></li>
			{/if}
					</ol>
				</Collapsible>
			</li>
			{/if}
			{#if showGroup(["/software/roadrunner-introduction", "/software/roadrunner-how-to-tune", "/software/roadrunner-actions", "/software/roadrunner-making-an-auto", "/software/roadrunner-localization", "/software/roadrunner-meepmeep"])}
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible
					title="Roadrunner"
					titleColor="var(--text-primary)"
					childColor="var(--text-body)"
				>
					<ol style="padding-left:1.5rem;" type="1">
						{#if showLink("/software/roadrunner-introduction")}
				<li><a href="/software/roadrunner-introduction">Introduction</a></li>
			{/if}
						{#if showLink("/software/roadrunner-how-to-tune")}
				<li><a href="/software/roadrunner-how-to-tune">How to Tune</a></li>
			{/if}
						{#if showLink("/software/roadrunner-actions")}
				<li><a href="/software/roadrunner-actions">Actions</a></li>
			{/if}
						{#if showLink("/software/roadrunner-making-an-auto")}
				<li><a href="/software/roadrunner-making-an-auto">Making an Auto</a></li>
			{/if}
						{#if showLink("/software/roadrunner-localization")}
				<li><a href="/software/roadrunner-localization">Localization</a></li>
			{/if}
						{#if showLink("/software/roadrunner-meepmeep")}
				<li><a href="/software/roadrunner-meepmeep">MeepMeep</a></li>
			{/if}
					</ol>
				</Collapsible>
			</li>
			{/if}
			{#if showGroup(["/software/encoder-autonomous-introduction", "/software/encoder-autonomous-drivetrain-functions", "/software/encoder-autonomous-subsystem-functions"])}
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible
					title="Encoder Based"
					titleColor="var(--text-primary)"
					childColor="var(--text-body)"
				>
					<ol style="padding-left:1.5rem;" type="1">
						{#if showLink("/software/encoder-autonomous-introduction")}
				<li><a href="/software/encoder-autonomous-introduction">Introduction</a></li>
			{/if}
						{#if showLink("/software/encoder-autonomous-drivetrain-functions")}
				<li>
							<a href="/software/encoder-autonomous-drivetrain-functions">Drivetrain Functions</a>
						</li>
			{/if}
						{#if showLink("/software/encoder-autonomous-subsystem-functions")}
				<li>
							<a href="/software/encoder-autonomous-subsystem-functions">Subsystem Functions</a>
						</li>
			{/if}
					</ol>
				</Collapsible>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/software/teleop-introduction", "/software/teleop-beginner", "/software/teleop-fsm", "/software/basics-types-of-opmodes", "/software/mecanum-drivetrain"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			TeleOp
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showGroup(["/software/teleop-introduction", "/software/teleop-beginner", "/software/teleop-fsm"])}
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="TeleOp" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:1.5rem;" type="1">
						{#if showLink("/software/teleop-introduction")}
				<li><a href="/software/teleop-introduction">Introduction</a></li>
			{/if}
						{#if showLink("/software/teleop-beginner")}
				<li><a href="/software/teleop-beginner">Beginner</a></li>
			{/if}
						{#if showLink("/software/teleop-fsm")}
				<li><a href="/software/teleop-fsm">FSM</a></li>
			{/if}
					</ol>
				</Collapsible>
			</li>
			{/if}
			{#if showLink("/software/basics-types-of-opmodes")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-types-of-opmodes">Types of OpModes</a>
			</li>
			{/if}
			{#if showLink("/software/mecanum-drivetrain")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/mecanum-drivetrain">Mecanum Drivetrain</a>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/software/pid-control", "/software/feed-forward", "/software/motion-profiling"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Control
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showLink("/software/pid-control")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/pid-control">PID Control</a>
			</li>
			{/if}
			{#if showLink("/software/feed-forward")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/feed-forward">Feedforward</a>
			</li>
			{/if}
			{#if showLink("/software/motion-profiling")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/motion-profiling">Motion Profiling</a>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/software/vision-opencv", "/software/vision-limelight", "/software/vision-april-tag", "/software/vision-object-detection", "/software/vision-relocalization-metatag2", "/software/pinpoint-odometry-computer", "/software/basics-distance", "/software/basics-color", "/software/basics-touch", "/software/basics-imu"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Sensors
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showGroup(["/software/vision-opencv", "/software/vision-limelight", "/software/vision-april-tag", "/software/vision-object-detection", "/software/vision-relocalization-metatag2"])}
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="Vision" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:1.5rem;" type="1">
						{#if showLink("/software/vision-opencv")}
				<li><a href="/software/vision-opencv">OpenCV</a></li>
			{/if}
						{#if showLink("/software/vision-limelight")}
				<li><a href="/software/vision-limelight">Limelight</a></li>
			{/if}
						{#if showLink("/software/vision-april-tag")}
				<li><a href="/software/vision-april-tag">April Tag Detection</a></li>
			{/if}
						{#if showLink("/software/vision-object-detection")}
				<li><a href="/software/vision-object-detection">Object Detection</a></li>
			{/if}
						{#if showLink("/software/vision-relocalization-metatag2")}
				<li>
							<a href="/software/vision-relocalization-metatag2">Relocalization with MetaTag2</a>
						</li>
			{/if}
					</ol>
				</Collapsible>
			</li>
			{/if}
			{#if showLink("/software/pinpoint-odometry-computer")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/pinpoint-odometry-computer">Pinpoint</a>
			</li>
			{/if}
			{#if showLink("/software/basics-distance")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-distance">Distance</a>
			</li>
			{/if}
			{#if showLink("/software/basics-color")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-color">Color</a>
			</li>
			{/if}
			{#if showLink("/software/basics-touch")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-touch">Touch</a>
			</li>
			{/if}
			{#if showLink("/software/basics-imu")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-imu">IMU</a>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/software/basics-android-studio", "/software/basics-wiring", "/software/basics-motors-servos"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Basics
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showLink("/software/basics-android-studio")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-android-studio">Android Studio Setup</a>
			</li>
			{/if}
			{#if showLink("/software/basics-wiring")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-wiring">Wiring and Configuration</a>
			</li>
			{/if}
			{#if showLink("/software/basics-motors-servos")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/basics-motors-servos">Motors and Servos</a>
			</li>
			{/if}
		</ol>
		{/if}

		{#if showGroup(["/software/sloth-load", "/software/common-practices", "/software/bulkreads", "/software/mecanum-drivetrain", "/software/markdown-reference"])}
		<p
			class="sub"
			style="color:var(--accent-green); font-family:var(--font-heading); font-weight:600; font-size: 1.1rem; margin-top: 1rem; margin-bottom: 0.25rem;"
		>
			Miscellaneous
		</p>
		<ol style="padding:0; margin:0; list-style:none; color:var(--text-body);">
			{#if showLink("/software/sloth-load")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/sloth-load">Sloth</a>
			</li>
			{/if}
			{#if showLink("/software/common-practices")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/common-practices">Common practices</a>
			</li>
			{/if}
			{#if showLink("/software/bulkreads")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/bulkreads">Bulkreads</a>
			</li>
			{/if}
			{#if showLink("/software/mecanum-drivetrain")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/mecanum-drivetrain">Mecanum Drivetrain</a>
			</li>
			{/if}
			{#if showLink("/software/markdown-reference")}
				<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<a href="/software/markdown-reference">Markdown Reference</a>
			</li>
			{/if}
		</ol>
		{/if}
	</div>
	<div class="content-feed">
		<section class="blog-header">
			<div class="container">
				<div class="animate-fade-up">
					<span class="tag tag--cyan">All Prints</span>
				</div>
				<h1 class="animate-fade-up" style="animation-delay:60ms">The Software Guide</h1>
				<p class="sub animate-fade-up" style="animation-delay:120ms">
					{data.posts.length} article{data.posts.length !== 1 ? 's' : ''}
				</p>
			</div>
		</section>

		<!-- Filters -->
		<section class="filters-section">
			<div class="container animate-fade-up" style="animation-delay:160ms">
				<FilterBar category="software" bind:activeTags bind:searchQuery />
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
	.directory-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.sidebar {
		display: none;
	}

	.content-feed {
		width: 100%;
	}

	@media (min-width: 860px) {
		.directory-container {
			flex-direction: row;
			justify-content: flex-end;
		}

		.sidebar {
			display: block;
			width: 24vw;
			background-color: var(--sidebar-bg);
			border-right: 2px solid var(--border);
			padding: 1rem;
		}
	}

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
