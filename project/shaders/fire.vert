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
    float wave = sin(aVertexPosition.x * 4.0 + timeFactor * 2.0)
               + cos(aVertexPosition.z * 4.0 + timeFactor * 2.0);

    float amplitude = 1.0;
    vec3 displacedPosition = aVertexPosition + vec3(wave * amplitude, wave * amplitude, wave * amplitude);

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);

    vTextureCoord = aTextureCoord;
}