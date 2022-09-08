<script lang="ts">
	import { error } from '@sveltejs/kit';

	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';
	import { Dropdown, Form } from 'carbon-components-svelte';
	import {
		StructuredList,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		StructuredListBody
	} from 'carbon-components-svelte';
	import { Button } from 'carbon-components-svelte';
	interface item {
		name: string;
		amount: number;
	}

	let items: item[] = [
		{ name: 'Volleyball', amount: 69 },
		{ name: 'Basketball', amount: 727 },
		{ name: 'Football', amount: 420 }
	];

	import { initializeApp } from 'firebase/app';
	const firebaseConfig = {
		apiKey: 'AIzaSyDNUkyCXJPxazOkVAV8TLGq6A_XGRZYAew',

		authDomain: 'iswork-d8ed0.firebaseapp.com',

		projectId: 'iswork-d8ed0',

		storageBucket: 'iswork-d8ed0.appspot.com',

		messagingSenderId: '505907623169',

		appId: '1:505907623169:web:72f8d25ab0874cd6111700'
	};

	initializeApp(firebaseConfig);

	import {
		getAuth,
		getRedirectResult,
		GoogleAuthProvider,
		onAuthStateChanged,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({
		hd: 'sk-thonburi.ac.th'
	});
	const auth = getAuth();
	let uid: string;
	auth.useDeviceLanguage();
	let email: string | null;
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			uid = user.uid;
			//user =user.email;
			email = user.email;
			// ...
		} else {
			// User is signed out
			// ...
		}
	});
</script>

{#if !email}
	<Button on:click={() => signInWithRedirect(auth, provider)}>Login</Button>
{:else}
	<h1>{email}</h1>
	<Button
		on:click={() =>
			signOut(auth)
				.then(() => {
					// Sign-out successful.
					email = null;
				})
				.catch((error) => {
					console.error(error);
					// An error happened.
				})}>Sign out</Button
	>
{/if}

<h1>ยืมของ</h1>

<Form
	on:submit={(e) => {
		e.preventDefault();
		console.log('submit', e);
	}}
>
	<Dropdown
		titleText="ยืม"
		selectedId="0"
		items={items.map((e, index) => {
			return { id: index.toString(), text: e.name };
		})}
	/>

	<h2>จำนวนของ</h2>
	<StructuredList>
		<StructuredListHead>
			<StructuredListRow head>
				<StructuredListCell head>ชนิด</StructuredListCell>
				<StructuredListCell head>จำนวน</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			{#each items as item}
				<StructuredListRow>
					<StructuredListCell noWrap>{item.name}</StructuredListCell>
					{item.amount}
				</StructuredListRow>
			{/each}
		</StructuredListBody>
	</StructuredList>

	<h2>ระยะเวลาการยืม</h2>
	<DatePicker datePickerType="range" on:change>
		<DatePickerInput labelText="เริ่มต้นการยืม" placeholder="mm/dd/yyyy" />
		<DatePickerInput labelText="จบการยืม" placeholder="mm/dd/yyyy" />
	</DatePicker>

	<Button type="submit">ยืม</Button>
</Form>

<style lang="scss">
	$css--reset: false;
	@import 'carbon-components-svelte/css/all.css';
</style>
