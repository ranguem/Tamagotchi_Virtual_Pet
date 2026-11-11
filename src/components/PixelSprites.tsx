import React from 'react';
import { PetStage, AdultForm, PetStats } from '../types/pet';

interface PixelPetSpriteProps {
  stage: PetStage;
  adultForm?: AdultForm;
  eggType?: 'classic' | 'star' | 'dino';
  stats: PetStats;
  isSleeping: boolean;
  isSick: boolean;
  action: string;
  isPetting?: boolean;
}

export const PixelPetSprite: React.FC<PixelPetSpriteProps> = ({
  stage,
  adultForm = 'ANGEL',
  eggType = 'classic',
  stats,
  isSleeping,
  isSick,
  action,
  isPetting = false,
}) => {
  // Determine pet emotion state
  const isHungry = stats.hunger < 30;
  const isDirty = stats.cleanliness < 35;
  const isSad = stats.happiness < 30;
  const isEating = action === 'EATING';
  const isBathing = action === 'BATHING';
  const isLevelUp = action === 'LEVEL_UP';
  const isPlaying = action === 'PLAYING';

  // 1. EGG STAGE
  if (stage === 'EGG') {
    return (
      <div className="relative flex flex-col items-center justify-center animate-egg-shake select-none">
        <svg width="64" height="80" viewBox="0 0 16 20" className="w-20 h-24 drop-shadow-sm">
          {/* Egg Outer Silhouette */}
          <path
            d="M5 1h6v1h2v2h1v4h1v6h-1v3h-1v1h-2v1H5v-1H3v-1H2v-3H1V8h1V4h1V2h2V1z"
            fill="currentColor"
            className="text-stone-900"
          />
          {/* Egg Shell Body */}
          <path
            d="M5 2h6v1h2v2h1v4h0v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H2V9h0V5h1V3h2V2z"
            fill="#e2e8f0"
          />
          {/* Egg Patterns based on type */}
          {eggType === 'star' && (
            <>
              {/* Star pattern */}
              <rect x="7" y="5" width="2" height="4" fill="#fbbf24" />
              <rect x="6" y="6" width="4" height="2" fill="#fbbf24" />
              <rect x="4" y="11" width="2" height="2" fill="#fbbf24" />
              <rect x="10" y="11" width="2" height="2" fill="#fbbf24" />
            </>
          )}
          {eggType === 'dino' && (
            <>
              {/* Spots */}
              <rect x="4" y="6" width="3" height="3" fill="#10b981" />
              <rect x="9" y="8" width="3" height="3" fill="#10b981" />
              <rect x="5" y="12" width="2" height="3" fill="#10b981" />
            </>
          )}
          {eggType === 'classic' && (
            <>
              {/* Classic zig zag stripe */}
              <path
                d="M3 10l2-2 2 2 2-2 2 2 2-2v2l-2 2-2-2-2 2-2-2-2 2z"
                fill="#f43f5e"
              />
            </>
          )}
          {/* Crack line */}
          <path
            d="M8 3v3l2 2-1 3 2 2"
            stroke="#1c1917"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
        <span className="font-pixel text-[9px] mt-1 text-stone-800 tracking-wider animate-pulse">
          TAP TO HATCH!
        </span>
      </div>
    );
  }

  // Expression logic
  const renderEyes = () => {
    if (isSleeping) {
      // Closed resting eyes - -
      return (
        <>
          <rect x="5" y="8" width="3" height="1" fill="#1c1917" />
          <rect x="12" y="8" width="3" height="1" fill="#1c1917" />
        </>
      );
    }
    if (isSick) {
      // Swirly dizzy eyes x x
      return (
        <>
          <path d="M5 7l3 3m0-3l-3 3" stroke="#1c1917" strokeWidth="1" />
          <path d="M12 7l3 3m0-3l-3 3" stroke="#1c1917" strokeWidth="1" />
        </>
      );
    }
    if (isEating) {
      // Chewing blinking eyes ^ ^
      return (
        <>
          <path d="M5 9l1-2 1 2" stroke="#1c1917" strokeWidth="1" fill="none" />
          <path d="M13 9l1-2 1 2" stroke="#1c1917" strokeWidth="1" fill="none" />
        </>
      );
    }
    if (isPetting || isPlaying || isLevelUp || (!isHungry && !isSad && !isDirty)) {
      // Happy cheerful eyes ^ ^ or bright dot eyes
      return (
        <>
          <rect x="5" y="7" width="2" height="3" fill="#1c1917" />
          <rect x="5" y="7" width="1" height="1" fill="#ffffff" />
          <rect x="13" y="7" width="2" height="3" fill="#1c1917" />
          <rect x="13" y="7" width="1" height="1" fill="#ffffff" />
          {/* Cheerful blush */}
          <rect x="3" y="10" width="2" height="1" fill="#f43f5e" opacity="0.7" />
          <rect x="15" y="10" width="2" height="1" fill="#f43f5e" opacity="0.7" />
        </>
      );
    }
    // Sad or hungry droopy eyes
    return (
      <>
        <rect x="5" y="8" width="2" height="2" fill="#1c1917" />
        <rect x="13" y="8" width="2" height="2" fill="#1c1917" />
        {/* Tear drop if very sad */}
        {isSad && <rect x="4" y="10" width="1" height="2" fill="#38bdf8" />}
      </>
    );
  };

  const renderMouth = () => {
    if (isSleeping) {
      return <rect x="9" y="10" width="2" height="1" fill="#1c1917" />;
    }
    if (isEating) {
      // Open chewing mouth
      return (
        <>
          <rect x="8" y="10" width="4" height="2" fill="#1c1917" />
          <rect x="9" y="11" width="2" height="1" fill="#ef4444" />
        </>
      );
    }
    if (isSick || isSad || isHungry) {
      // Inverted sad frown
      return <path d="M8 11h4M8 12h1m2 0h1" stroke="#1c1917" strokeWidth="0.8" />;
    }
    // Smiling mouth :3
    return (
      <path
        d="M8 10h4v1h-1v1h-2v-1h-1z"
        fill="#1c1917"
      />
    );
  };

  // 2. BABY STAGE (Piyo / Chick Blob)
  if (stage === 'BABY') {
    return (
      <div className={`relative flex flex-col items-center justify-center select-none ${isEating ? 'animate-eat' : 'animate-idle'}`}>
        <svg width="72" height="72" viewBox="0 0 20 20" className="w-20 h-20">
          {/* Outer Outline */}
          <path
            d="M6 3h8v1h2v2h1v8h-1v2h-2v1H6v-1H4v-2H3V6h1V4h2V3z"
            fill="#1c1917"
          />
          {/* Main Body (Soft Yellow) */}
          <path
            d="M6 4h8v2h2v8h-2v1h-1v1H7v-1H5v-1H4V6h2V4z"
            fill="#fde047"
          />
          {/* Belly Highlight */}
          <path d="M7 11h6v3H7z" fill="#fef08a" />
          {/* Tiny Chick Wings */}
          <rect x="2" y="9" width="2" height="3" fill="#eab308" />
          <rect x="16" y="9" width="2" height="3" fill="#eab308" />
          {/* Feet */}
          <rect x="6" y="17" width="2" height="1" fill="#f97316" />
          <rect x="12" y="17" width="2" height="1" fill="#f97316" />
          {/* Features */}
          {renderEyes()}
          {renderMouth()}
          {/* Cute Little Tuft */}
          <rect x="9" y="1" width="2" height="2" fill="#eab308" />
        </svg>
      </div>
    );
  }

  // 3. CHILD STAGE (Bouncing Bunny / Kitten)
  if (stage === 'CHILD') {
    return (
      <div className={`relative flex flex-col items-center justify-center select-none ${isEating ? 'animate-eat' : 'animate-idle'}`}>
        <svg width="80" height="80" viewBox="0 0 22 22" className="w-22 h-22">
          {/* Bunny Ears Outline */}
          <path
            d="M5 2h3v5h1V5h1V2h3v5h1v7h-1v2h-1v1h-1v1H9v-1H8v-1H7v-2H6V7h1V2H5z"
            fill="#1c1917"
          />
          {/* Ears Fill */}
          <rect x="5" y="3" width="2" height="4" fill="#fbcfe8" />
          <rect x="13" y="3" width="2" height="4" fill="#fbcfe8" />
          {/* Head & Body (Soft Pinkish White) */}
          <path
            d="M6 8h10v6h-1v2h-1v1H8v-1H7v-2H6V8z"
            fill="#f8fafc"
          />
          {/* Paws */}
          <rect x="5" y="16" width="3" height="2" fill="#1c1917" />
          <rect x="14" y="16" width="3" height="2" fill="#1c1917" />
          {/* Belly */}
          <rect x="8" y="12" width="6" height="3" fill="#fed7aa" />
          {/* Eyes & Mouth */}
          {renderEyes()}
          {renderMouth()}
        </svg>
      </div>
    );
  }

  // 4. TEEN STAGE (Active Teen with Headset / Cap)
  if (stage === 'TEEN') {
    return (
      <div className={`relative flex flex-col items-center justify-center select-none ${isEating ? 'animate-eat' : 'animate-idle'}`}>
        <svg width="84" height="84" viewBox="0 0 22 22" className="w-24 h-24">
          {/* Cap / Visor */}
          <path d="M5 3h10v2h4v1H5V3z" fill="#0284c7" />
          <path d="M4 5h14v1H4z" fill="#0369a1" />
          {/* Head & Body Outline */}
          <path
            d="M4 6h14v1h1v8h-1v2h-2v1H6v-1H4v-2H3V7h1V6z"
            fill="#1c1917"
          />
          {/* Body Skin */}
          <path
            d="M5 7h12v7h-1v2h-2v1H8v-1H6v-2H5V7z"
            fill="#a7f3d0"
          />
          {/* Cool shirt stripe */}
          <rect x="5" y="13" width="12" height="2" fill="#047857" />
          {/* Feet / Sneakers */}
          <rect x="5" y="17" width="4" height="2" fill="#ef4444" />
          <rect x="13" y="17" width="4" height="2" fill="#ef4444" />
          {renderEyes()}
          {renderMouth()}
        </svg>
      </div>
    );
  }

  // 5. ADULT STAGE (Unique Special Evolution Forms)
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${isEating ? 'animate-eat' : 'animate-idle'}`}>
      <svg width="90" height="90" viewBox="0 0 24 24" className="w-26 h-26">
        {adultForm === 'ANGEL' && (
          <>
            {/* Halo */}
            <rect x="8" y="1" width="8" height="2" fill="#fbbf24" stroke="#1c1917" strokeWidth="0.6" />
            {/* Angel Wings */}
            <path d="M1 8h3v5H1zm19 0h3v5h-3z" fill="#ffffff" stroke="#1c1917" strokeWidth="0.8" />
            {/* Main Body Outline */}
            <path d="M5 5h14v11h-2v2h-2v1H9v-1H7v-2H5V5z" fill="#1c1917" />
            <path d="M6 6h12v9h-2v2h-2v1h-4v-1H8v-2H6V6z" fill="#e0e7ff" />
            {/* Robe Sash */}
            <rect x="7" y="12" width="10" height="2" fill="#818cf8" />
          </>
        )}

        {adultForm === 'NINJA' && (
          <>
            {/* Ninja Headband */}
            <rect x="4" y="3" width="16" height="3" fill="#dc2626" />
            <rect x="10" y="3" width="4" height="3" fill="#f8fafc" />
            {/* Scarf tails */}
            <path d="M19 4h4v2h-3v3h-1z" fill="#dc2626" />
            {/* Dark Ninja suit */}
            <path d="M5 5h14v11h-2v2h-2v1H9v-1H7v-2H5V5z" fill="#1c1917" />
            <path d="M6 6h12v9h-2v2h-2v1h-4v-1H8v-2H6V6z" fill="#334155" />
            {/* Eye mask slot */}
            <rect x="5" y="7" width="14" height="4" fill="#fed7aa" />
          </>
        )}

        {adultForm === 'CHEF' && (
          <>
            {/* Chef Hat */}
            <path d="M7 1h10v4h2v2H5V5h2V1z" fill="#ffffff" stroke="#1c1917" strokeWidth="0.8" />
            {/* Body */}
            <path d="M5 6h14v11h-2v2h-2v1H9v-1H7v-2H5V6z" fill="#1c1917" />
            <path d="M6 7h12v9h-2v2h-2v1h-4v-1H8v-2H6V7z" fill="#fed7aa" />
            {/* Red neckerchief */}
            <polygon points="12,12 9,9 15,9" fill="#ef4444" />
            {/* Holding tiny spoon */}
            <rect x="19" y="8" width="1" height="6" fill="#94a3b8" />
            <circle cx="19.5" cy="7.5" r="1.5" fill="#94a3b8" />
          </>
        )}

        {adultForm === 'DRAGON' && (
          <>
            {/* Horns */}
            <polygon points="5,1 7,5 4,5" fill="#f59e0b" stroke="#1c1917" strokeWidth="0.6" />
            <polygon points="19,1 20,5 17,5" fill="#f59e0b" stroke="#1c1917" strokeWidth="0.6" />
            {/* Body */}
            <path d="M5 5h14v11h-2v2h-2v1H9v-1H7v-2H5V5z" fill="#1c1917" />
            <path d="M6 6h12v9h-2v2h-2v1h-4v-1H8v-2H6V6z" fill="#10b981" />
            {/* Belly Scales */}
            <rect x="8" y="11" width="8" height="4" fill="#fef08a" />
            {/* Dragon Tail */}
            <path d="M19 14h3v2h-1v2h-2z" fill="#10b981" stroke="#1c1917" strokeWidth="0.6" />
          </>
        )}

        {/* Universal Eyes & Mouth */}
        {renderEyes()}
        {renderMouth()}
        {/* Feet */}
        <rect x="6" y="19" width="3" height="2" fill="#1c1917" />
        <rect x="15" y="19" width="3" height="2" fill="#1c1917" />
      </svg>
    </div>
  );
};

// Poop Sprite
export const PoopSprite: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
        <div key={i} className="relative select-none animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
          <svg width="24" height="24" viewBox="0 0 16 16" className="w-6 h-6">
            {/* Steam lines */}
            <path d="M7 1v1m2-1v1" stroke="#78350f" strokeWidth="0.8" />
            {/* Poop swirl tiers */}
            <path
              d="M7 3h2v2H7z M5 5h6v3H5z M3 8h10v4H3z M2 12h12v2H2z"
              fill="#78350f"
            />
            {/* Highlights */}
            <rect x="4" y="9" width="2" height="1" fill="#a16207" />
            <rect x="6" y="6" width="1" height="1" fill="#a16207" />
            {/* Cute eyes */}
            <rect x="5" y="10" width="1" height="1" fill="#ffffff" />
            <rect x="9" y="10" width="1" height="1" fill="#ffffff" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Food Sprites
export const FoodSprite: React.FC<{ type: 'onigiri' | 'cake' | 'apple' | 'burger' }> = ({ type }) => {
  if (type === 'cake') {
    return (
      <svg width="24" height="24" viewBox="0 0 16 16" className="w-6 h-6 animate-pulse">
        {/* Candle & flame */}
        <rect x="7" y="1" width="2" height="1" fill="#ef4444" />
        <rect x="7" y="2" width="2" height="2" fill="#fde047" />
        {/* Cake slice body */}
        <path d="M3 5h10v3H3z" fill="#fbcfe8" />
        <path d="M3 8h10v5H3z" fill="#fcd34d" />
        {/* Cream frosting drops */}
        <rect x="5" y="8" width="2" height="2" fill="#ffffff" />
        <rect x="9" y="8" width="2" height="2" fill="#ffffff" />
      </svg>
    );
  }
  if (type === 'apple') {
    return (
      <svg width="24" height="24" viewBox="0 0 16 16" className="w-6 h-6 animate-pulse">
        <rect x="8" y="1" width="1" height="3" fill="#78350f" />
        <rect x="9" y="2" width="2" height="1" fill="#22c55e" />
        <path d="M4 4h8v8H4z" fill="#ef4444" />
        <rect x="5" y="5" width="2" height="2" fill="#fca5a5" />
      </svg>
    );
  }
  if (type === 'burger') {
    return (
      <svg width="24" height="24" viewBox="0 0 16 16" className="w-6 h-6 animate-pulse">
        <path d="M4 3h8v3H4z" fill="#d97706" />
        <rect x="3" y="6" width="10" height="2" fill="#22c55e" />
        <rect x="3" y="8" width="10" height="2" fill="#78350f" />
        <rect x="3" y="10" width="10" height="2" fill="#facc15" />
        <path d="M4 12h8v2H4z" fill="#d97706" />
      </svg>
    );
  }
  // Default: Onigiri
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" className="w-6 h-6 animate-pulse">
      {/* Triangle Rice */}
      <polygon points="8,2 14,13 2,13" fill="#ffffff" stroke="#1c1917" strokeWidth="0.8" />
      {/* Nori Seaweed */}
      <rect x="6" y="9" width="4" height="4" fill="#1c1917" />
    </svg>
  );
};
