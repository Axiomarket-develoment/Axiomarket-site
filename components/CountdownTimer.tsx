import { useEffect, useState } from "react";

interface CountdownProps {
  endDate: string; // market end date
}

export default function CountdownTimer({ endDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(endDate));
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, [endDate]);

  if (timeLeft.total <= 0) return <span>Ended</span>;

  return (
    <span>
      {timeLeft.hours.toString().padStart(2, "0")}:
      {timeLeft.minutes.toString().padStart(2, "0")}:
      {timeLeft.seconds.toString().padStart(2, "0")}
    </span>
  );
}

// Helper to calculate remaining time
function getTimeRemaining(endDate: string) {
  const ONE_HOUR = 3600000;

  const total = new Date(endDate).getTime() - new Date().getTime();

  const adjustedTotal = total ; // 🔥 apply shift AFTER

  const seconds = Math.floor((adjustedTotal / 1000) % 60);
  const minutes = Math.floor((adjustedTotal / 1000 / 60) % 60);
  const hours = Math.floor((adjustedTotal / 1000 / 60 / 60));
  const days = Math.floor(adjustedTotal / 1000 / 60 / 60 / 24);

  return { total: adjustedTotal, days, hours, minutes, seconds };
}
