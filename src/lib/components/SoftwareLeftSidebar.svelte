<script lang="ts">
	import { page } from '$app/stores';

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
</script>

{#if activeGroup}
	<nav class="left-sidebar" aria-label="Section navigation">
		<p class="sidebar-label">{activeGroup.title}</p>
		<ul class="sidebar-list">
			{#each activeGroup.links as { href, label }}
				<li class="sidebar-item">
					<a {href} class="sidebar-link" class:active={currentPath === href}>
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

	/* Hide on narrow screens */
	@media (max-width: 1100px) {
		.left-sidebar {
			display: none;
		}
	}
</style>
