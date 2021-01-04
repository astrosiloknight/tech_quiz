
var num = parseInt(state);
var len = exercises.length;
var doing;
var diff;
var sorted = [];
var prevSelected;
var isDraging = false;
var trslen, height; 

function timer() {
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

function display_exercise(){
  sorted = [];
  if(document.getElementById('matchAns')){
    document.getElementById('matchAns').remove();
  }
  if(doing){
    doing.classList.remove("doing");
  }
  if(document.getElementById('picHold')){
    console.log('Removing');
    document.getElementById('picHold').remove();
  }
	document.getElementById('question').innerText = exercises[num][0];
  document.getElementById('tbl').innerHTML = '';
  doing = document.getElementById('bar' + num.toString());
  doing.classList.add("doing");
  var i = 1;
  if(exercises[num][2] == 'match'){
    if(!selected[num]){
      selected[num] = {};
    }
    var matchAnswers = document.createElement('div');
    matchAnswers.id = 'matchAns';
    matchAnswers.ondragover = function(event){
        event.preventDefault();
      };

    matchAnswers.ondrop = function(event){
      event.preventDefault();
      const data = event.dataTransfer.getData("text");
      this.appendChild(document.getElementById(data));
      delete selected[num][data];
      console.log('after getting back', selected[num]);
      document.getElementById(data).classList.remove('answered');
    }
    var picHold = document.createElement('div');
    picHold.id = 'picHold';
    var pic = document.createElement('img');
    pic.classList.add('picture');
    pic.src = exercises[num][3];
    picHold.append(pic);
    document.getElementById('exercise').insertBefore(picHold, document.getElementById('question'));
    let topDiv = document.createElement('div');
    topDiv.id = 'topDiv';
    let botDiv = document.createElement('div');
    botDiv.id = 'botDiv';
    let leftDiv = document.createElement('div');
    leftDiv.id = 'leftDiv';
    let rightDiv = document.createElement('div');
    rightDiv.id = 'rightDiv';
    picHold.append(topDiv, botDiv, rightDiv, leftDiv);
  }
  for (answer of exercises[num][1]){
    if(exercises[num][2] == 'match'){
      let ans = document.createElement('div');
      let d = document.createElement('div');
      d.classList.add('answerDiv');
      d.id = 'ans' + '-' + answer[2] + ':' + answer[1];
      d.classList.add('answerDiv');
      d.ondrop = function(event){
        event.preventDefault();
        const data = event.dataTransfer.getData("text");
        if(this.hasChildNodes()){
          this.firstChild.classList.remove('answered');
          delete selected[num][this.firstChild.id];
          console.log('selected', selected);
          document.getElementById('matchAns').append(this.firstChild);
        }
        this.appendChild(document.getElementById(data));
        selected[num][data] = this.id;
        console.log('selected', selected);
        document.getElementById(data).classList.add('answered');
        this.style.backgroundColor = 'rgba(255, 255, 255)';
        this.style.borderColor = 'rgb(233,42,38)';
        if(!document.getElementById('matchAns').hasChildNodes()){
          document.getElementById('bar' + num.toString()).classList.add("done");
        } else{
          document.getElementById('bar' + num.toString()).classList.remove("done");
        }
      }
      d.ondragover = function(event){
        event.preventDefault();
        this.style.backgroundColor = 'rgb(216, 229, 243)';
        this.style.borderColor = 'rgb(255, 217, 179)';
      };
      d.ondragleave = function(event){
        event.preventDefault();
        this.style.backgroundColor = 'rgba(255, 255, 255)';
        this.style.borderColor = 'rgb(233,42,38)';
      };
      if(answer[2] == 'left'){
        document.getElementById('leftDiv').append(d);
      } else if(answer[2] == 'right'){
        document.getElementById('rightDiv').append(d);
      } else if(answer[2] == 'top'){
        document.getElementById('topDiv').append(d);
      } else if(answer[2] == 'bottom'){
        document.getElementById('botDiv').append(d);
      }
      ans.innerText = answer[0];
      ans.classList.add('matchAn');
      ans.id = answer[2] + ':' + answer[1];
      if(Math.random() < 0.5){
        matchAnswers.append(ans);
      } else {
        matchAnswers.prepend(ans);
      }
      
      ans.setAttribute('draggable', "true");
      ans.ondragstart = function(event){
        console.log('setting id', event.target.id)
        event.dataTransfer.setData("text/plain", event.target.id);
        event.dataTransfer.dropEffect = "move";
      };
    } else{
      let row = document.createElement('tr');
      let ans = document.createElement('td');
      ans.classList.add("ans");
      ans.innerText = answer;
      row.append(ans);
      if(exercises[num][2] == 'question'){
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = i.toString();
        checkBox.setAttribute("onchange","check(" + i + ");");
        let ins = document.createElement('td');
        ins.append(checkBox);
        row.append(ins);
      } else if(exercises[num][2] == 'positional'){
        ans.classList.add('movable');
      }
      document.getElementById('tbl').append(row);
      i++;
    } 
	}
  if(exercises[num][2] == 'question'){
    if(selected[num]){
      document.getElementById(selected[num]).checked = true;
    }
  } else if(exercises[num][2] == 'positional') {
    grab();
  } else{
    document.getElementById('answers').append(matchAnswers);
    for (const [key, value] of Object.entries(selected[num])){
      document.getElementById(key).classList.add('answered');
      document.getElementById(value).append(document.getElementById(key));
    }
  }
  if(num == len -1){
    introduceSubmit();
  }
}

function check(boxChecked) {
  selected[num] = boxChecked;
  document.getElementById('bar' + num.toString()).classList.add("done");
  var boxes = document.querySelectorAll('input[type=checkbox]')
  boxes.forEach(function(box){
    if(box.checked){
      if(box.id != boxChecked){
        box.checked = false;
      }
    }
  })
}

function getQuestion(i){
  if(prevSelected != JSON.stringify(selected)){
  	fetchPost('/update', {'selected': selected, 'quizId': quizId, 'state': num}).then(function(response){
  		console.log(response);
  	})
    prevSelected = JSON.stringify(selected);
  }
  num = i;
  display_exercise();
}

function next(){
  if(num < len-1){
    num++;
  }
  display_exercise();
  if(prevSelected != JSON.stringify(selected)){
  	fetchPost('/update', {'selected': selected, 'quizId': quizId, 'state': num}).then(function(response){
  		console.log(response);
  	})
    prevSelected = JSON.stringify(selected);
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

function sortTrs() {
  var trs = document.querySelectorAll('.ans');
  trslen = trs.length;
  for (i=0;i<trslen;i++){
    trs[i].id = i.toString();
    trs[i].parentElement.id = 'tr' + i.toString();
    sorted.push(trs[i].innerText);
  }
  height = document.getElementById('1').parentElement.scrollHeight + 1;
}

function flip(eid, dir){
  var numeid = parseInt(eid);
  if(dir == 'up'){
    var tosvap = numeid - 1;
    [sorted[numeid], sorted[numeid - 1]] = [sorted[numeid - 1], sorted[numeid]];
  } else if(dir == 'down'){
    var tosvap = numeid + 1;
    [sorted[numeid], sorted[numeid + 1]] = [sorted[numeid + 1], sorted[numeid]];
  }
  document.getElementById('tr' + eid).append(document.getElementById(tosvap.toString()));
  document.getElementById(tosvap.toString()).id = 'temp';
  document.getElementById('tr' + tosvap.toString()).append(document.getElementById(eid));
  document.getElementById(eid).id = tosvap.toString();
  document.getElementById('temp').id = eid;
  return;
}

function boundaries(e){
  if(parseInt(e.target.id) > 0 && (starty - e.pageY) > 0){
    if((starty - e.pageY) >= height){
      flip(e.target.id, 'up');
      starty = e.pageY;
    }
    return true;
  } else if(parseInt(e.target.id) < trslen - 1 && (starty - e.pageY) < 0){
    if(-(starty - e.pageY) >= height){
      flip(e.target.id, 'down');
      starty = e.pageY;
    }
    return true;
  }
  return false;
}

window.addEventListener('mouseup', e => {
	if (isDraging === true) {
		if(onTheMove) {
      onTheMove.style.top = '0px';
      onTheMove.style.position = 'static';
      onTheMove.style.backgroundColor =  "rgb(255, 255, 255, .01)";
		}
    selected[num] = [...sorted];
		isDraging = false;
	}
});

var starty, startx, currentPos;

function grab() {
  var moving = document.querySelectorAll('.movable');
  console.log('moving', moving);
  moving.forEach(function(move) {
    move.addEventListener('mousedown', e => {
      e.preventDefault();
      startx = e.pageX;
      starty = e.pageY;
      isDraging = true;
      onTheMove = e.target;
      onTheMove.style.position = 'relative';
      onTheMove.style.backgroundColor = "rgb(238, 240, 240)";
      onTheMove.style.left = '0px';
      onTheMove.style.top = '0px';
    });
  });
  sortTrs();
  selected[num] = sorted;
  document.getElementById('bar' + num.toString()).classList.add("done");
}

window.addEventListener('mousemove', e => {
	if (isDraging === true) {
		e.preventDefault();
    if(boundaries(e)){
      onTheMove.style.top = (0 - (starty - e.pageY)).toString() + 'px';
    }
	}
});


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