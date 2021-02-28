var commenting;

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
	console.log('this', inp.parentNode.parentNode.id);
  commenting = inp.parentNode.parentNode.id;
  document.getElementById('cover').style.visibility = "visible";
	document.getElementById('commentPop').style.visibility = 'visible';
}

function subComm(){
  var val = document.getElementById('commentArea').value;
  var name = document.getElementById('commName').value;
  console.log(val);
  fetchPost('/comment', {'quizId': commenting, 'comment': val}).then(function(response){
    console.log('response', response);
    // if(response.quizId){
    //   window.location.href = '/quiz/' + response.quizId;
    // }
  })
}

function closeComm() {
  document.getElementById('cover').style.visibility = "hidden";
  document.getElementById('commentPop').style.visibility = "hidden";
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