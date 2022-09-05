var pwd_length = 12;
function create_overlay(){
    var append_str = '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
                    '<div class="popup">'+
                        '<img src="resources/profile.png" alt="profile" class="rounded-circle" width="60">'+
                        '<h3>新增帳號</h3>'+
                        '<form name="popup_form" id="popup_form">'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="name" id="name" class="popup-form-control" placeholder="使用者名稱">'+
                                    '<span class="input-group-addon"><i class="fas fa-a"></i></span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="number" id="number" class="popup-form-control" placeholder="帳號">'+
                                    '<span class="input-group-addon"><i class="fas fa-user"></i></span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="password" id="password" type="password" class="popup-form-control" placeholder="密碼">'+
                                    '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                                '</div>'+
                                '<span style="color: red; font-size:90%;">密碼須包含:最少'+pwd_length+'碼,數字,英文,特殊符號</span>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="checkpass" id="checkpass" type="password" class="popup-form-control" placeholder="確認密碼">'+
                                    '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<select class="swal2-input" name="permissions" id="permissions">';
    if (document.getElementById("get_value").innerHTML == "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"){
        append_str += '<option value="0">一般使用者</option>' +
                        '<option value="1">管理員</option>';
    }else{
        append_str += '<option value="0">一般使用者</option>';
    }
    append_str += '</select>'+
                '</div>'+
            '</form>'+
            '<span name="resultmessage" style="color: red;"></span>'+
            '<div class="p-3">'+
                '<button class="button btn-style" onclick="popup_add_user()">送出</button>'+
            '</div>'+
                
        '</div>'+
    '</div>';

    $('body').append(append_str);
    ClearPopupEvent();
 
}

function create_Modify(){
    $('body').append(
        '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
            '<div class="popup">'+
                '<h3 class="p-4">如要繼續操作，請先驗證您的身分</h3>'+
                '<form name="popup_form" id="popup_form">'+
                    '<div class="input-group">'+
                        '<div class="input-bind">'+
                            '<input name="password" id="password" type="password" class="popup-form-control" placeholder="輸入您的密碼">'+
                            '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
                '<span name="resultmessage" style="color: red;"></span>'+
                '<div class="p-3">'+
                    '<button type="button" class="btn btn-style" onclick="popup_modify()" id="send_btn">送出</button>'+
                '</div>'+
                    
            '</div>'+
        '</div>'
    );
    ClearPopupEvent();
}

function create_user_check(mode){
    var append_str = '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
                        '<div class="popup">'+
                            '<h3 class="p-4">如要繼續操作，請先驗證您的身分</h3>'+
                            '<form name="popup_form" id="popup_form">'+
                                '<div class="input-group">'+
                                    '<div class="input-bind">'+
                                        '<input name="password" id="password" type="password" class="popup-form-control" placeholder="輸入您的密碼">'+
                                        '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                                    '</div>'+
                                '</div>'+
                            '</form>'+
                            '<span name="resultmessage" style="color: red;"></span>'+
                            '<div class="p-3">';
    if (mode == 1){
        append_str += '<button type="button" class="btn btn-style" onclick="popup_delete()" id="send_btn">送出</button>';
    }
    if (mode == 2){
        append_str += '<button type="button" class="btn btn-style" onclick="popup_message()" id="send_btn">送出</button>';
    }
    append_str +=   '</div>'+
            '</div>'+
        '</div>';

    $('body').append(append_str);
    ClearPopupEvent();
}

function create_Modify_User(exit){
    $('body').append(
        '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
            '<div class="popup">'+
                '<h4 class="pl-4 pt-4" style="text-align:left;">請選用高強度密碼；此外，切勿在其他帳戶中重複使用該密碼。</h4>'+
                '<h4 class="pl-4 pt-3" style="text-align:left;">變更密碼後，您會在裝置上登出帳戶。</h4>'+
                '<form name="popup_form" id="popup_form">'+
                    '<div class="input-group">'+
                        '<div class="input-bind">'+
                            '<input name="password" id="password" type="password" class="popup-form-control" placeholder="新密碼">'+
                            '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                        '</div>'+
                        '<span style="color: red; font-size:90%;">密碼須包含:最少'+pwd_length+'碼,數字,英文,特殊符號</span>'+
                    '</div>'+
                    '<div class="input-group">'+
                        '<div class="input-bind">'+
                            '<input name="checkpass" id="checkpass" type="password" class="popup-form-control" placeholder="確認新密碼">'+
                            '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
                '<span name="resultmessage" style="color: red;"></span>'+
                '<div class="p-3">'+
                    '<button class="button btn-style" onclick="popup_modify_user()">送出</button>'+
                '</div>'+
                    
            '</div>'+
        '</div>'
    );
    if (exit){
        ClearPopupEvent();
    }
    
}

