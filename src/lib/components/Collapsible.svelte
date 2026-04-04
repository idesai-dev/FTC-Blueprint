<script>
	import { slide } from 'svelte/transition';

	let { title, children, titleColor, childColor } = $props();
	let open = $state(false);

	function toggle() {
		open = !open;
	}
</script>

<button
	type="button"
	class="summary {open ? 'open' : ''}"
	onclick={toggle}
	aria-expanded={open}
	style="--title-color: {titleColor};"
>
	<span class="arrow" class:open>⚙</span>
	<span>{title}</span>
</button>

{#if open}
	<div transition:slide style="color: {childColor}; margin-bottom: 0.75rem; margin-top: 0.25rem;">
		{@render children()}
	</div>
{/if}

<style>
	/* Refreshed styles to resolve virtual module loading issues in Vite */
	.summary {
		cursor: pointer;
		font-weight: 600;
		user-select: none;
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
		text-align: left;
		display: flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--title-color);
		transition: color 0.15s ease;
	}

	.summary:hover:not(.open) {
		color: var(--accent-green);
	}

	.summary.open {
		color: var(--accent-green);
	}

	.arrow {
		display: inline-block;
		transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.arrow.open {
		transform: rotate(90deg);
	}
</style>
