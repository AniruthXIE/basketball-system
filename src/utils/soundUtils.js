// Sound effects for the game
class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
    this.sounds = {};
  }

  // Initialize sounds (will be loaded from assets or generated)
  init() {
    // For now, we'll use Web Audio API to generate simple sounds
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Generate beep sound
  generateBeep(frequency = 440, duration = 200) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // Play score sound
  playScore() {
    this.generateBeep(800, 150);
  }

  // Play win sound
  playWin() {
    setTimeout(() => this.generateBeep(600, 200), 0);
    setTimeout(() => this.generateBeep(800, 200), 200);
    setTimeout(() => this.generateBeep(1000, 400), 400);
  }

  // Play champion sound
  playChampion() {
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((note, index) => {
      setTimeout(() => this.generateBeep(note, 300), index * 200);
    });
  }

  // Play buzzer sound (time up)
  playBuzzer() {
    this.generateBeep(200, 1000);
  }

  // Play start game sound
  playStart() {
    this.generateBeep(440, 100);
    setTimeout(() => this.generateBeep(550, 100), 150);
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Set volume (0-1)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();