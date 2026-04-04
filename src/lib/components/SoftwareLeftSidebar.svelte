<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	const groups = [
		{
			title: 'Basics',
			links: [
				{ href: '/software/basics-android-studio', label: 'Android Studio Setup' },
				{ href: '/software/basics-wiring', label: 'Wiring and Configuration' },
				{ href: '/software/basics-motors-servos', label: 'Motors and Servos' },
				{ href: '/software/basics-types-of-opmodes', label: 'Types of OpModes' }
			]
		},
		{
			title: 'Control',
			links: [
				{ href: '/software/pid-control', label: 'PID Control' },
				{ href: '/software/feed-forward', label: 'Feedforward' }
			]
		},
		{
			title: 'Encoder Based',
			links: [
				{ href: '/software/encoder-autonomous-introduction', label: 'Introduction' },
				{
					href: '/software/encoder-autonomous-drivetrain-functions',
					label: 'Drivetrain Functions'
				},
				{ href: '/software/encoder-autonomous-subsystem-functions', label: 'Subsystem Functions' }
			]
		},
		{
			title: 'Roadrunner',
			links: [
				{ href: '/software/roadrunner-introduction', label: 'Introduction' },
				{ href: '/software/roadrunner-how-to-tune', label: 'How to Tune' },
				{ href: '/software/roadrunner-actions', label: 'Actions' },
				{ href: '/software/roadrunner-making-an-auto', label: 'Making an Auto' },
				{ href: '/software/roadrunner-localization', label: 'Localization' },
				{ href: '/software/roadrunner-meepmeep', label: 'MeepMeep' }
			]
		},
		{
			title: 'Pedro Pathing',
			links: [
				{ href: '/software/pedro-introduction', label: 'Introduction' },
				{ href: '/software/pedro-tuning', label: 'How to Tune' },
				{ href: '/software/pedro-nextftc-subsystems', label: 'NextFTC Subsystems' },
				{ href: '/software/pedro-making-an-auto', label: 'Making an Auto' },
				{ href: '/software/pedro-localization', label: 'Localization' }
			]
		},
		{
			title: 'TeleOp',
			links: [
				{ href: '/software/teleop-introduction', label: 'Introduction' },
				{ href: '/software/teleop-beginner', label: 'Beginner' },
				{ href: '/software/teleop-fsm', label: 'FSM' }
			]
		},
		{
			title: 'Vision',
			links: [
				{ href: '/software/vision-opencv', label: 'OpenCV' },
				{ href: '/software/vision-limelight', label: 'Limelight' },
				{ href: '/software/vision-april-tag', label: 'April Tag Detection' },
				{ href: '/software/vision-object-detection', label: 'Object Detection' },
				{ href: '/software/vision-relocalization-metatag2', label: 'Relocalization with MetaTag2' }
			]
		},
		{
			title: 'Miscellaneous',
			links: [
				{ href: '/software/sloth-load', label: 'Sloth' },
				{ href: '/software/common-practices', label: 'Common Practices' },
				{ href: '/software/bulkreads', label: 'Bulkreads' },
				{ href: '/software/mecanum-drivetrain', label: 'Mecanum Drivetrain' }
			]
		}
	];

	import { devModeState } from '$lib/stores/devMode.svelte';

	let currentPath = $derived($page.url.pathname);
	let completedPaths = $derived($page.data.completedPaths || []);

	// Filter groups and links based on completion and dev mode
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

	// Find if the current path belongs to any visible group
	let activeGroup = $derived(
		visibleGroups.find((group) => group.links.some((link) => link.href === currentPath))
	);

	let mobileOpen = $state(false);
</script>

{#if activeGroup}
	<button class="mobile-toggle-fab" onclick={() => (mobileOpen = !mobileOpen)} aria-label="Toggle section navigation" class:active={mobileOpen}>
		<svg
			width="22"
			height="22"
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
	</button>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	{#if mobileOpen}
		<div class="mobile-backdrop" transition:fade={{duration: 200}} onclick={() => (mobileOpen = false)}></div>
	{/if}

	<nav class="left-sidebar" class:mobile-open={mobileOpen} aria-label="Section navigation">
		<p class="sidebar-label">{activeGroup.title}</p>
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

	/* Hide natively on narrow screens and turn into a toggleable drawer */
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
			background: var(--bg-card);
			color: var(--text-primary);
			border: 1px solid var(--border);
		}

		.left-sidebar {
			position: fixed;
			top: var(--header-height);
			left: 0;
			width: 250px;
			height: calc(100vh - var(--header-height));
			max-height: none;
			background: var(--bg-secondary);
			z-index: 100;
			border-radius: 0;
			border-right: 1px solid var(--border);
			padding: 1.5rem;
			transform: translateX(-100%);
			transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		}

		.left-sidebar.mobile-open {
			transform: translateX(0);
		}

		.mobile-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			top: var(--header-height);
			background: rgba(0, 0, 0, 0.4);
			backdrop-filter: blur(2px);
			z-index: 90;
		}
	}
</style>
