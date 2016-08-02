var test = require('tape')
var fs = require('fs')
var path = require('path')

var objParse = require('../')

var cubeWavefrontObjString = fs.readFileSync(path.resolve(__dirname, './fixture/checkercube.obj')).toString()
var expectedCubeJSON = require('./expected/checkercube-expected.js')

// TODO: Replace this with a much smaller object that has triangle faces
//  this test fixture is unnecessarily large
var treeObjString = fs.readFileSync(path.resolve(__dirname, './fixture/tree.obj')).toString()
var expectedTreeJSON = require('./expected/tree-expected.json')

test('Parse vertex, uv, normal .obj string', function (t) {
  t.plan(1)
  t.deepEqual(objParse(cubeWavefrontObjString), expectedCubeJSON)
})

test('Parse file where some faces are triangles with only 3 values', function (t) {
  t.plan(1)
  t.deepEqual(objParse(treeObjString), expectedTreeJSON)
})
