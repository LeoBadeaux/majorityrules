var socket = new WebSocket(`ws://${window.location.hostname}:8085`);

socket.onopen = function(event) {
	console.log("Connected to socket");
	socket.send(`{"clientPing": "ping"}`);
}

document.getElementById("post-question-button").addEventListener("click", function() {
	socket.send(JSON.stringify({
		"type": "question",
		"text": document.getElementById("question-text").value,
		"totalTimeMs": document.getElementById("question-time").value * 1000,
	}));
});