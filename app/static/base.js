
var slideOpen = false;
var emailRe = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

function first(e){
  e.stopImmediatePropagation();
  this.removeEventListener("click", first);
}

function second(e) {
  document.querySelector('.slide').classList.remove('open');
  document.querySelector('.menuHolder').classList.remove("menuHolderOpen");
  e.stopImmediatePropagation();
  this.removeEventListener("click", second);
  slideOpen = false;
}

function openSlide() {
  if(slideOpen){
  	document.querySelector('.slide').classList.remove("open");
    document.querySelector('.menuHolder').classList.remove("menuHolderOpen");
  	slideOpen = false;
  } else {
  	document.querySelector('.slide').classList.add("open");
    document.querySelector('.menuHolder').classList.add("menuHolderOpen");
    document.addEventListener('click', first);
    document.addEventListener('click', second);
    slideOpen = true;
  }
}

function closeSlide() {
  document.querySelector('.slide').classList.remove("open");
  document.querySelector('.menuHolder').classList.remove("menuHolderOpen");
  slideOpen = false;
}

function SignIn() {
  document.getElementById('cover').style.visibility = "visible";
  document.getElementById('manage').style.visibility = "visible";
}

function closeDialog() {
  document.getElementById('cover').style.visibility = "hidden";
  document.getElementById('manage').style.visibility = "hidden";
  document.getElementById('contactPop').style.visibility = 'hidden';
  var toDel = document.querySelectorAll('.startInput');
  var hid = document.querySelectorAll('.hid');
  toDel.forEach(function(inp){
    inp.value = '';
  })
  hid.forEach(function(h){
    h.style.visibility = 'hidden';
  })
  
}

function manage() {
  let pass = document.getElementById('password').value;
  fetchPost('/login', {'password': pass}).then(function(res){
    console.log('response', res);
    if(res.success){
      window.location.href = "/power_ranking";
    } else {
      if(res.passwordMsg){
        document.getElementById('manageError').innerText = res.passwordMsg
      } else {
        document.getElementById('manageError').innerText = 'Server error. Please try again latter. If error persisit please contact us';
      }
    }
  })
}

function logOut() {
  window.location.href = "/logout";
}

function contact() {
  document.getElementById('cover').style.visibility = "visible";
  document.getElementById('contactPop').style.visibility = 'visible';
}

function subContact() {
  let name = document.getElementById('contName').value;
  let subject = document.getElementById('contSubject').value;
  let email = document.getElementById('contEmail').value;
  let msg = document.getElementById('contactArea').value;
  if(! email.match(emailRe)){
    document.getElementById('wrongEmail').style.visibility = 'visible';
  }
  if(! msg){
    document.getElementById('noMsg').style.visibility = 'visible';
  }
  if(email.match(emailRe) && msg){
    let message = {'name': name, 'subject': subject, 'email': email, 'msg': msg}
    fetchPost('/contact', message).then(function(res){
    console.log('response', res);
    if(res.success){
      console.log('success');
    } else {
      console.log('not');
    }
  })
  }

}



function fetchPost(address, message){
  console.log('message', message);
  return fetch(address,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(message)
  }).then(response => response.json()).then(function(response){
    return response;
  }).catch(function(error){
    console.log(error);
  })
}

document.getElementById('contEmail').addEventListener("blur", e => {
  let email = document.getElementById('contEmail').value;
  if(email.match(emailRe)){
    document.getElementById('wrongEmail').style.visibility = 'hidden';
  } else{
    document.getElementById('wrongEmail').style.visibility = 'visible';
    document.getElementById('contEmail').addEventListener('keypress', e => {
      let email = document.getElementById('contEmail').value;
      if(email.match(emailRe)){
        document.getElementById('wrongEmail').style.visibility = 'hidden';
      } else{
        document.getElementById('wrongEmail').style.visibility = 'visible';
      }
    });
  }
});

document.getElementById('contactArea').addEventListener("blur", e => {
  let msg = document.getElementById('contactArea').value;
  
  if(msg){
    document.getElementById('noMsg').style.visibility = 'hidden';
  } else{
    document.getElementById('noMsg').style.visibility = 'visible';
    document.getElementById('contactArea').addEventListener('keypress', e => {
      let msg = document.getElementById('contactArea').value;
      console.log('msg', msg);
      if(msg){
        document.getElementById('noMsg').style.visibility = 'hidden';
      } else{
        document.getElementById('noMsg').style.visibility = 'visible';
      }
    });
  }
});