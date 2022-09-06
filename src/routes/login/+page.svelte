<script lang="ts">
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithRedirect } from "firebase/auth";
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
const auth = getAuth();
auth.useDeviceLanguage();

</script>
    

<button on:click={() => signInWithRedirect(auth, provider)}>dadad</button>