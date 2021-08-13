const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

let GLOBALS = {
  mice: [],
  board: undefined,
  camera: undefined,
  currentPlayer: 0,
  currentBuildPiece: 0,
  boardSpaces: boardSpaces
}

class GUI {
    constructor() {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('mouseTrapUI');
        this.createRollButton()
        GUI.all.push(this)
    };

    createRollButton() {
        const button = BABYLON.GUI.Button.CreateSimpleButton('roll', 'Roll Dice!');
        button.width = "100px";
        button.height = "50px";
        button.color = 'black';
        button.cornerRaidus = 20;
        button.background = "pink";
        button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.left = "-20px";

        button.onPointerUpObservable.add(() => {
            let rollResult = diceRoller();
            // this.create
            moveSpaces(Player.all[GLOBALS.currentPlayer % 4], rollResult);
            
        });

        this.advancedTexture.addControl(button);
    }

    createPopUpBox(name, texts, endSpace) {
        const rect = new BABYLON.GUI.Rectangle(`${name}Rectangle`);
        rect.width = "400px";
        rect.height = "200px";
        rect.cornerRadius = 20;
        rect.color = "white";
        rect.thickness = 2;
        rect.background = "black";
        rect.alpha = 0.7;

        const textBoxes = []

        texts.forEach((text, index) => {
            const label = new BABYLON.GUI.TextBlock(`${name}Label`, text);
            label.color = "white";
            label.alpha = 0.7;
            label.top = index > 0 ? "-50px" : "0";
            label.parent = rect;
            textBoxes.push(label);
        });
        
        const button = new BABYLON.GUI.Button.CreateSimpleButton(`${name}CloseButton`, 'close');
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
            resolveSpace(endSpace);
        })
        
        this.advancedTexture.addControl(rect);
        textBoxes.forEach(textBox => {
            this.advancedTexture.addControl(textBox);
        })
        this.advancedTexture.addControl(button);
    }
}

GUI.all = []

let behavior;

// Add your code here matching the playground format
const createScene = () => {
    const scene = new BABYLON.Scene(engine)
    
    // Light
    const light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(0, -1, 0), scene)
    light.specular = new BABYLON.Color3(0, 0, 0);    

    const lightTwo = new BABYLON.DirectionalLight('lightTwo', new BABYLON.Vector3(0, 1, 0), scene)
    light.specular = new BABYLON.Color3(0, 0, 0);    

    initializeGame(scene)
    // initializeGUI()
    new GUI('mouseTrapUI')
    // BABYLON.SceneLoader.ImportMeshAsync("mouse", "", "mouse.babylon", scene)
    // .then(res => {
    //     const { meshes } = res;
    //     console.log(res)
        
    //     meshes.forEach(mesh => {
    //       mesh.position = new BABYLON.Vector3(0, 0, 0);
    //     });
    //     const mouse = BABYLON.Mesh.MergeMeshes(meshes, false, true)
    //     console.log(mouse)
    //     mouse.position = new Vector(2, 3, 4);
    //     // mouse.position.y = 10
    // })

    

    return scene;
};

const diceRoller = () => {
    return Math.floor(Math.random() * 6) + 1
}

const initializeGame = (scene) => {
    // Camera
    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3, 24, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // Tabletop
    const board = BABYLON.MeshBuilder.CreateGround('tabletop', { width: 10, height: 10 })
    const mapMaterial = new BABYLON.StandardMaterial('tabletop material', scene)
    mapMaterial.diffuseTexture = new BABYLON.Texture('https://i.imgur.com/rukAjgo.jpg')
    board.material = mapMaterial;
    board.scaling = new BABYLON.Vector3(2, 2, 2);
    
    BABYLON.SceneLoader.ImportMesh(null, "./", "./models/Mouse.STL", scene, function(res) {
        createPlayers(res[0]);
        // res[0].scaling = new BABYLON.Vector3(0.007, 0.007, 0.007)
        
        // const playerOne = new Player(mouseMesh, 0, 0, 'playerOne')
        // playerOne.mesh.position = new BABYLON.Vector3(-8, 0, 1.7)
        //     createPlayers(res[0]);
            
        
            const pointerDrag = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 1, 0) });
            console.log(Player.all[0])
            pointerDrag.attach(Player.all[0].mesh);
            pointerDrag.onDragEndObservable.add((event) => {
            console.log("****************************************")
                console.log(`x value: ${Player.all[0].mesh.position.x}`)
                console.log(`z value: ${Player.all[0].mesh.position.z}`)
            });

        
        
    });

    camera.setTarget(board.position)

    GLOBALS.camera = camera
    GLOBALS.board = board
}

