import chalk from "chalk";
import { exec } from "child_process";
import CoinKey from "coinkey";
import fs from "fs";
import walletsArray from "./wallets.js";
const walletsSet = new Set(walletsArray);

function encontrarCarteira(numero) {
  const um = BigInt(1);
  let minimo, maximo;

  minimo = Math.pow(2, numero).toString(16);
  maximo = (BigInt(Math.pow(2, numero + 1)) - um).toString(16);

  return { minimo, maximo };
}

function gerarValorAleatorio(minimo, maximo) {
  const minimoDecimal = parseInt(minimo, 16);
  const maximoDecimal = parseInt(maximo, 16);
  const valorAleatorioDecimal =
    Math.floor(Math.random() * (maximoDecimal - minimoDecimal + 1)) +
    minimoDecimal;
  return valorAleatorioDecimal.toString(16);
}

async function encontrarBitcoinsLoteria(
  key,
  min,
  max,
  shouldStop,
  carteira,
  segundosAtraso,
  chaveinicial
) {
  let segundos = 0;
  let pkey = 0;
  let pkey2 = 0;
  const um = BigInt(1);
  const startTime = Date.now();
  const valorAleatorioDecimal = 0;

  let zeroes = new Array(65).fill("");
  for (let i = 1; i < 64; i++) {
    zeroes[i] = "0".repeat(64 - i);
  }

  console.log("Buscando Bitcoins...");

  const executeLoop = async () => {
    while (!shouldStop()) {
      const resultado = encontrarCarteira(55);
      const valorAleatorio = gerarValorAleatorio(
        resultado.minimo,
        resultado.maximo
      );

      pkey2 = valorAleatorio.toString(16);
      pkey = `c0de0000000000000000000000000000000000000000000032${pkey2.slice(
        0,
        -17
      )}${pkey2}`;

      // console.log(
      //   "c0de000000000000000000000000000000000000000000003200000000000000"
      // );
      // console.log(pkey.toString(16));
      // exit();

      // pkey = key.toString(16);
      // pkey = `${zeroes[pkey.length]}${pkey}`;
      let publicKey = generatePublic(pkey);

      console.clear();
      console.log("Resumo: ");
      console.log("Chaves buscadas: ", (key - min).toLocaleString("pt-BR"));
      console.log("Ultima chave tentada: ", pkey);

      if (walletsSet.has(publicKey)) {
        const tempo = (Date.now() - startTime) / segundosAtraso;
        console.log(
          "Velocidade:",
          (Number(key) - Number(min)) / tempo,
          " chaves por segundo"
        );
        console.log("Tempo:", tempo, " segundos");
        console.log("Private key:", chalk.green(pkey));
        console.log("WIF:", chalk.green(generateWIF(pkey)));
        console.log("Public key:", chalk.green(publicKey));

        const filePath = "keysloto.txt";
        const lineToAppend = `Private key: ${pkey}, WIF: ${generateWIF(
          pkey
        )}, Public Key: ${publicKey}\n`;

        try {
          fs.appendFileSync(filePath, lineToAppend);
          console.log("Chave escrita no arquivo com sucesso.");
        } catch (err) {
          console.error("Erro ao escrever chave em arquivo:", err);
        }

        await new Promise((ok) => beep());
        console.info("ACHEI!!!! 🎉🎉🎉🎉🎉");
        // throw "ACHEI!!!! 🎉🎉🎉🎉🎉";
        process.exit(0);
      }

      key++;
    }
    await new Promise((resolve) => setImmediate(resolve));
  };
  await executeLoop();
}

async function beep() {
  exec("powershell.exe [console]::beep(2000,500)");
}

function generatePublic(privateKey) {
  let _key = new CoinKey(new Buffer(privateKey, "hex"));
  _key.compressed = true;
  return _key.publicAddress;
}

function generateWIF(privateKey) {
  let _key = new CoinKey(new Buffer(privateKey, "hex"));
  return _key.privateWif;
}

export default encontrarBitcoinsLoteria;
