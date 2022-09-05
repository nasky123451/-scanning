$(document).ready(function(){
    updateResultThead();

    document.getElementById("starttime").addEventListener("input", function() {
        setstart();
    });
    document.getElementById("endtime").addEventListener("input", function() {
        setend();
    });   
});

var site = "";
var category = "";
var color = "";
var licence = "";
var tablerangetime = "";
var start, end;
function ShowResultDiv(){
    var now = moment();
    endDate = now.format('YYYY-MM-DDTHH:mm:ss');
    startDate = now.add(-1, 'M').format('YYYY-MM-DDT') + "00:00:00";

    var searchPara = {name:"", starttime:startDate, endtime:endDate, site:"", category:""};
    /*$.get('/getRecords', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                updateRangeTime();
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }

            resultData = data;
            CurrentPage = 1;
            updateResult(data, CurrentPage);
            
            $("#ResultDiv").show();
            updateRangeTime();
        }
    });*/
}

function UpdateResultDiv(){
    var searchPara = {name:document.getElementById("name").innerHTML, starttime:start, endtime:end, site:site, category:category, color:color, licence:licence, success:"0"};

    /*$.get('/getRecords', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                updateRangeTime();
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }

            resultData = data;
            CurrentPage = 1;
            updateResult(data, CurrentPage);
            
            $("#ResultDiv").show();
            updateRangeTime();
        }
    });*/
}

var CountofPage = 10;
var CurrentPage = 1;

var colorArray_hash = [["red", "紅色"], ["orange", "橙色"], ["yellow", "黃色"], ["green", "綠色"], ["cyan", "青色"],
                        ["blue", "藍色"], ["violet", "紫色"], ["black", "黑色"], ["grey", "灰色"], ["white", "白色"]];

