import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || 'v0.2.0-dev')
	}
});
