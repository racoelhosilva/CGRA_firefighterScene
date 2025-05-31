import { CGFobject } from "../../lib/CGF.js";
import { MyParallelogram } from "../component/MyParallelogram.js";

export class MyRudder extends CGFobject {
  constructor(scene) {
    super(scene);

    this.topParallelogram = new MyParallelogram(this.scene, 2, 4, Math.PI / 6, true);
    this.bottomParallelogram = new MyParallelogram(this.scene, 2, 2, Math.PI / 5, true);
  }

  display() {
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0)

    this.topParallelogram.display();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.bottomParallelogram.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
  }
}