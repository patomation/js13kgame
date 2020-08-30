const meow = require('meow')
const path = require('path')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const help = `
Usage
  $ node optimizeImages.js -d dist
Options
  --dir, -d directory with 'png or jpg' images
`

const cli = meow(help, {
  flags: {
    dir: {
      type: 'string',
      alias: 'd',
      required: true
    }
  }
})

const { dir } = cli.flags

if (dir) {
  const resolvedPath = path.resolve(__dirname, '../', dir);

  (async () => {
    const files = await imagemin([`${resolvedPath}/*.{jpg,png}`], {
      destination: resolvedPath,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    })

    console.log(files)
  })()
} else {
  throw new Error(help)
}
