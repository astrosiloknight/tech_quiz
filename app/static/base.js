
var slideOpen = false;

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
}

function manage() {
  let pass = document.getElementById('password').value;
  fetchPost('/login', {'password': pass}).then(function(res){
    console.log('response', res);
    if(res.success){
      window.location.href = "/power_ranking";
    }
  })
}

function logOut() {
  window.location.href = "/logout";
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