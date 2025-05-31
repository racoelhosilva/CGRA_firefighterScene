import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        // Building Properties
        this.gui.add(this.scene, 'buildingSize', 75, 150, 1).name("Building Size").onChange(this.scene.updateBuildingSize.bind(this.scene)).step(1);
        this.gui.add(this.scene, 'floorNumber', 1, 5, 1).name("Num of Floors").onChange(this.scene.updateFloorNumber.bind(this.scene)).step(1);
        this.gui.add(this.scene, 'windowNumber', 1, 4, 1).name("Num of Windows").onChange(this.scene.updateWindowNumber.bind(this.scene)).step(1);
        this.gui.add(this.scene, 'selectedWindowTexture', this.scene.windowTexturesIds).name('Selected Window Texture').onChange(this.scene.updateWindowTexture.bind(this.scene));
        this.gui.addColor(this.scene,'buildingColor').name("Building Color").onChange(this.scene.updateBuildingMaterial.bind(this.scene));

        this.gui.add(this.scene, 'speedFactor', 0.1, 3, 0.1).name("Speed Factor").step(0.1);

        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}