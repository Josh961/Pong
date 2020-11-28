import { Scene } from 'phaser';
import { GAME_WIDTH } from '../exports/constants';

class ScoreScene extends Scene {

  constructor() {
    super('score-scene');
  }

  public create(data: any): void {
    this.add.text(GAME_WIDTH / 2, 150, `${data.leftWon ? 'Left' : 'Right'} paddle wins!`, {fontFamily: 'Arial', fontSize: '64px'}).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 300, `Press "Space" to restart`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 350, `Press "Q" to quit`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
      this.scene.start('game-scene');
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on('down', () => {
      this.scene.stop('game-scene');
      this.scene.start('menu-scene');
    });
  }
}
export default ScoreScene;
