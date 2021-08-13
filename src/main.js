import "@babylonjs/core/Debug/debugLayer";
import { 
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  Color3, 
  DirectionalLight,
  StandardMaterial,
  Texture,
  SceneLoader, 
  PointerDragBehavior, 
  Animation, 
  GroundBuilder,
  BoxBuilder,
  KeyboardEventTypes,
  SphereBuilder
} from '@babylonjs/core';
import "@babylonjs/loaders/STL";
import "@babylonjs/core/Animations/animatable";
import boardSpaces from './boardSpaces.json';
import mouseModel from '../assets/models/mouse.stl';
import crankModel from '../assets/models/crank.stl';
import gearyModel from '../assets/models/geary.stl';
import stopModel from '../assets/models/stop.stl';
import bucketModel from '../assets/models/bucket.stl';
import bootModel from '../assets/models/boot.stl';
import lampModel from '../assets/models/lamp.stl';
import stairsModel from '../assets/models/stairs.stl';
import straightTrackModel from '../assets/models/trackstraight.stl';
import rightCurveTrackModel from '../assets/models/trackright.stl';
import leftCurveTrackModel from '../assets/models/trackleft.stl';
import boardImage from '../assets/board.jpg';
import './styles.css';
import Player from './player.js';
import GUI from './gui.js'

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine

let GLOBALS = {
  mice: [],
  board: undefined,
  camera: undefined,
  playerCount: 4,
  currentPlayer: 0,
  currentBuildPiece: 0,
  boardSpaces: boardSpaces,
  scene: undefined,
  colors: {
      yellow: new Color3(1, .85, 0),
      blue: new Color3(0, .3, .95),
      red: new Color3(.95, .1, .1),
      green: new Color3(.1, .7, .06)
  }
}

let behavior;

// Add your code here matching the playground format
const createScene = () => {
    const scene = new Scene(engine);
    GLOBALS.scene = scene;
    
    // Light
    const light = new DirectionalLight('light', new Vector3(0, -1, 0), scene);
    light.specular = new Color3(0, 0, 0);    

    const lightTwo = new DirectionalLight('lightTwo', new Vector3(0, 1, 0), scene);
    light.specular = new Color3(0, 0, 0);    

    initializeGame(scene);
    new GUI();
    const rollButton = GUI.all[0].createRollButton();
  GUI.all[0].createStartingCard()


    rollButton.onPointerUpObservable.add(() => {
      let rollResult = diceRoller();
      moveSpaces(Player.all[GLOBALS.currentPlayer % GLOBALS.playerCount], rollResult);

    });

    scene.onKeyboardObservable.add((keyboardInfo) => {
    switch (keyboardInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
            let rollResult = diceRoller();
            // this.create
            moveSpaces(Player.all[GLOBALS.currentPlayer % GLOBALS.playerCount], rollResult);
            break;
    }
    })

    return scene;
};


const diceRoller = () => {
  return Math.floor(Math.random() * 6) + 1
}


