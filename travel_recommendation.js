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
                // Recursive search function to search the entire JSON
                function searchObject(obj) {
                    if (typeof obj === 'object' && obj !== null) {
                        for (let key in obj) {
                            if (typeof obj[key] === 'object') {
                                // Recursively search nested objects or arrays
                                const result = searchObject(obj[key]);
                                if (result) return result;
                            } else if (String(obj[key]).toLowerCase().includes(input)) {
                                return obj;  // Return the object if any of its properties match the input
                            }
                        }
                    }
                    return null;
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
                        'Copacabana, Brazil': 'America/Sao_Paulo',
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

                const searchResult = searchObject(data);

                if (searchResult) {
                    // Display the search result: name, imageUrl, and description
                const name = searchResult.name || 'No name found';
                const imageUrl = searchResult.imageUrl || 'No image found';
                const description = searchResult.description|| '';
                const localTimeValue = localTime(name);

                    // Create and display the result content
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${name}" style="width: 300px; height: auto;" />
                    <h3>${name}</h3>
                    ${description ? `<p>${description}</p>` : ''}
                    <h3>Local Time: ${localTimeValue}</h3>
                    `;
                } else {
                    console.log("Search unsuccessful.");

                    // Create and display the result content
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
    


/*
     function searchKeyword() {
        const input = document.getElementById('searchBar').value.toLowerCase();
        const resultDiv = document.getElementById('results');
        resultDiv.innerHTML = '';

        fetch('travel_recommendation_api.json')
          .then(response => response.json())
          .then(data => {
            const country = data.countries.find(item => item.name.toLowerCase() === input);



            if (condition) {
              const symptoms = condition.symptoms.join(', ');
              const prevention = condition.prevention.join(', ');
              const treatment = condition.treatment;
              console.log("Search successfully founded.");
              
              resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
              resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="ilustration">`;

              resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
              resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
              resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
            
            } else {
                console.log("Search unsuccessfull.");
              resultDiv.innerHTML = 'Condition not found.'; 
            }
          })
          .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = 'An error occurred while fetching data.';
          });
      }
        searchButton.addEventListener('click', searchKeyword);

*/
       