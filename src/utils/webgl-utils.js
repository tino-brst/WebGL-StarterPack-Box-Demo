export function loadProgram(gl, vertexShaderSource, fragmentShaderSource) {
	var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
	var program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	gl.useProgram(program)
	return program
}

function loadShader(gl, type, sourceCode) {
	var shader = gl.createShader(type)
	gl.shaderSource(shader, sourceCode)
	gl.compileShader(shader)
	return shader
}

export function setVertexBuffer(gl, vertices) {
	var vertexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}

export function setIndexBuffer(gl, indices) {
	var indexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
}

export function setVertexAttribute(gl, program, name, elementsCount) {
	var attributeLocation = gl.getAttribLocation(program, name)
	gl.vertexAttribPointer(attributeLocation, elementsCount, gl.FLOAT, false, 0, 0)	
	gl.enableVertexAttribArray(attributeLocation)
}

export function load2DTexture(gl, textureUnit, imageUrl, callback = noop) {
	var image = loadImage(imageUrl, () => {
		// Texture Object <- Image
		var texture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
		// Texture Unit <- Texture Object
		gl.activeTexture(textureUnit)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		// Callback
		callback()
	})
}

export function loadImage(url, callback) {
	var image = new Image()
	image.onload = callback
	image.src = url
	return image
}

function noop() {}