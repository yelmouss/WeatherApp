// Sélection des éléments du DOM
//2333fa9e49aade835728c0c3745e132a//
const cityInput = document.getElementById('cityInput'); // Input pour saisir le nom de la ville
const citySelect = document.getElementById('citySelect'); // Sélecteur pour les suggestions de villes
const resultDiv = document.getElementById('result'); // Division pour afficher les résultats de la météo
citySelect.style.display = 'none';
// Fonction pour rechercher une ville
function searchCity() {
    // Récupération de la valeur saisie dans l'input en supprimant les espaces en début et en fin
    const input = cityInput.value.trim();
    // Vérification si l'input est vide
    if (input === '') {
        alert('Veuillez entrer le nom d\'une ville');
        return;
    }

    // Appel à l'API pour obtenir la liste des pays et des villes
    fetch('https://countriesnow.space/api/v0.1/countries')
        .then(response => response.json())
        .then(data => {
            const countries = data.data;
            let cityFound = false;
            // Parcours de chaque pays et de ses villes pour trouver la ville saisie
            countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city === input) {
                        cityFound = true;
                        getWeather(city, country.iso2); // Appel à la fonction pour obtenir la météo de la ville trouvée
                    }
                });
            });
            // Si la ville n'est pas trouvée, affiche un message d'erreur
            if (!cityFound) {
                resultDiv.innerHTML = `La ville ${input} n'a pas été trouvée.`;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la recherche de la ville:', error);
            resultDiv.innerHTML = 'Une erreur est survenue lors de la recherche de la ville.';
        });
}

// Fonction pour afficher les suggestions de villes
function showSuggestions() {
    
    // Récupération de la valeur saisie dans l'input en supprimant les espaces en début et en fin, et en convertissant en minuscules
    const input = cityInput.value.trim().toLowerCase();
    const suggestions = [];
    // Appel à l'API pour obtenir la liste des pays et des villes
    fetch('https://countriesnow.space/api/v0.1/countries')
        .then(response => response.json())
        .then(data => {
            const countries = data.data;
            // Parcours de chaque pays et de ses villes pour trouver les suggestions correspondant à la saisie
            countries.forEach(country => {
                country.cities.forEach(city => {
                    if (city.toLowerCase().startsWith(input)) {
                        suggestions.push({ city, iso2: country.iso2 }); // Ajout de la suggestion à la liste
                    }
                });
            });
            renderSuggestions(suggestions); // Affichage des suggestions
        })
        .catch(error => {
            console.error('Erreur lors de la recherche des suggestions de villes:', error);
            citySelect.innerHTML = ''; // Vide le sélecteur en cas d'erreur
        });
}

// Fonction pour afficher les suggestions dans le sélecteur
function renderSuggestions(suggestions) {
   
    citySelect.innerHTML = ''; // Vide le sélecteur
    suggestions.forEach(suggestion => {
        const option = document.createElement('option'); // Création d'une nouvelle option
        option.textContent = suggestion.city; // Définition du texte de l'option
        option.setAttribute('data-iso2', suggestion.iso2); // Ajout de l'attribut data-iso2 pour stocker le code ISO du pays
        citySelect.appendChild(option); // Ajout de l'option au sélecteur
    });
}

// Fonction pour obtenir la météo d'une ville
function getWeather(city, iso2) {
    const apiKey = 'votre clé api openweathermap '; // Clé API pour accéder aux données météo
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${iso2}&appid=${apiKey}`; // URL de l'API météo
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Affichage des données météo dans la division de résultat
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
                <p>sunrise : ${ new Date(data.sys.sunrise * 1000)} </p>
                <p>sunset : ${ new Date(data.sys.sunset * 1000)} </p>
                <p>Description: ${data.weather[0].description}</p>
                <p>Longitude : ${data.coord.lon} - Longitude : ${data.coord.lat}</p>
            `;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données météo:', error);
            resultDiv.innerHTML = 'Une erreur est survenue lors de la récupération des données météo.';
        });
}

// Écouteur d'événement pour détecter les changements dans l'input de saisie
cityInput.addEventListener('input', () => {
    citySelect.style.display = 'block';
    showSuggestions(); // Affiche les suggestions lorsque l'utilisateur saisit quelque chose
});

// Écouteur d'événement pour détecter les changements dans le sélecteur de suggestions
citySelect.addEventListener('change', () => {
    const selectedOption = citySelect.options[citySelect.selectedIndex]; // Option sélectionnée dans le sélecteur
    const selectedCity = selectedOption.textContent; // Nom de la ville sélectionnée
    const selectedIso2 = selectedOption.getAttribute('data-iso2'); // Code ISO du pays correspondant à la ville sélectionnée
    getWeather(selectedCity, selectedIso2); // Obtient la météo de la ville sélectionnée
    cityInput.value = selectedCity; // Remplit l'input avec le nom de la ville sélectionnée
    citySelect.style.display = 'none'; // Vide le sélecteur de suggestions
});
