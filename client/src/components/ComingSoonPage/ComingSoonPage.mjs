import React, { useEffect, useState } from 'react';
import './ComingSoonPage.css'; // Import your CSS file

const ComingSoonPage = () => {


  const deliveryDate = new Date('2023-09-01T17:00:00')
  const [currentDate, setCurrentDate] = useState(new Date())

  console.log(deliveryDate)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const timeDifferenceMs = deliveryDate - currentDate;

  const days = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifferenceMs % (1000 * 60)) / 1000);
  

  return (
    <div className="coming-soon-container">
      <h1>Coming Soon</h1>
      <div className="countdown">
        <div className="countdown-item">
          <span className="countdown-number">{days} </span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{hours} </span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{minutes} </span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{seconds} </span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export { ComingSoonPage }