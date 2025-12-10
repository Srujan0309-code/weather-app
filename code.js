const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Free API key
        const cityInput = document.getElementById('cityInput');
        const searchBtn = document.getElementById('searchBtn');
        const weatherInfo = document.getElementById('weatherInfo');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');

        const weatherIcons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Smoke': '🌫️',
            'Haze': '🌫️',
            'Dust': '🌫️',
            'Fog': '🌫️',
            'Sand': '🌫️',
            'Ash': '🌫️',
            'Squall': '💨',
            'Tornado': '🌪️'
        };

        function formatDate() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return now.toLocaleDateString('en-US', options);
        }

        async function getWeather(city) {
            if (!city || city.trim() === '') {
                error.textContent = 'Please enter a city name.';
                error.style.display = 'block';
                return;
            }

            try {
                loading.style.display = 'block';
                weatherInfo.style.display = 'none';
                error.style.display = 'none';

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('City not found');
                    } else if (response.status === 401) {
                        throw new Error('API key error');
                    } else {
                        throw new Error('Failed to fetch weather data');
                    }
                }

                const data = await response.json();
                displayWeather(data);
            } catch (err) {
                if (err.message === 'City not found') {
                    error.textContent = 'City not found. Please check the spelling and try again.';
                } else if (err.message === 'API key error') {
                    error.textContent = 'API configuration error. Please try again later.';
                } else {
                    error.textContent = 'Failed to fetch weather data. Please check your connection.';
                }
                error.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        }

        function displayWeather(data) {
            document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('date').textContent = formatDate();
            document.getElementById('weatherIcon').textContent = weatherIcons[data.weather[0].main] || '🌤️';
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

            weatherInfo.style.display = 'block';
        }

        searchBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
            }
        });

        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = cityInput.value.trim();
                if (city) {
                    getWeather(city);
                }
            }
        });

        // Load default city on page load
        getWeather('London');
    