wavefront-obj-parser [![npm version](https://badge.fury.io/js/wavefront-obj-parser.svg)](http://badge.fury.io/js/wavefront-obj-parser) [![Build Status](https://travis-ci.org/chinedufn/wavefront-obj-parser.svg?branch=master)](https://travis-ci.org/chinedufn/wavefront-obj-parser)
====================

> An `api` and `cli` for parsing [wavefront .obj files](https://en.wikipedia.org/wiki/Wavefront_.obj_file) into JSON

[View live demo](http://chinedufn.github.io/wavefront-obj-parser/)

[View demo source](/demo)

## To Install

```
$ npm install --save wavefront-obj-parser
```

## Running the demo locally

```sh
# Changes to the `src` and `demo` directories will live reload in your browser
$ npm run demo
```

## CLI

The CLI will output stringified JSON to stdout

```sh
# parse from stdin
cat my-3d-model.obj | obj2json > my-3d-model.json

# parse from file
obj2json my-3d-model.obj > my-3d-model.json
```

## API

```js
var parseWFObj = require('wavefront-obj-parser')
var wavefrontString = fs.readFileSync('./my-3d-model.obj').toString('utf8')
var parsedJSON = parseWFObj(wavefrontString)
```

### `parseWFObj(wavefrontString)` -> `object`

#### wavefrontString

*Required*

Type: `string`

A wavefront .obj in string format


### Returned Object

The returned JSON object has the following one dimensional array properties:

```js
var returnedObject = {
  // Parsed from `vn` lines
  vertexNormals: [...],
  // Parsed from `vt` lines
  vertexUVs: [...],
  // Parsed from `v` lines
  vertexPositions: [...],
  // These come from the `f` face lines
  vertexNormalIndices: [...],
  vertexUVIndices: [...],
  vertexPositionIndices: [...]
}
```

If you plan to use normals or UVs you'll want to run the data through something like [expand-vertex-data](https://github.com/chinedufn/expand-vertex-data).

This unwraps your data from being indexed across multiple properties (vertices, normals, uvs) to only being indexed based on vertices. You can only have one
`ELEMENT_ARRAY_BUFFER` in WebGL so you can't make use of multiple indices.

## TODO:

- Handle files with missing values (i.e. no textures and normals)
- If memory ever becomes an issue, allow line by line parsing by reading stream chunks and checking for `\n`

## See Also

- [collada-dae-parser](https://github.com/chinedufn/collada-dae-parser)
- [image-to-heightmap](https://github.com/chinedufn/image-to-heightmap)

## License

MIT
