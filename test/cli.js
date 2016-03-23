var test = require('tape')

var child_process = require('child_process')
var fs = require('fs')
var path = require('path')
var stream = require('stream')

var parserCLI = path.resolve(__dirname, '../bin/obj2json.js')

var checkerCubeFixtureName = path.resolve(__dirname, './fixture/checkercube.obj')
var expectedObj = require('./expected/checkercube-expected.js')
var checkerCubeFixtureData = fs.readFileSync(checkerCubeFixtureName).toString('utf8')

test('read file name', function (t) {
  t.plan(1)
  child_process.execFile(parserCLI, [checkerCubeFixtureName], function (_, stdout) {
    t.deepEqual(expectedObj, JSON.parse(stdout))
  })
})

test('read from stdin', function (t) {
  t.plan(1)
  var parsedJSON = ''

  var wfStream = new stream.Writable()
  wfStream._write = function (chunk, encoding, next) {
    parsedJSON += chunk
    next()
  }
  wfStream.on('unpipe', function () {
    t.deepEqual(expectedObj, JSON.parse(parsedJSON))
  })

  var testStdin = child_process.spawn(parserCLI)

  testStdin.stdout.pipe(wfStream)
  testStdin.stdin.write(checkerCubeFixtureData)
  testStdin.stdin.end()
})
