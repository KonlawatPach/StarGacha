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

function sendRoomID0(){
    var roomid = "0";
    sessionStorage.setItem("roomid", roomid);
    document.location='gacharoom.html'
}

function sendRoomID1(){
    var roomid = "1";
    sessionStorage.setItem("roomid", roomid);
    document.location='gacharoom.html'
}