"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Confetti, ConfettiRef } from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";

export default function CongratulationsSection({
  weddingDate,
}: {
  weddingDate: Date;
}) {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    // Fire confetti when component mounts with bigger effect
    const timer = setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 150,
        spread: 180,
        startVelocity: 30,
        scalar: 1.5,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleConfettiClick = () => {
    confettiRef.current?.fire({
      particleCount: 150,
      spread: 180,
      startVelocity: 30,
      scalar: 1.5,
    });
  };

  // Format the wedding date for display
  const formattedWeddingDate = weddingDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/30 pointer-events-none"></div>

      <Confetti
        ref={confettiRef}
        className="absolute top-0 left-0 z-0 size-full"
      />

      <div className="relative z-10 text-center max-w-4xl w-full">
        <motion.div
          className="opacity-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-light text-muted-foreground mb-4">
            The wait is over
          </h2>
        </motion.div>

        <motion.div
          className="opacity-0 flex flex-col items-center justify-center my-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-primary relative mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="relative z-10">A New Chapter Begins</span>
            <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-lg"></div>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Congratulations to Swetha & Depak on their wedding day! As their
            journey together begins, we celebrate the start of their new life
            filled with love, companionship, and endless possibilities.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Beginning their journey together on {formattedWeddingDate}
          </motion.p>
        </motion.div>

        <motion.div
          className="opacity-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            onClick={handleConfettiClick}
            className="mt-4 px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
          >
            Celebrate Again
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
