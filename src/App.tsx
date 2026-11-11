import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  PetData,
  ActiveAction,
  ShellColor,
  LcdColorTheme,
  AdultForm,
} from './types/pet';
import { soundFx } from './utils/audio';
import { loadSavedPet, savePet, clearSavedPet, createDefaultPet } from './utils/storage';
import { BootScreen } from './components/BootScreen';
import { HandheldShell } from './components/HandheldShell';
import { LcdScreen } from './components/LcdScreen';
import { ControlPanel } from './components/ControlPanel';
import { BookOpen, Sparkles, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [pet, setPet] = useState<PetData | null>(() => loadSavedPet());
  const [shellColor, setShellColor] = useState<ShellColor>('teal');
  const [lcdTheme, setLcdTheme] = useState<LcdColorTheme>('classic-green');
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getMuted());
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [activeAction, setActiveAction] = useState<ActiveAction>('NONE');
  const [selectedMenuIdx, setSelectedMenuIdx] = useState<number>(0);
  const [activeMiniGame, setActiveMiniGame] = useState<'GUESS' | 'CATCH' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('반려동물이 편안해 보입니다.');
  const [foodType, setFoodType] = useState<'onigiri' | 'cake' | 'apple' | 'burger'>('onigiri');
  const [showEvolutionModal, setShowEvolutionModal] = useState<boolean>(false);
  const [evolutionNotice, setEvolutionNotice] = useState<string>('');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger temporary animated action on pet
  const triggerAction = useCallback((action: ActiveAction, msg: string, durationMs = 2000) => {
    setActiveAction(action);
    setStatusMessage(msg);
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      setActiveAction('NONE');
    }, durationMs);
  }, []);

  // Save pet whenever it changes
  useEffect(() => {
    if (pet) {
      savePet(pet);
    }
  }, [pet]);

  // Level up calculation and evolution progression
  const addExp = useCallback((amount: number) => {
    setPet((prev) => {
      if (!prev) return null;
      let newExp = prev.exp + amount;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let newStage = prev.stage;
      let newAdultForm = prev.adultForm;
      let didLevelUp = false;

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel += 1;
        newMaxExp = Math.round(newMaxExp * 1.3);
        didLevelUp = true;
      }

      if (didLevelUp) {
        soundFx.playLevelUp();
        // Trigger celebratory confetti
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#10b981', '#3b82f6'],
        });

        // Stage evolution milestones
        if (newLevel >= 2 && newStage === 'EGG') {
          newStage = 'BABY';
          setEvolutionNotice(`알이 깨어나 [아기 ${prev.name}]가 되었습니다!`);
          setShowEvolutionModal(true);
        } else if (newLevel >= 3 && newStage === 'BABY') {
          newStage = 'CHILD';
          setEvolutionNotice(`성장하여 [어린이 ${prev.name}]로 진화했습니다!`);
          setShowEvolutionModal(true);
        } else if (newLevel >= 5 && newStage === 'CHILD') {
          newStage = 'TEEN';
          setEvolutionNotice(`폭풍 성장! [청소년 ${prev.name}]로 진화했습니다!`);
          setShowEvolutionModal(true);
        } else if (newLevel >= 8 && newStage === 'TEEN') {
          newStage = 'ADULT';
          // Determine adult form based on care history
          let form: AdultForm = 'ANGEL';
          if (prev.gamesWon >= 5) {
            form = 'NINJA';
          } else if (prev.totalInteractions >= 20) {
            form = 'CHEF';
          } else if (prev.stats.happiness > 70 && prev.stats.cleanliness > 70) {
            form = 'ANGEL';
          } else {
            form = 'DRAGON';
          }
          newAdultForm = form;
          setEvolutionNotice(`축하합니다! 최종 성체 [${form} 폼]으로 완전 진화했습니다!`);
          setShowEvolutionModal(true);
        }
      }

      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        maxExp: newMaxExp,
        stage: newStage,
        adultForm: newAdultForm,
        totalInteractions: prev.totalInteractions + 1,
      };
    });
  }, []);

  // Main simulation tick loop: decays stats over time, adds age
  useEffect(() => {
    if (!pet || pet.stage === 'EGG') return;

    // Interval: base 4 seconds divided by simSpeed
    const intervalMs = Math.max(800, 4000 / simSpeed);

    const timer = setInterval(() => {
      setPet((prev) => {
        if (!prev || prev.stage === 'EGG') return prev;

        const isSleeping = prev.isSleeping;
        // Natural stat decays
        const hungerDecay = isSleeping ? 0.3 : 0.8;
        const happinessDecay = isSleeping ? 0.2 : 0.6;
        const cleanDecay = isSleeping ? 0.1 : 0.5;
        const energyChange = isSleeping ? 2.5 : -0.4;

        const nextHunger = Math.max(0, prev.stats.hunger - hungerDecay);
        const nextHappiness = Math.max(0, prev.stats.happiness - happinessDecay);
        const nextCleanliness = Math.max(0, prev.stats.cleanliness - cleanDecay);
        const nextEnergy = Math.max(0, Math.min(100, prev.stats.energy + energyChange));

        // Chance to poop if hunger was well fed and not already full of poop
        let newPoopCount = prev.poopCount;
        if (!isSleeping && prev.stats.hunger > 50 && prev.poopCount < 3 && Math.random() < 0.08) {
          newPoopCount += 1;
          soundFx.playAlert();
        }

        // Sickness trigger if neglected
        let nextIsSick = prev.isSick;
        if (!prev.isSick && (nextHunger < 15 || nextCleanliness < 15 || newPoopCount >= 2)) {
          if (Math.random() < 0.15) {
            nextIsSick = true;
            soundFx.playAlert();
          }
        }

        // If sleeping and energy is 100%, wake up automatically
        let nextSleeping = prev.isSleeping;
        if (isSleeping && nextEnergy >= 100) {
          nextSleeping = false;
          soundFx.playHappy();
        }

        return {
          ...prev,
          isSleeping: nextSleeping,
          isSick: nextIsSick,
          poopCount: newPoopCount,
          stats: {
            hunger: nextHunger,
            happiness: nextHappiness,
            cleanliness: nextCleanliness,
            energy: nextEnergy,
          },
        };
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [pet, simSpeed]);

  // Feed action
  const handleFeed = useCallback((food: 'onigiri' | 'cake' | 'apple' | 'burger') => {
    if (!pet || pet.stage === 'EGG' || pet.isSleeping) return;
    setFoodType(food);
    soundFx.playEat();

    const hungerBoost = food === 'burger' ? 35 : food === 'cake' ? 25 : food === 'onigiri' ? 20 : 15;
    const happinessBoost = food === 'cake' ? 15 : 5;
    const weightGain = food === 'burger' ? 3 : food === 'cake' ? 2 : 1;

    setPet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        weightG: prev.weightG + weightGain,
        stats: {
          ...prev.stats,
          hunger: Math.min(100, prev.stats.hunger + hungerBoost),
          happiness: Math.min(100, prev.stats.happiness + happinessBoost),
        },
      };
    });

    addExp(10);
    triggerAction('EATING', `${pet.name}에게 ${food}을(를) 맛있게 먹였습니다!`);
  }, [pet, addExp, triggerAction]);

  // Clean / Bath action
  const handleClean = useCallback(() => {
    if (!pet || pet.stage === 'EGG' || pet.isSleeping) return;
    soundFx.playSplash();

    setPet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        poopCount: 0,
        stats: {
          ...prev.stats,
          cleanliness: 100,
          happiness: Math.min(100, prev.stats.happiness + 15),
        },
      };
    });

    addExp(12);
    triggerAction('BATHING', `샤워를 하고 배설물을 말끔히 치웠습니다!`);
  }, [pet, addExp, triggerAction]);

  // Sleep / Light toggle
  const handleToggleSleep = useCallback(() => {
    if (!pet || pet.stage === 'EGG') return;
    soundFx.playButtonBeep();

    setPet((prev) => {
      if (!prev) return null;
      const nextSleep = !prev.isSleeping;
      return {
        ...prev,
        isSleeping: nextSleep,
      };
    });

    setStatusMessage(pet.isSleeping ? `${pet.name}가 잠에서 깼습니다!` : `조명을 끄고 수면 모드에 들어갔습니다.`);
  }, [pet]);

  // Heal medicine
  const handleHeal = useCallback(() => {
    if (!pet || pet.stage === 'EGG') return;
    soundFx.playMedicine();

    setPet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isSick: false,
        stats: {
          ...prev.stats,
          happiness: Math.min(100, prev.stats.happiness + 20),
          energy: Math.min(100, prev.stats.energy + 20),
        },
      };
    });

    addExp(10);
    triggerAction('MEDICINE', `치료 주사를 맞아 건강을 되찾았습니다!`);
  }, [pet, addExp, triggerAction]);

  // Pet rubbing
  const handlePet = useCallback(() => {
    if (!pet || pet.stage === 'EGG' || pet.isSleeping) return;
    soundFx.playHappy();

    setPet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          happiness: Math.min(100, prev.stats.happiness + 8),
        },
      };
    });

    addExp(4);
    setStatusMessage(`${pet.name}를 쓰다듬어 주었습니다. 기분이 좋아 보여요!`);
  }, [pet, addExp]);

  // Hatch egg
  const handleHatchEgg = useCallback(() => {
    if (!pet || pet.stage !== 'EGG') return;
    soundFx.playCrack();
    soundFx.playLevelUp();

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
    });

    setPet((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stage: 'BABY',
        level: 1,
        exp: 10,
      };
    });

    setEvolutionNotice(`🎉 알이 부화하여 사랑스러운 아기 [${pet.name}]가 태어났습니다!`);
    setShowEvolutionModal(true);
  }, [pet]);

  // Mini-game finish handler
  const handleFinishMiniGame = useCallback((type: 'GUESS' | 'CATCH', won: boolean, score: number) => {
    setActiveMiniGame(null);
    if (!pet) return;

    if (won) {
      soundFx.playLevelUp();
      const expGain = type === 'CATCH' ? Math.round(score / 3) : 20;
      setPet((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          gamesWon: prev.gamesWon + 1,
          weightG: Math.max(4, prev.weightG - 2),
          stats: {
            ...prev.stats,
            happiness: Math.min(100, prev.stats.happiness + 25),
            energy: Math.max(10, prev.stats.energy - 10),
          },
        };
      });
      addExp(expGain);
      triggerAction('PLAYING', `미니게임 승리! 행복도와 경험치가 올랐습니다.`);
    } else {
      soundFx.playFail();
      setPet((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            happiness: Math.min(100, prev.stats.happiness + 10),
            energy: Math.max(10, prev.stats.energy - 8),
          },
        };
      });
      addExp(8);
      triggerAction('PLAYING', `게임 참가 보상! 즐거운 시간을 보냈습니다.`);
    }
  }, [pet, addExp, triggerAction]);

  // Physical Tactile Button Handlers on Tamagotchi Handheld:
  // Button A: Select / Cycle menu icon (0 through 7)
  const handlePhysicalButtonA = () => {
    if (activeMiniGame) return;
    setSelectedMenuIdx((prev) => (prev + 1) % 8);
  };

  // Button B: Execute selected menu icon action
  const handlePhysicalButtonB = () => {
    if (activeMiniGame) return;

    if (pet?.stage === 'EGG') {
      handleHatchEgg();
      return;
    }

    switch (selectedMenuIdx) {
      case 0: // Food
        handleFeed('onigiri');
        break;
      case 1: // Light / Sleep
        handleToggleSleep();
        break;
      case 2: // Game
        setActiveMiniGame('GUESS');
        break;
      case 3: // Medicine
        handleHeal();
        break;
      case 4: // Bath
        handleClean();
        break;
      case 5: // Meter / Stats
        setStatusMessage(`포만도:${Math.round(pet?.stats.hunger || 0)}% 행복:${Math.round(pet?.stats.happiness || 0)}% 청결:${Math.round(pet?.stats.cleanliness || 0)}%`);
        break;
      case 6: // Discipline / Pet
        handlePet();
        break;
      case 7: // Alert check
        if (pet?.isSick) {
          setStatusMessage('아파요! 💊 치료가 시급합니다.');
        } else if ((pet?.stats.hunger || 0) < 30) {
          setStatusMessage('배고파요! 🍙 밥을 주세요.');
        } else if ((pet?.poopCount || 0) > 0) {
          setStatusMessage('화장실이 급하거나 배설물이 있습니다! 🛁');
        } else {
          setStatusMessage('모든 상태가 평온하고 건강합니다.');
        }
        break;
      default:
        break;
    }
  };

  // Button C: Cancel / Close overlay or toggle status
  const handlePhysicalButtonC = () => {
    if (activeMiniGame) {
      setActiveMiniGame(null);
      setStatusMessage('미니게임을 종료했습니다.');
      return;
    }
    // Deselect menu icon or show brief status
    setSelectedMenuIdx(0);
    setStatusMessage(`${pet?.name || '펫'} (LV.${pet?.level || 1}) - 기분 좋음!`);
  };

  const handleStartGame = (name: string, eggType: 'classic' | 'star' | 'dino') => {
    const newPet = createDefaultPet(name, eggType);
    setPet(newPet);
    savePet(newPet);
  };

  const handleResetPet = () => {
    clearSavedPet();
    setPet(null);
  };

  const handleToggleMute = () => {
    const next = soundFx.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* 1. TOP BAR (Follows §2 Top Bar Contract: 3 zones separated by gap-8) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        {/* Zone 1: Single Brand Wordmark */}
        <a href="/" className="flex items-center gap-2 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          <span className="w-6 h-6 rounded-md bg-amber-400 text-neutral-950 flex items-center justify-center font-pixel text-xs">
            ★
          </span>
          <span className="font-pixel text-xs text-amber-400">TAMAPET 1997</span>
        </a>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>육성 가이드</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (pet) {
                setEvolutionNotice(`현재 성장 단계: ${pet.stage} (LV.${pet.level}). 미니게임 승리와 높은 행복도로 다양한 성체로 진화합니다.`);
                setShowEvolutionModal(true);
              }
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>진화 계보</span>
          </button>
          <span className="text-neutral-500 whitespace-nowrap shrink-0">·</span>
          <span className="text-xs text-neutral-400 whitespace-nowrap shrink-0">
            90s Retro Handheld Simulation
          </span>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            className="px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isMuted ? 'MUTE' : 'SOUND'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN APPLICATION CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {!pet ? (
          /* RETRO BIOS BOOT & EGG SELECTION SCREEN */
          <div className="py-6">
            <BootScreen onStartGame={handleStartGame} />
          </div>
        ) : (
          /* ACTIVE TAMAGOTCHI GAMEPLAY WORKSPACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT / CENTER COLUMN: PHYSICAL HANDHELD DEVICE (Lg: 5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center sticky top-24">
              <HandheldShell
                color={shellColor}
                onButtonA={handlePhysicalButtonA}
                onButtonB={handlePhysicalButtonB}
                onButtonC={handlePhysicalButtonC}
              >
                <LcdScreen
                  pet={pet}
                  activeAction={activeAction}
                  selectedMenuIdx={selectedMenuIdx}
                  theme={lcdTheme}
                  scanlines={scanlines}
                  activeMiniGame={activeMiniGame}
                  statusMessage={statusMessage}
                  onFinishMiniGame={handleFinishMiniGame}
                  onExitMiniGame={() => setActiveMiniGame(null)}
                  onPetPet={handlePet}
                  onHatchEgg={handleHatchEgg}
                  foodType={foodType}
                />
              </HandheldShell>

              {/* Physical Button Guide Help */}
              <div className="mt-4 px-4 py-2 bg-neutral-900/80 border border-neutral-800 rounded-xl text-center max-w-[340px]">
                <div className="font-pixel text-[8px] text-amber-400 mb-1">
                  TACTILE CONTROLS
                </div>
                <div className="text-[11px] text-neutral-400 flex justify-between gap-2">
                  <span>
                    <strong className="text-neutral-200">A</strong>: 메뉴 선택
                  </span>
                  <span>
                    <strong className="text-neutral-200">B</strong>: 실행/결정
                  </span>
                  <span>
                    <strong className="text-neutral-200">C</strong>: 취소/확인
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME GAUGES, CONTROLS & STATUS (Lg: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <ControlPanel
                pet={pet}
                shellColor={shellColor}
                setShellColor={setShellColor}
                lcdTheme={lcdTheme}
                setLcdTheme={setLcdTheme}
                scanlines={scanlines}
                setScanlines={setScanlines}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                simSpeed={simSpeed}
                setSimSpeed={setSimSpeed}
                onFeed={handleFeed}
                onPlayGame={(game) => setActiveMiniGame(game)}
                onClean={handleClean}
                onToggleSleep={handleToggleSleep}
                onHeal={handleHeal}
                onPet={handlePet}
                onResetPet={handleResetPet}
              />
            </div>
          </div>
        )}
      </main>

      {/* 3. EVOLUTION / LEVEL UP MODAL */}
      {showEvolutionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 border-2 border-amber-500 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-bounce-short">
            <div className="w-16 h-16 bg-amber-400/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl animate-spin">✨</span>
            </div>
            <h3 className="font-pixel text-xs text-amber-400 mb-2">
              ★ LEVEL UP & EVOLUTION ★
            </h3>
            <p className="text-sm text-neutral-200 leading-relaxed mb-5">
              {evolutionNotice}
            </p>
            <button
              type="button"
              onClick={() => setShowEvolutionModal(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-pixel text-[10px] rounded-xl transition-all cursor-pointer font-bold"
            >
              확인 / 함께하기
            </button>
          </div>
        </div>
      )}

      {/* 4. CARE GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>타마고치 펫 육성 가이드</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ 닫기
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
              <div className="p-3 bg-neutral-800/60 rounded-xl">
                <strong className="text-amber-400 block mb-1">1. 상태 관리의 3대 핵심 수치</strong>
                <p>
                  · <strong>포만도(Hunger)</strong>: 시간이 지나면 줄어듭니다. 주먹밥이나 케이크를 먹여 채워주세요.<br />
                  · <strong>행복도(Happiness)</strong>: 미니게임이나 쓰다듬기를 통해 유지할 수 있습니다.<br />
                  · <strong>청결도(Cleanliness)</strong>: 배설물을 방치하면 질병에 걸립니다. 샤워와 청소로 청결을 유지하세요.
                </p>
              </div>

              <div className="p-3 bg-neutral-800/60 rounded-xl">
                <strong className="text-amber-400 block mb-1">2. 성장 단계와 진화</strong>
                <p>
                  알(Egg) ➔ 아기 펫(LV.2) ➔ 어린이 펫(LV.3) ➔ 청소년 펫(LV.5) ➔ 성체 펫(LV.8)<br />
                  미니게임 승리 횟수, 먹이 섭취 패턴, 청결도 유지에 따라 <strong>천사형(Angel)</strong>, <strong>닌자형(Ninja)</strong>, <strong>셰프형(Chef)</strong>, <strong>드래곤형(Dragon)</strong> 등 다양한 성체로 최종 진화합니다.
                </p>
              </div>

              <div className="p-3 bg-neutral-800/60 rounded-xl">
                <strong className="text-amber-400 block mb-1">3. 레트로 조작법</strong>
                <p>
                  휴대용 기기의 물리 버튼(A: 메뉴 순환, B: 실행, C: 취소)으로 조작하거나, 오른쪽 대시보드의 원클릭 버튼으로 손쉽게 플레이할 수 있습니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-neutral-800/80 py-4 px-6 text-center text-xs text-neutral-500">
        타마고치 레트로 펫 육성 시뮬레이션 · Retro 8-Bit Virtual Pet Game
      </footer>
    </div>
  );
}