const initializeGame = (scene) => {
    // Camera
    const camera = new ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3, 24, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // Tabletop
  const board = GroundBuilder.CreateGround('tabletop', { width: 10, height: 10 }, scene)
    const mapMaterial = new StandardMaterial('tabletop material', scene)
    mapMaterial.diffuseTexture = new Texture(boardImage)
    board.material = mapMaterial;
    board.scaling = new Vector3(2, 2, 2);
    
    SceneLoader.ImportMesh(null, '', mouseModel, scene, function(res) {
        createPlayers(res[0]);
            
        
        // const pointerDrag = new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) });
        // console.log(Player.all[0])
        // pointerDrag.attach(Player.all[0].mesh);
        // pointerDrag.onDragEndObservable.add((event) => {
        // console.log("****************************************")
        //     console.log(`x value: ${Player.all[0].mesh.position.x}`)
        //     console.log(`z value: ${Player.all[0].mesh.position.z}`)
        // });
    })

    const base = BoxBuilder.CreateBox("base", {
        height: 0.2,
        width: 0.5,
        depth: 10
    });
    base.position = new Vector3(-0.5, 0, -6);
    base.rotation.y = Math.PI / 2.25;
    const baseMaterial = new StandardMaterial("baseMaterial");
    baseMaterial.diffuseColor = GLOBALS.colors.yellow;
    base.material = baseMaterial;

    const gearSupport = BoxBuilder.CreateBox("gear_support", {
        height: 2,
        width: 0.8,
        depth: 0.2
    });
    gearSupport.position = new Vector3(4, 1, -5.3);
    gearSupport.rotation.y = -Math.PI / 12;
    const gearBaseMaterial = new StandardMaterial("gearBaseMaterial");
    gearBaseMaterial.diffuseColor = GLOBALS.colors.blue;
    gearSupport.material = gearBaseMaterial;

    SceneLoader.ImportMesh(null, "", crankModel, scene, function(res) {
        const crank = res[0];
        crank.scaling = new Vector3(0.03, 0.03, 0.03);
        crank.position = new Vector3(3.95, 1.75, -5.4);
        crank.rotation.z = Math.PI / 2;
        crank.rotation.y = Math.PI / 2.3;
        const crankMaterial = new StandardMaterial("crankMaterial");
        crankMaterial.diffuseColor = GLOBALS.colors.green;
        crank.material = crankMaterial;
   });
   

   SceneLoader.ImportMesh(null, "", gearyModel, scene, function(res) {
    const gearOne = res[0];
    gearOne.scaling = new Vector3(0.03, 0.03, 0.03);
    gearOne.position = new Vector3(3.8, 1.3, -5.3);
    gearOne.rotation.z = Math.PI / 2;
    gearOne.rotation.y = Math.PI / 2.3;
    const gearyOneMaterial = new StandardMaterial("gearyOneMaterial");
    gearyOneMaterial.diffuseColor = GLOBALS.colors.red;
    gearOne.material = gearyOneMaterial;
});

    SceneLoader.ImportMesh(null, "", gearyModel, scene, function(res) {
        const gearTwo = res[0];
        gearTwo.scaling = new Vector3(0.03, 0.03, 0.03);
        gearTwo.position = new Vector3(3.6, 1.3, -3.8);
        gearTwo.rotation.z = 0;
        gearTwo.rotation.y = Math.PI / 2.3;
        const gearyTwoMaterial = new StandardMaterial("gearyTwoMaterial");
        gearyTwoMaterial.diffuseColor = GLOBALS.colors.yellow;
        gearTwo.material = gearyTwoMaterial;
    });

    //paired with stop
    const stopArm = BoxBuilder.CreateBox("stopArm", {
        height: 0.2,
        width: 0.5,
        depth: 10
    });
    stopArm.position = new Vector3(-1.75, 1.5, -5)
    stopArm.rotation.z = Math.PI / 2;
    stopArm.rotation.y = Math.PI / 2.2;
    const stopArmMaterial = new StandardMaterial("stopArmMaterial");
    stopArmMaterial.diffuseColor = GLOBALS.colors.red;
    stopArm.material = stopArmMaterial;
    SceneLoader.ImportMesh(null, "", stopModel, scene, function(res) {
        const stopSign = res[0];
        stopSign.scaling = new Vector3(0.02, 0.02, 0.02);
        stopSign.position = new Vector3(-5.8, 1.5, -5.35);
        stopSign.rotation.z = Math.PI / 2;
        stopSign.rotation.x = -Math.PI / 2;
        stopSign.rotation.y = Math.PI / 2.25;
        const stopSignMaterial = new StandardMaterial("stopSignMaterial");
        stopSignMaterial.diffuseColor = GLOBALS.colors.red;
        stopSign.material = stopSignMaterial;
    });

    SceneLoader.ImportMesh(null, "", lampModel, scene, function(res) {
        const lamp = res[0];
        lamp.scaling = new Vector3(0.09, 0.09, 0.09);
        lamp.position = new Vector3(-4.5, 0, -5);
        lamp.rotation.z = Math.PI / 2;
        lamp.rotation.x = -Math.PI / 2;
        lamp.rotation.y = Math.PI / 2;
        const lampMaterial = new StandardMaterial("lampMaterial");
        lampMaterial.diffuseColor = GLOBALS.colors.yellow;
        lamp.material = lampMaterial;
    });

    //paired with boot
    const bootArm = BoxBuilder.CreateBox("bootArm", {
        height: 2.2,
        width: 0.15,
        depth: 0.15
    });
    bootArm.position = new Vector3(-5.8, 3.5, -4.95)
    bootArm.rotation.y = Math.PI / 2.2;
    const bootArmMaterial = new StandardMaterial("bootArmMaterial");
    bootArmMaterial.diffuseColor = GLOBALS.colors.green;
    bootArm.material = bootArmMaterial;
    SceneLoader.ImportMesh(null, "", bootModel, scene, function(res) {
        const boot = res[0];
        boot.scaling = new Vector3(0.01, 0.01, 0.01);
        boot.position = new Vector3(-5.8, 2.5, -4.3);
        boot.rotation.y = -Math.PI / 4;
        const bootMaterial = new StandardMaterial("bootMaterial");
        bootMaterial.diffuseColor = GLOBALS.colors.green;
        boot.material = bootMaterial;
    });

    SceneLoader.ImportMesh(null, "", stairsModel, scene, function(res) {
        const stairsOne = res[0];
        stairsOne.scaling = new Vector3(0.1, 0.1, 0.05);
        stairsOne.position = new Vector3(-5.1, 1.25, -2);
        stairsOne.rotation.y = Math.PI / 20;
        const stairsOneMaterial = new StandardMaterial("stairsOneMaterial");
        stairsOneMaterial.diffuseColor = GLOBALS.colors.blue;
        stairsOne.material = stairsOneMaterial;
    });
    SceneLoader.ImportMesh(null, "", stairsModel, scene, function(res) {
        const stairsTwo = res[0];
        stairsTwo.scaling = new Vector3(0.1, 0.1, 0.05);
        stairsTwo.position = new Vector3(-4.75, 0.75, -.5);
        stairsTwo.rotation.y = Math.PI / 20;
        const stairsTwoMaterial = new StandardMaterial("stairsTwoMaterial");
        stairsTwoMaterial.diffuseColor = GLOBALS.colors.blue;
        stairsTwo.material = stairsTwoMaterial;
    });
    const stairLegOne = BoxBuilder.CreateBox("stairLegOne", {
        height: 2,
        width: 0.25,
        depth: 0.25
    });
    stairLegOne.position = new Vector3(-4.8, 1, -3.5)
    const stairLegTwo = BoxBuilder.CreateBox("stairLegTwo", {
        height: 2,
        width: 0.25,
        depth: 0.25
    });
    stairLegTwo.position = new Vector3(-6.7, 1, -3)
    const stairLegThree = BoxBuilder.CreateBox("stairLegThree", {
        height: 0.75,
        width: 0.25,
        depth: 0.25
    });
    stairLegThree.position = new Vector3(-6, 0.375, 0.75)
    const stairLegFour = BoxBuilder.CreateBox("stairLegFour", {
        height: 0.75,
        width: 0.25,
        depth: 0.25
    });
    stairLegFour.position = new Vector3(-3.9, 0.375, 0.5)
    const stairsLegsMaterial = new StandardMaterial("stairsLegsMaterial");
    stairsLegsMaterial.diffuseColor = GLOBALS.colors.blue;
    stairLegOne.material = stairsLegsMaterial;
    stairLegTwo.material = stairsLegsMaterial;
    stairLegThree.material = stairsLegsMaterial;
    stairLegFour.material = stairsLegsMaterial;

    SceneLoader.ImportMesh(null, "", bucketModel, scene, function(res) {
        const bucket = res[0];
        bucket.scaling = new Vector3(0.005, 0.005, 0.005);
        bucket.position = new Vector3(-6.2, 2.175, -3.4);
        bucket.rotation.y = Math.PI / 20;
        const bucketMaterial = new StandardMaterial("bucketMaterial");
        bucketMaterial.diffuseColor = GLOBALS.colors.yellow;
        bucket.material = bucketMaterial;
    });

    const marble = SphereBuilder.CreateSphere("marble", { diameter: 0.5 });
    marble.position = new Vector3(-5.72, 2.4, -3.15)
    const marbleMaterial = new StandardMaterial("marbleMaterial");
    marbleMaterial.diffuseColor = GLOBALS.colors.yellow;
    marble.material = marbleMaterial;

    const baseTwo = BoxBuilder.CreateBox("baseTwo", {
        height: 0.2,
        width: 1,
        depth: 8
    });
    baseTwo.position = new Vector3(5.8, 0, 2);
    baseTwo.rotation.y = -5.5*Math.PI/6;
    const baseTwoMaterial = new StandardMaterial("baseTwoMaterial");
    baseTwoMaterial.diffuseColor = GLOBALS.colors.yellow;
    baseTwo.material = baseTwoMaterial;

    let trackPartOne = null;
    const trackMaterial = new StandardMaterial("trackMaterial");
    trackMaterial.diffuseColor = GLOBALS.colors.red;
    SceneLoader.ImportMesh(null, "", rightCurveTrackModel, scene, function(res) {
        trackPartOne = res[0];
        trackPartOne.scaling = new Vector3(0.0125, 0.0125, 0.0125);
        trackPartOne.position = new Vector3(-6.2, 1.1, 1);
        trackPartOne.rotation.y = Math.PI / 20;
        trackPartOne.rotation.x = Math.PI / 2;

        trackPartOne.material = trackMaterial;

        
    SceneLoader.ImportMesh(null, "", rightCurveTrackModel, scene, function(res) {
        const trackPartTwo = res[0];
        trackPartTwo.scaling = new Vector3(0.0125, 0.0125, 0.0125);
        trackPartTwo.position = new Vector3(-4.2, 1.1, 2.75);
        trackPartTwo.rotation.y = Math.PI / 2;
        trackPartTwo.rotation.x = Math.PI / 2;

        trackPartTwo.material = trackMaterial;

        trackPartOne.addChild(trackPartTwo);
    });
    SceneLoader.ImportMesh(null, "", leftCurveTrackModel, scene, function(res) {
        const trackPartThree = res[0];
        trackPartThree.scaling = new Vector3(0.0125, 0.0125, 0.0125);
        trackPartThree.position = new Vector3(-0.5, 1.1, 0.65);
        trackPartThree.rotation.y = Math.PI;
        trackPartThree.rotation.x = Math.PI / 2;

        trackPartThree.material = trackMaterial;

        trackPartOne.addChild(trackPartThree);
    });
    SceneLoader.ImportMesh(null, "", straightTrackModel, scene, function(res) {
        const trackPartFour = res[0];
        trackPartFour.scaling = new Vector3(0.0125, 0.0125, 0.0125);
        trackPartFour.position = new Vector3(-.75, 1.1, -0.93);
        trackPartFour.rotation.y = Math.PI / 2;
        trackPartFour.rotation.x = Math.PI / 2;

        trackPartFour.material = trackMaterial;

        trackPartOne.addChild(trackPartFour);
    });
    SceneLoader.ImportMesh(null, "", straightTrackModel, scene, function(res) {
        const trackPartFive = res[0];
        trackPartFive.scaling = new Vector3(0.0125, 0.0125, 0.0125);
        trackPartFive.position = new Vector3(1.1, 1.1, -0.93);
        trackPartFive.rotation.y = Math.PI / 2;
        trackPartFive.rotation.x = Math.PI / 2;

        trackPartFive.material = trackMaterial;

        trackPartOne.addChild(trackPartFive);
    });
    SceneLoader.ImportMesh(null, "", straightTrackModel, scene, function(res) {
        const trackPartSix = res[0];
        trackPartSix.scaling = new Vector3(0.0125, 0.0125, 0.0125);
        trackPartSix.position = new Vector3(2.95, 1.1, -0.93);
        trackPartSix.rotation.y = Math.PI / 2;
        trackPartSix.rotation.x = Math.PI / 2;

        trackPartSix.material = trackMaterial;
        
        trackPartOne.addChild(trackPartSix);

        trackPartOne.addRotation(0, -Math.PI / 35, 0);

        
        marble.material = marbleMaterial;
    });
    });
    

    camera.setTarget(board.position);

    GLOBALS.camera = camera;
    GLOBALS.board = board;
}

