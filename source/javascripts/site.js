var timerSeconds = 5,
  timer,
  dbRef = firebase.database().ref().child('ready'),
  countingDown = false;

dbRef.once('value')
  .then(function(snapshot){
    dbRef.set(false);
  });

document.getElementById('seconds').innerHTML = timerSeconds;

function Timer(duration, element) {
	var self = this;
	this.duration = duration;
	this.element = element;
	this.running = false;

	this.els = {
		ticker: document.getElementById('ticker'),
		seconds: document.getElementById('seconds'),
	};
}

Timer.prototype.start = function() {
	var self = this;
	var start = null;
	this.running = true;
	var remainingSeconds = this.els.seconds.textContent = this.duration / 1000;
  var boop = document.getElementById("boop");
  boop.play();

  window.setTimeout(function() {
    document.getElementById("beep").play();
    dbRef.set(false);
    countingDown = false;
    timer.reset();
  }, 1000 * timerSeconds);

	function draw(now) {
		if (!start) start = now;
		var diff = now - start;
		var newSeconds = Math.ceil((self.duration - diff)/1000);

		if (diff <= self.duration) {
			self.els.ticker.style.height = 100 - (diff/self.duration*100) + '%';

			if (newSeconds != remainingSeconds) {
				self.els.seconds.textContent = newSeconds;
				remainingSeconds = newSeconds;
        boop.play();
			}

			self.frameReq = window.requestAnimationFrame(draw);
		} else {
			self.els.seconds.textContent = 0;
			self.els.ticker.style.height = '0%';
			self.element.classList.add('countdown--ended');
		}
	};
	self.frameReq = window.requestAnimationFrame(draw);
}

Timer.prototype.reset = function() {
	this.running = false;
	window.cancelAnimationFrame(this.frameReq);
	this.els.seconds.textContent = this.duration / 1000;
	this.els.ticker.style.height = null;
	this.element.classList.remove('countdown--ended');
}

Timer.prototype.setDuration = function(duration) {
	this.duration = duration;
	this.els.seconds.textContent = this.duration / 1000;
}

function newTimer(){
  timer = new Timer(timerSeconds * 1000, document.getElementById('countdown'));
}

newTimer();

document.body.onkeyup = function(e){
  if(e.keyCode == 32){
      dbRef.set(true);
  }
}

setInterval(function() {
  if(countingDown != true) {
    dbRef.once('value')
      .then(function(snapshot) {
        if (snapshot.val() == true) {
          timer.start();
          countingDown = true;
        }
      })
  }
}, 7);
