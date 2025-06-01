import { CGFobject, CGFappearance, CGFscene, CGFtexture } from '../../lib/CGF.js';
import { MyCeiling } from './MyCeiling.js';
import { MyFloor } from './MyFloor.js';

/**
 * @brief Class representing the firefighters' building in the scene.
 */
export class MyBuilding extends CGFobject {
    /**
     * @brief Creates a building object.
     *
     * @param {CGFscene} scene - The scene to which the building belongs.
     * @param {number} totalWidth - The total width of the building.
     * @param {Array<number>} buildingColor - The color of the building.
     * @param {number} numFloors - The number of floors in the building.
     * @param {number} numWindows - The number of windows on each floor.
     * @param {CGFtexture} windowTexture - The texture for the windows.
     * @param {boolean} backWindows - Whether the building has windows on the back.
     * @param {CGFtexture} facadeTexture - The texture for the building's facade.
     * @param {CGFtexture} doorTexture - The texture for the doors.
     * @param {CGFtexture} bannerTexture - The texture for the banners.
     * @param {CGFtexture} helipadTexture - The texture for the helipad.
     * @param {CGFtexture} upTexture - The texture for the helipad, for the lifting maneuver.
     * @param {CGFtexture} downTexture - The texture for the helipad, for the landing maneuver.
     */
    constructor(scene, totalWidth, buildingColor, numFloors,
        numWindows, windowTexture, backWindows, facadeTexture,
        doorTexture, bannerTexture, helipadTexture, upTexture, downTexture) {

        super(scene);
        this.totalWidth = totalWidth;
        this.floorWidth = 2 * totalWidth / 5;
        this.floorHeight = totalWidth / 5;
        this.floorDepth = totalWidth / 3;
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
            this.buildingMaterial,
            windowTexture,
            backWindows,
            doorTexture,
            bannerTexture
        );

        this.ceiling = new MyCeiling(
            this.scene,
            this.floorWidth,
            this.floorDepth,
            this.buildingMaterial,
            helipadTexture,
            upTexture,
            downTexture
        );
    }

    display() {
        // Floors of Central Building
        this.scene.pushMatrix();
        this.floor.display(false);
        this.scene.translate(0, this.floorHeight, 0);
        for (let i = 0; i < this.numFloors; i++) {
            this.floor.display(true);
            this.scene.translate(0, this.floorHeight, 0);
        }

        // Ceiling of Central Building
        this.ceiling.display(true);
        this.scene.popMatrix();

        // Floors of Left Building
        this.scene.pushMatrix();
        this.scene.scale(0.75, 0.75, 0.75);
        this.scene.translate(-this.floorWidth, 0, 0);
        for (let i = 0; i < this.numFloors; i++) {
            this.floor.display(true);
            this.scene.translate(0, this.floorHeight, 0);
        }

        // Ceiling of Left Building
        this.ceiling.display(false);
        this.scene.popMatrix();

        // Floors of Right Building
        this.scene.pushMatrix();
        this.scene.translate(this.floorWidth, 0, 0);
        this.scene.scale(0.75, 0.75, 0.75);
        for (let i = 0; i < this.numFloors; i++) {
            this.floor.display(true);
            this.scene.translate(0, this.floorHeight, 0);
        }

        // Ceiling of Right Building
        this.ceiling.display(false);
        this.scene.popMatrix();
    }

    /**
     * @brief Gets the total height of the building.
     *
     * @return {number} - The total height of the building.
     */
    getTotalHeight() {
        return this.floorHeight * (this.numFloors + 1);
    }

    /**
     * @brief Returns the width of the central floor.
     */
    getCentralFloorWidth() {
        return this.floorWidth;
    }

    /**
     * @brief Returns the depth of the central floor.
     */
    getCentralFloorDepth() {
        return this.floorDepth;
    }

    /**
     * @brief Updates the size of the building based on the total width.
     *
     * @param {number} totalWidth - The new total width of the building.
     */
    updateSize(totalWidth) {
        this.totalWidth = totalWidth;
        this.floorWidth = 2 * totalWidth / 5;
        this.floorHeight = totalWidth / 5;
        this.floorDepth = totalWidth / 3;

        this.floor.updateSize(this.floorWidth, this.floorDepth, this.floorHeight);
        this.ceiling.updateSize(this.floorWidth, this.floorDepth);
    }

    /**
     * @brief Updates the number of floors in the building.
     *
     * @param {number} floors - The new number of floors.
     */
    updateFloorNumber(floors) {
        this.numFloors = floors;
    }

    /**
     * @brief Updates the number of windows on each floor.
     *
     * @param {number} windows - The new number of windows on each floor.
     */
    updateWindowNumber(windows) {
        this.numWindows = windows;
        this.floor.updateWindowNumber(this.numWindows);
    }

    /**
     * @brief Updates the color of the building.
     *
     * @param {Array<number>} color - The new color of the building, represented as an array of RGB values.
     */
    updateBuildingColor(color) {
        this.buildingMaterial.setAmbient(...color.map(c => c * 0.5), 1.0);
        this.buildingMaterial.setDiffuse(...color.map(c => c * 0.8), 1.0);
        this.floor.updateBuildingMaterial(this.buildingMaterial);
        this.ceiling.updateBuildingMaterial(this.buildingMaterial);
    }

    /**
     * @brief Updates the texture of the building's facade.
     *
     * @param {CGFtexture} facadeTexture - The new texture for the building's facade.
     */
    updateBuildingTexture(facadeTexture) {
        this.buildingMaterial.setTexture(facadeTexture);
        this.floor.updateBuildingMaterial(this.buildingMaterial);
        this.ceiling.updateBuildingMaterial(this.buildingMaterial);
    }

    /**
     * @brief Updates the texture of the door.
     *
     * @param {CGFtexture} doorTexture - The new texture for the door.
     */
    updateDoorTexture(doorTexture) {
        this.floor.updateDoorTexture(doorTexture);
    }

    /**
     * @brief Updates the texture of the front banner.
     *
     * @param {CGFtexture} bannerTexture - The new texture for the banner.
     */
    updateBannerTexture(bannerTexture) {
        this.floor.updateBannerTexture(bannerTexture);
    }

    /**
     * @brief Updates the texture of the windows.
     *
     * @param {CGFtexture} windowTexture - The new texture for the windows.
     */
    updateWindowTexture(windowTexture) {
        this.floor.updateWindowTexture(windowTexture);
    }

    /**
     * @brief Updates the back windows of the building.
     *
     * @param {boolean} backWindows - Whether the building has windows on the back or not.
     */
    updateBackWindows(backWindows) {
        this.floor.updateBackWindows(backWindows);
    }
}