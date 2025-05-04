import { CGFobject } from "../../lib/CGF.js";
import { MyTree } from "./MyTree.js";

export class MyForest extends CGFobject {
  MIN_RADIUS
  MAX_TILT = Math.PI / 18;
  MIN_RADIUS = 1.5;
  MAX_RADIUS = 2.5;
  MIN_HEIGHT = 20;
  MAX_HEIGHT = 25;
  MIN_COLOR = [0.0, 0.3, 0.0];
  MAX_COLOR = [0.1, 0.5, 0.1];

  constructor(scene, rows, columns) {
    super(scene);

    this.rows = rows;
    this.columns = columns;

    this.trees = this.buildTrees(rows, columns);
    this.displacements = this.buildDisplacements(rows, columns);
  }

  buildTrees(rows, columns) {
    let trees = [];

    for (let row = 0; row < rows; row++) {
      let treeRow = [];
      for (let col = 0; col < columns; col++)
        treeRow.push(this.buildRandomTree());
      trees.push(treeRow);
    }

    return trees;
  }

  buildRandomTree() {
    const tilt = this.randomBetween(-this.MAX_TILT, this.MAX_TILT);
    const tiltAxis = Math.random() < 0.5 ? "x" : "z";
    const radius = this.randomBetween(this.MIN_RADIUS, this.MAX_RADIUS);
    const height = this.randomBetween(this.MIN_HEIGHT, this.MAX_HEIGHT);
    const color = this.randomColor();

    return new MyTree(this.scene, tilt, tiltAxis, radius, height, color);
  }

  randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  randomColor() {
    return [
      this.randomBetween(this.MIN_COLOR[0], this.MAX_COLOR[0]),
      this.randomBetween(this.MIN_COLOR[1], this.MAX_COLOR[1]),
      this.randomBetween(this.MIN_COLOR[2], this.MAX_COLOR[2])
    ];
  }

  buildDisplacements(rows, columns) {
    let displacements =  [];

    for (let row = 0; row < rows; row++) {
      let dispRow = [];
      for (let col = 0; col < columns; col++)
        dispRow.push([(col + 0.5 - columns / 2) * 20, (row + 0.5 - rows / 2) * 20]);
      displacements.push(dispRow);
    }

    return displacements;
  }

  display() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        let tree = this.trees[row][col];
        let [dx, dz] = this.displacements[row][col];

        this.scene.pushMatrix();
        this.scene.translate(dx, 0, dz);
        tree.display();
        this.scene.popMatrix();
      }
    }
  }
}