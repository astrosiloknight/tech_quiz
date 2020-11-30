
var num = parseInt(state);
var len = exercises.length;
var doing;
var diff;
var prevSelected = {};

console.log('state', state);
console.log('quiz', quizId);

function timer() {
  console.log('timekeeping');
  diff++;
  document.getElementById('timer').innerText = timePrinter(diff);
}

function timeKeeper() {
  let moveStarted = Date.parse(time);
  let now = new Date();
  let locale = now.getTimezoneOffset() * 60 * 1000;
  diff = Math.round((now - moveStarted + locale) / 1000);
  document.getElementById('timer').innerText = timePrinter(diff);
  crazyTime = setInterval(timer, 1000);
}

function makeRuller() {
  var ruller = document.getElementById('ruller')
  for(i=0;i<len;i++){
    let bar = document.createElement('div');
    bar.classList.add("bar");
    bar.id = 'bar' + i.toString();
    if(selected[i]){
      bar.classList.add("done");
    }
    bar.setAttribute("onclick","getQuestion(" + i + ");");
    ruller.append(bar);
  }
}

console.log(exercises);

function display_exercise(){
  if(doing){
    doing.classList.remove("doing");
  }
	document.getElementById('question').innerText = exercises[num][0];
  document.getElementById('tbl').innerHTML = '';
  doing = document.getElementById('bar' + num.toString());
  doing.classList.add("doing");
  var i = 1;
	for (answer of exercises[num][1]){
    let row = document.createElement('tr');
    let ans = document.createElement('td');
    ans.classList.add("ans");
    ans.innerText = answer;
    row.append(ans);
    let checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = i.toString();
    checkBox.setAttribute("onchange","check(" + i + ");");
    let ins = document.createElement('td');
    ins.append(checkBox);
    row.append(ins);
    document.getElementById('tbl').append(row);
     i++;
	}
  if(selected[num]){
    document.getElementById(selected[num]).checked = true;
  }
}

function check(boxChecked) {
  selected[num] = boxChecked;
  document.getElementById('bar' + num.toString()).classList.add("done");
  console.log(selected);
  var boxes = document.querySelectorAll('input[type=checkbox]')
  boxes.forEach(function(box){
    if(box.checked){
      if(box.id != boxChecked){
        box.checked = false;
      }
    }
  })
  if(num == len -1){
    introduceSubmit();
  }
}

function getQuestion(i){
  num = i;
  display_exercise();
}

function next(){
  if(num < len-1){
    num++;
  }
  display_exercise();
  if(prevSelected != selected){
  	fetchPost('/update', {'selected': selected, 'quizId': quizId, 'state': num}).then(function(response){
  		console.log(response);
  	})
    prevSelected = selected;
  }
}

function back(){
  if(num == 0){
    num = len - 1;
  } else{
    num--;
  } 
  display_exercise();
}

function introduceSubmit(){
  //document.getElementById('next').style.right = '14em';
  document.getElementById('next').classList.remove('next');
  document.getElementById('next').classList.add('nextMoved');
  document.getElementById('finish').style.visibility = 'visible';
}

function finish(){
  fetchPost('/submit', {'selected': selected, 'quizId': quizId}).then(function(response){
  		console.log(response);
      if(response.success){
        window.location.href = '/power_ranking';
      }
  })
}

function timePrinter(time) {
  time = Math.round(time);
  let sec = time % 60;
  let allmin = Math.round((time - sec) / 60);
  let min = allmin % 60;
  let hours = Math.round((allmin - min) / 60);
  let smin = min.toString();
  if (smin.length == 1){
    smin = '0' + smin;
  }
  let ssec = sec.toString()
  if (ssec.length == 1){
    ssec = '0' + ssec
  }
  if (hours){
    let shours = hours.toString();
    if (shours.length == 1){
      shours =  '0' + shours;
    }
    return shours + ':' + smin + ':' + ssec;
  } else{
    return smin + ':' + ssec;
  }
}


timeKeeper();
makeRuller();
display_exercise();

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