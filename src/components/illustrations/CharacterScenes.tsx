"use client";

import React from "react";
import { motion } from "framer-motion";

// @mchlabs Modern Flat Human Vector Character Scenes
// Black line art (#1E293B) + Vibrant Warm Yellow (#FACC15, #F59E0B) + White (#FFFFFF)

// Floating animation wrapper
const floatAnimation = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 1.5, -1.5, 0],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// Step 1: Cheerful character stepping forward with yellow ticket & backpack
export const Step1Scene: React.FC = () => (
  <motion.div {...floatAnimation} className="w-full flex items-center justify-center">
    <svg viewBox="0 0 400 360" className="w-full max-h-[340px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Studio Aura */}
      <circle cx="200" cy="180" r="140" fill="#FEF08A" fillOpacity="0.35" />
      <circle cx="270" cy="120" r="40" fill="#FDE68A" fillOpacity="0.5" />

      {/* Motion Speed Lines */}
      <path d="M70 170H120" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 200H100" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 230H110" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />

      {/* Floating Stars / Sparkles */}
      <path d="M300 80L304 90L314 94L304 98L300 108L296 98L286 94L296 90L300 80Z" fill="#FACC15" />
      <path d="M120 90L123 97L130 100L123 103L120 110L117 103L110 100L117 97L120 90Z" fill="#F59E0B" />
      <circle cx="330" cy="160" r="5" fill="#FACC15" />
      <circle cx="90" cy="130" r="4" fill="#FDE68A" />

      {/* Backpack on the left */}
      <rect x="140" y="160" width="36" height="64" rx="14" fill="#F59E0B" stroke="#1E293B" strokeWidth="3.5" />
      <path d="M148 180H168" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <path d="M148 200H168" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

      {/* Human Body - Yellow Hoodie */}
      <path
        d="M165 170C165 145 180 135 210 135C240 135 255 145 255 170L260 250H160L165 170Z"
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Hoodie Pockets & Strings */}
      <path d="M185 205C195 215 225 215 235 205" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <path d="M205 145V170" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M215 145V170" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Legs & Walking Shoes */}
      <path d="M185 250V310L170 320" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M235 250V300L255 315" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Modern Sneakers with Yellow Sole */}
      <rect x="155" y="315" width="30" height="12" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      <path d="M155 323H185" stroke="#FACC15" strokeWidth="3" />
      <rect x="245" y="310" width="30" height="12" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      <path d="M245 318H275" stroke="#FACC15" strokeWidth="3" />

      {/* Character Head */}
      <circle cx="210" cy="100" r="28" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      {/* Modern Hair with Yellow Accent */}
      <path
        d="M185 95C185 75 195 65 210 65C228 65 238 75 238 95C230 88 220 86 210 86C198 86 190 90 185 95Z"
        fill="#1E293B"
      />
      <path d="M205 70C215 67 222 72 225 76C218 73 210 72 205 70Z" fill="#FACC15" />

      {/* Face Details: Winking / Cheerful Smile */}
      <circle cx="202" cy="100" r="2.5" fill="#1E293B" />
      <path d="M216 97L224 101" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M205 112C209 117 217 117 220 112" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

      {/* Extended Arm Holding Golden Boarding Ticket */}
      <path d="M245 175L285 160" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(275, 130) rotate(12)">
        <rect x="0" y="0" width="48" height="28" rx="6" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
        <path d="M8 9H24" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 17H34" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="14" r="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
      </g>
    </svg>
  </motion.div>
);

