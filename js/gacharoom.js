//////////////////////////////////////////////////////////////////
var roomid =  sessionStorage.getItem("roomid");                 //
//////////////////////////////////////////////////////////////////

// get data from firebase to display in hostroom.
var storageRef = firebase.storage().ref();
var Cerrentuser;
firebase.auth().onAuthStateChanged((user) => {
    Cerrentuser = user
    document.getElementById("Displayname").textContent = user.displayName;
    document.getElementById("imgProfile").src = user.photoURL;
    getData();
    realTimeupdate();
});



//Twotype Fetch Data Function
function getData(){
    try {
        db.collection("room").doc(roomid).get().then((item) => {  
            addKey(item.id);
        });
    } catch (error) {
        document.location='home.html';
    }
    
}

function realTimeupdate(){
    db.collection("room").doc(roomid).onSnapshot((item) => {
        checkname(item.data().name);
        addGiftlist(item.data().giftName, item.data().giftQuantity);
        addRoomname(item.data().room);
        adduserlist(item.data().name, item.data().admin);
        addReward(item.data().rewarduser, item.data().rewardgift);
        addCount(item.data().name, item.data().count);
        if(areAdmin(item.data().admin)){addWaitlist(item.data().waitinglist);}
        // addWaitlist(item.data().waitinglist);
    });
}

//Unit Automatic Function
function areAdmin(adminid){
    return Cerrentuser.uid == adminid;
}

function addWaitlist(idlist){
    let usernumber = 0;
    let sortidlist = [];        //ข้อมูล ID ที่เรียงแล้ว
    let sortnamelist = [];      //ข้อมูลชื่อที่เรียงแล้ว
    let temp;
    if (idlist.length == 0){
        $("#wwaitlist").html("");
    }
    db.collection("user").where( firebase.firestore.FieldPath.documentId(), "in", idlist).get().then((users) => {
        temp = sortName(users);
        sortidlist = temp[0];
        sortnamelist = temp[1];
        let pictureurl = temp[2];
        $("#wwaitlist").html("");
        for(let i in sortidlist){
            $(`
                <div class="col-11 border border-1 rounded-pill border-secondary mx-auto mt-1 p-1 text-start hover" id="`+ sortidlist[i] +`">
                    <div class="row">
                        <div class="col-7">
                            <img class="rounded-circle" style="-webkit-filter: grayscale(70%); filter: grayscale(70%);" src="`+ pictureurl[i] +`" width="50px" height="50px">
                            <h6 class="col-6 d-inline ms-2 mt-3 text-secondary">`+ sortnamelist[i]+`</h6>
                        </div>
                        <div class="col-4 d-inline">
                            <button class="mt-1 mb-1 btn btn-secondary rounded-pill w-100 p-0" style="height: 1.2rem; font-size: 60%;" onclick="accept('`+ sortidlist[i] +`')">ยอมรับ</button><br>
                            <button class="mb-0 btn btn-secondary rounded-pill w-100 p-0" style="height: 1.2rem; font-size: 60%;" onclick="deny('`+ sortidlist[i] +`')">ปฏิเสธ</button>
                        </div>
                    </div>
                </div>
            `).appendTo( "#wwaitlist" );
        }
    })
}

function addGiftlist(giftname, giftnum){
    $("#giftlist").html("");
    let noitem = []; 
    for(let g in giftname){
        if(giftnum[g] == 0) noitem.push(giftname[g]);
        else{
            $(`
                <tr>
                    <td style="width: 70%;">`+ giftname[g] +`</td>
                    <td>x`+ giftnum[g] +`</td>
                </tr>
            `).appendTo( "#giftlist" );
        }
    }
    for(let n in noitem){
        $(`
            <tr>
                <td class="text-secondary" style="width: 70%;">`+ noitem[n] +`</td>
                <td class="text-secondary">x0</td>
            </tr>
        `).appendTo( "#giftlist" );
    }
}

function addRoomname(roomname){ 
    $("#roomlg").html("ห้อง : " + roomname); 
    $("#roomsm").html("ห้อง : " + roomname); 
}
function addKey(key){
    $("#keylg").html("Room ID : " + key);
    $("#keysm").html("Room ID : " + key); 
}

