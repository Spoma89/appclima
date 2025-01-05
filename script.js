const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

const API_KEY = '8d2612c14b7ee309ebdafc1b0e184c11';

weatherForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ciudad no encontrada. Por favor verifica el nombre.');
      } else {
        throw new Error('Hubo un problema al conectarse con la API.');
      }
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

function displayWeather(data) {
    const { name, main, weather } = data;
  
   
    const weatherCondition = weather[0].main; 
    changeBackground(weatherCondition);
  
    // Mostrar la información del clima
    weatherResult.innerHTML = `
      <h2>${name}</h2>
      <p>Temperatura: ${main.temp}°C</p>
      <p>Condición: ${weather[0].description}</p>
    `;
  }
  
  function changeBackground(condition) {
    const body = document.body; 
    let backgroundImage = '';
  
   
    switch (condition) {
      case 'Clear':
        backgroundImage = 'images/sunny.jpg';
        break;
      case 'Clouds':
        backgroundImage = 'images/cloudy.jpg';
        break;
      case 'Rain':
        backgroundImage = 'images/rainy.jpg';
        break;
      case 'Snow':
        backgroundImage = 'images/snowy.jpg';
        break;
      case 'Thunderstorm':
        backgroundImage = 'images/storm.jpg';
        break;
      case 'Drizzle':
        backgroundImage = 'images/drizzle.jpg';
        break;
      case 'Mist':
      case 'Fog':
        backgroundImage = 'images/mist.jpg';
        break;
      default:
        backgroundImage = 'images/default.jpg'; 
        break;
    }
  
    // Cambiar el fondo
    body.style.backgroundImage = `url(${backgroundImage})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
  }
  