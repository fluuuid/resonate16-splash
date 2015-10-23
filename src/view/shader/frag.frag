uniform vec3 color;
varying vec2 vUv;
uniform int showTexture;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

vec4 toRGB(vec3 rgb){ return vec4(rgb/ 255., 1.); }

uniform vec4 gradientsLeft;
uniform vec4 gradientsRight;

void main() {

    if(showTexture == 1)
    {
        vec2 pt = vUv.xy - .5;
        vec2 position = (gl_FragCoord.xy / resolution.xy);
        gl_FragColor = vec4(mix(gradientsLeft, gradientsRight, pt.x));

    } else {
        gl_FragColor = vec4(color, 1.);
    }
}