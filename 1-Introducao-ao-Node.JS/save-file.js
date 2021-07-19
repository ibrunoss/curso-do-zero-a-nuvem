const fs = require('fs')

const [, , path, data] = process.argv

fs.writeFile(path, data, err => {
  if (err) {
    throw err
  }

  console.log(`Arquivo ${path} salvo com sucesso.`)
})