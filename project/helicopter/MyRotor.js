import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRectangle } from "../component/MyRectangle.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

/**
 * @brief Class representing a helicopter rotor.
 */
export class MyRotor extends CGFobject {
    MAST_RADIUS_RATIO = 0.05;

    /**
     * @brief Creates a new rotor object.
     *
     * @param {CGFscene} scene - The scene to which the rotor belongs.
     * @param {number} radius - The radius of the rotor blades.
     * @param {number} blades - The number of blades in the rotor.
     * @param {number} bladeWidth - The width of each rotor blade.
     * @param {number} mastHeight - The height of the rotor mast.
     * @param {number} mastRadius - The radius of the rotor mast.
     *
     * @param {CGFappearance} bladeMaterial - The material to apply to the rotor blades.
     */
    constructor(scene, radius, blades, bladeWidth, mastHeight, mastRadius, bladeMaterial) {
        super(scene);

        this.radius = radius;
        this.blades = blades;
        this.bladeWidth = bladeWidth;
        this.mastHeight = mastHeight;
        this.mastRadius = mastRadius;

        this.mast = new MyCylinder(this.scene, this.mastRadius, this.mastHeight, 8, 2);
        this.mastTop = new MyRegularPolygon(this.scene, 8, this.mastRadius);
        this.blade = new MyRectangle(this.scene, bladeWidth, radius, true);

        this.bladeMaterial = bladeMaterial;

        this.mastMaterial = new CGFappearance(this.scene);
        this.mastMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.mastMaterial.setDiffuse(0.1, 0.1, 0.1, 1.0);
        this.mastMaterial.setSpecular(0.2, 0.2, 0.2, 1.0);
        this.mastMaterial.setShininess(10);
    }

    display() {
        // Mast
        this.scene.pushMatrix();
        this.mastMaterial.apply();
        this.mast.display();

        this.scene.translate(0, this.mastHeight, 0);
        this.mastTop.display();

        this.scene.translate(0, - 0.2 * this.mastHeight, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        // Blades
        this.bladeMaterial.apply();
        for (let i = 0; i < this.blades; i++) {
            this.scene.pushMatrix();
            this.scene.rotate((i * 2 * Math.PI) / this.blades, 0, 0, 1);
            this.scene.translate(-this.bladeWidth / 2, 0, 0);
            this.blade.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}