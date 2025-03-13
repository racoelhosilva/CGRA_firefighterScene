import { CGFobject, CGFappearance } from "../lib/CGF.js";
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
      let material = new CGFappearance(this.scene);
      material.setAmbient(0.0, 0.5, 0.0, 1.0);
      material.setDiffuse(0.0, 0.5, 0.0, 1.0);
      material.setSpecular(0.0, 1.0, 0.0, 1.0);
      material.setShininess(10.0);

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

      if (!this.scene.customizeDiamond) {
        material.apply();
      }

      this.diamond.display();

      this.scene.popMatrix();
    }

    {
      let material = new CGFappearance(this.scene);
      material.setAmbient(0.5, 0.3, 0.4, 1.0);
      material.setDiffuse(0.5, 0.3, 0.4, 1.0);
      material.setSpecular(1.0, 0.6, 0.8, 1);
      material.setShininess(10.0);

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

      material.apply();

      this.triangle.display();

      this.scene.popMatrix();
    }

    {
      let material = new CGFappearance(this.scene);
      material.setAmbient(0.5, 0.5, 0, 1.0);
      material.setDiffuse(0.5, 0.5, 0, 1.0);
      material.setSpecular(1.0, 1.0, 0, 1);
      material.setShininess(10.0);

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

      material.apply();

      this.parallelogram.display();

      this.scene.popMatrix()
    }

    {
      let material1 = new CGFappearance(this.scene);
      material1.setAmbient(0.5, 0.05, 0.05, 1.0);
      material1.setDiffuse(0.5, 0.05, 0.05, 1.0);
      material1.setSpecular(1.0, 0.1, 0.1, 1.0);
      material1.setShininess(10.0);


      let material2 = new CGFappearance(this.scene);
      material2.setAmbient(0.3, 0.15, 0.37, 1.0);
      material2.setDiffuse(0.3, 0.15, 0.37, 1.0);
      material2.setSpecular(0.6, 0.3, 0.75, 1.0);
      material2.setShininess(10.0);

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

      material1.apply();
      this.triangleSmall.display();

      this.scene.popMatrix()
      this.scene.pushMatrix()

      this.scene.multMatrix(translate2)
      this.scene.multMatrix(rotate2)

      material2.apply();
      this.triangleSmall.display();

      this.scene.popMatrix()
    }

    {
      let material1 = new CGFappearance(this.scene);
      material1.setAmbient(0.0, 0.3, 0.5, 1.0);
      material1.setDiffuse(0.0, 0.3, 0.5, 1.0);
      material1.setSpecular(0.0, 0.6, 1.0, 1.0);
      material1.setShininess(10.0);

      let material2 = new CGFappearance(this.scene);
      material2.setAmbient(0.5, 0.3, 0.0, 1.0);
      material2.setDiffuse(0.5, 0.3, 0.0, 1.0);
      material2.setSpecular(1.0, 0.6, 0.0, 1.0);
      material2.setShininess(10.0);

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

      material1.apply();
      this.triangleBig.display();

      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.multMatrix(rotate2);

      material2.apply();
      this.triangleBig.display();

      this.scene.popMatrix();
      this.scene.popMatrix();
    }
  }
}