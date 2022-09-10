<script lang="ts">
	import {
		DatePicker,
		DatePickerInput,
		FormGroup,
		InlineNotification,
		NumberInput,
		Select,
		SelectItem,
SkeletonPlaceholder,
Toolbar,
ToolbarContent,
ToolbarSearch
	} from 'carbon-components-svelte';
	import { Form, Tile } from 'carbon-components-svelte';
	import { Button, DataTable } from 'carbon-components-svelte';
	import {
		Header,
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import {
		getAuth,
		getIdTokenResult,
		GoogleAuthProvider,
		onAuthStateChanged,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	import { onMount } from "svelte";
	let items: Promise<Item[]> = fetch("https://ballapi.sencha.moe/api/Balls/Public").then(res => res.json()).catch((err) => {console.error("jsonerr",err)});

	// let items = JSON.parse('[{"name":"basketball","stockLeft":68},{"name":"volleyball","stockLeft":416},{"name":"basketball","stockLeft":2}]');
	
	interface Item {
		name: string;
		stockLeft: number;
	}


	import { initializeApp } from 'firebase/app';
import { json } from '@sveltejs/kit';
	const firebaseConfig = {
		apiKey: 'AIzaSyDNUkyCXJPxazOkVAV8TLGq6A_XGRZYAew',

		authDomain: 'iswork-d8ed0.firebaseapp.com',

		projectId: 'iswork-d8ed0',

		storageBucket: 'iswork-d8ed0.appspot.com',

		messagingSenderId: '505907623169',

		appId: '1:505907623169:web:72f8d25ab0874cd6111700'
	};

	initializeApp(firebaseConfig);
	let admin = false;

	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({
		hd: 'sk-thonburi.ac.th'
	});
	const auth = getAuth();
	let uid: string;
	auth.useDeviceLanguage();
	let email: string | null;
	let token:string|null;
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			uid = user.uid;
			//user =user.email;
			email = user.email;
			// ...
			user.getIdTokenResult(true).then((idTokenResult) => {
				console.log(idTokenResult.claims);
				admin = (idTokenResult.claims.admin as unknown as boolean)
				console.log("idtoken: ",idTokenResult.token)
				token = idTokenResult.token;
			})
		} else {
			// User is signed out
			// ...
		}
	});

	// let preview = items.map((item, index) => {
	// 	return Object.assign(item, { id: index });
	// });
	let start: string | undefined;
	let end: string | undefined;
	function checkHoliday(ddmmyy: string | undefined) {
		console.log(ddmmyy);
		if (ddmmyy === undefined || ddmmyy === '') {
			return false;
		}
		let d = ddmmyy.split('/');
		let dat = new Date(`${d[2]}-${d[1]}-${d[0]}T00:00:00.000+07:00`).getDay();
		if (dat === 0 || dat === 6) {
			return true;
		}
		return false;
	}
	

let selected: any;

async function form(e:SubmitEvent) {
	
			e.preventDefault();
			const resp = await fetch("", {
    method: "POST",
    body: new URLSearchParams(new FormData((e.target as HTMLFormElement))),
  });
  //const body = resp.json();
  //console.log(body);
			console.log('submit', Object.fromEntries(new FormData((e.target as HTMLFormElement)).entries()));
		
}


</script>

<Header company="SKT" platformName="Balls app" />

<Content>
	<Tile light>
		<Grid fullWidth
			><Row noGutter>
				{#if email}
					<Column noGutter lg={8}><h2>{admin ? "[admin] " : ""} {email}</h2></Column><Column />
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
				<Column noGutter lg={8}><h2>ยังไม่ได้ลงชื่อเข้าใช้</h2></Column><Column />
				<Column noGutter lg={2}
						>	
				<Button kind="primary" on:click={() => signInWithRedirect(auth, provider)}
						>ลงชื่อเข้าใช้</Button
					></Column>
				{/if}</Row
			>
		</Grid>
	</Tile>
	{#await items}
	<Tile>
	<SkeletonPlaceholder style="height: 36rem; width: 100%" />
</Tile>
{:then itemss}
	<Tile>
		<h1>ยืมของ</h1>

		<DataTable
			sortable
			title="จำนวนของ"
			headers={[
				{ key: 'name', value: 'ชนิด', sort: false },
				{ key: 'stockLeft', value: 'จำนวน' }
			]}
			rows={itemss.map((item, index) => {
				 	return Object.assign(item, { id: index });
				 })}
		>
		<Toolbar>
			<ToolbarContent>
			  <ToolbarSearch
				persistent
				value=""
				shouldFilterRows
			  />
			</ToolbarContent>
		  </Toolbar>
		</DataTable>

		
		

	</Tile>
	<Form
		on:submit={form}
	>
		<Tile>
			<FormGroup>
				<Grid fullWidth noGutterLeft>
					<Row>
					<Column max={5}>
				<Select id="select-1" labelText="เลือกยืมของ" disabled={!email} bind:selected on:change={() => {console.log(selected)}} name="name">
					<SelectItem text="" disabled hidden />
					{#each itemss.map((e, index) => {
						return { id: index.toString(), name: e.name,stockLeft:e.stockLeft };
					}) as item}
						<SelectItem value={item.name} text={item.name} disabled={item.stockLeft === 0} />
					{/each}
				</Select></Column><Column max={3}>
				<NumberInput
  min={1}
  max={itemss.find(element => element.name === selected)?.stockLeft||1}
  value={1}
   id="amount" name="amount"
  hideSteppers={selected === ""}
  invalidText={selected !== "" ? `จำนวนต้องมีค่าระหว่าง 1 ถึง ${itemss.find(element => element.name === selected)?.stockLeft||1}` : 'กรุณาเลือกของ'}
  label="จำนวน"
/></Column></Row>
</Grid>

			</FormGroup>
			<FormGroup >
				<DatePicker
					datePickerType="range"
					bind:valueFrom={start}
					bind:valueTo={end}
					dateFormat="d/m/Y"
					disabled={!email}
					on:change
					id="uwu"
				>
				
					<Row>
						<Column noGutterRight>
					<DatePickerInput type="text" id="datemin" name="datemin"
						labelText="เริ่มต้นการยืม"
						invalid={checkHoliday(start)}
						invalidText={checkHoliday(start) ? 'ไม่รองรับวันหยุด' : undefined}
						disabled={!email}
						placeholder="dd/mm/yyyy"
					/></Column><Column noGutterLeft>
					<DatePickerInput type="text" id="datemax" name="datemax"
						labelText="จบการยืม"
						invalid={checkHoliday(end)}
						invalidText={checkHoliday(end) ? 'ไม่รองรับวันหยุด' : undefined}
						disabled={!email}
						placeholder="dd/mm/yyyy"
					/>
					</Column>
				</Row>
			
				</DatePicker>
				{#if start && end}
					{start}-{end}
				{/if}
			</FormGroup>

			<Button type="submit"  disabled={!email || selected === "" }>ยืม</Button>
		</Tile>
		
	</Form>
	{:catch err}
	



<InlineNotification
title="Error:"
subtitle={`{err}`}
/>


	{/await}
	{#if admin}
admin

<Button on:click={() => {fetch("https://ballapi.sencha.moe/api/Balls/",{headers:{'Authorization':`Bearer ${token}`}}).then(res => res.json()).then(console.log)}}>test token</Button>



{/if}
</Content>

<style lang="scss">
	#uwu {
		.bx--date-picker-container {
	align-items:start !important;
	justify-content:start !important;
}}
	$css--reset: false;
	@import 'carbon-components-svelte/css/all.css';

</style>
