const meow = require('meow')
var fs = require('fs')
var archiver = require('archiver')
const path = require('path')

const help = `
Usage
  $ node zip.js -d dist -n myZipName
Options
  --dir, -d source directory
  --name, -n output name. note .zip will be added to name
`

const cli = meow(help, {
  flags: {
    dir: {
      type: 'string',
      alias: 'd',
      required: true
    },
    name: {
      type: 'string',
      alias: 'n'
    }
  }
})

const { dir, name } = cli.flags

const output = fs.createWriteStream(path.join(__dirname, '../', `/${name}.zip`))
var archive = archiver('zip', {
  zlib: { level: 9 } // compression level
})

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes')
  console.log('archiver has been finalized and the output file descriptor has closed.')
})

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function () {
  console.log('Data has been drained')
})

archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err
  }
})

archive.on('error', function (err) {
  throw err
})

archive.pipe(output)

archive.directory(path.join(__dirname, '../', dir), false)
archive.finalize()
