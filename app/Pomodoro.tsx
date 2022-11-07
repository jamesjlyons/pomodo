'use client';
import { useState, useEffect } from "react"

export default function Pomodoro() {
    const [minutes, setMinutes] = useState(25)
    const [seconds, setSeconds] = useState(0)
    const [shortCount, setShortCount] = useState(0)
    const [displayMessage, setDisplayMessage] = useState(false)
    const [timerStart, setTimerStart] = useState(false);

  
    function handlePomodoroStart() {
        setTimerStart(!timerStart);
      console.log(timerStart)
    }

    useEffect(() => {
        if (timerStart) {
            let interval = setInterval(() => {
                clearInterval(interval)
        
                if (seconds === 0) {
                if (minutes !== 0) {
                    setSeconds(59)
                    setMinutes(minutes - 1)
                } else {
                    let minutes = displayMessage ? 24 : 4
                    let seconds = 59
        
                    setSeconds(seconds)
                    setMinutes(minutes)
                    setDisplayMessage(!displayMessage)
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
        </div>
      </div>
    )
  }