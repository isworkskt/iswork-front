import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';
import { optimizeImports,elements  } from "carbon-preprocess-svelte";
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(),optimizeImports(),elements({theme:"g100"})],

	kit: {
		adapter: adapter()
	}
};

export default config;
