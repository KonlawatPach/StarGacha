var currentuserid;
firebase.auth().onAuthStateChanged((user) => {
    sessionStorage.setItem("userid", user.uid);
    sessionStorage.setItem("prev", 'addroom');
    currentuserid = user.uid;
    document.getElementById("Displayname").textContent = user.displayName;
    document.getElementById("imgProfile").src = user.photoURL;
});



// ปุ่มเพิ่มลดเลข
$(document).ready(function () {
    jQuery('<div class="quantity-nav"><button class="quantity-button quantity-up">&#xf106;</button><button class="quantity-button quantity-down">&#xf107</button></div>').insertAfter('.quantity input');
    jQuery('.quantity').each(function () {
      var spinner = jQuery(this),
          input = spinner.find('input[type="number"]'),
          btnUp = spinner.find('.quantity-up'),
          btnDown = spinner.find('.quantity-down'),
          min = input.attr('min'),
          max = input.attr('max');
  
      btnUp.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });
  
      btnDown.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });
  
    });
  });

document.getElementById("roomPicture").onchange = evt => {
  const [file] = document.getElementById("roomPicture").files
  document.getElementById("image").src = URL.createObjectURL(file)
}

async function addRoom(){
  var path = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/no%20roompic.png?alt=media&token=c06192f8-4c02-4217-823f-5b11537bc807";
  var  roomname = document.getElementById("roomName").value;
  var  maxparticipant = document.getElementById("maxParticipant").value;
  var  rollstart = document.getElementById("rollStart").value;
  var  autojoin = document.getElementById("autoJoin").checked;
  var  statusroom = document.getElementById("statusRoom").checked;
  var  file = document.querySelector("#roomPicture").files[0];
  var  inputgift1 = document.getElementById("inputGift1").value;
  var  inputgift2 = document.getElementById("inputGift2").value;
  var  giftquantity1 = document.getElementById("giftQuantity1").value;
  var  giftquantity2 = document.getElementById("giftQuantity2").value;
  
  db.collection("room").add({
    admin: currentuserid,
    allgiftnum: Number(giftquantity1) + Number(giftquantity2),
    count: [Number(rollstart)],
    giftName: [inputgift1,inputgift2],
    giftQuantity: [Number(giftquantity1),Number(giftquantity2)],
    maxname: Number(maxparticipant), // จำนวนผู้เข้าร่วมทั้งหมด
    name: [currentuserid],
    picture: path,
    rewardgift: [],
    rewarduser: [],
    room: roomname,
    startcount: Number(rollstart),
    autoallow: autojoin,
    status: statusroom,
    waitinglist: []
  }).then((newroomid) => {
    db.collection("user").doc(currentuserid).get().then((user)=> {
      let newmakeroom = [...user.data().makeroom]
      newmakeroom.push(newroomid.id)
      db.collection("user").doc(currentuserid).update({
        makeroom: newmakeroom
      }).then(() => {
        alert("สร้างห้องเสร็จแล้วUSERโง่")
        sessionStorage.setItem("roomid", newroomid.id);
        document.location='gacharoom.html'
      })
    })
   
  })
  
  
  
  /* if(file !== undefined){
    var metadata = { contentType:file.type }
    let img = ref.child("userImage/" + user.uid + ".jpg")
    await img.put(file, metadata)
    await img.getDownloadURL().then(function(url) {
        path = url;
    });
  }
  else{
    path = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/no%20roompic.png?alt=media&token=c06192f8-4c02-4217-823f-5b11537bc807";
  } */
}

  