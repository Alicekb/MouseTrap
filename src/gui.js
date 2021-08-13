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

  createPopUpBox(name, texts) {
    const rect = new Rectangle(`${name}Rectangle`);
    rect.width = "400px";
    rect.height = "200px";
    rect.cornerRadius = 20;
    rect.color = "white";
    rect.thickness = 2;
    rect.background = "black";
    rect.alpha = 0.7;

    const textBoxes = []

    texts.forEach((text, index) => {
      const label = new TextBlock(`${name}Label`, text);
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