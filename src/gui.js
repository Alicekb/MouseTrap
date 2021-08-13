import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from '@babylonjs/gui';

export default class GUI {
  constructor() {
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('mouseTrapUI');
    GUI.all.push(this)
  };

  createRollButton() {
    const button = Button.CreateSimpleButton('roll', 'Roll Dice!');
    button.width = "100px";
    button.height = "50px";
    button.color = 'black';
    button.cornerRaidus = 20;
    button.background = "pink";
    button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.left = "-20px";

    this.advancedTexture.addControl(button);
    return button;
  }

  createStartingCard() {
    const backdrop = new Rectangle(`startingCard`);
    backdrop.width = "1000px";
    backdrop.height = "700px";
    backdrop.cornerRadius = 20;
    backdrop.color = "white";
    backdrop.thickness = 2;
    backdrop.background = "black";
    backdrop.alpha = 0.7;

    const header = new TextBlock(`startingHeader`, "Mouse Trap!");
    header.fontFamily = 'Carter One', 'cursive';
    header.fontSizeInPixels = 100;
    header.color = "white";
    header.top =  "-250px";
    header.parent = backdrop;

    const learnBlock = new TextBlock(`learnBlock`, "Learn how to play at: ");
    learnBlock.fontFamily = 'Carter One', 'cursive';
    learnBlock.fontSizeInPixels = 22;
    learnBlock.color = "white";
    learnBlock.alpha = 0.7;
    learnBlock.top = "-160px";
    learnBlock.parent = backdrop;

    // const header = 

    this.advancedTexture.addControl(backdrop);
    this.advancedTexture.addControl(header);
    this.advancedTexture.addControl(learnBlock);
  }

  createPopUpBox(name, texts) {
    const rect = new Rectangle(`${name}Rectangle`);
    rect.width = "400px";
    rect.height = "200px";
    rect.cornerRadius = 20;
    rect.color = "white";
    rect.thickness = 2;
    rect.background = "black";
    rect.alpha = 0.7;

    const textBoxes = [];

    texts.forEach((text, index) => {
      const label = new TextBlock(`${name}Label`, text);
      label.fontFamily = 'Carter One', 'cursive';
      label.color = "white";
      label.alpha = 0.7;
      label.top = index > 0 ? "-50px" : "0";
      label.parent = rect;
      textBoxes.push(label);
    });

    const button = new Button.CreateSimpleButton(`${name}CloseButton`, 'close');
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.background = "black";
    button.top = "40px";
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
}

GUI.all = []