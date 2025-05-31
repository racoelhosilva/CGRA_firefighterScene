import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance, CGFshader } from "../lib/CGF.js";
import { MyPanorama } from "./panorama/MyPanorama.js";
import { MyBuilding } from "./building/MyBuilding.js";
import { MyForest } from "./forest/MyForest.js";
import { MyHelicopter } from "./helicopter/MyHelicopter.js";
import { MyFire } from "./fire/MyFire.js";
import { MyLake } from "./lake/MyLake.js";
import { MyHelicopterMarker } from "./helicopter/MyHelicopterMarker.js";
import { MyGround } from "./ground/MyGround.js";

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

    // TODO(Process-ing): Why is this here?
    // this.groundTex = new CGFtexture(this, "textures/ground.png");
		// this.appearance.setTexture(this.groundTex);
		// this.appearance.setTextureWrap('REPEAT', 'REPEAT');

    this.updatePeriod = 50;
    this.setUpdatePeriod(this.updatePeriod);
    this.speedFactor = 1;

    this.panoramaTexture = new CGFtexture(this, 'textures/panorama.jpg');
    this.grassTexture = new CGFtexture(this, 'textures/grass.jpg');
    this.truncTexture = new CGFtexture(this, 'textures/bark.jpg');
    this.crownTexture = new CGFtexture(this, 'textures/leaves.jpg');
    this.helicopterTexture = new CGFtexture(this, 'textures/helicopter.png');
    this.fireTexture = new CGFtexture(this, 'textures/fire.jpg');
    this.waterMap = new CGFtexture(this, 'textures/water_map.png');
    this.elevationMap = new CGFtexture(this, 'textures/elevation_map.png');
    this.lakeTexture = new CGFtexture(this, 'textures/water.png');

    this.planeShader = new CGFshader(this.gl, 'shaders/plane.vert', 'shaders/plane.frag');

    // Building Properties
    this.buildingSize = 100;
    this.buildingX = -50;
    this.buildingZ = -150;
    this.floorNumber = 3;
    this.windowNumber = 3;
    this.buildingColor = this.hexToRgbA('#8F8B7E');
    this.buildingMaterial = new CGFappearance(this);
    this.buildingMaterial.setAmbient(0.565, 0.573, 0.522, 1.0);
    this.buildingMaterial.setDiffuse(0.565, 0.573, 0.522, 1.0);
    this.buildingMaterial.setSpecular(0, 0, 0, 0);
    this.buildingMaterial.setShininess(1.0);

    // Door Texture
    this.doorTexture = new CGFtexture(this, "textures/door.png");
    this.doorMaterial = new CGFappearance(this);
    this.doorMaterial.setAmbient(0.3, 0.3, 0.3, 1);
    this.doorMaterial.setShininess(1.0);
    this.doorMaterial.setTexture(this.doorTexture);
    this.doorMaterial.setTextureWrap("REPEAT", "REPEAT");

    // Banner Texture
    this.bannerTexture = new CGFtexture(this, "textures/banner.png");
    this.bannerMaterial = new CGFappearance(this);
    this.bannerMaterial.setAmbient(0.3, 0.3, 0.3, 1);
    this.bannerMaterial.setShininess(1.0);
    this.bannerMaterial.setTexture(this.bannerTexture);
    this.bannerMaterial.setTextureWrap("REPEAT", "REPEAT");

    // Window Textures
    this.windowTexture1 = new CGFtexture(this, 'textures/window.png');
    this.windowTexture2 = new CGFtexture(this, 'textures/window2.jpg');
    this.windowTextures = [this.windowTexture1, this.windowTexture2];
    this.windowTexturesIds = {'Window1': 0, 'Window2': 1};
    this.selectedWindowTexture = 0;

    this.windowMaterial = new CGFappearance(this);
    this.windowMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.windowMaterial.setShininess(1.0);
    this.windowMaterial.setTexture(this.windowTexture1);
    this.windowMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Helipad Texture
    this.helipadTexture = new CGFtexture(this, "textures/helipad.png");
    this.helipadMaterial = new CGFappearance(this);
    this.helipadMaterial.setAmbient(0.3, 0.3, 0.3, 1);
    this.helipadMaterial.setShininess(1.0);
    this.helipadMaterial.setTexture(this.helipadTexture);
    this.helipadMaterial.setTextureWrap("REPEAT", "REPEAT");

    this.upTexture = new CGFtexture(this, "textures/helipad_up.png");
    this.downTexture = new CGFtexture(this, "textures/helipad_down.png");

    // Helipad Shader
    this.movementShader = new CGFshader(this.gl, 'shaders/movement.vert', 'shaders/movement.frag');

    // Helipad Lights
    this.pulsatingShader = new CGFshader(this.gl, 'shaders/pulsating.vert', 'shaders/pulsating.frag');

    // Lake Properties
    this.lakeRadius = 150;
    this.lakeCenter = [-150, this.Z_CLASHING_OFFSET, 150];

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.panorama = new MyPanorama(this, 64, 64, this.panoramaTexture);
    this.ground = new MyGround(this, 800, 'textures/plane_mask2.png', this.waterMap, this.elevationMap, this.grassTexture, this.lakeTexture, this.planeShader);
    this.building = new MyBuilding(this,
      this.buildingSize,
      this.floorNumber, this.windowNumber,
      this.windowMaterial, this.buildingMaterial,
      this.doorMaterial, this.bannerMaterial,
      this.helipadMaterial, this.upTexture, this.downTexture);

    this.forest = new MyForest(this, 200, 150, 7, 8, this.truncTexture, this.crownTexture);
    this.helicopter = new MyHelicopter(this, this.helicopterTexture, 25);
    this.helicopterMarker = new MyHelicopterMarker(this, this.helicopter);
    this.setHelicopterInitPos();

    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.fires = MyFire.generateFires(this, [-60, 0, -60], [60, 0, 60], 5, this.fireTexture, this.fireShader);

    this.lake = new MyLake(this, this.lakeRadius, this.lakeCenter, this.lakeMaterial);

    this.t = new Date().getTime();

    this.view = "plane";  // plane or helicopter
  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      2200,
      vec3.fromValues(300, 300, 300),
      vec3.fromValues(-50, 0, -100)
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

    this.pulsatingShader.setUniformsValues({ timeFactor: t / 100 % 100, phase : this.movePhase });
    this.movementShader.setUniformsValues({ phase: this.movePhase, blinking : ((Math.round(t / 250) % 2) == 0), default:0, textureUp : 1, textureDown : 2});
    this.fireShader.setUniformsValues({ timeFactor: t / 200 % 200 })
    this.planeShader.setUniformsValues({ timeFactor: t  / 400000.0 % 1.0 });
  }

  setDefaultAppearance() {
    this.setEmission(0.0, 0.0, 0.0, 1.0);
    this.activeTexture = null;
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  hexToRgbA(hex) {
      var ret;
      //either we receive a html/css color or a RGB vector
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
          ret=[
              parseInt(hex.substring(1,3),16).toPrecision()/255.0,
              parseInt(hex.substring(3,5),16).toPrecision()/255.0,
              parseInt(hex.substring(5,7),16).toPrecision()/255.0,
              1.0
          ];
      }
      else
          ret=[
              hex[0].toPrecision()/255.0,
              hex[1].toPrecision()/255.0,
              hex[2].toPrecision()/255.0,
              1.0
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

  updateWindowTexture() {
    this.windowMaterial.setTexture(this.windowTextures[this.selectedWindowTexture]);
  }

  updateBuildingMaterial() {
    this.buildingMaterial.setAmbient(...this.hexToRgbA(this.buildingColor));
    this.buildingMaterial.setDiffuse(...this.hexToRgbA(this.buildingColor));
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.setGlobalAmbientLight(0.4, 0.4, 0.4, 1.0);

    this.axis.display();

    this.panorama.display();
    this.ground.display();

    this.pushMatrix();
    this.translate(this.buildingX, 0, this.buildingZ);
    this.building.display();
    this.popMatrix();

    this.forest.display();
    this.helicopter.display();

    // Transparent object should be displayed at the end to prevent hiding objects behind transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.fires.forEach(fire => fire.display());
    this.helicopterMarker.display();

    this.gl.disable(this.gl.BLEND);
  }
}