function add_pass(){
    $('body').append(
        '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
            '<div class="popup">'+
                '<img src="resources/essay.png" alt="profile" width="60">'+
                '<h3>新增黑名單</h3>'+
                '<form name="popup_form" id="popup_form">'+
                    '<div class="input-group">'+
                        '<div class="input-bind">'+
                            '<input name="licence" id="licence" class="popup-form-control" placeholder="車牌號碼">'+
                            '<span class="input-group-addon"><i class="fas fa-a"></i></span>'+
                        '</div>'+
                    '</div>'+
                    '<div class="input-group">'+
                        '<select class="swal2-input" name="site" id="site">' +
                            '<option value="0">北門遊客中心停車場</option>' +
                            '<option value="1">七股遊客中心停車場</option>' +
                            '<option value="2">井仔腳南10停車場</option>' +
                        '</select>'+
                    '</div>'+
                '</form>'+
                '<span name="resultmessage" style="color: red;"></span>'+
                '<div class="p-3">'+
                    '<button class="button btn-style" onclick="popup_add_pass()">送出</button>'+
                '</div>'+
                    
            '</div>'+
        '</div>'
    );
    ClearPopupEvent();
}

function create_err_login(count){
    $('body').append(
        '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
            '<div class="popup">'+
                '<div class="d-flex">'+
                    '<img src="resources/warning.png" alt="profile" class="rounded-circle" style="width: 15%;">'+
                    '<h4 class="p-4" style="text-align:center;">使用者密碼輸入錯誤'+count+'次(連續錯誤五次將被鎖定)</h4>'+
                '</div>'+
            '</div>'+
        '</div>'
    );
    ClearPopupEvent();
}

function create_err_login_over(){
    $('body').append(
        '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
            '<div class="popup">'+
                '<div class="d-flex">'+
                    '<img src="resources/cross.png" alt="profile" class="rounded-circle" style="width: 15%;">'+
                    '<h4 class="p-3" style="text-align:center;">基於安全性考量，使用者帳戶已被封鎖，因為有太多登入嘗試及密碼變更嘗試發生。請稍後十五分鐘再次嘗試。</h4>'+
                '</div>'+
            '</div>'+
        '</div>'
    );
}

function create_manage_user(row, id){
    var append_str = '<div class="swal2-container swal2-backdrop-show d-flex align-items-center justify-content-center" id="popup_box">'+
                    '<div class="popup">'+
                        '<img src="resources/profile.png" alt="profile" class="rounded-circle" width="60">'+
                        '<h3>修改帳號</h3>'+
                        '<form name="popup_form" id="popup_form">'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="name" id="name" class="popup-form-control" placeholder="使用者名稱" value="'+row.name+'">'+
                                    '<span class="input-group-addon"><i class="fas fa-a"></i></span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="number" id="number" class="popup-form-control" placeholder="帳號" value="'+row.username+'">'+
                                    '<span class="input-group-addon"><i class="fas fa-user"></i></span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="password" id="password" type="password" class="popup-form-control" placeholder="密碼">'+
                                    '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                                '</div>'+
                                '<span style="color: red; font-size:90%;">密碼須包含:最少'+pwd_length+'碼,數字,英文,特殊符號</span>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<div class="input-bind">'+
                                    '<input name="checkpass" id="checkpass" type="password" class="popup-form-control" placeholder="確認密碼">'+
                                    '<span class="input-group-addon"><i class="fas fa-lock"></i></span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="input-group">'+
                                '<select class="swal2-input" name="permissions" id="permissions">';
    if (document.getElementById("get_value").innerHTML == "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"){
        append_str += '<option value="0">一般使用者</option>' +
                        '<option value="1">管理員</option>';
    }else{
        append_str += '<option value="0">一般使用者</option>';
    }
    append_str += '</select>'+
                '</div>'+
            '</form>'+
            '<span name="resultmessage" style="color: red;"></span>'+
            '<div class="p-3">'+
                '<button class="button btn-style" onclick="popup_manage_modify_user('+id+')">送出</button>'+
            '</div>'+
                
        '</div>'+
    '</div>';

    //$('body').append(append_str);
    ClearPopupEvent();
}

function clearPopupBox(e){
    $(document.getElementsByClassName('popup')).each(function(){
        //console.log($(this)[0].previousElementSibling);
        var container = $(this)[0];
        // 判斷點擊的地方不是DIV或按鈕
        if(!$(e.target).closest(container).length){
            CloseModal();
        }
            
    })
}

function delete_overlay(){
    var div = document.getElementById("popup_box");
    //console.log(div);
    while(div.firstChild) { 
        //console.log(div.firstChild);
        div.removeChild(div.firstChild); 
    } 
    div.remove();
}

