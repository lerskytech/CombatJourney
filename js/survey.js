// Survey and Results Handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('martial-arts-survey');
    const resultsSection = document.getElementById('survey-results');
    const stylesOverview = document.querySelector('.styles-overview');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const goal = document.getElementById('goal').value;
            const experience = document.getElementById('experience').value;
            const preference = document.getElementById('preference').value;
            const location = document.getElementById('location').value;
            
            // Generate recommendations based on selections
            const recommendations = generateRecommendations(goal, experience, preference);
            
            // Display results
            displayResults(recommendations, location);
            
            // Show styles overview and results section
            if (stylesOverview && stylesOverview.classList.contains('hidden')) {
                stylesOverview.classList.remove('hidden');
            }
            resultsSection.classList.remove('hidden');
            
            // Smooth scroll to styles overview
            stylesOverview.scrollIntoView({behavior: 'smooth', block: 'start'});
            
            // If location was provided, update map
            if (location) {
                updateMapLocation(location);
            } else {
                // Use geolocation if no location provided
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            map.setCenter(userLocation);
                            findGyms(userLocation);
                        },
                        () => {
                            // If user denies location permission, use default location
                            console.log('Geolocation permission denied');
                        }
                    );
                }
            }
        });
    }
    
    // Hide empty state section initially
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
});

