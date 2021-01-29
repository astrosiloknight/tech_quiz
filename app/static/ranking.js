console.log('rank id', rankId);

var ranks = document.getElementsByClassName('rankTr');
var i = 0;
Array.from(ranks).forEach(function(rank){
  i++;
  console.log('ranks', rank.childNodes);
  rank.childNodes[1].innerText = i.toString();
})

document.getElementById(rankId).classList.add('fading');