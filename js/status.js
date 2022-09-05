$(document).ready(function(){
    
});

var resultData;

//珍惜生命請勿更動
//[mysqlID, mapX, mapY]
var map = [[[11, 133, 166], [10,122,231], [9,177,228], [2,234,86], [72,99,333], [39,440,185], [40,456,158], [37,473,186], [38,491,145], [36,507,173]
            , [33,581,160], [35,581,209], [32,605,160], [34,605,209], [30,679,159], [31,682,287], [27,713,155], [29,715,286], [73,745,130], [26,745,154]
            , [28,745,288], [23,779,154], [25,783,287], [22,825,148], [24,825,279], [19,858,148], [21,859,280], [18,884,148], [20,891,280], [16,907,148]
            , [17,918,280], [74,974,511], [1,985,550]],
            [[6,364,37],[5,640,470],[7,472,515],[75,442,513],[76,346,556],[77,378,728],[78,381,806],[79,521,742]],
            [[3,856,104],[4,765,547]],
            [[41,504,348],[42,612,248],[43,586,248],[44,535,222],[45,451,338],[46,393,350],[47,442,428],[48,858,28],[49,755,35],[50,698,150],
            [51,384,377],[52,548,139],[53,659,87],[54,415,439],[55,643,647],[56,251,804],[57,962,611],[58,677,73],[59,580,623],[60,832,80],
            [61,361,516],[62,615,729],[63,632,707],[64,605,675],[65,537,619],[66,481,712],[67,569,848],[68,271,821],[69,519,481],[70,411,405]],
            [[71,115,128],[8,737,409],[80,737,443]]];

var mapimg = [["resources/NorthGate.png", "1083", "631"],["resources/sevenshares.png", "823", "882"],["resources/WellFootBoy.png", "1127", "656"],
                ["resources/sevensharesIn.jpg", "1116", "908"], ["resources/WellFootBoy2.jpg", "1020", "620"]];

function initEmap(type){
    var searchPara = {type:""}
    /*$.post('/getSites', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                return;
            }

            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }
            resultData = data;
            setEmap(type);
        }
    }); */

    
    /*<a href='#' onclick="myfunction()" style="position: absolute; transform: translate(138px, 175px);" id="p1"><img src="resources/CCTV_1.png" alt="profile" class="rounded-circle" width="30"></a>*/
}

function initEmapAndshowStatus(site, id){
    document.getElementsByName("emap-type")[0].value = site;
    var searchPara = {type:""}
    /*$.post('/getSites', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                return;
            }

            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }
            resultData = data;
            setEmap(site);
            showStatus(id);
        }
    });*/
}

function setEmap(type){
    //清除舊資料並賦予新屬性
    var div = document.getElementById("e-map");
    while(div.firstChild) { 
        //console.log(div.firstChild);
        div.removeChild(div.firstChild); 
    } 

    var myimg = document.getElementById("e-map");
    var img_node=document.createElement("img");
    img_node.setAttribute("src",mapimg[type][0]);
    img_node.setAttribute("alt","profile");
    img_node.setAttribute("style","width:"+mapimg[type][1]+"px; height:"+mapimg[type][2]+"px;");
    var emap_img = myimg.appendChild(img_node);
    for(let i = 0; i < map[type].length; i++){
        var a=document.createElement("a");
        a.setAttribute("href","#");
        a.setAttribute("onclick","showStatus("+map[type][i][0]+")");
        var a_img=document.createElement("img");
        var iconwidth = 0;
        for (let j = 0; j < resultData.length; j++){
            if (map[type][i][0] == Math.ceil(resultData[j]["id"])){
                //console.log(resultData[j]["product"]);
                if (resultData[j]["product"] == "CCTV"){
                    if (resultData[j]["status"] == 1){
                        a_img.setAttribute("src","resources/CCTV_err.png");
                    }else{
                        a_img.setAttribute("src","resources/CCTV_2.png");
                    }
                    iconwidth = 20;
                    a_img.setAttribute("width",iconwidth);
                } else if (resultData[j]["product"] == "全景攝影機"){
                    if (resultData[j]["status"] == 1){
                        a_img.setAttribute("src","resources/Panoramic_err.png");
                    }else{
                        a_img.setAttribute("src","resources/Panoramic.png");
                    }
                    iconwidth = 30;
                    a_img.setAttribute("width", iconwidth);
                } else {
                    if (resultData[j]["status"] == 1){
                        a_img.setAttribute("src","resources/CCTV_err.png");
                    }else{
                        a_img.setAttribute("src","resources/CCTV_1.png");
                    }
                    iconwidth = 40;
                    a_img.setAttribute("width",iconwidth);
                }
                break;
            }
        }
        a.setAttribute("style","position: absolute; transform: translate("+(map[type][i][1] - (iconwidth/2))+"px, "+(map[type][i][2] - (iconwidth/2))+"px);");
        a_img.setAttribute("alt","profile");
        a_img.setAttribute("class","rounded-circle");
        a.appendChild(a_img);
        if(emap_img.nextSibling){
            emap_img.parentNode.insertBefore(a,emap_img.nextSibling);
        }else{
            emap_img.parentNode.appendChild(a);
        }
    }
}

