import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    // apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    apiKey: "AIzaSyBckF8jy-cLcv2w3HomoatHGBJPdccueAQ",
    authDomain: "bookat-87c98.firebaseapp.com",
    projectId: "bookat-87c98",
    storageBucket: "bookat-87c98.appspot.com",
    messagingSenderId: "901011445937",
    appId: "1:901011445937:web:72bd75f1edd8f98377ea90",
    measurementId: "G-9RS5W55F0B"
};

const Firebase = initializeApp(firebaseConfig);
const auth = getAuth(Firebase);
const storage = getStorage(Firebase)

export { Firebase, auth, storage };