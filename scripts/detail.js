// Initializes page
window.initDetails = function () {
  // Parses the place_id from URL
  const params = new URLSearchParams(window.location.search);
  const placeId = params.get("place_id");
  if (!placeId) {
    document.getElementById("placeName").innerText = "Error: No place specified.";
    return;
  }

  // Initializes Places Service
  const service = new google.maps.places.PlacesService(document.createElement("div"));

  // Request place details
  service.getDetails(
    {
      placeId: placeId,
      fields: [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "website",
        "opening_hours",
        "price_level",
        "rating",
        "user_ratings_total",
        "photos"
      ],
    },
    function (place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        // === NAME & ADDRESS ===
        document.getElementById("placeName").innerText = place.name || "Unnamed Place";
        document.getElementById("placeAddress").innerText = place.formatted_address || "";

        // === VIBE TAGS ===
        const tagContainer = document.getElementById("tags");
        const tags = [];

        if (place.rating >= 4.5) tags.push("🔥 Popular");
        if (place.price_level === 1) tags.push("💸 Cheap Eats");
        if (place.price_level === 4) tags.push("💎 Fancy Spot");
        tags.push("🍽️ Dine-In"); // Static example

        tags.forEach((tag) => {
          const span = document.createElement("span");
          span.className = "badge bg-primary me-1";
          span.innerText = tag;
          tagContainer.appendChild(span);
        });

        // === CONTACT INFO ===
        const contactP = document.getElementById("placeContact");
        if (place.formatted_phone_number) {
          contactP.innerHTML = `<strong>Phone:</strong> <a href="tel:${place.formatted_phone_number}">${place.formatted_phone_number}</a>`;
        }
        if (place.website) {
          const websiteLink = document.createElement("a");
          websiteLink.href = place.website;
          websiteLink.target = "_blank";
          websiteLink.innerText = "Website";
          if (place.formatted_phone_number) {
            contactP.innerHTML += " | ";
          }
          contactP.appendChild(websiteLink);
        }
        if (!place.formatted_phone_number && !place.website) {
          contactP.innerText = ""; // No contact info
        }

        // === HOURS ===
        const hoursSec = document.getElementById("hoursSection");
        if (place.opening_hours && place.opening_hours.weekday_text) {
          const hoursList = document.createElement("ul");
          hoursList.className = "list-unstyled";
          place.opening_hours.weekday_text.forEach((dayHours) => {
            const li = document.createElement("li");
            li.textContent = dayHours;
            hoursList.appendChild(li);
          });
          hoursSec.innerHTML = "<h5>Opening Hours:</h5>";
          hoursSec.appendChild(hoursList);
        } else {
          hoursSec.innerHTML = "<p><em>Hours information not available.</em></p>";
        }

        // === PRICE & RATING ===
        if (place.rating !== undefined) {
          const ratingText = `Rating: ${place.rating.toFixed(1)} / 5`;
          const count = place.user_ratings_total || 0;
          const ratingP = document.createElement("p");
          ratingP.innerHTML =
            `<strong>${ratingText}</strong>` +
            (count ? ` <span class="text-muted">(${count} reviews)</span>` : "");
          document.getElementById("menuSection").before(ratingP);
        }
        if (place.price_level !== undefined) {
          const priceSymbols = "$".repeat(place.price_level) || "$";
          const priceP = document.createElement("p");
          priceP.innerHTML = `<strong>Price Level:</strong> ${priceSymbols}`;
          document.getElementById("menuSection").before(priceP);
        }

        // === SAMPLE MENU ===
        const menuSec = document.getElementById("menuSection");
        const menuList = document.createElement("ul");
        menuList.className = "list-unstyled";
        const sampleMenu = ["Margherita Pizza", "Caesar Salad", "Spaghetti Bolognese"];
        sampleMenu.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          menuList.appendChild(li);
        });
        menuSec.appendChild(menuList);

        // === REVIEWS ===
        const reviews = [
          { author: "Alex", text: "Amazing food and fast service!" },
          { author: "Jordan", text: "Loved the ambiance. Will visit again." },
          { author: "Sam", text: "Great place for date night!" },
        ];

        const reviewsList = document.getElementById("reviewsList");
        reviews.forEach((r) => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.innerHTML = `<strong>${r.author}:</strong> ${r.text}`;
          reviewsList.appendChild(li);
        });

        // === IMAGE CAROUSEL ===
        if (place.photos && place.photos.length > 0) {
          const carouselInner = document.getElementById("carouselImages");
        
          place.photos.slice(0, 5).forEach((photo, i) => {
            const imageUrl = photo.getUrl({ maxWidth: 600 });
            const div = document.createElement("div");
            div.className = `carousel-item ${i === 0 ? "active" : ""}`;
            div.innerHTML = `<img src="${imageUrl}" class="d-block w-100" alt="Restaurant image">`;
            carouselInner.appendChild(div);
          });
        }
        

        const carouselInner = document.getElementById("carouselImages");
        imageUrls.forEach((url, i) => {
          const div = document.createElement("div");
          div.className = `carousel-item ${i === 0 ? "active" : ""}`;
          div.innerHTML = `<img src="${url}" class="d-block w-100" alt="Restaurant image">`;
          carouselInner.appendChild(div);
        });
      } else {
        document.getElementById("placeName").innerText = "Failed to load restaurant details.";
        console.error("Places API getDetails error:", status);
      }
    }
  );
};

// Load Google Maps Places API with callback to initDetails
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initDetails`;
script.async = true;
document.head.appendChild(script);