const createPlayers = (mouseMesh) => {
    mouseMesh.scaling = new BABYLON.Vector3(0.007, 0.007, 0.007)
    
    new Player(mouseMesh, 0, 0, 'playerOne', new BABYLON.Vector3(-8, 0, 1.7))
    new Player(mouseMesh, 0, 0, 'playerTwo', new BABYLON.Vector3(-8, 0, 1))
    new Player(mouseMesh, 0, 0, 'playerThree', new BABYLON.Vector3(-8, 0, 1.3))
    new Player(mouseMesh, 0, 0, 'playerFour', new BABYLON.Vector3(-8, 0, 1.5))


    mouseMesh.dispose()
}

const moveSpaces = (player, spaceCount) => {

    const endSpace = GLOBALS.boardSpaces[player.currentSpace + spaceCount];
    for (let i = player.currentSpace; i < player.currentSpace + spaceCount; i++) {
        if (GLOBALS.boardSpaces[i].corner != null) {
            // const cornerAnim = new BABYLON.Animation(`moveToCorner-${i}`, 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            // player.mesh.animations.push(cornerAnim);
            
            //BABYLON.Animation.CreateAndStartAnimation(`moveToCorner-${i}`, player.mesh, "position", 30, 30, player.mesh.position, new BABYLON.Vector3(i.x, 0, i.z), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            
            turnPlayer(player);
        }
    }
    
    BABYLON.Animation.CreateAndStartAnimation("moveSpaces", player.mesh, "position", 30, 30, player.mesh.position, new BABYLON.Vector3(endSpace.x, 0, endSpace.z), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    player.currentSpace = player.currentSpace + spaceCount;

    GUI.all[0].createPopUpBox('resolveSpace', [`You rolled a ${spaceCount}`, endSpace.body], endSpace);
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
            const base = BABYLON.MeshBuilder.CreateBox("base", {
                height: 0.2,
                width: 0.5,
                depth: 10,
                faceColors: BABYLON.Color3(0, 0, 1)
            });
        
            base.position = new BABYLON.Vector3(-0.5, 0, -6);
            base.rotation.y = Math.PI / 2.25;
            break;
        case 2:
            const gear_support = BABYLON.MeshBuilder.CreateBox("gear_support", {
                height: 2,
                width: 0.8,
                depth: 0.2,
                faceColors: BABYLON.Color3(0, 0, 1)
            });
        
            gear_support.position = new BABYLON.Vector3(4, 1, -5.3);
            gear_support.rotation.y = -Math.PI / 12;
            break;
        case 3:
            BABYLON.SceneLoader.ImportMesh(null, "./", "./models/geary.STL", scene, function(res) {
                 const gearOne = res[0];
                 gearOne.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
                 gearOne.position = new BABYLON.Vector3(3.8, 1.3, -5.3);
                 gearOne.rotation.z = Math.PI / 2;
                 gearOne.rotation.y = Math.PI / 2.3;
            });
            break;
        case 4:
            BABYLON.SceneLoader.ImportMesh(null, "./", "./models/crank.STL", scene, function(res) {
                const gearTwo = res[0];
                gearTwo.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
                gearTwo.position = new BABYLON.Vector3(3.95, 1.75, -5.4);
                gearTwo.rotation.z = Math.PI / 2;
                gearTwo.rotation.y = Math.PI / 2.3;
           });
        case 5:
            BABYLON.SceneLoader.ImportMesh(null, "./", "./models/geary.STL", scene, function(res) {
                const gearTwo = res[0];
                gearTwo.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03);
                gearTwo.position = new BABYLON.Vector3(3.6, 1.3, -3.8);
                gearTwo.rotation.z = 0;
                gearTwo.rotation.y = Math.PI / 2.3;
            });
        case 6:
            const stopArm = BABYLON.MeshBuilder.CreateBox("base", {
                height: 0.2,
                width: 0.5,
                depth: 9
            });
            stopArm.position = new BABYLON.Vector3(-0.75, 1.7, -6.5)
            stopArm.rotation.z = Math.PI / 2;
            stopArm.rotation.y = Math.PI / 2.1;
            BABYLON.SceneLoader.ImportMesh(null, "./", "./models/stop.STL", scene, function(res) {
                const stopSign = res[0];
                stopSign.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
                stopSign.position = new BABYLON.Vector3(-4.25, 1.5, -6.6);
                stopSign.rotation.z = Math.PI / 2;
                stopSign.rotation.x = -Math.PI / 2;
                stopSign.rotation.y = Math.PI / 2;
            });
            break;
        default:
            console.log("we haven't gotten to this one yet");
    }
}

