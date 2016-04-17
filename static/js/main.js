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

function createItem(itemName) {
    console.log(itemName);

    if (itemName != null) {
	   var newRef = ref.child(groupKey + "/items").push({
	      "name": itemName
	   });
       var newID = newRef.key();
       console.log(newID);
    //    window.location.replace("/item/" + newID);
    //    if (imgName != null) {
	//        var newImgRef = ref.push({
	//            "name": imgName
	//        });
    //        var newImgID = newImgRef.key();
    //        console.log(newImgID);
    //        window.location.replace("/item/" + newImgID);
    //     }
    }
}

function joinGroup(groupID) {
	window.location.href = "/group/" + groupID;
}

// Firebase + templates stuff
function loadItems() {
	var source = $("#some-template").html();
	var template = Handlebars.compile(source);

	ref.child(groupKey + "/name").on("value", function (snapshot) {
		$('#GroupName').replaceWith(snapshot.val());
	});

	// ref.child(groupKey + "/deadline").on("value", function (snapshot) {
	// 	var deadline = snapshot.val();
	// 	// var curTime = new Date().getTime();
	// 	// var remainingTime = curTime - deadline;

	// 	// call timer thing with deadline??
	// 	// $('#deadline').replaceWith(snapshot.val());
	// });

	ref.child(groupKey + "/items").orderByChild("name").on("child_added", function (snapshot) {
		var json = snapshot.val();
		var key = snapshot.key();
		json.key = key;
		if (!json.votes){
			json.votes = 0;
		}
		// console.log(json);
		// console.log(json.name)
		$('#items').append(template(json));
	});

	ref.child(groupKey + "/items").on("child_changed", function (snapshot) {
		var json = snapshot.val();
		var key = snapshot.key();
		json.key = key;
		// console.log(json);
		$('#' + snapshot.key()).replaceWith(template(json));

		// console.log(snapshot.key())
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
		// $('#votes+' + key).replaceWith(+current_value + +1);

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

// // TODO change this to a modal maybe
function rename(key) {
	var newName = prompt("Please enter the new name");
	if (newName != null) {
		ref.child(groupKey + "/items/" + key + "/name").transaction(function () {
			return newName;
		});
	}
}


(function ($) {
    $.fn.invisible = function () {
        return this.each(function () {
            $(this).css("visibility", "hidden");
			$(this).css("display", "none");

        });
    };
    $.fn.visible = function () {
        return this.each(function () {
            $(this).css("visibility", "visible");
			$(this).css("display", "block");

        });
    };
} (jQuery));



function initializeClock(endtime) {
	$('#countDownInput').invisible();
	$('#countDown').visible();



	var date = Date.now;
	var currentDate = new Date();
	var newDateObj = new Date(currentDate.getTime() + endtime * 60000);

	var dateString = newDateObj.toString();


	var clock = document.getElementById('clockdiv');
	var timeinterval = setInterval(function () {
		var t = getTimeRemaining(dateString);
		clock.innerHTML =
			// 'hours: ' + t.hours + '<br>' +
			// 'minutes: ' + t.minutes + '<br>' +
			// 'seconds: ' + t.seconds;
			t.hours + ':' + t.minutes +':'+t.seconds;
		if (t.total <= 0) {
			clearInterval(timeinterval);
			timeOut();
		}
	}, 1000);
}

function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

function timeOut(){
	getHighestVote();
	
}


function getHighestVote() {
	ref.child(groupKey + "/items").orderByChild("votes").limitToLast(1).on("child_added", function (snapshot) {
		// $('#votes+' + key).replaceWith(+current_value + +1);
		var json = snapshot.val();
		var key = snapshot.key();

		var source = $("#highest-template").html();
		var template = Handlebars.compile(source);
	
    	$('#highestItemWinner').append(template(json));
    	$("#getHighestVote").modal('show');
		
	});
}