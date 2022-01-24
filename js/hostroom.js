// get data from firebase to display in hostroom.
getData();
realTimeupdate();

//Twotype Fetch Data Function
function getData(){
    db.collection("room").doc("0").get().then((item) => {  
        addGiftlist(item.data().gift);
    });
}

function realTimeupdate(){
    db.collection("room").doc("0").onSnapshot((item) => {  
        addRoomname(item.data().room);
        adduserlist(item)
    });
}

//Unit Automatic Function
function addGiftlist(giftlist){
    for(let g in giftlist){
        $(`
            <tr>
                <td class="w-75">`+ g +`</td>
                <td>x`+ giftlist[g] +`</td>
            </tr>
        `).appendTo( "#giftlist" );
    }
}

function addRoomname(roomname){ $("#room").html("ห้อง : " + roomname); }

function adduserlist(item){
    let usernumber = 0;
    let useridlist = [];
    let usernamelist = [];
    let sortuserlist = [];
    useridlist = item.data().name;
    if (usernumber != useridlist.length){
        usernumber = useridlist.length;
        for(let userdata in useridlist){
            db.collection("user").doc(useridlist[userdata]).get().then((user) => {      //add
                usernamelist.push(user.data().name);
                console.log(0)
            });
            
        }
        console.log(1)
        // console.log(usernamelist)
        sortidlist = usernamelist;
        sortidlist.sort();
        console.log(sortidlist)
        

        $("#namelist").html("");
        for(let userdata in useridlist){
            db.collection("user").doc(useridlist[userdata]).onSnapshot((user) => {      //update
                $(`
                    <div class="col-11 border border-1 rounded-pill border-dark mx-auto mt-1 p-1 text-start hover" id="`+ user.id +`">
                        <img class="rounded-circle" src="img/`+ user.id +`.jpg" width="50rem">
                        <h6 class="d-inline ms-2">`+ user.data().name +`</h6>
                    </div>
                `).appendTo( "#namelist" );
            });
        }
    }
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

// https://jsonplaceholder.typicode.com/posts
//https://datatables.net/examples/data_sources/js_array