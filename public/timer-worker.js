// class PomodoroTimer {
//   constructor() {
//     this.timerId = null;
//     // this.sessionDuration = 25 * 60; // Work session duration in seconds
//     // this.breakDuration = 5 * 60; // Break session duration in seconds
//     // this.isRunning = false; // Flag to keep track of the timer's running state
//     // this.sessionCount = 0; // Keeps track of the number of work sessions completed
//     this.sessionDuration = 1 * 60; // Work session duration in seconds
//     this.breakDuration = 0.5 * 60; // Break session duration in seconds
//     this.isRunning = false; // Flag to keep track of the timer's running state
//     this.sessionCount = 0; // Keeps track of the number of work sessions completed
//   }

//   badIntervalClear() {
//     // Set a fake timeout to get the highest timeout id, find a better way to do this
//     let highestTimeoutId = setTimeout(';');
//     for (var i = 0; i < highestTimeoutId; i++) {
//       clearTimeout(i);
//     }
//   }

//   startTimer() {
//     if (this.isRunning) {
//       return;
//     }
//     this.isRunning = true;
//     self.postMessage('started web worker timer');
//     this.timerId = setInterval(() => {
//       this.sessionDuration--;
//       if (this.sessionDuration === 0) {
//         this.sessionCount++;
//         if (this.sessionCount === 4) {
//           this.breakDuration = 30 * 60;
//         }
//         this.sendPostMessage({
//           session: 'break',
//           duration: this.breakDuration,
//           minutes: Math.floor(this.breakDuration / 60),
//           seconds: this.breakDuration % 60,
//         });
//         this.sessionDuration = 25 * 60;
//         this.breakDuration = 5 * 60;
//       } else {
//         this.sendPostMessage({
//           session: 'work',
//           duration: this.sessionDuration,
//           minutes: Math.floor(this.sessionDuration / 60),
//           seconds: this.sessionDuration % 60,
//         });
//       }
//     }, 1000); // 1000 milliseconds = 1 second
//   }

//   pauseTimer() {
//     if (!this.isRunning) {
//       return;
//     }
//     clearInterval(this.timerId);
//     badIntervalClear();
//     this.isRunning = false;
//     this.remainingDuration = this.sessionDuration;
//     self.postMessage('started web worker timer');
//   }

//   resetTimer() {
//     clearInterval(this.timerId);
//     this.sessionDuration = 25;
//     this.breakDuration = 5;
//     this.isRunning = false;
//     this.sessionCount = 0;
//   }

//   sendPostMessage(data) {
//     postMessage(data);
//   }
// }

// const pomodoro = new PomodoroTimer();

// self.addEventListener('message', (event) => {
//   switch (event.data.action) {
//     case 'start':
//       // self.postMessage('started web worker timer');
//       pomodoro.startTimer();
//       break;
//     case 'pause':
//       pomodoro.pauseTimer();
//       break;
//     case 'reset':
//       pomodoro.resetTimer();
//       break;
//     default:
//       break;
//   }
// });

// create a timer object
let timer = {
  timerId: null,
  // this.sessionDuration : 25 * 60, // Work session duration in seconds
  // this.breakDuration : 5 * 60, // Break session duration in seconds
  // this.isRunning : false, // Flag to keep track of the timer's running state
  // this.sessionCount : 0, // Keeps track of the number of work sessions completed
  sessionDuration: 1 * 60, // Work session duration in seconds
  breakDuration: 0.5 * 60, // Break session duration in seconds
  isRunning: false, // Flag to keep track of the timer's running state
  sessionCount: 0, // Keeps track of the number of work sessions completed
};

function badIntervalClear() {
  // Set a fake timeout to get the highest timeout id, find a better way to do this
  let highestTimeoutId = setTimeout(';');
  for (var i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
}

function startTimer() {
  if (timer.isRunning) {
    return;
  }
  timer.isRunning = true;
  self.postMessage('started web worker timer');
  timer.timerId = setInterval(() => {
    timer.sessionDuration--;
    if (timer.sessionDuration === 0) {
      timer.sessionCount++;
      if (timer.sessionCount === 4) {
        timer.breakDuration = 30 * 60;
      }
      timer.sendPostMessage({
        session: 'break',
        duration: timer.breakDuration,
        minutes: Math.floor(timer.breakDuration / 60),
        seconds: timer.breakDuration % 60,
      });
      timer.sessionDuration = 25 * 60;
      timer.breakDuration = 5 * 60;
    } else {
      self.sendPostMessage({
        session: 'work',
        duration: timer.sessionDuration,
        minutes: Math.floor(timer.sessionDuration / 60),
        seconds: timer.sessionDuration % 60,
      });
    }
  }, 1000); // 1000 milliseconds = 1 second
}

function pauseTimer() {
  if (!timer.isRunning) {
    return;
  }
  clearInterval(timer.timerId);
  this.remainingDuration = this.sessionDuration;
  badIntervalClear();
  timer.isRunning = false;
  self.postMessage('started web worker timer');
}

function resetTimer() {
  clearInterval(timer.timerId);
  timer.sessionDuration = 25;
  timer.breakDuration = 5;
  timer.isRunning = false;
  timer.sessionCount = 0;
}

function sendPostMessage(data) {
  postMessage(data);
}

self.addEventListener('message', (event) => {
  switch (event.data.action) {
    case 'start':
      // self.postMessage('started web worker timer');
      startTimer();
      break;
    case 'pause':
      pauseTimer();
      break;
    case 'reset':
      resetTimer();
      break;
    default:
      break;
  }
});
