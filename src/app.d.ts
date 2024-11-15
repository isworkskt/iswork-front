// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare" />
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}

	interface Platform {
		env: {
			iswork: KVNamespace;
		};
	}

	interface Session {}

	interface Stuff {}
}
