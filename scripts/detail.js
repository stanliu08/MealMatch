// scripts/detail.js

function initDetails() {
  const params = new URLSearchParams(window.location.search);
  const pid = params.get('place_id');
  if (!pid) {
    document.getElementById('placeName').innerText = "No place specified.";
    return;
  }

  const service = new google.maps.places.PlacesService(document.createElement('div'));
  service.getDetails({
    placeId: pid,
    fields: [
      'name','formatted_address','formatted_phone_number',
      'website','opening_hours','price_level','rating',
      'user_ratings_total','photos'
    ]
  }, (place, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      console.error("Details error:", status);
      document.getElementById('placeName').innerText = "Failed to load details.";
      return;
    }
    document.getElementById('placeName').innerText = place.name;
    document.getElementById('placeAddress').innerText = place.formatted_address;
    // Contact info
    const contact = document.getElementById('placeContact');
    if (place.formatted_phone_number) {
      contact.innerHTML = `<strong>Phone:</strong> ${place.formatted_phone_number}`;
    }
    if (place.website) {
      contact.innerHTML += ` | <a href="${place.website}" target="_blank">Website</a>`;
    }
    // Images carousel
    const carousel = document.getElementById('carouselImages');
    if (place.photos) {
      carousel.innerHTML = place.photos.slice(0,4).map((photo, i) => `
        <div class="carousel-item ${i===0?'active':''}">
          <img src="${photo.getUrl({maxWidth:800})}" class="d-block w-100" alt="Photo ${i+1}">
        </div>
      `).join('');
    }
    // Hours
    const hoursDiv = document.getElementById('hoursSection');
    if (place.opening_hours?.weekday_text) {
      hoursDiv.innerHTML = place.opening_hours.weekday_text
        .map(line => `<div>${line}</div>`).join('');
    } else {
      hoursDiv.innerText = "Hours not available.";
    }
    // Menu
    document.getElementById('menuSection').innerHTML = `
      <ul>
        <li>Sample Item 1</li>
        <li>Sample Item 2</li>
        <li>Sample Item 3</li>
      </ul>
    `;
    // Reviews placeholder (could fetch from other API)
    document.getElementById('reviewsList').innerHTML = `
      <li class="list-group-item">“Great food, will visit again!” – Alice</li>
      <li class="list-group-item">“Cozy atmosphere.” – Bob</li>
    `;
  });
}

// Load Maps JS for Place Details (no map display)
(function() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
             + `&libraries=places&callback=initDetails`;
  script.async = true;
  document.head.appendChild(script);
})();
