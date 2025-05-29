#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform float randomFactor;

varying vec2 vTextureCoord;

void main() {
    float amplitude = 1.0;
    float xWave = sin(aVertexPosition.x * 8.0 + timeFactor * randomFactor);
    float zWave = sin(aVertexPosition.z * 8.0 + timeFactor * randomFactor);
    vec3 displacedPosition = aVertexPosition + vec3(xWave * amplitude, (xWave + zWave) * amplitude, zWave * amplitude);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);

    vTextureCoord = aTextureCoord;
}