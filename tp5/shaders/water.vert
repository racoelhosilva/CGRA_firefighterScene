attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler2;
uniform float normScale;
uniform float timeFactor;

void main() {
	vec2 tex_offset = vec2(1.0, 1.0) * timeFactor / 100.0;
	vTextureCoord = aTextureCoord + tex_offset;

	vec4 elevation = texture2D(uSampler2, vTextureCoord);
	vec3 offset = vec3(0.0, 0.0, -0.002) * elevation.r * normScale;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}

