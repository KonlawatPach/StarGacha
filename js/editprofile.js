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
    if(isImage(document.getElementById("selectimage").value)){
        nopic = false;
    }
    else{
        alert("โปรดใช้รูปภาพไฟล์นามสุกล .jpg, .png หรือ .gif")
        document.getElementById("image").src = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/noprofile.png?alt=media&token=3e4fa5e8-7f96-4b74-848f-d2de186fcd0c";
        document.getElementById("selectimage").value = null;
        nopic = true;
    }
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
    if(name == '') name = 'ผู้ใช้ที่ไม่มีชื่อ';
    
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

async function acceptDel(){
    changeProfile = true;
    let delemail = document.getElementById("delemail").value;
    let delpassword = document.getElementById("delpassword").value;
    if(cerrentuser.email == delemail){
        firebase.auth().signInWithEmailAndPassword(delemail, delpassword).then(async (userCredential) => {
            //makeroomdelete
            db.collection("user").doc(cerrentuser.uid).get().then(async (user) => {
                for(let delroom of user.data().makeroom){
                    await deleteAllMakeroom(delroom);
                }
            }).then(() => {
                // auth delete
                firebase.auth().currentUser.delete().then(() => {
                    alert("ลบบัญชีสำเร็จ")
                    document.location = 'viewprofile.html';
                }).catch((error) => {
                    alert(error)
                });
            })
        }).catch((error) => {
            alert(error)
        });
    }else{
        alert("กรอกรหัสผ่านหรืออีเมลล์ของท่านผิด")
    }
    
}

function closeModelDelete(delroom){
    $("#modalcontentdelete").slideUp()
    document.getElementById("myModaldelete").style.display = "none";
}

function deleteAllMakeroom(deleteroomid){
    return ref.child('roomImage/'+ deleteroomid +'.jpg').delete().catch((error) => {
        ref.child('roomImage/'+ deleteroomid +'.png').delete().catch((error) => {
            ref.child('roomImage/'+ deleteroomid +'.gif').delete()
        })
    }).then(() => {
        return db.collection("room").doc(deleteroomid).get().then(async (room) => {

            for(let joinid of room.data().name){
                await db.runTransaction((transaction) => {
                    return transaction.get(db.collection("user").doc(joinid)).then((user) => {
                        let newjoinroom = [...user.data().joinroom]
                        let index = newjoinroom.indexOf(deleteroomid);
                        if (index !== -1) newjoinroom.splice(index, 1);
                        transaction.update(db.collection("user").doc(joinid), { joinroom:newjoinroom });
                    });
                });
            }

            for(let waitid of room.data().waitinglist){
                await db.runTransaction((transaction) => {
                    return transaction.get(db.collection("user").doc(waitid)).then((user) => {
                        let newwaitroom = [...user.data().waitroom]
                        let index = newwaitroom.indexOf(deleteroomid);
                        if (index !== -1) newwaitroom.splice(index, 1);
                        transaction.update(db.collection("user").doc(waitid), { waitroom:newwaitroom });
                    });
                });
            }

            await db.runTransaction((transaction) => {
                return transaction.get(db.collection("user").doc(cerrentuser.uid)).then((user) => {
                    let newmakeroom = [...user.data().makeroom]
                    let index = newmakeroom.indexOf(deleteroomid);
                    if (index !== -1) newmakeroom.splice(index, 1);
                    transaction.update(db.collection("user").doc(cerrentuser.uid), { makeroom:newmakeroom });
                });
            });
        }).then(async () => {
            await db.collection('room').doc(deleteroomid).delete();
        });
    });
}

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}
  
function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        return true;
    }
    return false;
}