let initialize = false;
let nightMode = false;
let currentData;
let weeklyData;
let position;
let favorites = [];
const weekday = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const weekdayLonger = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

let dnswitch = document.getElementById("dnswitch");
let styleLink = document.getElementById("styleLink");
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
let offcanvasToggle = new bootstrap.Offcanvas(document.getElementById('offCanvasToggle'));
let desc = document.getElementById("desc");
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
let selects = []

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

selects.push(document.getElementById("select1"));
selects.push(document.getElementById("select2"));
selects.push(document.getElementById("select3"));
selects.push(document.getElementById("select4"));
selects.push(document.getElementById("select5"));

navigator.geolocation.getCurrentPosition(success, error);

function expandDay(dayNum, weatherDay, num){ // Expand Day Card
    let index = weeklyData.list.indexOf(getWeatherFromDay(weatherDay)); // Gets the index of the start of the day in weather list
    if(expanded){
        dayExpandCard.className = "hide";
        expanded = false;
        selects.forEach(element => {
            element.className = "card not-selected-thing"; 
        });
    }
    else{
        dayExpandCard.className = "center";
        dayOfWeekExpand.innerText = weekdayLonger[dayNum];
        dayExpandCard.scrollIntoView();
        expanded = true;
        selects[num].className = "card selected-thing";
        for(let i = 0; i < dayHourlyTemps.length; i++){ // Adds i to the index to get the next few hours of the day.
            dayHourlyTemps[i].innerText = `${Math.trunc(weeklyData.list[index+i].main.temp)} °F`;
            dayHourlyTimes[i].innerText = convertNumToHour(weeklyData.list[index+i].dt_txt.split(' ')[1].split(':')[0]);
            dayHourlyIcons[i].src = getIconImage(weeklyData.list[index+i].weather[0].main, weeklyData.list[index+i].weather[0].description);
            desc.innerText = weeklyData.list[index+i].weather[0].description;
        }
    }
}

function getWeatherFromDay(day){  // Searches for the day that matches in the weekly weather list
    for(let i = 0; i < weeklyData.list.length; i++){
        if(weeklyData.list[i].dt_txt.split(' ')[0].split('-')[2] == day && (weeklyData.list[i].dt_txt.split(' ')[1] == "09:00:00")){
            return weeklyData.list[i];
        }
    }
}

function getMaxAndMin(day){
    let startOfDay;
    let max = 0;
    let min = 0;
    for(let i = 0; i < weeklyData.list.length; i++){
        if(weeklyData.list[i].dt_txt.split(' ')[0].split('-')[2] == day){
            startOfDay = i; // Start of day temps in list
            min = Math.trunc(weeklyData.list[startOfDay].main.temp_min);
            break;
        }
    }

    while(weeklyData.list[startOfDay].dt_txt.split(' ')[0].split('-')[2] == day){ // While still on this day
        if(Math.trunc(weeklyData.list[startOfDay].main.temp_max) > max){
            max = Math.trunc(weeklyData.list[startOfDay].main.temp_max);
        }
        if(Math.trunc(weeklyData.list[startOfDay].main.temp_min) < min){
            min = Math.trunc(weeklyData.list[startOfDay].main.temp_min);
        }
        startOfDay++;
        if(startOfDay >= weeklyData.list.length)
            break;
    }
    return `${max}°F | ${min}°F`; // Returns string ready to display!
}

function assignDates(){ // For the Weekly weather cards
    let now = new Date();
    for(let i = 0; i < dates.length; i++){
        now.setDate(now.getDate()+1);
        let n = now.getDay(); // Day of Week
        let d = now.toDateString(); // Date String of Current Time
        let weatherOfDay = getWeatherFromDay(d.split(' ')[2]); // Splits date string and passes the day 

        dates[i].innerText = `${weekday[now.getDay()]} ${now.getMonth()+1} / ${now.getDate()}`;
        dayTemps[i].innerText = getMaxAndMin(d.split(' ')[2]);
        dayIcons[i].src = getIconImage(weatherOfDay.weather[0].main, weatherOfDay.weather[0].description);

        if(!initialize) // Assigns button functions on first open
            dateButtons[i].addEventListener('click', function(e){
                expandDay(n, d.split(' ')[2], i);
            });
    }
}

