var socket = new WebSocket(`ws://${window.location.hostname}:8085`);
console.log(`ws://${window.location.hostname}:8085`);

socket.onopen = function(event) {
	console.log("Connected to socket");
	socket.send(`{"clientPing": "ping"}`);
}

socket.onmessage = function(event) {
	var data = JSON.parse(event.data);

	try {

		if (data.type == "gameStatus") {
			if (data.playingState == "eliminated") {
				document.getElementsByClassName("questionWindow")[0].style.backgroundColor = "rgb(255, 0, 85)";
			} else {
				document.getElementsByClassName("questionWindow")[0].style.backgroundColor = "rgb(255, 136, 0)";
			}
		}

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

		//Toast messages
		if (data.type == "showToast") {
			document.getElementsByClassName('toastWindow')[0].style.display = 'block';
			var toastMessage = data.text;

			var boldedText = toastMessage.split("*");
			var boldedTextHtml = "";
			for (var i = 0; i < boldedText.length; i++) {
				if (i % 2 == 0) {
					boldedTextHtml += boldedText[i];
				} else {
					boldedTextHtml += `<b>${boldedText[i]}</b>`;
				}

				if (toastMessage.length > 100) {
					toastMessage = toastMessage.substring(0, toastMessage.length - 1);
					toastMessage += "...";
				}

				document.getElementById('toastText').innerHTML = boldedTextHtml;
				document.getElementById('toastIcon').src = data.icon;

				document.getElementById('toastIcon').style.width = `${document.getElementsByClassName('toastWindow')[0].offsetWidth * 0.25}px`;

			}
			document.getElementById('toastText').innerHTML = boldedTextHtml;

			document.getElementsByClassName('toastWindow')[0].style.backgroundColor = 'white';

			setTimeout(function() {
				document.getElementsByClassName('toastWindow')[0].style.animation = 'toastRemove .5s';
			}, 10000);

			setTimeout(function() {
				document.getElementsByClassName('toastWindow')[0].style.display = 'none';
				document.getElementsByClassName('toastWindow')[0].style.backgroundColor = 'rgba(0,0,0,0)';
				document.getElementsByClassName('toastWindow')[0].style.color = 'rgba(0,0,0,0)';
				document.getElementById('toastIcon').src = '';
				document.getElementsByClassName('toastWindow')[0].style.animation = 'none';
			}, 10500);
		}

	} catch (e) {
		console.log(e);
	}
}