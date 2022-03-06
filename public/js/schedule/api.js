let gameStatus = document.getElementById('nextGameInfo');

function getScheduleInfo() {
	fetch('/api/schedule')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log(data);
			let schedule = data

			if (schedule.isWinnerTakeAll) {
				nextGameText.textContent = `Next Game ${schedule.display.title}`;
				nextGameText.innerHTML = nextGameText.innerHTML.replace(schedule.display.title, `<span style="color: ${schedule.display.titleColor}">${schedule.display.title} Winner Take All </span>`);
			} else if (schedule.isTestGame) {
				nextGameText.textContent = `Next Game ${schedule.display.title}`;
				nextGameText.innerHTML = nextGameText.innerHTML.replace(schedule.display.title, `<span style="color: #ffffff">Is Set to Development Mode</span>`);
			} else {
				nextGameText.textContent = `Next Game ${schedule.display.title}`;
				nextGameText.innerHTML = nextGameText.innerHTML.replace(schedule.display.title, `<span style="color: ${schedule.display.titleColor}">${schedule.display.title} </span>`);
			}

			let startTime = new Date(schedule.startTime);
			let today = new Date();
			let tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
			let nextWeek = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
			let startTimeString = '';
			if (startTime.getTime() < tomorrow.getTime()) {
				startTimeString = `Today ${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
			} else if (startTime.getTime() < nextWeek.getTime()) {
				startTimeString = `Tomorrow ${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
			} else {
				startTimeString = `${startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`;
			}
			if (schedule.startTime == null || schedule.startTime == undefined) {
				gameStatus.textContent = "No Game Scheduled";
			}

			let gamePrizeCents = (schedule.prizeCents/100).toLocaleString('en-US', { style: 'currency', currency: schedule.currency })

			if (schedule.prizeCents && schedule.prizePoints) {
				gameStatus.textContent = `${startTimeString} ${gamePrizeCents} + ${schedule.prizePoints}pts`;
			} else if (schedule.prizeCents) {
				gameStatus.textContent = `${startTimeString} ${gamePrizeCents}`;
			} else if (schedule.prizePoints) {
				gameStatus.textContent = `${startTimeString} ${schedule.prizePoints}pts`;
			} else if (schedule.startTime) {
				gameStatus.textContent = `${startTimeString}`;
			}
			if (schedule.isActive && schedule.prizeCents && schedule.prizePoints) {
				if (schedule.prizePoints == 1) {
					gameStatus.textContent = `We're live! ${gamePrizeCents} + ${schedule.prizePoints}pt`
				} else {
					gameStatus.textContent = `We're live! ${gamePrizeCents} + ${schedule.prizePoints}pts`
				}
			} else if (schedule.isActive && schedule.prizeCents == 0) {
				if (schedule.prizePoints == 1) {
					gameStatus.textContent = `We're live! ${schedule.prizePoints}pt`;
				} else {
					gameStatus.textContent = `We're live! ${schedule.prizePoints}pts`;
				}
			} else if (schedule.isActive && schedule.prizePoints == 0) {
				gameStatus.textContent = `We're live! ${gamePrizeCents}`;
			}
			if (schedule.isActive && schedule.prizeCents == 0 && schedule.prizePoints == 0) {
				gameStatus.textContent = `We're live!`;
			}

			if (schedule.isActive) {
				let inviteBtn = document.getElementById('inviteBtn');
				inviteBtn.textContent = "Join Game";
				/*document.getElementsByClassName('liveGameView')[0].style.transform = 'translate(-50%, -50%);';
				document.getElementsByClassName('liveGameView')[0].style.display = 'block';
				document.getElementsByClassName('liveGameView')[0].style.animation = 'debugPanelActive 0.5s';*/
			} else {
				inviteBtn.textContent = "Invite for Extra Lives";
				//document.getElementsByClassName('liveGameView')[0].style.display = 'none';
				document.getElementsByClassName('liveGameView')[0].style.animation = 'debugPanelInactive 0.5s';
				document.getElementsByClassName('liveGameView')[0].style.transform = 'translate(-50%, 50%)';
			}

			function joinGameInviteBtn() {
				//add an event listener to the inviteBtn class
				let inviteBtn = document.getElementById('inviteBtn');
				//if the game is active, then show the inviteBtn
				if (schedule.isActive) {
				document.getElementsByClassName('liveGameView')[0].style.transform = 'translate(-50%, -50%);';
				document.getElementsByClassName('liveGameView')[0].style.display = 'block';
				document.getElementsByClassName('liveGameView')[0].style.animation = 'debugPanelActive 0.5s';
				} else {
					console.log('game is not active');
				}
			}

			//add an event listener to the startbtn class, run the function joinGameInviteBtn when clicked
			let startBtn = document.getElementsByClassName('startbtn')[0];
			startBtn.addEventListener('click', joinGameInviteBtn);



			document.getElementById('gameLogo').src = schedule.display.logo;

			if (schedule.gameType == 'mjrules') {
				document.getElementById('gameIcon').src = '/assets/live-games/logo-norm.png';
			} if (schedule.gameType == 'mjrules-sports') {
				document.getElementById('gameIcon').src = '/assets/live-games/logo-sports.png';
			}

			if (schedule.isActive) {
				//This code will set the url for the stream
				if (flvjs.isSupported()) {
					var videoElement = document.getElementById('videoElement');
					var flvPlayer = flvjs.createPlayer({
						type: 'flv',
						url: schedule.live.flv
					});
					flvPlayer.attachMediaElement(videoElement);
					flvPlayer.load();
					flvPlayer.play();
				}
			}
		})
		.catch(function(err) {
			console.log('Error: ' + err);
		});
}

window.onload = function() {
	getScheduleInfo();
	setInterval(getScheduleInfo, 5000);
}