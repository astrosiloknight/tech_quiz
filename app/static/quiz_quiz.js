
var num = 0;

//<input type="checkbox">

console.log(exercises);

function display_exercize(){
	document.getElementById('question').innerText = exercises[num][0];
	for (answer of exercises[num][1]){
		let answerHolder = document.createElement('div');
		let answerCheck = document.createElement('input');
		answerCheck.type = 'checkbox'
		answerHolder.innerText = answer;
		answerHolder.classList.add("ans");
		answerHolder.append(answerCheck);
		document.getElementById('answers').append(answerHolder);
	}
}



display_exercize();