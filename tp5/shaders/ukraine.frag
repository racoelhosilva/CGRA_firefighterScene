#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;

void main() {
	gl_FragColor.a = 1.0;
	if (coords.y > 0.5) {
		gl_FragColor.rgb = vec3(229.0, 226.0, 80.0) / 255.0;
	} else {
		gl_FragColor.rgb = vec3(136.0, 140.0, 221.0) / 255.0;
	}
}