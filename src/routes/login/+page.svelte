<script lang="ts">
import { GoogleAuthProvider, type User } from "firebase/auth";
import { getAuth, signInWithRedirect ,getRedirectResult,onAuthStateChanged } from "firebase/auth";
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
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.setCustomParameters({
  hd: "sk-thonburi.ac.th"
});
const auth = getAuth();
let uid:string;
auth.useDeviceLanguage();
let email:string|null;
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

//let email = auth.currentUser?.displayName
</script>
    
<h1>{auth.currentUser}</h1>
<h1>{uid}</h1>
{email}
<button on:click={() => signInWithRedirect(auth, provider)}>dadad</button>