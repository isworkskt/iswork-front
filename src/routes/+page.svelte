<script lang="ts">
	import {
		ExpandableTile,
		FormGroup,
		InlineNotification,
		ListItem,
		NumberInput,
		Select,
		SelectItem,
		SkeletonPlaceholder,
		Tab,
		TabContent,
		Tabs,
		TextInput,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		UnorderedList
	} from 'carbon-components-svelte';
	import { Form, Tile } from 'carbon-components-svelte';
	import { Button, DataTable } from 'carbon-components-svelte';
	import { Header, Content, Grid, Row, Column } from 'carbon-components-svelte';
	import {
		getAuth,
		GoogleAuthProvider,
		onAuthStateChanged,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';

	const API = 'http://localhost:5140';
	//const API = 'https://ballapi.sencha.moe';
	let items: Promise<Item[]> = fetch(`${API}/api/Balls/Public`).then((res) => res.json());

	interface user {
		email: string;
		amount: number;
		time: string;
	}

	// let items = JSON.parse('[{"name":"basketball","stockLeft":68},{"name":"volleyball","stockLeft":416},{"name":"basketball","stockLeft":2}]');

	interface Item {
		type: string;
		used: number;
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
	let token: string | null;
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
				admin = idTokenResult.claims.admin as unknown as boolean;
				console.log('idtoken: ', idTokenResult.token);
				token = idTokenResult.token;
			});
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

	interface balllog {
		type: string;
		amount: number;
		users: user[];
	}
	async function logs(): Promise<balllog[]> {
		let d = await fetch(`${API}/api/Balls/`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
		}).then((res) => res.json());
		return d as balllog[];
	}

	async function form(e: SubmitEvent) {
		e.preventDefault();
		//@ts-ignore
		let obj: { type: string; amount: number } = Object.fromEntries(
			new FormData(e.target as HTMLFormElement).entries()
		);
		const resp = await fetch(`${API}/api/Balls/${obj.type}/${obj.amount}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			//@ts-ignore
			body: new URLSearchParams(new FormData(e.target as HTMLFormElement))
		});
		const body = resp.json();
		console.log(body);
		console.log('submit', Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()));
		location.reload();
	}
	import '@carbon/styles/css/styles.css';
	import '@carbon/charts/styles.css';

	import { BarChartSimple } from '@carbon/charts-svelte';
	import type { interfaces } from '@carbon/charts';
	import Page from './login/+page.svelte';
	import { onMount } from 'svelte';
	function a(s: Item[]) {
		let a: { group: string; value: number }[] = [];
		s.forEach((e) => {
			a.push({ group: e.type, value: e.used });
		});

		return a;
	}
	let newobject = { name: '', amount: 1 };
	let success: any = null;
	let error: any = null;
</script>

<Header company="SKT" platformName="Balls app" />

<svelte:head>
	<title>SKT Balls app</title>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>
<Content>
	<Tile light>
		<Grid fullWidth
			><Row noGutter>
				{#if email}
					<Column noGutter lg={8}><h2>{admin ? '[admin] ' : ''} {email}</h2></Column><Column />
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
					<Column noGutter lg={2}>
						<Button kind="primary" on:click={() => signInWithRedirect(auth, provider)}
							>ลงชื่อเข้าใช้</Button
						></Column
					>
				{/if}</Row
			>
		</Grid>
	</Tile>
	{#await items}
		<Tile>
			<SkeletonPlaceholder style="height: 36rem; width: 100%" />
		</Tile>
	{:then itemss}
		<Tabs>
			<Tab label="ยืมของ" />
			{#if admin}
				<Tab label="Admin" />
			{/if}
			<svelte:fragment slot="content">
				<TabContent>
					<Tile>
						<h1>ยืมของ</h1>

						<DataTable
							sortable
							title="จำนวนของ"
							headers={[
								{ key: 'type', value: 'ชนิด', sort: false },
								{ key: 'stockLeft', value: 'จำนวน' }
							]}
							rows={itemss.map((item, index) => {
								return Object.assign(item, { id: index });
							})}
						>
							<Toolbar>
								<ToolbarContent>
									<ToolbarSearch persistent value="" shouldFilterRows />
								</ToolbarContent>
							</Toolbar>
						</DataTable>
					</Tile>
					<Form on:submit={form}>
						<Tile>
							<FormGroup>
								<Grid fullWidth noGutterLeft>
									<Row>
										<Column max={5}>
											<Select
												id="select-1"
												labelText="เลือกยืมของ"
												disabled={!email}
												bind:selected
												on:change={() => {
													console.log(selected);
												}}
												name="type"
											>
												<SelectItem text="" disabled hidden />
												{#each itemss.map((e, index) => {
													return { id: index.toString(), type: e.type, stockLeft: e.stockLeft };
												}) as item}
													<SelectItem
														value={item.type}
														text={item.type}
														disabled={item.stockLeft === 0}
													/>
												{/each}
											</Select></Column
										><Column max={3}>
											<NumberInput
												disabled={!email}
												min={1}
												max={itemss.find((element) => element.type === selected)?.stockLeft || 1}
												value={1}
												id="amount"
												name="amount"
												hideSteppers={selected === ''}
												invalidText={selected !== ''
													? `จำนวนต้องมีค่าระหว่าง 1 ถึง ${
															itemss.find((element) => element.type === selected)?.stockLeft || 1
													  }`
													: 'กรุณาเลือกของ'}
												label="จำนวน"
											/></Column
										></Row
									>
								</Grid>
							</FormGroup>
							<!-- <FormGroup>
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
											<DatePickerInput
												type="text"
												id="datemin"
												name="datemin"
												labelText="เริ่มต้นการยืม"
												invalid={checkHoliday(start)}
												invalidText={checkHoliday(start) ? 'ไม่รองรับวันหยุด' : undefined}
												disabled={!email}
												placeholder="dd/mm/yyyy"
											/></Column
										><Column noGutterLeft>
											<DatePickerInput
												type="text"
												id="datemax"
												name="datemax"
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
							</FormGroup> -->

							<Button type="submit" disabled={!email || selected === ''}>ยืม</Button>
						</Tile>
					</Form>
					<Tile>
						<Grid>
							<Row
								><Column sm={3}>
									<BarChartSimple
										theme="g100"
										data={a(itemss)}
										animations
										options={{
											title: 'จำนวนของที่ถูกยืมไปในวันนี้',
											height: '20rem',
											resizable: false,
											axes: {
												left: { mapsTo: 'value' },
												//@ts-ignore
												bottom: { mapsTo: 'group', scaleType: 'labels' }
											}
										}}
									/>
								</Column><Column>
									<DataTable
										sortable
										title="จำนวนของที่ถูกยืมไปในวันนี้"
										headers={[
											{ key: 'type', value: 'ชนิด', sort: false },
											{ key: 'used', value: 'ถูกยืมไป' }
										]}
										rows={itemss.map((item, index) => {
											return Object.assign(item, { id: index });
										})}
									/>
								</Column></Row
							>
						</Grid>
					</Tile>
				</TabContent>
				{#if admin}
					<TabContent>
						{#await logs()}
							<SkeletonPlaceholder style="height: 36rem; width: 100%" />
						{:then d}
							{#each d as f}
								<ExpandableTile>
									<div slot="above">
										{f.type}
									</div>
									<div slot="below">
										{#each [...f.users].reverse() as user}
											<UnorderedList>
												<b>{user.email}</b>
												<UnorderedList nested>
													<ListItem>เวลา: {new Date(user.time).toLocaleString()}</ListItem>
													<ListItem>จำนวน: {user.amount}</ListItem>
												</UnorderedList>
											</UnorderedList>
										{/each}
									</div>
								</ExpandableTile>
							{/each}
							<!-- {JSON.stringify(d)} -->
						{:catch e}
							{e}
						{/await}
						<Tile>
							Manage Objects
							{#if success !== null}
								<InlineNotification kind="success" title="Success " subtitle={success} />
							{/if}
							{#if error !== null}
								<InlineNotification title="Error:" subtitle={error} />
							{/if}
							<TextInput
								labelText="Object name"
								bind:value={newobject.name}
								placeholder="Enter object name.."
							/>
							<NumberInput label="Amount of object" bind:value={newobject.amount} />
							<Button
								on:click={() => {
									fetch(`${API}/api/Balls/`, {
										headers: {
											'Content-Type': 'application/json',
											Authorization: `Bearer ${token}`
										},
										method: 'POST',
										body: JSON.stringify({
											type: newobject.name,
											amount: newobject.amount,
											users: []
										})
									})
										.then((res) => res.text())
										.then((x) => {
											status = x;
											return x;
										})
										.then(console.log)
										.then(
											(value) => {
												success = value;
											},
											(reason) => {
												error = reason;
											}
										);
								}}>Add Object</Button
							>
						</Tile>
					</TabContent>
				{/if}
			</svelte:fragment>
		</Tabs>
	{:catch err}
		<InlineNotification title="Error " subtitle={err} />
	{/await}
</Content>

<style lang="scss">
@import "carbon-components-svelte/css/g100.css";
</style>
