<script lang="ts">
	import toast from 'svelte-5-french-toast';
	let theme = $state<'dark' | 'light'>('light');

	$effect(() => {
		theme = (document.documentElement.className as 'dark' | 'light') || 'light';
	});

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.className = theme;
		localStorage.setItem('theme', theme);
	}
</script>

<button
	id="theme-toggle"
	onclick={toggle}
	class="toggle-btn"
	aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
>
	{#if theme === 'dark'}
		<!-- Sun icon -->
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
			/>
		</svg>
	{:else}
		<!-- Moon icon -->
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	{/if}
</button>

<style>
	.toggle-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--text-primary);
		cursor: pointer;
		transition:
			background var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.toggle-btn:hover {
		background: var(--bg-card-hover);
		border-color: var(--text-primary);
		box-shadow: var(--glow-cyan);
	}

	.toggle-btn:active {
		transform: scale(0.94);
	}
</style>
