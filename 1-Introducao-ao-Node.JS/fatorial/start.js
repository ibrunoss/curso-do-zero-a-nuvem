console.log(module.id)

const fatorial = (num) => {
  if (num === 0) {
    return 1;
  }

  return num * fatorial(num - 1);
}

//exports.fatorial = fatorial
/* 
 * Fazendo exportação da maneira acima estamos exportando todos os módulos junto 
 * com o conteúdo do arquivo pois exports é uma referencia a module.exports
 * Sendo assim para importar a fn fatorial é necessário fazer require("./fatorial").fatorial
 */

module.exports = fatorial