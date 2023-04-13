


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

                console.log(json);

                // JSON array formatted into html table data
                response.json().then(async(json) => {
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
                        dataRow += '<td>' + row[key] + '</td>';
                      }
                      dataRow += '</tr>';
                      tableRows += dataRow;
                    });
                  
                    // generate table
                    let table = '<table>' + tableHeaders + tableRows + '</table>';
                  
                    // display table on page
                    document.getElementById('table-container').innerHTML = table;
                  });
                  

               
                });
                }
                else {
                console.log("error");
                    
                }
            })
       
      }

      