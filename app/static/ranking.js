var commenting, commentingFromView, deleting;

var ranks = document.getElementsByClassName('rankTr');
var i = 0;
Array.from(ranks).forEach(function(rank){
  i++;
  console.log('ranks', rank.childNodes);
  rank.childNodes[1].innerText = i.toString();
})


if(rankId){
	document.getElementById(rankId).classList.add('fading');
}

function view(inp){
	console.log('this', inp.parentNode.parentNode.id);
	window.location.href = "/view/" + inp.parentNode.parentNode.id;
}

function comment(inp){
  commenting = inp.parentNode.parentNode.id;
  document.getElementById('cover').style.visibility = "visible";
	document.getElementById('commentPop').style.visibility = 'visible';
  document.getElementById('commAr').focus();
}

function subComm(){
  var val = document.getElementById('commAr').value;
  var name = document.getElementById('commName').value || 'Anonymous';
  console.log(val);
  fetchPost('/comment', {'quizId': commenting, 'comment': val, 'name': name}).then(function(response){
    console.log('response', response);
    document.getElementById('success').style.visibility = 'visible';
    location.reload();
  })
}

function del(toDel){
  deleting = toDel.parentNode.parentNode.id;
  document.getElementById('delPop').style.visibility = "visible";
}

function proceed(){
  fetchPost('/del', {'quizId': deleting}).then(function(response){
    console.log('response', response);
    location.reload();
  })
}

function closeComm() {
  document.getElementById('cover').style.visibility = "hidden";
  document.getElementById('commentPop').style.visibility = "hidden";
  document.getElementById('delPop').style.visibility = "hidden";
  document.getElementById('commAr').value = '';
  document.getElementById('commName').value = '';
}


function addMouseOver() {
  var comments = document.querySelectorAll('.comment');
  comments.forEach(function(comment) {
    comment.addEventListener("mouseenter", e => {
      event.target.classList.add('visible');
      event.target.addEventListener('mouseleave', e => {
        event.target.classList.remove('visible');
      })
    })
  })
}

function openComm(what) {
  console.log('what', what.parentNode.parentNode.id);
  commentingFromView = what;
  document.getElementById('cover').style.visibility = "visible";
  document.getElementById('viewComm').style.visibility = 'visible';
  document.getElementById('commHolder').innerHTML = what.innerHTML;
}

function closeViewComm() {
  document.getElementById('viewComm').style.visibility = 'hidden';
  document.getElementById('cover').style.visibility = "hidden";
}

function addComm() {
  document.getElementById('viewComm').style.visibility = 'hidden';
  comment(commentingFromView);
}

function fetchPost(address, message){
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

addMouseOver();