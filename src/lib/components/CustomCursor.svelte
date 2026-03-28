<script lang="ts">
	import { cursorState } from '$lib/stores/cursor.svelte';
	import { onMount } from 'svelte';

	let { active, x, y, hovering } = $derived(cursorState);

	$effect(() => {
		if (active) {
			document.body.classList.add('custom-cursor-active');
		} else {
			document.body.classList.remove('custom-cursor-active');
		}
	});

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			cursorState.x = e.clientX;
			cursorState.y = e.clientY;
		};

		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.closest('a, button, [role="button"], input, select, textarea')) {
				cursorState.hovering = true;
			}
		};

		const handleMouseOut = () => {
			cursorState.hovering = false;
		};

		window.addEventListener('mousemove', handleMouseMove);
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
		class="custom-cursor" 
		class:hovering 
		style="transform: translate3d({x}px, {y}px, 0);"
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
		z-index: 9999;
		mix-blend-mode: difference;
		/* Removed transition: transform to fix lag */
	}

	.cursor-inner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 4px;
		height: 4px;
		margin: -2px 0 0 -2px;
		background: #fff;
		border-radius: 50%;
		transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s ease-in-out;
	}

	.cursor-outer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 1.25px solid #fff;
		border-radius: 50%;
		transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease-in-out;
	}

	.hovering .cursor-inner {
		transform: scale(0);
		opacity: 0;
	}

	.hovering .cursor-outer {
		transform: scale(1.4);
		background: rgba(255, 255, 255, 0.15);
		border-color: var(--accent-green);
	}

	/* Pulse effect when hovering */
	.hovering .cursor-outer::after {
		content: '';
		position: absolute;
		inset: -3px;
		border: 1px solid var(--accent-green);
		border-radius: 50%;
		animation: pulse-cursor 1.5s infinite;
	}

	@keyframes pulse-cursor {
		0% { transform: scale(1); opacity: 0.5; }
		100% { transform: scale(1.3); opacity: 0; }
	}

	@media (max-width: 1024px) {
		.custom-cursor { display: none; }
		:global(body.custom-cursor-active *) { cursor: auto !important; }
	}
</style>
