//////////////////////////////////////////////////////////////////
var roomid =  sessionStorage.getItem("roomid");                 //
//////////////////////////////////////////////////////////////////

// get data from firebase to display in hostroom.
var storageRef = firebase.storage().ref();
var Cerrentuser;
firebase.auth().onAuthStateChanged((user) => {Cerrentuser = user});

getData();
realTimeupdate();

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
        // checkname(item.data().name);//////////////////////////////////////////////////////////อย่าลืมมาเปิดตอนใช้งานจริงด้วย
        addGiftlist(item.data().giftName, item.data().giftQuantity);
        addRoomname(item.data().room);
        adduserlist(item.data().name, item.data().admin);
        addReward(item.data().rewarduser, item.data().rewardgift);
    });
}

//Unit Automatic Function
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
    let pictureurl = [];

    if (usernumber != idlist.length){       //ถ้ามีรายชื่อเพิ่มหรือลดจะอัพเดทใหม่ยกเครื่อง
        usernumber = idlist.length;        

        db.collection("user").where( firebase.firestore.FieldPath.documentId(), "in", idlist).onSnapshot(async (users) => {
            temp = sortName(users);
            sortidlist = temp[0];
            sortnamelist = temp[1];

            pictureurl = [];
            for(let i in sortidlist){
                var userRef = storageRef.child('userImage/'+sortidlist[i]+'.jpg');
                await userRef.getDownloadURL().then(function(url) {
                    pictureurl.push(url);
                }).catch((error) => {
                    pictureurl.push("https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/noprofile.png?alt=media&token=3e4fa5e8-7f96-4b74-848f-d2de186fcd0c");
                });
            }

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
    users.forEach((user) => {
        useridlist.push(user.id);
        usernamelist.push(user.data().name);
    });
    
    let sortnamelist = [...usernamelist]
    sortnamelist.sort();    //สร้าง namelist ที่เรียงแล้ว
    for(let name of sortnamelist){
        sortidlist.push(useridlist[usernamelist.indexOf(name)]);
    }
    return [sortidlist, sortnamelist];
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
            let uniquenameuser = [];
            let rewardnameuser = [];
            let pictureurl = [];
            
            users.forEach((user) => {
                uniquenameuser.push(user.data().name);
            });
            for(let id of rewardiduser){
                rewardnameuser.push(uniquenameuser[uniqueuser.indexOf(id)]);
                var userRef = storageRef.child('userImage/'+ id +'.jpg');
                await userRef.getDownloadURL().then(function(url) {
                    pictureurl.push(url);
                });
            }
            
            $("#rewardlist").html("");
            for(let i in rewardnameuser){
                $(`
                    <tr>
                        <td class="pe-0 me-0">
                            <img class="border border-2 rounded-circle m-0" src="`+ pictureurl[i] +`" width="50rem">
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
                if (!item.exists) {
                    throw "Document does not exist!";
                }
                let randomlist = [];  
                giftname = item.data().giftName;
                giftnum = item.data().giftQuantity;
                for(let i in giftname) for(let j = 0; j<giftnum[i]; j++) randomlist.push(giftname[i]);
                if(randomlist!=0){
                    document.body.style.backgroundColor = "slateblue";
                    let num = Math.floor((Math.random()*1000) % randomlist.length);
                    reward = "ยินดีด้วย คุณได้รับ " + randomlist[num];
                    let newgiftnum = [...giftnum];
                    newgiftnum[giftname.indexOf(randomlist[num])] -= 1;
                    transaction.update(sfDocRef, { giftQuantity: newgiftnum });
                    document.getElementById("gachabox").src = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/wanwai_burapa.gif?alt=media&token=b4882689-594e-4162-866c-51ce8b6abf84";
                    
                }
                else{
                    reward = "บูรพาคุงไม่มีของขวัญจะให้คุณ";
                    document.body.style.backgroundColor = "slateblue";
                    document.getElementById("gachabox").src = "http://myweb.cmu.ac.th/konlawat_wong/picture/wanwai_burapa.gif";
                }
            });
        }).then(() => {
            document.getElementById("myModal").style.display = "block";
            $("#getreward").html(reward);
            $("#modalcontent").slideDown(500);
            document.getElementById("rollgacha").disabled = false;
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });
    },2000)
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