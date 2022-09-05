$(document).ready(function(){
    UpdateDayForecast();
    UpdateWeekForecast();

    $("select[name='site']").on('change', function(){
        UpdateDayForecast();
        UpdateWeekForecast();
      });

    //Timer
    document.getElementsByClassName("fixedF5Icon")[0].innerText = "更新時間:" + moment().format('YYYY/MM/DD HH:mm:ss');
    timeout();
    function timeout(){
      setTimeout(function(){ 
        UpdateDayForecast();
        UpdateWeekForecast();
        document.getElementsByClassName("fixedF5Icon")[0].innerText = "更新時間:" + moment().format('YYYY/MM/DD HH:mm:ss');
        timeout();
      }, 1800000);
    }
});

function UpdateDayForecast(){
    $.getJSON('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-079?Authorization=CWB-B7FC0A1D-F623-4001-896F-63FED75F36D0', function(data) {
        //console.log(data);
        var trabslatelocation;
        if (document.getElementsByTagName("select")[0].value == "1"){
            document.getElementsByTagName("h1")[0].innerHTML = "臺南市天氣預報-北門區";
            trabslatelocation = 27;
        }
        if (document.getElementsByTagName("select")[0].value == "2"){
            document.getElementsByTagName("h1")[0].innerHTML = "臺南市天氣預報-七股區";
            trabslatelocation = 30;
        }
        
        var maxindex = 3;
        var weektemperature = data.records.locations[0].location[trabslatelocation].weatherElement[6].time.map(function(obj, index){
            return obj.elementValue[0].value;
        })
        data.records.locations[0].location[trabslatelocation].weatherElement[6].time.map(function(obj, index){
            if (index < maxindex){
                var day = obj.startTime.split(' ')[0];
                var time = obj.startTime.split(' ')[1] + " ~ " + obj.endTime.split(' ')[1];
                document.getElementsByName("translatelist")[0].getElementsByTagName("li")[index].getElementsByTagName("span")[0].innerHTML = day;
                document.getElementsByName("translatelist")[0].getElementsByTagName("li")[index].getElementsByTagName("span")[1].innerHTML = time;
                document.getElementsByName("translatelist")[0].getElementsByTagName("li")[index].getElementsByTagName("span")[2].innerHTML = '<img src="resources/' + weektemperature[index] + '-1.svg" loading="lazy" width = "70px"></br>';
                var temperature = data.records.locations[0].location[trabslatelocation].weatherElement[8].time[index].elementValue[0].value + " - " + data.records.locations[0].location[trabslatelocation].weatherElement[12].time[index].elementValue[0].value + " ˚C";
                document.getElementsByName("translatelist")[0].getElementsByTagName("li")[index].getElementsByTagName("span")[3].innerHTML = temperature;
            }
        })
        data.records.locations[0].location[trabslatelocation].weatherElement[2].time.map(function(obj, index){
            if (index < maxindex){
                var rainfallrate = obj.elementValue[0].value + "%";
                document.getElementsByName("translatelist")[0].getElementsByTagName("li")[index].getElementsByTagName("span")[4].innerHTML = "<i class='fas fa-umbrella'></i>" + rainfallrate;
            }
        })
        data.records.locations[0].location[trabslatelocation].weatherElement[3].time.map(function(obj, index){
            if (index < maxindex){
                var somatosensory = obj.elementValue[1].value;
                document.getElementsByName("translatelist")[0].getElementsByTagName("li")[index].getElementsByTagName("span")[5].innerHTML = somatosensory;
            }
        })
        

    });
}
function UpdateWeekForecast(){
    //console.log(document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerHTML);
    $.getJSON('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-079?Authorization=CWB-B7FC0A1D-F623-4001-896F-63FED75F36D0', function(data) {
        //console.log(document.getElementsByTagName("select")[0].value);
        var trabslatelocation;
        if (document.getElementsByTagName("select")[0].value == "1"){
            trabslatelocation = 27;
        }
        if (document.getElementsByTagName("select")[0].value == "2"){
            trabslatelocation = 30;
        }
        
        //console.log(data);
        var count = 1;
        var boo = new Boolean(true);
        var weekday = data.records.locations[0].location[trabslatelocation].weatherElement[0].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.startTime.split(' ')[0].split('-')[1] + "/" + obj.startTime.split(' ')[0].split('-')[2]; 
            }
        })
        boo = true;
        count = 1;
        weekday.map(function(obj, index){
            if(obj != "null" && count <= 6){
                if(boo){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("thead")[0].getElementsByTagName("th")[count++].innerHTML = obj;                
                }
                boo = !boo;
            }
        })
        var weektemperaturelow = data.records.locations[0].location[trabslatelocation].weatherElement[8].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.elementValue[0].value; 
            }
        })
        var weektemperaturehigh = data.records.locations[0].location[trabslatelocation].weatherElement[12].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.elementValue[0].value; 
            }
        })
        var weektemperature = data.records.locations[0].location[trabslatelocation].weatherElement[6].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.elementValue[0].value; 
            }
        })
        boo = true;
        count = 0;
        weektemperaturelow.map(function(obj, index){
            if(obj != "null" && count < 6){
                if(boo){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[count].innerHTML ='<img src="resources/' + weektemperature[index] + '.svg" loading="lazy" width = "70px"></br>' + weektemperaturelow[index] + "-" + weektemperaturehigh[index] + " ˚C";
                }else{
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[1].getElementsByTagName("td")[count++].innerHTML = '<img src="resources/' + weektemperature[index] + '-1.svg" loading="lazy" width = "70px"></br>' + weektemperaturelow[index] + "-" + weektemperaturehigh[index] + " ˚C";
                }
                boo = !boo;
            }
        })
        var weekbodytemperaturelow = data.records.locations[0].location[trabslatelocation].weatherElement[11].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.elementValue[0].value; 
            }
        })
        var weekbodytemperaturehigh = data.records.locations[0].location[trabslatelocation].weatherElement[5].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.elementValue[0].value; 
            }
        })
        var weekbodyWindrose = data.records.locations[0].location[trabslatelocation].weatherElement[13].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.elementValue[0].value; 
            }
        })
        var weekbodyWindspeed = data.records.locations[0].location[trabslatelocation].weatherElement[4].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) == new Date().getDate()){
                return "null";
            }else{
                return obj.elementValue[0].value; 
            }
        })
        count = 0;
        bool = true;
        var low, high;
        weekbodytemperaturelow.map(function(obj, index){
            if(obj != "null" && count < 6){
                if(boo){
                    low = parseInt(weekbodytemperaturelow[index]);
                    high = parseInt(weekbodytemperaturehigh[index]);
                }else{
                    if(low > parseInt(weekbodytemperaturelow[index])) low = parseInt(weekbodytemperaturelow[index]);
                    if(high < parseInt(weekbodytemperaturehigh[index])) high = parseInt(weekbodytemperaturehigh[index]);
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[2].getElementsByTagName("td")[count++].innerHTML = low.toString() + "-" + high.toString() + " ˚C";
                }
                boo = !boo;
            }

        })
        count = 0;
        bool = true;
        weekbodyWindrose.map(function(obj, index){
            if(obj != "null" && count < 6){
                if(boo){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[3].getElementsByTagName("td")[count++].innerHTML = obj;
                }
                boo = !boo;
            }

        })
        count = 0;
        bool = true;
        weekbodyWindspeed.map(function(obj, index){
            if(obj != "null" && count < 6){
                if(boo){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[4].getElementsByTagName("td")[count++].innerHTML = obj + " 公里/時";
                }
                boo = !boo;
            }

        })
        count = 0;
        data.records.locations[0].location[trabslatelocation].weatherElement[9].time.map(function(obj, index){
            var today = obj.startTime.split(' ')[0].split('-')[2];
            if(parseInt(today) != new Date().getDate() && count < 6){
                if(parseInt(obj.elementValue[0].value) >= 0 && parseInt(obj.elementValue[0].value) <= 2){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[count++].innerHTML = "<i class='fas fa-sun' style='color: #a7cd20;' ></i>";
                }
                else if(parseInt(obj.elementValue[0].value) >= 3 && parseInt(obj.elementValue[0].value) <= 5){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[count++].innerHTML = "<i class='fas fa-sun' style='color: orange;' ></i>";
                }
                else if(parseInt(obj.elementValue[0].value) >= 6 && parseInt(obj.elementValue[0].value) <= 7){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[count++].innerHTML = "<i class='fas fa-sun' style='color: #f39800;' ></i>";
                }
                else if(parseInt(obj.elementValue[0].value) >= 8 && parseInt(obj.elementValue[0].value) <= 10){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[count++].innerHTML = "<i class='fas fa-sun' style='color: #ea1904;' ></i>";
                }
                else if(parseInt(obj.elementValue[0].value) >= 11){
                    document.getElementsByName("translatetable")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[5].getElementsByTagName("td")[count++].innerHTML = "<i class='fas fa-sun' style='color: #b34fa2;' ></i>";
                }
            }

        })

    });
}