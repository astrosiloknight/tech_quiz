

var answers = [];
var questionType = document.getElementById('questionType').value;
var question = document.getElementById('question');
var answer = document.getElementById('answer');
var score = document.getElementById('score');


function addAnswer(){
	if(answer.value && score.value) {
		answers.push([answer.value, score.value]);
		console.log(answers);
		let ans = document.createElement('div');
		ans.innerText = answer.value + ' - ' + score.value;
		document.getElementById('answerDisplay').append(ans);
		answer.value = '';
		score.value = '';
	}
}

function submit(){
	var message = {'questionType': questionType, 'question': question.value, 'answers': answers}
	fetchPost('/add_question', message).then(function(response){
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