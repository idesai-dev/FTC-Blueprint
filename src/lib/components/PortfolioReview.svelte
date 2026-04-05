<script lang="ts">
	import { fade } from 'svelte/transition';
	let { isHeader = false } = $props();

	let isSubmitting = $state(false);
	let isSent = $state(false);
	let submitText = $state('Send Portfolio');
	let showForm = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (isSubmitting || isSent) return;

		isSubmitting = true;
		submitText = 'Sending...';

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const object = Object.fromEntries(formData.entries());
		const json = JSON.stringify(object);

		try {
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: json
			});

			if (response.ok) {
				isSent = true;
				form.reset();
				setTimeout(() => {
					showForm = false;
					isSent = false;
					submitText = 'Send Portfolio';
				}, 5000);
			} else {
				submitText = 'Error!';
				setTimeout(() => (submitText = 'Send Portfolio'), 3000);
			}
		} catch (error) {
			console.error(error);
			submitText = 'Error!';
			setTimeout(() => (submitText = 'Send Portfolio'), 3000);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section class="portfolio-section animate-fade-up" class:is-header={isHeader} class:form-open={showForm}>
	<div class="portfolio-content">
		<div class="text-side">
			{#if !isHeader}
				<span class="tag tag--yellow">Rookie Teams</span>
			{/if}
			<h2>Engineering Portfolio Review</h2>
			<p>
				Share your portfolio with us! We'll provide detailed feedback to help you <strong>excel and get an award!</strong>
			</p>
			
			<p class="reminder-box">
				<strong>Reminder:</strong> Give commenting access to 
				<code class="email-code">ftcblueprint@gmail.com</code> again.
			</p>
			
			{#if !showForm}
				<button class="btn-primary" onclick={() => showForm = true}>
					Get Review
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<polyline points="12 5 19 12 12 19"></polyline>
					</svg>
				</button>
			{/if}
		</div>

		{#if showForm}
			<div class="form-side" transition:fade>
				{#if isSent}
					<div class="success-message" transition:fade>
						<div class="success-icon">✓</div>
						<h3>Portfolio Received!</h3>
						<p>We'll get back to you shortly at the email provided.</p>
						<button class="btn-ghost" onclick={() => showForm = false}>Close</button>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="review-form">
						<input type="hidden" name="access_key" value="4b594ea5-d8dd-4fe1-8302-389b8f60f022" />
						<input type="hidden" name="subject" value="New Portfolio Review Request" />
						
						<div class="form-row">
							<input type="text" name="team" placeholder="Team Name & Number" required />
							<input type="email" name="email" placeholder="Contact Email" required />
						</div>
						<input type="text" name="portfolio_link" placeholder="Link to Portfolio (Drive...)" required />
						<textarea name="notes" placeholder="Notes (Areas to focus on, awards you're chasing...)" rows="2"></textarea>
						
						<div class="form-actions">
							<button type="button" class="btn-ghost" onclick={() => showForm = false}>Cancel</button>
							<button type="submit" class="btn-submit" disabled={isSubmitting}>{submitText}</button>
						</div>
					</form>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.portfolio-section {
		margin: 2rem 0;
		padding: 2.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: 0 4px 24px rgba(0,0,0,0.06);
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.portfolio-section.is-header {
		margin: 0;
		padding: 1.75rem;
		background: rgba(140, 130, 110, 0.05);
		border: 1px solid var(--border-subtle);
		box-shadow: none;
		max-width: 500px;
	}

	.portfolio-section.form-open.is-header {
		max-width: 600px;
	}

	.portfolio-content {
		display: flex;
		gap: 2rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.text-side {
		flex: 1;
		min-width: 260px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.is-header h2 {
		font-size: 1.4rem;
	}

	h2 {
		font-size: 1.75rem;
		margin: 0;
		background: var(--gradient-accent);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	p {
		color: var(--text-secondary);
		line-height: 1.5;
		font-size: 0.95rem;
		margin: 0;
	}

	.reminder-box {
		font-size: 0.85rem;
		padding: 0.75rem 1rem;
		background: rgba(189, 157, 68, 0.08);
		border-left: 3px solid var(--accent-yellow);
		border-radius: 4px;
	}

	.email-code {
		background: var(--bg-secondary);
		padding: 0.1rem 0.3rem;
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 0.9em;
		color: var(--accent-yellow);
	}

	.form-side {
		flex: 1.4;
		min-width: 300px;
		background: var(--bg-card);
		padding: 1.5rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		box-shadow: 0 8px 30px rgba(0,0,0,0.08);
	}

	.review-form { display: flex; flex-direction: column; gap: 0.75rem; }

	.form-row {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.form-row input {
		flex: 1;
		min-width: 140px;
	}

	input, textarea {
		padding: 0.75rem 0.9rem;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-family: var(--font-body);
		font-size: 0.9rem;
		transition: all var(--transition-fast);
		width: 100%;
	}

	input:focus, textarea:focus {
		outline: none;
		border-color: var(--accent-yellow);
		box-shadow: 0 0 0 3px rgba(189, 157, 68, 0.1);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	.success-message {
		text-align: center;
		padding: 1rem 0;
	}

	.success-icon {
		width: 40px;
		height: 40px;
		background: var(--accent-green);
		color: #000;
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-bottom: 0.75rem;
	}

	.btn-primary {
		align-self: flex-start;
		display: inline-flex; align-items: center; gap: 0.5rem;
		padding: 0.75rem 1.4rem;
		background: var(--gradient-accent);
		color: white; border: none; border-radius: var(--radius-md);
		font-weight: 700; cursor: pointer; transition: all var(--transition-fast);
		font-size: 0.9rem;
	}

	.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

	.btn-submit {
		padding: 0.75rem 1.25rem;
		background: var(--accent-yellow); color: #151515;
		border: none; border-radius: var(--radius-md);
		font-weight: 700; cursor: pointer; transition: all var(--transition-fast);
		font-size: 0.9rem;
	}

	.btn-ghost {
		background: transparent; border: 1px solid var(--border);
		color: var(--text-secondary); padding: 0.75rem 1rem;
		border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;
		font-size: 0.9rem;
	}

	@media (max-width: 900px) {
		.portfolio-section.is-header {
			max-width: 100%;
			margin-top: 2rem;
		}
	}

	@media (max-width: 480px) {
		.form-row { flex-direction: column; }
	}
</style>
