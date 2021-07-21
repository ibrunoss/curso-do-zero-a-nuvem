const fs = require('fs')

const {
  filename,
  content
} = require("yargs")
  .alias("f", "filename")
  .alias("c", "content")
  .demandOption("filename")
  .demandOption("content")
  .argv

fs.writeFile(filename, content, err => {
  if (err) {
    throw err
  }

  console.log(`Arquivo ${filename} salvo com sucesso.`)
})