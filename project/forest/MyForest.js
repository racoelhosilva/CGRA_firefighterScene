import { CGFobject, CGFtexture } from "../../lib/CGF.js";
import { MyTree } from "./MyTree.js";

/**
 * @brief Class representing a forest (rectangular grid of ) in the scene.
 */
export class MyForest extends CGFobject {
    MIN_RADIUS
    MAX_TILT = Math.PI / 18;
    MIN_RADIUS = 3;
    MAX_RADIUS = 5;
    MIN_HEIGHT = 35;
    MAX_HEIGHT = 50;

    POS_MAX_OFFSET = 0.3;

    /**
     * @brief Constructs a new MyForest object.
     *
     * @param {CGFscene} scene - The scene to which this object belongs.
     * @param {number} width - The width of the forest area.
     * @param {number} height - The (horizontal) height of the forest area.
     * @param {number} rows - The number of rows of trees in the forest.
     * @param {number} columns - The number of columns of trees in the forest.
     * @param {CGFtexture} truncTexture - The material for the tree trunks.
     * @param {CGFtexture} crownTexture - The material for the tree crowns.
     * @param {Array<number>} minColor - The minimum RGB color for the tree crowns.
     * @param {Array<number>} maxColor - The maximum RGB color for the tree crowns.
     */
    constructor(scene, width, height, rows, columns, truncTexture, crownTexture, minColor, maxColor) {
        super(scene);

        this.rows = rows;
        this.columns = columns;
        this.width = width;
        this.height = height;

        this.minColor = minColor;
        this.maxColor = maxColor;

        this.trees = this.buildTrees(rows, columns, truncTexture, crownTexture);
        this.displacements = this.buildDisplacements(rows, columns);
    }

    /**
     * @brief Builds a grid of trees in the forest.
     *
     * @param {number} rows - The number of rows of trees.
     * @param {number} columns - The number of columns of trees.
     * @param {CGFtexture} truncTexture - The texture for the tree trunks.
     * @param {CGFtexture} crownTexture - The texture for the tree crowns.
     *
     * @returns {Array<Array<MyTree>>} - A 2D array of MyTree objects representing the forest.
     */
    buildTrees(rows, columns, truncTexture, crownTexture) {
        let trees = [];

        for (let row = 0; row < rows; row++) {
            let treeRow = [];
            for (let col = 0; col < columns; col++)
                treeRow.push(this.buildRandomTree(truncTexture, crownTexture));
            trees.push(treeRow);
        }

        return trees;
    }

    /**
     * @brief Builds a random tree with specified materials.
     *
     * @param {CGFtexture} truncTexture - The texture for the tree trunk.
     * @param {CGFtexture} crownTexture - The texture for the tree crown.
     *
     * @returns {MyTree} - A MyTree object representing the random tree.
     */
    buildRandomTree(truncTexture, crownTexture) {
        const tilt = this.randomBetween(-this.MAX_TILT, this.MAX_TILT);
        const tiltAxis = Math.random() < 0.5 ? "x" : "z";
        const radius = this.randomBetween(this.MIN_RADIUS, this.MAX_RADIUS);
        const height = this.randomBetween(this.MIN_HEIGHT, this.MAX_HEIGHT);
        const color = this.randomColor();

        return new MyTree(this.scene, tilt, tiltAxis, radius, height, color, truncTexture, crownTexture);
    }

    /**
     *
     * @param {*} min
     * @param {*} max
     * @returns
     */
    randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    randomColor() {
        const randomFactor = Math.random();

        return [
            this.minColor[0] + randomFactor * (this.maxColor[0] - this.minColor[0]),
            this.minColor[1] + randomFactor * (this.maxColor[1] - this.minColor[1]),
            this.minColor[2] + randomFactor * (this.maxColor[2] - this.minColor[2])
        ];
    }

    buildDisplacements(rows, columns) {
        let displacements = [];

        for (let row = 0; row < rows; row++) {
            let dispRow = [];
            for (let col = 0; col < columns; col++)
                dispRow.push(this.randomPosition(row, col));
            displacements.push(dispRow);
        }

        return displacements;
    }

    randomPosition(row, col) {
        const maxDx = this.width * this.POS_MAX_OFFSET / this.columns / 2;
        const maxDz = this.height * this.POS_MAX_OFFSET / this.rows / 2;

        const dx = this.randomBetween(-maxDx, maxDx);
        const dz = this.randomBetween(-maxDz, maxDz);

        return [
            (col + 0.5 - this.columns / 2) * this.width / this.columns + dx,
            (row + 0.5 - this.rows / 2) * this.height / this.rows + dz
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