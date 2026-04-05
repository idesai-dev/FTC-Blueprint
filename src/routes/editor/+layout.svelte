<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { children } = $props();
	let allowed = $state(false);

	onMount(() => {
		if (browser) {
			const host = window.location.hostname;
			if (host === 'localhost' || host === '127.0.0.1') {
				allowed = true;
			} else {
				window.location.href = '/';
			}
		}
	});
</script>

{#if allowed}
	{@render children()}
{:else}
	<div class="guard">
		<p>Checking environment…</p>
	</div>
{/if}

<style>
	.guard {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: #0d0d0d;
		color: #444;
		font-family: monospace;
	}
</style>
