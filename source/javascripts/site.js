// This is where it all goes :)
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

	// var hammerHandler = new Hammer(this.element);
	// hammerHandler.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
	// hammerHandler.on('panup pandown', function(ev) {
	// 	if (!self.running) {
	// 		if (ev.direction === Hammer.DIRECTION_UP && self.duration < 999000) {
	// 			self.setDuration(self.duration + 1000);
	// 		} else if (ev.direction === Hammer.DIRECTION_DOWN && self.duration > 0) {
	// 			self.setDuration(self.duration - 1000);
	// 		}
	// 	}
	// });
  //
	// hammerHandler.on('tap', function() {
	// 	if (self.running) {
	// 		self.reset();
	// 	} else {
	// 		self.start();
	// 	}
	// })
}

Timer.prototype.start = function() {
	var self = this;
	var start = null;
	this.running = true;
	var remainingSeconds = this.els.seconds.textContent = this.duration / 1000;
  var boop = document.getElementById("boop");
  boop.play();

  window.setTimeout(function() {
    console.log("END");
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
			//self.running = false;
			self.els.seconds.textContent = 0;
			self.els.ticker.style.height = '0%';
			self.element.classList.add('countdown--ended');
      // timerEnd();

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

function timerEnd(){
  console.log("END");
  document.getElementById("beep").play();
  dbRef.set(false);
  countingDown = false;
  window.setTimeout(function() {
    timer.reset();
  }, 1000);
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
