//get data from firebase to display in hostroom.
db.collection("room").doc("0").onSnapshot(item => {
    if ($('#giftlist').text().length == 54) {                                   //giftlist
        for(let g in item.data().gift){
            $(`
                <tr>
                    <td class="w-75">`+ g +`</td>
                    <td>x`+ item.data().gift[g] +`</td>
                </tr>
            `).appendTo( "#giftlist" );
        }
    }
    $("#room").html("ห้อง : " + item.data().room);  //roomname
});

// const para = document.createElement("p");
// const node = document.createTextNode("ห้อง : This is new.");
// para.appendChild(node);
// const element = document.getElementById("room");
// element.appendChild(para);




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