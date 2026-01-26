const firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "authDomain",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var ref = firebase.storage().ref();