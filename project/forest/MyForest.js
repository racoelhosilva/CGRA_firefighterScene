import { CGFobject } from "../../lib/CGF.js";
import { MyTree } from "./MyTree.js";

export class MyForest extends CGFobject {
  MIN_RADIUS
  MAX_TILT = Math.PI / 18;
  MIN_RADIUS = 1.5;
  MAX_RADIUS = 2.5;
  MIN_HEIGHT = 20;
  MAX_HEIGHT = 25;
  MIN_COLOR = [0.043,0.173,0.11];
  MAX_COLOR = [0.263,0.529,0.235];

  GRID_SQUARE_SIZE = 20;
  POS_MAX_OFFSET = 6;

  constructor(scene, rows, columns, truncMaterial, crownMaterial) {
    super(scene);

    this.rows = rows;
    this.columns = columns;

    this.trees = this.buildTrees(rows, columns, truncMaterial, crownMaterial);
    this.displacements = this.buildDisplacements(rows, columns);
  }

  buildTrees(rows, columns, truncMaterial, crownMaterial) {
    let trees = [];

    for (let row = 0; row < rows; row++) {
      let treeRow = [];
      for (let col = 0; col < columns; col++)
        treeRow.push(this.buildRandomTree(truncMaterial, crownMaterial));
      trees.push(treeRow);
    }

    return trees;
  }

  buildRandomTree(truncMaterial, crownMaterial) {
    const tilt = this.randomBetween(-this.MAX_TILT, this.MAX_TILT);
    const tiltAxis = Math.random() < 0.5 ? "x" : "z";
    const radius = this.randomBetween(this.MIN_RADIUS, this.MAX_RADIUS);
    const height = this.randomBetween(this.MIN_HEIGHT, this.MAX_HEIGHT);
    const color = this.randomColor();

    return new MyTree(this.scene, tilt, tiltAxis, radius, height, color, truncMaterial, crownMaterial);
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
        dispRow.push(this.randomPosition(row, col));
      displacements.push(dispRow);
    }

    return displacements;
  }

  randomPosition(row, col) {
    const dx = this.randomBetween(-this.POS_MAX_OFFSET, this.POS_MAX_OFFSET);
    const dz = this.randomBetween(-this.POS_MAX_OFFSET, this.POS_MAX_OFFSET);

    return [
      (col + 0.5 - this.columns / 2) * this.GRID_SQUARE_SIZE + dx,
      (row + 0.5 - this.rows / 2) * this.GRID_SQUARE_SIZE + dz
    ];
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