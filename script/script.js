let currentData;
let weeklyData;
let position;

let cityName = document.getElementById("locationName");
let currentTemp = document.getElementById("tempDisplay");
let mainHighLow = document.getElementById("mainHighLow");
let mainWeatherType = document.getElementById("mainWeatherType");

navigator.geolocation.getCurrentPosition(success, error);

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

    console.log(currentData);
    console.log(weeklyData);
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

