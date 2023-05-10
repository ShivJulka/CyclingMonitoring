function buildHtmlTable(selector) {
    const myList = '';
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    let counter = 1;
    const metricSelect = document.getElementById('metric-select');
    const min = document.getElementById('min-range').value;
    const max = document.getElementById('max-range').value;
    const monthSelect = document.getElementById('month-select');

    let month = 0;

    const selectedMetric = metricSelect.value;
    const allCheckbox = document.getElementById('all-checkbox');
  
    fetch("http://192.168.1.192:8082/Cycling/getData?username=" + window.localStorage.getItem("username"), requestOptions)
      .then(response => {
        if (response.ok) {
          response.json().then(json => {
            console.log("table");
            console.log(json);
  
            // filter data based on selected metric, range, and month
            let filteredData = json;
            if (!allCheckbox.checked && (selectedMetric !== '' || min !== '' || max !== '' || monthSelect.value !== '')) {
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
  
              if (selectedMetric === 'months') {
                if (!isNaN(min) && !isNaN(max)) {
                    filteredData = filteredData.filter(obj => {
                        const dateObj = new Date(obj.timestamp);
                        let tempmonth = dateObj.toLocaleString('default', { month: 'short' });
                        switch (tempmonth) {
                            case "January":
                              tempmonth = 1;
                              break;
                            case "February":
                              tempmonth = 2;
                              break;
                            case "March":
                              tempmonth = 3;
                              break;
                            case "April":
                              tempmonth = 4;
                              break;
                            case "May":
                              tempmonth = 5;
                              break;
                            case "June":
                              tempmonth = 6;
                              break;
                            case "July":
                              tempmonth = 7;
                              break;
                            case "August":
                              tempmonth = 8;
                              break;
                            case "September":
                              tempmonth = 9;
                              break;
                            case "October":
                              tempmonth = 10;
                              break;
                            case "November":
                              tempmonth = 11;
                              break;
                            case "December":
                              tempmonth = 12;
                              break;
                            default:
                              tempmonth = "Unknown";
                          }
                        
                        return tempmonth >= min && tempmonth <= max;
                     
                    });
                
              }
            }
        }
  
            // create table rows
            let table = '<tr><th>ID</th><th>Date</th><th>Month</th><th>Distance km</th><th>Speed km/h</th><th>Time seconds</th><th>Calories</th><th>GPX Data</th></tr>';
            filteredData.forEach(data => {
              const dateObj = new Date(data.timestamp);
              const month = dateObj.toLocaleString('default', { month: 'short' });
              table += `<tr><td>${counter}</td><td>${data.timestamp}</td><td>${month}</td><td>${data.distance}</td><td>${data.speed}</td><td>${data.time}</td><td>${data.calories}</td><td><button onclick="viewGPX('')">View GPX</button></td></tr>`;
              counter++;
            });
  
            // add rows to table
            const tableElement = document.querySelector(selector);
            tableElement.innerHTML = table;
  
            // create data array for scatter chart
            const chartData = filteredData.map(obj => {
              const distance = parseFloat(obj.distance);
              const time = parseFloat(obj.time);
              const speed = parseFloat(obj.speed);
              return { distance, time, speed };
            });
  
            // display scatter chart
            displayScatterChart(chartData);
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
          title: 'Time (seconds)'
        },
        vAxis: {
          title: yMetric === 'speed' ? 'Speed (kph)' : 'Distance (km)'
        },
        legend: 'none'
      };
  
      // create and display scatter chart
      const chart = new google.visualization.ScatterChart(document.getElementById('scatter-chart'));
      chart.draw(dataTable, options);
    }
  }











