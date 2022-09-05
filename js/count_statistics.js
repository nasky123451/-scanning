var StartTime, EndTime;
var resultData, ChartresultData;
$(document).ready(function(){

    EndTime = moment().format('YYYY/MM/DD');
    StartTime = moment().format('YYYY/MM/01');
    $("#chart_date").html(StartTime + "~" + EndTime);
    $("input[name='endtime']").val(moment().format('YYYY-MM-DDTHH:mm'));
    $("input[name='starttime']").val(moment().add(-1, 'M').format('YYYY-MM-01T') + "00:00");


    $("select[name='datetime']").on('change', function(){
      ShowChart("myChart");
    });
});

Chart.defaults.global.defaultFontSize = 15;
function ShowChart(name){
    EndTime = moment().format('YYYY-MM-DDTHH:mm');
    StartTime = moment().format('YYYY-MM-01T00:00');
    
    searchPara = {name:"", starttime:StartTime, endtime:EndTime, interval:document.getElementById("datetime").value};
    $.get('/getCountStatistics', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "login";
                
            }
            ChartresultData = data;
            updateChart(name);
        }
    }); 
}
function SumData(arr){
    var sum=0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    };
    return sum;
}
function updateChart(name){

    //清除舊資料並賦予新屬性
    $("#" + name).remove();
    $('#canvas').append('<canvas id="'+ name +'" class="MaxHeight250"></canvas>');

    var alltime = [], allcar = [], alltruck = [], allperson = [], allmotorbike = [];
    ChartresultData.forEach(function(data){
        alltime.push(data['time']);
        allcar.push(Math.ceil(data["one_in_car"]) + Math.ceil(data["two_in_car"]) + Math.ceil(data["three_in_car"]) + Math.ceil(data["nine_in_car"]));
        alltruck.push(Math.ceil(data["one_in_truck"]) + Math.ceil(data["two_in_truck"]) + Math.ceil(data["three_in_truck"]) + Math.ceil(data["nine_in_truck"]));
        allperson.push(Math.ceil(data["four_in_person"]) + Math.ceil(data["five_in_person"]) + Math.ceil(data["six_in_person"]) + Math.ceil(data["seven_in_person"]) + Math.ceil(data["eight_in_person"]));
        allmotorbike.push(Math.ceil(data["one_in_motorbike"]) + Math.ceil(data["two_in_motorbike"]) + Math.ceil(data["three_in_motorbike"]) + Math.ceil(data["nine_in_motorbike"]));
    });

    var ctx = document.getElementById(name).getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: alltime,
        datasets: [{ 
            data: allcar,
            label: "小型車",
            borderColor: "rgb(255, 77, 216)",
            backgroundColor: "rgb(255, 77, 216,0.1)",
          }, { 
            data: alltruck,
            label: "巴士",
            borderColor: "rgb(242, 232, 116)",
            backgroundColor: "rgb(242, 232, 116,0.1)",
          }, { 
            data: allperson,
            label: "遊客人數",
            borderColor: "rgb(67, 250, 104)",
            backgroundColor:"rgb(67, 250, 104,0.1)",
          }, { 
            data: allmotorbike,
            label: "機車",
            borderColor: "rgb(152, 65, 240)",
            backgroundColor:"rgb(152, 65, 240,0.1)",
          }
        ]},
    });
    $("#car_count").html(SumData(allcar) + '次');
    $("#truck_count").html(SumData(alltruck) + '次');
    $("#person_count").html(SumData(allperson) + '次');
    $("#motorbike_count").html(SumData(allmotorbike) + '次');
    $("#people_totle_count").html((SumData(allperson)).toString() + '次');
    $("#car_totle_count").html((SumData(allcar) + SumData(alltruck) + SumData(allmotorbike)).toString() + '次');
}
function ShowSelectChart(){
    Element = $('#form').serializeArray();
    var searchPara = {name:document.getElementById("name").innerHTML, starttime:Element[1].value, endtime:Element[2].value, interval:Element[3].value};
    $.get('/getCountStatistics', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "login";
                
            }
            resultData = data;
            UpdateSelectChart(Element[0].value);
            
        }
    }); 
}
function UpdateSelectChart(site){
    //清除舊資料並賦予新屬性
    $("#myChart1").remove();
    $('#canvas1').append('<canvas class="col-12 col-sm" id="myChart1"></canvas>');
    //清除舊資料並賦予新屬性
    $("#myChart2").remove();
    $('#canvas2').append('<canvas class="col-12 col-sm" id="myChart2"></canvas>');
    //清除舊資料並賦予新屬性
    $("#myChart3").remove();
    $('#canvas3').append('<canvas class="col-12 col-sm" id="myChart3"></canvas>');  
    //清除舊資料並賦予新屬性
    $("#myChart4").remove();
    $('#canvas4').append('<canvas class="col-12 col-sm" id="myChart4"></canvas>'); 

    var alltime = [], allcar = [], alltruck = [], allperson = [], allmotorbike = [];
    resultData.forEach(function(data){
        alltime.push(data['time']);
        if(site == "1"){
            allperson.push(Math.ceil(data["five_in_person"]));
        }else if (site == "2"){
            allperson.push(Math.ceil(data["six_in_person"]));
        }else if (site == "3"){
            allcar.push(Math.ceil(data["one_in_car"]));
            alltruck.push(Math.ceil(data["one_in_truck"]));
            allmotorbike.push(Math.ceil(data["one_in_motorbike"]));
        }else if (site == "4"){
            allperson.push(Math.ceil(data["seven_in_person"]));
        }else if (site == "5"){
            allcar.push(Math.ceil(data["two_in_car"]) + Math.ceil(data["nine_in_car"]));
            alltruck.push(Math.ceil(data["two_in_truck"]) + Math.ceil(data["nine_in_truck"]));
            allmotorbike.push(Math.ceil(data["two_in_motorbike"]) + Math.ceil(data["nine_in_motorbike"]));
        }else if (site == "6"){
            allperson.push(Math.ceil(data["four_in_person"]));
        }else if (site == "7"){
            allcar.push(Math.ceil(data["three_in_car"]));
            alltruck.push(Math.ceil(data["three_in_truck"]));
            allmotorbike.push(Math.ceil(data["three_in_motorbike"]));
        }else{
            allcar.push(Math.ceil(data["one_in_car"]) + Math.ceil(data["two_in_car"]) + Math.ceil(data["three_in_car"]) + Math.ceil(data["nine_in_car"]));
            alltruck.push(Math.ceil(data["one_in_truck"]) + Math.ceil(data["two_in_truck"]) + Math.ceil(data["three_in_truck"]) + Math.ceil(data["nine_in_truck"]));
            allperson.push(Math.ceil(data["four_in_person"]) + Math.ceil(data["five_in_person"]) + Math.ceil(data["six_in_person"]) + Math.ceil(data["seven_in_person"]) + Math.ceil(data["eight_in_person"]));
            allmotorbike.push(Math.ceil(data["one_in_motorbike"]) + Math.ceil(data["two_in_motorbike"]) + Math.ceil(data["three_in_motorbike"]) + Math.ceil(data["nine_in_motorbike"]));
        }
    });   

    document.getElementById("select_car_count").parentNode.parentNode.parentNode.style.display = "none";
    document.getElementById("select_truck_count").parentNode.parentNode.parentNode.style.display = "none";
    document.getElementById("select_motorbike_count").parentNode.parentNode.parentNode.style.display = "none";
    document.getElementById("select_person_count").parentNode.parentNode.parentNode.style.display = "none";

    if (site == "3" || site == "5" || site == "7" || site == ""){
        document.getElementById("select_car_count").parentNode.parentNode.parentNode.style.display = "";
        var ctx = document.getElementById('myChart1').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: alltime,
            datasets: [{ 
                data: allcar,
                //label: "Total",
                borderColor: "rgb(255, 77, 216)",
                backgroundColor: "rgb(255, 77, 216,0.1)",
              }
            ]

          },
            options: {
                legend: {
                display: false,
                },
            }
        });
        
        $("#select_car_count").html(SumData(allcar) + '次'); 

    }
    if (site == "3" || site == "5" || site == "7" || site == ""){
        document.getElementById("select_truck_count").parentNode.parentNode.parentNode.style.display = "";
        var ctx = document.getElementById('myChart2').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: alltime,
            datasets: [{ 
                data: alltruck,
                //label: "Total",
                borderColor: "rgb(242, 232, 116)",
                backgroundColor: "rgb(242, 232, 116,0.1)",
              }
            ]

          },
            options: {
                legend: {
                display: false,
                },
            }
        });
        $("#select_truck_count").html(SumData(alltruck) + '次');
    }
    if (site == "3" || site == "5" || site == "7" || site == ""){
        document.getElementById("select_motorbike_count").parentNode.parentNode.parentNode.style.display = "";
        var ctx = document.getElementById('myChart3').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: alltime,
            datasets: [{ 
                data: allmotorbike,
                //label: "Total",
                borderColor: "rgb(152, 65, 240)",
                backgroundColor: "rgb(152, 65, 240,0.1)",
              }
            ]

          },
            options: {
                legend: {
                display: false,
                },
            }
        });
        $("#select_motorbike_count").html(SumData(allmotorbike) + '次');
    }
    if (site == "1" || site == "2" || site == "4" || site == "6" || site == ""){
        document.getElementById("select_person_count").parentNode.parentNode.parentNode.style.display = "";
        var ctx = document.getElementById('myChart4').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: alltime,
            datasets: [{ 
                data: allperson,
                //label: "Total",
                borderColor: "rgb(67, 250, 104)",
                backgroundColor: "rgb(67, 250, 104,0.1)",
              }
            ]

          },
            options: {
                legend: {
                display: false,
                },
            }
        });
        $("#select_person_count").html(SumData(allperson) + '次');
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatWeek(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatMonth(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;

    return [year, month].join('-');
}

function formatYear(date) {
    var d = new Date(date),
        year = d.getFullYear();

    return year;
}

function exportCSV(){
    createCsvFile();
    /*var start = moment(searchPara.starttime).format("MM-DD-HH");
    var end = moment(searchPara.endtime).format("MM-DD-HH");
    
    csvitems = resultData.map(function(obj){
        var csvObj = {};
        csvObj['site'] = siteName[obj['site']-1];
        csvObj['category'] = $("select[name='type'] option[value=" + obj['category'] + "]").html();
        csvObj['time'] = obj['time'];
        csvObj['count'] = obj['count'];
        csvObj['lane'] = $("select[name='lane'] option[value=" + obj['lane'] + "]").html();
        //csvObj['weight'] = obj['weight'];

        return csvObj
    });

    exportCSVFile(headers, csvitems, start+"_"+end);*/
}

function createCsvFile(){
    Element = $('#form').serializeArray();
    var fileName = "AI人車流管理資訊平台.csv";//匯出的檔名
    var data;
    if(Element[0].value == ""){
        data = getallCounterData();
    }else{
        data = getCounterData();
    }
    var blob = new Blob(["\uFEFF" + data], { type: 'text/csv;charset=utf-8;' });
    var href = URL.createObjectURL(blob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();
}

function getCounterData() {
    Element = $('#form').serializeArray();
    var csvdata = "";
    switch(Element[0].value){
        case "1":
        case "3":
            csvdata += "北門遊客中心\n";
            break;
        case "2":
            csvdata += "北門遊客中心洗滌鹽\n";
            break;
        case "4":
        case "5":
            csvdata += "井仔腳\n";
            break;
        case "6":
        case "7":
            csvdata += "七股遊客中心\n";
            break;  
    }
    switch(Element[0].value){
        case "1":
        case "2":
        case "4":
        case "6":
            csvdata += ",人流\n";
            break;
        case "3":
        case "5":
        case "7":
            csvdata += ",大型車,小型車,機車\n";
            break; 
    }
    csvdata += "時間\n";

    var allcar = [], alltruck = [], allperson = [], allmotorbike = [];
    resultData.forEach(function(data){
        var nextdate = new Date(data["time"]);
        if (resultData.length == 1){
            nextdate = data["time"];
        } else {
            if (Element[3].value == "days"){
                nextdate.setDate(nextdate.getDate() + 1);
                nextdate = formatDate(nextdate);
            } else if (Element[3].value == "weeks"){
                var sub = nextdate.str.split('-');
                sub[1] = sub[1].replace("週","");
                console.log(sub[1]);
                sub[1] = (Math.ceil(sub[1]) + 1).toString();
                nextdate = sub[0] + "-" + sub[1] + "週";
            } else if (Element[3].value == "months"){
                nextdate.setMonth(nextdate.getMonth() + 1);
                nextdate = formatMonth(nextdate);
            } else if (Element[3].value == "years"){
                nextdate.setFullYear(nextdate.getFullYear() + 1);
                nextdate = formatYear(nextdate);
            }
        }
        
        csvdata += data["time"] + "-" + nextdate + ",";
        if(Element[0].value == "1"){
            csvdata += data["five_in_person"] + "\n";
            allperson.push(Math.ceil(data["five_in_person"]));
        }else if (Element[0].value == "2"){
            csvdata += data["six_in_person"] + "\n";
            allperson.push(Math.ceil(data["six_in_person"]));
        }else if (Element[0].value == "3"){
            csvdata += data["one_in_truck"] + "," + data["one_in_car"] + "," + data["one_in_motorbike"] + "\n";
            allcar.push(Math.ceil(data["one_in_car"]));
            alltruck.push(Math.ceil(data["one_in_truck"]));
            allmotorbike.push(Math.ceil(data["one_in_motorbike"]));
        }else if (Element[0].value == "4"){
            csvdata += data["seven_in_person"] + "\n";
            allperson.push(Math.ceil(data["seven_in_person"]));
        }else if (Element[0].value == "5"){
            csvdata += (Math.ceil(data["two_in_truck"]) + Math.ceil(data["nine_in_truck"])).toString() + "," + (Math.ceil(data["two_in_car"]) + Math.ceil(data["nine_in_car"])).toString() + "," + (Math.ceil(data["two_in_motorbike"]) + Math.ceil(data["nine_in_motorbike"])).toString() + "\n";
            allcar.push(Math.ceil(data["two_in_car"]) + Math.ceil(data["nine_in_car"]));
            alltruck.push(Math.ceil(data["two_in_truck"]) + Math.ceil(data["nine_in_truck"]));
            allmotorbike.push(Math.ceil(data["two_in_motorbike"]) + Math.ceil(data["nine_in_motorbike"]));
        }else if (Element[0].value == "6"){
            csvdata += data["four_in_person"] + "\n";
            allperson.push(Math.ceil(data["four_in_person"]));
        }else if (Element[0].value == "7"){
            csvdata += data["three_in_truck"] + "," + data["three_in_car"] + "," + data["three_in_motorbike"] + "\n";
            allcar.push(Math.ceil(data["three_in_car"]));
            alltruck.push(Math.ceil(data["three_in_truck"]));
            allmotorbike.push(Math.ceil(data["three_in_motorbike"]));
        }
    });
    switch(Element[0].value){
        case "1":
        case "2":
        case "4":
        case "6":
            csvdata += "共計," + SumData(allperson) + "\n";
            break;
        case "3":
        case "5":
        case "7":
            csvdata += "共計," + SumData(alltruck) + "," + SumData(allcar) + "," + SumData(allmotorbike) + "\n";
            break; 
    }


    return csvdata;
}

function getallCounterData() {
    Element = $('#form').serializeArray();
    var csvdata = "";
    for (let index = 1; index <= 4; index++){
        //show counter title
        switch(index){
            case 1:
                csvdata += "北門遊客中心\n";
                break;
            case 2:
                csvdata += "北門遊客中心洗滌鹽\n";
                break;
            case 3:
                csvdata += "井仔腳\n";
                break;
            case 4:
                csvdata += "七股遊客中心\n";
                break;  
        }
        switch(index){
            case 1:
            case 3:
            case 4:
                csvdata += ",大型車,小型車,機車,人流\n";
                break; 
            case 2:
                csvdata += ",人流\n";
                break;
        }
        csvdata += "時間\n";

        var allcar = [], alltruck = [], allperson = [], allmotorbike = [];
        resultData.forEach(function(data){
            //show counter time
            var nextdate = new Date(data["time"]);
            if (resultData.length == 1){
                nextdate = data["time"];
            } else {
                if (Element[3].value == "days"){
                    nextdate.setDate(nextdate.getDate() + 1);
                    nextdate = formatDate(nextdate);
                } else if (Element[3].value == "weeks"){
                    var sub = nextdate.str.split('-');
                    sub[1] = sub[1].replace("週","");
                    console.log(sub[1]);
                    sub[1] = (Math.ceil(sub[1]) + 1).toString();
                    nextdate = sub[0] + "-" + sub[1] + "週";
                } else if (Element[3].value == "months"){
                    nextdate.setMonth(nextdate.getMonth() + 1);
                    nextdate = formatMonth(nextdate);
                } else if (Element[3].value == "years"){
                    nextdate.setFullYear(nextdate.getFullYear() + 1);
                    nextdate = formatYear(nextdate);
                }
            }
            csvdata += data["time"] + "-" + nextdate + ",";
            //show counter data
            switch(index){
                case 1:
                    csvdata += data["one_in_truck"] + "," + data["one_in_car"] + "," + data["one_in_motorbike"] + "," + data["five_in_person"] + "\n";
                    allperson.push(Math.ceil(data["five_in_person"]));
                    allcar.push(Math.ceil(data["one_in_car"]));
                    alltruck.push(Math.ceil(data["one_in_truck"]));
                    allmotorbike.push(Math.ceil(data["one_in_motorbike"]));
                    break;
                case 3:
                    csvdata += (Math.ceil(data["two_in_truck"]) + Math.ceil(data["nine_in_truck"])).toString() + "," + (Math.ceil(data["two_in_car"]) + Math.ceil(data["nine_in_car"])).toString() + "," + (Math.ceil(data["two_in_motorbike"]) + Math.ceil(data["nine_in_motorbike"])).toString() + "," + data["seven_in_person"] + "\n";
                    allperson.push(Math.ceil(data["seven_in_person"]));
                    allcar.push(Math.ceil(data["two_in_car"]) + Math.ceil(data["nine_in_car"]));
                    alltruck.push(Math.ceil(data["two_in_truck"]) + Math.ceil(data["nine_in_truck"]));
                    allmotorbike.push(Math.ceil(data["two_in_motorbike"]) + Math.ceil(data["nine_in_motorbike"]));
                    break;
                case 4:
                    csvdata += data["three_in_truck"] + "," + data["three_in_car"] + "," + data["three_in_motorbike"] + "," + data["four_in_person"] + "\n";
                    allperson.push(Math.ceil(data["four_in_person"]));
                    allcar.push(Math.ceil(data["three_in_car"]));
                    alltruck.push(Math.ceil(data["three_in_truck"]));
                    allmotorbike.push(Math.ceil(data["three_in_motorbike"]));
                    break; 
                case 2:
                    csvdata += data["six_in_person"] + "\n";
                    allperson.push(Math.ceil(data["six_in_person"]));
                    break;

            }
        });

        //show total data
        switch(index){
            case 1:
            case 3:
            case 4:
                csvdata += "共計," + SumData(alltruck) + "," + SumData(allcar) + "," + SumData(allmotorbike) + "," + SumData(allperson) + "\n";
                break; 
            case 2:
                csvdata += "共計," + SumData(allperson) + "\n";
                break;

        }
    }
    return csvdata;
}

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

async function exportTextFile(){
    Element = $('#form').serializeArray();
    var fileName = "車牌紀錄資訊.txt";//匯出的檔名
    var data = await getLicenceData();
    var blob = new Blob(["\uFEFF" + data], { type: 'text/csv;charset=utf-8;' });
    var href = URL.createObjectURL(blob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();
}

async function getLicenceData(){
    var csvdata = "";
    await $.get('/getLicnece', function(data, statusText, xhr){
        if (xhr.status == 200){
            //console.log(data);
            csvdata = returnLicenceData(data);
        }
    });
    return csvdata;
}

function returnLicenceData(data){
    var csvdata = "";
    csvdata += "時間 地點 車牌 種類 顏色\n";
    data.map(function (row, index) {
        csvdata += row.time + " " + row.site + " " + row.licence + " " + row.category + " " + row.color + "\n";
    });
    return csvdata;
}