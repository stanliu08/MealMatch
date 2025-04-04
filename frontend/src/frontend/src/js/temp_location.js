document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const location = params.get("location");
    
    if (location) {
        document.getElementById("location-display").innerText = `Your location: ${location}`;
    } else {
        document.getElementById("location-display").innerText = "No location provided.";
    }
});
