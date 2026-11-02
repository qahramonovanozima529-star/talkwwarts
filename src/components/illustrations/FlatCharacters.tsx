import React from "react";

// @mchlabs Modern Flat Vector Character & Icon Illustrations
// Style: Crisp black borders (#1A1A1A), warm yellow/amber fills (#FFB800), vintage cream fills (#FFFDF9)

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// 1. School Student with Book & Magic Sparkle (13-17 yosh)
export const StudentBookIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background yellow soft circle */}
    <circle cx="40" cy="40" r="34" fill="#FFB800" fillOpacity="0.2" />
    
    {/* Body / Sweater */}
    <path
      d="M26 68C26 56 32 50 40 50C48 50 54 56 54 68"
      fill="#FFFDF9"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Yellow Tie / Scarf */}
    <path d="M38 50L40 60L42 50" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Head & Neck */}
    <circle cx="40" cy="34" r="14" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2.5" />
    
    {/* Hair with yellow highlight */}
    <path
      d="M28 32C28 22 34 18 40 18C47 18 52 22 52 30C50 28 46 27 43 27C37 27 33 29 28 32Z"
      fill="#1A1A1A"
    />
    <path d="M36 21C38 19 43 19 45 22C43 21 39 21 36 21Z" fill="#FFB800" />
    
    {/* Glasses */}
    <circle cx="35" cy="35" r="4.5" fill="none" stroke="#1A1A1A" strokeWidth="2" />
    <circle cx="45" cy="35" r="4.5" fill="none" stroke="#1A1A1A" strokeWidth="2" />
    <path d="M39.5 35H40.5" stroke="#1A1A1A" strokeWidth="2" />
    {/* Smile */}
    <path d="M38 42C39 43.5 41 43.5 42 42" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    
    {/* Open Book in hands */}
    <path
      d="M26 62L40 58L54 62L52 70L40 66L28 70L26 62Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M40 58V66" stroke="#1A1A1A" strokeWidth="2" />

    {/* Magic Sparkle */}
    <path
      d="M62 24L64 18L66 24L72 26L66 28L64 34L62 28L56 26L62 24Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="1.5"
    />
  </svg>
);

// 2. University Student / Young Specialist with Laptop (18-24 yosh)
export const StudentLaptopIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="34" fill="#FFB800" fillOpacity="0.2" />

    {/* Body */}
    <path
      d="M24 70C24 57 31 51 40 51C49 51 56 57 56 70"
      fill="#FFFDF9"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Head */}
    <circle cx="40" cy="32" r="13" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2.5" />

    {/* Modern Hair */}
    <path
      d="M28 28C28 20 33 16 40 16C48 16 53 20 53 28C49 25 43 24 39 24C34 24 30 26 28 28Z"
      fill="#1A1A1A"
    />

    {/* Eyes & Smile */}
    <circle cx="36" cy="33" r="1.5" fill="#1A1A1A" />
    <circle cx="44" cy="33" r="1.5" fill="#1A1A1A" />
    <path d="M37 39C39 41 41 41 43 39" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

    {/* Laptop */}
    <path
      d="M27 60H53L51 70H29L27 60Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M31 60L36 50H44L49 60" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2" />
    {/* Laptop sticker */}
    <circle cx="40" cy="55" r="2" fill="#1A1A1A" />

    {/* Floating Speech Bubble */}
    <g transform="translate(48, 12)">
      <path
        d="M0 6C0 2.7 2.7 0 6 0H18C21.3 0 24 2.7 24 6V12C24 15.3 21.3 18 18 18H8L2 22V17C0.8 15.8 0 14 0 12V6Z"
        fill="#FFB800"
        stroke="#1A1A1A"
        strokeWidth="1.8"
      />
      <circle cx="7" cy="9" r="1.5" fill="#1A1A1A" />
      <circle cx="12" cy="9" r="1.5" fill="#1A1A1A" />
      <circle cx="17" cy="9" r="1.5" fill="#1A1A1A" />
    </g>
  </svg>
);

// 3. Career Professional with Chart / Global Dialogue (25-34 yosh)
export const ProfessionalIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="34" fill="#FFB800" fillOpacity="0.2" />

    {/* Chart bars in background */}
    <rect x="54" y="24" width="6" height="24" rx="2" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1.5" />
    <rect x="62" y="16" width="6" height="32" rx="2" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1.5" />
    <path d="M50 32L57 23L65 14" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

    {/* Body with Blazer */}
    <path
      d="M22 68C22 55 29 48 38 48C47 48 54 55 54 68"
      fill="#1A1A1A"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Inner Shirt & Yellow Tie */}
    <path d="M34 48L38 58L42 48" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="1.5" />
    <path d="M37 54L38 64L39 54" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1.5" />

    {/* Head & Confident Hair */}
    <circle cx="38" cy="31" r="12" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2.5" />
    <path
      d="M27 28C27 19 33 16 38 16C44 16 49 19 49 28C46 25 41 24 37 24C32 24 29 26 27 28Z"
      fill="#1A1A1A"
    />

    {/* Eyes & Smile */}
    <path d="M33 30L36 30" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M41 30L44 30" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M35 36C37 38 40 38 42 36" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

    {/* Star badge */}
    <circle cx="28" cy="56" r="3.5" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1.5" />
  </svg>
);

