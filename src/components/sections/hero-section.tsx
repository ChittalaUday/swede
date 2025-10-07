"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, stagger } from "animejs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const FlipCounter = ({ value, label }: { value: number; label: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set the display value immediately for clean updates
    setDisplayValue(value);

    // Add flip animation effect without intermediate values
    if (counterRef.current) {
      // Add a subtle scale animation to indicate change
      animate(counterRef.current, {
        scale: [1, 1.1, 1],
        duration: 600,
        easing: "easeOutBack",
      });
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center mx-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
        <div
          ref={counterRef}
          className="text-4xl md:text-5xl font-bold text-primary relative bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20 shadow-lg"
        >
          {String(displayValue).padStart(2, "0")}
        </div>
      </div>
      <span className="mt-2 text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

const SaveTheDateButton = () => {
  const addToCalendar = () => {
    const title = "Swetha & Depak's Wedding";
    const venueName = "Devathilakula Kalyanamandapam";
    const address = "X734+79V, Dwaraka Tirumala, Andhra Pradesh 534426";
    const location = `${venueName}, ${address} (Map: https://maps.app.goo.gl/Yitj12cqnfzsnbnw9)`;
    const contacts =
      "Phone: 7330365208, 8309154716\nEmail: chitalauday@gmail.com";
    const description = `Join us for our special day as we celebrate our wedding!

Venue: ${venueName}
Address: ${address}
Map: https://maps.app.goo.gl/Yitj12cqnfzsnbnw9

Contacts:
${contacts}`;

    // Wedding date/time (IST → UTC)
    const start = new Date("2025-10-22T23:48:00+05:30");
    const end = new Date(start.getTime() + 8 * 60 * 60 * 1000); // 8-hour duration

    // Format date for iCalendar and Google Calendar (YYYYMMDDTHHmmssZ)
    const formatUTC = (date: Date) => {
      const pad = (n: number) => (n < 10 ? "0" + n : n);
      return (
        date.getUTCFullYear().toString() +
        pad(date.getUTCMonth() + 1) +
        pad(date.getUTCDate()) +
        "T" +
        pad(date.getUTCHours()) +
        pad(date.getUTCMinutes()) +
        pad(date.getUTCSeconds()) +
        "Z"
      );
    };

    const startStr = formatUTC(start);
    const endStr = formatUTC(end);

    // --- Google Calendar URL ---
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startStr}/${endStr}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    // Automatically redirect to Google Calendar
    window.open(googleUrl, "_blank");
  };

  return (
    <Button
      onClick={addToCalendar}
      className=" px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
    >
      Save the Date
    </Button>
  );
};

export default function HeroSection({ weddingDate }: { weddingDate: Date }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      // Initial entrance animation
      animate(heroRef.current.querySelectorAll(".animate-item"), {
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: stagger(150),
        easing: "easeOutCubic",
      });

      // Slow and subtle floating animation for the names
      const floatingNames = heroRef.current.querySelectorAll(".floating-name");
      if (floatingNames.length > 0) {
        animate(floatingNames, {
          translateY: [0, -3, 0],
          duration: 4000,
          direction: "alternate",
          loop: true,
          easing: "easeInOutSine",
        });
      }
    }
  }, []);

  // Update the WeddingCountdown component
  const WeddingCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = weddingDate.getTime() - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          return { days, hours, minutes, seconds };
        }

        // Return zeros when countdown is complete
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      };

      // Calculate initial time
      setTimeLeft(calculateTimeLeft());

      // Update every second
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [weddingDate]);

    // Show completion message when countdown is finished
    if (
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      return null; // Let the parent component handle the redirect
    }

    return (
      <div className="flex justify-center items-center my-8">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <div className="flex items-center">
            <FlipCounter value={timeLeft.days} label="Days" />
            <div className="text-3xl md:text-4xl font-bold text-muted-foreground mx-1 hidden sm:block">
              :
            </div>
          </div>
          <div className="flex items-center">
            <FlipCounter value={timeLeft.hours} label="Hours" />
            <div className="text-3xl md:text-4xl font-bold text-muted-foreground mx-1 hidden sm:block">
              :
            </div>
          </div>
          <div className="flex items-center">
            <FlipCounter value={timeLeft.minutes} label="Minutes" />
            <div className="text-3xl md:text-4xl font-bold text-muted-foreground mx-1 hidden sm:block">
              :
            </div>
          </div>
          <div className="flex items-center">
            <FlipCounter value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>
      </div>
    );
  };

  // Format the wedding date for display
  const formattedWeddingDate = weddingDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/30 pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-4xl w-full">
        <motion.div
          className="animate-item opacity-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl md:text-2xl font-light text-muted-foreground mb-4">
            Join us as we begin our journey together
          </h2>
        </motion.div>

        <motion.div
          className="animate-item opacity-0 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 my-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="floating-name">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-primary relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="relative z-10">Swetha</span>
              <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-lg"></div>
            </motion.h1>
            <motion.div
              className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>

          <motion.div
            className="text-4xl md:text-5xl text-muted-foreground font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            &
          </motion.div>

          <div className="floating-name">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-primary relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="relative z-10">Depak</span>
              <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-lg"></div>
            </motion.h1>
            <motion.div
              className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </div>
        </motion.div>

        <motion.div
          className="animate-item opacity-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <p className="text-lg md:text-xl text-muted-foreground mb-2">
            Celebrate our special day
          </p>
          <motion.p
            className="text-2xl md:text-3xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {formattedWeddingDate}
          </motion.p>
        </motion.div>

        <motion.div
          className="animate-item opacity-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <WeddingCountdown />
        </motion.div>

        <motion.div
          className="animate-item opacity-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center mt-8">
            <SaveTheDateButton />
            <Link href="/wedding-details">
              <Button
                variant="outline"
                className="mt-8 sm:mt-0 px-8 py-6 text-lg font-semibold hover:scale-105 rounded-full border-2 border-primary/50 hover:bg-primary/10 transition-all duration-300"
              >
                View Details
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
