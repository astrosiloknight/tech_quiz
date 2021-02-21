
var num = parseInt(state);
var len = exercises.length;
var doing;
var sorted = []; 


document.getElementById('timer').innerText = timePrinter(time);

console.log('time', time);


console.log('exercises, time, selected, state', exercises, time, selected, state);

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
  if(document.getElementById('picHold')){
    console.log('Removing');
    document.getElementById('picHold').remove();
  }
	document.getElementById('pickHolder').innerText = ""
  document.getElementById('question').innerText = exercises[num][0];
  document.getElementById('tbl').innerHTML = '';
  doing = document.getElementById('bar' + num.toString());
  doing.classList.add("doing");
  var i = 1;
  var to_iterate = exercises[num][1];
  if(exercises[num][2] == 'match'){
    if(!selected[num]){
      selected[num] = {};
    }
    var matchAnswers = document.createElement('div');
    matchAnswers.id = 'matchAns';

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
    to_iterate = selected[num];
  } 
  for (answer of to_iterate){
    if(exercises[num][2] == 'match'){
      let ans = document.createElement('div');
      let d = document.createElement('div');
      d.classList.add('answerDiv');
      d.id = 'ans' + '-' + answer[2] + ':' + answer[1];
      d.classList.add('answerDiv');
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
    } else{
      let row = document.createElement('tr');
      let ans = document.createElement('td');
      ans.classList.add("ans");
      ans.innerText = answer[0];
      row.append(ans);
      if(exercises[num][2] == 'question'){
        if(answer[1] == 'true'){
          row.classList.add('right');
        } else if(answer[11] == 'false') {
          row.classList.add('wrong');
        }
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = i.toString();
        let checker = document.createElement('span');
        checker.classList.add('checker');
        row.id = 'row-' + checkBox.id;
        let ins = document.createElement('td');
        ins.append(checkBox);
        ins.append(checker);
        row.append(ins);
      } else if(exercises[num][2] == 'positional'){
        if(answer[2] == 'true'){
          row.classList.add('right');
        } else if(answer[2] == 'false') {
          row.classList.add('wrong');
        }
      }
      document.getElementById('tbl').append(row);
      i++;
    } 
	}
  if(exercises[num][2] == 'question'){
    if(selected[num]){
      document.getElementById(selected[num]).checked = true;
      document.getElementById(selected[num]).parentNode.parentNode.classList.add('rowCh');
      document.getElementById(selected[num]).parentNode.parentNode.classList.add('wrong');
    }
  } else if(exercises[num][2] == 'match'){
    document.getElementById('answers').append(matchAnswers);
    for (const [key, value] of Object.entries(selected[num])){
      if(value != 'empty-empty'){
        let valSplit = value.split('-')[1];
        console.log('valSplit', valSplit);
        console.log('key, value', key, value);
        document.getElementById(key).classList.add('answered');
        document.getElementById(value).append(document.getElementById(key));
        if(key == valSplit){
          document.getElementById(key).classList.add('right');
        }
      }
      document.getElementById(key).classList.add('wrong');
    }
  }
}


function next(){
  if(num < len-1){
    num++;
    display_exercise();
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

function getQuestion(i){
  num = i;
  display_exercise();
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

makeRuller();
display_exercise();
