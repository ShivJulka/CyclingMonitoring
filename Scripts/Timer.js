//APART of the calculations javascript subcategory specified in the t

var expSecs;
var outHours;
var outMins;
var outSecs;
var tag;
var sw = {
  // (A) INITIALIZE
  etime : null, // HTML time display
  erst : null, // HTML reset button
  ego : null, // HTML start/stop button
  init : function () {
    // (A1) GET HTML ELEMENTS
    sw.etime = document.getElementById("display");
    sw.erst = document.getElementById("buttonStop");
    sw.ego = document.getElementById("buttonPlay");

    // (A2) ENABLE BUTTON CONTROLS
    sw.erst.addEventListener("click", sw.reset);
    sw.erst.disabled = false;
    sw.ego.addEventListener("click", sw.start);
    sw.ego.disabled = false;
  },

  // (B) TIMER ACTION
  timer : null, // timer object
  now : 0, // current elapsed time
  tick : function () {
    // (B1) CALCULATE HOURS, MINS, SECONDS
    sw.now++;
    var remain = sw.now;
    var hours = Math.floor(remain / 3600);
    remain -= hours * 3600;
    var mins = Math.floor(remain / 60);
    remain -= mins * 60;
    var secs = remain;
    expSecs = sw.now;
    // (B2) UPDATE THE DISPLAY TIMER
    if (hours<10) { hours = "0" + hours; }
    if (mins<10) { mins = "0" + mins; }
    if (secs<10) { secs = "0" + secs; }
    sw.etime.innerHTML = hours + ":" + mins + ":" + secs;
    
    outHours=hours;
    outMins=mins;
    outSecs=secs;
    
  },
  
  // (C) START!
  start : function () {
     // First, get the user's location using the browser's geolocation API
     navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Use the OpenWeatherMap API to get the current weather information
      const apiKey = '<6cba30f93dc4d09157267b019fb55e91>';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const data = await response.json();

      // Extract the required information from the response
      const temperature = data.main.temp;
      const feelsLike = data.main.feels_like;
      const description = data.weather[0].description;

      // Do something with the weather information, like assign it to a variable
      const currentWeather = {
        temperature: temperature,
        feelsLike: feelsLike,
        description: description
      };
      
      console.log(currentWeather);
    }, (error) => {
      console.error(error);
    });
    sw.timer = setInterval(sw.tick, 1000);
    document.getElementById("playButton").src = "Assets/Images/pauseImg.svg"
    sw.ego.removeEventListener("click", sw.start);
    sw.ego.addEventListener("click", sw.stop);
    geolocation.setTracking(true);
    activeDist == true;
    

  },
  formatGPX : function () {

    tag = '<trkseg>';

    //loops over each long,lat and parses them into a string
    for(let i = 0; i < GPXdata.length; i++) {
      tag += `<trkpt lat="${GPXdata[i][0]}" lon="${GPXdata[i][1]}"><ele>${GPXdata[i][2]}</ele> <time>"${GPXdata[i][3]}"</time></trkpt>`; //Opening each position in the 2D array for formatting
        //concats the string to form GPX
    }
    tag += '</trkseg></trk></gpx>'

  },

  // (D) STOP
  stop  : function () {

    if(GPXdata.length > 0)
    {
      this.formatGPX();
      console.log(tag);

    }

    /*module.exports = toString;
    //convert array to JSON string using JSON.stringify()
    const jsonArray = JSON.stringify(GPXdata);
    console.log(jsonArray);
    localStorage.setItem("GPXarray", jsonArray); */

    clearInterval(sw.timer);
    sw.timer = null;
    document.getElementById("playButton").src = "Assets/Images/playImg.svg"
    sw.ego.removeEventListener("click", sw.stop);
    sw.ego.addEventListener("click", sw.start);
    geolocation.setTracking(false);
    activeDist = false;
    this.save();
   
    
  },

  // (E) RESET
  reset : function () {
    if (sw.timer != null) { sw.stop(); }
    sw.now = -1;
    sw.tick();
    //document.getElementById("track").checked = false;
  },
  save : function () {

    let time = document.getElementById("display").innerHTML;
    let speed = document.getElementById("speed").innerHTML;
    let dist = document.getElementById("distance").innerHTML;
    let cal = document.getElementById("calories").innerHTML;


    var timeSplit = time.split(":");
    //[0]=hours:[1]=minutes:[2]=seconds
    var hour= (parseInt(timeSplit[0]));
    var minute= parseInt(timeSplit[1]/60);
    var second= (parseInt(timeSplit[2]))/60/60;
    var avgSpeed;
    
    var finalTime=hour+minute+second;
    if (dist == 0) {
      avgSpeed = 0;
      speed=0;
    }
    else {
      avgSpeed = dist / finalTime;
    }
    let username=window.localStorage.getItem("username");
  
    // get the JSON string from localStorage
    //const strGPX = localStorage.getItem('GPXarray');

    // convert JSON string to relevant object
    //const parsedGPX = JSON.parse(strGPX);

    //SEND TO API;
    console.log("output");
    console.log(time);
    console.log(speed);
    console.log(cal);
    console.log(avgSpeed);
    console.log(tag);

    console.log(outSecs);

   



    

    var requestOptions = {
      method: 'POST',
      redirect: 'follow'
    };
    
    fetch("http://192.168.1.192:8082/Cycling/addData?username="+username+"&distance="+dist+"&time="+outSecs+"&speed="+avgSpeed+"&calories="+cal+"&gpxdata="+tag, requestOptions)   
      .then(response => {      
        if (response.status === 200) {
              // handle successful response
              console.log('saved');
             alert('Saved.')
             
          } else if (response.status === 400) {
              // handle error response
              console.log('error saving');
              alert('Error Saving.');
              //throw new Error("User already exists");
          } else {
              // handle other error response
              console.log('Something Went Wrong.');
              throw new Error("Something Went Wrong");
          }
      })
    //console.log(tag);

    window.localStorage.removeItem("GPXdata");



  }
};
window.addEventListener("load", sw.init);