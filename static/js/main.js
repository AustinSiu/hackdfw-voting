var ref = new Firebase("https://group-poll.firebaseio.com/");

function createGroup(groupName) {
    console.log(groupName);

    if (groupName != null) {
		var newRef = ref.push({
			"name": groupName
		});
		var newID = newRef.key();
		// console.log


		(newID);
		window.location.replace("/group/" + newID);
    }
}

function createItem(itemName) {
    // console.log(itemName);

    if (itemName != null) {
		var newRef = ref.child(groupKey + "/items").push({
			"name": itemName
		});
    }
}

function joinGroup(groupID) {
	window.location.href = "/group/" + groupID;
}

function findGroup(groupName){
	console.log(groupName);
	ref.on("child_added", function (snapshot) {
		var json = snapshot.val();
		if(json['name'] == groupName){
			window.location.href = "/group/" + snapshot.key();
		}
	});

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
		if (!json.votes) {
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
		loadClock();

		// console.log(snapshot.key())
	});

	ref.child(groupKey + "/items").on("child_removed", function (snapshot) {
		var json = snapshot.val();
		var key = snapshot.key();
		json.key = key;
		// console.log(json);
		$('#' + snapshot.key()).replaceWith();
		// console.log(snapshot.key())
	});
	
	//load URL
	// $('#url').text(window.location.href);
	// new Clipboard('.clippy');

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


//on load
function loadClock() {
	var dateFinal;
	ref.child(groupKey + "/time/").once("value", function (snapshot) {
		console.log(snapshot.val());
		dateFinal = snapshot.val().time;
		if (dateFinal) {
			console.log(snapshot.val());

			$('#countDown').visible();
			$('#countDownInput').invisible();

			var clock = document.getElementById('clockdiv');
			var timeinterval = setInterval(function () {
				var t = getTimeRemaining(dateFinal);
				clock.innerHTML =
					// 'hours: ' + t.hours + '<br>' +
					// 'minutes: ' + t.minutes + '<br>' +
					// 'seconds: ' + t.seconds;
					t.hours + ':' + t.minutes + ':' + t.seconds;
				if (t.total <= 0) {
					clearInterval(timeinterval);
					clock.innerHTML = "Done!";
					timeOut();
				}
			}, 1000);
		}
	});
}


//for button
function initializeClock(endtime) {

	$('#countDownInput').invisible();
	$('#countDown').visible();

	var date = Date.now;
	var currentDate = new Date();
	var newDateObj = new Date(currentDate.getTime() + endtime * 60000);

	var dateString = newDateObj.toString();


	var newRef = ref.child(groupKey + "/time/").set({
		"time": dateString
	});


	var clock = document.getElementById('clockdiv');
	var timeinterval = setInterval(function () {
		var t = getTimeRemaining(dateString);
		clock.innerHTML =
			// 'hours: ' + t.hours + '<br>' +
			// 'minutes: ' + t.minutes + '<br>' +
			// 'seconds: ' + t.seconds;
			t.hours + ':' + t.minutes + ':' + t.seconds;
		if (t.total <= 0) {
			clearInterval(timeinterval);
			clock.innerHTML = "Done!";

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
