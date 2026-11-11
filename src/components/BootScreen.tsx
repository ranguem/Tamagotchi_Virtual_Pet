import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';

interface BootScreenProps {
  onStartGame: (name: string, eggType: 'classic' | 'star' | 'dino') => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onStartGame }) => {
  const [step, setStep] = useState<'BIOS' | 'SELECT' | 'READY'>('BIOS');
  const [biosLogs, setBiosLogs] = useState<string[]>([]);
  const [petName, setPetName] = useState('쿠키');
  const [selectedEgg, setSelectedEgg] = useState<'classic' | 'star' | 'dino'>('classic');

  // Simulated retro BIOS boot sequence
  useEffect(() => {
    const sequence = [
      'TAMAPET SYSTEM BIOS v1.997',
      'CHECKING SYSTEM ROM... 64KB OK',
      'CHECKING 8-BIT SOUND CHIP... OK',
      'INITIALIZING PIXEL ENGINE...',
      'TAMAGOTCHI VIRTUAL PET READY!'
    ];

    let currentIdx = 0;
    const timer = setInterval(() => {
      if (currentIdx < sequence.length) {
        setBiosLogs((prev) => [...prev, sequence[currentIdx]]);
        soundFx.playSelectBeep();
        currentIdx++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setStep('SELECT');
          soundFx.playHappy();
        }, 600);
      }
    }, 380);

    return () => clearInterval(timer);
  }, []);

  const handleEggSelect = (type: 'classic' | 'star' | 'dino') => {
    soundFx.playSelectBeep();
    setSelectedEgg(type);
  };

  const handleStart = () => {
    soundFx.playLevelUp();
    onStartGame(petName.trim() || '쿠키', selectedEgg);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center">
      {/* Handheld Device Framing */}
      <div className="w-full bg-slate-800 rounded-3xl p-5 border-4 border-slate-700 shadow-2xl">
        {/* Device Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
          <span className="font-pixel text-[10px] text-amber-400 tracking-wider">
            TAMAPET · 1997
          </span>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-xs" />
          </div>
        </div>

        {/* LCD Screen Display */}
        <div className="lcd-screen lcd-scanlines rounded-xl p-4 min-h-[300px] flex flex-col justify-between border-2 border-stone-800/40">
          {step === 'BIOS' && (
            <div className="flex flex-col gap-2 font-pixel text-[10px] leading-relaxed text-stone-900 tracking-wide py-2">
              {biosLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-stone-700">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 animate-pulse">
                <span className="text-stone-700">&gt;</span>
                <span className="w-2 h-3 bg-stone-900 inline-block" />
              </div>
            </div>
          )}

          {step === 'SELECT' && (
            <div className="flex flex-col items-center justify-between h-full py-2">
              <div className="text-center">
                <h2 className="font-pixel text-xs text-stone-900 mb-1">
                  ★ TAMAGOTCHI PET ★
                </h2>
                <p className="font-vt text-lg text-stone-700">
                  나만의 레트로 펫 알을 선택하세요
                </p>
              </div>

              {/* Egg Choices */}
              <div className="grid grid-cols-3 gap-3 my-3 w-full">
                {/* Classic Egg */}
                <button
                  type="button"
                  onClick={() => handleEggSelect('classic')}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 transition-transform cursor-pointer ${
                    selectedEgg === 'classic'
                      ? 'border-stone-900 bg-black/10 scale-105'
                      : 'border-transparent hover:bg-black/5 opacity-70'
                  }`}
                >
                  <svg width="32" height="40" viewBox="0 0 16 20" className="w-8 h-10">
                    <path
                      d="M5 1h6v1h2v2h1v4h1v6h-1v3h-1v1h-2v1H5v-1H3v-1H2v-3H1V8h1V4h1V2h2V1z"
                      fill="#1c1917"
                    />
                    <path
                      d="M5 2h6v2h2v4h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V8h1V4h1V2h2z"
                      fill="#f43f5e"
                    />
                  </svg>
                  <span className="font-pixel text-[8px] mt-1.5 text-stone-900">클래식 알</span>
                </button>

                {/* Star Egg */}
                <button
                  type="button"
                  onClick={() => handleEggSelect('star')}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 transition-transform cursor-pointer ${
                    selectedEgg === 'star'
                      ? 'border-stone-900 bg-black/10 scale-105'
                      : 'border-transparent hover:bg-black/5 opacity-70'
                  }`}
                >
                  <svg width="32" height="40" viewBox="0 0 16 20" className="w-8 h-10">
                    <path
                      d="M5 1h6v1h2v2h1v4h1v6h-1v3h-1v1h-2v1H5v-1H3v-1H2v-3H1V8h1V4h1V2h2V1z"
                      fill="#1c1917"
                    />
                    <path
                      d="M5 2h6v2h2v4h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V8h1V4h1V2h2z"
                      fill="#e0e7ff"
                    />
                    <rect x="7" y="5" width="2" height="4" fill="#fbbf24" />
                    <rect x="6" y="6" width="4" height="2" fill="#fbbf24" />
                  </svg>
                  <span className="font-pixel text-[8px] mt-1.5 text-stone-900">스타 알</span>
                </button>

                {/* Dino Egg */}
                <button
                  type="button"
                  onClick={() => handleEggSelect('dino')}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 transition-transform cursor-pointer ${
                    selectedEgg === 'dino'
                      ? 'border-stone-900 bg-black/10 scale-105'
                      : 'border-transparent hover:bg-black/5 opacity-70'
                  }`}
                >
                  <svg width="32" height="40" viewBox="0 0 16 20" className="w-8 h-10">
                    <path
                      d="M5 1h6v1h2v2h1v4h1v6h-1v3h-1v1h-2v1H5v-1H3v-1H2v-3H1V8h1V4h1V2h2V1z"
                      fill="#1c1917"
                    />
                    <path
                      d="M5 2h6v2h2v4h1v6h-1v2h-1v1h-2v1H5v-1H3v-1H2v-2H1V8h1V4h1V2h2z"
                      fill="#6ee7b7"
                    />
                    <rect x="4" y="6" width="3" height="3" fill="#047857" />
                    <rect x="9" y="8" width="3" height="3" fill="#047857" />
                  </svg>
                  <span className="font-pixel text-[8px] mt-1.5 text-stone-900">디노 알</span>
                </button>
              </div>

              {/* Pet Name Input */}
              <div className="w-full flex flex-col items-center gap-1.5 mb-2">
                <label className="font-vt text-base text-stone-800">
                  반려동물 이름 (최대 6글자):
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-36 text-center font-pixel text-xs bg-stone-200/80 border-2 border-stone-800 rounded px-2 py-1 text-stone-900 outline-none focus:bg-white"
                  placeholder="쿠키"
                />
              </div>

              {/* Start Button */}
              <button
                type="button"
                onClick={handleStart}
                className="w-full py-2.5 px-4 bg-stone-900 text-stone-100 font-pixel text-[10px] rounded hover:bg-stone-800 active:scale-98 transition-all tracking-wider shadow-sm cursor-pointer"
              >
                ▶ 알 품기 & 게임 시작
              </button>
            </div>
          )}
        </div>

        {/* Physical 3 Button Mock on Boot Shell */}
        <div className="flex justify-around items-center pt-6 pb-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-600 shadow-inner" />
            <span className="font-pixel text-[8px] text-slate-400">A</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-600 shadow-inner" />
            <span className="font-pixel text-[8px] text-slate-400">B</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-600 shadow-inner" />
            <span className="font-pixel text-[8px] text-slate-400">C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
