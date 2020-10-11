import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeepService {

  constructor() {
  }

  beepNoise() {
    const audio = new Audio();
    audio.src = 'assets/beep.wav';
    audio.load();
    audio.play();
  }
  errorNoise() {
    const audio = new Audio();
    audio.src = 'assets/error.wav';
    audio.load();
    audio.play();
  }
}