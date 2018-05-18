import "./styles/app.css"
import * as utils from "./utils/webgl-utils.js"
import * as keyEvents from "./utils/key-events.js"
import { SphericalCamera } from "./utils/cameras.js"
import { glMatrix, mat4, vec3 } from "gl-matrix"
import vertexShaderSource from "./shaders/shader.vert.glsl"
import fragmentShaderSource from "./shaders/shader.frag.glsl"
import model from "./models/box.obj"
import image from "./textures/box.jpg"

window.onload = () => {

	var canvas = document.getElementById("webgl")
	var gl = canvas.getContext("webgl")
	var program = utils.loadProgram(gl, vertexShaderSource, fragmentShaderSource)

	// Setup base
	gl.clearColor(0.05, 0.05, 0.05, 1.0)
	gl.enable(gl.DEPTH_TEST)

	// Configuracion de Buffers
	utils.setVertexBuffer(gl, model.vertices)
	utils.setVertexAttribute(gl, program, "a_Position", 3)
	utils.setVertexBuffer(gl, model.vertexNormals)
	utils.setVertexAttribute(gl, program, "a_Normal", 3)
	utils.setVertexBuffer(gl, model.textures)
	utils.setVertexAttribute(gl, program, "a_Texture", 2)
	utils.setIndexBuffer(gl, model.indices)

	// Setup de Texturas
	utils.load2DTexture(gl, gl.TEXTURE0, image)

	// Setup de Iluminacion
	var pointLight = {
		position: vec3.fromValues(4, 5, 6),
		color: vec3.fromValues(1.0, 1.0, 0.8)
	}
	var ambientLight = {
		color: vec3.fromValues(0.2, 0.2, 0.2)
	}

	// Setup de Camara
	var camera = new SphericalCamera({ 
		position: {	radius: 5, theta: 45, phi: 60 },
		aspect: canvas.width / canvas.height
	})

	// Setup del Modelo
	var translation = [0, 0, 0]	// posicion inicial
	var scale = [1, 1, 1]		// factor de escapa inicial
	var rotation = 0			// rotacion inicial (en grados)
	var rotationSpeed = 9		// 9º por segundo (360/9 = 40 segundos por vuelta)

	// Inicializacion de Matrices
	var modelMatrix = mat4.create()
	var viewMatrix = camera.viewMatrix
	var projectionMatrix = camera.projectionMatrix
	var modelViewProjectionMatrix = mat4.create()
	var normalMatrix = mat4.create()

	// Ubicacion de Variables Uniformes
	var u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix")
	var u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix")
	var u_ModelViewProjectionMatrix = gl.getUniformLocation(program, "u_ModelViewProjectionMatrix")
	var u_Sampler = gl.getUniformLocation(program, "u_Sampler")
	var u_PointLightPosition = gl.getUniformLocation(program, "u_PointLightPosition")
	var u_PointLightColor = gl.getUniformLocation(program, "u_PointLightColor")
	var u_AmbientLightColor = gl.getUniformLocation(program, "u_AmbientLightColor")

	// Variables Uniformes Constantes

	gl.uniform1i(u_Sampler, 0)
	gl.uniform3fv(u_PointLightPosition, pointLight.position)
	gl.uniform3fv(u_PointLightColor, pointLight.color)
	gl.uniform3fv(u_AmbientLightColor, ambientLight.color)

	// Timing de la escena
	var frameTime = 1/60	// duracion de cada frame en segundos (para lograr 60 FPS)
	var then = 0			// tiempo del ultimo renderizado
	var timeDelta = 0		// diferencia entre ultimo tiempo de renderi zado y el actual
	var animateScene = true	// play / pause

	// Inicio del renderizado
	requestAnimationFrame(render)

	function render(now) {
		now /= 1000.0	// milisegundos -> segundos
		timeDelta = now - then
		if (timeDelta >= frameTime) {
			if (animateScene) {
				// Actualizacion de valores de la escena (no incluye a la camara)
				rotation = (rotation + rotationSpeed * timeDelta) % 360
				// Matrix de modelo
				mat4.identity(modelMatrix)
				mat4.scale(modelMatrix, modelMatrix, scale)
				mat4.rotateY(modelMatrix, modelMatrix, glMatrix.toRadian(rotation))
				mat4.translate(modelMatrix, modelMatrix, translation)
				gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix)
				// Matriz de normales
				mat4.invert(normalMatrix, modelMatrix)
				mat4.transpose(normalMatrix, normalMatrix)
				gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix)
				// Guardo tiempo de renderizado
				then = now
			}
			// Matriz MVP
			viewMatrix = camera.viewMatrix
			mat4.identity(modelViewProjectionMatrix)
			mat4.multiply(modelViewProjectionMatrix, modelMatrix, modelViewProjectionMatrix)
			mat4.multiply(modelViewProjectionMatrix, viewMatrix, modelViewProjectionMatrix)
			mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewProjectionMatrix)
			gl.uniformMatrix4fv(u_ModelViewProjectionMatrix, false, modelViewProjectionMatrix)
			// Renderizo escena
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0)
		}
		// Solicito proximo frame
		requestAnimationFrame(render)
	}

	keyEvents.addAction(["Space"], playPause)
	keyEvents.addAction(["ArrowUp"], () => { camera.moveUp() })
	keyEvents.addAction(["ArrowDown"], () => { camera.moveDown() })
	keyEvents.addAction(["ArrowRight"], () => { camera.moveRight() })
	keyEvents.addAction(["ArrowLeft"], () => { camera.moveLeft() })
	keyEvents.addAction(["ShiftLeft", "ArrowUp"], () => { camera.zoomIn() })
	keyEvents.addAction(["ShiftLeft", "ArrowDown"], () => { camera.zoomOut() })

	function playPause() {
		if (animateScene) {
			console.info("⏸ Pause")
			animateScene = false	
		} else {
			console.info("▶️ Play")
			animateScene = true
			then = performance.now() / 1000.0	// evito saltos en la escena haciendo que al retomar 'then == now' (timeDelta = 0)
			requestAnimationFrame(render)
		}
	}
}