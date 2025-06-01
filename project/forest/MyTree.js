import { CGFappearance, CGFobject } from "../../lib/CGF.js";
import { MyCone } from "../component/MyCone.js";
import { MyPyramid } from "../component/MyPyramid.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

/**
 * @brief Class representing a tree in the scene.
 */
export class MyTree extends CGFobject {
    CROWN_SIDES = 6;
    ROOT_HEIGHT = 8;

    /**
     * @brief Constructs a new MyTree object.
     *
     * @param {CGFscene} scene - The scene to which this object belongs.
     * @param {number} tilt - The tilt angle of the tree.
     * @param {string} tiltAxis - The axis of the tilt ('x' or 'z').
     * @param {number} trunkRadius - The radius of the tree trunk. Will also affect the crown radius.
     * @param {number} height - The height of the tree.
     * @param {Array<number>} crownColor - The color of the crown in RGB format.
     * @param {string} trunkTexture - The texture for the trunk.
     * @param {string} crownTexture - The texture for the crown.
     */
    constructor(scene, tilt, tiltAxis, trunkRadius, height, crownColor, trunkTexture, crownTexture) {
        super(scene);

        this.tilt = tilt;
        this.tiltAxis = tiltAxis == "x" ? [1, 0, 0] : [0, 0, 1];

        this.trunc = this.buildTrunc(trunkRadius, height);
        this.truncMaterial = this.buildTruncMaterial();
        this.truncMaterial.setTexture(trunkTexture);

        [this.crown, this.crownStart, this.crownStep] = this.buildCrown(trunkRadius, height);
        this.crownBase = new MyRegularPolygon(this.scene, 6, 1);
        this.crownMaterial = this.buildCrownMaterial(crownColor);
        this.crownMaterial.setTexture(crownTexture);
    }

    /**
     * @brief Generates the trunk of the tree.
     *
     * @param {number} trunkRadius - The radius of the trunk.
     * @param {number} height - The height of the trunk.
     *
     * @returns {MyCone} - The trunk object.
     */
    buildTrunc(trunkRadius, height) {
        const realRadius = (height + this.ROOT_HEIGHT) * trunkRadius / height;
        return new MyCone(this.scene, 8, realRadius, height + this.ROOT_HEIGHT);
    }

    /**
     * @brief Generates the material for the trunk of the tree.
     *
     * @returns {CGFappearance} - The material for the trunk.
     */
    buildTruncMaterial() {
        let material = new CGFappearance(this.scene);
        material.setAmbient(0.306, 0.208, 0.125, 1.0);
        material.setDiffuse(0.306, 0.208, 0.125, 1.0);
        material.setSpecular(0.306, 0.208, 0.125, 1.0);
        material.setShininess(10.0);

        return material;
    }

    /**
     * @brief Generates the crown of the tree.
     *
     * @param {number} trunkRadius - The radius of the trunk.
     * @param {number} height - The height of the tree.
     *
     * @returns {Array} - An array containing the crown parts, the starting height of the crown, and the height step for each crown part.
     */
    buildCrown(trunkRadius, height) {
        let numPyramids = Math.round(height * 0.8 / trunkRadius) - 1;
        let pyramidHeight = height * 1.6 / (numPyramids + 1);

        let crown = [];
        for (let pyramid = 0; pyramid < numPyramids; pyramid++) {
            const pyramidRadius = trunkRadius * (3 - 2 * pyramid / (numPyramids + 1));

            crown.push(new MyPyramid(this.scene, this.CROWN_SIDES, pyramidRadius, pyramidHeight));
        }

        return [crown, height * 0.2, pyramidHeight / 2];
    }

    /**
     * @brief Generates the base of the crown.
     *
     * @returns {MyRegularPolygon} - The base of the crown.
     */
    buildCrownBase() {
        return new MyRegularPolygon(this.scene, this.CROWN_SIDES);
    }

    /**
     * @brief Generates the material for the crown of the tree.
     *
     * @param {Array<number>} crownColor - The color of the crown in RGB format.
     * @returns {CGFappearance} - The material for the crown.
     */
    buildCrownMaterial(crownColor) {
        const [r, g, b] = crownColor;

        let material = new CGFappearance(this.scene);
        material.setAmbient(r * 0.75, g * 0.75, b * 0.75, 1.0);
        material.setDiffuse(r, g, b, 1.0);
        material.setSpecular(r * 0.25, g * 0.25, b * 0.25, 1.0);

        return material;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.rotate(this.tilt, ...this.tiltAxis);

        this.scene.pushMatrix();
        this.scene.translate(0, -this.ROOT_HEIGHT, 0);
        this.truncMaterial.apply();
        this.trunc.display();
        this.scene.popMatrix();

        this.scene.translate(0, this.crownStart, 0);
        this.crownMaterial.apply();
        this.crown.forEach(crownPart => {
            crownPart.display();
            this.displayCrownBase(crownPart.radius);
            this.scene.translate(0, this.crownStep, 0);
        });

        this.scene.popMatrix();
    }

    /**
     * @brief Displays the base of the crown.
     *
     * @param {number} radius - The radius of the crown base.
     */
    displayCrownBase(radius) {
        this.scene.pushMatrix();
        this.scene.scale(radius, 1, radius);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.crownBase.display();
        this.scene.popMatrix();
    }
}