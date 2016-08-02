var window = require('global/window')

module.exports = InitTexture

function InitTexture (gl) {
  var modelTexture = gl.createTexture()
  var textureImage = new window.Image()
  textureImage.crossOrigin = 'anonymous'
  textureImage.onload = handleLoadedTexture.bind(null, gl, modelTexture, textureImage)
  textureImage.src = 'tree-texture.jpg'

  return modelTexture

  function handleLoadedTexture (gl, modelTexture, textureImage) {
    gl.bindTexture(gl.TEXTURE_2D, modelTexture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