// Step 2: Character with laptop and orbiting yellow academic/faculty icons
export const Step2Scene: React.FC = () => (
  <motion.div {...floatAnimation} className="w-full flex items-center justify-center">
    <svg viewBox="0 0 400 360" className="w-full max-h-[340px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="180" r="140" fill="#FEF08A" fillOpacity="0.35" />

      {/* Orbiting Dotted Track */}
      <ellipse cx="200" cy="180" rx="145" ry="95" stroke="#FDE68A" strokeWidth="2.5" strokeDasharray="6 6" />

      {/* Orbiting Faculty Icon 1: Code Brackets < / > */}
      <g transform="translate(60, 110)">
        <rect x="0" y="0" width="48" height="38" rx="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <path d="M14 14L8 19L14 24" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 14L40 19L34 24" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 13L22 25" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Orbiting Faculty Icon 2: Plant / Herbology */}
      <g transform="translate(295, 90)">
        <rect x="0" y="0" width="44" height="42" rx="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <path d="M22 34V18" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 22C22 14 32 14 34 20C28 22 24 22 22 22Z" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
        <path d="M22 26C22 20 12 20 10 26C16 28 20 28 22 26Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
      </g>

      {/* Orbiting Faculty Icon 3: Scroll / Ancient Runes */}
      <g transform="translate(305, 220)">
        <rect x="0" y="0" width="44" height="40" rx="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <path d="M12 12H32C36 12 36 28 32 28H12C8 28 8 12 12 12Z" fill="#FDE68A" stroke="#1E293B" strokeWidth="2" />
        <path d="M16 18H28" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 22H24" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Orbiting Faculty Icon 4: Balance Scales / Governance */}
      <g transform="translate(65, 230)">
        <rect x="0" y="0" width="46" height="40" rx="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <path d="M23 10V30M13 14H33" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M13 14L10 22H16L13 14Z" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
        <path d="M33 14L30 22H36L33 14Z" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
      </g>

      {/* Center Character sitting with Laptop */}
      {/* Torso in Yellow Jumper */}
      <path
        d="M160 190C160 165 175 155 200 155C225 155 240 165 240 190L245 270H155L160 190Z"
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="3.5"
      />
      {/* Head */}
      <circle cx="200" cy="115" r="28" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      {/* Smart Glasses */}
      <circle cx="192" cy="116" r="6" stroke="#1E293B" strokeWidth="2.5" fill="none" />
      <circle cx="208" cy="116" r="6" stroke="#1E293B" strokeWidth="2.5" fill="none" />
      <path d="M198 116H202" stroke="#1E293B" strokeWidth="2.5" />
      <path d="M196 128C200 131 205 131 208 128" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Hair */}
      <path
        d="M175 110C175 88 188 80 200 80C215 80 225 88 225 110C218 102 210 100 200 100C188 100 180 105 175 110Z"
        fill="#1E293B"
      />
      {/* Laptop on Lap */}
      <rect x="165" y="230" width="70" height="42" rx="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
      <path d="M185 248L193 255L185 262" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M197 262H210" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 272H250" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </motion.div>
);

// Step 3: Two characters speaking with animated dialogue bubbles & broken barriers
export const Step3Scene: React.FC = () => (
  <motion.div {...floatAnimation} className="w-full flex items-center justify-center">
    <svg viewBox="0 0 400 360" className="w-full max-h-[340px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="180" r="140" fill="#FEF08A" fillOpacity="0.35" />

      {/* Left Character (Speaker) */}
      <g transform="translate(80, 120)">
        <circle cx="45" cy="40" r="24" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
        <path d="M25 35C25 20 35 15 45 15C55 15 65 20 65 35C60 30 50 28 45 28C38 28 30 30 25 35Z" fill="#1E293B" />
        <circle cx="48" cy="40" r="2.5" fill="#1E293B" />
        <path d="M44 48C48 52 53 51 55 48" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15 130V95C15 80 25 70 45 70C65 70 75 80 75 95V130H15Z" fill="#FACC15" stroke="#1E293B" strokeWidth="3.5" />
      </g>

      {/* Right Character (Listener) */}
      <g transform="translate(230, 120)">
        <circle cx="45" cy="40" r="24" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
        <path d="M25 35C25 18 35 15 45 15C55 15 65 18 65 35C58 28 50 26 45 26C38 26 30 28 25 35Z" fill="#1E293B" />
        <path d="M42 20C47 18 52 22 55 24C50 22 45 21 42 20Z" fill="#FACC15" />
        <circle cx="42" cy="40" r="2.5" fill="#1E293B" />
        <path d="M38 48C42 51 47 51 50 48" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15 130V95C15 80 25 70 45 70C65 70 75 80 75 95V130H15Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      </g>

      {/* Animated Center Speech Bubbles - Breaking the Silence */}
      <g transform="translate(150, 70)">
        <rect x="0" y="0" width="100" height="52" rx="16" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
        <path d="M20 52L14 64L30 52H20Z" fill="#FACC15" stroke="#1E293B" strokeWidth="3" strokeLinejoin="round" />
        {/* Sound Waves in Yellow Bubble */}
        <circle cx="30" cy="26" r="4" fill="#1E293B" />
        <circle cx="50" cy="26" r="4" fill="#1E293B" />
        <circle cx="70" cy="26" r="4" fill="#1E293B" />
      </g>

      {/* Small Second Bubble */}
      <g transform="translate(165, 140)">
        <rect x="0" y="0" width="70" height="34" rx="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
        <path d="M50 34L56 42L44 34H50Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 17H52" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Floating Sound Waves & Sparkles */}
      <path d="M135 150C130 155 130 165 135 170" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <path d="M125 145C118 155 118 175 125 185" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      <path d="M265 150C270 155 270 165 265 170" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </motion.div>
);

