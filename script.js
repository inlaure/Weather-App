'use strict';
const API_KEY = '238a55a5092645d289e193145230307';
const weatherContainer = document.querySelector('.weather-container');
const resultContainer = document.querySelector('.result-container');
const weekContainer = document.querySelector('.week-container');
const forecastData = document.querySelector('.forecast-data');
const searchField = document.querySelector('.search-field');
const searchBtn = document.querySelector('.search-btn');
const errorMessage = document.querySelector('.error-message');

//1.Get current location

function getCurrentCity() {
  navigator.geolocation.getCurrentPosition(
    position => {
      const coords = position.coords;
      const lat = coords.latitude;
      const lon = coords.longitude;
      getCurWeather(lat, lon);
      getDailyWeather(lat, lon);
    },
    error => {
      console.error(`Couldn't detect geolocation: ${error.message}`);
    }
  );
}

getCurrentCity();

//2.Fetch weather details of the current location
async function getCurWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
    );
    if (!response.ok)
      throw new Error(
        `Geolocation has been blocked by the user: ${response.status}`
      );

    const data = await response.json();
    renderCurWeather(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

//3.Fetch weather details of the current location for 5 days
async function getDailyWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=6&aqi=no&alerts=no
      `
    );
    if (!response.ok)
      throw new Error(`Couldn't detect geolocation: ${response.status}`);

    const data = await response.json();
    renderDailyForecast(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

//4. Render current weather data on screen
function renderCurWeather(data) {
  const markup = `
  <h2 class="city">${data.location.name}</h2>
  <p class="weather">${data.current.condition.text}</p>
  <img src="https://${data.current.condition.icon}" class="weather-icon">
  <p class="temp">${data.current.temp_c}°C</p>
  <div class="wind-humidity">
    <div class="humidity">
    <svg xmlns="https://www.w3.org/2000/svg" class="humidity-icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5h-2zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a28.458 28.458 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a28.458 28.458 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001L7 1.5zm0 0-.364-.343L7 1.5zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267z"/></svg>
    <span>${data.current.humidity}%</span>
    <span>Humidity</span></div>
    <div class="wind">
    <svg xmlns="https://www.w3.org/2000/svg" class="wind-icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5zm-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2zM0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5z"/> </svg>
    <span>${data.current.wind_kph} km/h</span><span>Wind Speed</span></div>
   
  `;
  resultContainer.insertAdjacentHTML('afterbegin', markup);
}

//5. Render current location weather data for 5 days
function renderDailyForecast(data) {
  for (let i = 0; i < 5; i++) {
    const dates = new Date(data.forecast.forecastday[i].date);
    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = dates.getMonth();
    const day = dates.getDate();
    const weekday = dates.getDay();
    const markup = `<div class="forecast">
    <div class="daily-temp">
    <img src="${
      data.forecast.forecastday[i].day.condition.icon
    }" class="forecast-icon">
    <span>${data.forecast.forecastday[i].day.maxtemp_c.toFixed(0)}°C</span>
    </div>
    <div class="date"><p>${months[month]} ${day}</p></div>
    <div class="day">${weekDays[weekday]}</div>
    </div>
`;
    weatherContainer.style.display = 'grid';
    forecastData.insertAdjacentHTML('beforeend', markup);
  }
}

//6.Fetch weather data by search results
async function getCity(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`
    );
    if (!response.ok) {
      setError();
      throw new Error(`The name of city is incorrect: ${response.status}.`);
    }
    const data = await response.json();
    resultContainer.innerHTML = '';
    renderCurWeather(data);
    errorMessage.style.visibility = 'hidden';

    searchField.value = '';
    return data;
  } catch (err) {
    console.error(err);
  }
}

//7.Fetch 5-day forecast data by search results

async function getDailyForecast(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=6&aqi=no&alerts=no
      `
    );
    if (!response.ok) {
      throw new Error(`The city name is incorrect: ${response.status}`);
    }
    const data = await response.json();
    forecastData.innerHTML = '';
    renderDailyForecast(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

//8.Set error message
function setError() {
  if (searchField.value === '') {
    errorMessage.textContent = '*Field cannot be blank';
  }
  if (searchField.value !== '') {
    errorMessage.textContent = '*Incorrect city name. Please try again';
  }
  errorMessage.style.visibility = 'visible';
  searchField.value = '';
}

//9.Display search data on click
searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  let searchValue = searchField.value;
  getCity(searchValue);
  getDailyForecast(searchValue);
});

//10.Display search data on pressing 'Enter'
window.addEventListener('keyup', function (e) {
  e.preventDefault();
  if (e.key === 'Enter') {
    let searchValue = searchField.value;
    getCity(searchValue);
    getDailyForecast(searchValue);
  }
});

//11. Focus the search field
window.addEventListener('load', function (e) {
  searchField.focus();
});
