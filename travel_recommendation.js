const results = document.getElementById("results");
const searchButton = document.getElementById('searchButton');
results.style.display = 'none';

function searchKeyword() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            // Store multiple search results
            let foundResults = [];

            function searchObject(obj) {
                if (Array.isArray(obj)) {
                    // If the current object is an array, loop through each element
                    for (let item of obj) {
                        searchObject(item); // Recursively search each element of the array
                        if (foundResults.length >= 2) return; // Stop once two results are found
                    }
                } else if (typeof obj === 'object' && obj !== null) {
                    // If it's an object, loop through its keys
                    for (let key in obj) {
                        if (typeof obj[key] === 'object' || Array.isArray(obj[key])) {
                            // Recursively search nested objects or arrays
                            searchObject(obj[key]);
                            if (foundResults.length >= 2) return; // Stop once two results are found
                        } else if (String(obj[key]).toLowerCase().includes(input)) {
                            // Check if this object has already been added to foundResults
                            if (!foundResults.some(result => result.name === obj.name)) {
                                // If not already added, push the entire object (city, country, temple, etc.) to foundResults
                                foundResults.push(obj);
                                if (foundResults.length >= 2) return; // Stop once two results are found
                            }
                        }
                    }
                }
            }
            
            

            // Perform the search
            searchObject(data);

            if (foundResults.length > 0) {
                resultDiv.style.display = 'block';

                // Loop through first two found results and display them
                foundResults.slice(0, 2).forEach((searchResult) => {
                    const name = searchResult.name || 'No name found';
                    const imageUrl = searchResult.imageUrl || 'No image found';
                    const description = searchResult.description || '';
                    const localTimeValue = localTime(name);

                    // Create and display the result content
                    resultDiv.innerHTML += `
                    <div class="result-card">
                    <img src="${imageUrl}" alt="${name}" />
                    <div>
                    <h3>${name}</h3>
                    ${description ? `<p>${description}</p>` : ''}
                    <h3>Local Time: ${localTimeValue}</h3>
                    </div>
                    </div>
                    </br>
                    `;
                });
            } else {
                console.log("Search unsuccessful.");
                // Display message if no results found
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                <h3>No result found</h3>
                <p>We couldn't find any destinations that match your search.</p>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = 'An error occurred while fetching data.';
        });
}

function localTime(city) {
    const euTime = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false, // Use 24-hour format
    };

    // Define a mapping of cities to their respective time zones
    const timeZones = {
        'Australia': 'Australia/Sydney',
        'Sydney, Australia': 'Australia/Sydney',
        'Melbourne, Australia': 'Australia/Sydney',
        'Japan': 'Asia/Tokyo',
        'Tokyo, Japan': 'Asia/Tokyo',
        'Kyoto, Japan': 'Asia/Tokyo',
        'Brazil': 'America/Sao_Paulo',
        'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
        'Sao Paulo, Brazil': 'America/Sao_Paulo',
        'Copacabana Beach, Brazil': 'America/Sao_Paulo',
        'Taj Mahal, India': 'Asia/Kolkata',
        'Angkor Wat, Cambodia': 'Asia/Bangkok',
        'Bora Bora, French Polynesia': 'Pacific/Bora_Bora'
    };

    // Get the appropriate time zone for the city
    const timeZone = timeZones[city];

    // If the city is found in the mapping, return the local time
    if (timeZone) {
        return new Date().toLocaleTimeString('en-GB', { ...euTime, timeZone });
    }

    return null; // Return null if the city is not found
}

function searchReset() {
    const searchBar = document.getElementById('searchBar');
    searchBar.value = '';
    
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '';
    resultDiv.style.display = 'none';
}

// Event listener for the search button
searchButton.addEventListener('click', searchKeyword);

// Event listener for the reset button
resetButton.addEventListener('click', searchReset);
