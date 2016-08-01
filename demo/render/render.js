var mat4Perspective = require('gl-mat4/perspective')

module.exports = render

function render (gl, state, model) {
  gl.viewport(0, 0, state.viewport.width, state.viewport.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  var pMatrix = mat4Perspective([], Math.PI / 4, state.viewport.width / state.viewport.height, 0.1, 100.0)
  model.draw(gl, {
    pMatrix: pMatrix,
    viewMatrix: require('gl-mat4/create')()
  })
}
