#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;

void main() {
	if (coords.y > 0.5) {
		gl_FragColor = vec4(229.0/255.0, 226.0/255.0, 80.0/255.0, 1.0);
	} else {
		gl_FragColor = vec4(136.0/255.0, 140.0/255.0, 221.0/255.0, 1.0);
	}
}