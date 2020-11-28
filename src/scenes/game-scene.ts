import { Scene } from 'phaser';
import { Color } from '../exports/color';
import { CENTER_X, CENTER_Y, GAME_HEIGHT, GAME_WIDTH } from '../exports/constants';
import { MathUtil } from '../utils/math';

class GameScene extends Scene {
  private readonly PADDLE_SPEED = 600;
  private readonly COMPUTER_PADDLE_SPEED = 400;
  private readonly BALL_SPEED = 400;
  private singlePlayer: boolean;
  private leftKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private leftPaddle: Phaser.GameObjects.Rectangle;
  private leftGoal: Phaser.GameObjects.Rectangle;
  private leftText: Phaser.GameObjects.Text;
  private leftScore: number;
  private rightKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private rightPaddle: Phaser.GameObjects.Rectangle;
  private rightGoal: Phaser.GameObjects.Rectangle;
  private rightText: Phaser.GameObjects.Text;
  private rightScore: number;
  private ball: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super('game-scene');
  }

  public init(data: any): void {
    this.singlePlayer = data.singlePlayer;
    this.leftScore = 0;
    this.rightScore = 0;
    this.leftText = this.add.text(CENTER_X - 100, 25, `${this.leftScore}`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);
    this.rightText = this.add.text(CENTER_X + 100, 25, `${this.rightScore}`, {fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5);
  }

  public preload(): void {
    this.load.image('ball', 'assets/ball.png');
    this.load.audio('hit', 'assets/hit.wav');
  }

  public create(): void {
    this.createControls();
    this.createBall();
    this.createPaddles();
    this.createGoals();
  }

  private createControls(): void {
    this.leftKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
    });

    this.rightKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => {
      this.scene.pause();
      this.input.keyboard.resetKeys();
      const pauseOverlay = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(Color.Black, 0.25);
      this.scene.launch('pause-scene', pauseOverlay);
    });
  }

  private createBall(): void {
    this.ball = this.physics.add.sprite(CENTER_X, CENTER_Y, 'ball');
    this.ball.setScale(0.75);
    this.ball.setCircle(16);
    this.ball.setGravity(0);
    this.ball.setBounce(1);
    this.physics.velocityFromAngle(this.getRandomBallAngle(), this.BALL_SPEED, this.ball.body.velocity);
    (this.ball.body as Phaser.Physics.Arcade.Body).collideWorldBounds = true;
  }

  private createPaddles(): void {
    this.leftPaddle = this.add.rectangle(100, CENTER_Y, 16, 128, Color.DarkBlue);
    this.configurePaddle(this.leftPaddle, true);

    this.rightPaddle = this.add.rectangle(GAME_WIDTH - 100, CENTER_Y, 16, 128, Color.DarkBlue);
    this.configurePaddle(this.rightPaddle, false);
  }

  private configurePaddle(paddle: Phaser.GameObjects.Rectangle, left: boolean): void {
    this.physics.add.existing(paddle);
    (paddle.body as Phaser.Physics.Arcade.Body).collideWorldBounds = true;
    (paddle.body as Phaser.Physics.Arcade.Body).immovable = true;
    (paddle.body as Phaser.Physics.Arcade.Body).setMaxVelocity(0, left && this.singlePlayer ? this.COMPUTER_PADDLE_SPEED : this.PADDLE_SPEED);

    this.physics.add.collider(this.ball, paddle, () => {
      this.ball.body.velocity.scale(1.1);
      this.sound.play('hit');
    });
  }

  private createGoals(): void {
    this.leftGoal = this.add.rectangle(0, 0, 16, GAME_HEIGHT, Color.DarkBlue).setOrigin(0);
    this.configureGoal(this.leftGoal, true);

    this.rightGoal = this.add.rectangle(GAME_WIDTH - 16, 0, 16, GAME_HEIGHT, Color.DarkBlue).setOrigin(0);
    this.configureGoal(this.rightGoal, false);
  }

  private configureGoal(goal: Phaser.GameObjects.Rectangle, left: boolean): void {
    this.physics.add.existing(goal);
    (goal.body as Phaser.Physics.Arcade.Body).immovable = true;

    this.physics.add.collider(this.ball, goal, () => {
      if (left) {
        this.rightScore++;
        this.rightText.setText(`${this.rightScore}`);
      } else {
        this.leftScore++;
        this.leftText.setText(`${this.leftScore}`);
      }

      this.resetRound();
    });
  }

  private resetRound(): void {
    this.ball.setPosition(CENTER_X, CENTER_Y);
    this.physics.velocityFromAngle(this.getRandomBallAngle(), this.BALL_SPEED, this.ball.body.velocity);
  }

  private getRandomBallAngle(): number {
    const num = Math.random();
    return num < 0.25
      ? MathUtil.getRandomIntInclusive(125, 145) : num < 0.5
      ? MathUtil.getRandomIntInclusive(215, 235) : num < 0.75
      ? MathUtil.getRandomIntInclusive(35, 55) : MathUtil.getRandomIntInclusive(-55, -35);
  }

  public update(): void {
    if (this.singlePlayer) {
      this.leftPaddle.body.velocity.y = this.ball.body.velocity.y;
    } else {
      this.setPlayerKeys(this.leftPaddle, this.leftKeys);
    }
    this.setPlayerKeys(this.rightPaddle, this.rightKeys);
    this.modulateBallSpeed();
    this.checkScore();
  }

  private setPlayerKeys(paddle: Phaser.GameObjects.Rectangle, keys: Phaser.Types.Input.Keyboard.CursorKeys): void {
    const {up, down} = keys;

    if (up.isDown) {
      paddle.body.velocity.y = -this.PADDLE_SPEED;
    }
    else if (down.isDown) {
      paddle.body.velocity.y = this.PADDLE_SPEED;
    }
    else {
      paddle.body.velocity.y = 0;
    }
  }

  private modulateBallSpeed(): void {
    const xVelocity = this.ball.body.velocity.x;
    const absoluteX = Math.abs(xVelocity);

    if (absoluteX < 50) {
      this.ball.setVelocityX(xVelocity * 4);
    } else if (absoluteX < 75) {
      this.ball.setVelocityX(xVelocity * 2.5);
    } else if (absoluteX < 100) {
      this.ball.setVelocityX(xVelocity * 2);
    } else if (absoluteX < 150) {
      this.ball.setVelocityX(xVelocity * 1.5);
    }
  }

  private checkScore(): void {
    if (this.leftScore === 10 || this.rightScore === 10 ) {
      this.ball.destroy();
      this.scene.pause();
      const pauseOverlay = this.add.renderTexture(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(Color.Black, 0.25);
      this.scene.launch('score-scene', {pauseOverlay, leftWon: this.leftScore > this.rightScore});
    }
  }
}
export default GameScene;
