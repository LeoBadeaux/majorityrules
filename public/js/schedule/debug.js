    //listen to shake event
    var shakeEvent = new Shake({threshold: 15});
    shakeEvent.start();
    window.addEventListener('shake', function(){
        alert("Shaked");
    }, false);

    //stop listening
    function stopShake(){
        shakeEvent.stop();
    }

    //check if shake is supported or not.
    if(!("ondevicemotion" in window)){alert("Not Supported");}