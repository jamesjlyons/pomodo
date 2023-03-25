let startTime;
let intervalId;

// listen for messages from the main thread
self.onmessage = (event) => {
  if (event.data === 'start') {
    intervalId = setInterval(() => {
      // console.log("worker sending tick:");
      self.postMessage({ type: 'tick' });
    }, 1000);
  } else if (event.data === 'stop') {
    stopTimer();
  } else if (event.data === 'pause') {
    pauseTimer();
  }
};

// stop the timer
const stopTimer = () => {
  clearInterval(intervalId);
};

// pause the timer
const pauseTimer = () => {
  clearInterval(intervalId);
  self.postMessage('paused');
};
