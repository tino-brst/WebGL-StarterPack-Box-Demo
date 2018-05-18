precision mediump float;

uniform sampler2D u_Sampler;
uniform vec3 u_PointLightPosition;
uniform vec3 u_PointLightColor;
uniform vec3 u_AmbientLightColor;

varying vec4 v_Position;
varying vec3 v_Normal;
varying vec2 v_Texture;

void main() {
	vec3 normal = v_Normal;
	vec3 lightDirection = normalize(u_PointLightPosition - v_Position.xyz);
	float LdotN = max(dot(lightDirection, normal), 0.0);
	vec3 materialColor = texture2D(u_Sampler, v_Texture).rgb;
	vec3 diffuseColor = materialColor * u_PointLightColor * LdotN;
	vec3 ambientColor = materialColor * u_AmbientLightColor;
	gl_FragColor = vec4(diffuseColor + ambientColor, 1.0);
}