function showStatus(id){
    $("table[name='result'] thead tr").remove();
    $("table[name='result'] tbody tr").remove();
    // Create header.
    var $rowheader = $('<tr></tr>');
    var $product = $('<th scope="col"></th>').html("Product");
    var $name = $('<th scope="col"></th>').html('<nobr><font class="pr-1">地點</font><img src="resources/location.png" alt="profile" width="25"></nobr>');
    var $status = $('<th scope="col"></th>').html("Status");
    var $ping = $('<th scope="col"></th>').html("Ping");
    var $temperature = $('<th scope="col"></th>').html("設備溫度");

    $rowheader.append($product, $name, $status, $ping, $temperature);
    $("table[name='result'] thead").append($rowheader);

    // Create result data.
    for (let i = 0; i < resultData.length; i++){
        if (Math.ceil(resultData[i]["id"]) == id){
            var $rowdata = $('<tr></tr>');

            var $name = $('<td></td>').html(resultData[i]["name"]);

            if (resultData[i]["product"] == "CCTV"){
                var $product = $('<td></td>').html('<div class="d-flex align-items-center"><img src="resources/CCTV_2.png" alt="profile" width="50"><div style="padding-left: 20px;">'+resultData[i]["product"]+'</div></div>');
            }else if (resultData[i]["product"] == "全景攝影機"){
                var $product = $('<td></td>').html('<div class="d-flex align-items-center"><img src="resources/Panoramic.png" alt="profile" width="50"><div style="padding-left: 20px;">'+resultData[i]["product"]+'</div></div>');
            }else {
                var $product = $('<td></td>').html('<div class="d-flex align-items-center"><img src="resources/CCTV_1.png" alt="profile" width="50"><div style="padding-left: 20px;">'+resultData[i]["product"]+'</div></div>');
            }

            if (resultData[i]["status"] == "1"){
                //SendMessage(row.id); 
                if (resultData[i]["product"] == "伺服器主機" || resultData[i]["product"] == "NVR主機"){
                    var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='error-circle'></div></div>");   
                }else{
                    var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='error-circle'></div><div class='p-3'><a href='javascript:Resetequipment()'><img src='resources/reset.png' alt='profile' width='30'></div></div>");   
                }
            }else{
                if (Math.ceil(resultData[i]["ping"]) > 150){
                    if (resultData[i]["product"] == "伺服器主機" || resultData[i]["product"] == "NVR主機"){
                        var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='warning-circle'></div></div>");   
                    }else{
                        var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='warning-circle'></div><div class='p-3'><a href='javascript:Resetequipment()'><img src='resources/reset.png' alt='profile' width='30'></div></div>");   
                    }
                }else{
                    if (resultData[i]["product"] == "伺服器主機" || resultData[i]["product"] == "NVR主機"){
                        var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='success-circle'></div></div>");   
                    }else{
                        var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='success-circle'></div><div class='p-3'><a href='javascript:Resetequipment()'><img src='resources/reset.png' alt='profile' width='30'></div></div>");   
                    }
                }
                
            }
            
            if(resultData[i]["ping"] == "None"){
                var $ping = $('<td></td>').html("None");
            }
            else{
                var $ping = $('<td></td>').html(resultData[i]["ping"] + "ms");
            }
            $temperature = $('<td></td>').html(resultData[i]["temperature"] + "°C");
            $rowdata.append($product, $name, $status, $ping, $temperature);
            $("table[name='result']").append($rowdata);

            var path = "C:/log/使用網頁紀錄"
            var message = "使用者:" + document.getElementById("name").innerHTML + " 搜尋了設備狀態 類別:"+resultData[i]["product"]+ " 名稱:"+resultData[i]["name"]+" 時間:" + moment().format('YYYY-MM-DD HH:mm:ss') + "\n";
            message += "====================================================================\n"
            searchPara = {message:message, path:path};
            //$.post('/write_log', searchPara);

            break;
        }
    }

}

