import chalk from "chalk";
import { exec } from "child_process";
import CoinKey from "coinkey";
import fs from "fs";
import walletsArray from "./wallets.js";
const walletsSet = new Set(walletsArray);

async function encontrarBitcoins(
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
      pkey = key.toString(16);
      pkey = `${zeroes[pkey.length]}${pkey}`;
      let publicKey = generatePublic(pkey);

      if (Date.now() - startTime > segundos) {
        segundos += segundosAtraso;
        // console.log(segundos / segundosAtraso, publicKey);
        if (segundos % 10 == 0) {
          const tempo = (Date.now() - startTime) / segundosAtraso;
          console.clear();
          console.log("Resumo: ");
          console.log(
            "Velocidade:",
            Number(key) - Number(min) / tempo,
            " chaves por segundo"
          );
          console.log("Chaves buscadas: ", (key - min).toLocaleString("pt-BR"));
          console.log("Ultima chave tentada: ", pkey);

          const filePath = "chave.json"; // File path to write to
          const content = {
            carteira: carteira,
            segundosAtraso: segundosAtraso,
            chaveinicial: chaveinicial.replace("0x", ""),
            chave: pkey.toString(16),
          };
          const publicKeyZ = {
            chave: pkey,
            publicKey: publicKey,
          };
          try {
            fs.writeFileSync(filePath, JSON.stringify(content), "utf8");
            // fs.appendFileSync(
            //   "keys.json",
            //   JSON.stringify(publicKeyZ) + ",",
            //   "utf8"
            // );
          } catch (err) {
            console.error("Error writing to file:", err);
          }
        }
      }

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

        const filePath = "keys.txt";
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

export default encontrarBitcoins;
