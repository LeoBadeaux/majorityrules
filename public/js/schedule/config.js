let nextGameText = document.getElementById('nextGameText');

fetch('/api/config')
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		console.log(data);
		let config = data

		/*let inviteBtn = document.getElementById('inviteBtn');
		inviteBtn.textContent = config.schedule.invite.btnText;*/

		document.title = config.applicationInfo.name;

		(function() {
			var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = config.applicationInfo.icon;
			document.getElementsByTagName('head')[0].appendChild(link);
		})();

		//nextGameText.innerHTML = config.schedule.nextGameText;

		if (config.schedule.invite.enabled) {
			document.getElementsByClassName('startbtn')[0].style.visibility = 'block';
			console.log('invite enabled');
		} else {
			document.getElementsByClassName('startbtn')[0].style.visibility = 'hidden';
			console.log('invite disabled');
		}

		if (config.schedule.bgAnimation == false) {
			//sportsBg is a random name given so that no animation is applied
			document.body.style.animationName = 'sportsBg';
			document.body.style.backgroundColor = 'hsl(280, 45%, 58%)';
		}
	})