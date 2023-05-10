function buildHtmlTable(selector) {
    const myList = '';
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    let counter=1;
    const metricSelect = document.getElementById('metric-select');
    const min = document.getElementById('min-range').value;
    const max = document.getElementById('max-range').value;
  
    const selectedMetric = metricSelect.value;
    const allCheckbox = document.getElementById('all-checkbox');
  
    fetch("http://192.168.1.192:8082/Cycling/getData?username=" + window.localStorage.getItem("username"), requestOptions)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log("table");
            console.log(json);
  
            // filter data based on selected metric and range
            let filteredData = json;
            if (!allCheckbox.checked && (selectedMetric !== '' || min !== '' || max !== '')) {
              if (selectedMetric === 'distance') {
                if (!isNaN(min) && !isNaN(max)) {
                  filteredData = filteredData.filter(obj => {
                    const distance = parseFloat(obj.distance);
                    return distance >= min && distance <= max;
                  });
                }
              } else if (selectedMetric === 'speed') {
                if (!isNaN(min) && !isNaN(max)) {
                  filteredData = filteredData.filter(obj => {
                    const speed = parseFloat(obj.speed);
                    return speed >= min && speed <= max;
                  });
                }
              }
            }
  
            // create table rows
            let table = '<tr><th>ID</th><th>Distance</th><th>Time</th><th>Speed</th><th></th></tr>';
            filteredData.forEach(data => {
              table += `<tr><td>${counter}</td><td>${data.distance}</td><td>${data.time}</td><td>${data.speed}</td><td><button onclick="viewGPX('')">View GPX</button></td></tr>`;
                counter++;
            });
  
            // add rows to table
            const tableElement = document.querySelector(selector);
            tableElement.innerHTML = table;
  
  
            // create data array for scatter chart
            const data = filteredData.map(obj => {
              const distance = parseFloat(obj.distance);
              const time = parseFloat(obj.time);
              const speed = parseFloat(obj.speed);
              return { distance, time, speed };
            });
  
            // display scatter chart
            displayScatterChart(data);
  
          });
        }
      })
      .catch(error => console.log('error', error));
  }
  





function viewGPX(gpxData) {
    console.log("Viewing GPX data: " + gpxData);
    
    // create the map
    var map = L.map('mapid').setView([0, 0], 13);
  
    // add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 19
    }).addTo(map);
    
    // add the GPX layer
    var gpxLayer = new L.GPX(gpxData, {
      async: true,
      marker_options: {
        startIconUrl: 'https://www.trackprofiler.com/assets/images/mapicons/track_start.png',
        endIconUrl: 'https://www.trackprofiler.com/assets/images/mapicons/track_finish.png',
        shadowUrl: null,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        clickable: true
      },
      polyline_options: {
        color: 'red',
        opacity: 0.7,
        weight: 5,
        lineCap: 'round'
      }
    });
    gpxLayer.on('loaded', function(e) {
      map.fitBounds(e.target.getBounds());
    }).addTo(map);
    
    // open the map in a popup
    const popup = L.popup().setLatLng([0, 0]).setContent("<div id='mapid' style='height: 400px;'></div>").openOn(map);
  }
  
  function displayScatterChart(data, yMetric = 'distance') {
    // create data table for scatter chart
    google.charts.load('current', {'packages':['corechart']});
  
    google.charts.setOnLoadCallback(drawChart);
  
    function drawChart() {
      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn('number', 'Time');
      dataTable.addColumn('number', yMetric === 'speed' ? 'Speed' : 'Distance');
  
      data.forEach(obj => {
        const x = obj.time;
        const y = yMetric === 'speed' ? obj.speed : obj.distance;
        dataTable.addRow([x, y]);
      });
  
      // create options object for scatter chart
      const options = {
        title: yMetric === 'speed' ? 'Speed vs. Time' : 'Distance vs. Time',
        hAxis: {
          title: 'Time (minutes)'
        },
        vAxis: {
          title: yMetric === 'speed' ? 'Speed (mph)' : 'Distance (miles)'
        },
        legend: 'none'
      };
  
      // create and display scatter chart
      const chart = new google.visualization.ScatterChart(document.getElementById('scatter-chart'));
      chart.draw(dataTable, options);
    }
  }
  