$(document).ready(function(){
    document.getElementById("menuname").textContent = "AI人車流管理資訊平台";
    ShowStatusMenu("");
    //ShowRecordMenu("1");
    InitMenu();
    var getUrlString = location.href;
    var url = new URL(getUrlString);
    MenuConnectWS(""+url.hostname+":8081/comet", "statusmenu");
    MenuConnectWS(""+url.hostname+":8081/comet", "records");
});

var statusflag = new Boolean(false);
var recordflag = new Boolean(false);
function MenuConnectWS(server, userId) {
    try {
        cws = new WebSocket('ws://' + server + '?user_id=' + userId)
        cws.onopen = function(e) { 
            console.log('connected to ws server ' + server + ' user_id: ' + userId);
        }; 
        cws.onclose = function(e) { 
            cws.close()
            cws = null
            console.log('connection closed')
            MenuConnectWS(server, userId)
        }; 
        cws.onmessage = function(e) { 
            //alert(e.data)
            if (userId == "statusmenu" && statusflag == false){
                statusflag = true;
                ShowStatusMenu("1");
            }
            /*if (userId == "records" && recordflag == false){
                recordflag = true;
                ShowRecordMenu("1");
            }*/
           
        }; 
        cws.onerror = function(e) { 
            console.log('connect error');
        };
    } catch (e) {
        console.log('connect error, please check your ws server address');
    }
    
}

function ShowStatusMenu(type){

    var searchPara = {type:""};
    $.post('/getSites', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }
            updateStatusMenu(data, type);
            statusflag = false;
        }
    });
}

function UpdateStatusShow(){
    $.post('/updateSitesShow');
}

function UpdateRecordShow(){
    $.post('/updateRecordShow');
}

var ErrCount = 0;
function updateStatusMenu(data, type){
    //$("table[name='resultstatusmenu'] tbody tr").remove();

    // Create resultstatus data.
    var rowElements = data.map(function (row, index) {
        if ((row.status == '1' && row.show == '0') || (type == "")){ //狀態為異常還未顯示
            var $rowdata = $('<tr data-toggle="collapse" data-target=".toogle' + index + '"></tr>');
            var $tbody = $('<tbody></tobdy>');
            if(row.status == '1'){
                var $product = $('<td></td>').html('<a href="/status?id='+row.id+'&site='+row.site+'""><div class="d-flex align-items-center"><img src="resources/CCTV_2.png" alt="profile" width="50"><div style="padding-left: 20px;"><nobr>'+row.product+'：'+row.name+'－設備異常</nobr></div></div></a>');
                $rowdata.append($product);
                ErrCount++;
                $("table[name='resultstatusmenu'] tbody:first-child").after($rowdata);//插入第一行
                return $rowdata;
            }
        }else if (row.status == '0' && row.show == '1'){ //狀態為正常正在顯示
            var text = row.product +'：'+ row.name + '－設備異常';
            //console.log(text);
            var aa = $("table tr td nobr").filter(function() {
                //console.log($(this).text());
              return $(this).text() === text;
            }).closest("tr").remove();
            if (ErrCount > 0){
                ErrCount--;
            }
        }
        
    });


    //$(rowElements).insertAfter("table[name='resultstatusmenu'] tr:first");
    //$("table[name='resultstatusmenu']").append(rowElements);
    
    if (ErrCount > 0) {
        showErrIcon();
    }else {
        clearErrIcon();
    }
    UpdateStatusShow();
}

function showErrIcon(){
    var parent = document.getElementById("resultstatusmenu").parentNode.parentNode.previousElementSibling.childNodes;
    if (!!parent[1]){
        parent[1].remove();
    }

    if(ErrCount > 0){
        var parent = document.getElementById("resultstatusmenu").parentNode.parentNode.previousElementSibling;
        //添加 div
        var div = document.createElement("div");
        //设置 div 属性，如 id
        div.setAttribute("class", "circle-box sm-box d-inline-block bg-light-danger");
        div.setAttribute("style", "position:absolute; top:5px; right:11px;");
        if (ErrCount > 99){
            div.innerHTML = "99+";
        }else {
            div.innerHTML = ErrCount;
        }
        parent.appendChild(div);
    }
}

function clearErrIcon(){
    var parent = document.getElementById("resultstatusmenu").parentNode.parentNode.previousElementSibling.childNodes;
    //console.log(parent);
    if (!!parent[1]){
        parent[1].remove();
        ErrCount = 0;
    }
}

