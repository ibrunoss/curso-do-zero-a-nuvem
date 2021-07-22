import * as fs from "fs";
import * as yargs from "yargs";

const argv: any = yargs
  .alias("f", "filename")
  .alias("c", "content")
  .demandOption("filename")
  .demandOption("content").argv;

fs.writeFile(argv.filename, argv.content, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Arquivo ${argv.filename} salvo com sucesso.`);
});
