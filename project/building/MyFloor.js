import { CGFappearance, CGFobject, CGFscene, CGFtexture } from "../../lib/CGF.js";
import { MyRectangle } from "../component/MyRectangle.js";

/**
 * @brief Class representing a floor in a building.
 */
export class MyFloor extends CGFobject {
    /**
     * @brief Creates a floor object.
     *
     * @param {CGFscene} scene - The scene to which the floor belongs.
     * @param {number} width - The width of the floor.
     * @param {number} depth - The depth of the floor.
     * @param {number} height - The height of the floor.
     * @param {number} numWindows - The number of windows on the floor.
     * @param {CGFappearance} buildingMaterial - The material for the building.
     * @param {CGFtexture} windowTexture - The texture for the windows.
     * @param {boolean} backWindows - Whether the floor has windows on the back face.
     * @param {CGFtexture} doorTexture - The texture for the door.
     * @param {CGFtexture} bannerTexture - The texture for the front banner.
     */
    constructor(scene, width, depth, height, numWindows, buildingMaterial, windowTexture, backWindows, doorTexture, bannerTexture) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.numWindows = numWindows;
        this.backWindows = backWindows;
        this.buildingMaterial = buildingMaterial;

        // Floor
        this.xFloor = new MyRectangle(this.scene, depth, height);
        this.zFloor = new MyRectangle(this.scene, width, height);

        // Door
        this.doorHeight = 3 * height / 5;
        this.doorWidth = width / 5;
        this.door = new MyRectangle(this.scene, this.doorWidth, this.doorHeight);

        // Door Material
        this.doorMaterial = new CGFappearance(scene);
        this.doorMaterial.setAmbient(0.8, 0.8, 0.8, 1);
        this.doorMaterial.setDiffuse(0.4, 0.4, 0.4, 1);
        this.doorMaterial.setSpecular(0.2, 0.2, 0.2, 1);
        this.doorMaterial.setShininess(10.0);
        this.doorMaterial.setTexture(doorTexture);
        this.doorMaterial.setTextureWrap("REPEAT", "REPEAT");

        // Banner
        this.bannerWidth = width / 2;
        this.bannerHeight = height / 5;
        this.bannerHorizontalSpacing = (width - this.bannerWidth) / 2;
        this.bannerVerticalSpacing = (this.height - this.doorHeight - this.bannerHeight) / 2 + this.doorHeight;
        this.banner = new MyRectangle(this.scene, this.bannerWidth, this.bannerHeight);

        // Banner Material
        this.bannerMaterial = new CGFappearance(scene);
        this.bannerMaterial.setAmbient(0.7, 0.7, 0.7, 1);
        this.bannerMaterial.setEmission(0.2, 0.2, 0.2, 1);
        this.bannerMaterial.setShininess(10.0);
        this.bannerMaterial.setTexture(bannerTexture);
        this.bannerMaterial.setTextureWrap("REPEAT", "REPEAT");

        // Window
        this.windowSize = width / 5;
        this.windowHorizontalSpacing = (width - (numWindows * this.windowSize)) / (numWindows + 1);
        this.windowVerticalSpacing = (height - this.windowSize) / 2;
        this.window = new MyRectangle(this.scene, this.windowSize, this.windowSize);

