let intervalId;
let highestIntervalId = setInterval(';');

function badIntervalClear() {
  clearInterval(intervalId);
  intervalId = undefined;
  // Set a fake Interval to get the highest Interval id, find a better way to do this
  for (var i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
}

onmessage = function(event) {
  if (event.data.action === 'start') {
    intervalId = setInterval(() => {
      self.postMessage('tick');
    }, 1000);
  } else if (event.data.action === 'pause') {
    clearInterval(intervalId);
    intervalId = undefined;

    badIntervalClear();
    self.postMessage('stopped');
  }
};

// intervalId = setInterval(() => {
//   self.postMessage('tick');
// }, 1000);

// self.addEventListener('message', (event) => {
//   if (event.data.action === 'start') {
//     intervalId = setInterval(() => {
//       self.postMessage('tick');
//     }, 1000);
//   } else if (event.data.action === 'pause') {
//     clearInterval(intervalId);
//     self.postMessage('stopped');
//   }
// });
