document.getElementById("selectimage").onchange = evt => {
    const [file] = document.getElementById("selectimage").files
    document.getElementById("image").src = URL.createObjectURL(file)
}

function addUser(){
    var email = document.getElementById("email").value;
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var confirmpassword = document.getElementById("confirmpassword").value;
    if(ValidateEmail(email)){
        if(password == confirmpassword){
            firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
                var user = userCredential.user;
                
                user.updateProfile({
                    email: email,
                    password: password,
                    displayName: name,
                    photoURL: 'https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/userImage%2F0000000001.jpg?alt=media&token=8158c011-5db0-44ad-9681-1e4fd1f93a07'
                }).then(() => {
                    alert("สร้างบัญชีใหม่เรียบร้อย")
                    document.location='index.html';
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                });
            });
        }else{alert("password ไม่ตรงกัน")}
    }else{alert("You have entered an invalid email address!")}
}

function ValidateEmail(mail){
    if (mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
           return (true)
       }
       return (false)
   }