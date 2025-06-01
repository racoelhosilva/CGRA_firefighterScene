import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPanorama } from "./panorama/MyPanorama.js";
import { MyBuilding } from "./building/MyBuilding.js";
import { MyForest } from "./forest/MyForest.js";
import { MyHeli } from "./helicopter/MyHeli.js";
import { MyFire } from "./fire/MyFire.js";
import { MyHeliMarker } from "./helicopter/MyHeliMarker.js";
import { MyTerrain } from "./terrain/MyTerrain.js";

/**
 * @brief MyScene class, representing the main scene of the application.
 *
 * This class extends CGFscene and initializes the scene with various objects
 * including a panorama, terrain, building, helicopter, forest, and fire.
 * It also handles camera setup, lighting, and user input for controlling the helicopter.
 */
export class MyScene extends CGFscene {
    Z_CLASHING_OFFSET = 0.2;

    /**
     * @brief Constructor for MyScene.
     */
    constructor() {
        super();
    }

    /**
     * @brief Initializes the scene with the given application.
     *
     * @param {CGFapplication} application - The application to which this scene belongs.
     */
    init(application) {
        super.init(application);

        // Initialize the scene, the camera and the lights
        this.initCameras();
        this.initLights();

        // Initialize the OpenGL context
        this.gl.clearColor(0, 0, 0, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        // Initialize the scene appearance
        this.enableTextures(true);
        this.appearance = new CGFappearance(this);


        // Scene properties
        this.updatePeriod = 50;
        this.setUpdatePeriod(this.updatePeriod);

        // Axis Setup
        this.displayAxis = false;
        this.axis = new CGFaxis(this, 20, 1);

        // Panorama Setup
        this.panoramaTextures = [
            new CGFtexture(this, 'textures/panorama_sunrise.jpg'),
            new CGFtexture(this, 'textures/panorama_day.jpg'),
            new CGFtexture(this, 'textures/panorama_sunset.jpg'),
            new CGFtexture(this, 'textures/panorama_night.jpg')
        ];
        this.panoramaTextureIds = {
            'Sunrise': 0,
            'Day': 1,
            'Sunset': 2,
            'Night': 3
        };
        this.selectedPanoramaTexture = 2;

        // Panorama Object
        this.panorama = new MyPanorama(this, 2000, 64, 64, this.panoramaTextures[this.selectedPanoramaTexture]);

        // Plane/Terrain Setup

        // Ground Sections
        this.grassTextures = [
            new CGFtexture(this, 'textures/grass.jpg'),
            new CGFtexture(this, 'textures/dirt.jpg')
        ];
        this.grassTexturesIds = {
            'Grass': 0,
            'Dirt': 1
        };
        this.selectedGrassTexture = 0;

        // Lake Sections
        this.waterTextures = [
            new CGFtexture(this, 'textures/water1.jpg'),
            new CGFtexture(this, 'textures/water2.png')
        ];
        this.waterTexturesIds = {
            'Water 1': 0,
            'Water 2': 1
        };
        this.selectedWaterTexture = 0;

        // Plane Mask and Shader
        this.planeMaskPath = 'textures/plane_mask.jpg';
        this.planeShader = new CGFshader(this.gl, 'shaders/plane.vert', 'shaders/plane.frag');

        // Water Depth
        this.waterMap = new CGFtexture(this, 'textures/water_map.jpg');
        this.maxWaterDepth = 5.0;
        this.updateMaxWaterDepth();

        // Elevation Map
        this.elevationMap = new CGFtexture(this, 'textures/elevation_map.jpg');
        this.maxElevation = 50.0;
        this.updateMaxElevation();

        // Ground Object
        this.ground = new MyTerrain(
            this,
            800,
            this.planeMaskPath,
            this.waterMap,
            this.elevationMap,
            this.grassTextures[this.selectedGrassTexture],
            this.waterTextures[this.selectedWaterTexture],
            this.planeShader
        );

        // Building Setup

        // Building Properties
        this.buildingSize = 100;
        this.buildingX = -75;
        this.buildingZ = -175;
        this.floorNumber = 3;
        this.windowNumber = 3;
        this.buildingColor = '#d9d2b5';
        this.backWindows = false;

        // Building Textures
        this.buildingTextures = [
            null,
            new CGFtexture(this, "textures/brick.jpg"),
            new CGFtexture(this, "textures/stone.jpg")
        ];
        this.buildingTexturesIds = {
            'None': 0,
            'Brick': 1,
            'Stone': 2
        };
        this.selectedBuildingTexture = 0;

        // Door Textures
        this.doorTextures = [
            new CGFtexture(this, "textures/door1.jpg"),
            new CGFtexture(this, "textures/door2.jpg")
        ];
        this.doorTexturesIds = {
            'Door 1': 0,
            'Door 2': 1
        };
        this.selectedDoorTexture = 0;

        // Banner Textures
        this.bannerTextures = [
            new CGFtexture(this, "textures/banner_en.jpg"),
            new CGFtexture(this, "textures/banner_pt.jpg")
        ];
        this.bannerTexturesIds = {
            'English': 0,
            'Portuguese': 1
        };
        this.selectedBannerTexture = 0;

        // Window Textures
        this.windowTextures = [
            new CGFtexture(this, 'textures/window1.jpg'),
            new CGFtexture(this, 'textures/window2.jpg'),
            new CGFtexture(this, 'textures/window3.jpg'),
            new CGFtexture(this, 'textures/window4.jpg'),
            new CGFtexture(this, 'textures/stained1.jpg')
        ];
        this.windowTexturesIds = {
            'Window 1': 0,
            'Window 2': 1,
            'Window 3': 2,
            'Window 4': 3,
            'Stained Glass': 4
        };
        this.selectedWindowTexture = 3;

        // Helipad Textures
        this.helipadTexture = new CGFtexture(this, "textures/helipad.png");
        this.upTexture = new CGFtexture(this, "textures/helipad_up.png");
        this.downTexture = new CGFtexture(this, "textures/helipad_down.png");

        // Helipad Shaders
        this.movementShader = new CGFshader(this.gl, 'shaders/movement.vert', 'shaders/movement.frag');
        this.movementShader.setUniformsValues({ timeFactor: 0, phase: 0, blinking: true, default: 0, textureUp: 1, textureDown: 2 });
        this.pulsatingShader = new CGFshader(this.gl, 'shaders/pulsating.vert', 'shaders/pulsating.frag');

        // Building Object
        this.building = new MyBuilding(this,
            this.buildingSize,
            this.hexToRgb(this.buildingColor),
            this.floorNumber,
            this.windowNumber,
            this.windowTextures[this.selectedWindowTexture],
            this.backWindows,
            this.buildingTextures[this.selectedBuildingTexture],
            this.doorTextures[this.selectedDoorTexture],
            this.bannerTextures[this.selectedBannerTexture],
            this.helipadTexture, this.upTexture, this.downTexture
        );

        // Helicopter Setup

        // Helicopter Properties
        this.helicopterColor = '#a00000';
        this.helicopterMarkerColor = '#80ff80';
        this.helicopterScaleFactor = 0.8;
        this.speedFactor = 1;
        this.helicopterTexture = new CGFtexture(this, 'textures/helicopter.jpg');
        this.metalTexture = new CGFtexture(this, 'textures/metal.jpg');
        this.metalTexture2 = new CGFtexture(this, 'textures/metal2.jpg');

        // Helicopter Object
        this.helicopter = new MyHeli(
            this,
            this.hexToRgb(this.helicopterColor),
            this.helicopterTexture,
            this.metalTexture,
            this.metalTexture2,
            30,
            this.helicopterScaleFactor
        );
        this.setHelicopterInitPos();

        // Helicopter Marker
        this.helicopterMarker = new MyHeliMarker(
            this,
            this.helicopter,
            this.hexToRgb(this.helicopterMarkerColor)
        );

        // Forest Setup

        // Forest Properties
        this.treeRows = 5;
        this.treeCols = 5;
        this.darkTree = "#0b352b";
        this.lightTree = "#43873c";
        this.truncTexture = new CGFtexture(this, 'textures/bark.jpg');
        this.crownTexture = new CGFtexture(this, 'textures/leaves.jpg');

        // Forest Objects
        this.forest1 = new MyForest(
            this,
            150, 150,
            this.treeRows, this.treeCols,
            this.truncTexture,
            this.crownTexture,
            this.hexToRgb(this.darkTree),
            this.hexToRgb(this.lightTree)
        );
        this.forest2 = new MyForest(
            this,
            150, 150,
            this.treeRows, this.treeCols,
            this.truncTexture,
            this.crownTexture,
            this.hexToRgb(this.darkTree),
            this.hexToRgb(this.lightTree)
        );

        // Fires Setup

        // Fires Properties
        this.numFires = 6;
        this.fireTexture = new CGFtexture(this, 'textures/fire.jpg');
        this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");

        // Fire Objects
        const fires1 = MyFire.generateFires(
            this,
            [-60, 0, -60],
            [60, 0, 60],
            this.numFires / 2,
            this.fireTexture,
            this.fireShader
        );
        const fires2 = MyFire.generateFires(
            this,
            [-60 + 150, 0, -60 + 100],
            [60 + 150, 0, 60 + 100],
            this.numFires / 2,
            this.fireTexture,
            this.fireShader
        );
        this.fires = fires1.concat(fires2);

        // Presets Setup
        this.presets = [this.defaultPreset, this.fallPreset];
        this.presetIds = {
            "Default": 0,
            "Fall": 1
        };
        this.selectedPreset = 0;

        // Camera View Setup
        this.view = "FREE";
        this.viewIds = { 'Free': "FREE", 'Helicopter': "HELICOPTER", "Far": "FAR" };

        // Time Setup
        this.t = new Date().getTime();
    }

    /**
     * @brief Initializes the lights for the scene.
     */
    initLights() {
        this.lights[0].setPosition(200, 200, 200, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();

        this.setGlobalAmbientLight(0.4, 0.4, 0.4, 1.0);
    }

    /**
     * @brief Returns the initial camera position.
     * @returns {vec3<number>} The initial camera position as a vec3.
     */
    getInitialCameraPosition() {
        return vec3.fromValues(-450, 300, 300);
    }

    /**
     * @brief Returns the initial camera target.
     * @returns {vec3<number>} The initial camera target as a vec3.
     */
    getInitialCameraTarget() {
        return vec3.fromValues(0, 0, -125);
    }

    /**
     * @brief Initializes the camera for the scene.
     */
    initCameras() {
        this.camera = new CGFcamera(
            0.4,
            0.1,
            2200,
            this.getInitialCameraPosition(),
            this.getInitialCameraTarget()
        );
    }

    /**
     * @brief Checks for key presses and updates the helicopter state accordingly.
     *
     * @param {number} deltaT - The time since the last update in milliseconds.
     */
    checkKeys(deltaT) {
        var text = "Keys pressed: ";
        var keysPressed = false;

        // Check for key codes e.g. in https://keycode.info/
        if (this.gui.isKeyPressed("KeyW")) {
            text += " W ";
            keysPressed = true;

            if (this.helicopter.getState() == "FLYING")
                this.helicopter.accelerate(this.speedFactor / 6000 * deltaT);
        }

        if (this.gui.isKeyPressed("KeyS")) {
            text += " S ";
            keysPressed = true;

            if (this.helicopter.getState() == "FLYING")
                this.helicopter.accelerate(-this.speedFactor / 6000 * deltaT);
        }

        if (this.gui.isKeyPressed("KeyA")) {
            text += " A ";
            keysPressed = true;

            if (this.helicopter.getState() == "FLYING")
                this.helicopter.turn(this.speedFactor / 750 * deltaT);
        }

        if (this.gui.isKeyPressed("KeyD")) {
            text += " D ";
            keysPressed = true;

            if (this.helicopter.getState() == "FLYING")
                this.helicopter.turn(-this.speedFactor / 750 * deltaT);
        }

        if (this.gui.isKeyPressed("KeyP")) {
            text += " P ";
            keysPressed = true;
            this.helicopter.liftOff();
        }

        if (this.gui.isKeyPressed("KeyL")) {
            text += " L ";
            keysPressed = true;

            if (this.ground.isAboveWater(this.helicopter.position)) {
                this.helicopter.lower()
            } else {
                this.helicopter.land();
            }
        }

        if (this.gui.isKeyPressed("KeyO")) {
            text += " O ";
            keysPressed = true;
            this.helicopter.openBucket();
        }

        if (this.gui.isKeyPressed("KeyR")) {
            text += " R ";
            keysPressed = true;
            this.helicopter.reset();
        }

        if (keysPressed)
            console.log(text);
    }

    /**
     * @brief Updates the scene state based on the elapsed time.
     *
     * @param {number} t - The current time in milliseconds.
     */
    update(t) {
        const deltaT = t - this.t;
        this.t = t;

        this.checkKeys(deltaT);

        // Update Helicopter
        this.helicopter.update(deltaT);
        this.movePhase = this.helicopter.getMovePhase();

        // Update Shaders
        this.pulsatingShader.setUniformsValues({ timeFactor: t / 100 % 100, phase: this.movePhase });
        this.movementShader.setUniformsValues({ phase: this.movePhase, blinking: ((Math.round(t / 400) % 2) == 0) });
        this.fireShader.setUniformsValues({ timeFactor: t / 200 % 200 })
        this.planeShader.setUniformsValues({ timeFactor: t / 400000.0 % 100 });
    }

    /**
     * @brief Sets the default appearance for the scene.
     */
    setDefaultAppearance() {
        this.setEmission(0.0, 0.0, 0.0, 1.0);
        this.activeTexture = null;
        this.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.setShininess(10.0);
    }

    /**
     * @brief Converts a hex color string or RGB vector to an RGB array.
     *
     * @param {string|Array<number>} hex - The hex color string (e.g., "#RRGGBB") or RGB vector.
     * @return {Array<number>} An array containing the RGB values normalized to the range [0, 1].
     */
    hexToRgb(hex) {
        var ret;
        //either we receive a html/css color or a RGB vector
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            ret = [
                parseInt(hex.substring(1, 3), 16).toPrecision() / 255.0,
                parseInt(hex.substring(3, 5), 16).toPrecision() / 255.0,
                parseInt(hex.substring(5, 7), 16).toPrecision() / 255.0,
            ];
        }
        else
            ret = [
                hex[0].toPrecision() / 255.0,
                hex[1].toPrecision() / 255.0,
                hex[2].toPrecision() / 255.0,
            ];
        return ret;
    }

    /**
     * @brief Sets the initial position of the helicopter based on the building's position.
     */
    setHelicopterInitPos() {
        this.helicopter.setInitPos([
            this.buildingX + this.building.getCentralFloorWidth() / 2,
            this.building.getTotalHeight() + this.Z_CLASHING_OFFSET,
            this.buildingZ + this.building.getCentralFloorDepth() / 2
        ]);
    }

    /**
     * @brief Updates the panorama texture based on the selected texture.
     */
    updatePanoramaTexture() {
        this.panorama.updateTexture(this.panoramaTextures[this.selectedPanoramaTexture]);
    }

    /**
     * @brief Updates the grass texture based on the selected texture.
     */
    updateGrassTexture() {
        this.ground.updateGrassTexture(this.grassTextures[this.selectedGrassTexture]);
    }

    /**
     * @brief Updates the water texture based on the selected texture.
     */
    updateWaterTexture() {
        this.ground.updateWaterTexture(this.waterTextures[this.selectedWaterTexture]);
    }

    /**
     * @brief Updates the elevation map and max elevation for the terrain.
     */
    updateMaxElevation() {
        this.planeShader.setUniformsValues({ maxElevation: this.maxElevation });
    }

    /**
     * @brief Updates the maximum water depth for the terrain.
     */
    updateMaxWaterDepth() {
        this.planeShader.setUniformsValues({ maxWaterDepth: this.maxWaterDepth });
    }

    /**
     * @brief Updates the building size and adjusts the helicopter's initial position accordingly.
     */
    updateBuildingSize() {
        this.building.updateSize(this.buildingSize);
        this.setHelicopterInitPos();
    }

    /**
     * @brief Updates the number of floors in the building and adjusts the helicopter's initial position accordingly.
     */
    updateFloorNumber() {
        this.building.updateFloorNumber(this.floorNumber);
        this.setHelicopterInitPos();
    }

    /**
     * @brief Updates the number of windows in the building.
     */
    updateWindowNumber() {
        this.building.updateWindowNumber(this.windowNumber);
    }

    /**
     * @brief Updates the back windows visibility in the building.
     */
    updateBackWindows() {
        this.building.updateBackWindows(this.backWindows);
    }

    /**
     * @brief Updates the building color based on the selected hex color.
     */
    updateBuildingColor() {
        this.building.updateBuildingColor(this.hexToRgb(this.buildingColor));
    }

    /**
     * @brief Updates the building texture based on the selected texture.
     */
    updateBuildingTexture() {
        this.building.updateBuildingTexture(this.buildingTextures[this.selectedBuildingTexture]);
    }

    /**
     * @brief Updates the banner texture based on the selected texture.
     */
    updateBannerTexture() {
        this.building.updateBannerTexture(this.bannerTextures[this.selectedBannerTexture]);
    }

    /**
     * @brief Updates the door texture based on the selected texture.
     */
    updateDoorTexture() {
        this.building.updateDoorTexture(this.doorTextures[this.selectedDoorTexture]);
    }

    /**
     * @brief Updates the window texture based on the selected texture.
     */
    updateWindowTexture() {
        this.building.updateWindowTexture(this.windowTextures[this.selectedWindowTexture]);
    }

    /**
     * @brief Updates the helicopter's speed factor.
     */
    updateSpeedFactor() {
        this.helicopter.setSpeedValues(this.speedFactor);
    }

    /**
     * @brief Updates the helicopter's color based on the selected hex color.
     */
    updateHelicopterColor() {
        this.helicopter.updateColor(this.hexToRgb(this.helicopterColor));
    }

    /**
     * @brief Updates the helicopter marker's color based on the selected hex color.
     */
    updateHelicopterMarkerColor() {
        this.helicopterMarker.updateColor(this.hexToRgb(this.helicopterMarkerColor));
    }

    /**
     * @brief Updates the helicopter's scale factor.
     */
    updateHelicopterScaleFactor() {
        this.helicopter.setScaleFactor(this.helicopterScaleFactor);
    }

    /**
     * @brief Resets the forest by creating new instances of MyForest with the current properties.
     */
    resetForest() {
        this.forest1 = new MyForest(this, 150, 150, this.treeRows, this.treeCols, this.truncTexture, this.crownTexture, this.hexToRgb(this.darkTree), this.hexToRgb(this.lightTree));
        this.forest2 = new MyForest(this, 150, 150, this.treeRows, this.treeCols, this.truncTexture, this.crownTexture, this.hexToRgb(this.darkTree), this.hexToRgb(this.lightTree));
    }

    /**
     * @brief Resets the fires by generating new instances of MyFire with the current properties.
     */
    resetFire() {
        this.fires = MyFire.generateFires(this, [-60, 0, -60], [60, 0, 60], this.numFires / 2, this.fireTexture, this.fireShader);
        const fires2 = MyFire.generateFires(this, [-60 + 150, 0, -60 + 100], [60 + 150, 0, 60 + 100], this.numFires / 2, this.fireTexture, this.fireShader);
        this.fires = this.fires.concat(fires2);
    }

    /**
     * @brief Applies the selected preset to the scene.
     */
    applyPreset() {
        this.presets[this.selectedPreset].call(this);
    }

    /**
     * @brief Applies the default preset to the scene.
     */
    defaultPreset() {
        this.selectedGrassTexture = 0;
        this.updateGrassTexture();

        this.darkTree = "#0b352b";
        this.lightTree = "#43873c";
        this.resetForest();

        this.selectedWaterTexture = 0;
        this.updateWaterTexture();
    }

    /**
     * @brief Applies the fall preset to the scene.
     */
    fallPreset() {
        this.selectedGrassTexture = 1;
        this.updateGrassTexture();

        this.darkTree = "#a74039";
        this.lightTree = "#c18748";
        this.resetForest();

        this.selectedWaterTexture = 1;
        this.updateWaterTexture();
    }

    /**
     * @brief Updates the camera view based on the selected view.
     */
    updateView() {
        switch (this.view) {
            case "FREE":
                this.camera.setPosition(this.getInitialCameraPosition());
                this.camera.setTarget(this.getInitialCameraTarget());
                this.camera.fov = 0.4;
                break;
            case "HELICOPTER":
                this.camera.fov = 0.5;
                break;
            case "FAR":
                this.camera.setPosition(vec3.fromValues(250, 275, 375));
                this.camera.setTarget(vec3.fromValues(50, 0, 0));
                this.camera.fov = 0.8;
                break;
        }
    }

    /**
     * @brief Displays the scene, rendering all objects and applying transformations.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Change camera position if on first person view
        if (this.view == "HELICOPTER") {
            const horizontalOffset = 250;
            const verticalOffset = 200;
            const cameraPos = vec3.fromValues(
                this.helicopter.position[0] - Math.cos(this.helicopter.orientation) * horizontalOffset,
                this.helicopter.position[1] + verticalOffset,
                this.helicopter.position[2] + Math.sin(this.helicopter.orientation) * horizontalOffset
            );

            this.camera.setPosition(cameraPos);
            this.camera.setTarget(this.helicopter.position);
        }

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.setDefaultAppearance();

        if (this.displayAxis) {
            this.axis.display();
        }

        this.panorama.display();

        this.ground.display();

        this.pushMatrix();
        this.translate(this.buildingX, 0, this.buildingZ);
        this.building.display();
        this.popMatrix();

        this.forest1.display();
        this.pushMatrix();
        this.translate(150, 0, 100);
        this.forest2.display();
        this.popMatrix();

        this.helicopter.display();

        // Transparent objects should be displayed at the end to prevent hiding objects behind transparency
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.fires.forEach(fire => fire.display());
        this.helicopterMarker.display();

        this.gl.disable(this.gl.BLEND);
    }
}
