import { glMatrix, mat4 } from "gl-matrix"

export class SphericalCamera {

	constructor(
		{	// Parametros por defecto
			position = { radius: 3, theta: 45, phi: 45 },	// - radius: distancia al centro 
			fov = 45,										// - theta: angulo horizontal (desde el eje x+ -> z+)
			aspect = 1,										// - phi: angulo vertical (desde el eje y+)
			near = 0.1,	
			far = 10
		} = {}) {
			// Vista
			this._position = position
			this.target = [0, 0, 0]
			this.up = [0, 1, 0]
			// Proyeccion
			this.fov = glMatrix.toRadian(fov)
			this.aspect = aspect
			this.near = near
			this.far = far
			// Movimiento de camara
			this.verticalStep = 5
			this.horizontalStep = 5
			this.zoomStep = 0.5
			// Matrices
			this.viewMatrix = mat4.create()
			this.projectionMatrix = mat4.create()
			mat4.lookAt(this.viewMatrix, this.cartesianPosition, this.target, this.up)
			mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far)
	}

	// Setter & Getters

	set position(value) {
		Object.assign(this._position, value) // combina los atributos del primer objeto con los del segundo
		this.updateViewMatrix()				 // cualquier modificacion a la posicion implicitamente actualiza la ViewMatrix
	}

	get position() {
		return this._position
	}

	get cartesianPosition() {
		var r 	  = this.position.radius
		var theta = glMatrix.toRadian(this.position.theta)
		var phi   = glMatrix.toRadian(this.position.phi)
		var x = r * Math.sin(phi) * Math.cos(theta)
		var y = r * Math.cos(phi)
		var z = r * Math.sin(phi) * Math.sin(theta)
		return [x, y, z]
	}

	// Movimiento

	moveUp(delta = this.verticalStep) {
		var newPhi = this.limitToRange(this.position.phi - delta, 1, 180)
		this.position = { phi: newPhi }
	}

	moveDown(delta = this.verticalStep) {
		var newPhi = this.limitToRange(this.position.phi + delta, 1, 180)
		this.position = { phi: newPhi }
	}

	moveRight(delta = this.horizontalStep) {
		var newTheta = (this.position.theta - delta) % 360
		this.position = { theta: newTheta }
	}

	moveLeft(delta = this.horizontalStep) {
		var newTheta = (this.position.theta + delta) % 360
		this.position = { theta: newTheta }
	}

	zoomIn(delta = this.zoomStep) {
		var newRadius = this.limitToRange(this.position.radius - delta, this.near, this.far)
		this.position = { radius: newRadius }
	}

	zoomOut(delta = this.zoomStep) {
		var newRadius = this.limitToRange(this.position.radius + delta, this.near, this.far)
		this.position = { radius: newRadius }
	}

	// Helpers

	updateViewMatrix() {
		mat4.lookAt(this.viewMatrix, this.cartesianPosition, this.target, this.up)
	}

	limitToRange(value, min, max) {
		return Math.max(Math.min(value, max), min)
	}

}