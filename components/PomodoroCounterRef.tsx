'use client';
import { useState, useEffect, useRef } from 'react';
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

  let didInit = false;

  const minutes = useRef(timer.pomodoro);
  const seconds = useRef(0);
  const [pmdrCount, setpmdrCount] = useState(0);
  const [breakTime, setbreakTime] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [sound, setSound] = useState(true);
  const [timerPress, setTimerPress] = useState('unpressed');
  //   const [notifPerm, setNotifPerm] = useState('unknown');

  function badIntervalClear() {
    // Set a fake timeout to get the highest timeout id, find a better way to do this
    let highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  function handlePomodoroStart() {
    badIntervalClear();
    setTimerStart(!timerStart);
    console.log('timer start');
    setTimerPress('pressed');
  }

  // function handleTimerPress() {
  //   setTimerPress(true);
  //   setTimerPress(false);
  // }

  function handleReset() {
    badIntervalClear();

    // let minutes = timer.pomodoro;
    // let seconds = 0;

    // setTimerStart(false);
    seconds.current = seconds.current + 1;
    minutes.current = timer.pomodoro;
    setbreakTime(false);
    setpmdrCount(0);
    console.log('timer reset');
  }

  function handleSkip() {
    badIntervalClear();

    // let minutes = 0;
    // let seconds = 0;
    seconds.current = 0;
    minutes.current = 0;
    console.log('skip');
  }

  function handleSubtract() {
    if (minutes.current !== 0) {
      // let subtract = minutes - 1;
      // setMinutes(subtract);
      minutes.current = minutes.current - 1;
    } else {
      return;
    }
  }

  function handleAdd() {
    // let add = minutes + 1;
    // setMinutes(add);
    minutes.current = minutes.current + 1;
  }

  function spawnNotification(body: string, title: string) {
    const notification = new Notification(title, { body });
  }

  useEffect(() => {
    // timerWorker.postMessage({ action: 'start' });

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

    // function checkPressed() {
    //   if (timerPress === 'pressed') {
    //     console.log('timer press already true');
    //   } else {
    //     timerWorker.postMessage({ action: 'start' });
    //     console.log('post start');

    //     setTimerPress('pressed');
    //     console.log('timer press true');
    //   }
    // }

    // timer functions
    if (!didInit) {
      didInit = true;
      const timerWorker = new Worker('/second-counter-worker.js');
      // timerWorker.postMessage({ action: 'start' });

      if (timerPress === 'pressed') {
        // setTimerPress('pressed');

        timerWorker.onmessage = (event) => {
          if (timerStart) {
            document.title = 'Work';

            // console.log(event.data);
            // checkPressed();

            if (seconds.current === 0) {
              if (minutes.current !== 0) {
                // setSeconds(59);
                // setSeconds(5);
                seconds.current = 5;

                minutes.current = minutes.current - 1;
              } else {
                if (pmdrCount < timer.longBreakInterval) {
                  let newMinutes = breakTime
                    ? timer.pomodoro - 1
                    : timer.shortBreak - 1;
                  // let seconds = 59;
                  // let seconds = 3;

                  // setSeconds(seconds);
                  // setMinutes(minutes);
                  seconds.current = 3;
                  minutes.current = newMinutes;
                  setbreakTime(!breakTime);
                  setpmdrCount(pmdrCount + 1);
                  if (breakTime) {
                    document.title = 'Work';
                    playSound('C4', '8n', Tone.now());
                    playSound('F4', '8n', Tone.now() + 0.15);
                    playSound('E4', '8n', Tone.now() + 0.3);
                    spawnNotification('Pomodo', 'Work time');
                  } else {
                    document.title = 'Break';
                    playSound('C4', '8n', Tone.now());
                    playSound('A4', '8n', Tone.now() + 0.15);
                    playSound('B4', '8n', Tone.now() + 0.3);
                    spawnNotification('Pomodo', 'Break time');
                  }
                } else {
                  let newMinutes = timer.longBreak - 1;
                  // let seconds = 59;
                  // let seconds = 10;

                  seconds.current = 10;
                  minutes.current = newMinutes;
                  setbreakTime(true);
                  setpmdrCount(-1);
                  document.title = 'Break';
                  playSound('C4', '8n', Tone.now());
                  playSound('E4', '8n', Tone.now() + 0.15);
                  playSound('G4', '8n', Tone.now() + 0.3);
                  playSound('B4', '8n', Tone.now() + 0.45);
                  spawnNotification('Pomodo', 'Long break time');
                }
              }
            } else {
              seconds.current = seconds.current - 1;
            }
          } else {
            console.log('paused');
          }
          // else if (!timerStart) {
          //   // timerWorker.postMessage({ action: 'stop' });
          //   timerWorker.onmessage = (event) => {
          //     console.log('paused');
          //   };
          //   // return;
          // }
        };
      }
    }
  }, [timerStart, seconds]);

  //   add 0 to minutes and seconds if less than 10
  const timerMinutes =
    minutes.current < 10 ? `0${minutes.current}` : minutes.current;
  const timerSeconds =
    seconds.current < 10 ? `0${seconds.current}` : seconds.current;

  return (
    <div className="pomodoro">
      <h1 className="timer">
        {timerMinutes}:{timerSeconds}
        <span className="message" style={{ opacity: 0.3, marginTop: 16 }}>
          {breakTime && ' Break'} {!breakTime && ' Work'}
        </span>
      </h1>
      <div className="controls">
        <button onClick={handlePomodoroStart}>Start/Pause</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSkip}>Skip</button>
        <button
          onClick={handleSubtract}
          disabled={minutes.current === 0 ? true : false}
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
