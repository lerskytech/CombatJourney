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
    const resultsSection = document.getElementById('survey-results');
    const recommendedStyleEl = document.getElementById('recommended-style');
    const explanationEl = document.getElementById('explanation');
    const gearListEl = document.getElementById('gear-list');
    const startingAdviceEl = document.getElementById('starting-advice-text');
    const motivationQuoteEl = document.getElementById('motivation-quote-text');
    
    // Update user personal info with goal, experience level, and location
    const goalEl = document.getElementById('user-goal');
    const experienceEl = document.getElementById('user-experience');
    const locationEl = document.getElementById('user-location');
    
    // Get the current form values
    const goalValue = document.getElementById('goal').value;
    const experienceValue = document.getElementById('experience').value;
    const preferenceValue = document.getElementById('preference').value;
    
    // Format values for display
    const goalFormatted = goalValue.charAt(0).toUpperCase() + goalValue.slice(1);
    const experienceFormatted = experienceValue.charAt(0).toUpperCase() + experienceValue.slice(1);
    
    // Set the personal info values
    if (goalEl) goalEl.textContent = goalFormatted;
    if (experienceEl) experienceEl.textContent = experienceFormatted;
    if (locationEl) locationEl.textContent = location || 'your area';
    
    if (recommendations && recommendations.styles) {
        // Display recommended styles as badge chips
        let badgesHTML = '';
        recommendations.styles.forEach(style => {
            badgesHTML += `<span class="style-badge">${style}</span>`;
        });
        recommendedStyleEl.innerHTML = badgesHTML;
        
        // Display explanation
        explanationEl.innerHTML = `<p>${recommendations.explanation}</p>`;
        
        // Display gear checklist
        let gearListHTML = '';
        if (recommendations.gear && recommendations.gear.length > 0) {
            recommendations.gear.forEach(item => {
                gearListHTML += `<li><span class="gear-check"></span>${item}</li>`;
            });
            gearListEl.innerHTML = gearListHTML;
        }
        
        // Display starting advice
        if (recommendations.advice) {
            startingAdviceEl.innerHTML = recommendations.advice;
        }
        
        // Generate and display a motivational quote based on user's goal
        if (motivationQuoteEl) {
            const quotes = {
                'fitness': [
                    "Train with purpose, transform with passion.",
                    "Every drop of sweat is progress made visible.",
                    "Discipline is choosing between what you want now and what you want most."
                ],
                'self-defense': [
                    "True strength lies not in showing power, but in having it and knowing when to use it.",
                    "Confidence comes not from always being right but from not fearing to be wrong.",
                    "The best fight is the one you avoid."
                ],
                'competition': [
                    "Champions aren't made in gyms. Champions are made from something deep inside them.",
                    "The difference between the impossible and the possible lies in determination.",
                    "Victory belongs to those who believe in it the most and believe in it the longest."
                ],
                'tradition': [
                    "The martial way begins and ends with respect.",
                    "Master the basics before seeking the secrets.",
                    "The ultimate aim of martial arts is not having to use them."
                ]
            };
            
            // Select a random quote from the appropriate category
            const quoteCategory = quotes[goalValue] || quotes['fitness'];
            const randomQuote = quoteCategory[Math.floor(Math.random() * quoteCategory.length)];
            
            motivationQuoteEl.textContent = randomQuote;
        }
        
        // Make sure results section is visible
        if (resultsSection.classList.contains('hidden')) {
            resultsSection.classList.remove('hidden');
        }
        
        // Smooth scroll to results section
        resultsSection.scrollIntoView({behavior: 'smooth', block: 'start'});
        
        // Add event listeners for share and download buttons
        setupShareAndDownloadButtons(recommendations, location);
    }
}

// Share and Download Functionality
function setupShareAndDownloadButtons(recommendations, location) {
    const shareButton = document.getElementById('share-journey');
    const downloadButton = document.getElementById('download-journey');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            const shareText = `I discovered my ideal martial arts path with CombatJourney! My personalized plan includes ${recommendations.styles.join(', ')} for my ${document.getElementById('goal').value} goals. #CombatJourney #MartialArts`;
            
            // Try to use Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: 'My CombatJourney Plan',
                    text: shareText,
                    url: window.location.href
                }).then(() => {
                    console.log('Share successful');
                }).catch(err => {
                    console.log('Share failed:', err);
                    fallbackShare(shareText);
                });
            } else {
                fallbackShare(shareText);
            }
        });
    }
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // We'll use html2canvas to convert the results card to an image
            const resultsCard = document.getElementById('survey-results');
            
            // First check if html2canvas is loaded
            if (typeof html2canvas === 'undefined') {
                // If not loaded, dynamically load it
                const script = document.createElement('script');
                script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
                script.onload = function() {
                    // Once loaded, process the download
                    processDownload(resultsCard);
                };
                document.head.appendChild(script);
            } else {
                // If already loaded, process the download directly
                processDownload(resultsCard);
            }
        });
    }
}

