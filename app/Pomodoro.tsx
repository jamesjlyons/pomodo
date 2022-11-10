'use client';
import { useState, useEffect } from 'react';

export default function Pomodoro() {
  let timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 6,
    // pomodoro: 1,
    // shortBreak: 1,
    // longBreak: 15,
    // longBreakInterval: 6,
  };

  const [minutes, setMinutes] = useState(timer.pomodoro);
  const [seconds, setSeconds] = useState(0);
  const [pmdrCount, setpmdrCount] = useState(0);
  const [breakTime, setbreakTime] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [notifPerm, setNotifPerm] = useState('default');

  function badIntervalClear() {
    // Set a fake timeout to get the highest timeout id, find a better way to do this
    let highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  //   Notifications

  function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch (e) {
      return false;
    }

    return true;
  }

  function handleNotifPermissions() {
    // function to actually ask the permissions
    function handlePermission(permission: string) {
      // set the button to shown or hidden, depending on what the user answers
      //   notificationBtn.style.display =
      //     Notification.permission === 'granted' ? 'none' : 'block';
      let perm = permission;
      setNotifPerm(perm);
    }

    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
    } else if (checkNotificationPromise()) {
      Notification.requestPermission().then((permission) => {
        handlePermission(permission);
      });
    } else {
      Notification.requestPermission((permission) => {
        handlePermission(permission);
      });
    }
  }

  function spawnNotification(body: string, title: string) {
    const notification = new Notification(title, { body });
  }

  useEffect(() => {
    const onPageLoad = () => {
      //   check notification permissions;
      if (Notification.permission !== 'granted') {
        setNotifPerm('denied');
      } else if (Notification.permission == 'granted') {
        setNotifPerm('granted');
      } else {
        setNotifPerm('unknown');
      }
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  //   end notifications

  function handlePomodoroStart() {
    badIntervalClear();

    setTimerStart(!timerStart);
    console.log(timerStart);
  }

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
    let subtract = minutes - 1;
    setMinutes(subtract);
  }

  function handleAdd() {
    let add = minutes + 1;
    setMinutes(add);
  }

  useEffect(() => {
    if (timerStart) {
      let interval = setInterval(() => {
        clearInterval(interval);

        if (seconds === 0) {
          if (minutes !== 0) {
            setSeconds(59);
            // setSeconds(5);

            setMinutes(minutes - 1);
          } else {
            if (pmdrCount < timer.longBreakInterval) {
              let minutes = breakTime
                ? timer.pomodoro - 1
                : timer.shortBreak - 1;
              let seconds = 59;
              //   let seconds = 3;

              setSeconds(seconds);
              setMinutes(minutes);
              setbreakTime(!breakTime);
              setpmdrCount(pmdrCount + 1);
              if (breakTime) {
                spawnNotification('Pomodo', 'Work time');
              } else {
                spawnNotification('Pomodo', 'Break time');
              }
            } else {
              let minutes = timer.longBreak - 1;
              let seconds = 59;
              //   let seconds = 10;

              setSeconds(seconds);
              setMinutes(minutes);
              setbreakTime(true);
              setpmdrCount(-1);
              spawnNotification('Pomodo', 'Long break time');
            }
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
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
        <button onClick={handlePomodoroStart}>Start/Pause</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSkip}>Skip</button>
        <button onClick={handleSubtract}>-1</button>
        <button onClick={handleAdd}>+1</button>
      </div>
      <div className="controls2">
        {notifPerm !== 'granted' && (
          <button onClick={handleNotifPermissions}>Enable notifications</button>
        )}
      </div>
      <div
        className="pmdrCount"
        style={{ fontSize: 12, opacity: 0.5, marginTop: 16 }}
      >
        running: {timerStart && 'yes'}
        {!timerStart && 'no'}, pmdrCount: {pmdrCount}, notification: {notifPerm}
      </div>
    </div>
  );
}
