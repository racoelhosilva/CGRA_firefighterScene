import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyCeiling } from './MyCeiling.js';
import { MyFloor } from './MyFloor.js';

export class MyBuilding extends CGFobject {

    constructor(scene, total_width, buildingColor, numFloors,
        numWindows, windowTexture, backWindows, facadeTexture,
        doorTexture, bannerTexture, helipadTexture, upTexture, downTexture) {

        super(scene);
        this.total_width = total_width;
        this.floorWidth = 2 * total_width / 5;
        this.floorHeight = total_width / 5;
        this.floorDepth = total_width / 3;
        this.numFloors = numFloors;
        this.numWindows = numWindows;

        this.buildingMaterial = new CGFappearance(scene);
        this.buildingMaterial.setAmbient(...buildingColor.map(c => c * 0.5), 1.0);
        this.buildingMaterial.setDiffuse(...buildingColor.map(c => c * 0.8), 1.0);
        this.buildingMaterial.setSpecular(0, 0, 0, 1.0);
        this.buildingMaterial.setShininess(1.0);
        this.buildingMaterial.setTexture(facadeTexture);

        this.floor = new MyFloor(
            this.scene,
            this.floorWidth,
            this.floorDepth,
            this.floorHeight,
            this.numWindows,
            windowTexture,
            backWindows,
            doorTexture,
            bannerTexture
        );

        this.ceiling = new MyCeiling(
            this.scene,
            this.floorWidth,
            this.floorDepth,
            helipadTexture,
            upTexture,
            downTexture
        );
    }

    display() {
        // Floors of Central Building
        this.scene.pushMatrix();
        this.floor.display(false, this.buildingMaterial);
        this.scene.translate(0, this.floorHeight, 0);
        for (let i = 0; i < this.numFloors; i++) {
            this.floor.display(true, this.buildingMaterial);
            this.scene.translate(0, this.floorHeight, 0);
        }

        // Ceiling of Central Building
        this.ceiling.display(true, this.buildingMaterial);
        this.scene.popMatrix();

        // Floors of Left Building
        this.scene.pushMatrix();
        this.scene.scale(0.75, 0.75, 0.75);
        this.scene.translate(-this.floorWidth, 0, 0);
        for (let i = 0; i < this.numFloors; i++) {
            this.floor.display(true, this.buildingMaterial);
            this.scene.translate(0, this.floorHeight, 0);
        }

        // Ceiling of Left Building
        this.ceiling.display(false, this.buildingMaterial);
        this.scene.popMatrix();

        // Floors of Right Building
        this.scene.pushMatrix();
        this.scene.translate(this.floorWidth, 0, 0);
        this.scene.scale(0.75, 0.75, 0.75);
        for (let i = 0; i < this.numFloors; i++) {
            this.floor.display(true, this.buildingMaterial);
            this.scene.translate(0, this.floorHeight, 0);
        }

        // Ceiling of Right Building
        this.ceiling.display(false, this.buildingMaterial);
        this.scene.popMatrix();
    }

    getTotalHeight() {
        return this.floorHeight * (this.numFloors + 1);
    }

    getCentralFloorWidth() {
        return this.floorWidth;
    }

    getCentralFloorDepth() {
        return this.floorDepth;
    }

    updateSize(total_width) {
        this.total_width = total_width;
        this.floorWidth = 2 * total_width / 5;
        this.floorHeight = total_width / 5;
        this.floorDepth = total_width / 3;

        this.floor.updateSize(this.floorWidth, this.floorDepth, this.floorHeight);
        this.ceiling.updateSize(this.floorWidth, this.floorDepth);
    }

    updateFloorNumber(floors) {
        this.numFloors = floors;
    }

    updateWindowNumber(windows) {
        this.numWindows = windows;
        this.floor.updateWindowNumber(this.numWindows);
    }

    updateBuildingColor(color) {
        this.buildingMaterial.setAmbient(...color.map(c => c * 0.5), 1.0);
        this.buildingMaterial.setDiffuse(...color.map(c => c * 0.8), 1.0);
    }

    updateBuildingTexture(facadeTexture) {
        this.buildingMaterial.setTexture(facadeTexture);
    }

    updateDoorTexture(doorTexture) {
        this.floor.updateDoorTexture(doorTexture);
    }

    updateBannerTexture(bannerTexture) {
        this.floor.updateBannerTexture(bannerTexture);
    }

    updateWindowTexture(windowTexture) {
        this.floor.updateWindowTexture(windowTexture);
    }

    updateBackWindows(backWindows) {
        this.floor.updateBackWindows(backWindows);
    }
}