// Fallback share function for copying to clipboard
function fallbackShare(shareText) {
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = shareText;
    document.body.appendChild(textarea);
    textarea.select();
    
    // Copy text to clipboard
    try {
        document.execCommand('copy');
        alert('Share text copied to clipboard: ' + shareText);
    } catch (err) {
        console.error('Failed to copy share text', err);
        alert('Failed to copy share text. Please manually share:\n' + shareText);
    } finally {
        document.body.removeChild(textarea);
    }
}

// Process the download of the results card as an image
function processDownload(element) {
    // Create loading overlay with premium styling
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '9999';
    loadingOverlay.style.flexDirection = 'column';
    
    // Create a loading animation
    const loadingSpinner = document.createElement('div');
    loadingSpinner.style.width = '60px';
    loadingSpinner.style.height = '60px';
    loadingSpinner.style.border = '4px solid rgba(186, 147, 62, 0.3)';
    loadingSpinner.style.borderTop = '4px solid rgba(186, 147, 62, 1)';
    loadingSpinner.style.borderRadius = '50%';
    loadingSpinner.style.margin = '0 auto 20px';
    loadingSpinner.style.animation = 'spin 1.5s linear infinite';
    
    // Add the animation keyframes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Creating your premium achievement card...';
    loadingText.style.color = 'white';
    loadingText.style.fontFamily = 'Montserrat, sans-serif';
    loadingText.style.fontSize = '18px';
    loadingText.style.textAlign = 'center';
    loadingText.style.maxWidth = '80%';
    
    // Add a styled subtitle
    const subtitle = document.createElement('div');
    subtitle.textContent = 'This may take a few seconds';
    subtitle.style.color = 'rgba(186, 147, 62, 0.9)';
    subtitle.style.fontFamily = 'Montserrat, sans-serif';
    subtitle.style.fontSize = '14px';
    subtitle.style.marginTop = '10px';
    
    loadingOverlay.appendChild(loadingSpinner);
    loadingOverlay.appendChild(loadingText);
    loadingOverlay.appendChild(subtitle);
    document.body.appendChild(loadingOverlay);
    
    // Prepare the element for capture
    const originalPosition = element.style.position;
    const originalZIndex = element.style.zIndex;
    const originalBackground = element.style.background;
    
    // Temporarily enhance the card for better image quality
    element.style.position = 'relative';
    element.style.zIndex = '1';
    
    // Use html2canvas with optimized settings for premium quality
    html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        backgroundColor: null, // Transparent background
        logging: false,
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 0, // No timeout
        onclone: function(clonedDoc) {
            // We can further enhance the cloned element before capturing
            const clonedElement = clonedDoc.querySelector('#achievement-card');
            if (clonedElement) {
                clonedElement.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.6)';
            }
        }
    }).then(canvas => {
        // Restore original element properties
        element.style.position = originalPosition;
        element.style.zIndex = originalZIndex;
        element.style.background = originalBackground;
        
        // Convert canvas to image with high quality
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = 'CombatJourney-Certificate.png';
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Remove loading overlay with a slight delay to ensure download starts
        setTimeout(() => {
            document.body.removeChild(loadingOverlay);
            // Remove the added style element
            document.head.removeChild(styleSheet);
        }, 500);
    }).catch(error => {
        console.error('Error generating image:', error);
        alert('Sorry, there was a problem generating your premium certificate. Please try again.');
        document.body.removeChild(loadingOverlay);
        document.head.removeChild(styleSheet);
        
        // Restore original element properties
        element.style.position = originalPosition;
        element.style.zIndex = originalZIndex;
        element.style.background = originalBackground;
    });
}

// Google Maps API Integration
let map;
let markers = [];
let infoWindows = [];
const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // Default to New York

