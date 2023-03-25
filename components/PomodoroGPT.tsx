'use client';
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import NotificationButton from './NotificationButton';

export default function Pomodoro() {
  let timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 6,
    // pomodoro: 0,
    // shortBreak: 0,
    // longBreak: 1,
    // longBreakInterval: 6,
  };

  const [minutes, setMinutes] = useState(timer.pomodoro);
  const [seconds, setSeconds] = useState(0);
  const [pmdrCount, setpmdrCount] = useState(1);
  const [breakTime, setbreakTime] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [sound, setSound] = useState(true);

  const timerWorkerRef = useRef(null);

  function handleStart() {
    if (!timerStart) {
      setTimerStart(!timerStart);
      console.log('timer start');
    } else {
      setTimerStart(!timerStart);
      console.log('timer paused');
    }
  }


  function handleReset() {
    timerWorkerRef.current.postMessage({
      action: 'reset',
    });
    console.log('reset');
  }

  function handleSkip() {
    timerWorkerRef.current.postMessage({
      action: 'skip',
    });
    console.log('skip');
  }

  function handleSubtract() {
    timerWorkerRef.current.postMessage({
      action: 'subtract',
    });
    console.log('subtract');
  }

  function handleAdd() {
    timerWorkerRef.current.postMessage({
      action: 'add',
    });
    console.log('add');
  }

  function spawnNotification(body: string, title: string) {
    const notification = new Notification(title, { body });
  }

  useEffect(() => {
    // sound functions
    //create a synth and connect it to the main output (your speakers)
    const synth = new Tone.Synth().toDestination();
    //  play passed sound parameters if sound is enabled
    const playSound = async (note: string, duration: string, when: any) => {
      if (sound) {
        await Tone.start();
        synth.triggerAttackRelease(note, duration, when);
      }
    };

    // timer functions
    const timerWorker = new Worker('./gptworker.js');

    if (timerStart) {
      timerWorker.postMessage({
        action: 'start',
        minutes: minutes,
        seconds: seconds,
      });
      console.log('client post start');
    } else {
      timerWorker.postMessage({
        action: 'pause',
      });
      console.log('paused');
    }

    const workDuration = timer.pomodoro;
    const shortBreakDuration = timer.shortBreak;
    const longBreakDuration = timer.longBreak;

    // const updateTimer = () => {
    //   setpmdrCount((prevPmdrCount) => {
    //     const newPmdrCount = prevPmdrCount + 1;
    //     if (newPmdrCount % 8 === 0) {
    //       setMinutes(longBreakDuration);
    //       setbreakTime(true);
    //     } else if (newPmdrCount % 2 === 0) {
    //       setMinutes(shortBreakDuration);
    //       setbreakTime(true);
    //     } else {
    //       setMinutes(workDuration);
    //       setbreakTime(false);
    //     }
    //     return newPmdrCount;
    //   });
    // };

    timerWorker.onmessage = (event) => {
      if (event.data.type === 'tick') {
        setMinutes(event.data.minutes);
        setSeconds(event.data.seconds);
        setpmdrCount(event.data.pmdrCount);
      } else if (event.data.type === 'reset') {
        setTimerStart(false); // Set the timer to the paused state
        setMinutes(timer.pomodoro); // Reset the minutes
        setSeconds(0); // Reset the seconds
        setpmdrCount(1); // Reset the pmdrCount
      }
    };

    timerWorkerRef.current = timerWorker;


    // Clean up the timerWorker when the component is unmounted
    return () => {
      timerWorker.terminate();
    };
  }, [timerStart]); // Remove 'seconds' from the dependency array

  //   add 0 to minutes and seconds if less than 10
  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="pomodoro">
      <h1 className="timer">
        {timerMinutes}:{timerSeconds}
        <span className="message" style={{ opacity: 0.3, marginTop: 16 }}>
          {breakTime && ' Break'} {!breakTime && ' Work'}
        </span>
      </h1>
      <div className="controls">
        <button onClick={handleStart}>Start/Pause</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSkip}>Skip</button>
        <button
          onClick={handleSubtract}
          disabled={minutes === 0 ? true : false}
        >
          -1
        </button>
        <button onClick={handleAdd}>+1</button>
      </div>
      <form
        style={{
          fontSize: 13,
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          name="sound"
          type="checkbox"
          checked={sound}
          onChange={() => setSound(!sound)}
        />
        <label htmlFor="sound" style={{ marginLeft: 4, opacity: 0.5 }}>
          Sound
        </label>
      </form>
      <NotificationButton />
      <div
        className="pmdrCount"
        style={{ fontSize: 12, opacity: 0.5, marginTop: 16 }}
      >
        running: {timerStart && 'yes'}
        {!timerStart && 'no'}, pmdrCount: {pmdrCount}
      </div>
    </div>
  );
}
