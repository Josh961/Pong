import { Scene } from 'phaser';
import { GAME_WIDTH } from '../exports/constants';

class PauseScene extends Scene {

  constructor() {
    super('pause-scene');
  }

  public create(overlay: Phaser.GameObjects.RenderTexture): void {
    this.add.text(GAME_WIDTH / 2, 150, 'PAUSED', {fontFamily: 'Arial', fontSize: '64px'}).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 300, `Press "Space" to continue`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 350, `Press "Q" to quit`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => this.resumeGame(overlay));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.resumeGame(overlay));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.resumeGame(overlay));

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on('down', () => {
      this.scene.stop('game-scene');
      this.scene.start('menu-scene');
    });
  }

  private resumeGame(overlay: Phaser.GameObjects.RenderTexture): void {
    overlay.destroy();
    this.scene.stop();
    this.scene.resume('game-scene');
  }
}
export default PauseScene;
