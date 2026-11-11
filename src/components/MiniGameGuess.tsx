import React, { useState } from 'react';
import { soundFx } from '../utils/audio';

interface MiniGameGuessProps {
  petName: string;
  onFinish: (won: boolean, score: number) => void;
  onExit: () => void;
}

export const MiniGameGuess: React.FC<MiniGameGuessProps> = ({
  petName,
  onFinish,
  onExit,
}) => {
  const totalRounds = 5;
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [petDirection, setPetDirection] = useState<'LEFT' | 'RIGHT' | 'CENTER'>('CENTER');
  const [roundResult, setRoundResult] = useState<'WIN' | 'LOSE' | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGuess = (guess: 'LEFT' | 'RIGHT') => {
    if (isAnimating || isGameOver) return;
    setIsAnimating(true);
    soundFx.playButtonBeep();

    // Pet decides randomly (50/50)
    const petChoice: 'LEFT' | 'RIGHT' = Math.random() < 0.5 ? 'LEFT' : 'RIGHT';
    setPetDirection(petChoice);

    const isMatch = guess === petChoice;
    setRoundResult(isMatch ? 'WIN' : 'LOSE');

    if (isMatch) {
      soundFx.playWin();
      setPlayerScore((prev) => prev + 1);
    } else {
      soundFx.playFail();
    }

    setTimeout(() => {
      if (round < totalRounds) {
        setRound((prev) => prev + 1);
        setPetDirection('CENTER');
        setRoundResult(null);
        setIsAnimating(false);
      } else {
        // Game Finished
        setIsGameOver(true);
        setIsAnimating(false);
        const finalScore = playerScore + (isMatch ? 1 : 0);
        const won = finalScore >= 3;
        if (won) {
          soundFx.playLevelUp();
        }
        setTimeout(() => {
          onFinish(won, finalScore);
        }, 1800);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-2 text-stone-900 select-none">
      {/* Game Header */}
      <div className="w-full flex items-center justify-between pb-1 border-b border-stone-800/20 font-pixel text-[8px]">
        <span>방향 맞추기</span>
        <span className="text-amber-800">
          RND: {round}/{totalRounds} · 승: {playerScore}
        </span>
      </div>

      {/* Main Game Stage */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div
          className={`transition-transform duration-200 ${
            petDirection === 'LEFT'
              ? '-translate-x-6 scale-x-1'
              : petDirection === 'RIGHT'
              ? 'translate-x-6 -scale-x-1'
              : 'translate-x-0'
          }`}
        >
          {/* Simple Pet Face Indicator */}
          <div className="w-14 h-14 bg-amber-200 border-2 border-stone-900 rounded-full flex flex-col items-center justify-center shadow-xs">
            {petDirection === 'CENTER' ? (
              <div className="font-pixel text-[10px] text-stone-900">? _ ?</div>
            ) : (
              <div className="font-pixel text-[10px] text-stone-900">^ o ^</div>
            )}
            <div className="w-3 h-1 bg-stone-900 mt-1 rounded-full" />
          </div>
        </div>

        {/* Round Feedback */}
        <div className="h-6 flex items-center justify-center mt-2 font-pixel text-[10px]">
          {roundResult === 'WIN' && (
            <span className="text-emerald-700 animate-bounce">★ 정답! 적중! ★</span>
          )}
          {roundResult === 'LOSE' && (
            <span className="text-rose-700">빗나갔음...</span>
          )}
          {roundResult === null && !isGameOver && (
            <span className="text-stone-700 animate-pulse text-[8px]">
              {petName}가 볼 방향을 선택!
            </span>
          )}
          {isGameOver && (
            <span className="font-pixel text-[9px] text-stone-900">
              게임 종료! {playerScore >= 3 ? '🎉 승리!' : '😢 아쉬워요'}
            </span>
          )}
        </div>
      </div>

      {/* Choice Buttons */}
      {!isGameOver ? (
        <div className="w-full flex gap-2">
          <button
            type="button"
            disabled={isAnimating}
            onClick={() => handleGuess('LEFT')}
            className="flex-1 py-1.5 bg-stone-800 text-stone-100 font-pixel text-[9px] rounded hover:bg-stone-700 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
          >
            ◀ 왼쪽
          </button>
          <button
            type="button"
            disabled={isAnimating}
            onClick={() => handleGuess('RIGHT')}
            className="flex-1 py-1.5 bg-stone-800 text-stone-100 font-pixel text-[9px] rounded hover:bg-stone-700 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
          >
            오른쪽 ▶
          </button>
        </div>
      ) : (
        <div className="font-vt text-sm text-stone-700 animate-pulse">
          결과 적용 중...
        </div>
      )}

      {/* Exit Button */}
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
