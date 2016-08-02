var obj2json = require('../../')
var fs = require('fs')
var path = require('path')

var initShader = require('./shader/init-shader.js')

var mat4Create = require('gl-mat4/create')
var mat4Translate = require('gl-mat4/translate')
// var mat4Multiply = require('gl-mat4/multiply')

module.exports = LoadModel

// TODO: Pass in model data
// TODO: Turn into own repo
function LoadModel (gl) {
  var modelWavefront = fs.readFileSync(path.resolve(__dirname, '../../test/fixture/tree.obj')).toString()
  var modelJSON = obj2json(modelWavefront)

  var shaderObj = initShader(gl)

  var vertexPositionBuffer = gl.createBuffer()
  var vertexPositionIndexBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelJSON.vertex), gl.STATIC_DRAW)

  var vertexIndices = []

  // TODO: Less verbose
  // TODO: Only expand if face has 4 vertices
  for (var i = 0; i < modelJSON.vertexIndex.length / 4; i++) {
    vertexIndices.push(modelJSON.vertexIndex[i * 4])
    vertexIndices.push(modelJSON.vertexIndex[i * 4 + 1])
    vertexIndices.push(modelJSON.vertexIndex[i * 4 + 2])
    // If this is a face with 4 vertices we push a second triangle
    if (modelJSON.vertexIndex[i * 4 + 3] !== -1) {
      vertexIndices.push(modelJSON.vertexIndex[i * 4])
      vertexIndices.push(modelJSON.vertexIndex[i * 4 + 2])
      vertexIndices.push(modelJSON.vertexIndex[i * 4 + 3])
    }
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW)

  function draw (gl, opts) {
    var modelPosition = [2.0, -2.0, -10.0]
    var modelMatrix = mat4Create()

    mat4Translate(modelMatrix, modelMatrix, modelPosition)
    // mat4Multiply(modelMatrix, opts.viewMatrix, modelMatrix)

    gl.useProgram(shaderObj.program)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.vertexAttribPointer(shaderObj.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)

    gl.uniformMatrix4fv(shaderObj.pMatrixUniform, false, opts.pMatrix)
    gl.uniformMatrix4fv(shaderObj.mvMatrixUniform, false, modelMatrix)

    gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0)
  }

  return {draw: draw}
}
