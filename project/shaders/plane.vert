precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D mask;
uniform sampler2D waterMap;

uniform float timeFactor;

varying vec2 vTextureCoord;

void main(void) {
    vec4 maskColor = texture2D(mask, aTextureCoord);
    vec3 newPosition = aVertexPosition;
    float maskValue = maskColor.r;

    if (maskValue < 0.5) {
        vec2 mapPos = mod(aTextureCoord * 0.1 + timeFactor, 1.0);
        vec4 mapColor = texture2D(waterMap, mapPos);
        newPosition.z -= mapColor.r * 4.0;
    }

    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);
    vTextureCoord = aTextureCoord;
}