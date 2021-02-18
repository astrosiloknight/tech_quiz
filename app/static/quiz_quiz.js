
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
  document.getElementById('answers').classList.remove('nontouch');
  if(num < len - 1){
    document.getElementById('next').style.display = 'inline-block';
    document.getElementById('finish').style.visibility = 'hidden';
  } else {
    document.getElementById('next').style.display = 'none';
    document.getElementById('finish').style.visibility = 'visible';
  }
  if(num > 0){
    document.getElementById('exBack').style.visibility = 'visible';
  } else {
    document.getElementById('exBack').style.visibility = 'hidden';
  }
  if(document.getElementById('matchAns')){
    document.getElementById('matchAns').remove();
  }
  if(doing){
    doing.classList.remove("doing");
  }
  document.getElementById('pickHolder').innerText = ""
	document.getElementById('question').innerText = exercises[num][0];
  document.getElementById('tbl').innerHTML = '';
  doing = document.getElementById('bar' + num.toString());
  doing.classList.add("doing");
  var i = 1;
  if(exercises[num][2] == 'match'){
    document.getElementById('answers').classList.add('nontouch');
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
      selected[num][data] = 'empty';
      console.log('after getting back', selected[num]);
      document.getElementById(data).classList.remove('answered');
    }
    var picHold = document.getElementById('pickHolder');
    console.log('picHold', picHold);
    var pic = document.createElement('img');
    pic.classList.add('pict');
    pic.src = exercises[num][3];
    let topDiv = document.createElement('div');
    topDiv.id = 'topDiv';
    let botDiv = document.createElement('div');
    botDiv.id = 'botDiv';
    let leftDiv = document.createElement('div');
    leftDiv.id = 'leftDiv';
    let rightDiv = document.createElement('div');
    rightDiv.id = 'rightDiv';
    picHold.append(topDiv, leftDiv);
    picHold.append(pic);
    picHold.append(botDiv, rightDiv);
  }  else if(exercises[num][2] == 'positional' && selected[num]){
    console.log('bingo');
    exercises[num][1] = selected[num];
    document.getElementById('answers').classList.add('nontouch');
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
          console.log('selected', selected);
          document.getElementById('matchAns').append(this.firstChild);
        }
        this.appendChild(document.getElementById(data));
        selected[num][data] = this.id;
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
        document.getElementById('pickHolder').classList.remove('pickTurn');
        document.getElementById('topDiv').classList.remove('divTurn');
        document.getElementById('botDiv').classList.remove('divTurn');
        document.getElementsByClassName("pict")[0].classList.remove('pictureTurn');
        
      } else if(answer[2] == 'right'){
        document.getElementById('rightDiv').append(d);
      } else if(answer[2] == 'top'){
        document.getElementById('topDiv').append(d);
        document.getElementById('pickHolder').classList.add('pickTurn');
        document.getElementById('topDiv').classList.add('divTurn');
        document.getElementById('botDiv').classList.add('divTurn');
        document.getElementsByClassName("pict")[0].classList.add('pictureTurn');
        d.classList.add('answerTurn');
      } else if(answer[2] == 'bottom'){
        document.getElementById('botDiv').append(d);
        d.classList.add('answerTurn');
      }
      ans.innerText = answer[0];
      ans.classList.add('matchAn');
      ans.id = answer[2] + ':' + answer[1];
      if(!selected[num][ans.id]){
        selected[num][ans.id] = 'empty-empty';
      }
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
      ans.innerText = answer[0];
      row.append(ans);
      if(exercises[num][2] == 'question'){
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = i.toString();
        let checker = document.createElement('span');
        checker.classList.add('checker');
        row.id = 'row-' + checkBox.id;
        row.addEventListener("click", function(e) {
          let look = this.id.split('-')[1];
          if(document.getElementById(look).checked){
            //document.getElementById(look).checked = false;
            check(look);
          } else{
            //document.getElementById(look).checked = true;
            check(look);
          }
        });
        checkBox.setAttribute("onchange","check(" + i + ");");
        let ins = document.createElement('td');
        ins.append(checkBox);
        ins.append(checker);
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
      check(selected[num]);
    }
  } else if(exercises[num][2] == 'positional') {
    grab();
  } else{
    document.getElementById('answers').append(matchAnswers);
    for (const [key, value] of Object.entries(selected[num])){
      if(value != 'empty-empty'){
        console.log('key, value', key, value);
        document.getElementById(key).classList.add('answered');
        document.getElementById(value).append(document.getElementById(key));
      }
    }
  }
}

