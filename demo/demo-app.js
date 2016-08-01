var loop = require('raf-loop')
var render = require('./render/render.js')
var SS = require('solid-state')
var loadModel = require('./load-model/load-model.js')
var window = require('global/window')

module.exports = DemoApp

function DemoApp () {
  var AppState = new SS({
    viewport: {
      height: window.innerHeight,
      width: window.innerWidth
    }
  })

  var canvas = document.createElement('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  var gl = canvas.getContext('webgl')
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST)

  var model = loadModel(gl)

  loop(function (dt) {
    // animate(dt)
    render(gl, AppState.get(), model)
  }).start()

  return { element: canvas }
}