function updateResult(data, page){
    $("table[name='result'] tbody").remove();

    // Create result data.
    var rowElements = data.map(function (row, index) {
        if ((CountofPage * (page - 1) <= index) && (index < CountofPage * page)){
            var $tbody = $('<tbody></tobdy>');
            var $rowdata = $('<tr data-toggle="collapse" data-target=".toogle' + index + '"></tr>');

            var $index = $('<td></td>').html(index + 1);
            var siteNode = row.site;
            var LicenceNode row.licence;
            var $site = $('<td></td>').html(siteNode);
            var $licence = $('<td></td>').html(LicenceNode);
            if (row.category == "car"){
                var $category = $('<td></td>').html('<div class="d-flex align-items-center justify-content-center"><img src="resources/car_circle.png" alt="profile" width="50"><div style="padding-left: 20px;">小型車</div></div>');
            }
            if (row.category == "truck"){
                var $category = $('<td></td>').html('<div class="d-flex align-items-center justify-content-center"><img src="resources/truck_icon.png" alt="profile" width="50"><div style="padding-left: 20px;">大型車</div></div>');
            }
            if (row.category == "motorbike"){
                var $category = $('<td></td>').html('<div class="d-flex align-items-center justify-content-center"><img src="resources/treadmill.png" alt="profile" width="50"><div style="padding-left: 20px;">機車</div></div>');  
            }
            for (let i = 0; i < colorArray_hash.length; i++){
                if (row.color == colorArray_hash[i][0]){
                    var $color = $('<td></td>').html(colorArray_hash[i][1]);
                }
            }
            var timeNode = row.time;
            var $time = $('<td></td>').html(timeNode);

 			var $action = $('<td></td>');
            var pathNode = row.path;
            var $download = $('<div><a href="'+ pathNode+ '/0.jpg" download=""><img src="resources/download.png" alt="profile" width="30"></a></div>');
            $action.append($download);
            //var $delete = $('<td><div><a href="javascript:deleteImage(' + row.id + ')" download=""><img src="resources/delete.png" alt="profile" width="30"></div></td>');

            $rowdata.append($site, $licence, $category, $color, $time, $action);
            
            var $coiledimg = $('<tr class="collapse in toogle' + index + '"</tr>');
            var $imgs = $('<td colspan="7"></td>').html('<div class="d-flex justify-content-around align-items-center"><div class="d-flex align-items-center justify-content-center records-block">即時截圖畫面</div><img src="' + pathNode + '/0.jpg" loading="lazy" width = "500px"></div>' );

            $coiledimg.append($imgs);
            $tbody.append($rowdata, $coiledimg);
        }
        return $tbody;
    });

    $("table[name='result']").append(rowElements);

    var lengthNode = data.length;
    updatePagination(lengthNode, page);
}
function updateResultThead(){
    // Create header.
    var $rowheader = $('<tr></tr>');
    var $site = $('<th scope="col"></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)"><font class="pr-1">地點</font><img src="resources/location.png" alt="profile" width="25"></button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;"><ul class="list-group list-group-flush">'+
        '<a href="#" onclick="setsite(0)" class="list-group-item-action list-group-item">全選</a>'+
        '<a href="#" onclick="setsite(1)" class="list-group-item-action list-group-item">北門遊客中心停車場</a>'+
        '<a href="#" onclick="setsite(2)" class="list-group-item-action list-group-item">井腳仔南10停車場</a>'+
        '<a href="#" onclick="setsite(3)" class="list-group-item-action list-group-item">七股遊客中心停車場</a></ul></div>');
    var $licence = $('<th scope="col"></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">車牌</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;">'+
        '<div class="d-flex p-2"><input name="licence" class="form-control" type="text" style="width:280px">'+
        '<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="setlicence()">搜尋</button></div></div>');
    var $category = $('<th scope="col"></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">類型</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;"><ul class="list-group list-group-flush">'+
        '<a href="#" onclick="setcategory(0)" class="list-group-item-action list-group-item">全選</a>'+
        '<a href="#" onclick="setcategory(1)" class="list-group-item-action list-group-item">小型車</a>'+
        '<a href="#" onclick="setcategory(2)" class="list-group-item-action list-group-item">大型車</a>'+
        '<a href="#" onclick="setcategory(4)" class="list-group-item-action list-group-item">機車</a>'+
        '</ul></div>');
    var $color = $('<th scope="col"></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">顏色</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;"><ul class="list-group list-group-flush">'+
        '<a href="#" onclick="setcolor(0)" class="list-group-item-action list-group-item">全選</a>'+
        '<a href="#" onclick="setcolor(1)" class="list-group-item-action list-group-item">紅色</a>'+
        '<a href="#" onclick="setcolor(2)" class="list-group-item-action list-group-item">橙色</a>'+
        '<a href="#" onclick="setcolor(3)" class="list-group-item-action list-group-item">黃色</a>'+
        '<a href="#" onclick="setcolor(4)" class="list-group-item-action list-group-item">綠色</a>'+
        '<a href="#" onclick="setcolor(5)" class="list-group-item-action list-group-item">青色</a>'+
        '<a href="#" onclick="setcolor(6)" class="list-group-item-action list-group-item">藍色</a>'+
        '<a href="#" onclick="setcolor(7)" class="list-group-item-action list-group-item">紫色</a>'+
        '<a href="#" onclick="setcolor(8)" class="list-group-item-action list-group-item">黑色</a>'+
        '<a href="#" onclick="setcolor(9)" class="list-group-item-action list-group-item">灰色</a>'+
        '<a href="#" onclick="setcolor(10)" class="list-group-item-action list-group-item">白色</a>'+
        '</ul></div>');
    var $datetime = $('<th scope="col"></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">時間</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;">'+
        '<div class="d-flex align-items-center p-2"><img src="resources/calendar (1).png" alt="profile" style="width: 40px; height:25px;" class="pr-3">'+
        '<input type="datetime-local" class="form-control" name="starttime" id="starttime">～<input type="datetime-local" class="form-control" name="endtime" id="endtime"></div></div>');
    var $action = $('<th scope="col"></th>').html('<div style="padding: .375rem .75rem;">下載</div>');
    //var $delete = $('<th scope="col"></th>').html("刪除");

    $rowheader.append($site, $licence, $category, $color, $datetime, $action);
    $("table[name='result'] thead").append($rowheader);

    //updatePagination(0, page);
}

