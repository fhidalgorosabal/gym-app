import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private audioContext: AudioContext | null = null;

  /** Reproduce un beep de notificación usando Web Audio API */
  playBeep() {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const ctx = this.audioContext;

      // Primer tono
      this.playTone(ctx, 880, ctx.currentTime, 0.15);
      // Segundo tono (más alto)
      this.playTone(ctx, 1100, ctx.currentTime + 0.18, 0.15);
      // Tercer tono
      this.playTone(ctx, 1320, ctx.currentTime + 0.36, 0.25);
    } catch {
      // Fallback silencioso si Audio API no está disponible
    }
  }

  private playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
}
