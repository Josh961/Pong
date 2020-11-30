import { Scene } from 'phaser';
import { CENTER_X, GAME_HEIGHT, GAME_WIDTH } from '../exports/constants';

class MenuScene extends Scene {

  constructor() {
    super('menu-scene');
  }

  public preload(): void {
    this.load.image('background', 'assets/background.png');
    this.load.image('one-player-button', 'assets/one-player-button.png');
    this.load.image('one-player-button-hover', 'assets/one-player-button-hover.png');
    this.load.image('two-player-button', 'assets/two-player-button.png');
    this.load.image('two-player-button-hover', 'assets/two-player-button-hover.png');
    this.load.image('audio-on', 'assets/audio-on.png');
    this.load.image('audio-off', 'assets/audio-off.png');
    this.load.audio('hit', 'assets/hit.wav');
  }

  public create(): void {
    this.add.image(0, 0, 'background').setOrigin(0);

    const onePlayerButton = this.add.image(GAME_WIDTH / 2, 320, 'one-player-button')
      .setInteractive({cursor: 'pointer'})
      .on('pointerover', () => onePlayerButton.setTexture('one-player-button-hover'))
      .on('pointerout', () => onePlayerButton.setTexture('one-player-button'))
      .on('pointerdown', () => {
        this.scene.start('game-scene', {singlePlayer: true});
      });

    const twoPlayerButton = this.add.image(GAME_WIDTH / 2, 420, 'two-player-button')
      .setInteractive({cursor: 'pointer'})
      .on('pointerover', () => twoPlayerButton.setTexture('two-player-button-hover'))
      .on('pointerout', () => twoPlayerButton.setTexture('two-player-button'))
      .on('pointerdown', () => {
        this.scene.start('game-scene', {singlePlayer: false});
      });

    const audioButton = this.add.image(GAME_WIDTH - 40, 30, !this.game.sound.mute ? 'audio-on' : 'audio-off')
      .setInteractive({cursor: 'pointer'})
      .on('pointerdown', () => {
        if (audioButton.texture.key === 'audio-on') {
          audioButton.setTexture('audio-off');
          this.game.sound.mute = true;
        } else {
          audioButton.setTexture('audio-on');
          this.game.sound.mute = false;
          this.sound.play('hit');
        }
      });

    this.add.text(CENTER_X, GAME_HEIGHT - 20, 'Made by Josh 🤠', {fontFamily: 'Arial', fontSize: '18px', color: '#272343'})
      .setOrigin(0.5)
      .setInteractive({cursor: 'pointer'})
      .on('pointerdown', () => {
        window.open('https://joshz.me', '_blank');
      });
  }
}
export default MenuScene;
