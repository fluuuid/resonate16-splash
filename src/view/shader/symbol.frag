#pragma glslify: ease2 = require(glsl-easings/bounce-out)

uniform vec3 color1;
uniform vec3 color2;

uniform float progress;
uniform int mode;

varying vec3 vPosition;

void main () {
	float p = (vPosition.x + 50.0) / 100.0;
	vec3 color = mix( color1, color2, p );
	//gl_FragColor = vec4( 1.0 );
	float alpha = 1.0;
	if ( mode == 1 ) {
		if ( min( 1.0, 2. * ( progress - 1.0 ) ) == 1.0 ) {
			discard;
		}
	}
	gl_FragColor = vec4( color, 1.0 );
	//gl_FragColor = vec4( p, p, p, 1.0 );
}