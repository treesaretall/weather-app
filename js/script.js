const apiKey = "753f239ca28f430c26c0ed9a292317c8"
const apiURL = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q="
const searchBox = document.querySelector('.search input')
const searchBtn = document.querySelector('.search button')

//Sets Current date and assigns days to the 5 day forcast
function setTime() {
    const currentDate = document.querySelector('.currentDate');
    const date = dayjs();
    const formattedDate = date.format('dddd, MMMM D, YYYY');
    currentDate.textContent = formattedDate;
  
    const days = [];
    for (let i = 0; i < 5; i++) {
      const dayPlusN = dayjs().add(24 * i, 'hour');
      const dayN = dayPlusN.format('ddd');
      days.push(dayN);
    }
  
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach((element, index) => {
      element.innerHTML = days[index];
    });
}
  
//Calculates averages to be used in 5 day forecast
function calculateAverage(dataList) {
    const sum = dataList.reduce((total, value) => total + value, 0);
    const average = sum / dataList.length;
    return average;
}

//Main function of checking weather and assigning values
function checkWeather(city) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(apiURL + city + `&appid=${apiKey}`);
            const data = await response.json();
            resolve(data);
            document.querySelector('.error').style.display = 'none';
            const weatherIcon = document.querySelector('.weather-icon');

            //Gets data from the API and sets it to appropriate HTML class
            document.querySelector('.city').innerHTML = data.city.name;
            document.querySelector('.temp').innerHTML = Math.round(data.list[0].main.temp) + '°F';
            document.querySelector('.humidity').innerHTML = data.list[0].main.humidity + '%';
            document.querySelector('.wind').innerHTML = Math.round(data.list[0].wind.speed) + ' mph';

            //Sets Weather Icon for current weather
            if(data.list[0].weather[0].main == 'Clouds'){
                weatherIcon.src = './images/clouds.png'
            } else if(data.list[0].weather[0].main == 'Clear'){
                weatherIcon.src = './images/sun.png'
            } else if(data.list[0].weather[0].main == 'Rain'){
                weatherIcon.src = './images/rain.png'
            } else if(data.list[0].weather[0].main == 'Thunderstorm'){
                weatherIcon.src = './images/storm.png'
            } else if(data.list[0].weather[0].main == 'Drizzle'){
                weatherIcon.src = './images/rain.png'
            } else if(data.list[0].weather[0].main == 'Snow'){
                weatherIcon.src = './images/snow.png'
            }
            
            //Gathers data for the different forecast ranges
            const forecastData = [
                { temp: data.list.slice(0, 8).map(item => item.main.temp), humidity: data.list.slice(0, 8).map(item => item.main.humidity), wind: data.list.slice(0, 8).map(item => item.wind.speed) },
                { temp: data.list.slice(8, 16).map(item => item.main.temp), humidity: data.list.slice(8, 16).map(item => item.main.humidity), wind: data.list.slice(8, 16).map(item => item.wind.speed) },
                { temp: data.list.slice(16, 24).map(item => item.main.temp), humidity: data.list.slice(16, 24).map(item => item.main.humidity), wind: data.list.slice(16, 24).map(item => item.wind.speed) },
                { temp: data.list.slice(24, 32).map(item => item.main.temp), humidity: data.list.slice(24, 32).map(item => item.main.humidity), wind: data.list.slice(24, 32).map(item => item.wind.speed) },
                { temp: data.list.slice(32, 40).map(item => item.main.temp), humidity: data.list.slice(32, 40).map(item => item.main.humidity), wind: data.list.slice(32, 40).map(item => item.wind.speed) }
            ];
            
            //Sets forecast ranges to appropriate class
            for (let i = 1; i <= 5; i++) {
                const dayTemp = forecastData[i - 1].temp;
                const dayHum = forecastData[i - 1].humidity;
                const dayWind = forecastData[i - 1].wind;
                
                document.querySelector(`.forecast-temp${i}`).innerHTML = Math.round(calculateAverage(dayTemp)) + '°F';
                document.querySelector(`.forecast-humidity${i}`).innerHTML = Math.round(calculateAverage(dayHum)) + '%';
                document.querySelector(`.forecast-wind${i}`).innerHTML = Math.round(calculateAverage(dayWind)) + 'mph';
            
                const forecastIcon = document.querySelector(`.forecast-weather-icon${i}`);
                const weatherMain = data.list.slice((i - 1) * 8, i * 8).map(item => item.weather[0].main);
            
                if (weatherMain.includes('Thunderstorm')) {
                forecastIcon.src = './images/storm.png';
                } else if (weatherMain.includes('Rain') || weatherMain.includes('Drizzle')) {
                forecastIcon.src = './images/rain.png';
                } else if (weatherMain.includes('Snow')) {
                forecastIcon.src = './images/snow.png';
                } else if (weatherMain.includes('Clouds')) {
                forecastIcon.src = './images/clouds.png';
                } else {
                forecastIcon.src = './images/sun.png';
                }
            }
            
                //Unhides weather
                document.querySelector(".weather").style.display = 'block';
                document.querySelector(".forecast").style.display = 'block';
        }

        //Catches errors and displays error message
        catch (error) {
            document.querySelector('.error').style.display = 'block'
            document.querySelector('.weather').style.display = 'none'
            document.querySelector('.forecast').style.display = 'none'
            reject(error);
        }
    });
};


const searchHistoryDropdown = document.querySelector('.searchHistoryDropdown');
let searchHistory = [];

// Load search history from local storage
if (localStorage.getItem('searchHistory')) {
  searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  updateSearchHistoryDropdown();
}

// Function to update the search history dropdown and make items clickable
function updateSearchHistoryDropdown() {
    searchHistoryDropdown.innerHTML = '';
    searchHistory.forEach(item => {
        const option = document.createElement('div');
        option.classList.add('searchHistoryOption');
        option.textContent = item;
        option.addEventListener('click', () => {
        searchBox.value = item;
        handleSearch();
        });
        searchHistoryDropdown.appendChild(option);
  });
}

// Function to handle search
function handleSearch() {
  const searchTerm = searchBox.value.trim();
  if (searchTerm !== '') {
    checkWeather(searchBox.value);
    setTime();
    searchBox.value = ''
    // Update search history
    if (!searchHistory.includes(searchTerm)) {
      searchHistory.unshift(searchTerm);
      if (searchHistory.length > 5) {
        searchHistory.pop();
      }
      updateSearchHistoryDropdown();
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }
}

//Adds search button functionality
searchBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    handleSearch();
});

//Adds 'enter' key functionality through search button
searchBox.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      searchBtn.click();
    }
  });
