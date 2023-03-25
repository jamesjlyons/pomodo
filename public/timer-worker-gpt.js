let timerInterval;
let pomodoroDuration;
let breakDuration;
let workSessionCount;

self.onmessage = function (e) {
  const data = e.data;
  switch (data.type) {
    case 'start':
      startTimer(data.pomodoroDuration, data.breakDuration);
      break;
    case 'stop':
      stopTimer();
      break;
    default:
      self.postMessage('Invalid message');
  }
};

function startTimer(pomodoroDuration, breakDuration) {
  workSessionCount = 0;
  timerInterval = setInterval(function () {
    if (pomodoroDuration > 0) {
      pomodoroDuration -= 1000;
      self.postMessage({
        type: 'timerUpdate',
        pomodoroDuration: pomodoroDuration,
        breakDuration: breakDuration,
      });
    } else if (breakDuration > 0) {
      breakDuration -= 1000;
      self.postMessage({
        type: 'timerUpdate',
        pomodoroDuration: pomodoroDuration,
        breakDuration: breakDuration,
      });
    } else {
      workSessionCount++;
      if (workSessionCount === 4) {
        pomodoroDuration = 30 * 60 * 1000;
        breakDuration = 0;
      } else {
        pomodoroDuration = 25 * 60 * 1000;
        breakDuration = 5 * 60 * 1000;
      }
      self.postMessage({
        type: 'sessionComplete',
        pomodoroDuration: pomodoroDuration,
        breakDuration: breakDuration,
      });
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
