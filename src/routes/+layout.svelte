<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import DocBot from '$lib/components/DocBot.svelte';
	import { Toaster, toast } from 'svelte-5-french-toast';
	import { page } from '$app/stores';
	import { devModeState } from '$lib/stores/devMode.svelte';

	let { children } = $props();

	let isSandboxChild = $state(false);
	
	$effect(() => {
		isSandboxChild = window.location.search.includes('sandbox=true');
	});

	const showSandboxLayout = $derived(!isSandboxChild && devModeState.active && devModeState.previewMode !== 'desktop');

	$effect(() => {
		const handleClick = () => toast.dismiss();
		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	});
</script>

<svelte:head>
	<meta name="description" content="Blueprint — a modern blog for ideas, articles, and more." />
</svelte:head>

<CustomCursor />
<DocBot />
<Toaster />

{#if showSandboxLayout}
	<div class="sandbox-overlay">
		<Header />
		<div class="sandbox-workspace">
			<div class="device-frame" class:tablet={devModeState.previewMode === 'tablet'} class:mobile={devModeState.previewMode === 'mobile'}>
				<iframe src="{$page.url.pathname}?sandbox=true" title="Responsive Device Sandbox"></iframe>
			</div>
		</div>
	</div>
{:else}
	<div class="site-wrapper" class:mock-body={isSandboxChild}>
		<Header />
		<main class="main-content">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}

<style>
	.site-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.site-wrapper.mock-body {
		background: var(--bg);
	}

	.main-content {
		flex: 1;
	}

	.sandbox-overlay {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		background: var(--bg);
	}
	
	.sandbox-workspace {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-hover);
		padding: 2rem;
		overflow: hidden;
	}

	.device-frame {
		background: var(--bg);
		border: 8px solid var(--border-subtle);
		border-radius: 32px;
		box-shadow: 0 30px 60px rgba(0,0,0,0.3);
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		display: flex;
		flex-direction: column;
	}

	.device-frame.tablet {
		width: 768px;
		height: 1024px;
		max-height: 90vh;
	}

	.device-frame.mobile {
		width: 390px;
		height: 844px;
		max-height: 90vh;
		border-radius: 40px;
	}

	.device-frame iframe {
		flex: 1;
		width: 100%;
		border: none;
		background: var(--bg);
	}
</style>
