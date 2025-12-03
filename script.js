const apiKey = "f4d2b3a5253c593b766b00accd1539f0";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  const response = await fetch(weatherUrl + city + "&appid=" + apiKey);
  if (response.status === 404) {
    document.querySelector(".error").style.display = "block";

    // Reset weather data to default values
    document.querySelector(".City").innerHTML = "";
    document.querySelector(".temp").innerHTML = "";
    document.querySelector(".humidity").innerHTML = "00%";
    document.querySelector(".wind").innerHTML = "0 km/h";
    document.querySelector(".day-night-info").innerText = "";
    weatherIcon.src = "images/rain.png"; // default icon or blank

    return;
  }

  const data = await response.json();
  console.log(data);

  const currentTime = data.dt;
  const sunriseTime = data.sys.sunrise;
  const sunsetTime = data.sys.sunset;
  const isDay = currentTime >= sunriseTime && currentTime < sunsetTime;

  document.body.classList.remove("day", "night");
  document.body.classList.add(isDay ? "day" : "night");

  document.querySelector(".City").innerHTML = data.name;
  document.querySelector(".temp").innerHTML =
    Math.round(data.main.temp - 273.15) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
  document.querySelector(".day-night-info").innerText = isDay
    ? "☀️ Day time"
    : "🌙 Night time";

  const weatherMain = data.weather[0].main;
  if (weatherMain === "Clouds") {
    weatherIcon.src = "images/clouds.png";
  } else if (weatherMain === "Clear") {
    weatherIcon.src = "images/clear.png";
  } else if (weatherMain === "Rain") {
    weatherIcon.src = "images/rain.png";
  } else if (weatherMain === "Drizzle") {
    weatherIcon.src = "images/drizzle.png";
  } else if (weatherMain === "Mist") {
    weatherIcon.src = "images/mist.png";
  } else if (weatherMain === "Snow") {
    weatherIcon.src = "images/snow.png";
  }

  document.querySelector(".error").style.display = "none";
}

async function getForecast(city) {
  const response = await fetch(forecastUrl + city + "&appid=" + apiKey);
  const data = await response.json();
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach((item) => {
    const date = new Date(item.dt * 1000);
    const temp = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const desc = item.weather[0].main;

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
          <p>${date.toDateString().slice(0, 10)}</p>
          <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}" />
          <p>${temp}°C</p>
          <p>${desc}</p>
        `;
    forecastContainer.appendChild(card);
  });
}

searchBtn.addEventListener("click", () => {
  const city = searchBox.value;
  if (!city) return;
  checkWeather(city);
  getForecast(city);
});
