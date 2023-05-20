const apiKey = "753f239ca28f430c26c0ed9a292317c8"
const apiURL = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&q="
const searchBox = document.querySelector('.search input')
const searchBtn = document.querySelector('.search button')
let weatherIcon = document.querySelector('.weather-icon')

function checkWeather(city) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(apiURL + city + `&appid=${apiKey}`);
        const data = await response.json();
        resolve(data);
        
        document.querySelector('.error').style.display = 'none'
        
        document.querySelector('.city').innerHTML = data.city.name;
        document.querySelector('.temp').innerHTML = Math.round(data.list[0].main.temp) + '°F';
        document.querySelector('.humidity').innerHTML = data.list[0].main.humidity + '%';
        document.querySelector('.wind').innerHTML = Math.round(data.list[0].wind.speed) + ' mph';

        if(data.list[0].weather[0].main == 'Clouds'){
            weatherIcon.src = './develop/images/clouds.png'
        } else if(data.list[0].weather[0].main == 'Clear'){
            weatherIcon.src = './develop/images/sun.png'
        } else if(data.list[0].weather[0].main == 'Rain'){
            weatherIcon.src = './develop/images/rain.png'
        } else if(data.list[0].weather[0].main == 'Thunderstorm'){
            weatherIcon.src = './develop/images/storm.png'
        } else if(data.list[0].weather[0].main == 'Drizzle'){
            weatherIcon.src = './develop/images/rain.png'
        } else if(data.list[0].weather[0].main == 'Snow'){
            weatherIcon.src = './develop/images/snow.png'
        }
        document.querySelector(".weather").style.display = 'block';

      } catch (error) {
        document.querySelector('.error').style.display = 'block'
        document.querySelector('.weather').style.display = 'none'
        reject(error);
      }
    });
};

searchBtn.addEventListener('click', ()=>{
    checkWeather(searchBox.value);
    searchBox.value = ''
});

