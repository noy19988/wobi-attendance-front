import { useEffect, useState } from "react";
import axios from "axios";

interface BerlinTime {
  date: string;
  time: string;
}

export const useBerlinClock = () => {
  const [berlinTime, setBerlinTime] = useState<BerlinTime>({
    date: "",
    time: "",
  });

  const fetchTime = async () => {
    try {
      const response = await axios.get(
        "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Berlin"
      );
      const { date, time } = response.data as { date: string; time: string };
      
      const currentTime = new Date(); 
      const timeWithSeconds = `${time}:${currentTime.getSeconds().toString().padStart(2, '0')}`;

      setBerlinTime({ date, time: timeWithSeconds });
    } catch (err) {
      console.error("Failed to fetch Berlin time:", err);
    }
  };

  useEffect(() => {
    fetchTime();
    const interval = setInterval(fetchTime, 1000); 
    return () => clearInterval(interval);
  }, []);

  return { berlinTime };
};
