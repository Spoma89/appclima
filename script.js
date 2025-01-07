// Selección de elementos del DOM
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const forecastButton = document.getElementById('forecastButton');
const forecastSection = document.getElementById('forecastSection');

// Tu API Key de OpenWeather
const API_KEY = '8d2612c14b7ee309ebdafc1b0e184c11';

// Escuchar el envío del formulario para obtener el clima actual
weatherForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

// Escuchar el clic en el botón para obtener el pronóstico extendido
forecastButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getForecast(city);
  } else {
    forecastSection.innerHTML = `<p class="error">Por favor ingresa una ciudad para ver el pronóstico.</p>`;
  }
});

// Obtener el clima actual
async function getWeather(city) {
  const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalizar la ciudad
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${normalizedCity}&appid=${API_KEY}&units=metric&lang=es`;

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

// Mostrar la información del clima actual
function displayWeather(data) {
  const { name, main, weather } = data;
  const weatherCondition = weather[0].main;

  // Cambiar el fondo según la condición del clima
  changeBackground(weatherCondition);

  weatherResult.innerHTML = `
    <h2>${name}</h2>
    <p>Temperatura: ${main.temp}°C</p>
    <p>Condición: ${weather[0].description}</p>
  `;
}

// Cambiar el fondo dinámicamente según la condición del clima
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

  body.style.backgroundImage = `url(${backgroundImage})`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
}

// Obtener el pronóstico de 5 días
async function getForecast(city) {
  const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalizar la ciudad
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${normalizedCity}&appid=${API_KEY}&units=metric&lang=es`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Hubo un problema al obtener el pronóstico.');
    }

    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    forecastSection.innerHTML = `<p class="error">${error.message}</p>`;
  }
}

// Mostrar el pronóstico de los próximos 5 días
function displayForecast(data) {
  // Limpiar el contenedor antes de mostrar el pronóstico
  forecastSection.innerHTML = '<h3>Pronóstico de los próximos 5 días:</h3>';

  // Filtrar las entradas para obtener solo el pronóstico del mediodía
  const filteredData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  // Crear tarjetas para cada día del pronóstico
  filteredData.forEach(forecast => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    const temp = Math.round(forecast.main.temp);
    const description = forecast.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <p>${date}</p>
      <img src="${icon}" alt="${description}">
      <p>${description}</p>
      <p><strong>${temp}°C</strong></p>
    `;

    forecastSection.appendChild(card);
  });
}

// Obtener el clima actual basado en la ubicación del usuario
async function getLocationWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Hubo un problema al obtener los datos de la ubicación.');
        }

        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
      }
    }, () => {
      weatherResult.innerHTML = `<p class="error">No se pudo obtener tu ubicación.</p>`;
    });
  } else {
    weatherResult.innerHTML = `<p class="error">La geolocalización no está disponible en tu navegador.</p>`;
  }
}

// Llamada inicial para mostrar el clima de la ubicación del usuario

