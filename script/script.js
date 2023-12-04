let position;

navigator.geolocation.getCurrentPosition(success, error);

async function callAPI(){
    let promise;
    if(position.coords != undefined)
    {
        promise = await(fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=7fbd1b6369fa6e2aeaa7bddc2568003f`));
    }
    else
    {
        promise = await(fetch('https://api.openweathermap.org/data/2.5/weather?lat=37.4946&lon=-120.8460&appid=7fbd1b6369fa6e2aeaa7bddc2568003f'));
    }

    const data = promise.json();
    console.log(data);
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