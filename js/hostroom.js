// get data from firebase to display in hostroom.
getData();
realTimeupdate();

let d = "0";
//Twotype Fetch Data Function
function getData(){
    let d = "0";
    db.collection("room").doc(d).get().then((item) => {  
        addKey(item.data().key);
    });
}

function realTimeupdate(){
    let d = "0";
    db.collection("room").doc(d).onSnapshot((item) => {
        addGiftlist(item.data().giftName, item.data().giftQuantity);
        addRoomname(item.data().room);
        adduserlist(item.data().name, item.data().admin);
        addReward(item.data().rewarduser, item.data().rewardgift);
    });
}

//Unit Automatic Function
function addGiftlist(giftname, giftnum){
    $("#giftlist").html("");
    for(let g in giftname){
        if(giftnum[g] == 0){
            $(`
                <tr>
                    <td class="text-secondary" style="width: 70%;">`+ giftname[g] +`</td>
                    <td class="text-secondary">x`+ giftnum[g] +`</td>
                </tr>
            `).appendTo( "#giftlist" );
        }
        else{
            $(`
                <tr>
                    <td style="width: 70%;">`+ giftname[g] +`</td>
                    <td>x`+ giftnum[g] +`</td>
                </tr>
            `).appendTo( "#giftlist" );
        }
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

        db.collection("user").where( firebase.firestore.FieldPath.documentId(), "in", idlist).onSnapshot((users) => {
            temp = sortName(users);
            sortidlist = temp[0];
            sortnamelist = temp[1];

            $("#namelist").html("");
            for(let i in sortidlist){
                if(sortidlist[i] != adminid){
                    $(`
                        <div class="col-11 border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover" id="`+ sortidlist[i] +`">
                            <img class="rounded-circle" src="img/`+ sortidlist[i] +`.jpg" width="50rem">
                            <h6 class="d-inline ms-2">`+ sortnamelist[i]+`</h6>
                        </div>
                    `).appendTo( "#namelist" );
                }
                else{
                    $(`
                        <div class="col-11 border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover" id="`+ sortidlist[i] +`">
                            <img class="rounded-circle" src="img/`+ sortidlist[i] +`.jpg" width="50rem">
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

        var uniqueuser = [];                       //ลด Big-O ด้วยการโหลดแค่รายชื่อคนที่สุ่มไปแล้วและไม่ซ้ำ
        $.each(rewardiduser, function(i, name){
            if($.inArray(name, uniqueuser) === -1) uniqueuser.push(name);
        });

        db.collection("user").where( firebase.firestore.FieldPath.documentId(), "in", uniqueuser).onSnapshot((users) => {
            let uniquenameuser = [];
            let rewardnameuser = [];
            
            users.forEach((user) => {
                uniquenameuser.push(user.data().name);
            });
            for(let id of rewardiduser){
                rewardnameuser.push(uniquenameuser[uniqueuser.indexOf(id)]);
            }
            
            $("#rewardlist").html("");
            for(let i in rewardnameuser){
                $(`
                    <tr>
                        <td class="pe-0 me-0">
                            <img class="border border-2 rounded-circle m-0" src="img/`+ rewardiduser[i] +`.jpg" width="50rem">
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

//onEvent Function
function rollgacha() {
    document.getElementById("gachabox").src = "http://myweb.cmu.ac.th/konlawat_wong/picture/wanwai_burapa_speed.gif";

    for (let i = 0; i < 1600; i+=200) {

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
    setTimeout(function()
    {
        db.collection("room").doc("0").get().then((item) => {
            let randomlist = [];  
            giftname = item.data().giftName;
            giftnum = item.data().giftQuantity;
            for(let i in giftname) for(let j = 0; j<giftnum[i]; j++) randomlist.push(giftname[i]);

            if(randomlist!=0){
                document.body.style.backgroundColor = "slateblue";
                let num = Math.floor((Math.random()*1000) % randomlist.length);
                alert("คุณได้รับ " + randomlist[num]);
                let newgiftnum = [...giftnum];
                newgiftnum[giftname.indexOf(randomlist[num])] -= 1;
                db.collection("room").doc("0").update({     //ลบจำนวนของขวัญในดาต้าเบส
                    giftQuantity: newgiftnum
                });
                document.getElementById("gachabox").src = "http://myweb.cmu.ac.th/konlawat_wong/picture/wanwai_burapa.gif";
            }else{
                alert("บูรพาคุงไม่มีของขวัญจะให้คุณ");
                document.body.style.backgroundColor = "slateblue";
                document.getElementById("gachabox").src = "http://myweb.cmu.ac.th/konlawat_wong/picture/wanwai_burapa.gif";
            }
        });
    }, 2000)
    
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