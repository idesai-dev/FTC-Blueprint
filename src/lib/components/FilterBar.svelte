<script lang="ts">
	import { slide } from 'svelte/transition';
	import { devModeState } from '$lib/stores/devMode.svelte';

	let {
		activeTags = $bindable(),
		searchQuery = $bindable(),
		category = ''
	} = $props<{
		activeTags: string[];
		searchQuery: string;
		category?: string;
	}>();

	let isExpanded = $state(false);
	let difficulty = $state('all');
	let videoTutorial = $state('all');
	let completion = $state('all');

	function toggleFilter() {
		isExpanded = !isExpanded;
	}

	// Reactively update activeTags based on dropdowns
	$effect(() => {
		let tags: string[] = [];
		if (difficulty !== 'all') tags.push(difficulty);
		if (videoTutorial === 'yes') tags.push('video');
		else if (videoTutorial === 'no') tags.push('novideo');
		
		if (completion !== 'all') {
			if (completion === 'completed') tags.push('completed');
			else if (completion === 'not_completed') tags.push('not_completed');
			else if (completion === 'coming_soon' && devModeState.active) tags.push('coming soon');
		}
		
		activeTags = tags;
	});
</script>

<div class="filters">
	<div class="search-wrap">
		<svg
			class="search-icon"
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
		</svg>
		<input
			id="blog-search"
			type="search"
			placeholder={category ? `Search ${category} prints…` : 'Search prints…'}
			bind:value={searchQuery}
			aria-label={category ? `Search ${category} prints` : 'Search prints'}
			class="search-input"
		/>
	</div>

	<!-- Filter Toggle -->
	<button class="filter-toggle" class:expanded={isExpanded} onclick={toggleFilter}>
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
		</svg>
		Filter
	</button>

	<!-- Expanded Dropdowns -->
	{#if isExpanded}
		<div class="filter-options" transition:slide={{ axis: 'x', duration: 300 }}>
			<div class="select-wrapper">
				<select bind:value={difficulty} aria-label="Difficulty">
					<option value="all">Difficulty: All</option>
					<option value="beginner">Beginner</option>
					<option value="intermediate">Intermediate</option>
					<option value="advanced">Advanced</option>
				</select>
				<svg
					class="dropdown-icon"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>

			<div class="select-wrapper">
				<select bind:value={videoTutorial} aria-label="Video Tutorial">
					<option value="all">Video Tutorial: All</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</select>
				<svg
					class="dropdown-icon"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>

			{#if devModeState.active}
				<div class="select-wrapper">
					<select bind:value={completion} aria-label="Completion Status">
						<option value="all">Status: All</option>
						<option value="completed">Completed</option>
						<option value="not_completed">Not Completed</option>
						<option value="coming_soon">Coming Soon</option>
					</select>
					<svg
						class="dropdown-icon"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Refreshed styles to resolve virtual module loading issues in Vite */
	.filters {
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
		align-items: center;
		width: 100%;
	}

	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 0;
		max-width: 400px;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.55em 0.75em 0.55em 2.2em;
		background: rgba(126, 130, 140, 0.05); /* Very subtle tint instead of solid bg-card */
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-body);
		font-family: var(--font-body);
		font-size: 0.88rem;
		transition:
			border-color 0.1s ease,
			background-color 0.1s ease,
			box-shadow 0.1s ease;
		outline: none;
	}

	.search-input::placeholder {
		color: var(--text-muted);
	}

	.search-input:focus {
		background: transparent;
		border-color: var(--text-primary);
		box-shadow: var(--glow-cyan);
	}

	.filter-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5em 1em;
		background: transparent; /* Removed solid background */
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.12s ease;
	}

	.filter-toggle:hover {
		border-color: var(--text-primary);
		color: var(--text-primary);
		background: rgba(116, 215, 237, 0.04);
	}

	.filter-toggle.expanded {
		background: rgba(116, 215, 237, 0.08);
		color: var(--text-primary);
		border-color: var(--text-primary);
	}

	.filter-options {
		display: flex;
		gap: 0.75rem;
		white-space: nowrap;
		overflow: hidden;
	}

	.select-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	select {
		appearance: none;
		background: transparent; /* Removed solid background */
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-body);
		font-size: 0.88rem;
		padding: 0.5em 2.2em 0.5em 1em;
		cursor: pointer;
		outline: none;
		transition: border-color 0.1s ease;
	}

	select:focus {
		border-color: var(--accent-green);
	}

	.dropdown-icon {
		position: absolute;
		right: 0.75rem;
		pointer-events: none;
		color: var(--text-muted);
	}
</style>
