let intervalId;
let pmdrCount = 0;
let minutes;
let seconds;

const setInitialTime = () => {
  minutes = 25;
  seconds = 0;
};

setInitialTime();

// 1.	The  pmdrCount  variable is incremented by one.
// 2.	An  if  statement checks if the  pmdrCount  is divisible by 8, and if so, sets the  minutes  variable to 30.
// 3.	A second  if  statement checks if the  pmdrCount  is divisible by 2, and if so, sets the  minutes  variable to 5.
// 4.	Otherwise, the  minutes  variable is set to 25.
// 5.	Finally, the  seconds  variable is set to 0.
const updateTimer = () => {
  pmdrCount++;
  if (pmdrCount % 8 === 0) {
    minutes = 30;
  } else if (pmdrCount % 2 === 0) {
    minutes = 5;
  } else {
    minutes = 25;
  }
  seconds = 0;
};

const tick = () => {
  if (seconds === 0) {
    if (minutes === 0) {
      updateTimer();
    } else {
      minutes--;
      seconds = 59;
    }
  } else {
    seconds--;
  }

  self.postMessage({
    type: 'tick',
    minutes,
    seconds,
  });
};

self.onmessage = (event) => {
  if (event.data === 'start') {
    intervalId = setInterval(tick, 1000);
  } else if (event.data === 'pause') {
    clearInterval(intervalId);
  }
};
