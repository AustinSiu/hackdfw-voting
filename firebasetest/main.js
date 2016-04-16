var ref = new Firebase("https://group-poll.firebaseio.com/");
var groupKey = "-KFW9XlFLT97QUXv_zp9";


function makestuff() {
    //ref.push({
    //    "name": "room two"
    //});
    ref.child(groupKey + "/items").push({
        "name": "thing4",
        "strongVotes": 9,
        "weakVotes": 1
    })
}

function addItem() {
    var name = document.getElementById("name").value;
    var sVotes = document.getElementById("sVotes").value;
    var wVotes = document.getElementById("wVotes").value;

    ref.child(groupKey + "/items").push({
        "name": name,
        "strongVotes": sVotes,
        "weakVotes": wVotes
    })
}

function load() {

    var source = $("#some-template").html();
    var template = Handlebars.compile(source);


    ref.child(groupKey + "/items").orderByChild("name").on("child_added", function (snapshot) {
        var json = snapshot.val();
        var key = snapshot.key();
        json.key = key;

        console.log(json);
        $('#items').append(template(json));
    });

    //ref.child(groupKey + "/items").on("child_changed", function (snapshot) {
    //    var json = snapshot.val();
    //    console.log(json);
    //    $('#items').append(template(snapshot.val()));
    //    console.log(snapshot.key())
    //    //update(snapshot.key())
    //});

}

function update(key){
    console.log(key);
    //var hopperRef = ref.child(groupKey + "/items/" + key);
    //hopperRef.update({
    //    "weakVotes": 4
    //});
}


function loadItems() {

}