var socket = new WebSocket("ws://10.0.0.195:8085");

socket.onopen = function(event) {
	console.log("Connected to socket");
	socket.send(`{"clientPing": "ping"}`);
}

socket.onmessage = function(event) {
	var data = JSON.parse(event.data);

	try {
		if (data.type == "question") {
			console.log("Question received");
			document.getElementsByClassName('questionWindow')[0].style.display = 'block';

			document.getElementById('questionText').innerHTML = data.question;
			console.log(data);

			document.getElementById('questionCount').textContent = `${data.currentQuestion}/${data.totalQuestionCount}`;

			var totalTime = data.totalTimeMs / 1000;
			document.getElementsByClassName('countdown')[0].style.display = 'block';
			document.getElementsByClassName('countdown')[0].style.animation = `countdownTimer ${totalTime}s`;

			if (data.question.length > 500) {
				document.getElementById('questionText').innerHTML = data.question.substring(0, 500) + "...";
			}

			console.log(totalTime);

			setTimeout(function() {
				document.getElementById('gameIcon').src = '/assets/live-games/logo-norm.png';
				document.getElementById('questionCount').textContent = `Time is up!`;
				document.getElementsByClassName('countdown')[0].style.display = 'none';
				setTimeout(function() {
					document.getElementsByClassName('countdown')[0].style.display = 'none';
					document.getElementsByClassName('questionWindow')[0].style.display = 'none';
				}, 2000);
			}, totalTime * 1000);
		}

        if (data.type == "broadcastStats") {
            let viewStats = document.getElementById('viewCount');

            //convert data.viewerCounts.connected to K, M, B
            let viewCount = data.viewerCounts.connected;
            if (viewCount >= 1000) {
                viewCount = (viewCount / 1000).toFixed(1) + "K";
            }
            if (viewCount >= 1000000) {
                viewCount = (viewCount / 1000000).toFixed(1) + "M";
            }
            if (viewCount >= 1000000000) {
                viewCount = (viewCount / 1000000000).toFixed(1) + "B";
            }
            
            document.getElementById('viewCount').textContent = viewCount;
        }

	} catch (e) {
		console.log(e);
	}
}