function adduserlist(idlist, adminid){
    let usernumber = 0;
    let sortidlist = [];        //ข้อมูล ID ที่เรียงแล้ว
    let sortnamelist = [];      //ข้อมูลชื่อที่เรียงแล้ว
    let temp;

    if (usernumber != idlist.length){       //ถ้ามีรายชื่อเพิ่มหรือลดจะอัพเดทใหม่ยกเครื่อง
        usernumber = idlist.length;       

        db.collection("user").where( firebase.firestore.FieldPath.documentId(), "in", idlist).onSnapshot(async (users) => {
            temp = sortName(users);
            sortidlist = temp[0];
            sortnamelist = temp[1];
            let pictureurl = temp[2];

            $("#namelist").html("");
            for(let i in sortidlist){
                if(sortidlist[i] != adminid){
                    $(`
                        <div class="col-11 border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover" id="`+ sortidlist[i] +`">
                            <img class="rounded-circle" src="`+ pictureurl[i] +`" width="50rem" height="50rem">
                            <h6 class="d-inline ms-2">`+ sortnamelist[i]+`</h6>
                        </div>
                    `).appendTo( "#namelist" );
                }
                else{
                    $(`
                        <div class="col-11 border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover" id="`+ sortidlist[i] +`">
                            <img class="rounded-circle" src="`+ pictureurl[i] +`" width="50rem" height="50rem">
                            <h6 class="d-inline ms-2">👑 `+ sortnamelist[i]+`</h6>
                        </div>
                    `).appendTo( "#namelist" );
                }
            }
        });
    }
}

function sortName(users){
    let useridlist = []
    let usernamelist = []
    let sortidlist = []
    let pictureurl = []
    let sortpictureurl = []
    users.forEach((user) => {
        useridlist.push(user.id);
        usernamelist.push(user.data().name);
        pictureurl.push(user.data().pic)
    });
    
    let sortnamelist = [...usernamelist]
    sortnamelist.sort();    //สร้าง namelist ที่เรียงแล้ว
    for(let name of sortnamelist){
        sortidlist.push(useridlist[usernamelist.indexOf(name)]);
        sortpictureurl.push(pictureurl[usernamelist.indexOf(name)]);
    }
    return [sortidlist, sortnamelist, sortpictureurl];
}

function addReward(rewardiduser, rewardgift){
    let rewardnumber = 0;
    if (rewardnumber != rewardiduser.length){       //ถ้ามีคนได้รางวัลเพิ่มจะอัพเดทใหม่ยกเครื่อง
        rewardnumber = rewardiduser.length;

        var uniqueuser = [];                       //ลด Big-O ด้วยการโหลดแค่ id คนที่สุ่มไปแล้วและไม่ซ้ำ
        $.each(rewardiduser, function(i, name){
            if($.inArray(name, uniqueuser) === -1) uniqueuser.push(name);
        });

        db.collection("user").where( firebase.firestore.FieldPath.documentId(), "in", uniqueuser).onSnapshot(async (users) => {
            let uniqueiduser = [];
            let uniquenameuser = [];
            let rewardnameuser = [];
            let uniquepictureurl = [];
            let pictureurl = [];

            
            users.forEach((user) => {
                uniqueiduser.push(user.id);
                uniquenameuser.push(user.data().name);
                uniquepictureurl.push(user.data().pic);
            });
            for(let id of rewardiduser){
                rewardnameuser.push(uniquenameuser[uniqueiduser.indexOf(id)]);
                pictureurl.push(uniquepictureurl[uniqueiduser.indexOf(id)]);
            }

            $("#rewardlist").html("");
            for(let i = rewardiduser.length-1; i>=0; i--){
                $(`
                    <tr>
                        <td class="pe-0 me-0">
                            <img class="border border-2 rounded-circle m-0" src="`+ pictureurl[i] +`" width="50rem" height="50rem">
                        </td>
                        <td class="text-start mx-0 px-0">
                            <h6 style="font-size: 80%;">`+ rewardnameuser[i] +`</h6>
                            <h6 style="font-size: 70%;">สุ่มได้ `+ rewardgift[i] +`</h6>
                        </td>
                    </tr>
                `).appendTo( "#rewardlist" );
            }
        });
    }
}

function checkname(member){
    if(!member.includes(Cerrentuser.uid)) {
        document.location='home.html';
    }
}

function addCount(name, count){
    document.getElementById("count").textContent = "คุณมีสิทธิ์สุ่มได้อีก " + count[name.indexOf(Cerrentuser.uid)] + " ครั้ง"; 
}

function getCount(name, count){
    return count[name.indexOf(Cerrentuser.uid)]
}

