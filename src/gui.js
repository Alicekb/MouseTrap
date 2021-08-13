import { 
  AdvancedDynamicTexture, 
  Button, 
  Control, 
  Rectangle, 
  TextBlock, 
  RadioButton, 
  StackPanel} from '@babylonjs/gui';
import { Color3 } from '@babylonjs/core';

export default class GUI {
  constructor() {
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('mouseTrapUI');
    this.playerTurnHeader = undefined;
    GUI.all.push(this)
  };

  createRollButton() {
    const button = Button.CreateSimpleButton('roll', 'Roll Dice!');
    button.width = '100px';
    button.height = '50px';
    button.color = 'black';
    button.cornerRaidus = 20;
    button.thickness = 4;
    button.background = 'salmon';
    button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.left = '-20px';

    this.advancedTexture.addControl(button);
    return button;
  }

  createStartingCard(GLOBALS) {
    const backdrop = new Rectangle(`startingCard`);
    backdrop.width = '1000px';
    backdrop.height = '700px';
    backdrop.cornerRadius = 20;
    backdrop.color = 'black';
    backdrop.thickness = 10;
    backdrop.background = 'skyblue';

    const header = new TextBlock(`startingHeader`, 'Mouse Trap!');
    header.fontFamily = 'Carter One', 'cursive';
    header.fontSizeInPixels = 120;
    header.color = 'black';
    header.thickness = 2;
    header.background = 'white';
    header.top =  '-240px';

    const linkBlockButton = new Button.CreateSimpleButton('linkBlockButton', 'Learn How to Play');
    linkBlockButton.fontFamily = 'Carter One', 'cursive';
    linkBlockButton.fontSizeInPixels = 22;
    linkBlockButton.height = '50px';
    linkBlockButton.width = '700px';
    linkBlockButton.thickness = 4;
    linkBlockButton.cornerRadius = 20;
    linkBlockButton.color = 'black';
    linkBlockButton.background = 'white';
    linkBlockButton.top = '-120px';

    const numberOfPlayersLabel = new TextBlock(`numberOfPlayersHeader`, 'Select Number of Players:');
    numberOfPlayersLabel.fontFamily = 'Carter One', 'cursive';
    numberOfPlayersLabel.fontSizeInPixels = 40;
    numberOfPlayersLabel.height = '50px';
    numberOfPlayersLabel.color = 'black';
    numberOfPlayersLabel.thickness = 2;
    numberOfPlayersLabel.background = 'white';
    numberOfPlayersLabel.top = '-35px';

    const radioPanel = new StackPanel();
    radioPanel.height = '250px'
    radioPanel.top = '125px';

    ['2 players', '3 players', '4 players'].forEach((name, index) => {
      const radioButtonPanel = new RadioButton.AddRadioButtonWithHeader(name, 'numberOfPlayers', name === '2 players' ? true : false, (button, state) => {
        if (state) {
          GLOBALS.playerCount = index + 2
        };
      });

      radioButtonPanel.fontSize = 35;
      radioButtonPanel.fontFamily = 'Carter One', 'cursive';
      radioButtonPanel.height = '60px';
      radioButtonPanel.children[0].color = 'salmon';
      radioButtonPanel.children[0].height = '25px';
      radioButtonPanel.children[0].width = '25px';
      radioButtonPanel.children[1].color = 'black';

      radioPanel.addControl(radioButtonPanel);
    });

    linkBlockButton.onPointerClickObservable.add(() => {
      window.open('https://www.hasbro.com/common/instruct/mtrap.pdf', '_blank')
    })

    const startButton = new Button.CreateSimpleButton('startButton', 'START');
    startButton.fontSize = 35;
    startButton.fontFamily = 'Carter One', 'cursive';
    startButton.width = '155px';
    startButton.height = '45px';
    startButton.thickness = 4;
    startButton.cornerRadius = 20;
    startButton.color = 'black';
    startButton.background = 'white';
    startButton.top = '250px';

    backdrop.addControl(header);
    backdrop.addControl(linkBlockButton);
    backdrop.addControl(numberOfPlayersLabel);
    backdrop.addControl(startButton);

    backdrop.addControl(radioPanel);
    this.advancedTexture.addControl(backdrop);

    return { startButton, backdrop }
  }

  createPopUpBox(name, texts) {
    const rect = new Rectangle(`${name}Rectangle`);
    rect.width = '400px';
    rect.height = '200px';
    rect.cornerRadius = 20;
    rect.color = 'white';
    rect.thickness = 2;
    rect.background = 'black';
    rect.alpha = 0.7;

    const textBoxes = [];

    texts.forEach((text, index) => {
      const label = new TextBlock(`${name}Label`, text);
      label.fontFamily = 'Carter One', 'cursive';
      label.color = 'white';
      label.alpha = 0.7;
      label.top = index > 0 ? '-50px' : '0';
      label.parent = rect;
      textBoxes.push(label);
    });

    const button = new Button.CreateSimpleButton(`${name}CloseButton`, 'close');
    button.width = '150px';
    button.height = '40px';
    button.color = 'white';
    button.background = 'black';
    button.top = '40px';
    button.parent = rect;
    button.alpha = 0.8

    button.onPointerUpObservable.add(() => {
      this.advancedTexture.removeControl(rect);
      textBoxes.forEach(textBox => {
        this.advancedTexture.removeControl(textBox);
      })
      this.advancedTexture.removeControl(button);
    })

    this.advancedTexture.addControl(rect);
    textBoxes.forEach(textBox => {
      this.advancedTexture.addControl(textBox);
    })
    this.advancedTexture.addControl(button);
  }

  displayPlayerTurnHeader() {
    const playerTurnHeader = new TextBlock('gameHeader', 'Player 1\'s Turn');
    playerTurnHeader.fontFamily = 'Carter One', 'cursive';
    playerTurnHeader.fontSizeInPixels = 200;
    playerTurnHeader.height = '200px';
    playerTurnHeader.color = 'salmon';
    playerTurnHeader.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_TOP
    playerTurnHeader.top = "30px";

    this.advancedTexture.addControl(playerTurnHeader);
    this.playerTurnHeader = playerTurnHeader;
  }

  updatePlayerTurnHeader(playerNumber) {
    this.playerTurnHeader.text = `Player ${playerNumber}'s Turn!`
  }

}

GUI.all = []