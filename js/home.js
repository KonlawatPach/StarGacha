var cerrentuserid;
var deleteroomid;
firebase.auth().onAuthStateChanged((user) => {
    cerrentuserid = user.uid;
    document.getElementById("Displayname").textContent = user.displayName;
    document.getElementById("imgProfile").src = user.photoURL;
    document.getElementById("head").textContent = "ยินดีต้อนรับ " + user.displayName;
    loadUserData()
});

function loadUserData(){
    db.collection("user").doc(cerrentuserid).onSnapshot(async (user) => {
        var makeroom = []
        var joinroom = []
        var areWaiting = []
        for(let r of user.data().makeroom){
            await db.collection("room").doc(r).get().then((room) => { makeroom.push(room) });
        }

        for(let r of user.data().joinroom){
            await db.collection("room").doc(r).get().then((room) => {
                joinroom.push(room)
                areWaiting.push(false) 
            });
        }

        for(let r of user.data().waitroom){
            await db.collection("room").doc(r).get().then((room) => {
                joinroom.push(room)
                areWaiting.push(true) 
            });
        }
        $("#makeroom").html("");
        for(let m = makeroom.length-1; m>=0; m--){            //makelist
            let status;
            if(makeroom[m].data().status){
                status = "เปิด";
                $(`
                    <div class="row border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover">
                        <img class="col-3 rounded-circle px-0 img-fluid" src="` + makeroom[m].data().picture + `">
                        <div class="col-6">
                            <h6 class="fw-bold mt-1 textcut" style="font-size: 100%;">ห้อง `+ makeroom[m].data().room +`</h6>
                            <h6 style="font-size: 90%;">สถานะห้อง : `+ status +`</h6>
                            <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ makeroom[m].data().name.length + `/` + makeroom[m].data().maxname +` คน</h6>
                            <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ makeroom[m].data().giftQuantity.reduce((a, b) => a + b) + `/` + makeroom[m].data().allgiftnum +` ชิ้น</h6>
                        </div>
                        <div class="col-3">
                            <button class="mb-1 btn btn-secondary rounded-pill firstbtn w-100 p-0" onclick="sendRoomID('`+ makeroom[m].id +`')">เข้าร่วม</button><br>
                            <button class="mb-1 btn btn-secondary rounded-pill w-100 p-0" onclick="closeRoom('`+ makeroom[m].id +`')">ปิดห้อง</button><br>
                            <button class="mb-0 btn btn-secondary rounded-pill w-100 p-0" onclick="deleteRoom('`+ makeroom[m].id +`')">ลบห้องออก</button>
                        </div>
                    </div>
                `).appendTo( "#makeroom" );
            }
            else{
                status = "ปิด";
                $(`
                    <div class="row border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover">
                        <img class="col-3 rounded-circle px-0 img-fluid" src="` + makeroom[m].data().picture + `">
                        <div class="col-6">
                            <h6 class="fw-bold mt-1 textcut" style="font-size: 100%;">ห้อง `+ makeroom[m].data().room +`</h6>
                            <h6 style="font-size: 90%;">สถานะห้อง : `+ status +`</h6>
                            <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ makeroom[m].data().name.length + `/` + makeroom[m].data().maxname +` คน</h6>
                            <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ makeroom[m].data().giftQuantity.reduce((a, b) => a + b) + `/` + makeroom[m].data().allgiftnum +` ชิ้น</h6>
                        </div>
                        <div class="col-3">
                            <button class="mb-1 btn btn-secondary rounded-pill firstbtn w-100 p-0" onclick="sendRoomID('`+ makeroom[m].id +`')">เข้าร่วม</button><br>
                            <button class="mb-1 btn btn-secondary rounded-pill w-100 p-0" onclick="openRoom('`+ makeroom[m].id +`')">เปิดห้อง</button><br>
                            <button class="mb-0 btn btn-secondary rounded-pill w-100 p-0" onclick="deleteRoom('`+ makeroom[m].id +`')">ลบห้องออก</button>
                        </div>
                    </div>
                `).appendTo( "#makeroom" );
            }
        }

        $("#joinroom").html("");
        for(let j = joinroom.length-1; j>=0; j--){
            let status;
            if(joinroom[j].data().status) status = "เปิด"
            else status = "ปิด"
            if(areWaiting[j]){          //waitinglist
                $(`
                <div class="row border border-1 rounded-pill border-secondary mx-auto mt-1 p-1 text-start hover">
                    <img class="col-3 rounded-circle px-0 img-fluid" src="` + joinroom[j].data().picture + `" style=" -webkit-filter: grayscale(70%); filter: grayscale(70%);">
                    <div class="col-6">
                        <h6 class="fw-bold text-secondary mt-1 textcut" style="font-size: 100%;">ห้อง `+ joinroom[j].data().room +`</h6>
                        <h6 class="text-secondary" style="font-size: 90%;">สถานะห้อง : `+ status +`</h6>
                        <h6 class="text-secondary" style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ joinroom[j].data().name.length + `/` + joinroom[j].data().maxname +` คน</h6>
                        <h6 class="mb-0 text-secondary" style="font-size: 90%;">จำนวนของที่เหลือ : `+ joinroom[j].data().giftQuantity.reduce((a, b) => a + b) + `/` + joinroom[j].data().allgiftnum +` ชิ้น</h6>
                    </div>
                    <div class="col-3">
                        <button class="mt-3 mt-lg-4 mb-1 btn btn-secondary rounded-pill w-100 p-0" style="height: 50%;" id="`+ joinroom[j].id +`" onclick="cancelWaiting('`+ joinroom[j].id +`')">ยกเลิกคำขอ</button><br>
                    </div>
                </div>
                `).appendTo( "#joinroom" );
            }else{                        //joinlist
                $(`
                <div class="row border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover">
                    <img class="col-3 rounded-circle px-0 img-fluid" src="` + joinroom[j].data().picture + `">
                    <div class="col-6">
                        <h6 class="fw-bold mt-1 textcut" style="font-size: 100%;">ห้อง `+ joinroom[j].data().room +`</h6>
                        <h6 style="font-size: 90%;">สถานะห้อง : `+ status +`</h6>
                        <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ joinroom[j].data().name.length + `/` + joinroom[j].data().maxname +` คน</h6>
                        <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ joinroom[j].data().giftQuantity.reduce((a, b) => a + b) + `/` + joinroom[j].data().allgiftnum +` ชิ้น</h6>
                    </div>
                    <div class="col-3 mt-1">
                        <button class="mt-2 mt-lg-1 mb-1 btn btn-secondary rounded-pill w-100 p-0 joinbtn" onclick="joinRoom('`+ joinroom[j].id +`')">เข้าร่วม</button><br>
                        <button class="mt-1 mb-0 btn btn-secondary rounded-pill w-100 p-0 joinbtn" onclick="deleteJoinRoom('`+ joinroom[j].id +`')">ลบห้องออก</button>
                    </div>
                </div>
                `).appendTo( "#joinroom" );
            }
        }
    });
}

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
                if(!item.data().status){
                    document.getElementById("noroom").style.display = "block";
                }
                else if(item.data().autoallow){      //รับอัตโนมัติ
                    $(`
                        <div class="row border border-1 rounded-pill border-dark mx-auto mt-0 p-1 text-start">
                            <img class="col-3 rounded-circle px-0 img-fluid" src="`+ item.data().picture +`">
                            <div class="col-6 ps-1 ps-sm-2 pe-0">
                                <h6 class="fw-bold mt-2 mt-sm-1 textcut" style="font-size: 100%;">ห้อง : `+ item.data().room +` 🌎`+`</h6>
                                <h6 style="font-size: 90%;">สถานะ : `+ status +`</h6>
                                <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ item.data().name.length + `/` + item.data().maxname +` คน</h6>
                                <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ item.data().giftQuantity.reduce((a, b) => a + b) + `/` + item.data().allgiftnum + ` ชิ้น</h6>
                            </div>
                            <div class="col-3 ms-auto ps-0 pe-2">
                                <button class="mb-1 btn btn-secondary rounded-pill w-100 p-0 mt-2" onclick="joinRoom('`+ item.id +`')">เข้าร่วม</button>
                            </div>
                        </div>
                    `).appendTo( "#displayroom" );
                }
                else if(item.data().name.includes(cerrentuserid)){      //ห้องปิด|เคยเข้าร่วมแล้ว
                    $(`
                        <div class="row border border-1 rounded-pill border-dark mx-auto mt-0 p-1 text-start">
                            <img class="col-3 rounded-circle px-0 img-fluid" src="`+ item.data().picture +`">
                            <div class="col-6 ps-1 ps-sm-2 pe-0">
                                <h6 class="fw-bold mt-1 textcut" style="font-size: 100%;">ห้อง : `+ item.data().room +` 🔒`+`</h6>
                                <h6 style="font-size: 90%;">สถานะ : `+ status +`</h6>
                                <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ item.data().name.length + `/` + item.data().maxname +` คน</h6>
                                <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ item.data().giftQuantity.reduce((a, b) => a + b) + `/` + item.data().allgiftnum + ` ชิ้น</h6>
                            </div>
                            <div class="col-3 ms-auto ps-0 pe-2">
                                <button class="mb-1 btn btn-secondary rounded-pill w-100 p-0 mt-2" onclick="joinRoom('`+ item.id +`')">เข้าร่วม</button><br>
                            </div>
                        </div>
                    `).appendTo( "#displayroom" );
                }else if(item.data().waitinglist.includes(cerrentuserid)){      //ห้องปิด|ส่งคำขอไปแล้ว
                    $(`
                        <div class="row border border-1 rounded-pill border-dark mx-auto mt-0 p-1 text-start">
                            <img class="col-3 rounded-circle px-0 img-fluid" src="`+ item.data().picture +`">
                            <div class="col-6 ps-1 ps-sm-2 pe-0">
                                <h6 class="fw-bold mt-1 textcut" style="font-size: 100%;">ห้อง : `+ item.data().room +` 🔒`+`</h6>
                                <h6 style="font-size: 90%;">สถานะ : `+ status +`</h6>
                                <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ item.data().name.length + `/` + item.data().maxname +` คน</h6>
                                <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ item.data().giftQuantity.reduce((a, b) => a + b) + `/` + item.data().allgiftnum + ` ชิ้น</h6>
                            </div>
                            <div class="col-3 ms-auto ps-0 pe-2">
                                <button class="mb-1 btn btn-secondary rounded-pill w-100 p-0 mt-2" id="send" disabled onclick="sendRequest('`+ item.id +`')">ส่งคำขอไปแล้ว</button><br>
                            </div>
                        </div>
                    `).appendTo( "#displayroom" );
                }else{                                                          //ห้องปิด|ส่งคำขอครั้งแรก
                    $(`
                        <div class="row border border-1 rounded-pill border-dark mx-auto mt-0 p-1 text-start">
                            <img class="col-3 rounded-circle px-0 img-fluid" src="`+ item.data().picture +`">
                            <div class="col-6 ps-1 ps-sm-2 pe-0">
                                <h6 class="fw-bold mt-1 textcut" style="font-size: 100%;">ห้อง : `+ item.data().room +` 🔒`+`</h6>
                                <h6 style="font-size: 90%;">สถานะ : `+ status +`</h6>
                                <h6 style="font-size: 90%;">จำนวนผู้เข้าร่วม : `+ item.data().name.length + `/` + item.data().maxname +` คน</h6>
                                <h6 class="mb-0" style="font-size: 90%;">จำนวนของที่เหลือ : `+ item.data().giftQuantity.reduce((a, b) => a + b) + `/` + item.data().allgiftnum + ` ชิ้น</h6>
                            </div>
                            <div class="col-3 ms-auto ps-0 pe-2">
                                <button class="mb-1 btn btn-secondary rounded-pill w-100 p-0 mt-2" id="send" onclick="sendRequest('`+ item.id +`')">ส่งคำขอเข้าร่วม</button><br>
                            </div>
                        </div>
                    `).appendTo( "#displayroom" );
                }
                
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
            db.runTransaction((transaction) => {
                let newname = [...item.data().name]
                let newcount = [...item.data().count]
                newname.push(cerrentuserid)
                newcount.push(item.data().startcount)
                return transaction.get(db.collection("room").doc(roomid)).then((item) => {
                    transaction.update(db.collection("room").doc(roomid), {
                        name:newname,
                        count:newcount
                    });
                });
            }).then(() => {
                db.collection("user").doc(cerrentuserid).get().then((user) => {
                    db.runTransaction((transaction) => {
                        let newjoinroom = [...user.data().joinroom]
                        let index = newjoinroom.indexOf(roomid);
                        if (index !== -1) newjoinroom.splice(index, 1);
                        newjoinroom.push(roomid)
                        return transaction.get(db.collection("user").doc(cerrentuserid)).then((user) => {
                            transaction.update(db.collection("user").doc(cerrentuserid), { joinroom:newjoinroom });
                        });
                    }).then(() => {
                        sendRoomID(roomid);
                    });
                });
            });
        }
        else{
            db.collection("user").doc(cerrentuserid).get().then((user) => {
                let newjoinroom = [...user.data().joinroom]
                let index = newjoinroom.indexOf(roomid);
                if (index !== -1) newjoinroom.splice(index, 1);
                newjoinroom.push(roomid)
                db.runTransaction((transaction) => {
                    return transaction.get(db.collection("user").doc(cerrentuserid)).then((user) => {
                        transaction.update(db.collection("user").doc(cerrentuserid), { joinroom:newjoinroom });
                    });
                }).then(() => {
                    sendRoomID(roomid);
                });
            });
        }
    });
}

function sendRoomID(roomid){
    sessionStorage.setItem("roomid", roomid);
    document.location='gacharoom.html'
}

function sendRequest(roomid){
    document.getElementById("send").disabled = true;
    db.collection("room").doc(roomid).get().then((item) => {
        db.runTransaction((transaction) => {
            let newwaitinglist = [...item.data().waitinglist]
            newwaitinglist.push(cerrentuserid)
            return transaction.get(db.collection("room").doc(roomid)).then((item) => {
                transaction.update(db.collection("room").doc(roomid), { waitinglist:newwaitinglist });
            });
        }).then(() => {
            db.collection("user").doc(cerrentuserid).get().then((user) => {
                db.runTransaction((transaction) => {
                    let newwaitroom = [...user.data().waitroom]
                    newwaitroom.push(roomid)
                    return transaction.get(db.collection("user").doc(cerrentuserid)).then((user) => {
                        transaction.update(db.collection("user").doc(cerrentuserid), { waitroom:newwaitroom });
                    });
                }).then(() => {
                    alert("ส่งคำขอสำเร็จ")
                    findRoom()
                });
            });
        });
    });
}

function cancelWaiting(roomid){
    document.getElementById(roomid).disabled = true;
    db.collection("room").doc(roomid).get().then((item) => {
        db.runTransaction((transaction) => {
            let newwaitinglist = [...item.data().waitinglist]
            let index = newwaitinglist.indexOf(cerrentuserid);
            if (index !== -1) newwaitinglist.splice(index, 1);
            return transaction.get(db.collection("room").doc(roomid)).then((item) => {
                transaction.update(db.collection("room").doc(roomid), { waitinglist:newwaitinglist });
            });
        }).then(() => {
            db.collection("user").doc(cerrentuserid).get().then((user) => {
                db.runTransaction((transaction) => {
                    let newwaitroom = [...user.data().waitroom]
                    let index = newwaitroom.indexOf(roomid);
                    if (index !== -1) newwaitroom.splice(index, 1);
                    return transaction.get(db.collection("user").doc(cerrentuserid)).then((user) => {
                        transaction.update(db.collection("user").doc(cerrentuserid), { waitroom:newwaitroom });
                    });
                }).then(() => {
                    alert("ยกเลิกคำขอสำเร็จ")
                });
            });
        });
    });
}

function deleteJoinRoom(roomid){
    db.collection("user").doc(cerrentuserid).get().then((user) => {
        db.runTransaction((transaction) => {
            let newjoinroom = [...user.data().joinroom]
            let index = newjoinroom.indexOf(roomid);
            if (index !== -1) newjoinroom.splice(index, 1);
            return transaction.get(db.collection("user").doc(cerrentuserid)).then((user) => {
                transaction.update(db.collection("user").doc(cerrentuserid), { joinroom:newjoinroom });
            });
        }).then(() => {
            alert("ลบห้องออกจากการมองเห็นสำเร็จ")
        });
    });
}

function closeRoom(roomid){
    db.runTransaction((transaction) => {
        return transaction.get(db.collection("room").doc(roomid)).then((item) => {
            transaction.update(db.collection("room").doc(roomid), {
                status: false
            });
        }).then(() => {
            alert("ปิดห้องสำเร็จ")
            loadUserData()
        });
    })
}

function openRoom(roomid){
    db.runTransaction((transaction) => {
        return transaction.get(db.collection("room").doc(roomid)).then((item) => {
            transaction.update(db.collection("room").doc(roomid), {
                status: true
            });
        }).then(() => {
            alert("เปิดห้องสำเร็จ")
            loadUserData()
        });
    })
}

function deleteRoom(roomid){
    db.collection("room").doc(roomid).get().then((room) => {
        $("#deleteroomname").html("จะลบห้อง " + room.data().room + " จริงๆหยอ");
    });
    deleteroomid = roomid;
    document.getElementById("myModaldelete").style.display = "block";
    document.getElementById("modalcontentdelete").style.display = "none";
    $("#modalcontentdelete").slideDown(200);
}

function deleteRoomID(){
    ref.child('roomImage/'+ deleteroomid +'.jpg').delete().catch((error) => {
        ref.child('roomImage/'+ deleteroomid +'.png').delete().catch((error) => {
            ref.child('roomImage/'+ deleteroomid +'.gif').delete()
        })
    }).then(() => {
        db.collection("room").doc(roomid).get().then(async (room) => {
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

            db.runTransaction((transaction) => {
                return transaction.get(db.collection("user").doc(cerrentuserid)).then((user) => {
                    let newmakeroom = [...user.data().makeroom]
                    let index = newmakeroom.indexOf(deleteroomid);
                    if (index !== -1) newmakeroom.splice(index, 1);
                    transaction.update(db.collection("user").doc(cerrentuserid), { makeroom:newmakeroom });
                });
            });
        }).then(() => {
            db.collection('room').doc(deleteroomid).delete().then(() => {
                alert("ลบห้องสำเร็จ")
                document.getElementById("myModaldelete").style.display = "none";
            });
        });
    });
}

function closeModelDelete(){
    $("#modalcontentdelete").slideUp()
    document.getElementById("myModaldelete").style.display = "none";
}