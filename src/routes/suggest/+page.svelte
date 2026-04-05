<script lang="ts">
	import SuggestionForm from '$lib/components/SuggestionForm.svelte';
</script>

<svelte:head>
	<title>Suggest — Blueprint</title>
	<meta
		name="description"
		content="Submit a request or suggestion for the Blueprint FTC software site."
	/>
</svelte:head>

<section class="suggest-header">
	<div class="container">
		<div class="animate-fade-up" style="display:inline-block">
			<span class="tag tag--cyan">Feedback</span>
		</div>
		<h1 class="animate-fade-up" style="animation-delay:60ms">Make a Request.</h1>
		<p class="sub animate-fade-up" style="animation-delay:120ms">
			Have a guide or feature in mind? Let us know what you'd like to see next.
		</p>
	</div>
</section>

<section class="suggest-body">
	<div class="container">
		<div class="form-wrapper animate-fade-up" style="animation-delay:180ms">
			<SuggestionForm />
		</div>
	</div>
</section>

<style>
	.suggest-header {
		padding: 3rem 0 1.5rem;
		background: var(--gradient-hero);
		border-bottom: 1px solid var(--border-subtle);
	}

	.suggest-header .container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.sub {
		font-size: 1.1rem;
		color: var(--text-secondary);
		max-width: 500px;
		line-height: 1.6;
	}

	.suggest-body {
		padding: 2rem 0 8rem;
	}

	.form-wrapper {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
