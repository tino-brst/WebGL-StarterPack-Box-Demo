uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;
uniform mat4 u_ModelViewProjectionMatrix;

attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec2 a_Texture;

varying vec4 v_Position;
varying vec3 v_Normal;
varying vec2 v_Texture;

void main() {
	v_Texture = a_Texture;
	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
	v_Position = u_ModelMatrix * a_Position;
	gl_Position = u_ModelViewProjectionMatrix * a_Position;
}