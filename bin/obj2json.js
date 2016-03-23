#!/usr/bin/env node

var obj2json = require('../')
var fs = require('fs')
var path = require('path')

var filename = process.argv[2]
// If a filename was specified, read it and write to stdout
if (filename) {
  var wavefrontString = fs.readFileSync(path.resolve(process.cwd(), filename)).toString('utf8')
  console.log(JSON.stringify(obj2json(wavefrontString)))
}

// If no filename was specified, read from stdin and write to stdout
if (!filename) {
  var bufferedWavefrontString = ''
  process.stdin.on('data', function (chunk) {
    bufferedWavefrontString += chunk
  })
  process.stdin.on('end', function () {
    console.log(JSON.stringify(obj2json(bufferedWavefrontString.toString('utf8'))))
  })
}
