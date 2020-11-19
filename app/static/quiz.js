

function openName(){
	document.getElementById('getName').style.visibility = 'visible';
}

function closeName(){
	document.getElementById('getName').style.visibility = 'hidden';
}

function startGame(){
	var name = document.getElementById('fullName').value;
	console.log('name', name);
	if(name){
		fetchPost('/quiz', {'name': name}).then(function(response){
			console.log('response', response);
			if(response.quizId){
				window.location.href = '/quiz/' + response.quizId;
			}
		})
	}
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