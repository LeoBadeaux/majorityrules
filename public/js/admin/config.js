let nextGameText = document.getElementById('nextGameText');

fetch('/api/admin/config')
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		console.log(data);
		let config = data

		document.title = `${config.applicationInfo.name} | Admin`;
		document.getElementById('navbar-brand').textContent = config.applicationInfo.name;

		(function() {
			var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = config.applicationInfo.icon;
			document.getElementsByTagName('head')[0].appendChild(link);
		})();
	})