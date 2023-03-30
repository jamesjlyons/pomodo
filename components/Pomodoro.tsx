'use client';
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import NotificationControls from 'components/NotificationControls';
import * as Switch from '@radix-ui/react-switch';
import * as Toast from '@radix-ui/react-toast';


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
  const [timerStart, setTimerStart] = useState(false);
  const [sound, setSound] = useState(true);
  const [prevSessionType, setPrevSessionType] = useState('work');
  const [notifEnabled, setNotifEnabled] = useState<boolean>(false);
  const [toastContent, setToastContent] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const timerWorkerRef = useRef<Worker | null>();
  const toastTimeRef = useRef(0);

  function handleStart() {
    if (!timerStart) {
      setTimerStart(true);
      timerWorkerRef.current?.postMessage({
        action: 'start',
        minutes: minutes,
        seconds: seconds,
      });
    } else {
      setTimerStart(false);
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
    }
    else {
      return
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
        case "Space":
          handleStart();
          if (timerStart) {
            showToast("Timer Paused");
          } else {
            showToast("Timer Started");
          }
          break;
        case "ArrowRight":
          handleSkip();
          showToast("Skipped");
          break;
        case "ArrowLeft":
          handleReset();
          showToast("Reset");
          break;
        case "ArrowUp":
          handleAdd();
          showToast("Minute Added");
          break;
        case "ArrowDown":
          handleSubtract();
          showToast("Minute Subtracted");
          break;
        default:
          break;
      }

      // clear toastTime
      return () => clearTimeout(toastTimeRef.current);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [handleStart, handleSkip, handleReset, handleAdd, handleSubtract, toastOpen]);




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
        setTimerStart(false);
        setpmdrCount(1);
      }
    };

    // Clean up the timerWorker when the component is unmounted
    return () => {
      timerWorker.terminate();
    };
  }, []); // Remove 'seconds' and 'timerStart' from the dependency array

  //   add 0 to minutes and seconds if less than 10
  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="pomodoro">
      <h1 className="timer">
        {timerMinutes}:{timerSeconds}
        <span className="message" style={{ opacity: 0.3, marginTop: 16 }}>
          {sessionType === 'work' && ' Work'}
          {sessionType === 'shortBreak' && ' Break'}
          {sessionType === 'longBreak' && ' Long Break'}
        </span>
      </h1>
      <div className="controls">
        <button onClick={handleStart}>Start/Pause</button>
        <button onClick={handleSkip}>Skip</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSubtract} disabled={minutes === 0 ? true : false}>-1</button>
        <button onClick={handleAdd}>+1</button>

      </div>
      <form style={{
        fontSize: 13,
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className="Label" htmlFor="sound" style={{ opacity: 0.5, paddingRight: 16 }}>
            Sound
          </label>
          <Switch.Root className="SwitchRoot" id="sound" checked={sound} onCheckedChange={() => setSound(!sound)}>
            <Switch.Thumb className="SwitchThumb" />
          </Switch.Root>
        </div>
      </form>


      <NotificationControls notifEnabled={notifEnabled}
        setNotifEnabled={setNotifEnabled} />
      {/* <div
        className="pmdrCount"
        style={{ fontSize: 12, opacity: 0.5, marginTop: 16 }}
      >
        running: {timerStart && 'yes'}
        {!timerStart && 'no'}, pmdrCount: {pmdrCount}
      </div> */}
      <div
        className="shortcuts"
        style={{ fontSize: 12, opacity: 0.5, marginTop: 48, lineHeight: 1.6 }}
      >
        <h4 style={{ marginBottom: -8 }}>Keyboard shortcuts</h4>
        <p>Start/Pause: space  <br />
          Skip: → <br /> Add minute: ↑ <br /> Subtract minute: ↓</p>
      </div>

      <Toast.Provider duration={1000} >
        <Toast.Root className="ToastRoot" open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Title>{toastContent}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div >
  );
}