//onEvent Function
async function rollgacha() {
    document.getElementById("rollgacha").disabled = true;
    document.getElementById("gachabox").src = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/wanwai_burapa_speed.gif?alt=media&token=da9a5c77-f42e-49ba-9980-44b374b66b9a";
    var reward;
    for (let i = 0; i < 1400; i+=200) {

    setTimeout(function()
    {
        document.body.style.backgroundColor = "lightsteelblue";
    }, i)

    i+=200;
    setTimeout(function()
    {
        document.body.style.backgroundColor = "royalblue";
    }, i)

    }
    setTimeout(async function()
    {  
        var sfDocRef = db.collection("room").doc(roomid);
            db.runTransaction((transaction) => {
            return transaction.get(sfDocRef).then((item) => {
                let randomlist = [];  
                giftname = item.data().giftName;
                giftnum = item.data().giftQuantity;
                for(let i in giftname) for(let j = 0; j<giftnum[i]; j++) randomlist.push(giftname[i]);
                if(randomlist != 0 && getCount(item.data().name, item.data().count)>0){
                    let num = Math.floor((Math.random()*1000) % randomlist.length);
                    reward = "ยินดีด้วย คุณได้รับ " + randomlist[num];
                    let newgiftnum = [...giftnum];
                    let newcount = [...item.data().count];
                    let newrewardgift = [...item.data().rewardgift];
                    let newrewarduser = [...item.data().rewarduser];
                    newgiftnum[giftname.indexOf(randomlist[num])] -= 1;
                    newcount[item.data().name.indexOf(Cerrentuser.uid)] -= 1;
                    newrewardgift.push(randomlist[num]);
                    newrewarduser.push(Cerrentuser.uid);
                    transaction.update(sfDocRef, {
                        giftQuantity: newgiftnum,
                        count: newcount,
                        rewardgift: newrewardgift,
                        rewarduser: newrewarduser
                    });                    
                }
                else if(getCount(item.data().name, item.data().count)==0){
                    reward = "บูรพาคุงไม่อยากให้คุณสุ่มอีกแล้ว";
                }
                else{
                    reward = "บูรพาคุงไม่มีของขวัญจะให้คุณ";
                }
            });
        }).then(() => {
            document.body.style.backgroundColor = "slateblue";
            document.getElementById("gachabox").src = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/wanwai_burapa.gif?alt=media&token=b4882689-594e-4162-866c-51ce8b6abf84";
            document.getElementById("myModal").style.display = "block";
            $("#getreward").html(reward);
            $("#modalcontent").slideDown(500);
            document.getElementById("rollgacha").disabled = false;
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });
    },2000)
}

function accept(userid){
    db.runTransaction((transaction) => {
        return transaction.get(db.collection("room").doc(roomid)).then((item) => {
            let newname = [...item.data().name]
            let newcount = [...item.data().count]
            let newwaitinglist = [...item.data().waitinglist]
            newname.push(userid)
            let index = newwaitinglist.indexOf(userid);
            if (index !== -1) newwaitinglist.splice(index, 1);
            newcount.push(item.data().startcount)
            transaction.update(db.collection("room").doc(roomid), {
                name:newname,
                count:newcount,
                waitinglist: newwaitinglist
            });
        });
    }).then(() => {
        db.runTransaction((transaction) => {
            return transaction.get(db.collection("user").doc(userid)).then((user) => {
                let newwaitroom = [...user.data().waitroom]
                let newjoinroom = [...user.data().joinroom]
                let index = newwaitroom.indexOf(roomid);
                if (index !== -1) newwaitroom.splice(index, 1);
                newjoinroom.push(roomid)
                transaction.update(db.collection("user").doc(userid), {
                    joinroom: newjoinroom,
                    waitroom: newwaitroom
                });
            });
        })
    });
}

function deny(userid){
    db.runTransaction((transaction) => {
        return transaction.get(db.collection("room").doc(roomid)).then((item) => {
            let newwaitinglist = [...item.data().waitinglist]
            let index = newwaitinglist.indexOf(userid);
            if (index !== -1) newwaitinglist.splice(index, 1);
            transaction.update(db.collection("room").doc(roomid), { waitinglist: newwaitinglist });
        });
    }).then(() => {
        db.runTransaction((transaction) => {
            return transaction.get(db.collection("user").doc(userid)).then((user) => {
                let newwaitroom = [...user.data().waitroom]
                let index = newwaitroom.indexOf(roomid);
                if (index !== -1) newwaitroom.splice(index, 1);
                transaction.update(db.collection("user").doc(userid), { waitroom: newwaitroom });
            });
        })
    });
}

function slideLeft() {
    document.getElementById("left").style.visibility = "visible";
    document.getElementById("left").style.width = "320px";
    document.getElementById("right").style.width = "0";
    document.getElementById("right").style.visibility = "hidden";
}
  
  
function slideCloseLeft() {
    document.getElementById("left").style.width = "0";
    document.getElementById("left").style.visibility = "hidden";
}

function slideRight() {
    document.getElementById("right").style.visibility = "visible";
    document.getElementById("right").style.width = "320px";
    document.getElementById("left").style.width = "0";
    document.getElementById("left").style.visibility = "hidden";
}
  
function slideCloseRight() {
    document.getElementById("right").style.width = "0";
    document.getElementById("right").style.visibility = "hidden";
}

window.addEventListener("resize", function() {
    if ($(window).width() > 992) {
        document.getElementById("left").style.visibility = "visible";
        document.getElementById("right").style.visibility = "visible";
        document.getElementById("right").style.width = "25%";
        document.getElementById("left").style.width = "25%";
    }
    else{
        document.getElementById("left").style.visibility = "hidden";
        document.getElementById("right").style.visibility = "hidden";
        document.getElementById("right").style.width = "0";
        document.getElementById("left").style.width = "0";
    }
})

function closeModel(){
    $("#modalcontent").slideUp()
    document.getElementById("myModal").style.display = "none";
}