import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

export default {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (message.includes('404')) {
					console.warn(`Warning: 404 on ${path} (linked from ${referrer})`);
					return;
				}
				throw new Error(message);
			},
			handleUnseenRoutes: 'ignore'
		}
	}
};
