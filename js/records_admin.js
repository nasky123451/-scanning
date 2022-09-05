$(document).ready(function(){
    updateResultThead();
    GetRetetion();
});

var site = "";
var category = "";
var color = "";
var licence = "";
var tablerangetime = "";
function ShowResultDiv(){
    var now = moment();
    endDate = now.format('YYYY-MM-DDTHH:mm:ss');
    startDate = now.add(-1, 'D').format('YYYY-MM-DDT') + "00:00:00";

    var searchPara = {name:"", starttime:startDate, endtime:endDate, site:"", category:"", success:"1"};
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
    var starttime = tablerangetime.split('~')[0];
    var endtime = tablerangetime.split('~')[1];
    var searchPara = {name:document.getElementById("name").innerHTML, starttime:starttime, endtime:endtime, site:site, category:category, licence:licence, success:"1"};

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
            var idNode = row.id;
            var $tbody = $('<tbody id="'+idNode+'"></tobdy>');
            var $rowdata = $('<tr data-toggle="collapse" data-target=".toogle' + index + '"></tr>');

            var $index = $('<td></td>').html(index + 1);
            var siteNode = row.site;
            var $site = $('<td></td>').html(siteNode);
            var licenceNode = row.licence;
            var $licence = $('<td></td>').html('<input type="text" class="form-control" style="min-width: 100px;" value="'+licenceNode+'">');

            var category_str = "";
            category_str +='<div class="pt-3 pb-3" style="min-width: 200px;">'+
                            '<select class="form-control mr-sm-3" >';
            if (row.category == "car"){
                category_str += '<option selected="selected" value="car">小型車</option>';
            }
            else {
                category_str += '<option value="car">小型車</option>';
            }
            if (row.category == "truck"){
                category_str += '<option selected="selected" value="truck">大型車</option>';
            }
            else {
                category_str += '<option value="truck">大型車</option>';
            }
            if (row.category == "motorbike"){
                category_str += '<option selected="selected" value="motorbike">機車</option>';
            }
            else {
                category_str += '<option value="motorbike">機車</option>';
            }
            category_str +='</select>'+
                            '</div>';

            var $category = $('<td></td>').html(category_str);

            var color_str = "";
            color_str +='<div class="pt-3 pb-3" style="min-width: 150px;">'+
                            '<select class="form-control mr-sm-3" >';
            for (let i = 0; i < colorArray_hash.length; i++){
                if (row.color == colorArray_hash[i][0]){
                    color_str += '<option selected="selected" value="'+colorArray_hash[i][0]+'">'+colorArray_hash[i][1]+'</option>';
                }
                else {
                    color_str += '<option value="'+colorArray_hash[i][0]+'">'+colorArray_hash[i][1]+'</option>';
                }
            }
            color_str +='</select>'+
                            '</div>';

            var $color = $('<td></td>').html(color_str);
            //var $time = $('<td></td>').html(row.time);

            var nowtime = "";
            nowtime = row.time.replaceAll('-', '');
            nowtime = nowtime.replaceAll(' ', '');
            nowtime = nowtime.replaceAll(':', '');
            if (row.success == "1"){
                var $send = $('<td><div><a href="javascript:send_success(' + idNode + ', ' + nowtime + ', ' + index + ')" download="" style="pointer-events: none; color: #000;"><i class="fas fa-check"></i></div></td>');
            }else {
                var $send = $('<td><div><a href="javascript:send_success(' + idNode + ', ' + nowtime + ', ' + index + ')" download=""><i class="fas fa-check"></i></div></td>');
            }

            $rowdata.append($site, $licence, $category, $color, $time, $send);
            
            var $coiledimg = $('<tr></tr>');
            var pathNode = row.path;
            var $imgs = $('<td colspan="7"></td>').html('<div class="d-flex justify-content-around align-items-center"><div class="d-flex align-items-center justify-content-center records-block">即時截圖畫面</div><img src="' + pathNode + '/0.jpg?t=' + moment() + '" loading="lazy" width = "500px"></div>' );

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
    var $site = $('<th></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)"><font class="pr-1">地點</font><img src="resources/location.png" alt="profile" width="25"></button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;"><ul class="list-group list-group-flush">'+
        '<a href="#" onclick="setsite(0)" class="list-group-item-action list-group-item">全選</a>'+
        '<a href="#" onclick="setsite(1)" class="list-group-item-action list-group-item">北門遊客中心停車場</a>'+
        '<a href="#" onclick="setsite(2)" class="list-group-item-action list-group-item">井腳仔南10停車場</a>'+
        '<a href="#" onclick="setsite(3)" class="list-group-item-action list-group-item">七股遊客中心停車場</a></ul></div>');
    var $licence = $('<th></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">車牌</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;">'+
        '<div class="d-flex p-2"><input name="licence" class="form-control" type="text" style="width:280px">'+
        '<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="setlicence()">搜尋</button></div></div>');
    var $category = $('<th></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">類型</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;"><ul class="list-group list-group-flush">'+
        '<a href="#" onclick="setcategory(0)" class="list-group-item-action list-group-item">全選</a>'+
        '<a href="#" onclick="setcategory(1)" class="list-group-item-action list-group-item">小型車</a>'+
        '<a href="#" onclick="setcategory(2)" class="list-group-item-action list-group-item">大型車</a>'+
        '<a href="#" onclick="setcategory(4)" class="list-group-item-action list-group-item">機車</a>'+
        '</ul></div>');
    var $color = $('<th></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">顏色</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;"><ul class="list-group list-group-flush">'+
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
    var $datetime = $('<th></th>').html('<button type="button" aria-haspopup="true" aria-expanded="false" class="btn btn-dark" onclick="showmenu(this)">時間</button><div tabindex="-1" role="menu" aria-hidden="false" class="ddWidth dropdown-menu" data-popper-placement="bottom-end" style="position: absolute; inset: auto auto auto auto; transform: translate(30px, 5px); background-color: #295b7c;">'+
        '<div class="d-flex p-2"><img src="resources/calendar (1).png" alt="profile" width="25" height="25">'+
        '<input class="default form-control" type="text" name="tabletime" id="tabletime" style="width:280px"></div></div>');
    var $send = $('<th></th>').html('<div style="padding: .375rem .75rem;">通過</div>');

    $rowheader.append($site, $licence, $category, $color, $datetime, $send);
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
            startDate: now.add(-1, 'D').format('YYYY-MM-DDT') + "00:00:00",
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
        var starttime = now.add(-1, 'D').format('YYYY-MM-DD ') + "00:00:00";
        $("input[name='tabletime']").val(starttime + '~' + endtime);
        tablerangetime = starttime + '~' + endtime;
    });
}

