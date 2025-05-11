import { CGFobject } from "../../lib/CGF.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

export class MySkid extends CGFobject {
    LENGTH = 20;

    constructor(scene, right) {
        super(scene);
     
        this.right = right;

        this.smallCylinder = new MyCylinder(this.scene, 0.2, 3, 8, 2);
        this.bigCylinder = new MyCylinder(this.scene, 0.4, this.LENGTH, 8, 6);
        this.bigCylinderBase = new MyRegularPolygon(this.scene, 8, 0.4);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(this.right ? -Math.PI / 6 : Math.PI / 6, 1, 0, 0);
        this.scene.translate(this.LENGTH / 4, 0, 0);
        this.smallCylinder.display();
        this.scene.translate(this.LENGTH / 2, 0, 0);
        this.smallCylinder.display();
        this.scene.popMatrix();

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