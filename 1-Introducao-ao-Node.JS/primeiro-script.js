console.log("n-fatorial");

console.log(`Executando o script a partir do diretório ${process.cwd()}`)

console.log("Argumentos passados na chamada", process.argv)

process.on("exit", () => console.log("script está prestes a terminar"))

const num = parseInt(process.argv[2])

const fatorial = (num) => {
  if (num === 0) {
    return 1;
  }

  return num * fatorial(num - 1);
}

console.log(`O fatorial de ${num} é igual a ${fatorial(num)}`)