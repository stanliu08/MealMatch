// scripts/detail.js

// Initialize the page after Google Maps JS API is loaded
window.initDetails = function() {
    // Parse the place_id from URL
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('place_id');
    if (!placeId) {
      document.getElementById('placeName').innerText = "Error: No place specified.";
      return;
    }
  
    // Initialize Places Service (no map needed, use dummy div)
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    // Request place details (specify fields to limit data & cost)&#8203;:contentReference[oaicite:9]{index=9}
    service.getDetails({
      placeId: placeId,
      fields: [
        'name', 'formatted_address', 'formatted_phone_number', 'website',
        'opening_hours', 'price_level', 'rating', 'user_ratings_total'
      ]
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        // Fill in the page with place details
        document.getElementById('placeName').innerText = place.name || "Unnamed Place";
        document.getElementById('placeAddress').innerText = place.formatted_address || "";
  
        // Contact info: phone and website if available
        const contactP = document.getElementById('placeContact');
        if (place.formatted_phone_number) {
          contactP.innerHTML = `<strong>Phone:</strong> <a href="tel:${place.formatted_phone_number}">${place.formatted_phone_number}</a>`;
        }
        if (place.website) {
          // Append website info (open in new tab)
          const websiteLink = document.createElement('a');
          websiteLink.href = place.website;
          websiteLink.target = "_blank";
          websiteLink.innerText = "Website";
          // If phone was set, add separator
          if (place.formatted_phone_number) {
            contactP.innerHTML += " | ";
          }
          contactP.appendChild(websiteLink);
        }
        if (!place.formatted_phone_number && !place.website) {
          contactP.innerText = "";  // no contact info
        }
  
        // Opening hours
        const hoursSec = document.getElementById('hoursSection');
        if (place.opening_hours && place.opening_hours.weekday_text) {
          const hoursList = document.createElement('ul');
          hoursList.className = "list-unstyled";
          // Display each day and hours
          place.opening_hours.weekday_text.forEach(dayHours => {
            const li = document.createElement('li');
            li.textContent = dayHours;
            hoursList.appendChild(li);
          });
          hoursSec.innerHTML = "<h5>Opening Hours:</h5>";
          hoursSec.appendChild(hoursList);
        } else {
          hoursSec.innerHTML = "<p><em>Hours information not available.</em></p>";
        }
  
        // Rating and price details
        if (place.rating !== undefined) {
          const ratingText = `Rating: ${place.rating.toFixed(1)} / 5`;
          const count = place.user_ratings_total || 0;
          const ratingP = document.createElement('p');
          ratingP.innerHTML = `<strong>${ratingText}</strong>` + (count ? ` <span class="text-muted">(${count} reviews)</span>` : "");
          document.getElementById('menuSection').before(ratingP);
        }
        if (place.price_level !== undefined) {
          const priceSymbols = "$".repeat(place.price_level) || "$";
          const priceP = document.createElement('p');
          priceP.innerHTML = `<strong>Price Level:</strong> ${priceSymbols}`;
          document.getElementById('menuSection').before(priceP);
        }
  
        // Menu items (Note: Google Places API does not provide actual menus)
        const menuSec = document.getElementById('menuSection');
        // We use mock data since the API doesn't return menu details&#8203;:contentReference[oaicite:10]{index=10}.
        menuSec.innerHTML = "<h5>Sample Menu Items:</h5>";
        const menuList = document.createElement('ul');
        menuList.className = "list-unstyled";
        // Example static menu items (these are placeholders)
        const sampleMenu = ["Margherita Pizza", "Caesar Salad", "Spaghetti Bolognese"];
        sampleMenu.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          menuList.appendChild(li);
        });
        menuSec.appendChild(menuList);
      } else {
        // If place details retrieval failed
        document.getElementById('placeName').innerText = "Failed to load restaurant details.";
        console.error("Places API getDetails error:", status);
      }
    });
  };
  
  // Load the Google Maps Places API script with callback to initDetails
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initDetails`;
  script.async = true;
  document.head.appendChild(script);
  