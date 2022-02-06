var changeProfile = false;
firebase.auth().onAuthStateChanged((user) => {
    if(!user && !changeProfile){
        document.location='index.html';
    }
    else if(!user.emailVerified){
        document.location='verification.html';
    }
});