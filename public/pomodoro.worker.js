let startTime;
let intervalId;

// listen for messages from the main thread
self.onmessage = (event) => {
  if (event.data.type === 'start') {
    startTime = Date.now() - event.data.timeLeft;
    intervalId = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      // console.log("worker sending tick:", elapsedSeconds);
      self.postMessage({ type: 'tick', elapsedSeconds });
    }, 1000);
  } else if (event.data.type === 'stop') {
    stopTimer();
  } else if (event.data.type === 'pause') {
    pauseTimer();
  } else if (event.data.type === 'resume') {
    resumeTimer();
  }
};

// stop the timer
const stopTimer = () => {
  clearInterval(intervalId);
};

// pause the timer
const pauseTimer = () => {
  clearInterval(intervalId);
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  self.postMessage({ type: 'tick', elapsedSeconds });
};

// resume the timer
const resumeTimer = () => {
  intervalId = setInterval(() => {
    self.postMessage({ type: 'tick' });
  }, 1000);
};
