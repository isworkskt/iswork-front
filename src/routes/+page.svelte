<script lang="ts">
    import { DatePicker, DatePickerInput } from "carbon-components-svelte";
    import { Dropdown, Form } from "carbon-components-svelte";
    import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";
interface item {
    name:string,
    amount:number
}

    let items:item[] = [{name:"Volleyball",amount:69},{name:"Basketball",amount:727},{name:"Football",amount:420}];



    import {initializeApp} from "firebase/app"
const firebaseConfig = {

apiKey: "AIzaSyDNUkyCXJPxazOkVAV8TLGq6A_XGRZYAew",

authDomain: "iswork-d8ed0.firebaseapp.com",

projectId: "iswork-d8ed0",

storageBucket: "iswork-d8ed0.appspot.com",

messagingSenderId: "505907623169",

appId: "1:505907623169:web:72f8d25ab0874cd6111700"

};

initializeApp(firebaseConfig);

    import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
const auth = getAuth();
let d = getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    let token = credential.accessToken;

    // The signed-in user info.
    let user = result.user;
    console.log(result);
    return result;
  }).catch((error) => {
    console.error(error);
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  </script>


{#await d}
  <h1>Loading...</h1>
{:then a}
  <h1>hi {a}</h1>
{/await}
<h1>ยืมของ</h1>

<Form
  on:submit={(e) => {
    e.preventDefault();
    console.log("submit", e);
  }}
>

<Dropdown
  titleText="ยืม"
  selectedId="0"
  items={items.map((e,index) => {return {id:index.toString(),text:e.name};})}
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
@import 'carbon-components/scss/globals/scss/_css--reset.scss';
@import 'carbon-components/scss/globals/scss/_css--font-face.scss';
@import 'carbon-components/scss/globals/scss/_css--helpers.scss';
@import 'carbon-components/scss/globals/scss/_css--body.scss';

// Optionally include the grid
@import 'carbon-components/scss/globals/grid/_grid.scss';

// Optionally include components that you need
@import 'carbon-components/scss/components/button/button';
@import 'carbon-components/scss/components/file-uploader/file-uploader';
@import "carbon-components-svelte/css/all.css";
// @import 'carbon-components/scss/components/date-picker/date-picker';

</style>