<script lang="ts">
	import { fade } from 'svelte/transition';
	let isSubmitting = $state(false);
	let isSent = $state(false);
	let submitText = $state('Submit Portfolio');
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
					submitText = 'Submit Portfolio';
				}, 5000);
			} else {
				submitText = 'Error!';
				setTimeout(() => (submitText = 'Submit Portfolio'), 3000);
			}
		} catch (error) {
			console.error(error);
			submitText = 'Error!';
			setTimeout(() => (submitText = 'Submit Portfolio'), 3000);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section class="portfolio-section animate-fade-up">
	<div class="portfolio-content">
		<div class="text-side">
			<span class="tag tag--yellow">Rookie Teams</span>
			<h2>Engineering Portfolio Review</h2>
			<p>
				Share your portfolio with us! We'll provide detailed feedback to help you excel. <br>
				<strong>Reminder:</strong> Please give commenting access to 
				<code class="email-code">ftcblueprint@gmail.com</code>.
			</p>
			<p class="small-note">Feel free to reach out by email if you need anything!</p>
			
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
						<p>We've received your request and will get back to you shortly at the email provided.</p>
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
						<input type="text" name="portfolio_link" placeholder="Link to Portfolio (Google Drive...)" required />
						<textarea name="notes" placeholder="Notes (Specific areas?, Specific awards your team is going for?, etc.)" rows="2"></textarea>
						
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
		position: relative;
	}

	.portfolio-content {
		display: flex;
		gap: 3rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.text-side {
		flex: 1;
		min-width: 300px;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	h2 {
		font-size: 1.75rem;
		margin: 0.25rem 0;
		background: var(--gradient-accent);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	h3 { margin-bottom: 0.5rem; color: var(--accent-green); }

	p {
		color: var(--text-secondary);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.email-code {
		background: var(--bg-secondary);
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--accent-yellow);
		border: 1px solid rgba(189, 157, 68, 0.2);
	}

	.small-note { font-size: 0.85rem; opacity: 0.7; font-style: italic; }

	.form-side {
		flex: 1.2;
		min-width: 320px;
		background: var(--bg);
		padding: 2rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		box-shadow: 0 8px 30px rgba(0,0,0,0.04);
	}

	.review-form { display: flex; flex-direction: column; gap: 1.2rem; }

	.form-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.form-row input {
		flex: 1;
		min-width: 200px;
	}

	input, textarea {
		padding: 0.85rem 1.1rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-family: var(--font-body);
		font-size: 0.95rem;
		transition: all var(--transition-fast);
		width: 100%;
	}

	input:focus, textarea:focus {
		outline: none;
		border-color: var(--accent-yellow);
		box-shadow: 0 0 0 4px rgba(189, 157, 68, 0.1);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.success-message {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem 0;
	}

	.success-icon {
		width: 48px;
		height: 48px;
		background: var(--accent-green);
		color: #000;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.btn-primary {
		align-self: flex-start;
		display: flex; align-items: center; gap: 0.75rem;
		padding: 0.9rem 1.75rem;
		background: var(--gradient-accent);
		color: white; border: none; border-radius: var(--radius-md);
		font-weight: 700; cursor: pointer; transition: all var(--transition-fast);
	}

	.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.15); }

	.btn-submit {
		padding: 0.9rem 1.75rem;
		background: var(--accent-yellow); color: #151515;
		border: none; border-radius: var(--radius-md);
		font-weight: 700; cursor: pointer; transition: all var(--transition-fast);
	}

	.btn-submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }

	.btn-ghost {
		background: transparent; border: 1px solid var(--border);
		color: var(--text-secondary); padding: 0.9rem 1.5rem;
		border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;
	}
	.btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

	@media (max-width: 768px) {
		.portfolio-section { padding: 1.5rem; }
		.text-side { min-width: 100%; }
		.form-side { min-width: 100%; padding: 1.5rem; }
		.form-row { flex-direction: column; }
	}
</style>