async function popup_add_user(){
    var element = document.forms['popup_form'];
    var name = element.elements.name.value;
    var number = element.elements.number.value;
    var password = element.elements.password.value;
    var checkpass = element.elements.checkpass.value;
    var permissions = element.elements.permissions.value;

    if (name == "" || number == "" || password == "" || checkpass == ""){
        document.getElementsByName("resultmessage")[0].innerHTML = "表格未輸入";
        return;
    }
    if(!check_password_message(password, checkpass)){
        return;
    }

    number = btoa(number);
    password = btoa(password);

    /*var hashPwd = hash(password);
    await hashPwd.then((hash_Pwd) => {
        password = hash_Pwd;
        number = btoa(number);
    });*/

    var user = {user:document.getElementById("name").innerHTML, name:name, id:number, password:password, userpermissions:permissions};
    /*$.post('/adduser', user, function(result, statusText, xhr) {
        if (result.status == -1){
            Swal.fire({
                icon: 'warning',
                text: "使用者新增失敗!",
            })
        } else if(result.status == 1){
            CloseModal();
           Swal.fire({
                icon: 'success',
                text: "使用者新增完成",
            }) 
        } else {
            document.getElementsByName("resultmessage")[0].innerHTML = result.message;
        }

        
    });*/

}

async function popup_modify(){
    var element = document.forms['popup_form'];
    var password = element.elements.password.value;

    if (password == ""){
        document.getElementsByName("resultmessage")[0].innerHTML = "表格未輸入";
        return;
    }

    password = btoa(password);

    /*var hashPwd = hash(password);
    await hashPwd.then((hash_Pwd) => {
        password = hash_Pwd;
    });*/

    var user = {username:btoa(document.getElementById("username").innerHTML), password:password};
    /*$.post('/checkpass', user, function(result, statusText, xhr) {
        if (result.status == -1){
            Swal.fire({
                icon: 'warning',
                text: "修改密碼失敗!",
            })
        } else if(result.status == 1){
            delete_overlay();
            create_Modify_User(1);
        } else {
            document.getElementsByName("resultmessage")[0].innerHTML = result.message;
        }

        
    });*/
}

async function popup_modify_user(){
    var element = document.forms['popup_form'];
    var password = element.elements.password.value;
    var checkpass = element.elements.checkpass.value;

    if (password == "" || checkpass == ""){
        document.getElementsByName("resultmessage")[0].innerHTML = "表格未輸入";
        return;
    }
    if(!check_password_message(password, checkpass)){
        return;
    }

    password = btoa(password);

    /*var hashPwd = hash(password);
    await hashPwd.then((hash_Pwd) => {
        password = hash_Pwd;
    });*/

    var user = {name:document.getElementById("name").innerHTML, username:btoa(document.getElementById("username").innerHTML), password:password};
    /*$.post('/modifypass', user, function(result, statusText, xhr) {
        if (result.status == -1){
            Swal.fire({
                icon: 'warning',
                text: "修改密碼失敗!",
            })
        } else if(result.status == 1){
            CloseModal();
            location.href = "/logout"
        } else {
            document.getElementsByName("resultmessage")[0].innerHTML = result.message;
        }

        
    });*/
}

async function popup_manage_modify_user(id){
    var element = document.forms['popup_form'];
    var name = element.elements.name.value;
    var number = element.elements.number.value;
    var password = element.elements.password.value;
    var checkpass = element.elements.checkpass.value;
    var permissions = element.elements.permissions.value;

    if (name == "" || number == "" || password == "" || checkpass == ""){
        document.getElementsByName("resultmessage")[0].innerHTML = "表格未輸入";
        return;
    }
    if(!check_password_message(password, checkpass)){
        return;
    }

    number = btoa(number);
    password = btoa(password);

    /*var hashPwd = hash(password);
    await hashPwd.then((hash_Pwd) => {
        password = hash_Pwd;
        number = btoa(number);
    });*/

    var user = {user:document.getElementById("name").innerHTML, id:id, name:name, username:number, password:password, userpermissions:permissions};
    /*$.post('/modifyAuth', user, function(result, statusText, xhr) {
        if (result.status == -1){
            Swal.fire({
                icon: 'warning',
                text: "使用者修改失敗!",
            })
        } else if(result.status == 1){
            CloseModal();
           Swal.fire({
                icon: 'success',
                text: "使用者修改完成",
            }) 
           ShowResultDiv();
        } else {
            document.getElementsByName("resultmessage")[0].innerHTML = result.message;
        }

        
    });*/
}

