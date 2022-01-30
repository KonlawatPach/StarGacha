var cerrentuserid;
firebase.auth().onAuthStateChanged((user) => {
    cerrentuserid = user.uid;
    document.getElementById("Displayname").textContent = user.displayName;
    document.getElementById("imgProfile").src = user.photoURL;
});

function joinModel(){
    document.getElementById("myModal").style.display = "block";
    document.getElementById("modalcontent").style.display = "none";
    $("#modalcontent").slideDown(200);
}

function closeModel(){
    $("#modalcontent").slideUp()
    document.getElementById("noroom").style.display = "none";
    document.getElementById("myModal").style.display = "none";
    document.getElementById("displayroom").style.display = "none";
    document.getElementById("roomid").value = "";
}

//หาห้อง
function findRoom(){
    document.getElementById("noroom").style.display = "none";
    document.getElementById("displayroom").style.display = "none";
    var roomid = document.getElementById("roomid").value;
    try {
        db.collection("room").doc(roomid).get().then((item) => {  
            if (item.exists) {
                let status;
                if(item.data().status) status = "เปิด"
                else status = "ปิด"
                document.getElementById("displayroom").style.display = "block";
                $("#displayroom").html("");
                $(`
                    <div class="row border border-1 rounded-pill border-dark mx-auto mt-0 p-1 text-start">
                        <img class="col-3 rounded-circle px-0 img-fluid" src="`+ item.data().picture +`" style="width: 6.2rem; height: 6.2rem;">
                        <div class="col-1"></div>
                        <div class="col-5">
                            <h6 class="fw-bold mt-1 textcut" style="font-size: 100%;">ห้อง : `+ item.data().room +`</h6>
                            <h6 style="font-size: 90%;">สถานะ : `+ status +`</h6>
                            <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ item.data().name.length + `/` + item.data().maxname +` คน</h6>
                            <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ item.data().giftQuantity.reduce((a, b) => a + b) + `/` + item.data().allgiftnum + ` ชิ้น</h6>
                        </div>
                        <div class="col-3 ms-auto">
                            <button class="mt-1 mb-1 btn btn-secondary rounded-pill w-100 p-0 mt-2" style="height: 84%;" onclick="joinRoom('`+ item.id +`')">Join Room</button><br>
                        </div>
                    </div>
                `).appendTo( "#displayroom" );
            }
            else{
                document.getElementById("noroom").style.display = "block";
            }
        });
    } catch (error) {
        document.getElementById("noroom").style.display = "block";
    } 
}

function joinRoom(roomid){
    db.collection("room").doc(roomid).get().then((item) => {
        if(!item.data().name.includes(cerrentuserid)){
            let newname = [...item.data().name]
            newname.push(cerrentuserid)
            db.runTransaction((transaction) => {
                return transaction.get(db.collection("room").doc(roomid)).then((item) => {
                    transaction.update(db.collection("room").doc(roomid), { name:newname });
                });
            }).then(() => {
                sendRoomID(roomid);
            });
        }
        else{
            sendRoomID(roomid);
        }
    });
}

function sendRoomID(roomid){
    sessionStorage.setItem("roomid", roomid);
    document.location='gacharoom.html'
}