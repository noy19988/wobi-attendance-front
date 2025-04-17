import { useEffect, useState } from "react";
import axios from "axios";

interface BerlinTime {
  date: string;
  time: string;
  source: "api" | "local"; 
}

export const useBerlinClock = () => {
  const [berlinTime, setBerlinTime] = useState<BerlinTime>({
    date: "",
    time: "",
    source: "local",
  });

  const fetchTime = async () => {
    try {
      const response = await axios.get(
        "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin"
      );

      const { date, time } = response.data as { date: string; time: string };

      const currentTime = new Date();
      const timeWithSeconds = `${time}:${currentTime.getSeconds()
        .toString()
        .padStart(2, "0")}`;

      setBerlinTime({
        date,
        time: timeWithSeconds,
        source: "api",
      });
    } catch (err) {
      console.warn("Falling back to local time due to API error", err);

      const now = new Date();
      const localTime = now.toLocaleTimeString("de-DE", {
        timeZone: "Europe/Berlin",
        hour12: false,
      });
      const localDate = now.toLocaleDateString("de-DE", {
        timeZone: "Europe/Berlin",
      });

      setBerlinTime({
        date: localDate,
        time: localTime,
        source: "local",
      });
    }
  };

  useEffect(() => {
    fetchTime();
    const interval = setInterval(fetchTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return { berlinTime };
};
