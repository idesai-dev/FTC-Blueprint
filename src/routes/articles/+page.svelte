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

			const matchTag = activeTags.length === 0 || activeTags.every((t) => (p.meta.tags || []).map(tag => typeof tag === 'string' ? tag.toLowerCase().trim() : '').includes(t.toLowerCase()));

			return matchSearch && matchTag;
		})
	);
</script>

<svelte:head>
	<title>Articles — Blueprint</title>
	<meta name="description" content="All Prints and posts published on Blueprint." />
</svelte:head>
<div style="display: flex; width:100%; justify-content:flex-end;">
	<div style="width:24vw; background-color:var(--bg-card-hover); border-right:5px solid var(--accent-green); padding:1rem;">
		<h3>Software Guide</h3>
		<p class="sub" style="color:var(--accent-green)">Recommended Outline</p>
		<hr>
		<ol style="padding:0.5rem 0rem 0rem 2rem; color:var(--text-primary);">
			<li>
				<strong>
					<a href="/software/pid-control">PID Control</a>
				</strong>
			</li>
			<li>
				<strong>
					<a href="/software/feed-forward">Feed Forward</a>
				</strong>
			</li>
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="Encoder Autonomous" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:2rem;" type="I">
						<li><a href="/software/encoder-autonomous-introduction">Introduction</a></li>
						<li><a href="/software/encoder-autonomous-drivetrain-functions">Drivetrain Functions</a></li>
						<li><a href="/software/encoder-autonomous-subsystem-functions">Subsystem Functions</a></li>
					</ol>
				</Collapsible>
			</li>
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="Roadrunner" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:2rem;" type="I">
						<li><a href="/software/roadrunner-introduction">Introduction</a></li>
						<li><a href="/software/roadrunner-how-to-tune">How to Tune</a></li>
						<li><a href="/software/roadrunner-actions">Actions</a></li>
						<li><a href="/software/roadrunner-making-an-auto">Making an Auto</a></li>
						<li><a href="/software/roadrunner-localization">Localization</a></li>
						<li><a href="/software/roadrunner-meepmeep">MeepMeep</a></li>
					</ol>
				</Collapsible>
			</li>
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="Pedro Pathing" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:2rem;" type="I">
						<li><a href="/software/pedro-introduction">Introduction</a></li>
						<li><a href="/software/pedro-tuning">How to Tune</a></li>
						<li><a href="/software/pedro-making-an-auto">Making an Auto</a></li>
						<li><a href="/software/pedro-localization">Localization</a></li>
					</ol>
				</Collapsible>
			</li>
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="TeleOp" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:2rem;" type="I">
						<li><a href="/software/teleop-introduction">Introduction</a></li>
						<li><a href="/software/teleop-beginner">Beginner</a></li>
						<li><a href="/software/teleop-fsm">FSM</a></li>
					</ol>
				</Collapsible>
			</li>
			<li>
				<strong>
					<a href="/software/pinpoint-odometry-computer">Pinpoint Odometry Computer</a>
				</strong>
			</li>
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="Vision" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:2rem;" type="1">
						<li><a href="/software/vision-opencv">OpenCV</a></li>
						<li><a href="/software/vision-limelight">Limelight</a></li>
						<li><a href="/software/vision-april-tag">April Tag Detection</a></li>
						<li><a href="/software/vision-object-detection">Object Detection</a></li>
						<li><a href="/software/vision-relocalization-metatag2">Relocalization with MetaTag2</a></li>
					</ol>
				</Collapsible>
			</li>
			<li>
				<strong>
					<a href="/software/ftc-dashboard">FTC Dashboard</a>
				</strong>
			</li>
			<li>
				<strong>
					<a href="/software/mecanum-drivetrain">Mecanum Drivetrain & Code</a>
				</strong>
			</li>
			<li style="padding-left:1.25rem; margin-top:0.25rem;">
				<Collapsible title="Full guide for basics" titleColor="var(--text-primary)" childColor="var(--text-body)">
					<ol style="padding-left:2rem;" type="1">
						<li style="padding-left:1.25rem; margin-top:0.25rem;"><a href="/software/basics-android-studio">Android Studio Setup</a></li>
						<li><a href="/software/basics-wiring">Wiring and Configuration</a></li>
						<li><a href="/software/basics-motors-servos">Motors and Servos</a></li>
						<li>
							Sensors
							<ol style="padding-left:1.5rem; list-style-type: lower-alpha;">
								<li><a href="/software/basics-distance">Distance</a></li>
								<li><a href="/software/basics-color">Color</a></li>
								<li><a href="/software/basics-touch">Touch</a></li>
								<li><a href="/software/basics-imu">IMU (Rev)</a></li>
							</ol>
						</li>
						<li><a href="/software/basics-types-of-opmodes">Linear OpMode vs. OpMode</a></li>
					</ol>
				</Collapsible>
			</li>
			<li>
				<strong>
					<a href="/software/sloth-load">Sloth Load</a>
				</strong>
			</li>
			<li>
				<strong>
					<a href="/software/common-practices">Common Practices</a>
				</strong>
			</li>
			<li>
				<strong>
					<a href="/software/bulkreads">Bulkreads</a>
				</strong>
			</li>
		</ol>
	</div>
	<div style="width: 100%;">
		<section class="blog-header">
			<div class="container">
				<div class="animate-fade-up">
					<span class="tag tag--cyan">All Prints</span>
				</div>
				<h1 class="animate-fade-up" style="animation-delay:60ms">The Blueprint</h1>
				<p class="sub animate-fade-up" style="animation-delay:120ms">
					{data.posts.length} article{data.posts.length !== 1 ? 's' : ''}
				</p>
			</div>
		</section>

		
		<!-- Filters -->
		<section class="filters-section">
			<div class="container animate-fade-up" style="animation-delay:160ms">
				<FilterBar bind:activeTags={activeTags} bind:searchQuery={searchQuery} />
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
