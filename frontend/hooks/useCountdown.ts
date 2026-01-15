import { useEffect, useState } from "react";

export function useCountdown(startTime?: string) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const start = new Date(startTime).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return {
    elapsedSeconds: elapsed,
    display: `${minutes}:${seconds.toString().padStart(2, "0")}`,
  };
}
