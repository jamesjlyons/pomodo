let intervalId;
let pmdrCount = 1;
let minutes;
let seconds;
let sessionType;
let timeoutId;
let newSession;
let totalPomodoros = 0;

// Timer configurations
const pomodoro = 25;
const shortBreak = 5;
const longBreak = 30;
// const pomodoro = 1;
// const shortBreak = 2;
// const longBreak = 3;
const longBreakInterval = 8;

const setInitialTime = () => {
  minutes = pomodoro;
  // seconds = 0;
  seconds = 5;
};

// 1.	The  pmdrCount  variable is incremented by one.
// 2.	An  if  statement checks if the  pmdrCount  is divisible by 8, and if so, sets the  minutes  variable to 30.
// 3.	A second  if  statement checks if the  pmdrCount  is divisible by 2, and if so, sets the  minutes  variable to 5.
// 4.	Otherwise, the  minutes  variable is set to 25.
// 5.	Finally, the  seconds  variable is set to 0.
const updateTimer = () => {
  pmdrCount++;
  if (pmdrCount % 8 === 0) {
    minutes = longBreak;
  } else if (pmdrCount % 2 === 0) {
    minutes = shortBreak;
  } else {
    minutes = pomodoro;
  }
  seconds = 0;
};

const resetTimer = () => {
  pmdrCount = 1;
  setInitialTime();
};

const skipSession = () => {
  updateTimer();
};

const addMinute = () => {
  minutes++;
};

const subtractMinute = () => {
  if (minutes > 0) {
    minutes--;
  }
};

const tick = () => {
  if (seconds === 0) {
    if (minutes === 0) {
      updateTimer();
    } else {
      minutes--;
      seconds = 59;
      // seconds = 5;
    }
  } else {
    seconds--;
  }

  // let sessionType;
  if (pmdrCount % 8 === 0) {
    sessionType = 'longBreak';
  } else if (pmdrCount % 2 === 0) {
    sessionType = 'shortBreak';
  } else {
    sessionType = 'work';
  }

  const progress =
    ((pomodoro * 60 - (minutes * 60 + seconds)) / (pomodoro * 60)) * 100;

  self.postMessage({
    type: 'tick',
    minutes,
    seconds,
    pmdrCount,
    sessionType,
    progress,
    totalPomodoros,
  });
};

self.onmessage = (event) => {
  const { data } = event;
  switch (data.action) {
    case 'init':
      sessionType = 'work';
      minutes = data.minutes;
      seconds = data.seconds;
      break;
    case 'start':
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      minutes = data.minutes;
      seconds = data.seconds;
      intervalId = setInterval(tick, 1000);
      break;
    case 'pause':
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      break;
    case 'reset':
      clearInterval(intervalId);
      resetTimer();
      self.postMessage({ type: 'reset', newSession: true });

      break;
    case 'skip':
      clearInterval(intervalId);
      clearTimeout(timeoutId);

      if (sessionType === 'work') {
        if ((pmdrCount + 1) % longBreakInterval === 0) {
          sessionType = 'longBreak';
          minutes = longBreak;
        } else {
          sessionType = 'shortBreak';
          minutes = shortBreak;
        }
      } else if (sessionType === 'shortBreak' || sessionType === 'longBreak') {
        sessionType = 'work';
        minutes = pomodoro;
      }
      seconds = 0;

      if (pmdrCount === longBreakInterval) {
        pmdrCount = 1;
        newSession = true;
        totalPomodoros += 1;
      } else {
        pmdrCount += 1;
        newSession = false;
      }

      postMessage({
        type: 'tick',
        minutes: minutes,
        seconds: seconds,
        pmdrCount: pmdrCount,
        sessionType: sessionType,
        newSession: newSession,
        totalPomodoros: totalPomodoros,
      });

      if (data.isRunning) {
        tick();
        intervalId = setInterval(tick, 1000);
      }
      break;

    case 'skipPaused':
      if (sessionType === 'work') {
        if ((pmdrCount + 1) % longBreakInterval === 0) {
          sessionType = 'longBreak';
          minutes = longBreak;
          seconds = 0;
        } else {
          sessionType = 'shortBreak';
          minutes = shortBreak;
          seconds = 0;
        }
      } else if (sessionType === 'shortBreak' || sessionType === 'longBreak') {
        sessionType = 'work';
        minutes = pomodoro;
        seconds = 0;
      }
      if (pmdrCount === 8) {
        pmdrCount = 1;
        newSession = true;
        totalPomodoros += 1;
      } else {
        pmdrCount += 1;
        newSession = false;
      }
      postMessage({
        type: 'tick',
        minutes: minutes,
        seconds: seconds,
        pmdrCount: pmdrCount,
        sessionType: sessionType,
        newSession: newSession,
        totalPomodoros: totalPomodoros,
      });
      break;
    case 'add':
      addMinute();
      break;
    case 'subtract':
      subtractMinute();
      break;
  }
};