function assignHours(){ // Changes Main Display
    for(let i = 0; i < mainHours.length; i++){
        mainHours[i].innerText = convertNumToHour(weeklyData.list[i].dt_txt.split(' ')[1].split(':')[0]);
        mainHoursTemp[i].innerText = Math.trunc(weeklyData.list[i].main.temp)+" °F";
        mainIcons[i].src = getIconImage(weeklyData.list[i].weather[0].main, weeklyData.list[i].weather[0].description);
    }
}

function convertNumToHour(num){ // Converts a number 0-24 to hour 
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

async function searchAPI(city, state){ // Get API but via search
    
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
        console.log("huh");
        return;
    }

    resetData(await promise.json(), await secondPromise.json());
}

function resetData(current, weekly){ // Changes Data and then changes visuals to match
    currentData = current;
    weeklyData = weekly;
    dayExpandCard.className = "hide";
    expanded = false;
    offcanvasToggle.hide();
    console.log(currentData);
    console.log(weeklyData);
    assignHours();
    changeDisplay();
    assignDates();
    changeFavButton();
    time();
    if(localStorage.getItem("favList") != undefined){
        favorites = JSON.parse(localStorage.getItem("favList"));
    }
    console.log("Done.");
}

function changeDisplay(){ // Controls the big Main Display Texts
    cityName.innerText = currentData.name;
    currentTemp.innerText = Math.trunc(currentData.main.temp) + " °F";
    mainHighLow.innerText = `H:${Math.trunc(currentData.main.temp_max)}°F L:${Math.trunc(currentData.main.temp_min)}°F`;
    mainWeatherType.innerText = currentData.weather[0].main;
    mainWeatherIcon.src = getIconImage(currentData.weather[0].main, currentData.weather[0].description);
}

function time(){ // Just the Clock
    timeDisplay.innerText =     new Date().toLocaleTimeString('en-US', { 
        hour: "numeric", 
        minute: "numeric"});
}

function getIconImage(icon, desc){ // Returns an image based on the weather message
    switch(icon.toLowerCase()){
        case "clear": return "./assets/sun-light.svg";
        case "clouds": 
        if(desc.toLowerCase() == "scattered clouds")
            return "./assets/cloud-light.svg";
        else
            return "./assets/cloud-sun-light.svg";
        case "snow": return "./assets/cloud-snow-light.svg";
        case "haze": return "./assets/cloud-fog-light.svg"; 
        case "mist": return "./assets/cloud-fog-light.svg";
        case "rain": return "./assets/cloud-rain-light.svg";
        default: return "./assets/cloud-sun-light.svg";
    }
}

favoriteButton.addEventListener('click', function(e){ // Favorite Button
    if(!favorites.includes(currentData.name)){
        favorites.push(currentData.name);
        localStorage.setItem("favList", JSON.stringify(favorites)); // Apparently you have to turn arrays into JSON to local storage them.
    }
    else
    {
        favorites.splice(favorites.indexOf(currentData.name), 1);
        localStorage.setItem("favList", JSON.stringify(favorites));
    }
    changeFavButton();
});

function changeFavButton(){
    if(favorites.includes(currentData.name))
        favoriteButton.src = "./assets/heart-fill.svg";
    else
        favoriteButton.src = "./assets/heart-light.svg";
}

searchBtn.addEventListener('click', function(e){ // Search Button
    console.log(searchEntry.value);
    searchAPI(searchEntry.value)
    searchEntry.value = "";
})

dnswitch.addEventListener('click', function(e){
    if(nightMode){
        styleLink.href = "./style/styles.css";
        nightMode = false;
    }
    else
    {
        styleLink.href = "./style/stylesnight.css";
        nightMode = true;
    }
});

favoritesList.addEventListener('click', function(e){ // Favorites Offcanvas Opener
    favoriteElements.forEach(element => {
        element.remove();
    });
    favoriteElements = [];
    favorites.forEach(element => { // Creates elements for offcanvas
        let e = document.createElement("p");
        e.innerText = element;
        e.className = "color-darker"
        e.addEventListener('click', function(e){ // Allows to directly go to city on click!
            searchAPI(element);
        })
        favoritesContainer.appendChild(e);
        favoriteElements.push(e);
    });
});

function success(pos){ // Success for Geolocator
    position = pos;
    callAPI();
}
   
   function error(pos){ // Error for Geolocator
       position = pos;
       console.log(position.message);
       callAPI();
}

function notFoundCity(){ // Bad Search respond function
    console.log("City not found!");
    modalToggle.show();
}

