

var answers = [];

console.log('element', document.getElementById('addButton'));


function addAnswer(){
  if(document.getElementById('answer').value && document.getElementById('score').value) {
  	console.log('score value', document.getElementById('score').value);
    answers.push([document.getElementById('answer').value, document.getElementById('score').value]);
    console.log(answers);
    let ans = document.createElement('div');
    ans.innerText = document.getElementById('answer').value + ' - ' + document.getElementById('score').value;
    document.getElementById('answerDisplay').append(ans);
    document.getElementById('answer').value = '';
    document.getElementById('score').value = '';
  }
}

function success() {
  console.log('success');
  document.getElementById('success').style.visibility = 'hidden';
}

function submit(){
	var message = {'questionType': document.getElementById('questionType').value, 
	'question': document.getElementById('question').value, 'answers': answers}
	fetchPost('/add_question', message).then(function(response){
    if(response.success){
      document.getElementById('question').value = '';
      document.getElementById('answerDisplay').innerHTML = '';
      document.getElementById('success').style.visibility = 'visible';
      setTimeout(success, 2000);
    }
		console.log(response);
	})
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

function changeType(){
	document.getElementById('answerDisplay').innerText = '';
  document.getElementById('score').remove();
  if(document.getElementById('questionType').value == 'positional'){
  	document.getElementById('scoreLabel').innerText = 'Answer Position';
  	newIn = document.createElement('input');
  	newIn.id = 'score';
  } else if(document.getElementById('questionType').value == 'question'){
		document.getElementById('scoreLabel').innerText = 'Correct Answer?';
  	newIn = document.createElement('select');
  	newIn.id = 'score';
  	opOne = document.createElement('option');
  	opOne.value = 'true';
  	opOne.innerText = 'True';
  	newIn.append(opOne);
  	opTwo = document.createElement('option');
  	opTwo.value = 'false';
  	opTwo.innerText = 'False';
  	newIn.append(opTwo);
	}
  document.getElementById('idea').insertBefore(newIn, document.getElementById('addButton'));
}