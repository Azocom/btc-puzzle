import chalk from "chalk";
import encontrarBitcoinsLoteria from "./bitcoin-find-loteria.js";
import encontrarBitcoins from "./bitcoin-find.js";
import ultimaChave from "./chave.json" assert { type: "json" };
import keysUltima from "./keysUltima.json" assert { type: "json" };
import ranges from "./ranges.js";

let key,
  key2,
  min,
  max = 0;
let shouldStop = false;
let modo = "L";

console.clear();

if (modo == "E") {
  console.log("Ultima Chave tentada : ", chalk.cyan(ultimaChave.chave));
  console.log(
    "Iniciando com Chave  : ",
    chalk.yellow(ultimaChave.chave.slice(0, -1))
  );

  let carteira = ultimaChave.carteira;
  let answer3 = "0x" + ultimaChave.chave; //.slice(0, -1);
  let chaveinicial = "0x" + ultimaChave.chaveinicial; //.slice(0, -2);
  let segundosAtraso = ultimaChave.segundosAtraso;

  // min = ranges[carteira - 1].min;
  max = ranges[carteira - 1].max;
  console.log(
    "Carteira escolhida: ",
    chalk.cyan(carteira),
    " Min: ",
    chalk.yellow(answer3),
    " Max: ",
    chalk.yellow(max)
  );

  console.log(
    "Numero possivel de chaves:",
    chalk.yellow(
      parseInt(BigInt(max) - BigInt(answer3)).toLocaleString("pt-BR")
    )
  );

  min = BigInt(answer3);
  key = BigInt(min);

  encontrarBitcoins(
    key,
    min,
    max,
    () => shouldStop,
    carteira,
    segundosAtraso,
    chaveinicial
  );
} else {
  try {
    encontrarBitcoinsLoteria(
      BigInt(keysUltima.key1.start),
      BigInt(keysUltima.key2.start),
      () => shouldStop
    );
  } catch (err) {
    console.error("Erro:", err);
  }
}
