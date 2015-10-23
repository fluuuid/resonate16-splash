#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 

varying vec2 vUv;
uniform vec2 mouse;
uniform float time;
uniform float power;
uniform float radius;
uniform float displacementPower;

#define M_PI 3.1415926535897932384626433832795
#define HALF_PI 1.5707963267948966

vec4 getPosition(vec3 oldPos, vec2 ref)
{
    vec2 delta = oldPos.xy - ref;
    vec2 deltaNormal = normalize(delta);
    float dist = length(delta);

    vec3 newPos = oldPos;

    if(dist < radius)
    {
        vec2 target = snoise3(oldPos) + (power * displacementPower) * deltaNormal;
        newPos.xy += target;
    }

    return vec4(newPos, 1.);
}

void main() {

    vUv = uv * 4.;
    vec2 ref = mouse;
    
    vec4 newPosition = getPosition(position, ref);
    vec4 mvPosition = modelViewMatrix * newPosition;
    gl_Position = projectionMatrix * mvPosition;

}