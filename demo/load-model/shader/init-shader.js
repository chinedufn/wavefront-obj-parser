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

  return {
    mvMatrixUniform: gl.getUniformLocation(shaderProgram, 'uMVMatrix'),
    pMatrixUniform: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
    program: shaderProgram,
    vertexPositionAttribute: vertexPositionAttribute
  }
}