// 4. Lifelong Scholar / Fluent Speaker (35+ yosh)
export const ScholarIllustration: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="34" fill="#FFB800" fillOpacity="0.2" />

    {/* Body */}
    <path
      d="M26 68C26 56 32 50 40 50C48 50 54 56 54 68"
      fill="#FFFDF9"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Head */}
    <circle cx="40" cy="32" r="13" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2.5" />

    {/* Classic sleek hair */}
    <path
      d="M28 29C28 20 34 17 40 17C46 17 52 20 52 29C48 26 44 26 40 26C36 26 31 27 28 29Z"
      fill="#1A1A1A"
    />

    {/* Round Glasses */}
    <circle cx="36" cy="32" r="3.5" fill="none" stroke="#1A1A1A" strokeWidth="1.8" />
    <circle cx="44" cy="32" r="3.5" fill="none" stroke="#1A1A1A" strokeWidth="1.8" />
    <path d="M39.5 32H40.5" stroke="#1A1A1A" strokeWidth="1.8" />
    {/* Warm Smile */}
    <path d="M37 38C39 40 41 40 43 38" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

    {/* Magnifying Glass with Golden Lens */}
    <circle cx="56" cy="44" r="8" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2" />
    <path d="M62 50L69 57" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
    <path d="M54 42L58 46" stroke="#FFFDF9" strokeWidth="2" strokeLinecap="round" />

    {/* Golden Laurel Leaf */}
    <path
      d="M22 42C20 38 22 34 26 33C25 36 26 40 22 42Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="1.5"
    />
  </svg>
);

// 5. Herbology & Potions Faculty Illustration
export const HerbologyIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FFB800" fillOpacity="0.15" />
    {/* Flask */}
    <path
      d="M26 14H38V22L46 38C48 42 45 48 40 48H24C19 48 16 42 18 38L26 22V14Z"
      fill="#FFFDF9"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Potion level in yellow */}
    <path
      d="M21 39L25 31H39L43 39C45 43 42 46 38 46H26C22 46 19 43 21 39Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="1.5"
    />
    {/* Sprouting magical leaf */}
    <path
      d="M32 14V6C32 6 38 7 40 12C37 12 34 13 32 14Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="40" r="1.5" fill="#FFFDF9" />
    <circle cx="34" cy="35" r="2" fill="#FFFDF9" />
  </svg>
);

// 6. Techno-Alchemy Faculty Illustration
export const TechnoAlchemyIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FFB800" fillOpacity="0.15" />
    {/* Laptop screen */}
    <rect x="14" y="16" width="36" height="24" rx="3" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2.5" />
    <path d="M10 42H54L50 48H14L10 42Z" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round" />
    {/* Code Braces < > and Lightning Bolt */}
    <path d="M22 24L18 28L22 32" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 24L46 28L42 32" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M33 21L28 29H34L31 36L38 27H32L33 21Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// 7. Ancient Runes Faculty Illustration
export const AncientRunesIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FFB800" fillOpacity="0.15" />
    {/* Scroll */}
    <path
      d="M18 18C18 14 22 14 26 14H46C50 14 50 18 46 18V44C46 48 42 48 38 48H18C14 48 14 44 18 44V18Z"
      fill="#FFFDF9"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Rune symbols on scroll */}
    <path d="M24 24H38" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 30H34" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 36H36" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    {/* Wax seal */}
    <circle cx="42" cy="38" r="6" fill="#FFB800" stroke="#1A1A1A" strokeWidth="2" />
    <path d="M40 38L44 38" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 8. Magical Governance Faculty Illustration
export const MagicalGovernanceIllustration: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FFB800" fillOpacity="0.15" />
    {/* Balance pillar */}
    <path d="M32 14V46" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 18H44" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 46H40" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Left bowl */}
    <path d="M20 18L15 28H25L20 18Z" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="20" cy="27" r="3" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1.5" />
    {/* Right bowl */}
    <path d="M44 18L39 28H49L44 18Z" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="44" cy="27" r="3" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1.5" />
  </svg>
);

// 9. Trophy Character Illustration (Acceptance Screen)
export const TrophyCharacterIllustration: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Yellow glow */}
    <circle cx="50" cy="50" r="42" fill="#FFB800" fillOpacity="0.25" />

    {/* Person */}
    <path
      d="M32 82C32 68 40 60 50 60C60 60 68 68 68 82"
      fill="#FFFDF9"
      stroke="#1A1A1A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="50" cy="40" r="14" fill="#FFFDF9" stroke="#1A1A1A" strokeWidth="2.5" />
    <path
      d="M38 36C38 26 44 22 50 22C57 22 62 26 62 36C58 32 54 31 50 31C46 31 41 33 38 36Z"
      fill="#1A1A1A"
    />
    <circle cx="45" cy="41" r="1.5" fill="#1A1A1A" />
    <circle cx="55" cy="41" r="1.5" fill="#1A1A1A" />
    <path d="M46 47C48 49 52 49 54 47" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

    {/* Golden Trophy Cup */}
    <path
      d="M60 48H80V58C80 64 74 68 70 68C66 68 60 64 60 58V48Z"
      fill="#FFB800"
      stroke="#1A1A1A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M60 52H55C53 52 53 56 55 58H60" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M80 52H85C87 52 87 56 85 58H80" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M70 68V76M64 76H76" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />

    {/* Confetti / Stars */}
    <path d="M22 28L24 22L26 28L32 30L26 32L24 38L22 32L16 30L22 28Z" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1" />
    <circle cx="82" cy="24" r="3" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1" />
    <circle cx="20" cy="58" r="2.5" fill="#FFB800" stroke="#1A1A1A" strokeWidth="1" />
  </svg>
);

