var dbRef = firebase.database().ref().child('ready');
var countingDown = false;
var dbInterval;

var timerSeconds = 5;
var secondsLeft = 0;
var checkInterval = 7;
var secondsElement = document.getElementById('seconds');
secondsElement.innerHTML = timerSeconds;

resetTimer();

document.body.onclick = function(e) {
  startTimer();
}

function boop() {
  document.getElementById('boop').play();
  subtractTime();
}

function beep() {
  document.getElementById('beep').play();
  subtractTime();
  resetTimer();
}

function resetTimer() {
  countingDown = false;
  dbRef.set(false);
  dbInterval = setInterval(function() { checkDb() }, checkInterval);
  secondsElement.innerHTML = timerSeconds;
  secondsLeft = timerSeconds;
}

function startTimer() {
  countingDown = true;
  dbRef.set(true);
  setTimeout(function() { preventStart() }, checkInterval);
  timer();
}

function preventStart() {
  dbRef.set(false);
}

function timer() {
  if (countingDown) {
    document.getElementById('boop').play();
    var countdownInterval = setInterval("boop()", 1000);

    setTimeout(function() {
      clearInterval(countdownInterval);
    }, (timerSeconds - 1) * 1000);

    setTimeout(function() {
      beep();
    }, timerSeconds * 1000);
  }
}

function subtractTime() {
  secondsLeft--;
  secondsElement.innerHTML = secondsLeft;
}

function checkDb() {
  var snapshotValue;
  dbRef.once('value').then(function(snapshot) {
    snapshotValue = snapshot.val();

    if (!countingDown && (snapshotValue == true)) {
      clearInterval(dbInterval);
      startTimer();
    }
  });
}
