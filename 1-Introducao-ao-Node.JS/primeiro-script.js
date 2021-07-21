const fatorial = require("./fatorial")

console.log("n-fatorial")

console.log(`Executando o script a partir do diretório ${process.cwd()}`)

console.log("Argumentos passados na chamada", process.argv)

process.on("exit", () => console.log("script está prestes a terminar"))

const argv = require("yargs").demandOption("num").argv

const num = argv.num

console.log(`O fatorial de ${num} é igual a ${fatorial(num)}`)

console.log(module.paths)