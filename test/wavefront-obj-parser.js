var test = require('tape')
var fs = require('fs')
var path = require('path')

var objParse = require('../')

var cubeWavefrontObjString = fs.readFileSync(path.resolve(__dirname, './fixture/checkercube.obj')).toString('utf8')
var expectedCubeJSON = require('./checkercube-expected.js')

test('Parse vertex, uv, normal .obj string', function (t) {
  t.deepEqual(objParse(cubeWavefrontObjString), expectedCubeJSON)
  t.end()
})
