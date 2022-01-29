function joinModel(){
    document.getElementById("myModal").style.display = "block";
    document.getElementById("modalcontent").style.display = "none";
    $("#modalcontent").slideDown(200);
    document.getElementById("rollgacha").disabled = false;
}

function closeModel(){
    $("#modalcontent").slideUp()
    document.getElementById("myModal").style.display = "none";
}

function send(){
    var ref = firebase.storage().ref();
    var file = document.querySelector("#inputGroupFile01").files[0]
    var name = file.name
    const metadata = {
        contentType:file.type
    }
    const task = ref.child(name).put(file, metadata)
}

function sendRoomID0(){
    var roomid = "0";
    sessionStorage.setItem("roomid", roomid);
}

function sendRoomID1(){
    var roomid = "1";
    sessionStorage.setItem("roomid", roomid);
}