$(document).ready(function(){
    counter = document.getElementById('input_value').innerHTML;
    if (Math.ceil(counter) >= 5){
        OpenErrloginOver();
    } else if (Math.ceil(counter) != 0){
        OpenErrlogin(counter);
    }
});

async function userlogin(){
    var element = document.forms['welcome'];
    const username = document.getElementsByName("username")[0].value;
    const PD = document.getElementsByName("PD")[0].value;

    element.elements.hash_PD.value = btoa(PD);
    element.elements.hash_username.value = btoa(username);
    document.getElementById("welcome").submit();
}

