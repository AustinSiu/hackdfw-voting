var ref = new Firebase("https://group-poll.firebaseio.com/");
var groupKey = "-KFW9XlFLT97QUXv_zp9";


function makestuff() {
    //ref.push({
    //    "name": "room two"
    //});
    ref.child(groupKey + "/items").push({
        "name": "thing4",
        "votes": 0,
    })
}

function addItem() {
    var name = document.getElementById("name").value;
    var votes = document.getElementById("votes").value;

    ref.child(groupKey + "/items").push({
        "name": name,
        "votes": votes
    })
}

function load() {

    var source = $("#some-template").html();
    var template = Handlebars.compile(source);

    //var totalVotes;
    //
    //ref.child(groupKey + "/totalVotes").on("value", function (current_value) {
    //    totalVotes = current_value.val();
    //});

    ref.child(groupKey + "/items").orderByChild("name").on("child_added", function (snapshot) {
        var json = snapshot.val();
        var key = snapshot.key();
        json.key = key;
        //json.percent = ((snapshot.val().votes / totalVotes) * 100);
        //console.log(json);
        $('#items').append(template(json));
    });

    ref.child(groupKey + "/items").on("child_changed", function (snapshot) {
        var json = snapshot.val();
        var key = snapshot.key();
        json.key = key;
        //json.percent = ((snapshot.val().votes / totalVotes) * 100);
        console.log(json);
        $('#' + snapshot.key()).replaceWith(template(json));
        console.log(snapshot.key())
    });

    ref.child(groupKey + "/items").on("child_removed", function (snapshot) {
        var json = snapshot.val();
        var key = snapshot.key();
        json.key = key;
        console.log(json);
        $('#' + snapshot.key()).replaceWith();
        console.log(snapshot.key())
    });
}

function updateWeak(key) {
    ref.child(groupKey + "/items/" + key + "/votes").transaction(function (current_value) {
        return +current_value + +1;
    });

    //ref.child(groupKey + "/totalVotes").transaction(function (current_value) {
    //    return +current_value + +1;
    //});
}
function updateStrong(key) {
    ref.child(groupKey + "/items/" + key + "/votes").transaction(function (current_value) {
        return +current_value + +2;
    });

    //ref.child(groupKey + "/totalVotes").transaction(function (current_value) {
    //    return +current_value + +2;
    //});
}

function deleteItem(key) {
    ref.child(groupKey + "/items/" + key).remove();
}

function rename(key) {
    var newName = prompt("Please enter the new name");

    if (newName != null) {
        ref.child(groupKey + "/items/" + key + "/name").transaction(function () {
            return newName;
        });
    }
}

function loadItems() {

}