import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || `v${pkg.version}`),
		__BUILD_TIME__: JSON.stringify(new Date().toLocaleString('en-US', { 
			hour: 'numeric', 
			minute: '2-digit', 
			hour12: true, 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric',
			timeZone: 'America/Chicago'
		}))
	}
});
