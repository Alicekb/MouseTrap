import {
  StandardMaterial, Color3 } from '@babylonjs/core';

export default class Player {
  constructor(mesh, cheeseCount, currentSpace, name, startingPosition) {
    this.mesh = mesh.clone(name);
    this.cheeseCount = cheeseCount;
    this.currentSpace = currentSpace;
    this.meshName = name;
    this.setup(startingPosition);
    Player.all.push(this);
  }

  setup(startingPosition) {
    let color;
    this.mesh.position = startingPosition;
    this.mesh.rotation.y = Math.PI / 2;

    const playerMaterial = new StandardMaterial(`${name}Material`);

    switch (this.meshName) {
      case 'playerOne':
        color = new Color3(1, 0, 0);
        break;
      case 'playerTwo':
        color = new Color3(0.61, 0.5, 0.89);
        break;
      case 'playerThree':
        color = new Color3(1, 0.03, 0.84);
        break;
      case 'playerFour':
        color = new Color3(1, 0.93, 0);
        break;
    }

    playerMaterial.diffuseColor = color;
    this.mesh.material = playerMaterial;
  }
}

Player.all = []