import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCslNU5SSHhIpYvwDqQeo7-0vd-WfGlfRk",
  authDomain: "minder-7d9a9.firebaseapp.com",
  projectId: "minder-7d9a9",
  storageBucket: "minder-7d9a9.appspot.com",
  messagingSenderId: "1049049411761",
  appId: "1:1049049411761:web:370e9a4e7b336173627290",
  measurementId: "G-RWCV0QLH38",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();

export default db;