function InitMenu(){
    /*
    var $rowdata = $('<tr data-toggle="collapse"></tr>');
    var $row = $('<td></td>').html('<a class="gap-3 nav-item nav-link" href="records"><img src="resources/calendar (1).png" alt="profile" width="20"><font class="nvbar-text"><nobr>偵測事件</nobr></font></a>');
    $rowdata.append($row);
    $("table[name='menu']").append($rowdata);*/
    if (document.getElementById("get_value").innerHTML == "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"){
        var $rowdata = $('<tr data-toggle="collapse"></tr>');
        var $row = $('<td></td>').html('<a class="gap-3 nav-item nav-link" href="records"><img src="resources/calendar (1).png" alt="profile" width="20"><font class="nvbar-text"><nobr>車牌紀錄</nobr></font></a>');
        $rowdata.append($row);
        $("table[name='menu']").append($rowdata);
    }
    var $rowdata = $('<tr data-toggle="collapse"></tr>');
    var $row = $('<td></td>').html('<a class="gap-3 nav-item nav-link" href="LivePicture"><img src="resources/cctv (1).png" alt="profile" width="20"><font class="nvbar-text"><nobr>即時畫面</nobr></font></a>');
    $rowdata.append($row);
    $("table[name='menu']").append($rowdata);
    if (document.getElementById("get_value").innerHTML == "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35" || document.getElementById("get_value").innerHTML == "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"){
        $rowdata = $('<tr data-toggle="collapse"></tr>');
        $row = $('<td></td>').html('<a class="gap-3 nav-item nav-link" href="status"><img src="resources/status.png" alt="profile" width="20"><font class="nvbar-text"><nobr>設備狀態</nobr></font></a>');
        $rowdata.append($row);
        $("table[name='menu']").append($rowdata);
    }
    $rowdata = $('<tr data-toggle="collapse"></tr>');
    $row = $('<td></td>').html('<a class="gap-3 nav-item nav-link" href="CountStatistics"><img src="resources/statistic.png" alt="profile" width="20"><font class="nvbar-text"><nobr>統計分析</nobr></font></a>');
    $rowdata.append($row);
    $("table[name='menu']").append($rowdata);
    $rowdata = $('<tr data-toggle="collapse"></tr>');
    $row = $('<td></td>').html('<a class="gap-3 nav-item nav-link" href="translates"><img src="resources/cloud.png" alt="profile" width="20"><font class="nvbar-text"><nobr>氣象資訊顯示</nobr></font></a>');
    $rowdata.append($row);
    $("table[name='menu']").append($rowdata);


    //user menu
    if (document.getElementById("get_value").innerHTML == "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35" || document.getElementById("get_value").innerHTML == "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"){
        $( "#usermenu" ).append( '<button type="button" tabindex="0" role="menuitem" class="d-flex gap-3 p-3 pt-2 dropdown-item align-items-center" onclick="hrefUserManage()">'+
                            '<i class="fas fa-gear fa-xl rounded-circle" style="width: 30px;"></i><h6 class="mb-0">帳號管理</h6></button>' );
        $( "#usermenu" ).append( '<button type="button" tabindex="0" role="menuitem" class="d-flex gap-3 p-3 pt-2 dropdown-item align-items-center" onclick="OpenModal()">'+
                            '<img src="resources/add-user.png" alt="profile" class="rounded-circle" width="30"><h6 class="mb-0">新增帳號</h6></button>' );
    }
    $( "#usermenu" ).append( '<button type="button" tabindex="0" role="menuitem" class="d-flex gap-3 p-3 pt-2 dropdown-item align-items-center border-bottom" onclick="OpenModify()">'+
                            '<img src="resources/pen.png" alt="profile" class="rounded-circle" width="30"><h6 class="mb-0">變更密碼</h6></button>' );
    $( "#usermenu" ).append( '<button type="button" tabindex="0" role="menuitem" class="d-flex gap-3 p-3 pt-2 dropdown-item align-items-center" onclick="OpenDelete(1)">'+
                            '<h6 class="mb-0">刪除帳號</h6></button>');

}

function showmenu(Obj) {
    //console.log(Obj.parentNode.getElementsByClassName("ddWidth dropdown-menu").item(0));
    var menuflag = new Boolean(false);
    if (!Obj.parentNode.getElementsByClassName("ddWidth dropdown-menu").item(0).classList.contains('show')){
        menuflag = true;
    }
    $(document.getElementsByClassName('ddWidth dropdown-menu')).each(function(){
        if(!$(this).is('show')){
            $(this).removeClass('show');
        }
    })
    if (menuflag == true){
        Obj.parentNode.getElementsByClassName("ddWidth dropdown-menu").item(0).classList.add('show');
    }
    //Obj.parentNode.getElementsByClassName("ddWidth dropdown-menu").item(0).classList.toggle('show');
    
}

$('body').click(function(e){
    clearShowBox(e);
});
function clearShowBox(e){
    $(document.getElementsByClassName('ddWidth dropdown-menu')).each(function(){
        //console.log($(this)[0].previousElementSibling);
        var container = $(this)[0];
        var btn = $(this)[0].previousElementSibling;
        // 判斷點擊的地方不是DIV或按鈕
        if(!$(e.target).closest(container).length && !$(e.target).closest(btn).length){
            $(this).removeClass('show');
        }
            
    })
}

function windowLocation(html, site, id){
    $.get('/status');
}

function hasSpecialStr(str){
    var specialChars= "~·`!！@#$￥%^…&*()（）—-_=+[]{}【】、|\\;:；：'\"“‘,./<>《》?？，。";
    var len=specialChars.length;
    for ( var i = 0; i < len; i++){
        if (str.indexOf(specialChars.substring(i,i+1)) != -1){
            return true;
        }
    }
    return false;
}
function containsNumber(str){
    return !!str.match(/\d/g);
}
function hrefUserManage(){
    window.location.href="user_manage";
}
