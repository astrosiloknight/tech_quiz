

function startGame(){
	var name = document.getElementById('name').value;
  var surname = document.getElementById('surname').value;
	if(name){
		fetchPost('/quiz', {'name': name + ' ' + surname}).then(function(response){
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