const switchToIsometric = (scene) => {
    const token = scene.getMeshByName('token');
    token.rotation.x = 0;
    token.position.y = 0;
    const camera = scene.getCameraByName('camera');
    camera.position = new BABYLON.Vector3(5, 1, -5);
    camera.setTarget(token.position);

    const oldPos = camera.position;
    //const animation = new BABYLON.Animation("transition", camera, "position", 30, 30, camera.position, new BABYLON.Vector3(5, 1, -5))
    // const alphaanimation = new BABYLON.Animation("transition", "alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    // const betaanimation = new BABYLON.Animation("transition", "beta", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    // var alphakeys = [];
    // alphakeys.push({ frame: 0, value: camera.position});
    // alphakeys.push({frame: 100, value: Math.PI / 2});
    // var betakeys = [];
    // betakeys.push({frame: 0, value: camera.alpha}, {frame: 100, value: Math.PI / 1.5})

    // alphaanimation.setKeys(alphakeys);
    // betaanimation.setKeys(betakeys);
    // camera.animations.push(alphaanimation);
    // camera.animations.push(betaanimation);
    // scene.beginAnimation(camera, 0, 100, false);
    //camera.attachControl(canvas, true);
    //BABYLON.Animation.CreateAndStartAnimation("transition", camera, "position", 30, 30, oldPos, new BABYLON.Vector3(5, 1, -5), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, targetToken(token, camera));
    //camera.setTarget(token.position);


    token.rotation.y = -Math.PI / 4;
    token.position.y = 0.5;

    const light = scene.getLightByName('light');
    light.direction = new BABYLON.Vector3(-5, -5, 5);

    behavior.detach()
    const pointerDrag = new BABYLON.PointerDragBehavior({ dragPlaneNormal: new BABYLON.Vector3(0, 1, 0) });
    pointerDrag.attach(token);
}

targetToken = (token, camera) => {
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

class Player {
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

        const playerMaterial = new BABYLON.StandardMaterial(`${name}Material`);
        
        switch(this.meshName) {
            case 'playerOne':
              color = new BABYLON.Color3(1, 0, 0);
              break;
            case 'playerTwo':
              color = new BABYLON.Color3(0.61, 0.5, 0.89);
                break;
            case 'playerThree':
              color = new BABYLON.Color3(1, 0.03, 0.84);
              break;
            case 'playerFour':
              color = new BABYLON.Color3(1, 0.93, 0);
              break;
        }

        playerMaterial.diffuseColor = color;
        this.mesh.material = playerMaterial;
    }
 }

Player.all = []