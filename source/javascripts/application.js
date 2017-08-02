window.Timer = {};

Timer.countdown = {
  count: function(countingDown) {
    if (countingDown) {
      Timer.sounds.boopOnce();
      var countdownInterval = setInterval(Timer.sounds.boop, 1000);

      setTimeout(function() {
        clearInterval(countdownInterval);
      }, (Timer.TIMER_TOTAL_SECONDS - 1) * 1000);

      setTimeout(Timer.sounds.beep, Timer.TIMER_TOTAL_SECONDS * 1000);
    }
  },
  preventStart: function () {
    Timer.DATABASE_REF.set(false);
  },
  start: function () {
    if (!Timer.countingDown) {
      Timer.countingDown = true;
      Timer.DATABASE_REF.set(true);

      setTimeout(function() {
        Timer.countdown.preventStart();
      }, Timer.DATABASE_CHECK_INTERVAL);

      Timer.countdown.count(Timer.countingDown);
    }
  },
};

Timer.database = {
  checkDB: function(countingDown) {
    var snapshotValue;
    Timer.DATABASE_REF.once('value').then(function(snapshot) {
      snapshotValue = snapshot.val();

      if (!countingDown && (snapshotValue == true)) {
        clearInterval(Timer.dbCheck);
        Timer.countdown.start();
      }
    });
  },
};

Timer.init = {
  initializeTimer: function() {
    Timer.DATABASE_CHECK_INTERVAL = 7;
    Timer.TIMER_TOTAL_SECONDS = 5;
    Timer.COUNTDOWN_ELEMENT = document.getElementById('seconds');
    Timer.COUNTDOWN_ELEMENT.innerHTML = Timer.TIMER_TOTAL_SECONDS;
    Timer.DATABASE_REF = firebase.database().ref().child('ready');

    Timer.countingDown = false;

    Timer.dbCheck = 0;
    Timer.secondsLeft = 0;

    Timer.util.resetTimer();
    document.getElementById('countdown').onclick = function() {
      Timer.countdown.start();
    };
  },
};

Timer.sounds = {
  beep: function() {
    document.getElementById('beep').play();
    Timer.time.subtractTime();
    Timer.util.resetTimer();
  },
  boop: function() {
    document.getElementById('boop').play();
    Timer.time.subtractTime();
  },
  boopOnce: function() {
    document.getElementById('boop').play();
  },
};

Timer.time = {
  subtractTime: function() {
    var secondsLeft = Timer.COUNTDOWN_ELEMENT.innerHTML;
    secondsLeft--;
    Timer.COUNTDOWN_ELEMENT.innerHTML = secondsLeft;
  }
};

Timer.util = {
  resetTimer: function() {
    Timer.countingDown = false;
    Timer.DATABASE_REF.set(false);
    Timer.dbCheck = setInterval(function() { Timer.database.checkDB(); }, Timer.DATABASE_CHECK_INTERVAL);
    Timer.COUNTDOWN_ELEMENT.innerHTML = Timer.TIMER_TOTAL_SECONDS;
    Timer.secondsLeft = Timer.TIMER_TOTAL_SECONDS;
  },
};

Timer.init.initializeTimer();
