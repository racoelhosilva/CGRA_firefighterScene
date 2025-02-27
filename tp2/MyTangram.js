import { CGFobject } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";

export class MyTangram extends CGFobject {
  constructor(scene) {
      super(scene);
      this.diamond = new MyDiamond(this.scene);
      this.triangle = new MyTriangle(this.scene);
      this.parallelogram = new MyParallelogram(this.scene);
      this.triangleSmall = new MyTriangleSmall(this.scene);
      this.triangleBig = new MyTriangleBig(this.scene);
  }

  display() {
    {
      let rotate = [
        Math.cos(-Math.PI / 4), Math.sin(-Math.PI / 4), 0, 0,
        -Math.sin(-Math.PI / 4), Math.cos(-Math.PI / 4), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]
      let translate = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        Math.sqrt(2), 0, 0, 1,
      ]

      this.scene.pushMatrix();
      this.scene.multMatrix(translate)
      this.scene.multMatrix(rotate);

      this.triangle.display();

      this.scene.popMatrix();
    }

    {
      let rotate = [
        Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0, 0,
        -Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]
      let translate = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        Math.sqrt(2) / 2, 3 / 2 * Math.sqrt(2), 0, 1
      ]
      this.scene.pushMatrix()
      this.scene.multMatrix(translate)
      this.scene.multMatrix(rotate)

      this.diamond.display();

      this.scene.popMatrix();
    }

    {
      let rotate = [
        Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0, 0,
        -Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]

      let reflect = [

        1, 0, 0, 0,
        0, Math.cos(Math.PI), Math.sin(Math.PI), 0,
        0, -Math.sin(Math.PI), Math.cos(Math.PI), 0,
        0, 0, 0, 1,
      ]



      this.scene.pushMatrix()

      this.scene.multMatrix(reflect)
      this.scene.multMatrix(rotate)
      this.parallelogram.display();

      this.scene.popMatrix()
    }

    {
      let rotate1 = [
        Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), 0, 0,
        -Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]
      let translate1 = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0, 1
      ]

      let rotate2 = [
        Math.cos(3 * Math.PI / 4), Math.sin(3 * Math.PI / 4), 0, 0,
        -Math.sin(3 * Math.PI / 4), Math.cos(3 * Math.PI / 4), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]
      let translate2 = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        3 * Math.sqrt(2) / 2, 3 * Math.sqrt(2) / 2, 0, 1
      ]

      this.scene.pushMatrix()


      this.scene.multMatrix(translate1)
      this.scene.multMatrix(rotate1)
      this.triangleSmall.display();

      this.scene.popMatrix()
      this.scene.pushMatrix()

      this.scene.multMatrix(translate2)
      this.scene.multMatrix(rotate2)
      this.triangleSmall.display();

      this.scene.popMatrix()
    }

    {
      let rotate1 = [
        Math.cos(-Math.PI / 2), Math.sin(-Math.PI / 2), 0, 0,
        -Math.sin(-Math.PI / 2), Math.cos(-Math.PI / 2), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]
      let rotate2 = [
        Math.cos(Math.PI / 2), Math.sin(Math.PI / 2), 0, 0,
        -Math.sin(Math.PI / 2), Math.cos(Math.PI / 2), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]
      let translate = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        Math.sqrt(2) - 2, -2 * Math.sqrt(2), 0, 1,
      ]

      this.scene.pushMatrix();
      this.scene.multMatrix(translate)

      this.scene.pushMatrix();
      this.scene.multMatrix(rotate1);

      this.triangleBig.display();

      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.multMatrix(rotate2);

      this.triangleBig.display();

      this.scene.popMatrix();
      this.scene.popMatrix();
    }
  }
}