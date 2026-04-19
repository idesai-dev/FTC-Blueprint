<script lang="ts">
	import PIDVisualizer from '$lib/components/PIDVisualizer.svelte';
	import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>PID Tuner | Blueprint</title>
	<meta
		name="description"
		content="An interactive tool for tuning PID control algorithms for FTC robots."
	/>
</svelte:head>

<section class="pid-page">
	<div class="container container--narrow">
		<header class="pid-header text-center animate-fade-up">
			<span class="badge">Advanced Tools</span>
			<h1>PID Control Tuner</h1>
			<p class="subtitle">
				Tuning PID (Proportional, Integral, Derivative) constants is one of the most common tasks in
				FTC. Use this interactive simulator to understand how each constant affects your robot's
				behavior.
			</p>
		</header>

		<div class="visualizer-wrap animate-fade-up" style="animation-delay: 100ms">
			<PIDVisualizer />
		</div>

		<div class="content animate-fade-up" style="animation-delay: 200ms">
			<h2>How it Works</h2>
			<div class="grid-2">
				<div class="card">
					<h3>1. The Setup</h3>
					<p>
						The simulator models a robot mechanism (like an arm or drivetrain) trying to reach a
						target <strong>(the dashed green line)</strong>. The cyan circle represents your robot.
					</p>
				</div>
				<div class="card">
					<h3>2. Tuning Guide</h3>
					<ul>
						<li>
							<strong>P:</strong> Start here. Increase until you see the robot moving quickly but oscillating.
						</li>
						<li><strong>D:</strong> Add this to stop the shaking. It acts as a "brake."</li>
						<li>
							<strong>I:</strong> Use sparingly. It fixes small gaps if the robot stops slightly before
							the target.
						</li>
					</ul>
				</div>
			</div>

			<div class="callout animate-fade-up" style="animation-delay: 300ms">
				<h3>Want to implement this in code?</h3>
				<p>
					Our comprehensive PID guide covers all the theory and provides a ready-to-use Java
					implementation.
				</p>
				<a href="/software/pid-control" class="btn">View PID Guide →</a>
			</div>
		</div>
	</div>
</section>

<style>
	.pid-page {
		padding: 6rem 0;
	}

	.pid-header {
		margin-bottom: 4rem;
	}

	h1 {
		font-size: clamp(2.5rem, 8vw, 4rem);
		margin: 1rem 0;
	}

	.subtitle {
		font-size: 1.15rem;
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.visualizer-wrap {
		margin-bottom: 4rem;
	}

	.content h2 {
		margin-bottom: 2rem;
		text-align: center;
	}

	.grid-2 {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.card {
		background: var(--bg-card);
		border: 1px solid var(--border);
		padding: 2rem;
		border-radius: var(--radius-lg);
	}

	.card h3 {
		margin-bottom: 1rem;
		color: var(--accent-cyan);
	}

	.card p,
	.card li {
		color: var(--text-body);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.card ul {
		list-style: none;
		padding: 0;
	}

	.card li {
		margin-bottom: 0.75rem;
	}

	.callout {
		background: var(--gradient-hero);
		border: 1px solid var(--border-subtle);
		padding: 3rem 2rem;
		border-radius: var(--radius-xl);
		text-align: center;
		margin-top: 4rem;
	}

	.callout h3 {
		margin-bottom: 1rem;
	}

	.callout p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	.badge {
		display: inline-block;
		padding: 0.3rem 0.8rem;
		background: rgba(116, 215, 237, 0.1);
		color: var(--accent-cyan);
		border-radius: var(--radius-pill);
		font-size: 0.75rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.btn {
		display: inline-block;
		padding: 0.8rem 1.8rem;
		background: var(--gradient-accent);
		color: white;
		border-radius: var(--radius-md);
		text-decoration: none;
		font-weight: 600;
		transition: transform 0.2s;
	}

	.btn:hover {
		transform: translateY(-2px);
	}
</style>
