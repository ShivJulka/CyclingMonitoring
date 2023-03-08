<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="mystyle.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/css/ol.css"
    type="text/css">
  <meta charset="UTF-8">
  <title>Activity Tracker</title>
  <!-- Pointer events polyfill for old browsers, see https://caniuse.com/#feat=pointer -->
  <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/build/ol.js"></script>
  	


</head>
<body>
    <div class="fixedBar">
            <a href="index.html" style="float: left; margin-left: 20px; font-size: 30px; font-weight: bold;">Cycling</a>
            <a href="settings.html">Settings</a>
            <a href="home.php">Record</a>
            <a href="login.php">Account</a>
            <a href="progress.php">Progress</a>
            <a href="index.html">Home</a>
    </div>

 <div class="mapWrapper">
 	<div id="map" class="map"></div>
 </div>
  <script src="Scripts/geo.js"></script>
  <script src="Scripts/calories.js"></script>
  <script src="Scripts/Timer.js"></script>
  <script src="Scripts/resetHome.js"></script>

<div class="grid-container">
  <div class="item1"><span class="statText">Time</span> <span class="time" id="display">00:00:00</span></div>
  <div class="item2"><span class="statText">Speed (KPH)</span> <span id="speed">0</span></div> 
  <div class="item3"><span class="statText">Distance (KM)</span> <span name="distance" id="distance">0</span></div>  
  <div class="item4"><span class="statText">Calories</span> <span name="calories" id="calories" class="calories">0</span></div>
</div>



     <div class="controls">
      <div class="playPauseButtons">
        <button id="buttonPlay">
          <img id="playButton" src="Assets/Images/playImg.svg" onclick="activeDist=true;"/>
        </button>
      </div>
      <div class="stopButtonDiv"> 
         <button id="buttonStop">
          <img id="stopButton" src="Assets/Images/stopImg.svg" />
        </button>
      </div>
      <div class="ResetButtonDiv">
       	<button id="buttonReset" onclick="reset()">
          <img id="resetButton" src="Assets/Images/resetImg.svg" /> <!--Reset button-->
        </button>
       </div>
       
	</div>

</body>
</html>