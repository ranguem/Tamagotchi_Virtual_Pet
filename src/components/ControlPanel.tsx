import React, { useState } from 'react';
import { PetData, ShellColor, LcdColorTheme } from '../types/pet';
import { soundFx } from '../utils/audio';
import {
  Utensils,
  Gamepad2,
  Sparkles,
  Moon,
  Sun,
  Pill,
  Heart,
  Volume2,
  VolumeX,
  RotateCcw,
  FastForward,
  Palette,
  Tv,
} from 'lucide-react';

interface ControlPanelProps {
  pet: PetData;
  shellColor: ShellColor;
  setShellColor: (color: ShellColor) => void;
  lcdTheme: LcdColorTheme;
  setLcdTheme: (theme: LcdColorTheme) => void;
  scanlines: boolean;
  setScanlines: (v: boolean) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  onFeed: (foodType: 'onigiri' | 'cake' | 'apple' | 'burger') => void;
  onPlayGame: (game: 'GUESS' | 'CATCH') => void;
  onClean: () => void;
  onToggleSleep: () => void;
  onHeal: () => void;
  onPet: () => void;
  onResetPet: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  pet,
  shellColor,
  setShellColor,
  lcdTheme,
  setLcdTheme,
  scanlines,
  setScanlines,
  isMuted,
  onToggleMute,
  simSpeed,
  setSimSpeed,
  onFeed,
  onPlayGame,
  onClean,
  onToggleSleep,
  onHeal,
  onPet,
  onResetPet,
}) => {
  const [selectedFood, setSelectedFood] = useState<'onigiri' | 'cake' | 'apple' | 'burger'>('onigiri');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Helper for status bar color
  const getStatColor = (value: number) => {
    if (value > 60) return 'bg-emerald-500';
    if (value > 30) return 'bg-amber-500';
    return 'bg-rose-500 animate-pulse';
  };

  const getStatLabel = (statName: string, val: number) => {
    if (statName === 'hunger') {
      if (val >= 80) return '만복 (아주 배부름)';
      if (val >= 40) return '적당함';
      if (val >= 20) return '배고픔';
      return '극심한 공복!';
    }
    if (statName === 'happiness') {
      if (val >= 80) return '최고로 행복함';
      if (val >= 50) return '즐거움';
      if (val >= 25) return '심심함';
      return '우울함 (놀아주세요)';
    }
    if (statName === 'cleanliness') {
      if (val >= 80) return '매우 깨끗함';
      if (val >= 50) return '양호';
      if (val >= 25) return '목욕 필요';
      return '더러움 (샤워 요망)';
    }
    if (statName === 'energy') {
      if (val >= 70) return '활기 넘침';
      if (val >= 40) return '보통';
      if (val >= 20) return '피곤함';
      return '탈진 (수면 필요)';
    }
    return `${val}%`;
  };

  const shellColors: { id: ShellColor; name: string; bg: string }[] = [
    { id: 'teal', name: '레트로 틸', bg: 'bg-teal-500' },
    { id: 'pink', name: '버블검 핑크', bg: 'bg-rose-400' },
    { id: 'yellow', name: '사이버 옐로우', bg: 'bg-amber-400' },
    { id: 'purple', name: '라벤더 퍼플', bg: 'bg-violet-500' },
    { id: 'cream', name: '밀키 크림', bg: 'bg-stone-300' },
    { id: 'black', name: '옵시디언 블랙', bg: 'bg-neutral-800' },
  ];

  const lcdThemes: { id: LcdColorTheme; name: string; color: string }[] = [
    { id: 'classic-green', name: '클래식 그린', color: 'bg-[#8fa77b]' },
    { id: 'amber-lcd', name: '앰버 오렌지', color: 'bg-[#dfae61]' },
    { id: 'gameboy-grey', name: '게임보이 그레이', color: 'bg-[#8ba39b]' },
    { id: 'cyber-blue', name: '사이버 블루', color: 'bg-[#7aa2bf]' },
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 1. PET STATUS & LEVEL PROGRESS CARD */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-1.5">
                <span>{pet.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-pixel">
                  LV.{pet.level}
                </span>
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              단계: {pet.stage === 'EGG' ? '부화 중인 알' : pet.stage === 'BABY' ? '아기 펫' : pet.stage === 'CHILD' ? '어린이 펫' : pet.stage === 'TEEN' ? '청소년 펫' : `성체 (${pet.adultForm || '천사'})`} · 나이: {pet.ageDays}일령 · 몸무게: {pet.weightG}g
            </p>
          </div>

          {/* Quick Pet Interaction */}
          <button
            type="button"
            onClick={onPet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-medium cursor-pointer transition-colors active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>쓰다듬기</span>
          </button>
        </div>

        {/* EXP Bar */}
        <div className="pt-3 pb-4">
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-neutral-300 font-pixel text-[9px]">성장 경험치 (EXP)</span>
            <span className="text-amber-400 tabular-nums font-pixel text-[9px]">
              {pet.exp} / {pet.maxExp} EXP ({Math.round((pet.exp / pet.maxExp) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-700">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
              style={{ width: `${Math.min(100, (pet.exp / pet.maxExp) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {pet.stage === 'EGG'
              ? '알을 클릭하거나 A/B 버튼을 눌러 부화시키세요!'
              : pet.stage === 'ADULT'
              ? '★ 최고 성장 단계(성체)에 도달했습니다! 꾸준히 보살펴주세요.'
              : `먹이를 주고, 놀아주고, 목욕시키면 레벨업 및 진화합니다.`}
          </p>
        </div>

        {/* 4 CORE STATE METERS (Gauges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Hunger Bar */}
          <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-700/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                <Utensils className="w-3.5 h-3.5 text-orange-400" />
                <span>포만도 (Hunger)</span>
              </span>
              <span className="text-xs text-neutral-400 tabular-nums">
                {Math.round(pet.stats.hunger)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatColor(pet.stats.hunger)} transition-all duration-300`}
                style={{ width: `${pet.stats.hunger}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              상태: {getStatLabel('hunger', pet.stats.hunger)}
            </div>
          </div>

          {/* Happiness Bar */}
          <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-700/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>행복도 (Happiness)</span>
              </span>
              <span className="text-xs text-neutral-400 tabular-nums">
                {Math.round(pet.stats.happiness)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatColor(pet.stats.happiness)} transition-all duration-300`}
                style={{ width: `${pet.stats.happiness}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              상태: {getStatLabel('happiness', pet.stats.happiness)}
            </div>
          </div>

          {/* Cleanliness Bar */}
          <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-700/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>청결도 (Cleanliness)</span>
              </span>
              <span className="text-xs text-neutral-400 tabular-nums">
                {Math.round(pet.stats.cleanliness)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatColor(pet.stats.cleanliness)} transition-all duration-300`}
                style={{ width: `${pet.stats.cleanliness}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              배설물: {pet.poopCount}개 · {getStatLabel('cleanliness', pet.stats.cleanliness)}
            </div>
          </div>

          {/* Energy Bar */}
          <div className="bg-neutral-900/70 p-3 rounded-xl border border-neutral-700/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>활력 (Energy)</span>
              </span>
              <span className="text-xs text-neutral-400 tabular-nums">
                {Math.round(pet.stats.energy)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatColor(pet.stats.energy)} transition-all duration-300`}
                style={{ width: `${pet.stats.energy}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              상태: {pet.isSleeping ? '취침 중 (회복 중 💤)' : getStatLabel('energy', pet.stats.energy)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DIRECT CARE INTERACTION BUTTONS */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-neutral-200 mb-3 flex items-center gap-2">
          <span>직접 상호작용 및 돌보기</span>
          <span className="text-xs font-normal text-neutral-400">(원클릭 케어)</span>
        </h3>

        {/* FEEDING ROW */}
        <div className="flex flex-col gap-2 pb-4 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-orange-400" />
              <span>먹이 선택:</span>
            </span>
            <div className="flex gap-1.5">
              {[
                { type: 'onigiri' as const, label: '주먹밥', icon: '🍙', hunger: '+20' },
                { type: 'apple' as const, label: '사과', icon: '🍎', hunger: '+15' },
                { type: 'burger' as const, label: '버거', icon: '🍔', hunger: '+30' },
                { type: 'cake' as const, label: '케이크', icon: '🍰', hunger: '+25 (행복↑)' },
              ].map((food) => (
                <button
                  key={food.type}
                  type="button"
                  onClick={() => setSelectedFood(food.type)}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedFood === food.type
                      ? 'bg-amber-500 text-neutral-900 font-bold shadow-xs'
                      : 'bg-neutral-700/60 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {food.icon} {food.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onFeed(selectedFood)}
            disabled={pet.isSleeping || pet.stage === 'EGG'}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-neutral-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Utensils className="w-4 h-4" />
            <span>{selectedFood === 'cake' ? '달콤한 케이크 주기 (+25 포만도, +15 행복)' : `${selectedFood} 먹이기`}</span>
          </button>
        </div>

        {/* ACTIONS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
          {/* Mini-Game: Guess */}
          <button
            type="button"
            onClick={() => onPlayGame('GUESS')}
            disabled={pet.isSleeping || pet.stage === 'EGG'}
            className="p-3 bg-neutral-700/60 hover:bg-neutral-700 disabled:opacity-40 rounded-xl text-left flex flex-col gap-1 transition-all cursor-pointer border border-neutral-600/40"
          >
            <div className="flex items-center justify-between">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-pixel">레트로</span>
            </div>
            <span className="text-xs font-bold text-neutral-100">방향 맞추기</span>
            <span className="text-[10px] text-neutral-400">행복도 & 경험치 증가</span>
          </button>

          {/* Mini-Game: Catch */}
          <button
            type="button"
            onClick={() => onPlayGame('CATCH')}
            disabled={pet.isSleeping || pet.stage === 'EGG'}
            className="p-3 bg-neutral-700/60 hover:bg-neutral-700 disabled:opacity-40 rounded-xl text-left flex flex-col gap-1 transition-all cursor-pointer border border-neutral-600/40"
          >
            <div className="flex items-center justify-between">
              <Gamepad2 className="w-4 h-4 text-sky-400" />
              <span className="text-[10px] text-sky-400 font-pixel">아케이드</span>
            </div>
            <span className="text-xs font-bold text-neutral-100">간식 받기</span>
            <span className="text-[10px] text-neutral-400">15초 미니게임</span>
          </button>

          {/* Bath & Clean */}
          <button
            type="button"
            onClick={onClean}
            disabled={pet.isSleeping || pet.stage === 'EGG'}
            className="p-3 bg-neutral-700/60 hover:bg-neutral-700 disabled:opacity-40 rounded-xl text-left flex flex-col gap-1 transition-all cursor-pointer border border-neutral-600/40"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] text-cyan-400 font-pixel">청결</span>
            </div>
            <span className="text-xs font-bold text-neutral-100">목욕 & 배설물 청소</span>
            <span className="text-[10px] text-neutral-400">배설물 치우기</span>
          </button>

          {/* Sleep / Light Toggle */}
          <button
            type="button"
            onClick={onToggleSleep}
            disabled={pet.stage === 'EGG'}
            className={`p-3 rounded-xl text-left flex flex-col gap-1 transition-all cursor-pointer border ${
              pet.isSleeping
                ? 'bg-indigo-900/60 border-indigo-500 text-indigo-100'
                : 'bg-neutral-700/60 hover:bg-neutral-700 border-neutral-600/40 text-neutral-100'
            }`}
          >
            <div className="flex items-center justify-between">
              {pet.isSleeping ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span className="text-[10px] text-indigo-300 font-pixel">수면</span>
            </div>
            <span className="text-xs font-bold">
              {pet.isSleeping ? '조명 켜기 (기상)' : '조명 끄기 (취침)'}
            </span>
            <span className="text-[10px] text-neutral-400">
              {pet.isSleeping ? '취침 중...' : '체력 및 활력 회복'}
            </span>
          </button>
        </div>

        {/* Medicine Alert if Sick */}
        {pet.isSick && (
          <div className="mt-3 p-3 bg-rose-950/60 border border-rose-600 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-rose-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-rose-200">
                  {pet.name}가 아파요! 치료가 필요합니다.
                </div>
                <div className="text-[10px] text-rose-300">
                  더러움 방치 또는 굶주림으로 인해 병에 걸렸습니다.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onHeal}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-pixel text-[9px] rounded-lg shadow-sm cursor-pointer"
            >
              💊 치료 주사
            </button>
          </div>
        )}
      </div>

      {/* 3. HARDWARE & RETRO CUSTOMIZATION SETTINGS */}
      <div className="bg-neutral-800/90 border border-neutral-700/80 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-neutral-200 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>기기 스킨 & 환경 설정</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shell Color */}
          <div>
            <label className="text-xs text-neutral-300 font-medium block mb-2">
              타마고치 기기 색상:
            </label>
            <div className="flex flex-wrap gap-2">
              {shellColors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    soundFx.playSelectBeep();
                    setShellColor(c.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer border transition-all ${
                    shellColor === c.id
                      ? 'border-amber-400 bg-neutral-700 text-white'
                      : 'border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.bg} border border-black/30`} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* LCD Screen Color */}
          <div>
            <label className="text-xs text-neutral-300 font-medium block mb-2">
              LCD 액정 백라이트 테마:
            </label>
            <div className="flex flex-wrap gap-2">
              {lcdThemes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    soundFx.playSelectBeep();
                    setLcdTheme(t.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer border transition-all ${
                    lcdTheme === t.id
                      ? 'border-amber-400 bg-neutral-700 text-white'
                      : 'border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-xs ${t.color} border border-black/40`} />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audio, Scanlines & Simulation Speed */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-neutral-700">
          {/* Audio Mute */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                isMuted
                  ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                  : 'bg-neutral-700 text-neutral-200 border-neutral-600'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? '음소거 됨' : '8비트 사운드 켬'}</span>
            </button>

            {/* Scanlines Toggle */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSelectBeep();
                setScanlines(!scanlines);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                scanlines
                  ? 'bg-amber-950/50 text-amber-300 border-amber-800'
                  : 'bg-neutral-700 text-neutral-300 border-neutral-600'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{scanlines ? '스캔라인 ON' : '스캔라인 OFF'}</span>
            </button>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <FastForward className="w-3.5 h-3.5" />
              <span>배속:</span>
            </span>
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => {
                  soundFx.playSelectBeep();
                  setSimSpeed(speed);
                }}
                className={`px-2 py-1 rounded text-xs font-pixel cursor-pointer transition-colors ${
                  simSpeed === speed
                    ? 'bg-amber-500 text-neutral-900 font-bold'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Reset Game */}
          <div>
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>게임 리셋</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300">정말 리셋할까요?</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetConfirm(false);
                    onResetPet();
                  }}
                  className="px-2 py-0.5 bg-rose-600 text-white text-xs rounded hover:bg-rose-500 cursor-pointer"
                >
                  예
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-0.5 bg-neutral-700 text-neutral-300 text-xs rounded hover:bg-neutral-600 cursor-pointer"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
