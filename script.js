
// let MySelectInput = document.getElementById('City')
// fetch('https://countriesnow.space/api/v0.1/countries')
//   .then(response => response.json())
//   .then(data => {
//     data.data.forEach(country => {
//       country.cities.forEach(city => {
//         let MonSelect = document.createElement('option')
//         MonSelect.value = country.iso2
//         MonSelect.innerHTML = city
//         MySelectInput.appendChild(MonSelect)
//       });
//     });
//   })
//   .catch(error => console.error('Erreur lors de la récupération des données:', error));
//   console.log(process.env.API_KEY)
// // https://api.openweathermap.org/data/2.5/weather?q=Kaboul,AF&appid=2333fa9e49aade835728c0c3745e132a
// // 2333fa9e49aade835728c0c3745e132a



const cityInput = document.getElementById('cityInput');
const citySelect = document.getElementById('citySelect');
const resultDiv = document.getElementById('result');

function searchCity() {
    const input = cityInput.value.trim();
    if (input === '') {
        alert('Veuillez entrer le nom d\'une ville');
        return;
    }

    fetch('https://countriesnow.space/api/v0.1/countries')
        .then(response => response.json())
        .then(data => {
            const countries = data.data;
            let cityFound = false;
            countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city === input) {
                        cityFound = true;
                        getWeather(city, country.iso2);
                    }
                });
            });
            if (!cityFound) {
                resultDiv.innerHTML = `La ville ${input} n'a pas été trouvée.`;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la recherche de la ville:', error);
            resultDiv.innerHTML = 'Une erreur est survenue lors de la recherche de la ville.';
        });
}

function showSuggestions() {
    const input = cityInput.value.trim().toLowerCase();
    const suggestions = [];
    fetch('https://countriesnow.space/api/v0.1/countries')
        .then(response => response.json())
        .then(data => {
            const countries = data.data;
            countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.toLowerCase().startsWith(input)) {
                        suggestions.push({ city, iso2: country.iso2 });
                    }
                });
            });
            renderSuggestions(suggestions);
        })
        .catch(error => {
            console.error('Erreur lors de la recherche des suggestions de villes:', error);
            citySelect.innerHTML = '';
        });
}

function renderSuggestions(suggestions) {
    citySelect.innerHTML = '';
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.textContent = suggestion.city;
        option.setAttribute('data-iso2', suggestion.iso2);
        citySelect.appendChild(option);
    });
}

function getWeather(city, iso2) {
    const apiKey = 'votre clé APi ';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${iso2}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `
                <h2>Météo pour ${city}, ${iso2}</h2>
                <p>Température: ${data.main.temp} K</p>
                <p>temp_min: ${data.main.temp_min} </p>
                <p>temp_max: ${data.main.temp_max} </p>
                <p>feels_like: ${data.main.feels_like} </p>
                <p>pressure: ${data.main.pressure} </p>
                <p>humidity: ${data.main.humidity} </p>
                <p>sea_level: ${data.main.sea_level} </p>
                <p>grnd_level: ${data.main.grnd_level} </p>

                <p>visibility: ${data.visibility} </p>
                <p>wind speed : ${data.wind.speed} </p>
                <p>wind deg : ${data.wind.deg} </p>
                <p>wind gust : ${data.wind.gust} </p>
                <p>sunrise : ${data.sys.sunrise} </p>
                <p>sunset : ${data.sys.sunset} </p>


                <p>Description: ${data.weather[0].description}</p>

                <p>Longitude : ${data.coord.lon} - Longitude : ${data.coord.lat}</p>
            `;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données météo:', error);
            resultDiv.innerHTML = 'Une erreur est survenue lors de la récupération des données météo.';
        });
}

cityInput.addEventListener('input', () => {
    showSuggestions();
});

citySelect.addEventListener('change', () => {
    const selectedOption = citySelect.options[citySelect.selectedIndex];
    const selectedCity = selectedOption.textContent;
    const selectedIso2 = selectedOption.getAttribute('data-iso2');
    getWeather(selectedCity, selectedIso2);
    cityInput.value = selectedCity;
    citySelect.innerHTML = '';
});