function updateRangeTime(){
    var now = moment();
    $(function() {
      $("input.default").daterangepicker({
            autoUpdateInput: false,
            locale: {
            format: "YYYY-MM-DD HH:mm:ss"
            },
            endDate: now.format('YYYY-MM-DDTHH:mm:ss'),
            startDate: now.add(-1, 'M').format('YYYY-MM-DDT') + "00:00:00",
      });

      $("input.default").on('apply.daterangepicker', function(ev, picker) {
          $(this).val(picker.startDate.format('YYYY-MM-DD hh:mm:ss') + '~' + picker.endDate.format('YYYY-MM-DD hh:mm:ss'));
          tablerangetime = picker.startDate.format('YYYY-MM-DD hh:mm:ss') + '~' + picker.endDate.format('YYYY-MM-DD hh:mm:ss');
          UpdateResultDiv();
      });

      $("input.default").on('cancel.daterangepicker', function(ev, picker) {
          $(this).val('');
      });

        now = moment();
        var endtime = now.format('YYYY-MM-DD HH:mm:ss');
        var starttime = now.add(-1, 'M').format('YYYY-MM-DD ') + "00:00:00";
        $("input[name='tabletime']").val(starttime + '~' + endtime);
        tablerangetime = starttime + '~' + endtime;
    });
}

function updatePagination(total, page){
    maxPage = -1;
    // Update total
    $('#totalText').text("共" + total +"筆");

    //Update page
    $("select[name='page'] option").remove();
    for (i = 0; i < total / CountofPage; i++)
    {
        $("select[name='page']").append($("<option></option>").attr("value", i + 1).text(i + 1));
        if (page == (i + 1)){
            $("select[name='page'] option[value=" + page + "]").attr('selected', 'selected');
        }
        maxPage = i + 1;
    }

    //Limit previous and next button.
    $("li[name='previous']").removeClass('disabled');
    $("li[name='next']").removeClass('disabled');
    if (page == 1){
        $("li[name='previous']").addClass('disabled');
    }
    
    if (page == maxPage){
        $("li[name='next']").addClass('disabled');
    }
}

function onPreviousBtn(){
    CurrentPage --;
    updateResult(resultData, CurrentPage);
    //updateRangeTime();
}

function onNextBtn(){
    CurrentPage ++;
    updateResult(resultData, CurrentPage);
    //updateRangeTime();
}

$("select[name='page']").on('change', function(){    
    CurrentPage = this.value;
    updateResult(resultData, CurrentPage);
    //updateRangeTime();
});

var searchPara;
var resultData;

function showmenu(Obj) {
    //console.log(Obj.parentNode.getElementsByClassName("ddWidth dropdown-menu"));
    Obj.parentNode.getElementsByClassName("ddWidth dropdown-menu").item(0).classList.toggle('show');
}
function setcategory(data){
    if (data == 0){
        category="";
    }else if (data == 1){
        category="car";
    }
    else if (data == 2){
        category="truck";
    }
    else if (data == 4){
        category="motorbike";
    }   
    UpdateResultDiv();
}
function setsite(data){
    if (data == 0){
        site="";
    }else if (data == 1){
        site="北門遊客中心停車場";
    }
    else if (data == 2){
        site="井腳仔南10停車場";
    }
    else if (data == 3){
        site="七股遊客中心停車場";
    }
    UpdateResultDiv();
}
function setcolor(data){
    if (data == 0){
        color="";
    }else {
        color = colorArray_hash[data - 1][0];
    }
    UpdateResultDiv();
}
function setlicence(){
    licence = document.getElementsByName("licence")[0].value;
    UpdateResultDiv();
}
function setstart(){
    start = document.getElementsByName("starttime")[0].value;
    UpdateResultDiv();
}
function setend(){
    end = document.getElementsByName("endtime")[0].value;
    UpdateResultDiv();
}