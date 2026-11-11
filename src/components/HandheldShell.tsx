import React from 'react';
import { ShellColor } from '../types/pet';
import { soundFx } from '../utils/audio';

interface HandheldShellProps {
  color: ShellColor;
  onButtonA: () => void;
  onButtonB: () => void;
  onButtonC: () => void;
  children: React.ReactNode;
}

export const HandheldShell: React.FC<HandheldShellProps> = ({
  color,
  onButtonA,
  onButtonB,
  onButtonC,
  children,
}) => {
  // Color presets for shell plastic
  const shellGradients: Record<ShellColor, { body: string; border: string; accent: string }> = {
    teal: {
      body: 'from-emerald-400 via-teal-500 to-teal-700',
      border: 'border-teal-700',
      accent: 'text-teal-900',
    },
    pink: {
      body: 'from-pink-400 via-rose-500 to-pink-700',
      border: 'border-pink-800',
      accent: 'text-rose-950',
    },
    yellow: {
      body: 'from-amber-300 via-yellow-400 to-amber-600',
      border: 'border-amber-700',
      accent: 'text-amber-950',
    },
    purple: {
      body: 'from-purple-400 via-violet-500 to-purple-800',
      border: 'border-purple-900',
      accent: 'text-purple-950',
    },
    cream: {
      body: 'from-stone-100 via-stone-200 to-stone-400',
      border: 'border-stone-500',
      accent: 'text-stone-800',
    },
    black: {
      body: 'from-neutral-700 via-neutral-800 to-neutral-950',
      border: 'border-neutral-950',
      accent: 'text-neutral-300',
    },
  };

  const currentTheme = shellGradients[color];

  const handlePressA = () => {
    soundFx.playButtonBeep();
    onButtonA();
  };

  const handlePressB = () => {
    soundFx.playSelectBeep();
    onButtonB();
  };

  const handlePressC = () => {
    soundFx.playCancelBeep();
    onButtonC();
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[340px]">
      {/* Keychain Loop on Top Left */}
      <div className="absolute -top-6 left-6 flex flex-col items-center z-0 pointer-events-none">
        <div className="w-8 h-8 rounded-full border-4 border-stone-300 shadow-md flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-stone-400" />
        </div>
        <div className="w-2.5 h-4 bg-stone-300 rounded-xs border border-stone-400 shadow-xs -mt-1" />
      </div>

      {/* Egg-shaped Tamagotchi Outer Shell */}
      <div
        className={`w-full bg-gradient-to-b ${currentTheme.body} rounded-[68px_68px_80px_80px] p-5 pb-7 border-4 ${currentTheme.border} handheld-shell relative transition-all duration-300`}
      >
        {/* Tamagotchi Retro Brand Logo */}
        <div className="flex items-center justify-between px-3 pt-1 pb-3">
          <div className="flex items-center gap-1">
            <span className="font-pixel text-[9px] font-bold tracking-widest text-white drop-shadow-md">
              TAMAPET
            </span>
            <span className="text-[9px] text-amber-300 font-pixel">★</span>
          </div>

          {/* Sound Speaker Grill */}
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-black/40 shadow-inner" />
            <span className="w-1.5 h-1.5 rounded-full bg-black/40 shadow-inner" />
            <span className="w-1.5 h-1.5 rounded-full bg-black/40 shadow-inner" />
          </div>
        </div>

        {/* LCD Screen Inner Frame */}
        <div className="bg-stone-900 rounded-3xl p-3 border-2 border-black/30 shadow-inner">
          {children}
        </div>

        {/* Decorative Shell Lines */}
        <div className="flex justify-between px-6 pt-3">
          <span className="text-[8px] font-pixel text-white/70">BANDAI STYLE</span>
          <span className="text-[8px] font-pixel text-white/70">GEN 1</span>
        </div>

        {/* 3 Physical Tactile Buttons */}
        <div className="flex items-center justify-around px-2 pt-4">
          {/* Button A: Select */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={handlePressA}
              aria-label="버튼 A: 메뉴 선택"
              className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-800 retro-btn flex items-center justify-center cursor-pointer active:scale-95"
            >
              <div className="w-4 h-4 rounded-full bg-amber-300/40" />
            </button>
            <span className="font-pixel text-[9px] text-white font-bold drop-shadow-sm">
              A (선택)
            </span>
          </div>

          {/* Button B: Execute */}
          <div className="flex flex-col items-center gap-1.5 -translate-y-1">
            <button
              type="button"
              onClick={handlePressB}
              aria-label="버튼 B: 실행"
              className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-800 retro-btn flex items-center justify-center cursor-pointer active:scale-95"
            >
              <div className="w-5 h-5 rounded-full bg-amber-300/40" />
            </button>
            <span className="font-pixel text-[9px] text-white font-bold drop-shadow-sm">
              B (실행)
            </span>
          </div>

          {/* Button C: Cancel */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={handlePressC}
              aria-label="버튼 C: 취소 및 상태"
              className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-800 retro-btn flex items-center justify-center cursor-pointer active:scale-95"
            >
              <div className="w-4 h-4 rounded-full bg-amber-300/40" />
            </button>
            <span className="font-pixel text-[9px] text-white font-bold drop-shadow-sm">
              C (취소)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
