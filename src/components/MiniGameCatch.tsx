import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../utils/audio';

interface MiniGameCatchProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

interface FallingItem {
  id: number;
  x: number; // 0 (left), 1 (center), 2 (right)
  y: number; // 0 to 100 percentage
  type: 'apple' | 'onigiri' | 'cake' | 'poop';
}

export const MiniGameCatch: React.FC<MiniGameCatchProps> = ({ onFinish, onExit }) => {
  const [basketPos, setBasketPos] = useState<0 | 1 | 2>(1); // 0: left, 1: center, 2: right
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const nextId = useRef(1);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      soundFx.playWin();
      setTimeout(() => {
        onFinish(score);
      }, 1500);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, onFinish]);

  // Spawning falling items
  useEffect(() => {
    if (isGameOver) return;

    const spawnInterval = setInterval(() => {
      const types: ('apple' | 'onigiri' | 'cake' | 'poop')[] = [
        'apple',
        'apple',
        'onigiri',
        'cake',
        'poop',
      ];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomCol = Math.floor(Math.random() * 3) as 0 | 1 | 2;

      setItems((prev) => [
        ...prev,
        {
          id: nextId.current++,
          x: randomCol,
          y: 0,
          type: randomType,
        },
      ]);
    }, 850);

    return () => clearInterval(spawnInterval);
  }, [isGameOver]);

  // Physics animation tick
  useEffect(() => {
    if (isGameOver) return;

    const frame = setInterval(() => {
      setItems((prev) => {
        const updated: FallingItem[] = [];
        for (const item of prev) {
          const nextY = item.y + 6;

          // Catch collision detection at bottom (y between 75 and 90)
          if (nextY >= 75 && nextY <= 90 && item.x === basketPos) {
            if (item.type === 'poop') {
              soundFx.playFail();
              setScore((s) => Math.max(0, s - 15));
            } else {
              soundFx.playEat();
              const pts = item.type === 'cake' ? 25 : item.type === 'onigiri' ? 15 : 10;
              setScore((s) => s + pts);
            }
            continue; // Caught, don't keep falling
          }

          if (nextY < 100) {
            updated.push({ ...item, y: nextY });
          }
        }
        return updated;
      });
    }, 100);

    return () => clearInterval(frame);
  }, [basketPos, isGameOver]);

  const moveLeft = () => {
    if (isGameOver) return;
    soundFx.playSelectBeep();
    setBasketPos((p) => (p > 0 ? ((p - 1) as 0 | 1 | 2) : 0));
  };

  const moveRight = () => {
    if (isGameOver) return;
    soundFx.playSelectBeep();
    setBasketPos((p) => (p < 2 ? ((p + 1) as 0 | 1 | 2) : 2));
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-2 text-stone-900 select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-1 border-b border-stone-800/20 font-pixel text-[8px]">
        <span>간식 받기</span>
        <span className="text-amber-800">
          점수: {score} · {timeLeft}초
        </span>
      </div>

      {/* 3-Lane Playing Field */}
      <div className="relative w-full flex-1 my-1 border border-stone-800/20 bg-black/5 rounded overflow-hidden">
        {/* 3 Columns */}
        <div className="absolute inset-0 grid grid-cols-3 divide-x divide-stone-800/10 pointer-events-none" />

        {/* Falling items */}
        {items.map((item) => {
          const leftPercent = item.x === 0 ? '16%' : item.x === 1 ? '50%' : '83%';
          return (
            <div
              key={item.id}
              className="absolute transform -translate-x-1/2"
              style={{
                left: leftPercent,
                top: `${item.y}%`,
                transition: 'top 0.1s linear',
              }}
            >
              {item.type === 'cake' && <span className="text-sm">🍰</span>}
              {item.type === 'apple' && <span className="text-sm">🍎</span>}
              {item.type === 'onigiri' && <span className="text-sm">🍙</span>}
              {item.type === 'poop' && <span className="text-sm animate-spin">💩</span>}
            </div>
          );
        })}

        {/* Catcher Basket / Pet */}
        <div
          className="absolute bottom-1 transform -translate-x-1/2 transition-all duration-100"
          style={{
            left: basketPos === 0 ? '16%' : basketPos === 1 ? '50%' : '83%',
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs font-pixel">🧺</span>
            <span className="text-[7px] font-pixel bg-stone-800 text-stone-100 px-1 rounded-xs">
              펫
            </span>
          </div>
        </div>

        {/* Game Over Banner */}
        {isGameOver && (
          <div className="absolute inset-0 bg-stone-900/60 flex flex-col items-center justify-center text-stone-100 font-pixel text-[9px] gap-1">
            <span className="text-amber-300">★ TIME UP! ★</span>
            <span>최종 점수: {score}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full flex gap-2">
        <button
          type="button"
          onClick={moveLeft}
          disabled={isGameOver || basketPos === 0}
          className="flex-1 py-1 bg-stone-800 text-stone-100 font-pixel text-[8px] rounded hover:bg-stone-700 active:scale-95 disabled:opacity-40 cursor-pointer"
        >
          ◀ 왼쪽
        </button>
        <button
          type="button"
          onClick={moveRight}
          disabled={isGameOver || basketPos === 2}
          className="flex-1 py-1 bg-stone-800 text-stone-100 font-pixel text-[8px] rounded hover:bg-stone-700 active:scale-95 disabled:opacity-40 cursor-pointer"
        >
          오른쪽 ▶
        </button>
      </div>

      {/* Exit */}
      <button
        type="button"
        onClick={() => {
          soundFx.playCancelBeep();
          onExit();
        }}
        className="text-[8px] font-pixel text-stone-600 hover:text-stone-900 mt-1 underline cursor-pointer"
      >
        [나가기 / CANCEL]
      </button>
    </div>
  );
};
