var obj2json = require('../../')
var fs = require('fs')
var path = require('path')

var initShader = require('./shader/init-shader.js')
var initTexture = require('./texture/init-texture.js')

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
  var modelTexture = initTexture(gl)

  var vertexPositionBuffer = gl.createBuffer()
  var vertexTextureBuffer = gl.createBuffer()
  var vertexPositionIndexBuffer = gl.createBuffer()

  var vertexIndices = []

  // TODO: Less verbose
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

  // Dedupe vertex indices..
  //  since we can't have multiple VBO's for texture and normals coords
  //  we have to repeat some of the data for when a vertex needs multiple UVs / normals
  // TODO: Pull into own tested module with README
  var vertexPositionIndices = []
  var vertexUVs = []
  var encounteredIndices = {}
  var largestPositionIndex = 0
  vertexIndices.forEach(function (vertexIndex, counter) {
    largestPositionIndex = Math.max(largestPositionIndex, vertexIndex)
    // If this is our first time seeing the vertex index we add it
    // Later we'll add all of the duplicate indices into the end of the array
    if (!encounteredIndices[vertexIndex]) {
      vertexPositionIndices[counter] = vertexIndex
      // Push the appropriate UV coordinates
      for (var i = 0; i < 2; i++) {
        vertexUVs[vertexIndex * 2 + i] = modelJSON.uv[modelJSON.uvIndex[counter] * 2 + i]
      }
      encounteredIndices[vertexIndex] = true
    }
  })
  vertexIndices.forEach(function (vertexIndex, counter) {
    // Add all of the duplicate indices that we skipped over above
    if (encounteredIndices[vertexIndex]) {
      vertexPositionIndices[counter] = ++largestPositionIndex
      for (var i = 0; i < 3; i++) {
        if (i < 2) {
          vertexUVs[largestPositionIndex * 2 + i] = modelJSON.uv[modelJSON.uvIndex[counter] * 2 + i]
        }
        modelJSON.vertex[largestPositionIndex * 3 + i] = modelJSON.vertex[vertexIndex * 3 + i]
      }
    }
  })

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelJSON.vertex), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexUVs), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexPositionIndices), gl.STATIC_DRAW)

  function draw (gl, opts) {
    var modelPosition = [2.0, -2.0, -10.0]
    var modelMatrix = mat4Create()

    mat4Translate(modelMatrix, modelMatrix, modelPosition)
    // mat4Multiply(modelMatrix, opts.viewMatrix, modelMatrix)

    gl.useProgram(shaderObj.program)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.vertexAttribPointer(shaderObj.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureBuffer)
    gl.vertexAttribPointer(shaderObj.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, modelTexture)
    gl.uniform1i(shaderObj.samplerUniform, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)

    gl.uniformMatrix4fv(shaderObj.pMatrixUniform, false, opts.pMatrix)
    gl.uniformMatrix4fv(shaderObj.mvMatrixUniform, false, modelMatrix)

    gl.drawElements(gl.TRIANGLES, vertexPositionIndices.length, gl.UNSIGNED_SHORT, 0)
  }

  return {draw: draw}
}
