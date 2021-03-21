$(document).ready(function(){
    var searchHistoryContainer = $('#past-searches');
    var searchForm = $('#search-form');
    var currentWeatherContainer = $('#current-weather');
    var fiveDayForecastContainer = $('#five-day-forecast');
    var apiKey = '';
    var searchValueInput = $('#search-value')
    var searchHistory = [];
    var uvIndexBaseUrl = 'https://api.openweathermap.org/data/2.5/onecall?'
    var baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    var baseUrl2 = 'https://api.openweathermap.org/data/2.5/forecast?';
    var iconBaseUrl = 'https://openweathermap.org/img/w/'
    searchForm.submit(function(event) {
        event.preventDefault();
        console.log(event);
        var formValues = $(this).serializeArray();
        var city = formValues[0].value;
        var searchTermDiv = $('<button type="button" class=" btn btn-primary past-search-term">');
        var button = $('<button type="button" class="city-button">');
        searchTermDiv.click(function(event){
            event.preventDefault();
            var value = $(this).text();
            searchForCurrentCityWeather(value);
            searchForFiveDayForecastWeather(value);
        })
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        searchTermDiv.text(city);
        searchHistoryContainer.append(searchTermDiv);
        console.log(formValues, city);
        searchForCurrentCityWeather(city);
        searchForFiveDayForecastWeather(city);
        searchValueInput.val('');
    });
    function searchForCurrentCityWeather(city){
        currentWeatherContainer.html('');
        var fullUrl = baseUrl + "q=" + city + "&appid=" + apiKey + "&units=imperial";
        console.log(fullUrl);
        fetch(fullUrl)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            console.log(data);
            var cityName = data.name;
            var temp = data.main.temp;
            var weather = data.weather;
            var iconUrl = iconBaseUrl + weather[0].icon + '.png'
            var wind = data.wind;
            var humidity = data.main.humidity;
            var cityNameDiv = $('<div class="city-name">');
            var tempDiv = $('<div class="temp-name">');
            var humidityDiv = $('<div class="humidity-name">');
            var weatherImg = $('<img class="icon-name"/>');
            var windDiv = $('<div class="wind-name">');
            cityNameDiv.text(cityName);
            weatherImg.attr('src', iconUrl);
            tempDiv.text("Temperature: " + temp + "°F");
            humidityDiv.text("Humidity: " + humidity + "%");
            windDiv.text("Wind Speed: " + wind.speed + "mph");
            currentWeatherContainer.append(cityNameDiv);
            currentWeatherContainer.append(weatherImg);
            currentWeatherContainer.append(tempDiv);
            currentWeatherContainer.append(humidityDiv);
            currentWeatherContainer.append(windDiv);
        });
    }
    function searchForFiveDayForecastWeather(city){
        fiveDayForecastContainer.html('');
        var forecastUrl = baseUrl2 + "q=" + city +"&appid=" + apiKey + "&units=imperial";
        fetch(forecastUrl)
        .then(function (response){
            return response.json()
        })
        .then(function(data){
            var coords = data.city.coord;
            getUVIndex(coords.lat, coords.lon);
            for (var i = 0; i < data.list.length; i++){
                var isThreeOClock = data.list[i].dt_txt.search('15:00:00');
                var cityName = data.city.name
                if (isThreeOClock > -1) {
                    var forecast = data.list[i];
                    var temp = forecast.main.temp;
                    var weather = forecast.weather;
                    var iconUrl = iconBaseUrl + weather[0].icon + '.png';
                    var wind = forecast.wind;
                    var humidity = forecast.main.humidity;
                    var day = moment(forecast.dt_txt).format('dddd, MMMM, Do YYYY')
                    var rowDiv = $('<div class="col-2">');
                    console.log(forecast, weather, temp, wind, humidity, cityName);
                    var dayDiv = $('<div class="day-name">');
                    var tempDiv = $('<div class="temp-name">');
                    var humidityDiv = $('<div class="humidity-name">');
                    var windDiv = $('<div class="wind-name">');
                    var weatherImg = $('<img class="icon-name"/>');
                    weatherImg.attr('src', iconUrl);
                    dayDiv.text(day);
                    tempDiv.text("Temperature: " + temp + "°F");
                    humidityDiv.text("Humidity: " + humidity + "%");
                    windDiv.text("Wind Speed: " + wind.speed + "mph");
                    rowDiv.append(weatherImg);
                    rowDiv.append(dayDiv);
                    rowDiv.append(tempDiv);
                    rowDiv.append(humidityDiv);
                    rowDiv.append(windDiv);
                    fiveDayForecastContainer.append(rowDiv)
                }
            }
        });
    }
    function getUVIndex (lat, lon) {
        var finalUrl = uvIndexBaseUrl + 'lat=' + lat + '&lon=' + lon + '&exclude-hourly,daily&appid=' + apiKey;
        fetch (finalUrl).then(function(response){
            return response.json();
        }).then(function(data){
            var uvIndex = data.current.uvi;
            var uvIndexDiv = $("<div class='uv-index-div'>")
            var uvIndexSpan = $("<span class='uv-index-number'>")
            uvIndexSpan.text(uvIndex);
            uvIndexDiv.text('UV Index: ');
            uvIndexDiv.append(uvIndexSpan);
            currentWeatherContainer.append(uvIndexDiv);
        })
    }
    function retrieveSearchHistory() {
        if (localStorage.getItem('searchHistory')) {
            searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
            for (var i =0; i < searchHistory.length; i++) {
                var searchTermDiv = $('<button type="button" class="btn btn-primary past-search-term">');
                searchTermDiv.click(function(event){
                    event.preventDefault();
                    var value = $(this).text;
                    searchForCurrentCityWeather(value);
                    searchForFiveDayForecastWeather(value);
                })
                searchTermDiv.text(searchHistory[i]);
                searchHistoryContainer.append(searchTermDiv);
            }
        }
    }


    retrieveSearchHistory();
});


