import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import autoprefixer from "autoprefixer";
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from "cssnano";
import { optimizeCss  } from "carbon-preprocess-svelte";
const config: UserConfig = {
	plugins: [sveltekit(),process.env.NODE_ENV === "production" && optimizeCss()],
	ssr: {
		noExternal: ['@carbon/charts', 'carbon-components']
	},
	css: {
		postcss:{plugins:[autoprefixer(),postcssPresetEnv(),cssnano({"preset":"advanced"})]}
	}
};

export default config;
