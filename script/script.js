let currentData;
let weeklyData;
let position;
let favorites = [];
const weekday = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const weekdayLonger = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

let cityName = document.getElementById("locationName");
let currentTemp = document.getElementById("tempDisplay");
let mainHighLow = document.getElementById("mainHighLow");
let mainWeatherType = document.getElementById("mainWeatherType");
let mainWeatherIcon = document.getElementById("mainWeatherIcon");
let favoriteButton = document.getElementById ("favoriteButton");
let favoritesList = document.getElementById("favoritesList");
let dayExpandCard = document.getElementById("dayExpandCard");
let expanded = false;
let timeDisplay = document.getElementById("timeDisplay");
let dayOfWeekExpand = document.getElementById("dayOfWeekExpand");
let dates = [];
let dateButtons = [];

dates.push(document.getElementById("dayOne"));
dates.push(document.getElementById("dayTwo"));
dates.push(document.getElementById("dayThree"));
dates.push(document.getElementById("dayFour"));
dates.push(document.getElementById("dayFive"));

dateButtons.push(document.getElementById("dayOneButton"));
dateButtons.push(document.getElementById("dayTwoButton"));
dateButtons.push(document.getElementById("dayThreeButton"));
dateButtons.push(document.getElementById("dayFourButton"));
dateButtons.push(document.getElementById("dayFiveButton"));

assignDates();

function expandDay(date, num){
    if(expanded){
        dayExpandCard.className = "hide";
        expanded = false;
    }
    else{
        dayExpandCard.className = "center";
        dayOfWeekExpand.innerText = weekdayLonger[date];
        dayExpandCard.scrollIntoView();
        expanded = true;
    }
}

function assignDates(){
    let now = new Date();
    for(let i = 0; i < 5; i++){
        now.setDate(now.getDate()+1);
        let n = now.getDay();
        dates[i].innerText = `${weekday[now.getDay()]} ${now.getMonth()} / ${now.getDate()}`;
        
        dateButtons[i].addEventListener('click', function(e){
            expandDay(n, i);
        });
    }
}


navigator.geolocation.getCurrentPosition(success, error);
time();

async function callAPI(){
    let promise;
    let secondPromise;
    if(position.coords != undefined)
    {
        promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&units=imperial&lon=${position.coords.longitude}&appid=7fbd1b6369fa6e2aeaa7bddc2568003f`);
        secondPromise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=7fbd1b6369fa6e2aeaa7bddc2568003f`);
    }
    else
    {
        promise = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=37.4946&lon=-120.8460&units=imperial&appid=7fbd1b6369fa6e2aeaa7bddc2568003f');
        secondPromise = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=37.9577&lon=121.2908&units=imperial&appid=7fbd1b6369fa6e2aeaa7bddc2568003f');
    }

    currentData = await promise.json();
    weeklyData = await secondPromise.json();
    changeDisplay();
}

function changeDisplay(){
    cityName.innerText = currentData.name;
    currentTemp.innerText = Math.trunc(currentData.main.temp) + " °F";
    mainHighLow.innerText = `H:${Math.trunc(currentData.main.temp_max)}°F L:${Math.trunc(currentData.main.temp_min)}°F`;
    mainWeatherType.innerText = currentData.weather[0].main;
    mainWeatherIcon.src = getIconImage(currentData.weather[0].icon);

    console.log(currentData);
    console.log(weeklyData);
}

function time(){
    timeDisplay.innerText =     new Date().toLocaleTimeString('en-US', { 
        hour: "numeric", 
        minute: "numeric"});
}

function getIconImage(icon){
    switch(icon){
        case "01d": return "./assets/sun.png"; // clear
        case "03d": return ""; // clouds
        case "04n": return ""; // broken clouds
        // rain
    }
}

favoriteButton.addEventListener('click', function(e){
    addToFavorite(currentData.name);
});

function addToFavorite(location){
    if(!favorites.includes(location))
        favorites.push(location);
    console.log(favorites);
}

function success(pos){
    position = pos;
    console.log(position);
    callAPI();
}
   
   function error(pos){
       position = pos;
       console.log(position.message);
       callAPI();
}

