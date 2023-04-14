


    function buildHtmlTable(selector) {
        const myList = '' ;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://192.168.1.192:8082/Cycling/getData?username="+window.localStorage.getItem("username"), requestOptions)   
            .then(response => {      
            if (response.ok) {

                response.json().then(async(json) =>{
                console.log("table");
                console.log(json);

                // generate table headers
                let tableHeaders = '<tr>';
                for (let key in json[0]) {
                    tableHeaders += '<th>' + key + '</th>';
                }
                tableHeaders += '</tr>';

                // generate table rows
                let tableRows = '';
                json.forEach((row) => {
                    let dataRow = '<tr>';
                    for (let key in row) {
                        if (key === 'gpxdata') {
                            // if this is the gpxdata column, add a button element
                            dataRow += '<td><button onclick="viewGPX(\'' + row[key] + '\')">View GPX</button></td>';
                          } else {
                            // otherwise, add the regular cell with data
                            dataRow += '<td>' + row[key] + '</td>';
                        }
                    }
                    dataRow += '</tr>';
                    tableRows += dataRow;
                });

                // generate table
                let table = '<table>' + tableHeaders + tableRows + '</table>';

                // display table on page
                // display table on page
                let tableContainer = document.getElementById('table-container');
                if (!tableContainer) {
                  tableContainer = document.createElement('div');
                  tableContainer.id = 'table-container';
                  document.body.appendChild(tableContainer);
                }
                tableContainer.innerHTML = table;
                
            });
        } else {
            console.log("error");
        }
            })
       
      }

function viewGPX(gpxdata) {
  // create a new Google Map object centered on the first point of the GPX data
  console.log(gpxdata);  

}
      
