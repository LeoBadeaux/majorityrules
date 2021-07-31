if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
};

function clearupdate() {
    alert("Clear update init");
    caches.delete("majorityrules");
    alert("Reloading");
    window.location.reload();
}