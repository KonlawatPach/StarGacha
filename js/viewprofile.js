//////////////////////////////////////////////////////////////////
var userid =  sessionStorage.getItem("userid");                 //
var prev =  sessionStorage.getItem("prev");                     //
//////////////////////////////////////////////////////////////////

var cerrentuserid;
firebase.auth().onAuthStateChanged((ceruser) => {
    cerrentuserid = ceruser.uid;
    db.collection("user").doc(userid).get().then((user) => {
        if(cerrentuserid == userid){
            document.getElementById("email").style.display = "block";
            document.getElementById("config").style.display = "inline";
            document.getElementById("signout").style.display = "block";
            $("#email").html("Email : " + ceruser.email);
        }
        document.getElementById("image").src = user.data().pic;
        $("#headname").html("ข้อมูลผู้ใช้ " + user.data().name);
        $("#name").html("ชื่อผู้ใช้ : " + user.data().name);
        $("#uid").html("รหัสผู้ใช้ : " + user.id);
    });
});

function signOut(){
    firebase.auth().signOut().then(() => {
        alert("ออกจากระบบเรียบร้อย")
        document.location = "index.html";
    })
}