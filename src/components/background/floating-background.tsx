"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  emoji: string;
  size: "small" | "medium" | "large";
  color: string;
  top: string;
  left: string;
  delay: number;
  duration: number;
}

const FloatingBackground = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Dreamy emojis for wedding/love theme
    const emojis = [
      "❤️",
      "💍",
      "💕",
      "💖",
      "💗",
      "💘",
      "💞",
      "💓",
      "💗",
      "💝",
      "🌸",
      "🌹",
      "💐",
      "✨",
      "⭐",
      "🌟",
      "💫",
      "🎊",
      "🎉",
      "🎎",
    ];
    const colors = [
      "text-pink-200",
      "text-purple-200",
      "text-rose-200",
      "text-red-200",
      "text-orange-200",
      "text-yellow-200",
      "text-green-200",
      "text-blue-200",
      "text-indigo-200",
    ];

    const newElements: FloatingElement[] = [];

    // Create 15 floating elements (reduced from 20 for less distraction)
    for (let i = 0; i < 15; i++) {
      newElements.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size:
          Math.random() > 0.8
            ? "large"
            : Math.random() > 0.5
            ? "medium"
            : "small",
        color: colors[Math.floor(Math.random() * colors.length)],
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 10,
        duration: 20 + Math.random() * 20, // Slower, more dreamy animation
      });
    }

    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute ${element.color} opacity-30 blur-[1px] ${
            // Reduced opacity to 30% and added subtle blur
            element.size === "small"
              ? "text-xl"
              : element.size === "medium"
              ? "text-3xl"
              : "text-5xl"
          }`}
          style={{
            top: element.top,
            left: element.left,
          }}
          initial={{
            y: 0,
            x: 0,
            rotate: 0,
          }}
          animate={{
            y: [0, -50, 0], // Reduced movement for less distraction
            x: [0, 30, 0], // Reduced movement for less distraction
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingBackground;
