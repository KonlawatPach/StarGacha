function clearInput(){
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

function checkUser(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if(ValidateEmail(email)){
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
            firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
                var user = userCredential.user;
                user.photoURL = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/userImage%2F0000000001.jpg?alt=media&token=8158c011-5db0-44ad-9681-1e4fd1f93a07";
                document.location='home.html'
            })
            .catch((error) => {
                alert("ใส่พาสเวิร์ดผิด!")
            });
        })
    }
    else{
        alert("You have entered an invalid email address!")
    }
}

function ValidateEmail(mail){
 if (mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        return (true)
    }
    return (false)
}