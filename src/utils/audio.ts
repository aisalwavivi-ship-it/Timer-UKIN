import { AudioSettings } from '../types/timer';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play harmonic chime sound using Web Audio API
 */
export function playChimeSound(type: AudioSettings['soundType'] = 'chime', volume: number = 0.8) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'gong') {
      // Deep resonant gong tone
      const baseFreq = 220; // A3
      [1, 1.48, 2.05, 2.76].forEach((ratio, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * ratio, now);
        
        gain.gain.setValueAtTime(0.4 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 3.0);
      });
    } else if (type === 'softbell') {
      // Soft gentle school bell chime
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.6);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.6);
      });
    } else if (type === 'digital') {
      // Modern digital high-tone alert
      [800, 1000, 1200].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.16);
      });
    } else {
      // Default: Rich crystalline transition chime (C5, E5, G5, C6)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.8);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 1.8);
      });
    }
  } catch (err) {
    console.warn('Audio playback not supported or blocked:', err);
  }
}

/**
 * Play subtle warning beep (e.g., 2 minutes or 30 seconds warning)
 */
export function playWarningBeep(volume: number = 0.6) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume * 0.7)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;
    [0, 0.18].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + offset);

      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.14);
    });
  } catch (err) {
    console.warn('Warning sound failed:', err);
  }
}

/**
 * Play celebration victory sound on total completion
 */
export function playCompletionSound(volume: number = 0.8) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;
    const chords = [
      { f: 523.25, t: 0.0 }, // C5
      { f: 659.25, t: 0.12 }, // E5
      { f: 783.99, t: 0.24 }, // G5
      { f: 1046.5, t: 0.36 }, // C6
      { f: 1318.51, t: 0.6 }, // E6
    ];

    chords.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(0.3, now + t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 2.2);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + t);
      osc.stop(now + t + 2.2);
    });
  } catch (err) {
    console.warn('Completion sound failed:', err);
  }
}

/**
 * Text-to-Speech in Indonesian
 */
export function speakIndonesian(text: string, rate: number = 1.0, volume: number = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.volume = volume;
    utterance.lang = 'id-ID';

    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (v) => v.lang.startsWith('id') || v.name.toLowerCase().includes('indonesia')
    );
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
  }
}