async function popup_delete(){
    var element = document.forms['popup_form'];
    var password = element.elements.password.value;

    if (password == ""){
        document.getElementsByName("resultmessage")[0].innerHTML = "表格未輸入";
        return;
    }

    password = btoa(password);

    /*var hashPwd = hash(password);
    await hashPwd.then((hash_Pwd) => {
        password = hash_Pwd;
    });*/

    var user = {name:document.getElementById("name").innerHTML, username:btoa(document.getElementById("username").innerHTML), password:password};
    /*$.post('/checkpass', user, function(result, statusText, xhr) {
        if (result.status == -1){
            Swal.fire({
                icon: 'warning',
                text: "刪除失敗!",
            })
        } else if(result.status == 1){
            delete_overlay();
            create_Delete_User(password);
        } else {
            document.getElementsByName("resultmessage")[0].innerHTML = result.message;
        }

        
    });*/
}

function create_Delete_User(password){
    Swal.fire({
      title: '確認刪除帳號?',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var user = {username:btoa(document.getElementById("username").innerHTML), password:password};
        /*$.post('/deleteUser', user, function(result, statusText, xhr) {
            if (result.status == -1){
                Swal.fire({
                    icon: 'warning',
                    text: "刪除失敗!",
                })
            } else if(result.status == 1){
                location.href = "/logout"
            } else {
                document.getElementsByName("resultmessage")[0].innerHTML = result.message;
            }

            
        });*/
      }
    })
}

function popup_add_pass(){
    var element = document.forms['popup_form'];
    var licence = element.elements.licence.value;
    var site = element.elements.site.value;

    if (licence == "" || site == ""){
        document.getElementsByName("resultmessage")[0].innerHTML = "表格未輸入";
        return;
    }

    var user = {licence:licence, site:site};
    /*$.post('/addpass', user, function(result, statusText, xhr) {
        if (result.status == -1){
            Swal.fire({
                icon: 'warning',
                text: "使用者新增失敗!",
            })
        } else if(result.status == 1){
            CloseModal();
           Swal.fire({
                icon: 'success',
                text: "使用者新增完成",
            }) 
           ClearPassbar(site);
           GetPass(site, "");
        } else {
            document.getElementsByName("resultmessage")[0].innerHTML = result.message;
        }

        
    });*/

}

function popup_message(){
    var element = document.forms['popup_form'];
    var username = element.elements.username.value;

    if (username == ""){
        document.getElementsByName("resultmessage")[0].innerHTML = "表格未輸入";
        return;
    }

    //console.log(username);
    var user = {username:username};
    /*$.post('/forgotpwd', user, function(result, statusText, xhr) {
        if (result.status == -1){
            Swal.fire({
                icon: 'warning',
                text: "傳送訊息失敗!",
            })
        } else if(result.status == 1){
            CloseModal();
           Swal.fire({
                icon: 'success',
                text: "已告知管理員請等待處理",
            }) 
        } else {
            document.getElementsByName("resultmessage")[0].innerHTML = result.message;
        }

        
    });*/
}

function OpenModal() {
    create_overlay();
    close_Scrolling();
}
function OpenModify(){
    create_Modify();
    close_Scrolling();
}
function OpenModifyUser(exit){
    create_Modify_User(exit);
    close_Scrolling();
}
function OpenDelete(mode){
    create_user_check(mode);
    close_Scrolling();
}
function OpenAddUser() {
    add_pass();
    close_Scrolling();
  
}
function OpenErrlogin(count) {
    create_err_login(count);
    close_Scrolling();
}
function OpenErrloginOver(){
    create_err_login_over();
    close_Scrolling();
}
function OpenForgot(mode){
    /*create_user_check(mode);
    close_Scrolling();*/
    Swal.fire({
        text: "請通知系統管理員",
    }) 
}
function OpenManageUser(row, id){
    create_manage_user(row, id);
    close_Scrolling();
}
function CloseModal() {
    delete_overlay();
    open_Scrolling();
}
function disableScrolling(){
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}
function enableScrolling(){
    window.onscroll=function(){};
}

function close_Scrolling(){
    //let element = document.getElementById('overlay');
    document.documentElement.style.overflowY = "hidden";
    document.documentElement.style.overflowX = "hidden";
    disableScrolling();
    //element.style.display = 'block';
}
function open_Scrolling(){
    //let element = document.getElementById('overlay');
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "auto";
    enableScrolling();
    //element.style.display = 'none';
}

function ClearPopupEvent(){
    $('#popup_box').click(function(e){
        clearPopupBox(e);
    });
}

function hash(string) {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  });
}

function check_password_message(password, check_password){
    if (password.length < pwd_length){
        document.getElementsByName("resultmessage")[0].innerHTML = "密碼長度不足";
        return false;
    }
    let pattern = /[a-zA-Z]/;
    if (!hasSpecialStr(password) || !containsNumber(password) || !pattern.test(password)){
       document.getElementsByName("resultmessage")[0].innerHTML = "密碼強度不足";
        return false; 
    }
    if (password != check_password){
        document.getElementsByName("resultmessage")[0].innerHTML = "確認密碼錯誤";
        return false;
    }
    return true;
}