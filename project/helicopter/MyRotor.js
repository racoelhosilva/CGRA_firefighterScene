import { CGFobject } from "../../lib/CGF.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRectangle } from "../component/MyRectangle.js";

export class MyRotor extends CGFobject {

    constructor(scene, radius, blades) {
        super(scene);
        this.scene = scene;

        this.radius = radius;
        this.blades = blades;

        this.mast = new MyCylinder(this.scene, 0.8, 2, 8, 2);
        this.blade = new MyRectangle(this.scene, 1, radius);
    }

    display() {
        this.mast.display();
    }
}