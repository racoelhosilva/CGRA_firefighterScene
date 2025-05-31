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
        this.gui.add(this.scene, 'floorNumber', 2, 5, 1).name("Num of Floors").onChange(this.scene.updateFloorNumber.bind(this.scene)).step(1);
        this.gui.add(this.scene, 'windowNumber', 1, 4, 1).name("Num of Windows").onChange(this.scene.updateWindowNumber.bind(this.scene)).step(1);
        this.gui.add(this.scene, 'backWindows').name("Back Windows").onChange(this.scene.updateBackWindows.bind(this.scene));
        this.gui.add(this.scene, 'selectedBannerTexture', this.scene.bannerTexturesIds).name('Selected Banner Texture').onChange(this.scene.updateBannerTexture.bind(this.scene));
        this.gui.add(this.scene, 'selectedDoorTexture', this.scene.doorTexturesIds).name('Selected Door Texture').onChange(this.scene.updateDoorTexture.bind(this.scene));
        this.gui.add(this.scene, 'selectedWindowTexture', this.scene.windowTexturesIds).name('Selected Window Texture').onChange(this.scene.updateWindowTexture.bind(this.scene));
        this.gui.addColor(this.scene,'buildingColor').name("Building Color").onChange(this.scene.updateBuildingColor.bind(this.scene));
        this.gui.addColor(this.scene,'helicopterColor').name("Helicopter Color").onChange(this.scene.updateHelicopterColor.bind(this.scene));
        this.gui.addColor(this.scene,'helicopterMarkerColor').name("Marker Color").onChange(this.scene.updateHelicopterMarkerColor.bind(this.scene));
        this.gui.add(this.scene, 'treeRows', 1, 10, 1).name("Tree Rows").onChange(this.scene.resetForest.bind(this.scene)).step(1);
        this.gui.add(this.scene, 'treeCols', 1, 10, 1).name("Tree Columns").onChange(this.scene.resetForest.bind(this.scene)).step(1);
        this.gui.addColor(this.scene, 'darkTree').name("Dark Tree").onChange(this.scene.resetForest.bind(this.scene));
        this.gui.addColor(this.scene, 'lightTree').name("Light Tree").onChange(this.scene.resetForest.bind(this.scene));
        this.gui.add(this.scene, 'resetForest').name("Reset Forest");
        this.gui.add(this.scene, 'numFires', 1, 20, 1).name("Number of Fires").onChange(this.scene.resetFire.bind(this.scene)).step(1);
        this.gui.add(this.scene, 'resetFire').name("Reset Fire");
        this.gui.add(this.scene, 'view', this.scene.viewIds).name("Perspective").onChange(this.scene.updateView.bind(this.scene));
        this.gui.add(this.scene, 'panoramaTextureChoice', this.scene.panoramaTextureIds).name("Panorama Texture").onChange(this.scene.updatePanoramaTexture.bind(this.scene));

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