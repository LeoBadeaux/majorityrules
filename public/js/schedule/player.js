if (flvjs.isSupported()) {
	var videoElement = document.getElementById('videoElement');
	var flvPlayer = flvjs.createPlayer({
		type: 'flv',
		url: 'http://10.0.0.195:8000/live/STREAM_NAME.flv'
	});
	flvPlayer.attachMediaElement(videoElement);
	flvPlayer.load();
	flvPlayer.play();
	document.getElementsByTagName('video')[0].play();
}