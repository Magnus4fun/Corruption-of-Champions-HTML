// These functions handle changing the clock.
// Right now there is no day counter.

Time = [];

// Global array for loading in pregnancies and other things that are time sensitive.
var timeAware = [];
var timeAwareLong = [];


Time.increment = function() {
	time.minutes++;
	if (time.minutes >= 60) {
		time.minutes -= 60;
		time.hours++;
	}
	if (time.hours >= 24) {
		time.hours -= 24;
		time.days++;
	}
}

// Add function to the timeAware array
Time.addTimeAware = function(func) {
	timeAware.push(func);
}
Time.addTimeAwareLong = function(func) {
	timeAwareLong.push(func);
}

Time.advanceMinutes = function(minutes) {
	// I do not think this is the right place for advancing pregnancies... They should be added as timeAware!
	for (i = 0; i < minutes; i++) {
		Time.increment();
		
		// Run timeAware functions
		if (timeAware.length > 0) {
			for (j = 0; j < timeAware.length; j++) {
				timeAware[j]();
			}
		}
		
		// Other stuff
		//player.pregnancyAdvance(); // Advances the Player's pregnancy.
		//amily.pregnancyAdvance(); // Advances Amily's pregnancy.
		//tamanipreg.pregnancyAdvance(); //Advances Tamani's pregnancy.
		// Run timeAwareLong functions
		if (timeAwareLong.length > 0) {
			for (j = 0; j < timeAwareLong.length; j++) {
				var somethingHappend = timeAwareLong[j]();
				if(somethingHappend) {
					outputText("<br><br> SOMETHING HAPPEND <br><br>");
					return;
				}
			}
		}
	}
	// Update timer;
	refreshStats();
	//pregnancyProgression.updatePregnancy(); // Outputs the results of the Player's pregnancy flags once time passes.
}

	Time.advanceHours = function (hours) {

		Time.advanceMinutes(hours * 60);
    }
