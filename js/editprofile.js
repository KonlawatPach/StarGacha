var cerrentuser;
var nopic = false;
var pictureChange = false;
var passwordChange = false;

firebase.auth().onAuthStateChanged((ceruser) => {
    cerrentuser = ceruser;
    $("#email").html("Email : " + ceruser.email);
    db.collection("user").doc(ceruser.uid).get().then((user) => {
        document.getElementById("image").src = user.data().pic;
        document.getElementById("name").value = user.data().name;
    });
});

document.getElementById("selectimage").onchange = evt => {
    const [file] = document.getElementById("selectimage").files
    document.getElementById("image").src = URL.createObjectURL(file)
    nopic = false;
    pictureChange = true;
}

function clearImage(){
    document.getElementById("image").src = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/noprofile.png?alt=media&token=3e4fa5e8-7f96-4b74-848f-d2de186fcd0c";
    document.getElementById("selectimage").value = null;
    nopic = true;
    pictureChange = true;
}

function changePass(){
    if(document.getElementById("changepass").style.display == "block"){
        document.getElementById("changepass").style.display = "none";
        document.getElementById("oldpassword").value = "";
        document.getElementById("newpassword").value = "";
        passwordChange = false;
    } 
    else{
        document.getElementById("changepass").style.display = "block";
        passwordChange = true;
    }
}

//hit button - picture, name, Opass, Npass
async function saveChange(){
    //picture
    var path;

    //name
    var name = document.getElementById("name").value;

    //password
    if(passwordChange){
        changeProfile = true;
        var oldpassword = document.getElementById("oldpassword").value;
        var newpassword = document.getElementById("newpassword").value;
        firebase.auth().signInWithEmailAndPassword(cerrentuser.email, oldpassword).then(async (userCredential) => {
            firebase.auth().currentUser.updatePassword(newpassword);
            if(pictureChange){
                if(nopic){
                    path = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/noprofile.png?alt=media&token=3e4fa5e8-7f96-4b74-848f-d2de186fcd0c";
                }
                else{
                    var file = document.querySelector("#selectimage").files[0];
                    if(file !== undefined){
                        var metadata = { contentType:file.type }
                        let img = ref.child("userImage/" + cerrentuser.uid + ".jpg")
                        await img.put(file, metadata)
                        await img.getDownloadURL().then(function(url) {
                            path = url;
                        });
                    }
                }
                await db.collection("user").doc(cerrentuser.uid).update({
                    name: name,
                    pic: path
                })
                firebase.auth().currentUser.updateProfile({
                    displayName: name,
                    photoURL: path
                }).then(() => { alert("เปลี่ยนแปลงโปรไฟล์เรียบร้อย"); document.location = 'viewprofile.html'; })
            }
            else{
                await db.collection("user").doc(cerrentuser.uid).update({
                    name: name
                })
                firebase.auth().currentUser.updateProfile({
                    displayName: name
                }).then(() => { alert("เปลี่ยนแปลงโปรไฟล์เรียบร้อย"); document.location = 'viewprofile.html'; })
            }

        })
        .catch((error) => {
            alert("กรอกรหัสผ่านเก่าผิด")
        });
    }

    else{
        if(pictureChange){
            if(nopic){
                path = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/noprofile.png?alt=media&token=3e4fa5e8-7f96-4b74-848f-d2de186fcd0c";
            }
            else{
                var file = document.querySelector("#selectimage").files[0];
                if(file !== undefined){
                    var metadata = { contentType:file.type }
                    let img = ref.child("userImage/" + cerrentuser.uid + ".jpg")
                    await img.put(file, metadata)
                    await img.getDownloadURL().then(function(url) {
                        path = url;
                    });
                }
            }
            await db.collection("user").doc(cerrentuser.uid).update({
                name: name,
                pic: path
            })
            firebase.auth().currentUser.updateProfile({
                displayName: name,
                photoURL: path
            }).then(() => { alert("เปลี่ยนแปลงโปรไฟล์เรียบร้อย"); document.location = 'viewprofile.html'; })
        }
        else{
            await db.collection("user").doc(cerrentuser.uid).update({
                name: name
            })
            firebase.auth().currentUser.updateProfile({
                displayName: name
            }).then(() => { alert("เปลี่ยนแปลงโปรไฟล์เรียบร้อย"); document.location = 'viewprofile.html'; })
        }
    }    
}

function DeleteAcc(){
    document.getElementById("myModaldelete").style.display = "block";
    document.getElementById("modalcontentdelete").style.display = "none";
    $("#modalcontentdelete").slideDown(200);
}

function acceptDel(){
    changeProfile = true;
    let delemail = document.getElementById("delemail").value;
    let delpassword = document.getElementById("delpassword").value;
    if(cerrentuser.email == delemail){
        firebase.auth().signInWithEmailAndPassword(delemail, delpassword).then((userCredential) => {
            firebase.auth().currentUser.delete().then(() => {
                alert("ลบบัญชีสำเร็จ")
                document.location = 'viewprofile.html';
            }).catch((error) => {
                alert("")
            });
        }).catch((error) => {
            alert("กรอกรหัสผ่านหรืออีเมลล์ของท่านผิด")
        });
    }else{
        alert("กรอกรหัสผ่านหรืออีเมลล์ของท่านผิด")
    }
    
}

function closeModelDelete(){
    $("#modalcontentdelete").slideUp()
    document.getElementById("myModaldelete").style.display = "none";
}