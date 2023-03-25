let intervalId;
let pmdrCount = 1;
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
    }
  } else {
    seconds--;
  }

  self.postMessage({
    type: 'tick',
    minutes,
    seconds,
    pmdrCount,
  });
};

// self.onmessage = (event) => {
//   if (event.data.action === 'start') {
//     minutes = event.data.minutes;
//     seconds = event.data.seconds;
//     intervalId = setInterval(tick, 1000);
//   } else if (event.data === 'pause') {
//     clearInterval(intervalId);
//   } else if (event.data === 'reset') {
//     clearInterval(intervalId);
//     resetTimer();
//   } else if (event.data === 'skip') {
//     skipSession();
//   } else if (event.data === 'add') {
//     addMinute();
//   } else if (event.data === 'subtract') {
//     subtractMinute();
//   }
// };

// self.onmessage = (event) => {
//   if (event.data.action === 'start') {
//     intervalId = setInterval(tick, 1000);
//   } else if (event.data === 'pause') {
//     clearInterval(intervalId);
//   } else if (event.data === 'reset') {
//     clearInterval(intervalId);
//     resetTimer();
//     self.postMessage({ type: 'reset' }); // Send reset message back to the main thread
//   } else if (event.data === 'skip') {
//     skipSession();
//   } else if (event.data === 'add') {
//     addMinute();
//   } else if (event.data === 'subtract') {
//     subtractMinute();
//   }
// };
self.onmessage = (event) => {
  switch (event.data.action) {
    case 'start':
      minutes = event.data.minutes;
      seconds = event.data.seconds;
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
      skipSession();
      break;
    case 'add':
      addMinute();
      break;
    case 'subtract':
      subtractMinute();
      break;
  }
};