// Step 4: Character holding big yellow magnifying glass inspecting English words
export const Step4Scene: React.FC = () => (
  <motion.div {...floatAnimation} className="w-full flex items-center justify-center">
    <svg viewBox="0 0 400 360" className="w-full max-h-[340px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="180" r="140" fill="#FEF08A" fillOpacity="0.35" />

      {/* Floating Word Blocks */}
      <g transform="translate(50, 90) rotate(-8)">
        <rect width="80" height="36" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <text x="14" y="24" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          FLUENT
        </text>
      </g>

      <g transform="translate(280, 100) rotate(10)">
        <rect width="75" height="36" rx="10" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />
        <text x="14" y="24" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          SPEAK
        </text>
      </g>

      <g transform="translate(60, 230) rotate(6)">
        <rect width="85" height="36" rx="10" fill="#FDE68A" stroke="#1E293B" strokeWidth="3" />
        <text x="12" y="24" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          CREATE
        </text>
      </g>

      <g transform="translate(265, 230) rotate(-6)">
        <rect width="90" height="36" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <text x="12" y="24" fill="#1E293B" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
          SOLVE
        </text>
      </g>

      {/* Center Character */}
      {/* Body */}
      <path
        d="M165 190C165 165 180 155 205 155C230 155 245 165 245 190V280H165V190Z"
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="3.5"
      />
      {/* Head */}
      <circle cx="205" cy="115" r="28" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <path
        d="M180 110C180 90 192 82 205 82C220 82 230 90 230 110C222 104 214 102 205 102C194 102 186 106 180 110Z"
        fill="#1E293B"
      />
      <circle cx="200" cy="115" r="2.5" fill="#1E293B" />
      <circle cx="215" cy="115" r="2.5" fill="#1E293B" />
      <path d="M202 125C206 128 212 128 215 125" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Massive Golden Magnifying Glass */}
      <g transform="translate(195, 140) rotate(-20)">
        <circle cx="45" cy="45" r="38" fill="#FEF08A" fillOpacity="0.6" stroke="#1E293B" strokeWidth="4" />
        <circle cx="45" cy="45" r="28" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <path d="M72 72L105 105" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
        <path d="M72 72L105 105" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
        {/* Sparkle inside Glass */}
        <path d="M45 32L48 40L56 45L48 50L45 58L42 50L34 45L42 40L45 32Z" fill="#F59E0B" />
      </g>
    </svg>
  </motion.div>
);

