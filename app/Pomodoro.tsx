'use client';
import { useState, useEffect } from "react"

export default function Pomodoro() {
    let timer = {
        // pomodoro: 25,
        // shortBreak: 5,
        // longBreak: 15,
        // longBreakInterval: 4,
        pomodoro: 1,
        shortBreak: 1,
        longBreak: 15,
        longBreakInterval: 7,
      };
      
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(2)
    const [pmdrCount, setpmdrCount] = useState(0)
    const [displayMessage, setDisplayMessage] = useState(false)
    const [timerStart, setTimerStart] = useState(false);

    function handlePomodoroStart() {
        // Set a fake timeout to get the highest timeout id, find a better way to do this
        let highestTimeoutId = setTimeout(";");
        for (var i = 0 ; i < highestTimeoutId ; i++) {
            clearTimeout(i); 
        }

        setTimerStart(!timerStart);
      console.log(timerStart)
    }
    
    function handleReset() {
        // Set a fake timeout to get the highest timeout id, find a better way to do this
        let highestTimeoutId = setTimeout(";");
        for (var i = 0 ; i < highestTimeoutId ; i++) {
            clearTimeout(i); 
        }

        let minutes = timer.pomodoro
        // let seconds = 59
        let seconds = 3

        // setTimerStart(false);
        setSeconds(seconds)
        setMinutes(minutes)
        setDisplayMessage(false)
        setpmdrCount(0)
      console.log("timer reset")
    }
    

    useEffect(() => {
        if (timerStart) {
            let interval = setInterval(() => {
                clearInterval(interval)
        
                if (seconds === 0) {
                if (minutes !== 0) {
                    // setSeconds(59)
                    setSeconds(5)

                    setMinutes(minutes - 1)
                } else {
                    if (pmdrCount < timer.longBreakInterval) {
                        let minutes = displayMessage ? (timer.pomodoro - 1) : (timer.shortBreak - 1)
                        // let seconds = 59
                        let seconds = 3
            
                        setSeconds(seconds)
                        setMinutes(minutes)
                        setDisplayMessage(!displayMessage)
                        setpmdrCount(pmdrCount + 1)
                    } else {
                        let minutes = timer.longBreak - 1
                        // let seconds = 59
                        let seconds = 10
            
                        setSeconds(seconds)
                        setMinutes(minutes)
                        setDisplayMessage(!displayMessage)
                        setpmdrCount(0)
                    }
                   
                }
                } else {
                setSeconds(seconds - 1)
                }
        }, 1000)
        }
    }, [timerStart, seconds])
    
//   add 0 to minutes and seconds if less than 10
    const timerMinutes = minutes < 10 ? `0${minutes}` : minutes
    const timerSeconds = seconds < 10 ? `0${seconds}` : seconds
  
    return (
      <div className="pomodoro">
        <div className="message">
          {displayMessage && <div>Break:</div>}
        </div>
        <h1 className="timer">
          {timerMinutes}:{timerSeconds}
        </h1>
        <div className="controls">
            <button onClick={handlePomodoroStart}>Start/Pause</button>
            <button onClick={handleReset}>Reset</button>
        </div>
        <div className="pmdrCount" style={{ fontSize: 12,opacity: 0.5, marginTop: 16 }}>running: {timerStart && 'yes'}{!timerStart && 'no'}, pmdrCount: {pmdrCount}</div>
      </div>
    )
  }