var ref = new Firebase("https://group-poll.firebaseio.com/");

function createGroup(groupName) {
    console.log(groupName);

    if (groupName != null) {
	    var newRef = ref.push({
	      "name": groupName
	    });
      varnewID = newRef.key();
    }
    window.location.href("/group/newID");
}