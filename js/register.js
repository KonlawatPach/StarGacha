document.getElementById("selectimage").onchange = evt => {
    const [file] = document.getElementById("selectimage").files
    document.getElementById("image").src = URL.createObjectURL(file)
}

let randomlist = ["จับฉลากเพื่อส่งต่อของ ให้แก่คนที่คุณรัก", "ทนอีกหน่อยนะ คุณจะได้สุ่มกาชาแล้ว", "กาชาสอยดาวมีโอกาสได้ของทุกชิ้นเท่ากัน", "สอยได้แต่ดาว สอยใจคุณไม่ได้", "มีของหลายอย่างสินะ มาลุ้นกันดีกว่า"]
$("#subHead").html(randomlist[Math.floor((Math.random()*10)%5)]);

function addUser(){
    var path;
    var email = document.getElementById("email").value;
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var confirmpassword = document.getElementById("confirmpassword").value;
    var file = document.querySelector("#selectimage").files[0];
    if(ValidateEmail(email)){
        if(password == confirmpassword){
            document.getElementById("myModal").style.display = "block";
            firebase.auth().createUserWithEmailAndPassword(email, password).then(async (userCredential) => {
                var user = userCredential.user;
                if(file !== undefined){
                    var metadata = { contentType:file.type }
                    let img = ref.child("userImage/" + user.uid + ".jpg")
                    await img.put(file, metadata)
                    await img.getDownloadURL().then(function(url) {
                        path = url;
                    });
                }
                else{
                    path = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/noprofile.png?alt=media&token=3e4fa5e8-7f96-4b74-848f-d2de186fcd0c";
                }
                await db.collection("user").doc(user.uid).set({
                    name: name,
                    makeroom:[],
                    joinroom:[],
                    waitroom:[],
                    pic: path
                })
                user.updateProfile({
                    email: email,
                    password: password,
                    displayName: name,
                    photoURL: path
                }).then(() => {
                    document.getElementById("myModal").style.display = "none";
                    alert("สร้างบัญชีใหม่เรียบร้อย")
                    document.location='index.html';
                }).catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode)
                    document.getElementById("myModal").style.display = "none";
                    alert(errorMessage)
                });
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode)
                document.getElementById("myModal").style.display = "none";
                alert(errorMessage)
            });
        }else alert("password ไม่ตรงกัน")
    }else alert("You have entered an invalid email address!")
}

function ValidateEmail(mail){
    if (mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
        return (true)
    }
    return (false)
}

function send(){
    var file = document.querySelector("#inputGroupFile01").files[0]
    var name = file.name
    const metadata = {
        contentType:file.type
    }
    const task = ref.child(name).put(file, metadata)
}