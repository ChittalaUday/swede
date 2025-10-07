"use client";
import { useState, useEffect, useMemo } from "react";
import HeroSection from "@/components/sections/hero-section";
import CongratulationsSection from "@/components/sections/congratulations-section";

export default function Home() {
  // Set the wedding date
  const weddingDate = useMemo(() => new Date("2025-10-22T23:48:00"), []);

  // State to track if the wedding day has arrived
  const [isWeddingDay, setIsWeddingDay] = useState(false);
  const [countdownComplete, setCountdownComplete] = useState(false);

  // Check if the wedding date has passed
  useEffect(() => {
    const now = new Date();
    const weddingReached = now >= weddingDate;
    setIsWeddingDay(weddingReached);

    // If wedding date is in the future, set up a timer to check every second
    if (!weddingReached) {
      const timer = setInterval(() => {
        const currentTime = new Date();
        if (currentTime >= weddingDate) {
          setIsWeddingDay(true);
          setCountdownComplete(true);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // If wedding date has already passed, show congratulations section
      setCountdownComplete(true);
    }
  }, [weddingDate]);

  return (
    <div>
      {countdownComplete ? (
        <CongratulationsSection weddingDate={weddingDate} />
      ) : (
        <HeroSection weddingDate={weddingDate} />
      )}
    </div>
  );
}