const createPlayers = (mouseMesh) => {
    mouseMesh.scaling = new Vector3(0.007, 0.007, 0.007)
    
    new Player(mouseMesh, 0, 0, 'playerOne', new Vector3(-8.2, 0, 1.5))
    new Player(mouseMesh, 0, 0, 'playerTwo', new Vector3(-7.8, 0, 1))
    new Player(mouseMesh, 0, 0, 'playerThree', new Vector3(-8.6, 0, 1.3))
    new Player(mouseMesh, 0, 0, 'playerFour', new Vector3(-7.8, 0, 1.5))


    mouseMesh.dispose()
}

const moveSpaces = (player, spaceCount) => {
    let newSpaceIndex = player.currentSpace + spaceCount;
    if (newSpaceIndex > GLOBALS.boardSpaces.length) {
        let startSpace = 44; //The SAFE space
        newSpaceIndex = startSpace + spaceCount;
    }

    const endSpace = adjustPlayerPositions(GLOBALS.boardSpaces[player.currentSpace + spaceCount], player.currentSpace + spaceCount);
    for (let i = player.currentSpace; i < player.currentSpace + spaceCount; i++) {
        if (GLOBALS.boardSpaces[i].corner != null) {
            // const cornerAnim = new Animation(`moveToCorner-${i}`, 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
            // player.mesh.animations.push(cornerAnim);
            
            //Animation.CreateAndStartAnimation(`moveToCorner-${i}`, player.mesh, "position", 30, 30, player.mesh.position, new Vector3(i.x, 0, i.z), Animation.ANIMATIONLOOPMODE_CONSTANT);
            
            turnPlayer(player);
        }
    }
    
    Animation.CreateAndStartAnimation("moveSpaces", player.mesh, "position", 30, 30, player.mesh.position, new Vector3(endSpace.x, 0, endSpace.z), Animation.ANIMATIONLOOPMODE_CONSTANT);
    player.currentSpace = player.currentSpace + spaceCount;

    GUI.all[0].createPopUpBox('resolveSpace', [`You rolled a ${spaceCount}`, endSpace.body]);
  resolveSpace(endSpace);
}

