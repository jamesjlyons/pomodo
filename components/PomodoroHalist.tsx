import React, { useState, useEffect } from 'react';
// import PomodoroWorker from './pomodoro.worker.js'; // import the web worker

const WORK_TIME = 25 * 60 * 1000; // 25 min work
const SHORT_BREAK_TIME = 5 * 60 * 1000; // 5 min break
const LONG_BREAK_TIME = 30 * 60 * 1000; // 30 min break

interface Props { }

const PomodoroTimer: React.FC<Props> = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isWorking, setIsWorking] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [workIntervalsCompleted, setWorkIntervalsCompleted] = useState(0);

  // let worker: Worker;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    console.log("timeLeft:", timeLeft);

    // initialize the web worker
    const worker = new Worker('./pomodoro.worker.js');

    // listen for messages from the web worker
    worker.onmessage = (event) => {
      if (event.data.type === 'tick') {
        setTimeLeft(
          (prevTimeLeft) => prevTimeLeft - event.data.elapsedSeconds,
        );
      }
    };

    // start the web worker
    // worker.postMessage('start');
    // start the web worker with the current time left

    console.log("sending start message:", timeLeft);
    worker.postMessage({ type: "start", timeLeft });

    // clear the interval and stop the web worker when the timer is finished
    if (timeLeft === 0) {
      clearInterval(intervalId);
      worker.postMessage('stop');
    }

    // pause or resume the web worker when isPaused changes
    if (isPaused) {
      worker.postMessage('pause');
    } else {
      worker.postMessage('resume');
    }

    // update the document title with the time left
    document.title = `${Math.floor(timeLeft / 1000 / 60)}:${(
      '0' + Math.floor((timeLeft / 1000) % 60)
    ).slice(-2)} - ${isWorking ? 'Work' : 'Break'}`;

    return () => {
      clearInterval(intervalId);
      worker.postMessage('stop');
      worker.terminate(); // terminate the web worker when the component unmounts
    };
  }, [timeLeft, isPaused, isWorking]);

  const handleStartStopClick = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const handleResetClick = () => {
    setTimeLeft(WORK_TIME);
    setIsWorking(true);
    setIsPaused(false);
    setWorkIntervalsCompleted(0);
  };

  if (timeLeft === 0) {
    if (isWorking) {
      if (workIntervalsCompleted < 3) {
        setTimeLeft(SHORT_BREAK_TIME);
        setIsWorking(false);
        setWorkIntervalsCompleted(
          (prevWorkIntervalsCompleted) => prevWorkIntervalsCompleted + 1,
        );
      } else {
        setTimeLeft(LONG_BREAK_TIME);
        setIsWorking(false);
        setWorkIntervalsCompleted(0);
      }
    } else {
      setTimeLeft(WORK_TIME);
      setIsWorking(true);
    }
  }

  return (
    <div>
      <h1>{isWorking ? 'Work' : 'Break'}</h1>
      <h2>
        {Math.floor(timeLeft / 1000 / 60)}:
        {('0' + Math.floor((timeLeft / 1000) % 60)).slice(-2)}
      </h2>
      <button onClick={handleStartStopClick}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button onClick={handleResetClick}>Reset</button>
    </div>
  );
};

export default PomodoroTimer;
