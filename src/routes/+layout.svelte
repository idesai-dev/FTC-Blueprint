<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import DocBot from '$lib/components/DocBot.svelte';
	import { Toaster } from 'svelte-5-french-toast';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="Blueprint — a modern blog for ideas, articles, and more." />
</svelte:head>

<CustomCursor />
<DocBot />
<Toaster />
<div class="site-wrapper">
	<Header />
	<main class="main-content">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.site-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.main-content {
		flex: 1;
	}
</style>
