
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  examDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ examDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(examDate) - +new Date();
    let timeLeft = {
        days: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000 * 60 * 60); // Update once an hour is enough for days

    return () => clearTimeout(timer);
  });

  return (
      <span className="text-primary font-bold">{timeLeft.days}</span>
  );
};

export default Countdown;