function initMap() {
    try {
        // Hide error message if visible
        document.getElementById('map-error').classList.add('hidden');
        
        // Initialize Google Map with dark theme
        map = new google.maps.Map(document.getElementById("map"), {
            center: defaultLocation,
            zoom: 11,
            // Dark style map to match site theme
            styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
                { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
                { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
                { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
                { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
                { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
                { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
                { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
            ],
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
            zoomControl: true,
        });
        
        // Set up search button functionality
        const searchButton = document.getElementById('search-gyms-button');
        const locationInput = document.getElementById('gym-location-search');
        
        if (searchButton && locationInput) {
            searchButton.addEventListener('click', function() {
                const searchLocation = locationInput.value.trim();
                if (searchLocation) {
                    updateMapLocation(searchLocation);
                }
            });
            
            // Also search on Enter key
            locationInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const searchLocation = locationInput.value.trim();
                    if (searchLocation) {
                        updateMapLocation(searchLocation);
                    }
                }
            });
        }
        
        // If geolocation is available, ask for permission
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(userLocation);
                    findGyms(userLocation);
                },
                () => {
                    console.log("Geolocation permission denied");
                }
            );
        } else {
            console.log("Geolocation not supported by this browser");
        }
    } catch (error) {
        console.error("Error initializing map:", error);
        showMapError();
    }
}

// Update map based on entered location
function updateMapLocation(locationText) {
    // Show loading state
    const searchButton = document.getElementById('search-gyms-button');
    if (searchButton) {
        searchButton.disabled = true;
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    }
    
    // Hide any visible error
    document.getElementById('map-error').classList.add('hidden');
    
    try {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address: locationText }, (results, status) => {
            // Reset button state
            if (searchButton) {
                searchButton.disabled = false;
                searchButton.innerHTML = '<i class="fas fa-search"></i> Find Gyms';
            }
            
            if (status === google.maps.GeocoderStatus.OK) {
                const location = results[0].geometry.location;
                map.setCenter(location);
                findGyms(location);
                
                // Update location display in results if available
                const locationEl = document.getElementById('user-location');
                if (locationEl) {
                    locationEl.textContent = results[0].formatted_address || locationText;
                }
            } else {
                console.error('Geocoding failed: ' + status);
                
                // Show inline error message based on which location field was used
                const isGymSearch = locationElement.id === 'gym-location-search';
                const errorElement = isGymSearch ? document.getElementById('gym-location-error') : document.getElementById('location-error');
                
                if (errorElement) {
                    errorElement.textContent = `Couldn't find location "${locationText}". Please try again with a city name or zip code.`;
                    errorElement.classList.add('active');
                    locationElement.classList.add('error');
                    
                    // Auto-clear error after user starts typing again
                    locationElement.addEventListener('input', function clearError() {
                        errorElement.classList.remove('active');
                        locationElement.classList.remove('error');
                        locationElement.removeEventListener('input', clearError);
                    }, { once: true });
                }
            }
        });
    } catch (error) {
        console.error("Error updating map location:", error);
        if (searchButton) {
            searchButton.disabled = false;
            searchButton.innerHTML = '<i class="fas fa-search"></i> Find Gyms';
        }
        showMapError();
    }
}

// Show map error message
function showMapError() {
    const mapError = document.getElementById('map-error');
    if (mapError) {
        mapError.classList.remove('hidden');
    }
}