function updateEmap(){
    var img = document.getElementById('e-map'); 
    //document.getElementById("p1").style.transform="translate(138px, 175px)";
    //or however you get a handle to the IMG
    var width = img.clientWidth;
    var height = img.clientHeight;
    if (width < mapwidth || height < mapheight){
        document.getElementById("p1").style.transform="translate("+(map[0][1] * width / mapwidth)+"px, "+(map[0][2] * height / mapheight)+"px)";
    }
    if (width == mapwidth && height == mapheight) {
        document.getElementById("p1").style.transform="translate("+map[0][1]+"px, "+map[0][2]+"px)";
    }
}


function StatusConnectWS(server, userId) {
    try {
        cws = new WebSocket('ws://' + server + '?user_id=' + userId)
        cws.onopen = function(e) { 
            console.log('connected to ws server ' + server + ' user_id: ' + userId);
        }; 
        cws.onclose = function(e) { 
            cws.close()
            cws = null
            console.log('connection closed')
            connectWS(server, userId)
        }; 
        cws.onmessage = function(e) { 
            //alert(e.data)
            UpdateStatus(e.data);
        }; 
        cws.onerror = function(e) { 
            console.log('connect error');
        };
    } catch (e) {
        console.log('connect error, please check your ws server address');
    }
    
}

function UpdateStatus(message){
    initEmap(document.getElementsByName("emap-type")[0].options[document.getElementsByName("emap-type")[0].selectedIndex].value);
}

function SumData(arr){
    var sum=0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    };
    return sum;
}

function ShowstatusChart(name){
    var now = moment();
    EndTime = now.format('YYYY-MM-DDTHH:mm');
    StartTime = now.add(-1, 'M').format('YYYY-MM-DDT00:00');
    
    searchPara = {starttime:StartTime, endtime:EndTime, interval:document.getElementById("datetime").value};
    /*$.get('/getStatusCount', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                return;
            }

            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }
            updateStatusChart(name, data);
        }
    }); */
}

function updateStatusChart(name, datas){

    //清除舊資料並賦予新屬性
    $("#" + name).remove();
    $('#canvas').append('<canvas id="'+ name +'" class="MaxHeight250"></canvas>');

    var alltime = [], totle = [];
    datas.forEach(function(data){
        //console.log(data[0]);
        alltime.push(data['Time']);
        totle.push(Math.ceil(data["Total"]));
    });

    var ctx = document.getElementById(name).getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: alltime,
        datasets: [{ 
            data: totle,
            label: "Totle",
            borderColor: "rgb(69,173,223)",
            backgroundColor: "rgb(69,173,223,0.1)",
          }
        ]},
    });
    $("#totle_count").html(SumData(totle) + '次');
    $("#cctv_count").html(SumData(totle) + '次');
}

function getstatusData(name, type){
    var searchPara = {type:type}
    /*$.post('/getSites', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                return;
            }

            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }
            
            updateStatusData(name, data);
        }
    }); */
}

function updateStatusData(name, datas){

    var alltime = [], totle = [];
    var totlecount = 0, count = 0;
    var error = false;
    datas.forEach(function(data){
        if (data["ping"] != "None"){
            totlecount += Math.ceil(data["ping"]);
            count++;
        }else{
            error = true;
        }
    });

    if(count != 0){
        $("#quality").html(Math.ceil(totlecount / count) + 'ms');
    }else{
        $("#quality").html('None ms');
    }
    if(error == true){
        $("#now_status").html("<div class='error-circle'></div>");
    }else{
        if(Math.ceil(totlecount / count) > 150){
            $("#now_status").html("<div class='warning-circle'></div>");
        }else{
            $("#now_status").html("<div class='success-circle'></div>");
        }
    }
}

function getData(classname, type){
    var searchPara = {type:type};
    $('#updatetimeText').text("更新時間："+moment().format('YYYY-MM-DD hh:mm:ss'));
    /*$.post('/getSites', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }

            InitStatus(data, classname, type);
        }
    });*/
}

function updateData(classname, type){
    var searchPara = {type:type};
    $('#updatetimeText').text("更新時間："+moment().format('YYYY-MM-DD hh:mm:ss'));
    /*$.post('/getSites', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }

            updateStatus(data, classname, type);
        }
    }); */
}

