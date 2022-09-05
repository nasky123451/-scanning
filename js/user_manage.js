$(document).ready(function(){
    updateResultThead();
});

var CountofPage = 10;
var CurrentPage = 1;

var resultData;

function ShowResultDiv(){

    /*$.get('/getAuthList', function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                alert("查無結果!");
                return;
            }
            if (data.indexOf("<!DOCTYPE html>") == 0){
                window.location.href = "welcome";
                
            }

            resultData = data;
            updateResult(data, CurrentPage);
            
            $("#ResultDiv").show();
        }
    });*/
}

function updateResult(data, page){
    $("table[name='result'] tbody").remove();

    // Create result data.
    var rowElements = data.map(function (row, index) {
        if ((CountofPage * (page - 1) <= index) && (index < CountofPage * page)){
            var $tbody = $('<tbody></tobdy>');
            var $rowdata = $('<tr data-toggle="collapse" data-target=".toogle' + index + '"></tr>');

            var $index = $('<td></td>').html(index + 1);
            var nameNode = row.name;
            var $name = $('<td></td>').html(nameNode);
            var usernameNode = row.username;
            var $username = $('<td></td>').html(usernameNode);
            var idNode = row.id;
            var $modify = $('<td><div><a href="javascript:modify_user(' + idNode + ')" download=""><i class="fas fa-pencil-alt"></i></a></div></td>');
            var $delete = $('<td><div><a href="javascript:delete_user(' + idNode + ')" download=""><i class="fas fa-trash"></i></a></div></td>');

            $rowdata.append($name, $username, $modify, $delete);

            $tbody.append($rowdata);
        }
        return $tbody;
    });

    $("table[name='result']").append(rowElements);

    updatePagination(data.length, page);
}
function updateResultThead(){
    // Create header.
    var $rowheader = $('<tr></tr>');
    var $user = $('<th scope="col"></th>').html('<div style="padding: .375rem .75rem;">名稱</div>');
    var $username = $('<th scope="col"></th>').html('<div style="padding: .375rem .75rem;">帳號</div>');
    var $modify = $('<th scope="col"></th>').html('<div style="padding: .375rem .75rem;">修改</div>');
    var $delete = $('<th scope="col"></th>').html('<div style="padding: .375rem .75rem;">刪除</div>');
    //var $delete = $('<th scope="col"></th>').html("刪除");

    $rowheader.append($user, $username, $modify, $delete);
    $("table[name='result'] thead").append($rowheader);

    //updatePagination(0, page);
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
}

function onNextBtn(){
    CurrentPage ++;
    updateResult(resultData, CurrentPage);
}

$("select[name='page']").on('change', function(){    
    CurrentPage = this.value;
    updateResult(resultData, CurrentPage);
});

function modify_user(id){
    //console.log(resultData[index]);

    var searchPara = {id:id};
    /*$.get('/getAuthOnly', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            //console.log(data);
            OpenManageUser(data, id);
        }
    });*/
}

function delete_user(id){
    if (confirm('確定刪除?')) {
        var searchPara = {name:document.getElementById("name").innerHTML, id:id};
        /*$.post('/delete_User', searchPara, function(data, statusText, xhr){
            if (xhr.status == 200){
                ShowResultDiv();
            }
        });*/
    }
}
