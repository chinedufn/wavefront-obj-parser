var fs = require('fs')
var path = require('path')
var fragment = fs.readFileSync(path.join(__dirname, '/fragment.glsl')).toString()
var vertex = fs.readFileSync(path.join(__dirname, '/vertex.glsl')).toString()

module.exports = InitShader

function InitShader (gl) {
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  var vertexShader = gl.createShader(gl.VERTEX_SHADER)

  gl.shaderSource(fragmentShader, fragment)
  gl.compileShader(fragmentShader)

  gl.shaderSource(vertexShader, vertex)
  gl.compileShader(vertexShader)

  var shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, fragmentShader)
  gl.attachShader(shaderProgram, vertexShader)
  gl.linkProgram(shaderProgram)

  var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  gl.enableVertexAttribArray(vertexPositionAttribute)

  var vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal')
  gl.enableVertexAttribArray(vertexNormalAttribute)

  var textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord')
  gl.enableVertexAttribArray(textureCoordAttribute)

  return {
    ambientColorUniform: gl.getUniformLocation(shaderProgram, 'uAmbientColor'),
    directionalColorUniform: gl.getUniformLocation(shaderProgram, 'uDirectionalColor'),
    lightingDirectionUniform: gl.getUniformLocation(shaderProgram, 'uLightingDirection'),
    mvMatrixUniform: gl.getUniformLocation(shaderProgram, 'uMVMatrix'),
    nMatrixUniform: gl.getUniformLocation(shaderProgram, 'uNMatrix'),
    pMatrixUniform: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    program: shaderProgram,
    samplerUniform: gl.getUniformLocation(shaderProgram, 'uSampler'),
    textureCoordAttribute: textureCoordAttribute,
    vertexPositionAttribute: vertexPositionAttribute,
    vertexNormalAttribute: vertexNormalAttribute
  }
}
