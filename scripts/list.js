// scripts/list.js

// Constants and variables
const METERS_PER_MILE = 1609;  // conversion factor for miles to meters (approximate)
let userLat, userLng;          // to store user location coordinates
let placesService;             // Google Places Service object

// Initialize the page after Google Maps JS API is loaded
window.initPlaces = function() {
  // Parse URL query parameters for location or address
  const params = new URLSearchParams(window.location.search);
  const latParam = params.get('lat');
  const lngParam = params.get('lng');
  const addressParam = params.get('address');

  // If an address is provided (from manual input), geocode it to get coordinates
  if (addressParam && (!latParam || !lngParam)) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addressParam }, function(results, status) {
      if (status === 'OK' && results[0]) {
        // Use the first geocoding result
        userLat = results[0].geometry.location.lat();
        userLng = results[0].geometry.location.lng();
        // Perform the initial search with default filters after geocoding
        performSearch();
      } else {
        alert("Location not found. Please go back and try again.");
      }
    });
  } else if (latParam && lngParam) {
    // Coordinates provided (likely via geolocation)
    userLat = parseFloat(latParam);
    userLng = parseFloat(lngParam);
    performSearch();  // initial search with default filters
  } else {
    alert("No location specified. Please return to the home page.");
    return;
  }

  // Set up filter form event handler to re-run search on filter changes
  const filterForm = document.getElementById('filterForm');
  filterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    performSearch();  // re-run the search with new filter values
  });
  // Update radius display text when slider is moved
  document.getElementById('radiusRange').addEventListener('input', function() {
    document.getElementById('radiusDisplay').innerText = this.value;
  });
};

// Function to perform a nearby search using current filters and location
function performSearch() {
  // Ensure PlacesService is initialized
  if (!placesService) {
    // Use a dummy div (#map) as map container for PlacesService (no actual map needed)
    const mapDiv = document.getElementById('map');
    placesService = new google.maps.places.PlacesService(mapDiv);
  }

  // Get filter values
  const radiusMiles = document.getElementById('radiusRange').value;
  const radiusMeters = parseInt(radiusMiles) * METERS_PER_MILE;
  const priceValue = document.getElementById('priceSelect').value;
  let minPrice = null, maxPrice = null;
  if (priceValue) {
    // If a specific price level is selected, restrict to that level only
    minPrice = parseInt(priceValue);
    maxPrice = parseInt(priceValue);
  }
  // Prepare the request for nearbySearch
  const request = {
    location: { lat: userLat, lng: userLng },
    radius: radiusMeters,
    type: 'restaurant'
  };
  if (minPrice !== null) {
    request.minPriceLevel = minPrice;
    request.maxPriceLevel = maxPrice;
  }
  // (Optional) We could add keyword or name filtering here if needed.

  // Call the Google Places Nearby Search API&#8203;:contentReference[oaicite:8]{index=8}
  placesService.nearbySearch(request, function(results, status) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = "";  // clear any existing results
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      // Loop through results and display each restaurant
      results.forEach(place => {
        // Create a Bootstrap list group item for each restaurant
        const item = document.createElement('a');
        item.className = "list-group-item list-group-item-action flex-column align-items-start";
        item.href = `detail.html?place_id=${place.place_id}`;
        // Construct the display content
        let itemContent = `<h5 class="mb-1">${place.name}</h5>`;
        if (place.vicinity) {
          itemContent += `<p class="mb-1 small text-muted">${place.vicinity}</p>`;
        }
        // If price level is available, display it as dollar signs
        if (place.price_level !== undefined) {
          const dollars = "$".repeat(place.price_level);
          itemContent += `<span class="badge bg-secondary me-2">${dollars || "$"}</span>`;
        }
        // If rating is available, display rating
        if (place.rating !== undefined) {
          itemContent += `<span class="badge bg-success">${place.rating.toFixed(1)}★</span>`;
        }
        // If open/closed information is available, show it
        if (place.opening_hours && place.opening_hours.open_now !== undefined) {
          const openText = place.opening_hours.open_now ? "Open Now" : "Closed";
          const openClass = place.opening_hours.open_now ? "text-success" : "text-danger";
          itemContent += ` <span class="${openClass} ms-2">${openText}</span>`;
        }
        item.innerHTML = itemContent;
        resultsList.appendChild(item);
      });
      if (results.length === 0) {
        // If no results found within radius (perhaps too restrictive filters)
        resultsList.innerHTML = `<p class="text-muted">No restaurants found for the given criteria.</p>`;
      }
    } else {
      // Handle errors or no results
      resultsList.innerHTML = `<p class="text-danger">Failed to load results. Please try again.</p>`;
      console.error("Places API nearbySearch error:", status);
    }
  });
}

// Dynamically load the Google Maps Places API script with our API key
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initPlaces`;
script.async = true;
document.head.appendChild(script);
