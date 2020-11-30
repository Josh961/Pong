import { Scene } from 'phaser';
import { Color } from '../exports/color';
import { GAME_HEIGHT, GAME_WIDTH } from '../exports/constants';

class ScoreScene extends Scene {

  constructor() {
    super('score-scene');
  }

  public create(data: any): void {
    this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(Color.Black, 0.25);
    this.add.text(GAME_WIDTH / 2, 150, `${data.leftWon ? 'Left' : 'Right'} paddle wins!`, {fontFamily: 'Arial', fontSize: '64px'}).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 300, `Press "Space" to restart`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 350, `Press "Q" to quit`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => this.restartGame());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => this.restartGame());
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.restartGame());

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on('down', () => {
      this.scene.get('game-scene').input.keyboard.removeAllKeys();
      this.scene.stop('game-scene');
      this.input.keyboard.removeAllKeys();
      this.scene.start('menu-scene');
    });
  }

  private restartGame(): void {
    this.scene.get('game-scene').input.keyboard.removeAllKeys();
    this.scene.stop('game-scene');
    this.input.keyboard.removeAllKeys();
    this.scene.start('game-scene');
  }
}
export default ScoreScene;
