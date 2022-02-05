let randomlist = ["จับฉลากเพื่อส่งต่อของ ให้แก่คนที่คุณรัก", "สอยดาวได้ของ สอยคุณได้อะไร", "กาชาสอยดาวมีโอกาสได้ของทุกชิ้นเท่ากัน", "สอยได้แต่ดาว สอยใจคุณไม่ได้", "มีของหลายอย่างสินะ มาลุ้นกันดีกว่า"]
$("#subHead").html(randomlist[Math.floor((Math.random()*10)%5)]);



function clearInput(){
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

function setEmail(){
    document.getElementById("myModal").style.display = "block";
    document.getElementById("modalcontent").style.display = "none";
    $("#modalcontent").slideDown(200);
}

function closeModel(){
    $("#modalcontent").slideUp()
    document.getElementById("myModal").style.display = "none";
    document.getElementById("forgetemail").value = "";
}

function forgetPass(){
    let forgetemail = document.getElementById("forgetemail").value;
    document.getElementById("forgetsend").disabled = true;
    if(ValidateEmail(forgetemail)){
        firebase.auth().sendPasswordResetEmail(forgetemail).then(() => {
            alert("ส่งอีเมลล์ยืนยันไปแล้ว")
            document.getElementById("counter").style.display = "block";
            var count = 60, timer = setInterval(function() {
                $("#counter").html('ส่งอีเมลล์ยืนยันได้อีกครั้งใน ' + count-- +' วินาที');
                if(count == 0){
                    clearInterval(timer);
                    document.getElementById("forgetsend").disabled = false;
                    document.getElementById("counter").style.display = "none";
                }
            }, 1000);
        })
        .catch((error) => {
            alert("ส่งอีเมลล์ยืนยันผิดพลาด")
            document.getElementById("forgetsend").disabled = false;
        });
    }
    else{
        alert("You have entered an invalid email address!")
        document.getElementById("forgetsend").disabled = false;
    }
}