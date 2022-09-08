<script lang="ts">

	import { DatePicker, DatePickerInput, FormGroup, HeaderUtilities, Select, SelectItem } from 'carbon-components-svelte';
	import { Dropdown, Form, Tile } from 'carbon-components-svelte';
	import {
		StructuredList,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		StructuredListBody
	} from 'carbon-components-svelte';
	import { Button , DataTable } from 'carbon-components-svelte';
	interface item {
		name: string;
		amount: number;
	}

	let items: item[] = [
				{ amount: 727, name: 'Basketball'},
				{ amount: 420, name: 'Football'},
				{ amount: 69, name: 'Volleyball' }
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
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		SkipToContent,
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
let preview = items.map((item,index) => {return Object.assign(item,{id:index})});
let checkend = false;
let start:string|undefined;
let end:string|undefined;
let startinvalid:boolean = false;
let endinvalid:boolean = false;
function checkHoliday(ddmmyy:string|undefined) {
	console.log(ddmmyy);
	if (ddmmyy === undefined || ddmmyy === "") {
		return false;
	}
	let d = ddmmyy.split("/");
	let dat = new Date(`${d[2]}-${d[1]}-${d[0]}T00:00:00.000+07:00`).getDay();
	//@ts-ignore
	if (dat=== 0) {
		return true;
	}
	if (dat === 6) {
		return true;
	}
		return false;

}
</script>

<Header company="SKT" platformName="Balls app" />

<Content>
	<Tile light>
		<Grid fullWidth
			><Row noGutter>
				{#if email}
					<Column noGutter lg={8}><h2>{email}</h2></Column><Column />
					<Column noGutter lg={2}
						><Button
							kind="tertiary"
							on:click={() =>
								signOut(auth)
									.then(() => {
										// Sign-out successful.
										email = null;
									})
									.catch((error) => {
										console.error(error);
										// An error happened.
									})}>ออกจากระบบ</Button
						></Column
					>
				{:else}
					<Button kind="tertiary" on:click={() => signInWithRedirect(auth, provider)}
						>ลงชื่อเข้าใช้</Button
					>
				{/if}</Row
			>
		</Grid>
	</Tile>
	<Tile>
	<h1>ยืมของ</h1>



		<DataTable sortable title="จำนวนของ" headers={[{key:"name",value:"ชนิด",sort:false},{key:"amount",value:"จำนวน"}]} rows={preview}
		></DataTable>
	</Tile>
		<Form
		on:submit={(e) => {
			e.preventDefault();
			console.log('submit', e);
		}}
	>
	<Tile>
	<FormGroup>
		<Select id="select-1" labelText="เลือกยืมของ" value="placeholder-item">
			<SelectItem
				text=""
				disabled hidden
			/>
			{#each items.map((e, index) => {
				return { id: index.toString(), text: e.name };
			}) as item}
			<SelectItem value={item.text} text={item.text} />
			{/each}
	
	
		</Select>
	</FormGroup>
	<FormGroup>
		<DatePicker datePickerType="range" bind:valueFrom={start} bind:valueTo={end} dateFormat="d/m/Y"  on:change>
			<DatePickerInput labelText="เริ่มต้นการยืม"  invalid={checkHoliday(start)} invalidText={checkHoliday(start) ? "ไม่รองรับวันหยุด" : undefined} placeholder="dd/mm/yyyy" />
			<DatePickerInput labelText="จบการยืม"  invalid={checkHoliday(end)} invalidText={checkHoliday(end) ? "ไม่รองรับวันหยุด" : undefined} placeholder="dd/mm/yyyy" />
		</DatePicker>
		{#if start && end}
		{start}-{end}
	{/if}
	</FormGroup>

		<Button type="submit">ยืม</Button>
		</Tile>	</Form>
</Content>

<style lang="scss">
	$css--reset: false;
	@import 'carbon-components-svelte/css/all.css';
</style>
