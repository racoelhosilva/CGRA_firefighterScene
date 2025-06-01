#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;
uniform float randomFactor;

varying vec2 vTextureCoord;

void main() {
    float xWave = sin(aVertexPosition.x * 8.0 + timeFactor * randomFactor);
    float yWave = 1.0 + 0.1 * sin(aVertexPosition.y + timeFactor * randomFactor * 0.4);
    float zWave = sin(aVertexPosition.z * 8.0 + timeFactor * randomFactor);

    vec3 displacedPosition = aVertexPosition + vec3(xWave, 0, zWave);
    displacedPosition.y *= yWave;

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);

    vTextureCoord = aTextureCoord;
}