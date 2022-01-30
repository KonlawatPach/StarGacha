// firebase.auth().onAuthStateChanged((user) => {
//     console.log(user.photoURL)
//     document.getElementById("Displayname").textContent = user.displayName;
//     document.getElementById("imgProfile").src = user.photoURL;
// });

firebase.auth().onAuthStateChanged((user) => {
    if(!user){
        document.location='index.html';
    }
});