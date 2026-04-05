<script lang="ts">
	import { page } from '$app/stores';

	const groups = [
		{
			title: 'Getting Started',
			links: [
				{ href: '/outreach/outreach-intro', label: 'What is Outreach?' },
				{ href: '/outreach/outreach-planning', label: 'Planning Events' }
			]
		},
		{
			title: 'Community Events',
			links: [
				{ href: '/outreach/outreach-demos', label: 'Robot Demos' },
				{ href: '/outreach/outreach-workshops', label: 'Workshops' },
				{ href: '/outreach/outreach-stem-fairs', label: 'STEM Fairs' }
			]
		},
		{
			title: 'Mentoring',
			links: [
				{ href: '/outreach/mentoring-teams', label: 'Mentoring Teams' },
				{ href: '/outreach/outreach-rookie-support', label: 'Rookie Support' }
			]
		},
		{
			title: 'Documentation',
			links: [{ href: '/outreach/outreach-journal', label: 'Keeping a Journal' }]
		}
	];

	import { devModeState } from '$lib/stores/devMode.svelte';

	let currentPath = $derived($page.url.pathname);
	let completedPaths = $derived($page.data.completedPaths || []);

	let visibleGroups = $derived(
		groups
			.map((group) => {
				const visibleLinks = group.links.filter(
					(link) => devModeState.active || completedPaths.includes(link.href)
				);
				return { ...group, links: visibleLinks };
			})
			.filter((group) => group.links.length > 0)
	);

	let activeGroup = $derived(
		visibleGroups.find((group) => group.links.some((link) => link.href === currentPath))
	);
	import { fade } from 'svelte/transition';
	let mobileOpen = $state(false);
</script>

{#if activeGroup}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	{#if mobileOpen}
		<div class="mobile-backdrop" transition:fade={{duration: 200}} onclick={() => (mobileOpen = false)}></div>
	{/if}

	<nav class="left-sidebar" class:mobile-open={mobileOpen} aria-label="Section navigation">
		<div class="sidebar-header-mobile">
			<p class="sidebar-label">{activeGroup.title}</p>
			<button class="close-sidebar-btn" onclick={() => (mobileOpen = false)}>✕</button>
		</div>
		<ul class="sidebar-list">
			{#each activeGroup.links as { href, label }}
				<li class="sidebar-item">
					<a
						{href}
						class="sidebar-link"
						class:active={currentPath === href}
						onclick={() => (mobileOpen = false)}
					>
						{label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	
	<button 
		class="mobile-toggle-fab" 
		onclick={() => (mobileOpen = !mobileOpen)} 
		aria-label="Toggle section navigation" 
		class:active={mobileOpen}
	>
		<div class="bot-icon-wrap">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="4" y1="12" x2="20" y2="12"></line>
				<line x1="4" y1="6" x2="20" y2="6"></line>
				<line x1="4" y1="18" x2="20" y2="18"></line>
			</svg>
			{#if !mobileOpen}
				<span class="bot-pulse"></span>
			{/if}
		</div>
	</button>
{/if}

<style>
	.left-sidebar {
		position: sticky;
		top: calc(var(--header-height) + 2rem);
		width: 200px;
		flex-shrink: 0;
		max-height: calc(100vh - var(--header-height) - 4rem);
		overflow-y: auto;
		padding-left: 0.5rem;
		border-right: 1px solid var(--border-subtle);
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}
	.sidebar-label {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-primary);
		background: var(--bg-card);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		padding: 0.35rem 0.6rem;
		margin-bottom: 0.85rem;
		display: inline-block;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
	.sidebar-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-right: 1rem;
	}
	.sidebar-item {
		display: block;
	}
	.sidebar-link {
		display: block;
		font-size: 0.82rem;
		font-family: var(--font-body);
		color: var(--text-muted);
		text-decoration: none;
		border-radius: var(--radius-sm);
		padding: 0.35rem 0.5rem;
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
		line-height: 1.4;
	}
	.sidebar-link:hover {
		color: var(--text-primary);
		background: rgba(116, 215, 237, 0.05);
	}
	.sidebar-link.active {
		color: var(--accent-green);
		background: rgba(126, 255, 160, 0.07);
		font-weight: 500;
	}
	.mobile-toggle-fab {
		display: none;
	}

	.mobile-backdrop {
		display: none;
	}

	@media (max-width: 1100px) {
		.mobile-toggle-fab {
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			bottom: 1.5rem;
			left: 1.5rem;
			width: 60px;
			height: 60px;
			background: var(--bg-card);
			border: 1px solid var(--border);
			border-radius: 50%;
			color: var(--text-primary);
			cursor: pointer;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), var(--glow-cyan);
			z-index: 1000;
			transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		}

		.mobile-toggle-fab:hover {
			transform: scale(1.05) translateY(-4px);
			border-color: var(--text-primary);
			background: var(--bg-card-hover);
		}

		.mobile-toggle-fab.active {
			transform: rotate(90deg);
			background: var(--bg-card);
			border-color: var(--accent-cyan);
		}

		.bot-icon-wrap {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--accent-cyan);
		}

		.bot-pulse {
			position: absolute;
			inset: -8px;
			border: 2px solid var(--accent-cyan);
			border-radius: 50%;
			opacity: 0;
			animation: pulse-ring 2s infinite;
		}

		@keyframes pulse-ring {
			0% { transform: scale(0.5); opacity: 0; }
			50% { opacity: 0.3; }
			100% { transform: scale(1.2); opacity: 0; }
		}

		.left-sidebar {
			position: fixed;
			top: 0;
			left: 0;
			width: min(320px, 85vw);
			height: 100vh;
			max-height: none;
			background: var(--bg-secondary);
			z-index: 1100;
			border-radius: 0;
			border-right: 1px solid var(--border);
			padding: 2rem 1.5rem;
			transform: translateX(-100%);
			transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
			display: flex;
			flex-direction: column;
			box-shadow: 20px 0 50px rgba(0,0,0,0.5);
		}

		.left-sidebar.mobile-open {
			transform: translateX(0);
		}

		.sidebar-header-mobile {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 2rem;
		}

		.close-sidebar-btn {
			background: none;
			border: none;
			color: var(--text-muted);
			font-size: 1.2rem;
			cursor: pointer;
		}

		.sidebar-list {
			gap: 0.75rem;
			padding-right: 0;
		}

		.sidebar-link {
			padding: 0.8rem 1rem;
			background: var(--bg-card);
			border: 1px solid var(--border-subtle);
			border-radius: var(--radius-md);
			font-size: 0.95rem;
			color: var(--text-secondary);
			transition: all 0.2s ease;
		}

		.sidebar-link.active {
			background: rgba(116, 215, 237, 0.1);
			border-color: var(--accent-cyan);
			color: var(--accent-cyan);
			font-weight: 600;
		}

		.mobile-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.6);
			backdrop-filter: blur(4px);
			z-index: 1050;
		}
	}
</style>
