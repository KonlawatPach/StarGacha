function send(){
    var ref = firebase.storage().ref();
    var file = document.querySelector("#inputGroupFile01").files[0]
    var name = file.name
    const metadata = {
        contentType:file.type
    }
    const task = ref.child(name).put(file, metadata)
}