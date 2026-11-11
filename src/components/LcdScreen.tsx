import React, { useState } from 'react';
import { PetData, ActiveAction, LcdColorTheme } from '../types/pet';
import { PixelPetSprite, PoopSprite, FoodSprite } from './PixelSprites';
import { MiniGameGuess } from './MiniGameGuess';
import { MiniGameCatch } from './MiniGameCatch';
import { soundFx } from '../utils/audio';

interface LcdScreenProps {
  pet: PetData;
  activeAction: ActiveAction;
  selectedMenuIdx: number; // 0 to 7 corresponding to the 8 classic icons
  theme: LcdColorTheme;
  scanlines: boolean;
  activeMiniGame: 'GUESS' | 'CATCH' | null;
  statusMessage: string;
  onFinishMiniGame: (type: 'GUESS' | 'CATCH', won: boolean, score: number) => void;
  onExitMiniGame: () => void;
  onPetPet: () => void;
  onHatchEgg: () => void;
  foodType: 'onigiri' | 'cake' | 'apple' | 'burger';
}

const ICONS = [
  { id: 'food', label: '식사', icon: '🍴' },
  { id: 'light', label: '조명', icon: '💡' },
  { id: 'game', label: '놀기', icon: '🎮' },
  { id: 'medicine', label: '치료', icon: '💊' },
  { id: 'bath', label: '목욕', icon: '🛁' },
  { id: 'meter', label: '상태', icon: '📊' },
  { id: 'discipline', label: '칭찬', icon: '⭐' },
  { id: 'alert', label: '호출', icon: '🔔' },
];

