import { CGFobject } from "../../lib/CGF.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRectangle } from "../component/MyRectangle.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

export class MyRotor extends CGFobject {
    MAST_RADIUS_RATIO = 0.05;

    constructor(scene, radius, blades, mastHeight, mastRadius) {
        super(scene);

        this.radius = radius;
        this.blades = blades;
        this.mastHeight = mastHeight;
        this.mastRadius = mastRadius;

        this.mast = new MyCylinder(this.scene, this.mastRadius, this.mastHeight, 8, 2);
        this.mastTop = new MyRegularPolygon(this.scene, 8, this.mastRadius);
        this.blade = new MyRectangle(this.scene, 0.5, radius, true);
    }

    display() {
        this.scene.pushMatrix();
        this.mast.display();

        this.mastTop.display();
        this.scene.translate(0, this.mastHeight, 0);
        this.mastTop.display();

        this.scene.translate(0, - 0.2 * this.mastHeight, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        for (let i = 0; i < this.blades; i++) {
            this.scene.pushMatrix();
            this.scene.rotate((i * 2 * Math.PI) / this.blades, 0, 0, 1);
            this.scene.translate(-0.25, 0, 0);
            this.blade.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}