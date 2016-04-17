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

function createItem(itemName, imgName) {
    console.log(itemName + " " + imgName);

    if (itemName != null) {
	   var newRef = ref.push({
	      "name": itemName
	   });
       var newID = newRef.key();
       console.log(newID);
       window.location.replace("/item/" + newID);
       if (imgName != null) {
	       var newImgRef = ref.push({
	           "name": imgName
	       });
           var newImgID = newImgRef.key();
           console.log(newImgID);
           window.location.replace("/item/" + newImgID);
        }
    }
}