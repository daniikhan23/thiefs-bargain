import { Howl, Howler } from "howler";

import jumpSoundFile from "../../public/assets/platformer-assets/brackeys_platformer_assets/brackeys_platformer_assets/sounds/jump.wav";
import collisionSoundFile from "../../public/assets/platformer-assets/brackeys_platformer_assets/brackeys_platformer_assets/sounds/hurt.wav";
import backgroundMusicFile from "../../public/assets/platformer-assets/brackeys_platformer_assets/brackeys_platformer_assets/sounds/awesomeness.wav";

class SoundManager {
  constructor() {
    this.sounds = {
      jump: new Howl({
        src: [jumpSoundFile],
      }),
      collision: new Howl({
        src: [collisionSoundFile],
      }),
    };

    this.music = new Howl({
      src: [backgroundMusicFile],
      loop: true,
      volume: 0.5, // Adjust volume as needed
    });
  }

  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].play();
    }
  }

  playMusic() {
    if (!this.music.playing()) {
      this.music.play();
    }
  }

  stopMusic() {
    if (this.music.playing()) {
      this.music.stop();
    }
  }

  setMusicVolume(volume) {
    this.music.volume(volume);
  }

  muteAll() {
    Howler.mute(true);
  }

  unmuteAll() {
    Howler.mute(false);
  }
}

const soundManager = new SoundManager();
export default soundManager;
