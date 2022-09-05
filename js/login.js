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
    /*var hashPwd = hash(password);
    await hashPwd.then((hash_Pwd) => {
        element.elements.password.value = hash_Pwd;
        element.elements.username.value = btoa(username);
    });*/
    document.getElementById("welcome").submit();
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
