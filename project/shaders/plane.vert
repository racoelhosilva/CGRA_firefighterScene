#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D mask;
uniform sampler2D waterMap;
uniform sampler2D elevationMap;

uniform float timeFactor;
uniform float maxElevation;
uniform float maxWaterDepth;

varying vec2 vTextureCoord;

void main(void) {
    vec4 maskColor = texture2D(mask, aTextureCoord);
    vec3 newPosition = aVertexPosition;
    float maskValue = maskColor.r;

    if (maskValue < 0.5) {  // Lake area -> Add water depth
        vec2 mapPos = mod(aTextureCoord * 0.1 + 0.3 * timeFactor, 1.0);
        vec4 mapColor = texture2D(waterMap, mapPos);
        newPosition.z -= mapColor.r * maxWaterDepth;

    } else {  // Grass area -> Add elevation
        vec4 mapColor = texture2D(elevationMap, aTextureCoord);
        newPosition.z += (1.0 - mapColor.r) * maxElevation;
    }

    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);
    vTextureCoord = aTextureCoord;
}