const turnPlayer = (player) => {
    player.mesh.rotation.y += -Math.PI / 2;
}

const resolveSpace = (space) => {
    if (space.type == "build" && space.body.includes(GLOBALS.playerCount.toString())) {
        buildNewPiece();
    }
    else if(space.type == "goback") {
        moveSpaces(Player.all[GLOBALS.currentPlayer % GLOBALS.playerCount], -space.spaces);
    }
    else if (space.type == "goforward") {
        moveSpaces(Player.all[GLOBALS.currentPlayer % GLOBALS.playerCount], space.spaces);
    }

    GLOBALS.currentPlayer++;

}

const buildNewPiece = () => {
    GLOBALS.currentBuildPiece++;
    if (GLOBALS.currentBuildPiece > 24) return;
    switch (GLOBALS.currentBuildPiece) {
        case 1:
        const base = BoxBuilder.CreateBox("base", {
                height: 0.2,
                width: 0.5,
                depth: 10,
                faceColors: new Color3(0, 0, 1)
            });
        
            base.position = new Vector3(-0.5, 0, -6);
            base.rotation.y = Math.PI / 2.25;
            break;
        case 2:
        const gear_support = BoxBuilder.CreateBox("gear_support", {
                height: 2,
                width: 0.8,
                depth: 0.2,
                faceColors: new Color3(0, 0, 1)
            });
        
            gear_support.position = new Vector3(4, 1, -5.3);
            gear_support.rotation.y = -Math.PI / 12;
            break;
        case 3:
            SceneLoader.ImportMesh("", "", gearyModel, scene, function(res) {
                 const gearOne = res[0];
                 gearOne.scaling = new Vector3(0.03, 0.03, 0.03);
                 gearOne.position = new Vector3(3.8, 1.3, -5.3);
                 gearOne.rotation.z = Math.PI / 2;
                 gearOne.rotation.y = Math.PI / 2.3;
            });
            break;
        case 4:
            SceneLoader.ImportMesh("", "", crankModel, scene, function(res) {
                const gearTwo = res[0];
                gearTwo.scaling = new Vector3(0.03, 0.03, 0.03);
                gearTwo.position = new Vector3(3.95, 1.75, -5.4);
                gearTwo.rotation.z = Math.PI / 2;
                gearTwo.rotation.y = Math.PI / 2.3;
           });
        case 5:
            SceneLoader.ImportMesh("", "", gearyModel, scene, function(res) {
                const gearTwo = res[0];
                gearTwo.scaling = new Vector3(0.03, 0.03, 0.03);
                gearTwo.position = new Vector3(3.6, 1.3, -3.8);
                gearTwo.rotation.z = 0;
                gearTwo.rotation.y = Math.PI / 2.3;
            });
        case 6:
        const stopArm = BoxBuilder.CreateBox("base", {
                height: 0.2,
                width: 0.5,
                depth: 9
            });
            stopArm.position = new Vector3(-0.75, 1.7, -6.5)
            stopArm.rotation.z = Math.PI / 2;
            stopArm.rotation.y = Math.PI / 2.1;
            SceneLoader.ImportMesh("", "", stopModel, scene, function(res) {
                const stopSign = res[0];
                stopSign.scaling = new Vector3(0.02, 0.02, 0.02);
                stopSign.position = new Vector3(-4.25, 1.5, -6.6);
                stopSign.rotation.z = Math.PI / 2;
                stopSign.rotation.x = -Math.PI / 2;
                stopSign.rotation.y = Math.PI / 2;
            });
            break;
        default:
            console.log("we haven't gotten to this one yet");
    }
}