// Step 5: Character holding golden trophy with clock & rising growth charts
export const Step5Scene: React.FC = () => (
  <motion.div {...floatAnimation} className="w-full flex items-center justify-center">
    <svg viewBox="0 0 400 360" className="w-full max-h-[340px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="180" r="140" fill="#FEF08A" fillOpacity="0.35" />

      {/* Rising Bar Chart Columns in Background */}
      <rect x="70" y="210" width="22" height="70" rx="6" fill="#FDE68A" stroke="#1E293B" strokeWidth="3" />
      <rect x="100" y="170" width="22" height="110" rx="6" fill="#FEF08A" stroke="#1E293B" strokeWidth="3" />
      <rect x="130" y="130" width="22" height="150" rx="6" fill="#FACC15" stroke="#1E293B" strokeWidth="3" />

      {/* Floating 20 Min Timer / Clock Icon */}
      <g transform="translate(270, 75)">
        <circle cx="34" cy="34" r="30" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
        <path d="M34 16V34L46 42" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="34" cy="34" r="4" fill="#1E293B" />
        {/* Yellow Badge Pill */}
        <rect x="10" y="58" width="48" height="18" rx="9" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
        <text x="18" y="71" fontSize="10" fontWeight="900" fill="#1E293B" fontFamily="sans-serif">
          20 MIN
        </text>
      </g>

      {/* Character Holding Golden Trophy */}
      <path
        d="M175 190C175 165 190 155 215 155C240 155 255 165 255 190V280H175V190Z"
        fill="#1E293B"
        stroke="#1E293B"
        strokeWidth="3.5"
      />
      <circle cx="215" cy="115" r="28" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <path
        d="M190 108C190 90 202 82 215 82C230 82 240 90 240 108C232 102 224 100 215 100C204 100 196 104 190 108Z"
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <circle cx="210" cy="115" r="2.5" fill="#1E293B" />
      <circle cx="225" cy="115" r="2.5" fill="#1E293B" />
      <path d="M212 125C216 129 222 129 226 125" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Golden Trophy */}
      <g transform="translate(235, 150)">
        <path
          d="M10 10H50V25C50 38 38 45 30 45C22 45 10 38 10 25V10Z"
          fill="#FACC15"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M10 16H2C0 16 0 26 5 28H10" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 16H58C60 16 60 26 55 28H50" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 45V58M20 58H40" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="30" cy="24" r="5" fill="#FFFFFF" />
      </g>
    </svg>
  </motion.div>
);

// Step 6: Celebrating character with raised hands, stars, and unlocked certificate
export const Step6Scene: React.FC = () => (
  <motion.div {...floatAnimation} className="w-full flex items-center justify-center">
    <svg viewBox="0 0 400 360" className="w-full max-h-[340px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="180" r="140" fill="#FEF08A" fillOpacity="0.4" />

      {/* Golden Radiance Rays */}
      <path d="M200 50V20M290 85L315 65M110 85L85 65" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
      <path d="M330 180H360M40 180H70" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />

      {/* Floating Stars & Confetti */}
      <path d="M120 120L123 128L132 130L123 133L120 142L117 133L108 130L117 128L120 120Z" fill="#F59E0B" />
      <path d="M290 120L293 128L302 130L293 133L290 142L287 133L278 130L287 128L290 120Z" fill="#FACC15" />
      <circle cx="100" cy="220" r="6" fill="#FACC15" />
      <circle cx="310" cy="230" r="5" fill="#FDE68A" />

      {/* Celebrating Character with Raised Arms */}
      {/* Arms Up */}
      <path d="M140 150L115 105" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="112" cy="100" r="9" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />

      <path d="M260 150L285 105" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="288" cy="100" r="9" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />

      {/* Body in Warm Yellow Celebration Outfit */}
      <path
        d="M160 180C160 155 175 145 200 145C225 145 240 155 240 180V270H160V180Z"
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="3.5"
      />
      <circle cx="200" cy="190" r="4" fill="#1E293B" />
      <circle cx="200" cy="215" r="4" fill="#1E293B" />

      {/* Head with Joyful Expression */}
      <circle cx="200" cy="105" r="28" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
      <path
        d="M175 100C175 80 188 72 200 72C215 72 225 80 225 100C218 94 210 92 200 92C188 92 180 96 175 100Z"
        fill="#1E293B"
      />
      {/* Happy Closed Curve Eyes ^ ^ */}
      <path d="M190 105C193 100 198 100 201 105" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M208 105C211 100 216 100 219 105" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Big Smile */}
      <path d="M195 118C200 126 210 126 215 118" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

      {/* Official Certificate Scroll in Front */}
      <g transform="translate(155, 230)">
        <rect width="90" height="55" rx="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        <path d="M16 14H74" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 24H58" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 32H48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        {/* Golden Wax Seal */}
        <circle cx="68" cy="36" r="9" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
        <path d="M68 32V40" stroke="#1E293B" strokeWidth="1.5" />
      </g>
    </svg>
  </motion.div>
);

