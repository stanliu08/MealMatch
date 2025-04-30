// scripts/index.js

// Initialize Google Places Autocomplete on the main search bar
// (uses same pattern as in list.js to avoid freezing)
function initAutocomplete() {
  const input = document.getElementById('locationInput');
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode']  // cities & addresses
  });

  // When a place is selected:
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry && place.geometry.location) {
      // Redirect with the chosen coordinates
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      window.location.href = `list.html?lat=${lat}&lng=${lng}`;
    } else {
      // User pressed Enter or clicked Search without selecting suggestion
      geocodeAndRedirect(input.value.trim());
    }
  });
}

// Helper: Geocode a manual address entry and redirect
function geocodeAndRedirect(address) {
  if (!address) {
    document.getElementById('errorMsg').textContent = 'Please enter a location.';
    return;
  }
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const loc = results[0].geometry.location;
      window.location.href = `list.html?lat=${loc.lat()}&lng=${loc.lng()}`;
    } else {
      document.getElementById('errorMsg').textContent = 'Location not found. Please try again.';
    }
  });
}

// Handle manual location form submission
document.getElementById('locationForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const address = document.getElementById('locationInput').value.trim();
  // Instead of direct redirect, use geocode fallback
  geocodeAndRedirect(address);
});

// Also handle pressing Enter in the input box
document.getElementById('locationInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const address = this.value.trim();
    geocodeAndRedirect(address);
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
});
