// scripts/index.js

// Select elements from the DOM
const locationForm = document.getElementById('locationForm');
const locationInput = document.getElementById('locationInput');
const useLocationBtn = document.getElementById('useLocationBtn');
const errorMsg = document.getElementById('errorMsg');

// Handle manual location form submission
locationForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const address = locationInput.value.trim();
  if (address) {
    // URL-encode the address for inclusion in query param
    const encodedAddress = encodeURIComponent(address);
    // Redirect to list page with address parameter
    window.location.href = `list.html?address=${encodedAddress}`;
  } else {
    errorMsg.textContent = "Please enter a location or use your current location.";
  }
});

// Handle "Use My Current Location" button
useLocationBtn.addEventListener('click', function() {
  // Clear any previous error message
  errorMsg.textContent = "";
  if (!navigator.geolocation) {
    errorMsg.textContent = "Geolocation is not supported by your browser.";
    return;
  }
  // Use HTML5 Geolocation API to get current position&#8203;:contentReference[oaicite:5]{index=5}
  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      // Redirect to list page with latitude and longitude parameters
      window.location.href = `list.html?lat=${lat}&lng=${lng}`;
    },
    function(error) {
      // Handle geolocation errors
      console.warn(`Geolocation error (${error.code}): ${error.message}`);
      errorMsg.textContent = "Unable to retrieve your location. Please enter a location manually.";
    }
  );
});
