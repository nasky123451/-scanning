$(document).ready(function(){
    ShowViewTable();
    //alert(jQuery.fn.jquery);
});

function OverviewConnectWS(server, userId) {
    try {
        cws = new WebSocket('ws://' + server + '?user_id=' + userId)
        cws.onopen = function(e) { 
            console.log('connected to ws server ' + server + ' user_id: ' + userId);
        }; 
        cws.onclose = function(e) { 
            cws.close()
            cws = null
            console.log('connection closed')
            OverviewConnectWS(server, userId)
        }; 
        cws.onmessage = function(e) { 
            //alert(e.data)
            UpdateOverviewdata(e.data);
        }; 
        cws.onerror = function(e) { 
            console.log('connect error');
        };
    } catch (e) {
        console.log('connect error, please check your ws server address');
    }
    
}

function UpdateOverviewdata(message){
    updateData("resultstatus", "");
}

function updateUserLog(data){
    $("table[name='resultuserlog'] thead tr").remove();
    $("table[name='resultuserlog'] tbody tr").remove();
    // Create header.
    var $rowheader = $('<tr></tr>');
    var $username = $('<th scope="col"></th>').html("User");
    var $time = $('<th scope="col"></th>').html('<font class="pr-1">時間</font><img src="resources/calendar (1).png" alt="profile" width="25">');
    

    $rowheader.append($username, $time);
    $("table[name='resultuserlog'] thead").append($rowheader);
    // Create result data.
    var rowElements = data.map(function (row, index) {
        var $tbody = $('<tbody></tobdy>');
        var $rowdata = $('<tr data-toggle="collapse" data-target=".toogle' + index + '"></tr>');

        var usernameNode = row.username;
        var timeNode = row.time;
        var $username = $('<td></td>').html(usernameNode);
        var $time = $('<td></td>').html(timeNode);
        $rowdata.append($username, $time);
        
        $tbody.append($rowdata);
        return $tbody;
    });

    $("table[name='resultuserlog']").append(rowElements);
}

var resultData;
function showUserLog(){
    /*$.get('/getUserLogs', function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
            }

            resultData = data;
            updateUserLog(data);
            
        }
    }); */
}

var resultData;
function ShowViewTable(){
    EndTime = moment().format('YYYY-MM-DDTHH:mm');
    StartTime = moment().format('YYYY-MM-DDT00:00');
    document.getElementsByClassName("viewBar-text")[0].innerText = moment().format('YYYY/MM/DD');
    
    searchPara = {starttime:StartTime, endtime:EndTime, interval:"days"};
    /*$.get('/getCountStatistics', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            updateViewTable(data);
        }
    });*/
}

function updateViewTable(data){
    //console.log(document.getElementsByTagName("ol")[0].getElementsByTagName("li")[0].childNodes[3].innerText);
    document.getElementsByTagName("ol")[0].getElementsByTagName("li")[0].childNodes[3].innerText = data[0]["one_in_car"] + "輛";
    document.getElementsByTagName("ol")[0].getElementsByTagName("li")[1].childNodes[3].innerText = data[0]["one_in_truck"] + "輛";
    document.getElementsByTagName("ol")[0].getElementsByTagName("li")[2].childNodes[3].innerText = data[0]["one_in_motorbike"] + "輛";
    document.getElementsByTagName("ol")[0].getElementsByTagName("li")[3].childNodes[3].innerText = data[0]["five_in_person"] + "人";

    document.getElementsByTagName("ol")[1].getElementsByTagName("li")[0].childNodes[3].innerText = data[0]["three_in_car"] + "輛";
    document.getElementsByTagName("ol")[1].getElementsByTagName("li")[1].childNodes[3].innerText = data[0]["three_in_truck"] + "輛";
    document.getElementsByTagName("ol")[1].getElementsByTagName("li")[2].childNodes[3].innerText = data[0]["three_in_motorbike"] + "輛";
    document.getElementsByTagName("ol")[1].getElementsByTagName("li")[3].childNodes[3].innerText = data[0]["four_in_person"] + "人";

    document.getElementsByTagName("ol")[2].getElementsByTagName("li")[0].childNodes[3].innerText = (Math.ceil(data[0]["two_in_car"]) + Math.ceil(data[0]["nine_in_car"])) + "輛";
    document.getElementsByTagName("ol")[2].getElementsByTagName("li")[1].childNodes[3].innerText = (Math.ceil(data[0]["two_in_truck"]) + Math.ceil(data[0]["nine_in_truck"])) + "輛";
    document.getElementsByTagName("ol")[2].getElementsByTagName("li")[2].childNodes[3].innerText = (Math.ceil(data[0]["two_in_motorbike"]) + Math.ceil(data[0]["nine_in_motorbike"])) + "輛";
    document.getElementsByTagName("ol")[2].getElementsByTagName("li")[3].childNodes[3].innerText = data[0]["seven_in_person"] + "人";
}