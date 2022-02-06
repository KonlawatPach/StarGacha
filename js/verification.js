firebase.auth().onAuthStateChanged((user) => {
    if(!user.emailVerified){
        firebase.auth().currentUser.sendEmailVerification();
    }
    else{
        document.location='home.html'
    }
});