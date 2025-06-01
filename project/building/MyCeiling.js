import { CGFappearance, CGFobject, CGFtexture } from "../../lib/CGF.js";
import { MyCube } from "../component/MyCube.js";
import { MyRectangle } from "../component/MyRectangle.js";

/**
 * @brief Class representing the ceiling of a building.
 *
 * The ceiling is a rectangular surface that can display a helipad and lights.
 */
export class MyCeiling extends CGFobject {
    /**
     * @brief Creates a new ceiling object.
     *
     * @param {CGFscene} scene - The scene to which the ceiling belongs.
     * @param {number} width - The width of the ceiling.
     * @param {number} depth - The depth of the ceiling.
     * @param {CGFappearance} buildingMaterial - The material to apply to the ceiling.
     * @param {CGFtexture} helipadTexture - The texture for the helipad.
     * @param {CGFtexture} upTexture - The texture for the helipad during up maneuvers.
     * @param {CGFtexture} downTexture - The texture for the helipad during down maneuvers.
     */
    constructor(scene, width, depth, buildingMaterial, helipadTexture, upTexture, downTexture) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.buildingMaterial = buildingMaterial;
        this.helipadTexture = helipadTexture;
        this.upTexture = upTexture;
        this.downTexture = downTexture;

        // Ceiling Floor
        this.ceiling = new MyRectangle(this.scene, width, depth);

        // Helipad
        this.helipadSize = 2 * Math.min(width, depth) / 3;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad = new MyRectangle(this.scene, this.helipadSize, this.helipadSize);

        // Helipad Material
        this.helipadMaterial = new CGFappearance(scene);
        this.helipadMaterial.setAmbient(0.5, 0.5, 0.5, 1);
        this.helipadMaterial.setShininess(10.0);
        this.helipadMaterial.setTexture(this.helipadTexture);
        this.helipadMaterial.setTextureWrap("REPEAT", "REPEAT");

        // Helipad Lights
        this.lightSize = 1;
        this.light = new MyCube(this.scene, this.lightSize);
    }

    /**
     * @brief Displays the ceiling and optionally the helipad and lights.
     *
     * @param {boolean} helipad - Whether to display the helipad.
     */
    display(helipad) {
        this.buildingMaterial.apply();

        // Ceiling Floor
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth)
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.ceiling.display();
        this.scene.popMatrix();

        if (!helipad)
            return;

        // Display helipad
        // Only if in central building
        this.helipadMaterial.apply();
        this.upTexture.bind(1);
        this.downTexture.bind(2);
        this.scene.setActiveShader(this.scene.movementShader);

        this.scene.pushMatrix();
        this.scene.translate(this.helipadXSpacing, this.scene.Z_CLASHING_OFFSET, this.helipadSize + this.helipadZSpacing);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        // Enable transparency for helipad
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.helipad.display();
        this.scene.gl.disable(this.scene.gl.BLEND);

        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);

        // Display helipad lights
        this.scene.setActiveShader(this.scene.pulsatingShader);
        this.scene.pushMatrix();

        // Center lights on the corners of the helipad
        this.scene.translate(- 0.5 * this.lightSize, 0, 0.5 * this.lightSize);
        for (let i = 0; i < 4; i++) {
            this.scene.pushMatrix();
            this.scene.translate(
                this.helipadXSpacing + (i % 2) * this.helipadSize,
                this.scene.Z_CLASHING_OFFSET,
                this.helipadZSpacing + Math.floor(i / 2) * this.helipadSize
            );
            this.light.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    /**
     * @brief Updates the size of the ceiling and helipad.
     *
     * @param {number} width - The new width of the ceiling.
     * @param {number} depth - The new depth of the ceiling.
     */
    updateSize(width, depth) {
        // Update dimensions of ceiling floor
        this.width = width;
        this.depth = depth;
        this.ceiling.updateSize(width, depth);

        // Update dimensions of helipad
        this.helipadSize = 2 * Math.min(width, depth) / 3;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad.updateSize(this.helipadSize, this.helipadSize);
    }

    /**
     * @brief Updates the building material of the ceiling.
     *
     * @param {CGFappearance} buildingMaterial - The new material to apply to the ceiling.
     */
    updateBuildingMaterial(buildingMaterial) {
        this.buildingMaterial = buildingMaterial;
    }
}