#pragma glslify: ease = require(glsl-easings/elastic-out)
#pragma glslify: ease2 = require(glsl-easings/bounce-out)

attribute float duration;

uniform float time;
uniform int type;
uniform float progress;
uniform int mode;
uniform float rotation;

varying vec3 vPosition;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main () {

	vPosition = position;
	
	vec3 pos = position;
	vec3 dPos = pos;

	if ( progress <= 1.0 ) {
		float p = 0.0;
		float d = (50.0 + pos.x) / 100.0;

		if ( progress < d ) {
			p = progress/d;
		}
		else {
			p = 1.0;
		}

		if ( mode == 0 ) dPos = vec3( .0 );
		else if ( mode == 1 ) dPos = vec3( dPos.x, 50.0, dPos.z );

		dPos += ( pos - dPos ) * ease( p );
	}
	else {
		float p = 0.0;
		float d = (50.0 + pos.y) / 100.0;
		float nprogress = progress - 1.0;

		if ( nprogress < d ) {
			p = nprogress/d;
			if ( mode == 1 ) p = min( 1.0, 2. * nprogress/d );
		}
		else {
			p = 1.0;
		}

		if ( mode == 0 ) {
			dPos += ( vec3( 0. ) - dPos ) * ease( p );
		}
		else if ( mode == 1 ) {
			vec3 dest = vec3( dPos.x, -50., dPos.z );

			if ( rotation != 0.0 ) {
				vec4 rdPos = vec4( dest, 0.0 ) * rotationMatrix( vec3( 0., 0., 1. ), rotation );
				dest = rdPos.xyz;
			}

			dPos += ( dest - dPos ) * ease2( p );
		}
	}

	//add some oscilation
	float amount = 2.0;
	float freq = time * 2.0 + dPos.x * .1;
	dPos.y += sin( freq ) * amount;
	dPos.x += cos( freq ) * amount;

	vec4 mvPosition = modelViewMatrix * vec4( dPos, 1.0 );

	//vWorldPos = ( modelMatrix * vec4( dPos, 1.0 ) ).xyz;

	gl_Position = projectionMatrix * mvPosition;
	//gl_Position.y += sin( time + .36 * ( gl_Position.x + gl_Position.y ) );
	//gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
}