var ref = new Firebase("https://group-poll.firebaseio.com/");

function createGroup(groupName) {
  console.log(groupName);

  if (groupName != null) {
    var newRef = ref.push({
      "name": groupName
    });
    var newID = newRef.key();
    console.log(newID);
    window.location.replace("/group/" + newID);
  }
}

function joinGroup(groupID) {
  window.location.href = "/group/" + groupID;
}

// Firebase + templates stuff
function loadItems() {
    var source = $("#some-template").html();
    var template = Handlebars.compile(source);

    ref.child(groupKey + "/items").orderByChild("name").on("child_added", function (snapshot) {
        var json = snapshot.val();
        var key = snapshot.key();
        json.key = key;
        //console.log(json);
        $('#items').append(template(json));
    });

    ref.child(groupKey + "/items").on("child_changed", function (snapshot) {
        var json = snapshot.val();
        var key = snapshot.key();
        json.key = key;
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
}
function updateStrong(key) {
    ref.child(groupKey + "/items/" + key + "/votes").transaction(function (current_value) {
        return +current_value + +2;
    });
}

function deleteItem(key) {
    ref.child(groupKey + "/items/" + key).remove();
}

// TODO change this to a modal maybe
function rename(key) {
    var newName = prompt("Please enter the new name");
    if (newName != null) {
        ref.child(groupKey + "/items/" + key + "/name").transaction(function () {
            return newName;
        });
    }
}