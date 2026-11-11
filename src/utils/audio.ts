// 8-bit Web Audio API Synthesizer for retro Tamagotchi sounds

class RetroAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Loaded lazily on first user interaction
    const saved = localStorage.getItem('tamapet_sound_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('tamapet_sound_muted', String(muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, delay = 0, volume = 0.1) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch {
      // Audio autoplay restriction or unsupported
    }
  }

  // Classic button click beep
  public playButtonBeep() {
    this.playTone(880, 'square', 0.05, 0, 0.08);
  }

  // Option select blip
  public playSelectBeep() {
    this.playTone(1046, 'square', 0.04, 0, 0.07);
  }

  // Cancel / back sound
  public playCancelBeep() {
    this.playTone(440, 'square', 0.07, 0, 0.08);
  }

  // Eating munch crunch
  public playEat() {
    const tones = [523, 659, 784, 1046];
    tones.forEach((t, i) => {
      this.playTone(t, 'square', 0.06, i * 0.07, 0.09);
    });
  }

  // Bath splash bubbles
  public playSplash() {
    const tones = [400, 600, 480, 750, 520, 880];
    tones.forEach((t, i) => {
      this.playTone(t, 'sine', 0.05, i * 0.05, 0.07);
    });
  }

  // Happy jingle when petted or played
  public playHappy() {
    const melody = [
      { f: 523, d: 0.08 },
      { f: 659, d: 0.08 },
      { f: 784, d: 0.08 },
      { f: 1046, d: 0.16 },
    ];
    let time = 0;
    melody.forEach((note) => {
      this.playTone(note.f, 'triangle', note.d, time, 0.12);
      time += note.d + 0.02;
    });
  }

  // Fanfare when leveling up or evolving!
  public playLevelUp() {
    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.50, d: 0.14 },// C6
      { f: 987.77, d: 0.08 }, // B5
      { f: 1046.50, d: 0.35 } // C6
    ];
    let time = 0;
    notes.forEach((n) => {
      this.playTone(n.f, 'square', n.d, time, 0.12);
      time += n.d + 0.01;
    });
  }

  // Alert beep (e.g. hungry, pooped, or sick)
  public playAlert() {
    this.playTone(880, 'sawtooth', 0.1, 0, 0.08);
    this.playTone(880, 'sawtooth', 0.1, 0.15, 0.08);
    this.playTone(880, 'sawtooth', 0.15, 0.3, 0.09);
  }

  // Medicine cure chime
  public playMedicine() {
    this.playTone(330, 'sine', 0.1, 0, 0.08);
    this.playTone(440, 'sine', 0.1, 0.12, 0.08);
    this.playTone(554, 'sine', 0.15, 0.24, 0.1);
  }

  // Mini-game win
  public playWin() {
    this.playTone(659, 'triangle', 0.08, 0, 0.1);
    this.playTone(880, 'triangle', 0.08, 0.1, 0.1);
    this.playTone(1318, 'triangle', 0.2, 0.2, 0.12);
  }

  // Mini-game lose / miss
  public playFail() {
    this.playTone(400, 'sawtooth', 0.12, 0, 0.08);
    this.playTone(280, 'sawtooth', 0.25, 0.14, 0.08);
  }

  // Hatching crack
  public playCrack() {
    this.playTone(250, 'square', 0.05, 0, 0.1);
    this.playTone(320, 'square', 0.08, 0.06, 0.1);
  }
}

export const soundFx = new RetroAudio();