function updatePagination(total, page){
    maxPage = -1;
    // Update total
    $('#totalText').text("共" + total +"筆");
    $('#totalText2').text("共" + total +"筆");

    //Update page
    $("select[name='page'] option").remove();
    for (i = 0; i < total / CountofPage; i++)
    {
        $("select[name='page']").append($("<option></option>").attr("value", i + 1).text(i + 1));
        if (page == (i + 1)){
            //$("select[name='page'] option[value=" + page + "]").attr('selected', 'selected');
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
    updateRangeTime();
}

function onNextBtn(){
    CurrentPage ++;
    updateResult(resultData, CurrentPage);
    updateRangeTime();
}

$("select[name='page']").on('change', function(){    
    CurrentPage = this.value;
    updateResult(resultData, CurrentPage);
    updateRangeTime();
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

function send_success(id, intime, index){
    var outtime = intime.toString().slice(0, 4) + "-" + intime.toString().slice(4, 6) + "-" + intime.toString().slice(6, 8) + " " + intime.toString().slice(8, 10) + ":" + intime.toString().slice(10, 12) + ":" + intime.toString().slice(12, 14);
    //console.log(resultData[index].success);

    var searchPara = {id:id, site:resultData[index].site , type:document.getElementById(id).querySelectorAll('select')[0].value, licnece:document.getElementById(id).querySelector('input').value, color:document.getElementById(id).querySelectorAll('select')[1].value, time:outtime}
    /*$.post('/updateRecord', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            document.getElementById(id).getElementsByTagName("a")[0].style = "pointer-events: none; color: #000;";
            resultData[index].success = "1";
        }
    });*/
}

function GetRetetion(){
    /*$.get('/getRetention', function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            ShowRetetion(data);
        }
    });*/
}

function ShowRetetion(data){
    data.map(function (row, index) {
        var nameNode = row.name;
        var retention_str = '<div class="d-flex align-items-center justify-content-between p-3">'+
                                '<div class="pr-3"><nobr><span>'+nameNode+'</span></nobr></div>';

        retention_str += '<div class="p-3"><select class="form-control styled-select" style="min-width: 80px;">';                             

        var retentionNode = row.retention;
        if (retentionNode >= 100 ){
            retention_str += '<option selected="selected" value="150">擁擠</option>';         
        }else {
            retention_str += '<option value="150">擁擠</option>';     
        }
        if (retentionNode >= 50 && retentionNode < 100){
            retention_str += '<option selected="selected" value="60">普通</option>'; 
        } else {
            retention_str += '<option value="60">普通</option>';
        }
        if (retentionNode < 50 ){
            retention_str += '<option selected="selected" value="0">寬鬆</option>';
        } else{
            retention_str += '<option value="0">寬鬆</option>';
        }
                                
        retention_str += '</select></div>'+
                    '</div>';

        $("#retention_bar").append(retention_str);
    });
    
}

function update_retention(){
    /*for (let i = 0; i < document.getElementById("retention_bar").querySelectorAll('select').length; i++){
        console.log(document.getElementById("retention_bar").querySelectorAll('select')[i].value);
    }*/
    var searchPara = {one_retention:document.getElementById("retention_bar").querySelectorAll('select')[0].value, 
                    two_retention:document.getElementById("retention_bar").querySelectorAll('select')[1].value,
                    three_retention:document.getElementById("retention_bar").querySelectorAll('select')[2].value,
                    four_retention:document.getElementById("retention_bar").querySelectorAll('select')[3].value,
                    five_retention:document.getElementById("retention_bar").querySelectorAll('select')[4].value,
                    six_retention:document.getElementById("retention_bar").querySelectorAll('select')[5].value,
                    seven_retention:document.getElementById("retention_bar").querySelectorAll('select')[6].value,
                    eight_retention:document.getElementById("retention_bar").querySelectorAll('select')[7].value,
                    nine_retention:document.getElementById("retention_bar").querySelectorAll('select')[8].value};
    /*$.get('/updateRetention', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            Swal.fire({
                icon: 'success',
                text: "更新完成",
            }) 
        }
    });*/
}