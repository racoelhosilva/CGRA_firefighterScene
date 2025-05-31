import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPanorama } from "./panorama/MyPanorama.js";
import { MyBuilding } from "./building/MyBuilding.js";
import { MyForest } from "./forest/MyForest.js";
import { MyHelicopter } from "./helicopter/MyHelicopter.js";
import { MyFire } from "./fire/MyFire.js";
import { MyHelicopterMarker } from "./helicopter/MyHelicopterMarker.js";
import { MyTerrain } from "./terrain/MyTerrain.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  Z_CLASHING_OFFSET = 0.2;

  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);
    this.appearance = new CGFappearance(this);

    this.updatePeriod = 50;
    this.setUpdatePeriod(this.updatePeriod);
    this.speedFactor = 1;

    this.displayAxis = false;

    // Presets
    this.presets = [this.defaultPreset, this.fallPreset];
    this.presetIds = {
      "Default": 0,
      "Fall": 1
    };
    this.selectedPreset = 0;

    this.panoramaTextureSunrise = new CGFtexture(this, 'textures/panorama_sunrise.jpg');
    this.panoramaTextureDay = new CGFtexture(this, 'textures/panorama_day.jpg');
    this.panoramaTextureSunset = new CGFtexture(this, 'textures/panorama_sunset.jpg');
    this.panoramaTextureNight = new CGFtexture(this, 'textures/panorama_night.jpg');
    this.panoramaTextures = [this.panoramaTextureSunrise, this.panoramaTextureDay, this.panoramaTextureSunset, this.panoramaTextureNight];
    this.panoramaTextureIds = {
      'Sunrise': 0,
      'Day': 1,
      'Sunset': 2,
      'Night': 3
    };
    this.selectedPanoramaTexture = 2;

    this.grassTexture = new CGFtexture(this, 'textures/grass.jpg');
    this.dirtTexture = new CGFtexture(this, 'textures/dirt.jpg');
    this.grassTextures = [this.grassTexture, this.dirtTexture];
    this.grassTexturesIds = { 'Grass': 0, 'Dirt': 1 };
    this.selectedGrassTexture = 0;

    this.waterTexture1 = new CGFtexture(this, 'textures/water1.jpg');
    this.waterTexture2 = new CGFtexture(this, 'textures/water2.png');
    this.waterTextures = [this.waterTexture1, this.waterTexture2];
    this.waterTexturesIds = { 'Water 1': 0, 'Water 2': 1 };
    this.selectedWaterTexture = 0;

    this.truncTexture = new CGFtexture(this, 'textures/bark.jpg');
    this.crownTexture = new CGFtexture(this, 'textures/leaves.jpg');
    this.waterMap = new CGFtexture(this, 'textures/water_map.png');
    this.elevationMap = new CGFtexture(this, 'textures/elevation_map.jpg');

    this.treeRows = 5;
    this.treeCols = 5;
    this.darkTree = "#0b352b";
    this.lightTree = "#43873c";

    this.helicopterTexture = new CGFtexture(this, 'textures/helicopter.jpg');
    this.metalTexture = new CGFtexture(this, 'textures/metal.jpg');
    this.metalTexture2 = new CGFtexture(this, 'textures/metal2.jpg');

    this.fireTexture = new CGFtexture(this, 'textures/fire.jpg');
    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.numFires = 6;

    this.planeMaskPath = 'textures/plane_mask.jpg';
    this.planeShader = new CGFshader(this.gl, 'shaders/plane.vert', 'shaders/plane.frag');
    this.maxElevation = 50.0;
    this.updateMaxElevation();

    // Helicopter Properties
    this.helicopterColor = '#a00000';
    this.helicopterMarkerColor = '#80ff80';

    // Building Properties
    this.buildingSize = 100;
    this.buildingX = -75;
    this.buildingZ = -175;
    this.floorNumber = 3;
    this.windowNumber = 3;
    this.buildingColor = '#d9d2b5';
    this.backWindows = false;

    // Building Textures
    this.buildingTexture1 = new CGFtexture(this, "textures/brick.jpg");
    this.buildingTexture2 = new CGFtexture(this, "textures/stone.jpg");
    this.buildingTextures = [null, this.buildingTexture1, this.buildingTexture2];
    this.buildingTexturesIds = { 'None': 0, 'Brick': 1, 'Stone': 2 };
    this.selectedBuildingTexture = 0;

    // Door Texture
    this.doorTexture1 = new CGFtexture(this, "textures/door1.jpg");
    this.doorTexture2 = new CGFtexture(this, "textures/door2.jpg");
    this.doorTextures = [this.doorTexture1, this.doorTexture2];
    this.doorTexturesIds = { 'Door 1': 0, 'Door 2': 1 };
    this.selectedDoorTexture = 0;

    // Banner Texture
    this.bannerTextureEn = new CGFtexture(this, "textures/banner_en.jpg");
    this.bannerTexturePt = new CGFtexture(this, "textures/banner_pt.jpg");
    this.bannerTextures = [this.bannerTextureEn, this.bannerTexturePt];
    this.bannerTexturesIds = { 'English': 0, 'Portuguese': 1 };
    this.selectedBannerTexture = 0;

    // Window Textures
    this.windowTexture1 = new CGFtexture(this, 'textures/window1.jpg');
    this.windowTexture2 = new CGFtexture(this, 'textures/window2.jpg');
    this.windowTexture3 = new CGFtexture(this, 'textures/window3.jpg');
    this.windowTexture4 = new CGFtexture(this, 'textures/window4.jpg');
    this.stainedTexture1 = new CGFtexture(this, 'textures/stained1.jpg');
    this.windowTextures = [this.windowTexture1, this.windowTexture2, this.windowTexture3, this.windowTexture4, this.stainedTexture1];
    this.windowTexturesIds = { 'Window 1': 0, 'Window 2': 1, 'Window 3': 2, 'Window 4': 3, 'Stained Glass': 4 };
    this.selectedWindowTexture = 3;

    // Helipad Textures
    this.helipadTexture = new CGFtexture(this, "textures/helipad.png");
    this.upTexture = new CGFtexture(this, "textures/helipad_up.png");
    this.downTexture = new CGFtexture(this, "textures/helipad_down.png");

    // Helipad Shader
    this.movementShader = new CGFshader(this.gl, 'shaders/movement.vert', 'shaders/movement.frag');
    this.movementShader.setUniformsValues({ timeFactor: 0, phase: 0, blinking: true, default: 0, textureUp: 1, textureDown: 2 });

    // Helipad Lights Shader
    this.pulsatingShader = new CGFshader(this.gl, 'shaders/pulsating.vert', 'shaders/pulsating.frag');

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);

    this.panorama = new MyPanorama(this, 64, 64, this.panoramaTextures[this.selectedPanoramaTexture]);

    this.ground = new MyTerrain(this, 800, this.planeMaskPath, this.waterMap, this.elevationMap, this.grassTextures[this.selectedGrassTexture], this.waterTextures[this.selectedWaterTexture], this.planeShader);

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

    this.forest1 = new MyForest(this, 150, 150, this.treeRows, this.treeCols, this.truncTexture, this.crownTexture, this.hexToRgb(this.darkTree), this.hexToRgb(this.lightTree));
    this.forest2 = new MyForest(this, 150, 150, this.treeRows, this.treeCols, this.truncTexture, this.crownTexture, this.hexToRgb(this.darkTree), this.hexToRgb(this.lightTree));
    this.helicopterScaleFactor = 0.8;
    this.helicopter = new MyHelicopter(this, this.hexToRgb(this.helicopterColor), this.helicopterTexture, this.metalTexture, this.metalTexture2, 30, this.helicopterScaleFactor);
    this.setHelicopterInitPos();
    this.helicopterMarker = new MyHelicopterMarker(this, this.helicopter, this.hexToRgb(this.helicopterMarkerColor));

    const fires1 = MyFire.generateFires(this, [-60, 0, -60], [60, 0, 60], this.numFires / 2, this.fireTexture, this.fireShader)
    const fires2 = MyFire.generateFires(this, [-60 + 150, 0, -60 + 100], [60 + 150, 0, 60 + 100], this.numFires / 2, this.fireTexture, this.fireShader);
    this.fires = fires1.concat(fires2);

    this.t = new Date().getTime();

    this.view = "FREE";
    this.viewIds = { 'Free': "FREE", 'Helicopter': "HELICOPTER", "Far": "FAR" };
  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();

    this.setGlobalAmbientLight(0.4, 0.4, 0.4, 1.0);
  }

  getInitialCameraPosition() {
    return vec3.fromValues(-450, 300, 300);
  }

  getInitialCameraTarget() {
    return vec3.fromValues(0, 0, -125);
  }

  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      2200,
      this.getInitialCameraPosition(),
      this.getInitialCameraTarget()
    );
  }

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

  update(t) {
    const deltaT = t - this.t;
    this.t = t;

    this.checkKeys(deltaT);
    this.helicopter.update(deltaT);
    this.movePhase = this.helicopter.getMovePhase();

    this.pulsatingShader.setUniformsValues({ timeFactor: t / 100 % 100, phase: this.movePhase });
    this.movementShader.setUniformsValues({ phase: this.movePhase, blinking: ((Math.round(t / 400) % 2) == 0) });
    this.fireShader.setUniformsValues({ timeFactor: t / 200 % 200 })
    this.planeShader.setUniformsValues({ timeFactor: t / 400000.0 % 100 });
  }

  setDefaultAppearance() {
    this.setEmission(0.0, 0.0, 0.0, 1.0);
    this.activeTexture = null;
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

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

  setHelicopterInitPos() {
    this.helicopter.setInitPos([
      this.buildingX + this.building.getCentralFloorWidth() / 2,
      this.building.getTotalHeight() + this.Z_CLASHING_OFFSET,
      this.buildingZ + this.building.getCentralFloorDepth() / 2
    ]);
  }

  updateSpeedFactor() {
    this.helicopter.setSpeedValues(this.speedFactor);
  }

  updateBuildingSize() {
    this.building.updateSize(this.buildingSize);
    this.setHelicopterInitPos();
  }

  updateFloorNumber() {
    this.building.updateFloorNumber(this.floorNumber);
    this.setHelicopterInitPos();
  }

  updateWindowNumber() {
    this.building.updateWindowNumber(this.windowNumber);
  }

  updateBuildingTexture() {
    this.building.updateBuildingTexture(this.buildingTextures[this.selectedBuildingTexture]);
  }

  updateWindowTexture() {
    this.building.updateWindowTexture(this.windowTextures[this.selectedWindowTexture]);
  }

  updateBackWindows() {
    this.building.updateBackWindows(this.backWindows);
  }

  updateBannerTexture() {
    this.building.updateBannerTexture(this.bannerTextures[this.selectedBannerTexture]);
  }

  updateDoorTexture() {
    this.building.updateDoorTexture(this.doorTextures[this.selectedDoorTexture]);
  }

  updateBuildingColor() {
    this.building.updateBuildingColor(this.hexToRgb(this.buildingColor));
  }

  updateHelicopterColor() {
    this.helicopter.updateColor(this.hexToRgb(this.helicopterColor));
  }

  updateHelicopterMarkerColor() {
    this.helicopterMarker.updateColor(this.hexToRgb(this.helicopterMarkerColor));
  }

  resetFire() {
    this.fires = MyFire.generateFires(this, [-60, 0, -60], [60, 0, 60], this.numFires, this.fireTexture, this.fireShader);
    const fires2 = MyFire.generateFires(this, [-60 + 150, 0, -60 + 100], [60 + 150, 0, 60 + 100], this.numFires, this.fireTexture, this.fireShader);
    this.fires = this.fires.concat(fires2);
  }

  resetForest() {
    this.forest1 = new MyForest(this, 150, 150, this.treeRows, this.treeCols, this.truncTexture, this.crownTexture, this.hexToRgb(this.darkTree), this.hexToRgb(this.lightTree));
    this.forest2 = new MyForest(this, 150, 150, this.treeRows, this.treeCols, this.truncTexture, this.crownTexture, this.hexToRgb(this.darkTree), this.hexToRgb(this.lightTree));
  }

  updatePanoramaTexture() {
    this.panorama.updateTexture(this.panoramaTextures[this.selectedPanoramaTexture]);
  }

  updateGrassTexture() {
    this.ground.updateGrassTexture(this.grassTextures[this.selectedGrassTexture]);
  }

  updateWaterTexture() {
    this.ground.updateWaterTexture(this.waterTextures[this.selectedWaterTexture]);
  }

  updateMaxElevation() {
    this.planeShader.setUniformsValues({ maxElevation: this.maxElevation });
  }

  updateHelicopterScaleFactor() {
    this.helicopter.setScaleFactor(this.helicopterScaleFactor);
  }

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

  applyPreset() {
    this.presets[this.selectedPreset].call(this);
  }

  defaultPreset() {
    this.selectedGrassTexture = 0;
    this.updateGrassTexture();

    this.darkTree = "#0b352b";
    this.lightTree = "#43873c";
    this.resetForest();

    this.selectedWaterTexture = 0;
    this.updateWaterTexture();
  }

  fallPreset() {
    this.selectedGrassTexture = 1;
    this.updateGrassTexture();

    this.darkTree = "#a74039";
    this.lightTree = "#c18748";
    this.resetForest();

    this.selectedWaterTexture = 1;
    this.updateWaterTexture();
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

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

    // Transparent object should be displayed at the end to prevent hiding objects behind transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.fires.forEach(fire => fire.display());
    this.helicopterMarker.display();

    this.gl.disable(this.gl.BLEND);
  }
}
