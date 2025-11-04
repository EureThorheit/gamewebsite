uniform ivec2 chunk_pos;
uniform float zoom;
uniform sampler2D chunk_texture;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(chunk_texture, vUv);
}