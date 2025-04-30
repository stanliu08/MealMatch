// scripts/list.js

let userLat, userLng;
let originLatLng;
let placesService;
let paginationObj;
let fullResults = [];

// Called when Google Maps JS (with Places & Geometry) is loaded
function initPlaces() {
  // Initialize autocomplete for the "new location" input
  const newInput = document.getElementById('new-location-input');
  const geocoder = new google.maps.Geocoder();
  const autocomplete2 = new google.maps.places.Autocomplete(newInput, {
    fields: ['geometry', 'name']
  });
  let newPlace = null;
  autocomplete2.addListener('place_changed', () => {
    newPlace = autocomplete2.getPlace();
  });

  // changeLocation exposed globally for the form’s onsubmit
  window.changeLocation = () => {
    if (newPlace && newPlace.geometry) {
      const lat = newPlace.geometry.location.lat();
      const lng = newPlace.geometry.location.lng();
      performSearch(lat, lng);
    } else {
      const address = newInput.value.trim();
      if (!address) return;
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          performSearch(loc.lat(), loc.lng());
        } else {
          alert("Location not found: " + status);
        }
      });
    }
    newPlace = null;
  };

  // Parse URL params (initial search)
  const params = new URLSearchParams(window.location.search);
  const latParam = params.get('lat');
  const lngParam = params.get('lng');
  const addressParam = params.get('address');

  if (latParam && lngParam) {
    userLat = parseFloat(latParam);
    userLng = parseFloat(lngParam);
    performSearch(userLat, userLng);
  } else if (addressParam) {
    geocoder.geocode({ address: addressParam }, (results, status) => {
      if (status === 'OK' && results[0]) {
        userLat = results[0].geometry.location.lat();
        userLng = results[0].geometry.location.lng();
        performSearch(userLat, userLng);
      } else {
        alert("Location not found. Please return to the home page.");
      }
    });
  } else {
    alert("No location specified. Please go back and try again.");
    return;
  }

  // Filter form submission
  document.getElementById('filterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch(userLat, userLng);
  });

  // Radius slider update
  document.getElementById('radiusRange').addEventListener('input', function() {
    document.getElementById('radiusDisplay').innerText = this.value;
  });

  // Sort dropdown
  document.getElementById('sortSelect').addEventListener('change', function() {
    const sortBy = this.value;
    let resultsToShow = [];
    if (sortBy === 'distance') {
      resultsToShow = [...fullResults].sort((a, b) => a.distance - b.distance);
    } else {
      resultsToShow = fullResults;
    }
    renderResults(resultsToShow);
  });

  // Randomize button
  document.getElementById('randomizeBtn').addEventListener('click', () => {
    if (fullResults.length === 0) {
      alert("No restaurants to randomize.");
      return;
    }
    const idx = Math.floor(Math.random() * fullResults.length);
    window.location.href = `detail.html?place_id=${fullResults[idx].place_id}`;
  });

  // Load More button
  document.getElementById('load-more-btn').addEventListener('click', () => {
    if (paginationObj && paginationObj.hasNextPage) {
      const btn = document.getElementById('load-more-btn');
      btn.disabled = true;
      btn.innerText = "Loading...";
      paginationObj.nextPage();
    }
  });
}

// Perform (or re-perform) the nearby search
function performSearch(lat, lng) {
  // Update user coords
  userLat = lat;
  userLng = lng;
  originLatLng = new google.maps.LatLng(lat, lng);
  fullResults = [];            // reset accumulated results
  document.getElementById('results-list').innerHTML = ""; 
  document.getElementById('load-more-btn').style.display = 'none';

  // Prepare Places request
  const radiusMeters = document.getElementById('radiusRange').value * 1609.344;
  const priceVal = document.getElementById('priceSelect').value;
  const req = {
    location: originLatLng,
    radius: radiusMeters,
    type: 'restaurant'
  };
  if (priceVal) {
    req.minPriceLevel = req.maxPriceLevel = parseInt(priceVal);
  }

  if (!placesService) {
    placesService = new google.maps.places.PlacesService(
      document.getElementById('map')
    );
  }
  placesService.nearbySearch(req, onPlacesSearchResults);
}

// Handle each page of results (including pagination)
function onPlacesSearchResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error("Places search failed:", status);
    return;
  }

  // Process & render
  for (const place of results) {
    let distanceMi = 0;
    if (place.geometry && originLatLng) {
      const meters = google.maps.geometry.spherical
        .computeDistanceBetween(originLatLng, place.geometry.location);
      distanceMi = parseFloat((meters / 1609.344).toFixed(1));
    }
    place.distance = distanceMi;
    fullResults.push(place);
  }
  renderResults(fullResults);

  // Pagination
  if (pagination.hasNextPage) {
    paginationObj = pagination;
    const btn = document.getElementById('load-more-btn');
    btn.style.display = 'inline-block';
    btn.disabled = false;
    btn.innerText = "Load More Results";
  } else {
    document.getElementById('load-more-btn').style.display = 'none';
  }
}

// Render a given array of places into the list
function renderResults(placesArray) {
  const container = document.getElementById('results-list');
  container.innerHTML = "";
  for (const place of placesArray) {
    const item = document.createElement('div');
    item.className = "list-group-item";
    item.innerHTML = `
      <h5>${place.name}</h5>
      <p>${place.vicinity || place.formatted_address} 
         – <span class="text-muted">${place.distance} mi away</span>
      </p>
      <a href="detail.html?place_id=${place.place_id}" class="btn btn-sm btn-outline-primary">
        View Details
      </a>
    `;
    container.appendChild(item);
  }
}

// Dynamically load Google Maps JS (Places + Geometry) with callback
(function loadMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
             + `&libraries=places,geometry&callback=initPlaces`;
  script.async = true;
  document.head.appendChild(script);
})();