function InitStatus(data, classname, type){
    $("table[name='" + classname + "'] thead tr").remove();
    $("table[name='" + classname + "'] tbody tr").remove();
    // Create header.
    var $rowheader = $('<tr></tr>');
    var $product = $('<th scope="col"></th>').html("Product");
    var $name = $('<th scope="col"></th>').html('<nobr><font class="pr-1">地點</font><img src="resources/location.png" alt="profile" width="25"></nobr>');
    var $status = $('<th scope="col"></th>').html("Status");
    var $ping = $('<th scope="col"></th>').html("Ping");

    $rowheader.append($product, $name, $status, $ping);
    $("table[name='" + classname + "'] thead").append($rowheader);

    // Create result data.
    var rowElements = data.map(function (row, index) {

        var $rowdata = $('<tr data-toggle="collapse" data-target=".toogle' + index + '"></tr>');
        var productNode = row.product;
        if (productNode == "伺服器主機" || productNode == "NVR主機"){
            var $product = $('<td></td>').html('<div class="d-flex align-items-center"><img src="resources/NVR.png" alt="profile" width="50"><div style="padding-left: 20px;">'+productNode+'</div></div>');
        }else{
            var $product = $('<td></td>').html('<div class="d-flex align-items-center"><img src="resources/CCTV_2.png" alt="profile" width="50"><div style="padding-left: 20px;">'+productNode+'</div></div>');
        }
        var nameNode = row.name;
        var $name = $('<td></td>').html(nameNode);

        if (row.status == "1"){
            //SendMessage(row.id); 
            if (productNode == "伺服器主機" || productNode == "NVR主機"){
                var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='error-circle'></div></div>");   
            }else{
                var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='error-circle'></div><div class='p-3'><a href='javascript:Resetequipment()'><img src='resources/reset.png' alt='profile' width='30'></div></div>");   
            }
        }else{
            if (Math.ceil(row.ping) > 150){
                if (productNode == "伺服器主機" || productNode == "NVR主機"){
                    var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='warning-circle'></div></div>");   
                }else{
                    var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='warning-circle'></div><div class='p-3'><a href='javascript:Resetequipment()'><img src='resources/reset.png' alt='profile' width='30'></div></div>");   
                }
            }else{
                if (productNode == "伺服器主機" || productNode == "NVR主機"){
                    var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='success-circle'></div></div>");   
                }else{
                    var $status = $('<td></td>').html("<div class='d-flex align-items-center justify-content-center'><div class='success-circle'></div><div class='p-3'><a href='javascript:Resetequipment()'><img src='resources/reset.png' alt='profile' width='30'></div></div>");   
                }
            }
            
        }
        var pingNode = row.ping;
        if(pingNode == "None"){
            var $ping = $('<td></td>').html("None");
        }
        else{
            var $ping = $('<td></td>').html(pingNode + "ms");
        }
        

        $rowdata.append($product, $name, $status, $ping);
        
        return $rowdata;
    });

    $("table[name='" + classname + "']").append(rowElements);
}

function updateStatus(data, classname, type){
    data.map(function (row, index) {
        //console.log(document.getElementsByName(classname)[0].childNodes[3].childNodes[index + 1].childNodes[2].childNodes[0].childNodes[0]);
        if(row.ping == "None"){
            document.getElementsByName(classname)[0].childNodes[3].childNodes[index + 1].childNodes[3].innerHTML = "None";
        }
        else{
            document.getElementsByName(classname)[0].childNodes[3].childNodes[index + 1].childNodes[3].innerHTML = row.ping + "ms";
        }
        if (row.status == "1"){
            document.getElementsByName(classname)[0].childNodes[3].childNodes[index + 1].childNodes[2].childNodes[0].childNodes[0].className = "error-circle";
        }else{
            if (Math.ceil(row.ping) > 150){
                document.getElementsByName(classname)[0].childNodes[3].childNodes[index + 1].childNodes[2].childNodes[0].childNodes[0].className = "warning-circle";
            }else{
                document.getElementsByName(classname)[0].childNodes[3].childNodes[index + 1].childNodes[2].childNodes[0].childNodes[0].className = "success-circle";
            }
            
        }
    });
}
function switch_set(checked, name){
    var searchPara = {"switch":checked,"station_name":name};

    /*$.post('/setSwitchStatus', searchPara, function(data, statusText, xhr){
      if (xhr.status == 200){
          if (!data){
              alert("查無結果!");
              return;
          }
      }
      if (data.indexOf("<!DOCTYPE html>") == 0){
            window.location.href = "welcome";
            
        }
    });*/
}

function line_inform(){
    var user = {name:document.getElementById("usermenu").getElementsByTagName("h6")[0].innerHTML};
    //$.get('/lineInform', user);
}