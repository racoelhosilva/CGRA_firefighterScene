import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyPlane } from "../MyPlane.js";

/**
 * @brief Class representing a terrain in the scene.
 */
export class MyTerrain extends CGFobject {
    /**
     * @brief Constructs a new MyTerrain object.
     *
     * @param {CGFscene} scene - The scene to which this object belongs.
     * @param {number} side - The length of one side of the (square) terrain.
     * @param {string} terrainMaskPath - Path to the terrain mask texture.
     * @param {CGFtexture} waterMap - Texture representing the water map.
     * @param {CGFtexture} elevationMap - Texture representing the elevation map.
     * @param {CGFtexture} grassTex - Texture for the grass.
     * @param {CGFtexture} lakeTex - Texture for the lake.
     * @param {CGFshader} shader - Shader used for rendering the terrain.
     */
    constructor(scene, side, terrainMaskPath, waterMap, elevationMap, grassTex, lakeTex, shader) {
        super(scene);

        this.side = side;
        this.plane = new MyPlane(scene, 255);

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setShininess(1.0);
        this.material.loadTexture(terrainMaskPath);
        this.material.setTextureWrap('REPEAT', 'REPEAT');

        this.waterMap = waterMap;
        this.elevationMap = elevationMap;
        this.grassTex = grassTex;
        this.lakeTex = lakeTex;
        this.shader = shader;

        this.shader.setUniformsValues({
            waterMap: 1,
            elevationMap: 2,
            grassTexture: 3,
            lakeTexture: 4
        });

        this.buildTerrainMask(terrainMaskPath);
    }

    /**
     * @brief Loads the terrain mask texture's pixel data into the terrainMaskData array.
     *
     * This is needed for checking if the helicopter is above water or not.
     *
     * @param {string} terrainMaskPath - Path to the terrain mask texture.
     */
    buildTerrainMask(terrainMaskPath) {
        this.terrainMaskData = null;

        // The simplest way we found to load the image data involves creating
        // and using an HTML canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.side;
        canvas.height = this.side;
        const ctx = canvas.getContext('2d');

        // The pixel data is obtained when the image is loaded
        const terrainMaskImg = new Image();
        terrainMaskImg.src = terrainMaskPath;
        terrainMaskImg.onload = () => {
            ctx.drawImage(terrainMaskImg, 0, 0, this.side, this.side);
            const imageData = ctx.getImageData(0, 0, this.side, this.side);
            this.terrainMaskData = imageData.data;
        };
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.side, 1, this.side);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.material.apply();
        this.waterMap.bind(1);
        this.elevationMap.bind(2);
        this.grassTex.bind(3);
        this.lakeTex.bind(4);

        this.scene.setActiveShader(this.shader);

        this.plane.display();

        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.setDefaultAppearance();
        this.scene.popMatrix();
    }

    /**
     * @brief Checks if a certain position is above water.
     *
     * @param {Array<number>} position - The position to check, given as an array [x, y, z].
     * @returns {boolean} - Returns true if the position is above water, false otherwise.
     */
    isAboveWater(position) {
        if (!this.terrainMaskData)
            return false; // Lake map not ready

        const [x, z] = [position[0], position[2]];
        const u = (x + this.side / 2) / this.side;
        const v = (z + this.side / 2) / this.side;

        if (u < 0 || u > 1 || v < 0 || v > 1)
            return false; // Out of bounds

        const px = Math.floor(u * (this.side - 1));
        const py = Math.floor(v * (this.side - 1));

        // Only works with 4 bytes per pixel (RGBA)
        const value = this.terrainMaskData[(py * this.side + px) * 4];
        // Although the texture should be only black and white, we check if the value is below 128
        // to determine if it's water (black) or land (white).
        return value < 128;
    }

    /**
     * @brief Updates the grass texture.
     *
     * @param {CGFtexture} newGrassTex - The new grass texture to apply.
     */
    updateGrassTexture(newGrassTex) {
        this.grassTex = newGrassTex;
    }

    /**
     * @brief Updates the water texture.
     *
     * @param {CGFtexture} newWaterTex - The new water texture to apply.
     */
    updateWaterTexture(newWaterTex) {
        this.lakeTex = newWaterTex;
    }
}
