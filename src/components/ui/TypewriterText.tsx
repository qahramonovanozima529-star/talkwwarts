"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  highlightWord?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = "",
  delay = 0,
  speed = 0.02,
  as = "h2",
  highlightWord,
}) => {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: speed,
        delayChildren: delay,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 4, display: "inline-block" },
    visible: {
      opacity: 1,
      y: 0,
      display: "inline-block",
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, wordIndex) => {
        const isHighlight =
          highlightWord &&
          word.toLowerCase().includes(highlightWord.toLowerCase());

        return (
          <span
            key={`${word}-${wordIndex}`}
            className={`inline-block mr-[0.28em] ${
              isHighlight
                ? "text-yellow-600 font-black bg-yellow-100/80 px-1 rounded"
                : ""
            }`}
          >
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={`${char}-${charIndex}`}
                variants={letterVariants}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </MotionTag>
  );
};
