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

async function encontrarBitcoinsLoteria(id, lmin, lmax, shouldStop) {
  let pkey01 = 0;
  let pkey02 = 0;
  let pkey03 = 0;
  let pkey04 = 0;
  let pkey05 = 0;
  let pkey06 = 0;
  let pkey07 = 0;
  let pkey08 = 0;
  let pkey09 = 0;
  let pkey10 = 0;

  let zeroes = new Array(65).fill("");
  for (let i = 1; i < 64; i++) {
    zeroes[i] = "0".repeat(64 - i);
  }

  console.log("Buscando Bitcoins...");

  const executeLoop = async () => {
    // const resultado = encontrarCarteira(129);
    // const resultado = encontrarCarteira(57);
    while (!shouldStop()) {
      pkey01 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey02 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey03 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey04 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey05 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey06 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey07 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey08 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey09 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      pkey10 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;

      let publicKey01 = generatePublic(pkey01);
      let publicKey02 = generatePublic(pkey02);
      let publicKey03 = generatePublic(pkey03);
      let publicKey04 = generatePublic(pkey04);
      let publicKey05 = generatePublic(pkey05);
      let publicKey06 = generatePublic(pkey06);
      let publicKey07 = generatePublic(pkey07);
      let publicKey08 = generatePublic(pkey08);
      let publicKey09 = generatePublic(pkey09);
      let publicKey10 = generatePublic(pkey10);

      console.clear();
      // console.log("Resumo: ");
      // console.log("Chaves buscadas: ", (key - min).toLocaleString("pt-BR"));
      console.log("Ultima chave tentada 01 : ", pkey01);
      console.log("Ultima chave tentada 02 : ", pkey02);
      console.log("Ultima chave tentada 03 : ", pkey03);
      console.log("Ultima chave tentada 04 : ", pkey04);
      console.log("Ultima chave tentada 05 : ", pkey05);
      console.log("Ultima chave tentada 06 : ", pkey06);
      console.log("Ultima chave tentada 07 : ", pkey07);
      console.log("Ultima chave tentada 08 : ", pkey08);
      console.log("Ultima chave tentada 09 : ", pkey09);
      console.log("Ultima chave tentada 10 : ", pkey10);

      // exit();
      // const filePath = "Buscadas_" + id + ".txt";
      // const lineToAppend = `Private key: ${pkey}, WIF: ${generateWIF(
      //   pkey
      // )}, Public Key: ${publicKey}\n`;
      // try {
      //   fs.appendFileSync(filePath, lineToAppend);
      // } catch (err) {
      //   console.error("Erro ao escrever chave em arquivo:", err);
      // }

      if (
        walletsSet.has(publicKey01) || 
        walletsSet.has(publicKey02) || 
        walletsSet.has(publicKey03) || 
        walletsSet.has(publicKey04) || 
        walletsSet.has(publicKey05) || 
        walletsSet.has(publicKey06) || 
        walletsSet.has(publicKey07) || 
        walletsSet.has(publicKey08) || 
        walletsSet.has(publicKey09) || 
        walletsSet.has(publicKey10) 
      ) {
        // console.log("Private key:", chalk.green(pkey01));
        // console.log("WIF:", chalk.green(generateWIF(pkey01)));
        // console.log("Public key:", chalk.green(publicKey01));

        const filePath = "LotoEncontrada.txt";

        const lineToAppend = [
          {"Private key 01 " : pkey01,"WIF": generateWIF(pkey01), "Public Key": publicKey01},
          {"Private key 02 " : pkey02,"WIF": generateWIF(pkey02), "Public Key": publicKey02},
          {"Private key 03 " : pkey03,"WIF": generateWIF(pkey03), "Public Key": publicKey03},
          {"Private key 04 " : pkey04,"WIF": generateWIF(pkey04), "Public Key": publicKey04},
          {"Private key 05 " : pkey05,"WIF": generateWIF(pkey05), "Public Key": publicKey05},
          {"Private key 06 " : pkey06,"WIF": generateWIF(pkey06), "Public Key": publicKey06},
          {"Private key 07 " : pkey07,"WIF": generateWIF(pkey07), "Public Key": publicKey07},
          {"Private key 08 " : pkey08,"WIF": generateWIF(pkey08), "Public Key": publicKey08},
          {"Private key 09 " : pkey09,"WIF": generateWIF(pkey09), "Public Key": publicKey09},
          {"Private key 10 " : pkey10,"WIF": generateWIF(pkey10), "Public Key": publicKey10}
        ]

        try {
          fs.appendFileSync(filePath, JSON.stringify(lineToAppend));
          console.log("Chave escrita no arquivo com sucesso.");
        } catch (err) {
          console.error("Erro ao escrever chave em arquivo:", err);
        }

        await new Promise((ok) => beep(2500));
        console.info("ACHEI!!!! 🎉🎉🎉🎉🎉");
        process.exit(0);
      // } else {
      //   console.log("nao achou", publicKey);
       }

    }
    await new Promise((resolve) => setImmediate(resolve));
  };
  await executeLoop();
}

async function beep(valor) {
  exec(`powershell.exe [console]::beep(2000,${valor})`);
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
