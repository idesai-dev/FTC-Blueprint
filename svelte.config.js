import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

export default {
    extensions: ['.svelte', '.md'],
    preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
    kit: {
        adapter: adapter({
            fallback: '404.html'
        })
    }
};