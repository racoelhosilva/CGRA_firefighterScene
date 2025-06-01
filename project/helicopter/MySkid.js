import { CGFappearance, CGFobject, CGFscene } from "../../lib/CGF.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

/**
 * @brief Class representing a helicopter skid.
 */
export class MySkid extends CGFobject {
    LENGTH = 20;

    /**
     * @brief Creates a new skid object.
     *
     * @param {CGFscene} scene - The scene to which the skid belongs.
     * @param {boolean} right - Indicates if the skid is on the right side of the helicopter.
     * @param {CGFappearance} skidMaterial - The material to apply to the skid.
     */
    constructor(scene, right, skidMaterial) {
        super(scene);

        this.right = right;

        this.skidMaterial = skidMaterial;

        this.smallCylinder = new MyCylinder(this.scene, 0.2, 3, 8, 2);
        this.bigCylinder = new MyCylinder(this.scene, 0.4, this.LENGTH, 8, 6);
        this.bigCylinderBase = new MyRegularPolygon(this.scene, 8, 0.4);
    }

    display() {
        this.skidMaterial.apply();

        // Small Cylinders
        this.scene.pushMatrix();
        this.scene.rotate(this.right ? -Math.PI / 6 : Math.PI / 6, 1, 0, 0);
        this.scene.translate(this.LENGTH / 4, 0, 0);
        this.smallCylinder.display();
        this.scene.translate(this.LENGTH / 2, 0, 0);
        this.smallCylinder.display();
        this.scene.popMatrix();

        // Big Cylinder
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.bigCylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.bigCylinderBase.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.LENGTH, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.bigCylinderBase.display();
        this.scene.popMatrix();
    }
}