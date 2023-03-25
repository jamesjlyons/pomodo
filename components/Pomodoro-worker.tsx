import React, { useEffect, useState } from 'react';

export default function PomodoroTimer() {
  const [pomodoroDuration, setPomodoroDuration] = useState(25 * 60 * 1000);
  const [breakDuration, setBreakDuration] = useState(5 * 60 * 1000);
  const [timerStatus, setTimerStatus] = useState('stopped');
  const [timeLeft, setTimeLeft] = useState({
    pomodoroDuration: pomodoroDuration,
    breakDuration: breakDuration
  });

  useEffect(() => {
    const pomodoroTimerWorker = new Worker('/pomodoro-timer-worker.js');

    pomodoroTimerWorker.onmessage = function(e) {
      const data = e.data;
      switch (data.type) {
        case 'timerUpdate':
          setTimeLeft({
            pomodoroDuration: data.pomodoroDuration,
            breakDuration: data.breakDuration
          });
          break;
        case 'sessionComplete':
          setTimerStatus('stopped');
          setTimeLeft({
            pomodoroDuration: pomodoroDuration,
