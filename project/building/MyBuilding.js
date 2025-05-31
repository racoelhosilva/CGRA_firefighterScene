import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyCeiling } from './MyCeiling.js';
import { MyFloor } from './MyFloor.js';

export class MyBuilding extends CGFobject {
    constructor(scene, total_width, buildingColor, floors, windows, windowTexture, backWindows, facadeTexture, doorTexture, bannerTexture, helipadTexture, upTexture, downTexture) {
        super(scene);
        this.total_width = total_width;
        this.width = 2 * total_width / 5;
        this.height = total_width / 5;
        this.depth = total_width / 3;
        this.floors = floors;
        this.windows = windows;
        this.backWindows = backWindows;
        this.buildingColor = buildingColor;

        this.buildingMaterial = new CGFappearance(scene);
        this.buildingMaterial.setAmbient(...this.buildingColor.map(c => c * 0.5), 1.0);
        this.buildingMaterial.setDiffuse(...this.buildingColor.map(c => c * 0.8), 1.0);
        this.buildingMaterial.setSpecular(0, 0, 0, 1.0);
        this.buildingMaterial.setShininess(1.0);
        this.buildingMaterial.setTexture(facadeTexture);

        this.floor = new MyFloor(this.scene, this.width, this.depth, this.height, this.windows, windowTexture, backWindows, doorTexture, bannerTexture);
        this.ceiling = new MyCeiling(this.scene, this.width, this.depth, helipadTexture, upTexture, downTexture);
    }

    display() {
        this.scene.pushMatrix();
        this.buildingMaterial.apply();
        this.floor.display(false);
        this.scene.translate(0, this.height, 0);
        for (let i = 0; i < this.floors; i++) {
            this.buildingMaterial.apply();
            this.floor.display(true);
            this.scene.translate(0, this.height, 0);
        }
        this.buildingMaterial.apply();
        this.ceiling.display(true);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.75, 0.75, 0.75);
        this.scene.translate(-this.width, 0, 0);
        for (let i = 0; i < this.floors; i++) {
            this.buildingMaterial.apply();
            this.floor.display(true);
            this.scene.translate(0, this.height, 0);
        }
        this.buildingMaterial.apply();
        this.ceiling.display(false);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.width, 0, 0);
        this.scene.scale(0.75, 0.75, 0.75);
        for (let i = 0; i < this.floors; i++) {
            this.buildingMaterial.apply();
            this.floor.display(true);
            this.scene.translate(0, this.height, 0);
        }
        this.buildingMaterial.apply();
        this.ceiling.display(false);
        this.scene.popMatrix();
    }

    getTotalHeight() {
        return this.height * (this.floors + 1);
    }

    getCentralFloorWidth() {
        return this.width;
    }

    getCentralFloorDepth() {
        return this.depth;
    }

    updateFloorNumber(floors) {
        this.floors = floors;
    }

    updateSize(total_width) {
        this.total_width = total_width;
        this.width = 2 * total_width / 5;
        this.height = total_width / 5;
        this.depth = total_width / 3;

        this.floor.updateSize(this.width, this.depth, this.height);
        this.ceiling.updateSize(this.width, this.depth);
    }

    updateWindowNumber(windows) {
        this.windows = windows;
        this.floor.updateWindowNumber(this.windows);
    }

    updateWindowTexture(windowTexture) {
        this.floor.updateWindowTexture(windowTexture);
    }

    updateBannerTexture(bannerTexture) {
        this.floor.updateBannerTexture(bannerTexture);
    }

    updateDoorTexture(doorTexture) {
        this.floor.updateDoorTexture(doorTexture);
    }

    updateBuildingColor(color) {
        this.buildingColor = color;
        this.buildingMaterial.setAmbient(...this.buildingColor.map(c => c * 0.5), 1.0);
        this.buildingMaterial.setDiffuse(...this.buildingColor.map(c => c * 0.8), 1.0);
    }

    updateBackWindows(backWindows) {
        this.backWindows = backWindows;
        this.floor.updateBackWindows(this.backWindows);
    }

    updateBuildingTexture(facadeTexture) {
        this.buildingMaterial.setTexture(facadeTexture);
    }
}