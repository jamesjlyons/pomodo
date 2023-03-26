let intervalId;
let pmdrCount = 1;
let minutes;
let seconds;
let sessionType;
let timeoutId;

// Timer configurations
const pomodoro = 25;
const shortBreak = 5;
const longBreak = 30;
const longBreakInterval = 8;

const setInitialTime = () => {
  minutes = pomodoro;
  seconds = 0;
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

  self.postMessage({
    type: 'tick',
    minutes,
    seconds,
    pmdrCount,
    sessionType,
  });
};

self.onmessage = (event) => {
  const { data } = event;
  switch (data.action) {
    case 'init':
      minutes = data.minutes;
      seconds = data.seconds;
      break;
    case 'start':
      minutes = data.minutes;
      seconds = data.seconds;
      intervalId = setInterval(tick, 1000);
      break;
    case 'pause':
      clearInterval(intervalId);
      break;
    case 'reset':
      clearInterval(intervalId);
      resetTimer();
      self.postMessage({ type: 'reset' });
      console.log('reset received'); // Add this line
      break;
    case 'skip':
      clearInterval(intervalId);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

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
      pmdrCount += 1;
      postMessage({
        type: 'tick',
        minutes: minutes,
        seconds: seconds,
        pmdrCount: pmdrCount,
        sessionType: sessionType,
      });

      timeoutId = setTimeout(() => {
        tick(); // Call the tick function immediately
        intervalId = setInterval(tick, 1000);
      }, 1000);
      break;
    case 'add':
      addMinute();
      break;
    case 'subtract':
      subtractMinute();
      break;
  }
};
