$(document).ready(function(){
    create_sidebar();
    GetPass(0, "");
    GetPass(1, "");
    GetPass(2, "");
});

function create_sidebar(){
    $('#sidebar').append(
        '<ul>'+
            '<li class="submenu">'+
                '<a>北門遊客中心停車場</a>'+
                '<ul>'+
                '</ul>'+
            '</li>'+
            '<li class="submenu">'+
                '<a>七股遊客中心停車場</a>'+
                '<ul>'+
                '</ul>'+
            '</li>'+
            '<li class="submenu">'+
                '<a>井仔腳南10停車場</a>'+
                '<ul>'+
                '</ul>'+
            '</li>'+
        '</ul>'
    );
}

function search_licence(){
    //console.log(document.getElementsByName("licence")[0].value);
    ClearAllPassbar();
    passlicence = document.getElementsByName("passlicence")[0].value;
    GetPass(0, passlicence);
    GetPass(1, passlicence);
    GetPass(2, passlicence);
}

function GetPass(passsite, passlicence){
    var searchPara = {site:passsite, licence:passlicence}
    /*$.post('/getPass', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            //console.log(data);
            CreatePassbar(data, passsite);
            //updateNextBar(data);
        }
    });*/
}

function ClearAllPassbar(){
    for (let i = 0; i < document.getElementsByClassName("submenu").length; i++){
        var div = document.getElementsByClassName("submenu")[i].getElementsByTagName("ul")[0];
        while(div.firstChild) { 
            //console.log(div.firstChild);
            div.removeChild(div.firstChild); 
        } 
    }
    
}

function ClearPassbar(id){
    var div = document.getElementsByClassName("submenu")[id].getElementsByTagName("ul")[0];
    while(div.firstChild) { 
        //console.log(div.firstChild);
        div.removeChild(div.firstChild); 
    } 
    
}

function CreatePassbar(datas, id){
    //console.log(id);
  let i = id;

  datas.map(function (row, index) {
    var li_1=document.createElement("li");
    addA(li_1, row.licence, row.id, row.site);
    document.getElementsByClassName("submenu")[i].getElementsByTagName("ul")[0].appendChild(li_1);
  });
}

function addA(li,text,id,site){
    var div_1=document.createElement("div");
    div_1.setAttribute("class","d-flex align-items-center");
    var div_node = li.appendChild(div_1);
    var span_1=document.createElement("a");
    span_1.setAttribute("class","gap-3 nav-item nav-link pr-4");
    //span_1.innerHTML=text;
    div_node.appendChild(span_1);
    var img_1=document.createElement("img");
    img_1.setAttribute("src","resources/minus.png");
    img_1.setAttribute("alt","profile");
    img_1.setAttribute("width","35");
    img_1.setAttribute("style","position:absolute; right:0;");
    div_node.appendChild(img_1);
    var btn_1=document.createElement("button");
    btn_1.setAttribute("type","button");
    btn_1.setAttribute("class","btn");
    //btn_1.setAttribute("onclick","delPass("+id+","+site+")");
    btn_1.setAttribute("style","position:absolute; right:0;");
    div_node.appendChild(btn_1);
}

function delPass(id,site){
    var searchPara = {id:id}
    /*$.post('/delPass', searchPara, function(data, statusText, xhr){
        if (xhr.status == 200){
            if (!data){
                //alert("查無結果!");
                return;
            }
            ClearPassbar(site);
            GetPass(site, "");
        }
    });*/
}

$(function () {
    $('.submenu>a').click(
        function (e) {
            e.preventDefault();//阻止点击a的默认动作
            $(this).parents('li')[0].classList.toggle('open')
        }
    )
})