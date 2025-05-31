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

        // Panorama
        const panoramaFolder = this.gui.addFolder("Panorama Settings");
        panoramaFolder.add(this.scene, 'selectedPanoramaTexture', this.scene.panoramaTextureIds).name("Panorama Texture").onChange(this.scene.updatePanoramaTexture.bind(this.scene));

        // Plane
        const planeFolder = this.gui.addFolder("Plane Settings");
        planeFolder.add(this.scene, 'selectedGrassTexture', this.scene.grassTexturesIds).name('Selected Grass Texture').onChange(this.scene.updateGrassTexture.bind(this.scene));
        planeFolder.add(this.scene, 'selectedWaterTexture', this.scene.waterTexturesIds).name('Selected Water Texture').onChange(this.scene.updateWaterTexture.bind(this.scene));

        // Building
        const buildingFolder = this.gui.addFolder("Building Settings");
        buildingFolder.add(this.scene, 'buildingSize', 75, 150, 1).name("Building Size").onChange(this.scene.updateBuildingSize.bind(this.scene)).step(1);
        buildingFolder.add(this.scene, 'floorNumber', 2, 5, 1).name("Num of Floors").onChange(this.scene.updateFloorNumber.bind(this.scene)).step(1);
        buildingFolder.add(this.scene, 'windowNumber', 1, 4, 1).name("Num of Windows").onChange(this.scene.updateWindowNumber.bind(this.scene)).step(1);
        buildingFolder.add(this.scene, 'backWindows').name("Back Windows").onChange(this.scene.updateBackWindows.bind(this.scene));
        buildingFolder.addColor(this.scene,'buildingColor').name("Building Color").onChange(this.scene.updateBuildingColor.bind(this.scene));
        buildingFolder.add(this.scene, 'selectedBuildingTexture', this.scene.buildingTexturesIds).name('Selected Building Texture').onChange(this.scene.updateBuildingTexture.bind(this.scene));
        buildingFolder.add(this.scene, 'selectedBannerTexture', this.scene.bannerTexturesIds).name('Selected Banner Texture').onChange(this.scene.updateBannerTexture.bind(this.scene));
        buildingFolder.add(this.scene, 'selectedDoorTexture', this.scene.doorTexturesIds).name('Selected Door Texture').onChange(this.scene.updateDoorTexture.bind(this.scene));
        buildingFolder.add(this.scene, 'selectedWindowTexture', this.scene.windowTexturesIds).name('Selected Window Texture').onChange(this.scene.updateWindowTexture.bind(this.scene));

        // Helicopter
        const helicopterFolder = this.gui.addFolder("Helicopter Settings");
        helicopterFolder.add(this.scene, 'speedFactor', 0.1, 3, 0.1).name("Speed Factor").onChange(this.scene.updateSpeedFactor.bind(this.scene)).step(0.1);
        helicopterFolder.addColor(this.scene,'helicopterColor').name("Helicopter Color").onChange(this.scene.updateHelicopterColor.bind(this.scene));
        helicopterFolder.addColor(this.scene,'helicopterMarkerColor').name("Marker Color").onChange(this.scene.updateHelicopterMarkerColor.bind(this.scene));
        helicopterFolder.add(this.scene, 'view', this.scene.viewIds).name("Perspective").onChange(this.scene.updateView.bind(this.scene));

        // Forest
        const forestFolder = this.gui.addFolder("Forest Settings");
        forestFolder.add(this.scene, 'treeRows', 1, 10, 1).name("Tree Rows").onChange(this.scene.resetForest.bind(this.scene)).step(1);
        forestFolder.add(this.scene, 'treeCols', 1, 10, 1).name("Tree Columns").onChange(this.scene.resetForest.bind(this.scene)).step(1);
        forestFolder.addColor(this.scene, 'darkTree').name("Dark Tree").onChange(this.scene.resetForest.bind(this.scene));
        forestFolder.addColor(this.scene, 'lightTree').name("Light Tree").onChange(this.scene.resetForest.bind(this.scene));
        forestFolder.add(this.scene, 'resetForest').name("Reset Forest");

        // Fire
        const fireFolder = this.gui.addFolder("Fire Settings");
        fireFolder.add(this.scene, 'numFires', 0, 20, 2).name("Number of Fires").onChange(this.scene.resetFire.bind(this.scene));
        fireFolder.add(this.scene, 'resetFire').name("Reset Fire");

        // Preset
        this.gui.add(this.scene, 'selectedPreset', this.scene.presetIds).name('Preset').onChange(this.scene.applyPreset.bind(this.scene));
        this.gui.add(this.scene, 'maxElevation', 0.0, 100.0, 0.5).name('Max Elevation').onChange(this.scene.updateElevationMax.bind(this.scene));

        this.gui.add(this.scene, 'speedFactor', 0.1, 3, 0.1).name("Speed Factor").onChange(this.scene.updateSpeedFactor.bind(this.scene));

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