// Generate martial art recommendations based on user selections
function generateRecommendations(goal, experience, preference) {
    let recommendedStyles = [];
    let explanation = '';
    let gear = [];
    let advice = '';
    
    // Recommendation logic based on preferences
    if (preference === 'striking') {
        if (goal === 'fitness') {
            recommendedStyles = ['Boxing', 'Muay Thai', 'Kickboxing'];
            explanation = "Based on your focus on fitness and preference for striking arts, we recommend boxing, Muay Thai, or kickboxing. These styles provide excellent cardiovascular workouts while teaching practical striking techniques.";
            gear = ['Hand wraps', 'Boxing/MMA gloves (12-16oz)', 'Mouth guard', 'Athletic clothing'];
            advice = "When visiting a gym, ask about their conditioning program and if they offer beginner-friendly classes. Most gyms will let you try a class before committing. Don't worry about your fitness level - instructors expect beginners to need time to build stamina.";
        } else if (goal === 'self-defense') {
            recommendedStyles = ['Muay Thai', 'Kickboxing', 'Krav Maga'];
            explanation = "For self-defense with striking focus, Muay Thai or Krav Maga would be excellent choices. These martial arts teach practical techniques that can be effective in real-world situations.";
            gear = ['Hand wraps', 'MMA gloves', 'Shin guards', 'Mouth guard'];
            advice = "Focus on fundamentals and practical application over flashy techniques. Let the instructor know you're interested in the self-defense aspects of training. Be consistent with your attendance - muscle memory is crucial for self-defense skills.";
        } else if (goal === 'competition') {
            recommendedStyles = ['Boxing', 'Muay Thai', 'Kickboxing', 'Karate (Sport)'];
            explanation = "For competitive striking, boxing, Muay Thai, or sport karate offer established competition circuits with various levels from amateur to professional. These arts have clear progression paths for competitive fighters.";
            gear = ['Competition-grade gloves', 'Hand wraps', 'Shin guards', 'Mouth guard', 'Headgear'];
            advice = "Talk to coaches about their experience developing competitors and ask about the gym's competitive record. Consider finding a gym with active competitors and a competition team. Start slow and focus on technique before competing.";
        } else {
            recommendedStyles = ['Muay Thai', 'Boxing', 'Karate', 'Taekwondo'];
            explanation = "Based on your interest in striking martial arts, disciplines like Muay Thai, boxing, karate or Taekwondo would align well with your goals. Each offers a distinct striking style and training approach.";
            gear = ['Hand wraps', 'Gloves', 'Mouth guard', 'Comfortable workout clothes'];
            advice = "Visit several gyms to find the right community and teaching style for you. Most offer free trial classes. Don't be intimidated - everyone starts as a beginner. Focus on consistency and learning proper technique before power.";
        }
    } else if (preference === 'grappling') {
        if (goal === 'fitness') {
            recommendedStyles = ['Brazilian Jiu-Jitsu (BJJ)', 'Wrestling', 'Judo'];
            explanation = "For fitness through grappling, BJJ and wrestling provide incredible full-body workouts that build functional strength and cardiovascular endurance while teaching technical ground skills.";
            gear = ['Rashguard', 'Grappling shorts or gi', 'Mouth guard', 'Athletic clothing'];
            advice = "Grappling arts like BJJ are technical and may feel overwhelming at first. Focus on learning one technique at a time and don't get discouraged. Most schools offer fundamentals classes specifically for beginners.";
        } else if (goal === 'self-defense') {
            recommendedStyles = ['Brazilian Jiu-Jitsu (BJJ)', 'Judo', 'Wrestling'];
            explanation = "BJJ is excellent for self-defense, especially for managing situations that go to the ground. Judo adds powerful throwing techniques that can be effective for creating distance or controlling an aggressor.";
            gear = ['BJJ Gi', 'Rashguard', 'Mouth guard'];
            advice = "Grappling arts require consistent practice to develop muscle memory. Focus on defensive positions and escapes first. Remember that self-defense is more than techniques—awareness and avoidance are equally important skills.";
        } else if (goal === 'competition') {
            recommendedStyles = ['Brazilian Jiu-Jitsu (BJJ)', 'Judo', 'Wrestling', 'Sambo'];
            explanation = "For competitive grappling, BJJ offers the most accessible competition scene for adults with frequent tournaments for all skill levels. Wrestling and judo are also excellent competitive grappling arts with established circuits.";
            gear = ['Competition gi or no-gi gear', 'Rash guard', 'Spats', 'Mouth guard'];
            advice = "Find a gym with a competition team and coaches experienced in preparing athletes. Start competing early but with appropriate expectations—focus on applying techniques rather than just winning. Competition experience is invaluable regardless of results.";
        } else {
            recommendedStyles = ['Brazilian Jiu-Jitsu (BJJ)', 'Judo', 'Wrestling'];
            explanation = "Based on your interest in grappling martial arts, BJJ, judo or wrestling would be excellent choices. These arts focus on control, leverage and technique rather than striking.";
            gear = ['Gi or no-gi attire', 'Mouth guard', 'Athletic clothing'];
            advice = "Grappling arts have a steeper learning curve than striking arts, but offer tremendous rewards in terms of technical development. Be patient with yourself and focus on small improvements. The grappling community is typically very welcoming to beginners.";
        }
    } else { // both/not sure
        if (goal === 'fitness') {
            recommendedStyles = ['Mixed Martial Arts (MMA)', 'Muay Thai', 'Brazilian Jiu-Jitsu (BJJ)'];
            explanation = "For comprehensive fitness training, MMA provides the most well-rounded workout combining striking and grappling. Many gyms offer MMA conditioning classes specifically for fitness that don't require sparring.";
            gear = ['MMA gloves', 'Hand wraps', 'Rashguard', 'Athletic clothing'];
            advice = "Let coaches know your fitness goals and they can guide your training appropriately. Many MMA gyms offer specific fitness-oriented classes that incorporate martial arts techniques without full contact sparring.";
        } else if (goal === 'self-defense') {
            recommendedStyles = ['Krav Maga', 'Mixed Martial Arts (MMA)', 'Brazilian Jiu-Jitsu (BJJ)'];
            explanation = "For practical self-defense, a combination of striking and grappling skills is ideal. Krav Maga specifically focuses on real-world self-defense scenarios, while MMA provides a solid foundation in both striking and grappling.";
            gear = ['MMA gloves', 'Mouth guard', 'Athletic clothing', 'Groin protection'];
            advice = "For self-defense, focus on fundamentals that work under stress rather than complex techniques. Train regularly to develop muscle memory and consider supplementing with scenario-based self-defense workshops.";
        } else if (goal === 'competition') {
            recommendedStyles = ['Mixed Martial Arts (MMA)', 'Brazilian Jiu-Jitsu (BJJ)', 'Muay Thai'];
            explanation = "If you're interested in competition that combines striking and grappling, MMA is the obvious choice. However, many competitors train individual arts like BJJ and Muay Thai separately before combining them for MMA.";
            gear = ['MMA gloves', 'Shin guards', 'Mouth guard', 'Rashguard', 'Athletic clothing'];
            advice = "Most coaches recommend building a strong foundation in either striking (Muay Thai, Boxing) or grappling (BJJ, Wrestling) before transitioning to MMA competition. Find a gym with experienced competition coaches and an active fight team.";
        } else {
            recommendedStyles = ['Mixed Martial Arts (MMA)', 'Brazilian Jiu-Jitsu (BJJ)', 'Muay Thai', 'Judo'];
            explanation = "Since you're open to both striking and grappling, MMA offers the most comprehensive martial arts experience. Alternatively, you could try dedicated striking (Muay Thai) and grappling (BJJ) classes to see which style resonates with you more.";
            gear = ['MMA gloves', 'Hand wraps', 'Mouth guard', 'Athletic clothing', 'Rashguard'];
            advice = "Try different styles before committing to one path. Many martial artists train in multiple disciplines. Find a gym with a positive, supportive culture where instructors pay attention to proper technique and safety. Consistency is key to progress in any martial art.";
        }
    }
    
    return {
        styles: recommendedStyles,
        explanation: explanation,
        gear: gear,
        advice: advice
    };
}

