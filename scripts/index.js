// scripts/index.js

// Autocomplete initialization for the main search bar
function initAutocomplete() {
  const input = document.getElementById('locationInput');
  const autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ['geometry', 'formatted_address']
  });
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      window.location.href = `list.html?lat=${lat}&lng=${lng}`;
    }
  });
}

// Handle manual location form submission
document.getElementById('locationForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const address = document.getElementById('locationInput').value.trim();
  if (address) {
    const encodedAddress = encodeURIComponent(address);
    window.location.href = `list.html?address=${encodedAddress}`;
  } else {
    document.getElementById('errorMsg').textContent = "Please enter a location or use your current location.";
  }
});

// Handle "Use My Current Location" button
document.getElementById('useLocationBtn').addEventListener('click', function() {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = "";
  if (!navigator.geolocation) {
    errorMsg.textContent = "Geolocation not supported by your browser.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      window.location.href = `list.html?lat=${lat}&lng=${lng}`;
    },
    (error) => {
      console.warn(`Geolocation error (${error.code}): ${error.message}`);
      errorMsg.textContent = "Unable to retrieve your location. Please enter manually.";
    }
  );
}
);
