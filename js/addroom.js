var currentuserid;
firebase.auth().onAuthStateChanged((user) => {
    sessionStorage.setItem("userid", user.uid);
    sessionStorage.setItem("prev", 'addroom');
    currentuserid = user.uid;
    document.getElementById("Displayname").textContent = user.displayName;
    document.getElementById("imgProfile").src = user.photoURL;
    numberSort()
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
  if(!isImage(document.getElementById("roomPicture").value)){
    alert("โปรดใช้ไฟล์รูปภาพ ตัวอย่างเช่น .jpg, .png หรือ .gif")
    document.getElementById("image").src = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/addpicture.png?alt=media&token=ed974d0e-dd9c-4ac8-8b64-cee76f771d3b";
    document.getElementById("roomPicture").value = null;
  }
}

async function addRoom(){
  var path = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/no%20roompic.png?alt=media&token=c06192f8-4c02-4217-823f-5b11537bc807";
  var roomname = document.getElementById("roomName").value;
  var maxparticipant = document.getElementById("maxParticipant").value;
  var rollstart = document.getElementById("rollStart").value;
  var autojoin = document.getElementById("autoJoin").checked;
  var statusroom = document.getElementById("statusRoom").checked;
  var file = document.querySelector("#roomPicture").files[0];
  var inputgift = getGiftNameList();
  var giftquantity = getGiftQuantityList();
  document.getElementById("myModal").style.display = "block";
  db.collection("room").add({
    admin: currentuserid,
    allgiftnum: giftquantity.reduce((a, b) => a + b),        // ทำรวม list
    count: [Number(rollstart)],
    giftName: inputgift,                                // ทำ list
    giftQuantity: giftquantity,      // ทำ list
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
  }).then((newroom) => {
      db.collection("user").doc(currentuserid).get().then((user)=> {
      let newmakeroom = [...user.data().makeroom]
      newmakeroom.push(newroom.id)
      db.collection("user").doc(currentuserid).update({
      makeroom: newmakeroom
      }).then(async () => {
        if(file !== undefined){
          var metadata = { contentType:file.type }
          let img = ref.child("roomImage/" + newroom.id + ".jpg")
          await img.put(file, metadata)
          await img.getDownloadURL().then(function(url) {
              path = url;
          });
        }
        else{
          path = "https://firebasestorage.googleapis.com/v0/b/stargacha-4806d.appspot.com/o/no%20roompic.png?alt=media&token=c06192f8-4c02-4217-823f-5b11537bc807";
        } 
        db.collection("room").doc(newroom.id).update({
          picture: path
        }).then(() => {
        document.getElementById("myModal").style.display = "none";
        alert("สร้างห้องเรียบร้อยแล้ว")
        sessionStorage.setItem("roomid", newroom.id);
        document.location='gacharoom.html'})
      })
    })
  })
}

function getGiftQuantityList(){
  var giftQuantity = [];
  var x = document.getElementsByClassName("giftQuantity");
  for (let i = 0; i < x.length; i++) {
    giftQuantity.push(Number(x[i].value));
  }
  return giftQuantity;
}

function getGiftNameList(){
  var giftName = [];
  var x = document.getElementsByClassName("inputGift");
  for (let i = 0; i < x.length; i++) {
    giftName.push(x[i].value);
  }
  return giftName;
}



function numberSort(){
  var x = document.getElementsByTagName("tr");
  for (let i = 1; i < x.length; i++) {
    document.getElementsByClassName("delrow")[0].disabled = false;
    document.getElementsByClassName("rownumber")[i-1].textContent = i;
    document.getElementsByTagName("tr")[i].setAttribute( "id", i );
    document.getElementsByClassName("addrow")[i-1].setAttribute( "onClick", "addRow("+ i +")" );
    document.getElementsByClassName("delrow")[i-1].setAttribute( "onClick", "delRow("+ i +")" );
  }
  if(x.length == 2){
    document.getElementsByClassName("delrow")[0].disabled = true;
  }
}

function addRow(i){
  $("#"+i).after(`
    <tr>
      <td>
        <label for="inputGift" class="mt-1 rownumber"></label>
      </td>
      <td style="width: 50%;">
        <input type="gift" required class="w-100 inputGift">
      </td>
      <td>
        <input type="number" class="giftQuantity" min="1" required max="100" step="1" value="1">
      </td>
      <td>
        <button type="button" class="btn btn-outline-white rounded-circle btn-success fw-bold addrow" onclick="addRow()">+</button>
      </td>
      <td>
        <button type="button" class="btn btn-outline-white rounded-circle btn-danger fw-bold delrow"  onclick="delRow()">-</button>
      </td>
    </tr>
  `);
  numberSort()
}

function delRow(i){
  $("#"+i).remove()
  numberSort()
}

$("#addroomform").submit(function(e) {
  e.preventDefault();
});

function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

function isImage(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'webp':
    case 'svg':
    case 'heic':
    case 'heif':
    case 'gif':
    case 'bmp':
    case 'png':
    return true;
  }
  return false;
}