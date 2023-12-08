let initialize = false;
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
let favoritesList = document.getElementById ("favoritesList");
let favoritesContainer = document.getElementById("favoritesContainer"); 
let favoriteElements = [];
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
let mainIcons = [];
let dayTemps = [];
let dayIcons = [];
let dayHourlyTemps = [];
let dayHourlyTimes = [];
let dayHourlyIcons = [];

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

mainIcons.push(document.getElementById("mainIconOne"));
mainIcons.push(document.getElementById("mainIconTwo"));
mainIcons.push(document.getElementById("mainIconThree"));

dayTemps.push(document.getElementById("dayOneTemps"));
dayTemps.push(document.getElementById("dayTwoTemps"));
dayTemps.push(document.getElementById("dayThreeTemps"));
dayTemps.push(document.getElementById("dayFourTemps"));
dayTemps.push(document.getElementById("dayFiveTemps"));

dayIcons.push(document.getElementById("dayOneIcon"));
dayIcons.push(document.getElementById("dayTwoIcon"));
dayIcons.push(document.getElementById("dayThreeIcon"));
dayIcons.push(document.getElementById("dayFourIcon"));
dayIcons.push(document.getElementById("dayFiveIcon"));

dayHourlyTemps.push(document.getElementById("dailyHourlyTemp1"));
dayHourlyTemps.push(document.getElementById("dailyHourlyTemp2"));
dayHourlyTemps.push(document.getElementById("dailyHourlyTemp3"));

dayHourlyTimes.push(document.getElementById("hourlyTime1"));
dayHourlyTimes.push(document.getElementById("hourlyTime2"));
dayHourlyTimes.push(document.getElementById("hourlyTime3"));

dayHourlyIcons.push(document.getElementById("hourlyImage1"));
dayHourlyIcons.push(document.getElementById("hourlyImage2"));
dayHourlyIcons.push(document.getElementById("hourlyImage3"));

navigator.geolocation.getCurrentPosition(success, error);

function expandDay(dayNum, weatherDay){ // Expand Day Card
    let index = weeklyData.list.indexOf(getWeatherFromDay(weatherDay));
    if(expanded){
        dayExpandCard.className = "hide";
        expanded = false;
    }
    else{
        dayExpandCard.className = "center";
        dayOfWeekExpand.innerText = weekdayLonger[dayNum];
        dayExpandCard.scrollIntoView();
        expanded = true;
        for(let i = 0; i < dayHourlyTemps.length; i++){
            dayHourlyTemps[i].innerText = `${Math.trunc(weeklyData.list[index+i+1].main.temp)} °F`;
            dayHourlyTimes[i].innerText = convertNumToHour(weeklyData.list[index+i+1].dt_txt.split(' ')[1].split(':')[0]);
            dayHourlyIcons[i].src = getIconImage(weeklyData.list[index+i+1].weather[0].main.toLowerCase());
        }
    }
}

function getWeatherFromDay(day){  // Searches for the day that matches in the weekly weather list
    for(let i = 0; i < weeklyData.list.length; i++){
        if(weeklyData.list[i].dt_txt.split(' ')[0].split('-')[2] == day){
            return weeklyData.list[i];
        }
    }
}

function assignDates(){
    let now = new Date();
    for(let i = 0; i < dates.length; i++){
        now.setDate(now.getDate()+1);
        let n = now.getDay(); // Day of Week
        let d = now.toDateString(); // Date String of Current Time
        let weatherOfDay = getWeatherFromDay(d.split(' ')[2]); console.log(weatherOfDay); // Splits date string and passes the day 

        dates[i].innerText = `${weekday[now.getDay()]} ${now.getMonth()+1} / ${now.getDate()}`;
        dayTemps[i].innerText = `${Math.trunc(weatherOfDay.main.temp_max)}°F | ${Math.trunc(weatherOfDay.main.temp_min)}°F`;
        dayIcons[i].src = getIconImage(weatherOfDay.weather[0].main.toLowerCase());

        if(!initialize)
            dateButtons[i].addEventListener('click', function(e){
                expandDay(n, d.split(' ')[2]);
            });
    }
}

function assignHours(){ // Changes Main Display
    for(let i = 0; i < mainHours.length; i++){
        mainHours[i].innerText = convertNumToHour(weeklyData.list[i].dt_txt.split(' ')[1].split(':')[0]);
        mainHoursTemp[i].innerText = Math.trunc(weeklyData.list[i].main.temp)+" °F";
        mainIcons[i].src = getIconImage(weeklyData.list[i].weather[0].main.toLowerCase());
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
    initialize = true;
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

function resetData(current, weekly){ // Changes Data and then changes visuals to match
    currentData = current;
    weeklyData = weekly;
    assignHours();
    changeDisplay();
    assignDates();
    time();
    console.log(currentData);
    console.log(weeklyData);
    console.log("Done.");
}

function changeDisplay(){ // Changes all Main Display Texts
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
        case "clear": return "./assets/sun.png";
        case "clouds": return "./assets/clouds.png";
        case "haze": return ""; 
        case "mist": return "";
        case "rain": return "";
        default: return "";
    }
}

favoriteButton.addEventListener('click', function(e){
    if(!favorites.includes(currentData.name))
    favorites.push(currentData.name);
});

searchBtn.addEventListener('click', function(e){
    console.log(searchEntry.value);
    searchAPI(searchEntry.value)
    searchEntry.value = "";
})

favoritesList.addEventListener('click', function(e){
    favoriteElements.forEach(element => {
        element.remove();
    });
    favoriteElements = [];
    favorites.forEach(element => {
        console.log(element);
        let e = document.createElement("p");
        e.innerText = element;
        favoritesContainer.appendChild(e);
        favoriteElements.push(e);
    });
});

function success(pos){
    position = pos;
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

