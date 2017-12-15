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

test('Handle whitespace inside a single line', function (t) {
  var testString = 'v  0.1 0.2 0.3\nv  0.2 0.1 0.3\n'
  var expectedJSON = {
    vertexNormals: [],
    vertexUVs: [],
    vertexPositions: [0.1, 0.2, 0.3, 0.2, 0.1, 0.3],
    vertexNormalIndices: [],
    vertexUVIndices: [],
    vertexPositionIndices: []
  }

  t.plan(1)
  t.deepEqual(objParse(testString), expectedJSON)
})

test('Handle trailing line whitespace', function (t) {
  var testString = 'v 0.1 0.2 0.3 \n v 0.2 0.1 0.3 \n '
  var expectedJSON = {
    vertexNormals: [],
    vertexUVs: [],
    vertexPositions: [0.1, 0.2, 0.3, 0.2, 0.1, 0.3],
    vertexNormalIndices: [],
    vertexUVIndices: [],
    vertexPositionIndices: []
  }

  t.plan(1)
  t.deepEqual(objParse(testString), expectedJSON)
})
