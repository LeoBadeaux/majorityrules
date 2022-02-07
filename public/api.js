let nextGameText = document.getElementById('nextGameText');
let gameStatus = document.getElementById('nextGameInfo');

//Use fetch to get the json data from /api/schedule
fetch('/api/schedule')
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		console.log(data);
		let schedule = data
        nextGameText.innerHTML = schedule.nextGameText;
        let startTime = new Date(schedule.startTime);
        let startTimeString = startTime.toLocaleString('en-US', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        var num = schedule.prizeCents
        num /= 100;
        num.toLocaleString("en-US", {style:"currency", currency:"USD"});

        gameStatus.innerHTML = `${startTimeString} $${num}`;

        //Set the src of the image in the gameLogo class to schedule.display.logo
        document.getElementById('gameLogo').src = schedule.display.logo;
	})
	.catch(function(err) {
		console.log('Error: ' + err);
});