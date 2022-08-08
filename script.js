/** Pictures Contained in each folder */
const clear = 13;
const cloudy = 10;
const CloudyNight = 9;
const nightPartly = 5;
const partly = 10;
const rainy = 1;
const snow = 5;
const foggy = 2;
const nightClear = 1;

let currentData = {};
const newE = (type) => document.createElement(type);

/*************************************************************************************
 * getWeather(location) - @param {location} - Calls API using target location  
 **************************************************************************************/
const getWeather = async (location = 'V9A') => {
    try{
    const key = '7d98db344ac643c69ab184637222007';
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}&aqi=no`;
    const responseURL = await fetch(url);
    response = responseURL.json();
    return response;
    }
    catch(ex){
        console.log(ex)
        return setTimeout(getWeather(),2000)
    }
}
/*************************************************************************************
 * createNavBar() - returns basic navbar structure
 **************************************************************************************/
const createNavBar = () => {
    const navBar = newE('div');
    navBar.id = 'navBar';
    const searchLocale = newE('div');
    $(searchLocale).addClass('flex row');
    
    const units = newE('button');
    units.id = 'units';
    $(units).on("click", changeUnit);
    $(units).html("°F");

    const weatherInput = newE(`input`);
    weatherInput.type = 'text';
    weatherInput.id = 'weatherInput';
    weatherInput.placeholder = 'Change Location';

    $(weatherInput).on('keypress', async function(event){
        if(event.which == '13'){
            currentData = await getWeather(document.getElementById('weatherInput').value);
            includeData(setWeather());
        }
    });
    $(navBar).addClass('flex row');
    $(searchLocale).append(weatherInput);
    $(navBar).append(units, searchLocale);
    return navBar;
}
const changeUnit = () => {
    let unit = document.getElementById('units').innerHTML;
    if(unit == "°C" ? unit = "°F" : unit = "°C");
    $('#units').html(unit);
    includeData(currentData, unit == "°C" ? false : true);
}
/***************************************************************************************
 * createBody() - returns the websites skeleton, does not contain any data 
 ***************************************************************************************/
const createBody = () => {
    //main container
    const main = newE('div');
    main.id = 'main';
    $(main).addClass('full flex column');
    
    //City/feels container
    const cityFeel = newE('div');
    cityFeel.id = 'cityFeel';
    $(cityFeel).addClass('flex column border grayOpac');
    const city = newE('h1');
    city.id = 'city';
    const feels = newE('p');
    feels.id = 'feels';
    $(cityFeel).append(city, feels);

    //parent container for three vals
    const threeVal = newE('div');
    $(threeVal).addClass('flex row');
    
    //vals Time / Weather/ Temp
    const currentTime = newE('div');
    currentTime.id = 'currentTime';
    $(currentTime).addClass('flex box border grayOpac')

    const weatherIcon = newE('div');
    weatherIcon.id = 'weatherIcon';
    $(weatherIcon).addClass('flex box border grayOpac');

    const currentTemp = newE('div');
    currentTemp.id = 'currentTemp';
    $(currentTemp).addClass('flex column box border grayOpac ');
    //Build
    $(threeVal).append(currentTime, weatherIcon, currentTemp);
    $(main).append(cityFeel, threeVal);
    return main;
}

/***************************************************************************************
 * includeData(source) - @param source - image source for background
 *  stitches together the API data to its proper containers to populate the website
 ***************************************************************************************/
const includeData = (source, celsius = true) => {
    $('#main').css({"background-image": `url(${source})`})
    $('#city').html(`${currentData.location.name}, ${currentData.location.country}`);
    if(celsius ? $('#feels').html(`Feels like ${currentData.current.feelslike_c}°C`) : $('#feels').html(`Feels like ${currentData.current.feelslike_f}°F`));

    $('#currentTime').html(`${new Date(currentData.location.localtime).toLocaleTimeString()}`)
    const weather = newE('img');
    weather.id = 'weather';
    weather.alt = currentData.current.condition.text;
    weather.src = 'https:' + currentData.current.condition.icon
    $('#weatherIcon').html(weather);
    const temp = newE('p');
    if(celsius ? $(temp).html(`${currentData.current.temp_c}°C`) : $(temp).html(`${currentData.current.temp_f}°F`));
    const uv = newE('p');
    uv.id = 'uv';
    $(uv).html('UV: ' + currentData.current.uv);
    $(currentTemp).html("");
    $(currentTemp).append(temp, uv);
}

/************************************************************************************ 
 * 
 *  setWeather(): Takes in current Weather data and checks the conditions to match a background image
 * 
*************************************************************************************/
const setWeather = () => {
    //TODO: "Partly cloudy"
    const rand = (num) => Math.ceil(Math.random() * num) + ".jpg"; 
    const weather = currentData.current.condition.text;
    const temp = currentData.current.feelslike_c;
    let image = "images/"
    
    switch (true){     
        case (weather == ("Overcast" || "Cloudy") && (currentData.current.condition.icon).includes("night") ):
            return image + "CloudyNight/" + rand(CloudyNight)

        case (weather == "Partly cloudy" && (currentData.current.condition.icon).includes("night") ):
            return image + "NightPartly/" + rand(nightPartly)

        case (weather.includes("rain") || weather.includes("hail")):
            return image + "Rainy/" + rand(rainy);

        case (weather.includes("fog") || weather.includes("Fog")):
            return image + "Foggy/" + rand(foggy);
    
        case (weather.includes("snow")):
            return image + "Snow/" + rand(snow);

        case (weather == "Sunny"):
            return image + "Clear/" + rand(clear);
        
        case (weather == "clear"):
            return image + "NightClear/" + rand(nightClear);

        case (weather == ("Cloudy" || "Overcast")):
            return image + "Cloudy/" + rand(cloudy);

        case (weather == "Partly cloudy"):
            return image + "Partly/" + rand(partly);
        default:
            return image + "NightPartly/" + rand(nightPartly);
    }
}

$(document).ready(async function(){
    try{
    $('#access').append(createNavBar(), createBody());
    currentData = await getWeather('V9A');
    includeData(setWeather());
    }
    catch(ex){
        console.log(ex);
    }
});