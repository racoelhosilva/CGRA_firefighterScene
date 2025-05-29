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

varying vec2 vTextureCoord;

void main() {
    float amplitude = 1.0;
    float xWave = sin(aVertexPosition.x * 4.0 + timeFactor * 2.0);
    float zWave = sin(aVertexPosition.z * 4.0 + timeFactor * 2.0);
    vec3 displacedPosition = aVertexPosition + vec3(xWave * amplitude, (xWave + zWave) * amplitude, zWave * amplitude);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);

    vTextureCoord = aTextureCoord;
}