        // Window Material
        this.windowMaterial = new CGFappearance(scene);
        this.windowMaterial.setAmbient(0.8, 0.8, 0.8, 1);
        this.windowMaterial.setDiffuse(0.8, 0.8, 0.8, 1);
        this.windowMaterial.setSpecular(0.2, 0.2, 0.2, 1);
        this.windowMaterial.setShininess(200.0);
        this.windowMaterial.setTexture(windowTexture);
        this.windowMaterial.setTextureWrap("REPEAT", "REPEAT");
    }

    /**
     * @brief Displays the floor object.
     *
     * @param {boolean} displayWindows - Whether to display windows on the front face.
     */
    display(displayWindows) {
        this.buildingMaterial.apply();

        // Positive Z Face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth);
        this.zFloor.display();
        this.scene.popMatrix();

        // Positive X Face
        this.scene.pushMatrix();
        this.scene.translate(this.width, 0, this.depth);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.xFloor.display();
        this.scene.popMatrix();

        // Negative Z Face
        this.scene.pushMatrix();
        this.scene.translate(this.width, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.zFloor.display();
        this.scene.popMatrix();

        // Negative X Face
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.xFloor.display();
        this.scene.popMatrix();

        if (displayWindows) {
            // Display windows on the front face
            // Only if not first floor of central building
            this.windowMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.windowHorizontalSpacing, this.windowVerticalSpacing, this.depth + this.scene.Z_CLASHING_OFFSET);
            for (let i = 0; i < this.numWindows; i++) {
                this.window.display();
                this.scene.translate(this.windowSize + this.windowHorizontalSpacing, 0, 0);
            }
            this.scene.popMatrix();
        } else {
            // Display door on the front face
            this.doorMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.width / 2 - this.doorWidth / 2, 0, this.depth + this.scene.Z_CLASHING_OFFSET);
            this.door.display();
            this.scene.popMatrix();

            // Display banner on the front face
            this.bannerMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.bannerHorizontalSpacing, this.bannerVerticalSpacing, this.depth + this.scene.Z_CLASHING_OFFSET);
            this.banner.display();
            this.scene.popMatrix();
        }

        if (!this.backWindows)
            return;

        // Display windows on the back face if enabled
        this.windowMaterial.apply();
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-this.windowHorizontalSpacing - this.windowSize, this.windowVerticalSpacing, this.scene.Z_CLASHING_OFFSET);
        for (let i = 0; i < this.numWindows; i++) {
            this.window.display();
            this.scene.translate(-this.windowSize - this.windowHorizontalSpacing, 0, 0);
        }
        this.scene.popMatrix();
    }

    /**
     * @brief Updates the size of the floor.
     *
     * @param {number} width - The new width of the floor.
     * @param {number} depth - The new depth of the floor.
     * @param {number} height - The new height of the floor.
     */
    updateSize(width, depth, height) {
        // Update dimensions of walls
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.xFloor.updateSize(depth, height);
        this.zFloor.updateSize(width, height);

        // Update dimensions of door
        this.doorHeight = 3 * height / 5;
        this.doorWidth = width / 5;
        this.door.updateSize(this.doorWidth, this.doorHeight);

        // Update dimensions of banner
        this.bannerWidth = width / 2;
        this.bannerHeight = height / 5;
        this.bannerHorizontalSpacing = (width - this.bannerWidth) / 2;
        this.bannerVerticalSpacing = (this.height - this.doorHeight - this.bannerHeight) / 2 + this.doorHeight;
        this.banner.updateSize(this.bannerWidth, this.bannerHeight);

        // Update dimensions of windows
        this.windowSize = width / 5;
        this.windowHorizontalSpacing = (width - (this.numWindows * this.windowSize)) / (this.numWindows + 1);
        this.windowVerticalSpacing = (height - this.windowSize) / 2;
        this.window.updateSize(this.windowSize, this.windowSize);

    }

    /**
     * @brief Updates the number of windows on the floor.
     *
     * @param {number} windows - The new number of windows on the floor.
     */
    updateWindowNumber(windows) {
        this.numWindows = windows;
        this.windowHorizontalSpacing = (this.width - (windows * this.windowSize)) / (windows + 1);
    }

    /**
     * @brief Updates the texture of the door.
     *
     * @param {CGFtexture} texture - The new texture to apply to the door.
     */
    updateDoorTexture(texture) {
        this.doorMaterial.setTexture(texture);
    }

    /**
     * @brief Updates the texture of the banner.
     *
     * @param {CGFtexture} texture - The new texture to apply to the banner.
     */
    updateBannerTexture(texture) {
        this.bannerMaterial.setTexture(texture);
    }

    /**
     * @brief Updates the texture of the windows.
     *
     * @param {CGFtexture} texture - The new texture to apply to the windows.
     */
    updateWindowTexture(texture) {
        this.windowMaterial.setTexture(texture);
    }

    /**
     * @brief Updates the back windows of the floor.
     *
     * @param {boolean} backWindows - Whether the floor has windows on the back face or not.
     */
    updateBackWindows(backWindows) {
        this.backWindows = backWindows;
    }

    /**
     * @brief Updates the building material of the floor.
     *
     * @param {CGFappearance} buildingMaterial - The new material to apply to the floor.
     */
    updateBuildingMaterial(buildingMaterial) {
        this.buildingMaterial = buildingMaterial;
    }
}