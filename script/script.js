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
let searchEntry = document.getElementById("searchEntry");
let searchBtn = document.getElementById("searchBtn");
let expanded = false;
let timeDisplay = document.getElementById("timeDisplay");
let dayOfWeekExpand = document.getElementById("dayOfWeekExpand");
let modalToggle = new bootstrap.Modal(document.getElementById('modalToggle'), {});
let dates = [];
let dateButtons = [];
let mainHours = [];
let mainHoursTemp = [];
let dayHours = [];
let dayTemps = [];
let dayHourlyTemps = [];

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

mainHours.push(document.getElementById("hourOne"));
mainHours.push(document.getElementById("hourTwo"));
mainHours.push(document.getElementById("hourThree"));

mainHoursTemp.push(document.getElementById("hourOneTemp"));
mainHoursTemp.push(document.getElementById("hourTwoTemp"));
mainHoursTemp.push(document.getElementById("hourThreeTemp"));

navigator.geolocation.getCurrentPosition(success, error);
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
    for(let i = 0; i < dates.length; i++){
        now.setDate(now.getDate()+1);
        let n = now.getDay();
        dates[i].innerText = `${weekday[now.getDay()]} ${now.getMonth()} / ${now.getDate()}`;
        
        dateButtons[i].addEventListener('click', function(e){
            expandDay(n, i);
        });
    }
}

function assignDailyTemps(){

}

function assignHours(){
    for(let i = 0; i < mainHours.length; i++){
        mainHours[i].innerText = convertNumToHour(weeklyData.list[i].dt_txt.split(' ')[1].split(':')[0]);
        mainHoursTemp[i].innerText = Math.trunc(weeklyData.list[i].main.temp)+" °F";
    }
}

function convertNumToHour(num){
    let add = num - 12 >= 0 ? "pm" : "am"; 
    num = num % 12 == 0 ? 12 : num % 12;
    return num + add;
}

async function callAPI(){
    console.log("Calling...");

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

    resetData(await promise.json(), await secondPromise.json());
}

async function searchAPI(city, state){
    
    console.log("Searching...");

    let promise;
    let secondPromise;

    if(city != undefined && state != undefined){
        try{
            promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&units=imperial&appid=7fbd1b6369fa6e2aeaa7bddc2568003f`)
            secondPromise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${state}&units=imperial&appid=7fbd1b6369fa6e2aeaa7bddc2568003f`);
            if(!promise.ok){
                throw new Error("oopsie daisy");
            }
        }catch(error){
            notFoundCity();
            return;
        }
    }
    else if(city != undefined){
        try{
            promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=7fbd1b6369fa6e2aeaa7bddc2568003f`);
            secondPromise = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=7fbd1b6369fa6e2aeaa7bddc2568003f`);
            if(!promise.ok){
                throw new Error("oopsie daisy");
            }
        }catch(error){
            notFoundCity();
            return;
        }
    }
    else{
        return;
    }

    resetData(await promise.json(), await secondPromise.json());
}

function resetData(current, weekly){
    currentData = current;
    weeklyData = weekly;
    console.log(currentData);
    console.log(weeklyData);
    assignHours();
    changeDisplay();
    time();
    console.log("Done.");
}

function changeDisplay(){
    cityName.innerText = currentData.name;
    currentTemp.innerText = Math.trunc(currentData.main.temp) + " °F";
    mainHighLow.innerText = `H:${Math.trunc(currentData.main.temp_max)}°F L:${Math.trunc(currentData.main.temp_min)}°F`;
    mainWeatherType.innerText = currentData.weather[0].main;
    mainWeatherIcon.src = getIconImage(currentData.weather[0].main.toLowerCase());
}

function time(){
    timeDisplay.innerText =     new Date().toLocaleTimeString('en-US', { 
        hour: "numeric", 
        minute: "numeric"});
}

function getIconImage(icon){
    switch(icon){
        case "clear": return "./assets/sun.png"; // clear
        case "clouds": return "./assets/clouds.png"; // clouds
        case "haze": return ""; 
        case "mist": return "";
        case "rain": return "";
        default: return "";
        // rain
    }
}

favoriteButton.addEventListener('click', function(e){
    addToFavorite(currentData.name);
});

searchBtn.addEventListener('click', function(e){
    console.log(searchEntry.value);
    searchAPI(searchEntry.value)
    searchEntry.value = "";
})

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

function notFoundCity(){
    console.log("City not found!");
    modalToggle.show();
}