const adjustPlayerPositions = (endSpace, endSpaceIndex) => {

    var playersOnSpace = [];
    var newSpace = endSpace;
    for (let i = 0; i < Player.all.length; i++) {
        if (Player.all[i].currentSpace == endSpaceIndex)
            playersOnSpace.push(Player.all[i]);
    }

    if (playersOnSpace.length == 0) return endSpace

    switch (playersOnSpace.length) {
        case 1:
            //If you're moving along the z axis (starting position)
            if (endSpaceIndex < 7 || (endSpaceIndex > 20 && endSpaceIndex < 34)) {
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[0].mesh, "position", 30, 30, playersOnSpace[0].mesh.position, new Vector3(endSpace.x - 0.3, 0, endSpace.z), Animation.ANIMATIONLOOPMODE_CONSTANT);
                newSpace.x = newSpace.x + 0.3;
            }
            //If you're moving along the x axis
            else {
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[0].mesh, "position", 30, 30, playersOnSpace[0].mesh.position, new Vector3(endSpace.x, 0, endSpace.z - 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                newSpace.z = newSpace.z + 0.3;
            }
            break;
        case 2:
            //If you're moving along the z axis (starting position)
            if (endSpaceIndex < 7 || (endSpaceIndex > 20 && endSpaceIndex < 34)) {
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[0].mesh, "position", 30, 30, playersOnSpace[0].mesh.position, new Vector3(endSpace.x - 0.3, 0, endSpace.z - 0.1), Animation.ANIMATIONLOOPMODE_CONSTANT);
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[1].mesh, "position", 30, 30, playersOnSpace[1].mesh.position, new Vector3(endSpace.x + 0.3, 0, endSpace.z - 0.1), Animation.ANIMATIONLOOPMODE_CONSTANT);
                newSpace.z = newSpace.z + 0.2;
            }
            else {
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[0].mesh, "position", 30, 30, playersOnSpace[0].mesh.position, new Vector3(endSpace.x - 0.1, 0, endSpace.z - 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[1].mesh, "position", 30, 30, playersOnSpace[1].mesh.position, new Vector3(endSpace.x - 0.1, 0, endSpace.z + 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                newSpace.x = newSpace.x + 0.2;
            }
            //move them to the left and right and up a bit
            break;
        case 3:
            if (endSpaceIndex < 7 || (endSpaceIndex > 20 && endSpaceIndex < 34)) {
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[1].mesh, "position", 30, 30, playersOnSpace[1].mesh.position, new Vector3(endSpace.x - 0.3, 0, endSpace.z - 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[0].mesh, "position", 30, 30, playersOnSpace[0].mesh.position, new Vector3(endSpace.x - 0.3, 0, endSpace.z + 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[2].mesh, "position", 30, 30, playersOnSpace[2].mesh.position, new Vector3(endSpace.x + 0.3, 0, endSpace.z - 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                newSpace.x = newSpace.x + 0.3;
                newSpace.z = newSpace.z + 0.3;
            }
            else {
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[1].mesh, "position", 30, 30, playersOnSpace[1].mesh.position, new Vector3(endSpace.x - 0.3, 0, endSpace.z - 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[0].mesh, "position", 30, 30, playersOnSpace[0].mesh.position, new Vector3(endSpace.x - 0.3, 0, endSpace.z + 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                Animation.CreateAndStartAnimation("moveSpaces", playersOnSpace[2].mesh, "position", 30, 30, playersOnSpace[2].mesh.position, new Vector3(endSpace.x + 0.3, 0, endSpace.z - 0.3), Animation.ANIMATIONLOOPMODE_CONSTANT);
                newSpace.x = newSpace.x + 0.3;
                newSpace.z = newSpace.z + 0.3;
            }
            break;
        default:
            console.log("default? what are you doing here")
    }

    return newSpace;
}

const targetToken = (token, camera) => {
    camera.setTarget(token.position);
}

const scene = createScene(); //Call the createScene function

// scene.onKeyboardObservable.add((keyboardInfo) => {
//     switch (keyboardInfo.type) {
//         case KeyboardEventTypes.KEYDOWN:
            
//             break;
//     }
// })

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});