import {
  useState,
  useEffect,
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from 'react';
import { motion } from 'framer-motion';

const slideVariants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

//react component scaffolding
const Timer = (timerMinutesArray: any[], timerSecondsArray: any[]) => {
  return (
    <div>
      <h1 className="timer">
        {timerMinutesArray.map((digit, index) => (
          <motion.span
            key={`${digit}-${index}`}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
          >
            {digit}
          </motion.span>
        ))}
        :
        {timerSecondsArray.map((digit, index) => (
          <motion.span
            key={`${digit}-${index}`}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
          >
            {digit}
          </motion.span>
        ))}
      </h1>
    </div>
  );
};

export default Timer;