// Display results in the results section
function displayResults(recommendations, location) {
    const recommendedStyleElement = document.getElementById('recommended-style');
    const explanationElement = document.getElementById('explanation');
    const gearListElement = document.getElementById('gear-list');
    const adviceTextElement = document.getElementById('starting-advice-text');
    
    // Display recommended styles with more emphasis
    recommendedStyleElement.innerHTML = `<h4>Recommended Martial Arts for You</h4>
                                        <p class="recommended-styles">${recommendations.styles.join(' • ')}</p>`;
    
    // Display explanation
    explanationElement.innerHTML = `<p>${recommendations.explanation}</p>`;
    
    // Display gear list
    gearListElement.innerHTML = '';
    recommendations.gear.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        gearListElement.appendChild(li);
    });
    
    // Display advice
    adviceTextElement.textContent = recommendations.advice;
    
    // Show the gym finder section with a scroll hint
    const gymFinder = document.getElementById('gym-finder');
    if (gymFinder) {
        setTimeout(() => {
            const scrollHint = document.createElement('div');
            scrollHint.className = 'scroll-hint';
            scrollHint.innerHTML = '<p>Scroll down to find gyms near you</p><i class="fas fa-chevron-down"></i>';
            scrollHint.style.opacity = '0';
            document.querySelector('.results-card').appendChild(scrollHint);
            
            setTimeout(() => {
                scrollHint.style.transition = 'opacity 0.5s ease';
                scrollHint.style.opacity = '1';
            }, 100);
            
            setTimeout(() => {
                scrollHint.style.opacity = '0';
                setTimeout(() => {
                    scrollHint.remove();
                }, 500);
            }, 3000);
        }, 2000);
    }
}

// Google Maps API Integration
let map;
let markers = [];
let infoWindows = [];
const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // Default to New York

function initMap() {
    // Create the map with default options
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 12,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
        ],
    });

    // Try to get user's location for initial map center
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);
                findGyms(userLocation);
            },
            () => {
                // If user denies location permission, use default location
                findGyms(defaultLocation);
            }
        );
    } else {
        // Browser doesn't support geolocation
        findGyms(defaultLocation);
    }
}

// Update map based on entered location
function updateMapLocation(locationText) {
    // Use Google Maps Geocoding API to convert address to coordinates
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationText }, (results, status) => {
        if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            findGyms(location);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}

// Find nearby martial arts gyms
function findGyms(location) {
    // Clear existing markers and info windows
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    infoWindows = [];
    
    // Create Places service
    const service = new google.maps.places.PlacesService(map);
    
    // Search for martial arts gyms
    service.nearbySearch(
        {
            location: location,
            radius: 8000, // 8km radius for more results
            keyword: ["martial arts", "mma", "boxing", "bjj", "karate", "judo", "muay thai", "wrestling", "taekwondo"],
            type: ["gym"]
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                // Create markers for each gym
                results.forEach(place => {
                    createMarker(place);
                });
                
                // Create bounds to fit all markers
                const bounds = new google.maps.LatLngBounds();
                markers.forEach(marker => bounds.extend(marker.getPosition()));
                map.fitBounds(bounds);
                
                // If there's only one result, don't zoom in too much
                if (results.length === 1) {
                    map.setZoom(14);
                }
                
                // Show the first result's info window by default
                if (infoWindows.length > 0) {
                    setTimeout(() => {
                        infoWindows[0].open(map, markers[0]);
                    }, 1000);
                }
                
                // Hide empty state if visible
                const emptyState = document.getElementById('empty-state');
                if (emptyState && !emptyState.classList.contains('hidden')) {
                    emptyState.classList.add('hidden');
                }
            } else {
                // Show empty state if no results
                const emptyState = document.getElementById('empty-state');
                if (emptyState) {
                    emptyState.classList.remove('hidden');
                    emptyState.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
                
                // Center map on searched location
                map.setCenter(location);
                map.setZoom(11);
                
                console.log('No martial arts gyms found in this area');
            }
        }
    );
}

// Create a marker for a gym
function createMarker(place) {
    // Custom marker icon for better visibility on dark map
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#d32f2f",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 10
        }
    });
    
    // Add info window with gym details
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="color: #333; padding: 10px; font-family: 'Montserrat', sans-serif;">
                <h3 style="margin: 0 0 8px; color: #d32f2f; font-size: 16px; font-weight: 700;">${place.name}</h3>
                <div style="margin-bottom: 5px; font-size: 14px;">${place.vicinity || ""}</div>
                <div style="margin-bottom: 8px; font-size: 14px;">Rating: ${place.rating ? `${place.rating}⭐ (${place.user_ratings_total} reviews)` : "No ratings yet"}</div>
                <a href="https://www.google.com/maps/place/?q=place_id:${place.place_id}" target="_blank" 
                   style="color: #d32f2f; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 5px; font-size: 14px; padding: 5px 0;">
                   View on Google Maps
                </a>
            </div>
        `
    });
    
    // Close all open info windows when a new one is clicked
    marker.addListener("click", () => {
        infoWindows.forEach(iw => iw.close());
        infoWindow.open(map, marker);
    });
    
    markers.push(marker);
    infoWindows.push(infoWindow);
    
    // Bounce marker on hover
    marker.addListener("mouseover", () => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 750);
    });
    
    return marker;
}
