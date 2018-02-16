uniform vec3 getColor(ivec2 coord);
uniform float getIntensity(ivec2 coord);

void main(out color) {
    ivec2 baseCord = ivec2(gl_fragcoord) / 2 * 2;

    vec3 colorDiv = vec3(0);
    vec3 colorVal = vec3(0);
    for (int x = 0; x < 2; x++) {
        for (int y = 0; y < 2; y++) {
            ivec2 pos = baseCord + ivec2(x, y);
            vec3 color = getColor(pos);
            colorDiv += color;
            colorVal += color * getIntensity(pos);
        }
    }
    color = colorVal / colorDiv;
}