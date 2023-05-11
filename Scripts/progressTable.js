
let regression;

(async () => {
  regression = await import('https://cdn.skypack.dev/regression');
})();

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


    const xValue = document.getElementById('x-select');
    const yValue = document.getElementById('y-select');

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
              else if (selectedMetric === 'time') {
                if (!isNaN(min) && !isNaN(max)) {
                  filteredData = filteredData.filter(obj => {
                    const time = parseFloat(obj.time);
                    return time >= min && time <= max;
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
                              tempmonth = "0";
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
              const dateObj = new Date(obj.timestamp);
              let months = dateObj.toLocaleString('default', { month: 'short' });
              
              //months = convertMonthToNumber(months);
              const calories = parseFloat(obj.calories);
              return { distance, time, speed , months, calories};
            });
  
            // display scatter chart
            displayScatterChart(chartData, xValue.value, yValue.value);
            //function displayScatterChart(chartData)
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


  function convertMonthToNumber(month) {
    switch (month) {
        case "January":
            return 1;
        case "February":
            return 2;
        case "March":
            return 3;
        case "April":
            return 4;
        case "May":
            return 5;
        case "June":
            return 6;
        case "July":
            return 7;
        case "August":
            return 8;
        case "September":
            return 9;
        case "October":
            return 10;
        case "November":
            return 11;
        case "December":
            return 12;
        default:
            return 0;
    }
}


async function calculateLinearRegression(data) {
  const regressionLib = await regression;
  const result = regressionLib.linear(data);
  const gradient = result.equation[0];
  const yIntercept = result.equation[1];

  return data.map(([x, _]) => [x, gradient * x + yIntercept]);
}


function displayScatterChart(chartData, xMetric, yMetric) {
  // create data table for scatter chart
  google.charts.load('current', { 'packages': ['corechart'] });

  google.charts.setOnLoadCallback(async () => {
    await drawChart();
  });
  
  async function drawChart() {
    const dataTable = new google.visualization.DataTable();

    // Add xMetric column
    dataTable.addColumn('number', xMetric.charAt(0).toUpperCase() + xMetric.slice(1));

    // Add yMetric column
    dataTable.addColumn('number', yMetric.charAt(0).toUpperCase() + yMetric.slice(1));

    // Add regression line column
    dataTable.addColumn('number', 'Regression Line');

    // Extract x and y values from chartData and calculate the regression line
    const data = chartData.map(obj => [obj[xMetric], obj[yMetric]]);
    const regressionLine = await calculateLinearRegression(data);

    // Add rows to the DataTable, including the regression line data
    for (let i = 0; i < data.length; i++) {
      dataTable.addRow([...data[i], regressionLine[i][1]]);
    }

    // create options object for scatter chart
    const options = {
      title: `${yMetric.charAt(0).toUpperCase() + yMetric.slice(1)} vs. ${xMetric.charAt(0).toUpperCase() + xMetric.slice(1)}`,
      hAxis: {
        title: `${xMetric.charAt(0).toUpperCase() + xMetric.slice(1)}`
      },
      vAxis: {
        title: `${yMetric.charAt(0).toUpperCase() + yMetric.slice(1)}`
      },
      legend: 'none',
      series: {
        1: { lineWidth: 2, pointSize: 0, color: 'red', visibleInLegend: false },
      },
    };

    // create and display scatter chart
    const chart = new google.visualization.ScatterChart(document.getElementById('scatter-chart'));
    chart.draw(dataTable, options);
  }
}