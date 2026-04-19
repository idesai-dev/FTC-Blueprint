<script lang="ts">
	import { cursorState } from '$lib/stores/cursor.svelte';
	import { onMount } from 'svelte';

	let { active } = $derived(cursorState);
	let hovering = $derived(cursorState.hovering);

	let cursorEl: HTMLDivElement | null = $state(null);
	
	// Mouse position variables
	let mouseX = 0;
	let mouseY = 0;



	$effect(() => {
		if (active) {
			document.body.classList.add('custom-cursor-active');
		} else {
			document.body.classList.remove('custom-cursor-active');
		}
	});

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;

			if (cursorEl) {
				cursorEl.style.setProperty('--x', `${mouseX}px`);
				cursorEl.style.setProperty('--y', `${mouseY}px`);
			}
		};

		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.closest('a, button, [role="button"], input, select, textarea, .card')) {
				cursorState.hovering = true;
			}
		};

		const handleMouseOut = () => {
			cursorState.hovering = false;
		};

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		window.addEventListener('mouseover', handleMouseOver);
		window.addEventListener('mouseout', handleMouseOut);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseover', handleMouseOver);
			window.removeEventListener('mouseout', handleMouseOut);
		};
	});
</script>

{#if active}
	<div
		bind:this={cursorEl}
		class="custom-cursor"
		class:hovering
		style="transform: translate3d(var(--x), var(--y), 0);"
		aria-hidden="true"
	>
		<div class="cursor-inner"></div>
		<div class="cursor-outer"></div>
		<div class="cursor-circle circle-1"></div>
	</div>
{/if}

<style>
	:global(body.custom-cursor-active *) {
		cursor: none !important;
	}

	.custom-cursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 20px;
		height: 20px;
		margin: -10px 0 0 -10px;
		pointer-events: none;
		z-index: 10000;
		--x: -100px;
		--y: -100px;
		will-change: transform;
	}

	.cursor-inner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 5px;
		height: 5px;
		margin: -2.5px 0 0 -2.5px;
		.btn-primary {
		background: var(--text-primary);
		color: var(--bg);
		border-color: var(--text-primary);
		font-weight: 700;
	}	z-index: 5;
		transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.cursor-outer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 1.2px solid var(--accent-green);
		border-radius: 50%;
		opacity: 0.5;
		z-index: 4;
		transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	.cursor-circle {
		position: absolute;
		top: 50%;
		left: 50%;
		border: 1px solid var(--accent-green);
		border-radius: 50%;
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: none;
	}

	.circle-1 { width: 32px; height: 32px; opacity: 0; }

	.hovering .cursor-inner {
		transform: scale(0.6);
		opacity: 0.9;
	}

	.hovering .cursor-outer {
		transform: scale(1.3);
		opacity: 0.25;
		border-color: var(--accent-cyan);
	}

	.hovering .cursor-circle {
		opacity: 0.4;
		transform: translate(-50%, -50%) scale(1);
	}

	.hovering .circle-1 { opacity: 0.6; border-color: var(--accent-cyan); }

	.bot-pulse {
		position: absolute;
		inset: -8px;
		border: 2px solid var(--accent-cyan);
		border-radius: 50%;
		opacity: 0;
		animation: pulse-ring 2s infinite;
	}

	/* Subtle glow */
	.custom-cursor::after {
		content: '';
		position: absolute;
		inset: -20px;
		background: radial-gradient(circle, rgba(104, 157, 135, 0.25) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.3s ease;
		border-radius: 50%;
	}

	.hovering::after {
		opacity: 1;
	}

	@media (max-width: 1024px) {
		.custom-cursor {
			display: none;
		}
		:global(body.custom-cursor-active *) {
			cursor: auto !important;
		}
	}
</style>
