<h1 align="center"> CG 2024/2025 - Final Project</h1>

> **Group T13G01**  
> - Bruno Ricardo Soares Pereira de Sousa Oliveira (202208700)  
> - Rodrigo Albergaria Coelho e Silva (202205188)

<h2>Table of Contents</h2>

- [Project Description](#project-description)
- [Controls Overview](#controls-overview)
- [Implemented Functionalities](#implemented-functionalities)
- [Checkpoint List](#checkpoint-list)
  - [Sky Sphere](#sky-sphere)
  - [Building](#building)
  - [Forest](#forest)
  - [Helicopter 1](#helicopter-1)
  - [Helicopter 2](#helicopter-2)
  - [Lake and Fire](#lake-and-fire)
  - [Fire Ondulation](#fire-ondulation)
  - [Additional Development](#additional-development)
- [Developers](#developers)

## Project Description

The objective of this project is to create a 3D scene that integrates techniques learned throughout the course, while exploring new topics in Computer Graphics.

The scene includes a forest of burning trees, a lake, a fire station building, and a fully controllable helicopter capable of collecting water and extinguishing fires.

To achieve a high level of realism, we used multiple components, textures, materials, and custom shaders. Most aspects of the scene are also customizable through an interface.

## Controls Overview

The following keyboard controls are available for interacting with the helicopter:

|  Key  | Action                                                                                          |
| :---: | ----------------------------------------------------------------------------------------------- |
| **W** | Accelerate helicopter forward (when flying)                                                     |
| **S** | Decelerate (move backward) helicopter (when flying)                                             |
| **A** | Turn helicopter left (when flying)                                                              |
| **D** | Turn helicopter right (when flying)                                                             |
| **P** | Initiate helicopter takeoff (both from helipad and lake)                                        |
| **L** | Land helicopter (if above land, empty and still) or lower helicopter (if above water and still) |
| **O** | Open the helicopter's bucket (must have water and be over a fire)                               |
| **R** | Reset helicopter to initial state                                                               |

> **Note:**  
> - Movement keys (**W**, **S**, **A**, **D**) only affect the helicopter when it is in the "FLYING" state.
> - The **L** key will either land the helicopter (if it is empty, still and above land) or lower it (if it is still and above water).

## Implemented Functionalities

All of the core functionalities defined for this project are implemented and we also expanded upon most of them. For the additional development, we chose option `C`: combine the lake and grass using a plane mask and set appropriate textures, waves and movement.

A more detailed description of all the implemented features can be seen below:

- **Panorama**: A dynamic sky sphere surrounding the entire scene, with selectable textures (day, night, sunrise, sunset) for customization purposes.
- **Terrain**: The ground is generated using a shader with different masks: 
  - **Plane Mask**: a binary map used to define the regions with water and ground
  - **Elevation Map**: a height map used to create mountains and elevated regions
  - The textures of grass and water and the elevation factor of each region can be customized in the interface.
  - The lake region is defined through the plane mask, allowing for multiple lakes with irregular shapes.
- **Building**: The firefighter building with 3 modules of adjustable size, number of floors, number of windows per floor and back windows. The building color and textures for walls, windows, doors, and banner can be changed through the interface.
- **Forest**: Procedurally generated forest with adjustable density (rows and columns) and foliage coloration. Random tilts and fixed tree trunk and crown textures are used for realism. The scene contains two forests side-by-side that can be re-generated/reset through the interface. 
- **Helicopter**: Fully interactive helicopter with animated rotors, takeoff/landing animations, and a water bucket system for fire-fighting. The helicopter color, speed factor and scale can be adjusted via the interface.
  - The helicopter can pick up water on lakes, increasing the water level in the bucket. The water can then be dropped over the fires, creating water particles and reducing the water bucket until empty.
- **Lake**: Realistic water surface with customizable texture and animated shaders to simulate waves and movement. 
  - The lake interacts with the helicopter for water collection based on the plane mask previously mentioned.
- **Fire**: Procedurally generated animated fire objects with realistic textures and ondulation shaders. The number of fires is customizable through the interface and can also be reset.
  - The fire interacts with the water particles dropped by the helicopter after opening the bucket with water.
- **helipad Animation**: The helipad displays dynamic signage ("H", "UP", "DOWN") and corner lights that pulsate during helicopter maneuvers, implemented using custom shaders and textures.
- **Helicopter Marker**: Vertical column from the bucket to the ground for better User Experience when clearing the fires.
- **Camera Positions**: There are three defined cameras with different positions, fov and behaviors:
  - **Free**: the default camera focused on the main components of the scene. This camera can be controlled with the mouse.
  - **Helicopter**: a first-person camera to control the helicopter. It follows the helicopter through the scene.
  - **Far**: a camera situated farther away providing a larger overview of the scene. This camera can be controlled with the mouse.
- **Presets & Interface**: Some scene presets are available, instantly configuring multiple environment settings. The interface is organized into intuitive folders for easy control of all scene aspects.

## Checkpoint List

### Sky Sphere

<figure>
    <img src="./screenshots/project-t13g01-1.png" alt="Project step 1.2">
    <figcaption>Fig. 1: Screenshot of Sky Sphere step 1.2</figcaption>
</figure>

### Building

<figure>
    <img src="./screenshots/project-t13g01-2.png" alt="Project step 2.2">
    <figcaption>Fig. 2: Screenshot of Building step 2.2</figcaption>
</figure>

### Forest

<figure>
    <img src="./screenshots/project-t13g01-3.png" alt="Project step 3.4">
    <figcaption>Fig. 3: Screenshot of Forest step 3.4</figcaption>
</figure>

### Helicopter 1

<figure>
    <img src="./screenshots/project-t13g01-4.png" alt="Project step 4.1">
    <figcaption>Fig. 4: Screenshot of Helicopter step 4.1</figcaption>
</figure>

### Helicopter 2

<figure>
    <img src="./screenshots/project-t13g01-5.png" alt="Project step 4.3">
    <figcaption>Fig. 5: Screenshot of Helicopter step 4.3</figcaption>
</figure>

### Lake and Fire

<figure>
    <img src="./screenshots/project-t13g01-6.png" alt="Project step 5">
    <figcaption>Fig. 6: Screenshot of Lake and Fire step 5</figcaption>
</figure>

### Fire Ondulation

<figure>
    <img src="./screenshots/project-t13g01-7.png" alt="Project step 6.1">
    <figcaption>Fig. 7: Screenshot of Fire Ondulation step 6.1</figcaption>
</figure>

### Additional Development

<figure>
    <img src="./screenshots/project-t13g01-8.png" alt="Project step 7">
    <figcaption>Fig. 8: Screenshot of Additional Development step 7</figcaption>
</figure>

## Developers

| Name                                           | Number    | E-Mail            |
| ---------------------------------------------- | --------- | ----------------- |
| Bruno Ricardo Soares Pereira de Sousa Oliveira | 202208700 | up202208700@up.pt |
| Rodrigo Albergaria Coelho e Silva              | 202205188 | up202205188@up.pt |
