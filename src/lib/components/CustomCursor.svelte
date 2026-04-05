<script lang="ts">
	import { cursorState } from '$lib/stores/cursor.svelte';
	import { onMount } from 'svelte';

	let { active } = $derived(cursorState);
	let hovering = $derived(cursorState.hovering);

	let cursorEl: HTMLDivElement | null = $state(null);
	
	// Physics state (internal to component for performance)
	let mouseX = 0;
	let mouseY = 0;
	let curX = 0;
	let curY = 0;
	let rafId: number;

	function lerp(start: number, end: number, factor: number) {
		return start + (end - start) * factor;
	}

	function animate() {
		if (!active) return;
		
		// Buttery smooth lerp (0.15 for responsiveness + elegance)
		curX = lerp(curX, mouseX, 0.15);
		curY = lerp(curY, mouseY, 0.15);

		if (cursorEl) {
			cursorEl.style.setProperty('--x', `${curX}px`);
			cursorEl.style.setProperty('--y', `${curY}px`);
		}

		rafId = requestAnimationFrame(animate);
	}

	$effect(() => {
		if (active) {
			document.body.classList.add('custom-cursor-active');
			rafId = requestAnimationFrame(animate);
		} else {
			document.body.classList.remove('custom-cursor-active');
			cancelAnimationFrame(rafId);
		}
	});

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
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
			cancelAnimationFrame(rafId);
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
		mix-blend-mode: difference;
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
		background: #fff;
		border-radius: 50%;
		transition:
			transform 0.25s cubic-bezier(0.23, 1, 0.32, 1),
			opacity 0.25s ease-in-out;
	}

	.cursor-outer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 1.5px solid #fff;
		border-radius: 50%;
		transition:
			transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
			border-color 0.3s ease-in-out,
			background-color 0.3s ease-in-out;
	}

	.hovering .cursor-inner {
		transform: scale(0);
		opacity: 0;
	}

	.hovering .cursor-outer {
		transform: scale(2.2);
		background: rgba(255, 255, 255, 0.15);
		border-color: #fff;
	}

	/* Subtle glow for extra premium feel */
	.custom-cursor::after {
		content: '';
		position: absolute;
		inset: -10px;
		background: radial-gradient(circle, rgba(116, 215, 237, 0.15) 0%, transparent 70%);
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
