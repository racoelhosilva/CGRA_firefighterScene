import { CGFobject } from "../../lib/CGF.js";
import { MyTree } from "./MyTree.js";

export class MyForest extends CGFobject {
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
        treeRow.push(new MyTree(this.scene, 0, "x", 2, 20, [0.0, 0.5, 0.0]));
      trees.push(treeRow);
    }

    return trees;
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