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