function check(boxChecked) {
  console.log('checked', boxChecked);
  selected[num] = boxChecked;
  document.getElementById('bar' + num.toString()).classList.add("done");
  var boxes = document.querySelectorAll('input[type=checkbox]')
  boxes.forEach(function(box){
    if(box.checked){
      if(box.id != boxChecked){
        box.checked = false;
        document.getElementById('row-' + box.id).classList.remove('rowCh');
      }
    } else if(box.id == boxChecked){
      console.log('checking');
      box.checked = true;
      document.getElementById('row-' + box.id).classList.add('rowCh');
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
    display_exercise();
    if(prevSelected != JSON.stringify(selected)){
      fetchPost('/update', {'selected': selected, 'quizId': quizId, 'state': num}).then(function(response){
        console.log(response);
      })
      prevSelected = JSON.stringify(selected);
    }
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

function finish(){
  fetchPost('/submit', {'selected': selected, 'quizId': quizId}).then(function(response){
    console.log(response);
    if(response.success){
      window.location.href = '/power_ranking/' + quizId;
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
    trs[i].parentElement.id = 'tr-' + i.toString();
    sorted.push([trs[i].innerText, (i+1).toString()]);
  }
  height = document.getElementById('1').parentElement.scrollHeight;
}

function flip(eid, dir){
  var numeid = parseInt(eid);
  if(dir == 'up'){
    var tosvap = 'tr-' + (numeid - 1);
    [sorted[numeid][0], sorted[numeid - 1][0]] = [sorted[numeid - 1][0], sorted[numeid][0]];
  } else if(dir == 'down'){
    var tosvap = 'tr-' + (numeid + 1);
    [sorted[numeid][0], sorted[numeid + 1][0]] = [sorted[numeid + 1][0], sorted[numeid][0]];
  }
  console.log('sorted', sorted);
  document.getElementById('tr-' + eid).append(document.getElementById(tosvap).firstChild);
  console.log('tr- + eid', document.getElementById('tr-' + eid));
  document.getElementById(tosvap).append(document.getElementById('tr-' + eid).firstChild);
  return;
}

function boundaries(e){
  if(parseInt(onTheMove.parentNode.id.split('-')[1]) > 0 && (starty - e.pageY) > 0){
    if((starty - e.pageY) >= height){
      flip(onTheMove.parentNode.id.split('-')[1], 'up');
      starty = e.pageY;
    }
    return true;
  } else if(parseInt(onTheMove.parentNode.id.split('-')[1]) < trslen - 1 && (starty - e.pageY) < 0){
    if(-(starty - e.pageY) >= height){
      flip(onTheMove.parentNode.id.split('-')[1], 'down');
      starty = e.pageY;
    }
    return true;
  }
  return false;
}

function touchBoundaries(e){
  if(parseInt(onTheMove.parentNode.id.split('-')[1]) > 0 && (starty - e.touches[0].clientY) > 0){
    if((starty - e.touches[0].clientY) >= height){
      flip(onTheMove.parentNode.id.split('-')[1], 'up');
      starty = e.touches[0].clientY;
    }
    return true;
  } else if(parseInt(onTheMove.parentNode.id.split('-')[1]) < trslen - 1 && (starty - e.touches[0].clientY) < 0){
    if(-(starty - e.touches[0].clientY) >= height){
      flip(onTheMove.parentNode.id.split('-')[1], 'down');
      starty = e.touches[0].clientY;
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
      onTheMove.style.color =  "black";
      onTheMove.style.backgroundColor = 'rgb(255, 255, 255)';
		}
    selected[num] = [...sorted];
		isDraging = false;
	}
});

window.addEventListener('touchend', e => {
  //e.preventDefault();
  if (isDraging === true) {
    console.log('touchend');
    if(onTheMove) {
      onTheMove.style.top = '0px';
      onTheMove.style.position = 'static';
      onTheMove.style.color =  "black";
      onTheMove.style.backgroundColor = 'rgb(255, 255, 255)';
    }
    selected[num] = [...sorted];
    isDraging = false;
  }
});

var starty, startx, currentPos;

function grab() {
  var moving = document.querySelectorAll('.movable');
  moving.forEach(function(move) {
    move.addEventListener('mousedown', e => {
      console.log('grbed', e);
      e.preventDefault();
      startx = e.pageX;
      starty = e.pageY;
      isDraging = true;
      onTheMove = e.target;
      onTheMove.style.position = 'relative';
      onTheMove.style.color = "#22b573";
      onTheMove.style.left = '0px';
      onTheMove.style.top = '0px';
      onTheMove.style.backgroundColor = 'rgb(199, 201, 200)';
    });
  });
  moving.forEach(function(move) {
    move.addEventListener('touchstart', e => {
      console.log('touchstart', e);
      e.preventDefault();
      startx = e.touches[0].clientx;
      starty = e.touches[0].clientY;
      console.log('touchstart', startx, starty);
      isDraging = true;
      onTheMove = e.target;
      onTheMove.style.position = 'relative';
      onTheMove.style.color = "#22b573";
      onTheMove.style.left = '0px';
      onTheMove.style.top = '0px';
      onTheMove.style.backgroundColor = 'rgb(199, 201, 200)';
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

window.addEventListener('touchmove', e => {
  if (isDraging === true) {
    e.preventDefault();
    if(touchBoundaries(e)){
      onTheMove.style.top = (0 - (starty - e.touches[0].clientY)).toString() + 'px';
      console.log(sorted, 'sorted');
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
    },
    body: JSON.stringify(message)
  }).then(response => response.json()).then(function(response){
    return response;
  }).catch(function(error){
  	console.log(error);
  })
}