"use client";

import React from "react";
import { motion } from "framer-motion";

export const HeroCharacter: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 flex items-center justify-center flex-shrink-0"
    >
      {/* Ambient Yellow Glow */}
      <div className="absolute inset-0 bg-[#FACC15]/20 rounded-full blur-2xl transform scale-90" />
      <div className="absolute top-4 right-4 w-20 h-20 bg-[#F59E0B]/20 rounded-full blur-xl" />

      {/* SVG 3D/Flat Hybrid Character Illustration */}
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full relative z-10 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Orbiting Sparkles and Dots */}
        <motion.circle
          cx="45"
          cy="70"
          r="4"
          fill="#FACC15"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.circle
          cx="195"
          cy="55"
          r="5"
          fill="#F59E0B"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <circle cx="210" cy="140" r="3" fill="#FACC15" />
        <circle cx="35" cy="165" r="3" fill="#FDE047" />

        {/* Floating Sound / Speech Waves on left */}
        <path
          d="M38 115C32 120 32 128 38 133"
          stroke="#FACC15"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M28 108C20 118 20 134 28 144"
          stroke="#F59E0B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Character Torso with Stylish Hoodie */}
        <path
          d="M75 165C75 138 90 128 120 128C150 128 165 138 165 165L172 230H68L75 165Z"
          fill="url(#yellowGrad)"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Shirt Collar */}
        <path
          d="M102 128L120 152L138 128"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M116 148V175"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Modern Studio Headphones */}
        {/* Headphone Arch */}
        <path
          d="M72 88C72 58 92 42 120 42C148 42 168 58 168 88"
          stroke="#0F172A"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Headphone Top Cushion */}
        <path
          d="M95 46C102 43 138 43 145 46"
          stroke="#F59E0B"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Left Ear Cushion */}
        <rect
          x="62"
          y="78"
          width="18"
          height="32"
          rx="9"
          fill="url(#accentGrad)"
          stroke="#0F172A"
          strokeWidth="3"
        />
        {/* Right Ear Cushion */}
        <rect
          x="160"
          y="78"
          width="18"
          height="32"
          rx="9"
          fill="url(#accentGrad)"
          stroke="#0F172A"
          strokeWidth="3"
        />

        {/* Character Head */}
        <circle
          cx="120"
          cy="92"
          r="30"
          fill="url(#bodyGrad)"
          stroke="#0F172A"
          strokeWidth="3.5"
        />

        {/* Modern Slick Hair */}
        <path
          d="M92 85C92 65 106 58 120 58C136 58 148 65 148 85C140 78 132 76 120 76C108 76 98 80 92 85Z"
          fill="#0F172A"
        />
        {/* Yellow Hair Tuft / Highlight */}
        <path
          d="M115 62C126 58 132 64 135 68C128 65 120 64 115 62Z"
          fill="#FACC15"
        />

        {/* Smart Glasses */}
        <circle
          cx="110"
          cy="94"
          r="7"
          stroke="#0F172A"
          strokeWidth="2.5"
          fill="#FFFFFF"
          fillOpacity="0.8"
        />
        <circle
          cx="130"
          cy="94"
          r="7"
          stroke="#0F172A"
          strokeWidth="2.5"
          fill="#FFFFFF"
          fillOpacity="0.8"
        />
        <path d="M117 94H123" stroke="#0F172A" strokeWidth="2.5" />
        {/* Eyes Behind Glasses */}
        <circle cx="110" cy="94" r="2.5" fill="#0F172A" />
        <circle cx="130" cy="94" r="2.5" fill="#0F172A" />

        {/* Confident Smile */}
        <path
          d="M114 107C118 111 122 111 126 107"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Floating Mini AI Dialogue Orb on top right */}
        <g transform="translate(170, 48)">
          <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect
              width="36"
              height="26"
              rx="8"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            <path
              d="M8 26L12 32L16 26H8Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="13" cy="13" r="2" fill="#FACC15" />
            <circle cx="18" cy="13" r="2" fill="#FACC15" />
            <circle cx="23" cy="13" r="2" fill="#FACC15" />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
};

