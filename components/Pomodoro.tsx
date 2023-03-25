'use client';
import { useState, useEffect } from 'react';
import * as Tone from 'tone';
import NotificationButton from './NotificationButton';

export default function Pomodoro() {
  let timer = {
    // pomodoro: 25,
    // shortBreak: 5,
    // longBreak: 15,
    // longBreakInterval: 6,
    pomodoro: 1,
    shortBreak: 1,
    longBreak: 15,
    longBreakInterval: 6,
  };

  const [minutes, setMinutes] = useState(timer.pomodoro);
  const [seconds, setSeconds] = useState(0);
  const [pmdrCount, setpmdrCount] = useState(0);
  const [breakTime, setbreakTime] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [timerPause, setTimerPause] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState(true);
  //   const [notifPerm, setNotifPerm] = useState('unknown');
  // const [interval, setInterval] = useState({});
  // const [minutes, setMinutes] = useState(0);
  // const [seconds, setSeconds] = useState(0);

  function badIntervalClear() {
    // Set a fake timeout to get the highest timeout id, find a better way to do this
    let highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  // function changeTimeLeft(minutes: number, seconds: number) {
  //   setMinutes(minutes);
  //   setSeconds(seconds);
  // }

  function handlePomodoroStart() {
    // badIntervalClear();

    setTimerStart(!timerStart);
    // setTimerStart(true);
    // setTimerPause(false);
  }

  // function handlePause() {
  //   // setTimerPause(true);
  //   setTimerStart(false);
  // }

  function handleReset() {
    badIntervalClear();

    let minutes = timer.pomodoro;
    let seconds = 0;

    // setTimerStart(false);
    setSeconds(seconds);
    setMinutes(minutes);
    setbreakTime(false);
    setpmdrCount(0);
    console.log('timer reset');
  }

  function handleSkip() {
    badIntervalClear();

    let minutes = 0;
    let seconds = 0;
    setSeconds(seconds);
    setMinutes(minutes);
    console.log('skip');
  }

  function handleSubtract() {
    if (minutes !== 0) {
      let subtract = minutes - 1;
      setMinutes(subtract);
    } else {
      return;
    }
  }

  function handleAdd() {
    let add = minutes + 1;
    setMinutes(add);
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
    // const timerWorker = new Worker('/timer-worker.js');
    const timerWorker = new Worker('/second-counter-worker.js');

    if (timerStart) {
      //send message start
      timerWorker.postMessage({ action: 'start' });
      // setTimerStart(false);
      // setIsRunning(true);
      console.log('start posted to worker');

      document.title = 'Work';
    } else {
      //send message pause
      timerWorker.postMessage({ action: 'pause' });
      // setTimerPause(false);
      // setIsRunning(false);
      console.log('pause posted to worker');
    }

    // timerWorker.onmessage = (response) => {
    //   console.log(response.data);
    // };
    timerWorker.onmessage = (event) => {
      console.log(event.data); // { session: "work", duration: 24 }
      // changeTimeLeft(event.data.minutes, event.data.seconds);
    };
  }, [timerStart, seconds]);

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
        {/* {!isRunning && <button onClick={handlePomodoroStart}>Start</button>}
        {isRunning && <button onClick={handlePause}>Pause</button>} */}
        <button onClick={handlePomodoroStart}>Start/Pause</button>
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