export const LcdScreen: React.FC<LcdScreenProps> = ({
  pet,
  activeAction,
  selectedMenuIdx,
  theme,
  scanlines,
  activeMiniGame,
  statusMessage,
  onFinishMiniGame,
  onExitMiniGame,
  onPetPet,
  onHatchEgg,
  foodType,
}) => {
  const [pettingHearts, setPettingHearts] = useState<{ id: number; x: number }[]>([]);

  // LCD Color Theme Palettes
  const themeStyles: Record<LcdColorTheme, { bg: string; fg: string }> = {
    'classic-green': { bg: '#8fa77b', fg: '#1f271b' },
    'amber-lcd': { bg: '#dfae61', fg: '#331d04' },
    'gameboy-grey': { bg: '#8ba39b', fg: '#1b2d28' },
    'cyber-blue': { bg: '#7aa2bf', fg: '#12263a' },
  };

  const currentTheme = themeStyles[theme];

  // Pet clicking handler (rubbing / petting)
  const handlePetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pet.stage === 'EGG') {
      onHatchEgg();
      return;
    }
    if (pet.isSleeping) return;

    soundFx.playHappy();
    onPetPet();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newHeart = { id: Date.now(), x };
    setPettingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setPettingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  // Determine if alert icon should blink
  const isAlertActive =
    pet.stats.hunger < 25 ||
    pet.stats.cleanliness < 25 ||
    pet.isSick ||
    pet.poopCount > 0;

  return (
    <div
      className={`lcd-screen ${scanlines ? 'lcd-scanlines' : ''} rounded-2xl w-full h-[260px] flex flex-col justify-between p-2 select-none border-2 border-stone-900/30 transition-colors duration-300`}
      style={
        {
          '--lcd-bg': currentTheme.bg,
          '--lcd-fg': currentTheme.fg,
        } as React.CSSProperties
      }
    >
      {/* TOP ROW ICONS (0 to 3: Food, Light, Game, Medicine) */}
      <div className="flex items-center justify-around border-b border-stone-900/20 pb-1 z-20">
        {ICONS.slice(0, 4).map((item, idx) => {
          const isSelected = selectedMenuIdx === idx && activeMiniGame === null;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-center w-7 h-7 rounded border transition-all ${
                isSelected
                  ? 'border-stone-900 bg-stone-900/25 scale-110 shadow-xs'
                  : 'border-transparent opacity-65'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
            </div>
          );
        })}
      </div>

      {/* CENTER SCREEN STAGE */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden my-0.5">
        {/* MINI GAME VIEWPORT */}
        {activeMiniGame === 'GUESS' && (
          <div className="absolute inset-0 z-30 bg-[var(--lcd-bg)]">
            <MiniGameGuess
              petName={pet.name}
              onFinish={(won, score) => onFinishMiniGame('GUESS', won, score)}
              onExit={onExitMiniGame}
            />
          </div>
        )}

        {activeMiniGame === 'CATCH' && (
          <div className="absolute inset-0 z-30 bg-[var(--lcd-bg)]">
            <MiniGameCatch
              onFinish={(score) => onFinishMiniGame('CATCH', score >= 40, score)}
              onExit={onExitMiniGame}
            />
          </div>
        )}

        {/* NORMAL PET SCREEN */}
        {activeMiniGame === null && (
          <>
            {/* Sleeping Overlay (Night time) */}
            {pet.isSleeping && (
              <div className="absolute inset-0 bg-stone-950/40 z-10 flex flex-col items-end p-2 pointer-events-none">
                <span className="text-xs">🌙 ✦ ⋆</span>
                <span className="font-pixel text-[8px] mt-1 text-stone-200 animate-pulse">
                  Z z z...
                </span>
              </div>
            )}

            {/* Bathing Bubbles & Shower Animation */}
            {activeAction === 'BATHING' && (
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center">
                <div className="text-lg animate-bounce">🚿 🫧 🫧</div>
                <div className="flex gap-2 text-xs animate-pulse">
                  <span>🫧</span>
                  <span>🫧</span>
                  <span>🫧</span>
                </div>
              </div>
            )}

            {/* Eating Food Drops Animation */}
            {activeAction === 'EATING' && (
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                <FoodSprite type={foodType} />
              </div>
            )}

            {/* Medicine Syringe Animation */}
            {activeAction === 'MEDICINE' && (
              <div className="absolute top-2 right-4 z-20 text-lg animate-pulse">
                💉 ✨
              </div>
            )}

            {/* Floating Hearts from Petting */}
            {pettingHearts.map((h) => (
              <div
                key={h.id}
                className="absolute text-rose-700 text-sm font-pixel pointer-events-none z-25 animate-float-heart"
                style={{ left: `${Math.max(10, Math.min(80, h.x))}px`, top: '40%' }}
              >
                ♥
              </div>
            ))}

            {/* Main Interactive Pet */}
            <div
              onClick={handlePetClick}
              className="cursor-pointer active:scale-95 transition-transform z-15"
              title="클릭하여 쓰다듬기 / 교감"
            >
              <PixelPetSprite
                stage={pet.stage}
                adultForm={pet.adultForm}
                eggType={pet.eggType}
                stats={pet.stats}
                isSleeping={pet.isSleeping}
                isSick={pet.isSick}
                action={activeAction}
                isPetting={pettingHearts.length > 0}
              />
            </div>

            {/* Poop piles on the floor */}
            {pet.poopCount > 0 && pet.stage !== 'EGG' && (
              <div className="absolute bottom-1 right-2 z-15">
                <PoopSprite count={pet.poopCount} />
              </div>
            )}

            {/* Sickness Skull indicator */}
            {pet.isSick && (
              <div className="absolute top-1 left-2 z-15 animate-bounce">
                <span className="text-xs">💀</span>
              </div>
            )}

            {/* Hungry Stomach Rumble thought bubble */}
            {pet.stats.hunger < 25 && pet.stage !== 'EGG' && !pet.isSleeping && (
              <div className="absolute top-0 right-3 z-15 bg-white/70 border border-stone-900 rounded px-1 text-[8px] font-pixel animate-pulse">
                꼬르륵..🍙
              </div>
            )}
          </>
        )}
      </div>

      {/* LCD STATUS TICKER PROSE */}
      <div className="px-2 py-0.5 bg-black/10 border-t border-stone-900/15 flex items-center justify-between text-stone-900 font-pixel text-[8px] z-20">
        <span className="truncate max-w-[190px]">{statusMessage}</span>
        {pet.stage !== 'EGG' && (
          <span className="shrink-0 font-vt text-sm ml-1">
            LV.{pet.level} ({pet.weightG}g)
          </span>
        )}
      </div>

      {/* BOTTOM ROW ICONS (4 to 7: Bath, Meter, Discipline, Alert) */}
      <div className="flex items-center justify-around border-t border-stone-900/20 pt-1 z-20">
        {ICONS.slice(4, 8).map((item, idx) => {
          const actualIdx = idx + 4;
          const isSelected = selectedMenuIdx === actualIdx && activeMiniGame === null;
          const isAlertIcon = item.id === 'alert';

          return (
            <div
              key={item.id}
              className={`flex items-center justify-center w-7 h-7 rounded border transition-all ${
                isSelected
                  ? 'border-stone-900 bg-stone-900/25 scale-110 shadow-xs'
                  : 'border-transparent opacity-65'
              } ${isAlertIcon && isAlertActive ? 'animate-bounce text-red-800 opacity-100 font-bold' : ''}`}
            >
              <span className="text-xs">{item.icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
