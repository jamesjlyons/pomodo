'use client';
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import NotificationControls from 'components/NotificationControls';
import * as Switch from '@radix-ui/react-switch';
import * as Toast from '@radix-ui/react-toast';
import * as Accordion from '@radix-ui/react-accordion';
import IconButton from './IconButton';

export default function Pomodoro() {
  let timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 30,
    longBreakInterval: 6,
    // pomodoro: 0,
    // shortBreak: 0,
    // longBreak: 1,
    // longBreakInterval: 6,
  };

  const [minutes, setMinutes] = useState(timer.pomodoro);
  const [seconds, setSeconds] = useState(0);
  const [pmdrCount, setpmdrCount] = useState(1);
  const [sessionType, setSessionType] = useState('work');
  const [timerRunning, setTimerRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const [prevSessionType, setPrevSessionType] = useState('work');
  const [notifEnabled, setNotifEnabled] = useState<boolean>(false);
  const [toastContent, setToastContent] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const timerWorkerRef = useRef<Worker | null>();
  const toastTimeRef = useRef(0);

  function handleStart() {
    if (!timerRunning) {
      setTimerRunning(true);
      timerWorkerRef.current?.postMessage({
        action: 'start',
        minutes: minutes,
        seconds: seconds,
      });
    } else {
      setTimerRunning(false);
      timerWorkerRef.current?.postMessage({ action: 'pause' });
    }
  }

  const handleSkip = () => {
      timerWorkerRef.current?.postMessage({ action: 'skip' });
  };

  const handleReset = () => {
    timerWorkerRef.current?.postMessage({ action: 'reset' });
  };

  const handleSubtract = () => {
    if (minutes > 0) {
      timerWorkerRef.current?.postMessage({ action: 'subtract' });

      // Update the minutes immediately
      setMinutes((prevMinutes) => prevMinutes - 1);
    }
  };

  const handleAdd = () => {
    timerWorkerRef.current?.postMessage({ action: 'add' });

    // Update the minutes immediately
    setMinutes((prevMinutes) => prevMinutes + 1);
  };

  function spawnNotification(body: string, title: string) {
    if (notifEnabled) {
      const notification = new Notification(title, { body });
    } else {
      return;
    }
  }

  const showToast = (title: any) => {
    setToastContent(title);
    setToastOpen(true);
    window.clearTimeout(toastTimeRef.current);
    toastTimeRef.current = window.setTimeout(() => {
      setToastOpen(true);
      // setToastContent('');
    }, 100);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.code); // Add this line to log the events

      switch (event.code) {
        case 'Space':
          handleStart();
          if (timerRunning) {
            showToast('Timer Paused');
          } else {
            showToast('Timer Started');
          }
          break;
        case 'KeyP':
          handleStart();
          if (timerRunning) {
            showToast('Timer Paused');
          } else {
            showToast('Timer Started');
          }
          break;
        case 'ArrowRight':
          handleSkip();
          showToast('Skipped');
          break;
        case 'KeyS':
          handleSkip();
          showToast('Skipped');
          break;
        case 'ArrowLeft':
          handleReset();
          showToast('Reset');
          break;
        case 'KeyR':
          handleReset();
          showToast('Reset');
          break;
        case 'ArrowUp':
          handleAdd();
          showToast('Minute Added');
          break;
        case 'ArrowDown':
          handleSubtract();
          showToast('Minute Subtracted');
          break;
        default:
          break;
      }

      // clear toastTime
      return () => clearTimeout(toastTimeRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleStart,
    handleSkip,
    handleReset,
    handleAdd,
    handleSubtract,
    toastOpen,
  ]);

  useEffect(() => {
    // sound and notificasion functions
    //create a synth and connect it to the main output (your speakers)
    const synth = new Tone.Synth().toDestination();
    //  play passed sound parameters if sound is enabled
    const playSound = async (note: string, duration: string, when: any) => {
      if (sound) {
        await Tone.start();
        synth.triggerAttackRelease(note, duration, when);
      }
    };

    const playSoundForSessionType = (sessionType: String) => {
      if (sessionType === 'work') {
        playSound('C4', '8n', Tone.now());
        playSound('F4', '8n', Tone.now() + 0.15);
        playSound('E4', '8n', Tone.now() + 0.3);
      } else if (sessionType === 'shortBreak') {
        playSound('C4', '8n', Tone.now());
        playSound('A4', '8n', Tone.now() + 0.15);
        playSound('B4', '8n', Tone.now() + 0.3);
      } else if (sessionType === 'longBreak') {
        playSound('C4', '8n', Tone.now());
        playSound('E4', '8n', Tone.now() + 0.15);
        playSound('G4', '8n', Tone.now() + 0.3);
        playSound('B4', '8n', Tone.now() + 0.45);
      }
    };

    const notifyForSessionType = (sessionType: String) => {
      if (sessionType === 'work') {
        spawnNotification('Pomodo', 'Work time');
      } else if (sessionType === 'shortBreak') {
        spawnNotification('Pomodo', 'Break time');
      } else if (sessionType === 'longBreak') {
        spawnNotification('Pomodo', 'Long break time');
      }
    };

    if (sessionType !== prevSessionType) {
      playSoundForSessionType(sessionType);
      notifyForSessionType(sessionType);
      setPrevSessionType(sessionType);
    }
  }, [sound, sessionType, prevSessionType]);

  useEffect(() => {
    // timer functions
    const timerWorker = new Worker('./timerWorker.js');
    timerWorkerRef.current = timerWorker;
    timerWorker.postMessage({
      action: 'init',
      data: { minutes: timer.pomodoro, seconds: 0 },
    });

    timerWorker.onmessage = (event) => {
      if (event.data.type === 'tick') {
        // console.log(event.data);
        setMinutes(event.data.minutes);
        setSeconds(event.data.seconds);
        setpmdrCount(event.data.pmdrCount);
        setSessionType(event.data.sessionType);
      } else if (event.data.type === 'reset') {
        setMinutes(timer.pomodoro);
        setSeconds(0);
        setTimerRunning(false);
        setpmdrCount(1);
      }
    };

    // Clean up the timerWorker when the component is unmounted
    return () => {
      timerWorker.terminate();
    };
  }, []); // Remove 'seconds' and 'timerRunning' from the dependency array

  //   add 0 to minutes and seconds if less than 10
  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="pomodoro">
      <div
        className="container-outer"
      >
        <div
          className="container-inner"
        >
          <div className="session">
            <div className='time'>
              <IconButton
                onClick={handleSubtract}
                disabled={minutes === 0 ? true : false}
                title="Subtract"
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
                      fill="currentColor"
                    />
                  </svg>
                }
              />

              <h1 className="timer">
                {timerMinutes}:{timerSeconds}
              </h1>

              <IconButton
                onClick={handleAdd}
                title="Add"
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6Z"
                      fill="currentColor"
                    />
                  </svg>
                }
              />
            </div>

            <span className="message">
              {sessionType === 'work' && ' Work'}
              {sessionType === 'shortBreak' && ' Break'}
              {sessionType === 'longBreak' && ' Long Break'}
            </span>
          </div>
          <div className="controls">
            <IconButton
              onClick={handleReset}
              title="Reset"
              icon={
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.49023 9.09971C4.14917 10.964 5.92715 12.2997 8.01711 12.2997C10.6681 12.2997 12.8171 10.1507 12.8171 7.49971C12.8171 4.84874 10.6681 2.69971 8.01711 2.69971C6.28691 2.69971 5.1624 3.48051 4.04663 4.79971M3.80011 2.69971V4.49971C3.80011 4.83108 4.06874 5.09971 4.40011 5.09971H6.20011"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <div>
              <IconButton
                onClick={handleStart}
                title={timerRunning ? 'Pause' : 'Start'}
                icon={
                  timerRunning ? (
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.7002 3.5C5.31948 3.5 4.2002 4.61929 4.2002 6V19C4.2002 20.3807 5.31948 21.5 6.7002 21.5H7.7002C9.08091 21.5 10.2002 20.3807 10.2002 19V6C10.2002 4.61929 9.08091 3.5 7.7002 3.5H6.7002Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16.7002 3.5C15.3195 3.5 14.2002 4.61929 14.2002 6V19C14.2002 20.3807 15.3195 21.5 16.7002 21.5H17.7002C19.0809 21.5 20.2002 20.3807 20.2002 19V6C20.2002 4.61929 19.0809 3.5 17.7002 3.5H16.7002Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_402_101)">
                        <path
                          d="M21.7781 11.2156L8.27813 2.97497C8.05326 2.83247 7.79356 2.75448 7.52738 2.74952C7.26121 2.74456 6.99878 2.81282 6.76876 2.94684C6.53533 3.07491 6.34074 3.26353 6.20545 3.49285C6.07017 3.72217 5.9992 3.98372 6.00001 4.24997V20.75C5.9992 21.0162 6.07017 21.2778 6.20545 21.5071C6.34074 21.7364 6.53533 21.925 6.76876 22.0531C6.99878 22.1871 7.26121 22.2554 7.52738 22.2504C7.79356 22.2455 8.05326 22.1675 8.27813 22.025L21.7781 13.7843C21.9994 13.6509 22.1824 13.4625 22.3095 13.2374C22.4365 13.0124 22.5033 12.7584 22.5033 12.5C22.5033 12.2416 22.4365 11.9875 22.3095 11.7625C22.1824 11.5375 21.9994 11.3491 21.7781 11.2156Z"
                          fill="currentColor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_402_101">
                          <rect
                            width="24"
                            height="24"
                            fill="currentColo"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  )
                }
              />
            </div>
            <IconButton
              onClick={handleSkip}
              title="Skip"
              icon={
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.2002 16.5L17.1395 13.5607C17.7253 12.9749 17.7253 12.0251 17.1395 11.4393L14.2002 8.5M7.2002 16.5L10.1395 13.5607C10.7253 12.9749 10.7253 12.0251 10.1395 11.4393L7.2002 8.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      <form>
        <h4>Settings</h4>
        <div>
          <label className="Label" htmlFor="sound">
            Sound
          </label>
          <Switch.Root
            className="SwitchRoot"
            id="sound"
            checked={sound}
            onCheckedChange={() => setSound(!sound)}
          >
            <Switch.Thumb className="SwitchThumb" />
          </Switch.Root>
        </div>
      </form>

      <NotificationControls
        notifEnabled={notifEnabled}
        setNotifEnabled={setNotifEnabled}
      />
      {/* <div
        className="pmdrCount"
        style={{ fontSize: 12, opacity: 0.5, marginTop: 16 }}
      >
        running: {timerRunning && 'yes'}
        {!timerRunning && 'no'}, pmdrCount: {pmdrCount}
      </div> */}
      <div className="shortcuts">
        <h4>Keyboard shortcuts</h4>
        <p>
          Start/Pause: space <br />
          Reset: ← <br />
          Skip: → <br /> Add minute: ↑ <br /> Subtract minute: ↓
        </p>
      </div>

      <Toast.Provider duration={1000}>
        <Toast.Root
          className="ToastRoot"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          <Toast.Title>{toastContent}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  );
}
