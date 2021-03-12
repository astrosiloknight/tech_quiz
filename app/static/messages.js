

function replied(item) {
	console.log('replied this', item.parentNode.id);
	fetchPost('/replied', {'msgId': item.parentNode.id}).then(function(response){
    console.log('response', response);
    location.reload();
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