// Find nearby martial arts gyms
function findGyms(location) {
    try {
        if (!map || !location) return;
        
        // Clear any existing markers
        markers.forEach(marker => marker.setMap(null));
        markers = [];
        infoWindows = [];
        
        // Create PlacesService
        const service = new google.maps.places.PlacesService(map);
        
        // Update UI to show loading state
        const gymList = document.getElementById('gym-list');
        if (gymList) {
            gymList.innerHTML = `
                <li class="gym-placeholder">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <div style="border: 3px solid rgba(186, 147, 62, 0.2); border-top: 3px solid rgba(186, 147, 62, 1); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 10px;"></div>
                        Locating premium martial arts facilities...
                    </div>
                </li>
            `;
            
            // Add spinner animation if not already added
            if (!document.getElementById('gym-spinner-animation')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'gym-spinner-animation';
                styleSheet.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    
                    .gym-item {
                        animation: fadeIn 0.5s ease forwards;
                        opacity: 0;
                    }
                `;
                document.head.appendChild(styleSheet);
            }
        }
        
        // Create request for nearby martial arts gyms
        const request = {
            location: location,
            radius: '8000', // 8km radius for better results
            keyword: 'martial arts gym MMA BJJ boxing muay thai karate judo taekwondo',
            type: ['gym']
        };
        
        // Perform nearby search
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                // Sort results by rating
                results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                
                // Take top 5 results
                const topGyms = results.slice(0, 5);
                
                if (topGyms.length > 0) {
                    // Clear existing gym list
                    if (gymList) {
                        gymList.innerHTML = '';
                    }
                    
                    // Update map bounds to include all gyms
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(location);
                    
                    // Add markers for each gym and create list items
                    topGyms.forEach((place, index) => {
                        const marker = createMarker(place);
                        bounds.extend(place.geometry.location);
                        
                        // Add to gym list if it exists
                        if (gymList) {
                            const li = document.createElement('li');
                            li.className = 'gym-item';
                            li.style.animationDelay = `${0.2 + (index * 0.1)}s`;
                            
                            // Format rating stars with font awesome
                            let ratingHTML = '';
                            if (place.rating) {
                                const fullStars = Math.floor(place.rating);
                                const halfStar = place.rating % 1 >= 0.5;
                                
                                let starsHTML = '';
                                // Add full stars
                                for (let i = 0; i < fullStars; i++) {
                                    starsHTML += '<i class="fas fa-star"></i>';
                                }
                                // Add half star if needed
                                if (halfStar) {
                                    starsHTML += '<i class="fas fa-star-half-alt"></i>';
                                }
                                
                                ratingHTML = `
                                    <div class="gym-rating">
                                        <span class="gym-rating-stars">${starsHTML}</span>
                                        <span class="gym-rating-value">${place.rating.toFixed(1)}</span>
                                    </div>
                                `;
                            }
                            
                            // Get detailed place information
                            service.getDetails(
                                { placeId: place.place_id, fields: ['formatted_phone_number'] },
                                (placeDetails, detailsStatus) => {
                                    // Phone number html if available
                                    const phoneHTML = (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails && placeDetails.formatted_phone_number) ?
                                        `<div class="gym-contact"><i class="fas fa-phone-alt" style="margin-right:5px;"></i>${placeDetails.formatted_phone_number}</div>` : '';
                                    
                                    // Create Google Maps link for directions
                                    const mapsLink = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
                                    
                                    // Set the complete HTML content for the gym list item
                                    li.innerHTML = `
                                        <div class="gym-name">${place.name}</div>
                                        <div class="gym-address">${place.vicinity || ''}</div>
                                        ${phoneHTML}
                                        ${ratingHTML}
                                        <a href="${mapsLink}" class="view-on-map" target="_blank">
                                            <i class="fas fa-map-marker-alt"></i> View on Map
                                        </a>
                                    `;
                                }
                            );
                            
                            // Add event to highlight marker when hovering over list item
                            li.addEventListener('mouseenter', () => {
                                marker.setAnimation(google.maps.Animation.BOUNCE);
                                setTimeout(() => marker.setAnimation(null), 750);
                            });
                            
                            gymList.appendChild(li);
                        }
                    });
                    
                    // Adjust map to show all markers
                    map.fitBounds(bounds);
                    
                    // Don't zoom in too much on small areas
                    const listener = google.maps.event.addListener(map, 'idle', () => {
                        if (map.getZoom() > 15) {
                            map.setZoom(15);
                        }
                        google.maps.event.removeListener(listener);
                    });
                    
                    // Hide error message if visible
                    document.getElementById('map-error').classList.add('hidden');
                } else {
                    // No results found
                    if (gymList) {
                        gymList.innerHTML = `
                            <li class="gym-placeholder">
                                <div style="text-align: center;">
                                    <i class="fas fa-map-marker-slash" style="color: rgba(186, 147, 62, 0.8); font-size: 1.2rem; margin-bottom: 10px;"></i>
                                    <div>No martial arts facilities found nearby.</div>
                                    <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.8;">Try searching a different location.</div>
                                </div>
                            </li>
                        `;
                    }
                    
                    // Center map on searched location
                    map.setCenter(location);
                    map.setZoom(11);
                }
            } else {
                // API Error
                if (gymList) {
                    gymList.innerHTML = `
                        <li class="gym-placeholder">
                            <div style="text-align: center;">
                                <i class="fas fa-exclamation-triangle" style="color: rgba(186, 147, 62, 0.8); font-size: 1.2rem; margin-bottom: 10px;"></i>
                                <div>Unable to find martial arts facilities.</div>
                                <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.8;">Please try again later.</div>
                            </div>
                        </li>
                    `;
                }
                console.error("Places search failed due to:", status);
            }
        });
    } catch (error) {
        console.error("Error finding gyms:", error);
        showMapError();
        
        const gymList = document.getElementById('gym-list');
        if (gymList) {
            gymList.innerHTML = `
                <li class="gym-placeholder">
                    <div style="text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="color: rgba(186, 147, 62, 0.8); font-size: 1.2rem; margin-bottom: 10px;"></i>
                        <div>Error finding martial arts facilities.</div>
                        <div style="font-size: 0.9rem; margin-top: 5px; opacity: 0.8;">Please check your connection and try again.</div>
                    </div>
                </li>
            `;
        }
    }
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
