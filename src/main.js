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
  KeyboardEventTypes
} from '@babylonjs/core';
import "@babylonjs/loaders/STL";
import "@babylonjs/core/Animations/animatable";
import boardSpaces from './boardSpaces.json';
import mouseModel from '../assets/models/mouse.stl';
import crankModel from '../assets/models/crank.stl';
import gearyModel from '../assets/models/geary.stl';
import stopModel from '../assets/models/stop.stl';
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
  scene: undefined
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
      // this.create
      moveSpaces(Player.all[GLOBALS.currentPlayer % 4], rollResult);

    });

    scene.onKeyboardObservable.add((keyboardInfo) => {
    switch (keyboardInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
            let rollResult = diceRoller();
            // this.create
            moveSpaces(Player.all[GLOBALS.currentPlayer % 4], rollResult);
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
        console.log(res);
        createPlayers(res[0]);
        // res[0].scaling = new BABYLON.Vector3(0.007, 0.007, 0.007)
        
        // const playerOne = new Player(mouseMesh, 0, 0, 'playerOne')
        // playerOne.mesh.position = new BABYLON.Vector3(-8, 0, 1.7)
        //     createPlayers(res[0]);
            
        
        // const pointerDrag = new PointerDragBehavior({ dragPlaneNormal: new Vector3(0, 1, 0) });
        // console.log(Player.all[0])
        // pointerDrag.attach(Player.all[0].mesh);
        // pointerDrag.onDragEndObservable.add((event) => {
        // console.log("****************************************")
        //     console.log(`x value: ${Player.all[0].mesh.position.x}`)
        //     console.log(`z value: ${Player.all[0].mesh.position.z}`)
        // });
    })

    camera.setTarget(board.position)

    GLOBALS.camera = camera
    GLOBALS.board = board
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

    const endSpace = adjustPlayerPositions(GLOBALS.boardSpaces[player.currentSpace + spaceCount], player.currentSpace + spaceCount);
    for (let i = player.currentSpace; i < player.currentSpace + spaceCount; i++) {
        if (GLOBALS.boardSpaces[i].corner != null) {
            // const cornerAnim = new BABYLON.Animation(`moveToCorner-${i}`, 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            // player.mesh.animations.push(cornerAnim);
            
            //BABYLON.Animation.CreateAndStartAnimation(`moveToCorner-${i}`, player.mesh, "position", 30, 30, player.mesh.position, new BABYLON.Vector3(i.x, 0, i.z), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            
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
    if (space.type == "build" && space.body.includes("4")) {
        buildNewPiece();
    }
    else if(space.type == "goback") {
        moveSpaces(Player.all[GLOBALS.currentPlayer % 4], -space.spaces);
    }
    else if (space.type == "goforward") {
        moveSpaces(Player.all[GLOBALS.currentPlayer % 4], space.spaces);
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
//         case BABYLON.KeyboardEventTypes.KEYDOWN:
            
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