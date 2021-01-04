

var answers = [];


function addAnswer(){
  if(document.getElementById('answer').value && document.getElementById('score').value) {
  	console.log('score value', document.getElementById('score').value);
    if(document.getElementById('questionType').value == 'match'){
      answers.push([document.getElementById('answer').value, document.getElementById('score').value, document.getElementById('newSel').value]);
    } else{
      answers.push([document.getElementById('answer').value, document.getElementById('score').value]);
    }
    console.log(answers);
    let ans = document.createElement('div');
    if(document.getElementById('questionType').value == 'match'){
      ans.innerText = document.getElementById('answer').value + ' - ' + document.getElementById('newSel').value + ' - ' + document.getElementById('score').value;
    } else{
      ans.innerText = document.getElementById('answer').value + ' - ' + document.getElementById('score').value;
    }
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
	if(document.getElementById('questionType').value == 'match'){
		var message = {'questionType': document.getElementById('questionType').value, 
		'question': document.getElementById('question').value, 'url': document.getElementById('picUrl').value, 'answers': answers}
	} else{
		var message = {'questionType': document.getElementById('questionType').value, 
		'question': document.getElementById('question').value, 'answers': answers}
	}
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
  if(document.getElementById('newSel')){
    document.getElementById('newSel').remove();
  }
  document.getElementById('pictureUrl').style.visibility = 'hidden';
  if(document.getElementById('questionType').value == 'positional'){
  	document.getElementById('scoreLabel').innerText = 'Answer Position';
  	newIn = document.createElement('input');
  	newIn.id = 'score';
  } else if(document.getElementById('questionType').value == 'match'){
		document.getElementById('scoreLabel').innerText = 'Answer Location';
  	newIn = document.createElement('input');
  	newIn.id = 'score';
    newSel = document.createElement('select');
    newSel.id = 'newSel';
    left = document.createElement('option');
    left.innerText = 'left';
    left.value = 'left';
    right = document.createElement('option');
    right.innerText = 'right';
    right.value = 'right';
    to = document.createElement('option');
    to.innerText = 'top';
    to.value = 'top';
    bottom = document.createElement('option');
    bottom.innerText = 'bottom';
    bottom.value = 'bottom';
    newSel.append(left);
    newSel.append(right);
    newSel.append(top);
    newSel.append(bottom);
  	document.getElementById('pictureUrl').style.visibility = 'visible';
    document.getElementById('idea').insertBefore(newSel, document.getElementById('addButton'));
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