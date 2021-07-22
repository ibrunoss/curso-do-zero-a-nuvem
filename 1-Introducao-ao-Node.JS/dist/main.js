"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const fatorial_1 = require("./fatorial");
console.log("n-fatorial");
console.log(`Executando o script a partir do diretório ${process.cwd()}`);
console.log("Argumentos passados na chamada", process.argv);
process.on("exit", () => console.log("script está prestes a terminar"));
const argv = yargs.demandOption("num").argv;
const num = argv.num;
console.log(`O fatorial de ${num} é igual a ${fatorial_1.fatorial(num)}`);
console.log(module.paths);
//# sourceMappingURL=main.js.map