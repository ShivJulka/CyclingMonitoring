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
    }
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
    document.getElementById("track").checked = false;
  },
  save : function () {

    let time = document.getElementById("display").innerHTML;
    let speed = document.getElementById("speed").innerHTML;
    let dist = document.getElementById("distance").innerHTML;
    let cal = document.getElementById("calories").innerHTML;

    
    let avgSpeed = dist / time;
  
    //SEND TO API;
    console.log(time);
    console.log(speed);
    console.log(cal);
    console.log(avgSpeed);
    console.log(tag);



  }
};
window.addEventListener("load", sw.init);