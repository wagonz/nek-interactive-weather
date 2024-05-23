async function fetchWeatherData(zipCode) {
    try {
        const response = await fetch(`/weather-by-zip?zip=${zipCode}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function displayCurrentWeather(currentWeather) {
    const iconUrl = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-title').textContent = 'Current Weather';
    document.getElementById('weather-details').innerHTML = `
        <strong>Temperature:</strong> ${currentWeather.temp}°F<br>
        <strong>Feels Like:</strong> ${currentWeather.feels_like}°F<br>
        <strong>Condition:</strong> ${currentWeather.weather[0].description}
        <strong>Wind:</strong> ${currentWeather.wind_speed} mph<br>
        <strong>Barometric Pressure:</strong> ${currentWeather.humidity}%<br>
    `;
}

function displayDailyForecast(dailyForecast) {
    let forecastHtml = '<div class="forecast-grid">'; // Start the grid

    dailyForecast.forEach(day => {
        const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const dayOfWeek = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' });

        forecastHtml += `
            <div class="forecast-item">
                <img src="${iconUrl}" alt="Weather icon">
                <h3>${dayOfWeek}</h3>
                <p><strong>Day:</strong> ${day.temp.day}°F</p>
                <p><strong>Night:</strong> ${day.temp.night}°F</p>
                <p><strong>Condition:</strong> ${day.weather[0].description}</p>
                <p><strong>Wind:</strong> ${day.wind_speed} mph</p>
                <p><strong>Percipitation:</strong> ${day.pop}%</p>
            </div>
        `;
    });

    forecastHtml += '</div>'; // Close the grid
    document.getElementById('daily-forecast').innerHTML = forecastHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    const zipButton = document.getElementById('zipButton');
    if (zipButton) {
        zipButton.addEventListener('click', () => {
            const zipCode = document.getElementById('zipcode').value;
            if (zipCode) {
                fetchWeatherData(zipCode)
                    .then(weatherData => {
                        if (weatherData) {
                            displayCurrentWeather(weatherData.current);
                            displayDailyForecast(weatherData.daily);
                        }
                    });
            }
        });
    }

    const rssButton = document.getElementById('rssButton');
    if (rssButton) {
        rssButton.addEventListener('click', () => {
            getNYTimesRSS();
            return undefined;
        });
    }
});

async function getNYTimesRSS() {
    try {
        const response = await fetch('/nytimes-rss');
        const data = await response.json();
        let articles = data.items.map(item => `<li><a href="${item.link}">${item.title}</a></li>`).join('');
        document.getElementById('nytimes-feed').innerHTML = `<ul>${articles}</ul>`;
    } catch (error) {
        console.error("Error fetching NY Times RSS feed", error);
    }
}

