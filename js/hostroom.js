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

async function adduserlist(idlist, adminid){
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


//onEvent Function
function rollgacha() {
    // document.getElementById("gachabox").style.backgroundImage = "url('http://myweb.cmu.ac.th/konlawat_wong/picture/wanwai_burapa_speed.gif')";
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
        document.body.style.backgroundColor = "slateblue";
        const item = ["เกลือหมายเลข 1", "เกลือหมายเลข 2", "เกลือหมายเลข 3", "เกลือหมายเลข 4", "เกลือหมายเลข 5", "rickroll", "rickroll", "นายก็เกเรเหมือนกันนะเนี่ย"];
        let num = Math.floor((Math.random()*10)%8);
        alert("คุณได้รับ"+item[num]);
        document.getElementById("gachabox").src = "http://myweb.cmu.ac.th/konlawat_wong/picture/wanwai_burapa.gif";
        if(num == 5 || num == 6){window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");}
        if(num == 7){window.open("https://www.youtube.com/watch?v=xmrzbfkIfaM");}
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