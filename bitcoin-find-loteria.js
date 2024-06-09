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

  let pkey = Array();
  let publicKey = Array();

  let zeroes = new Array(65).fill("");
  for (let i = 1; i < 64; i++) {
    zeroes[i] = "0".repeat(64 - i);
  }

  console.log("Buscando Bitcoins...");

  const executeLoop = async () => {
    // const resultado = encontrarCarteira(129);
    // const resultado = encontrarCarteira(57);
    while (!shouldStop()) {

      console.clear();

      for (let index = 0; index <= id; index++) {
         pkey[index] = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
         publicKey[index] = generatePublic(pkey[index]);
         console.log(`Ultima chave tentada ${("00" + (index+1)).slice(-2)} : `, pkey[index] ,publicKey[index] );
         await validar(pkey[index] , publicKey[index]);
      }

      //exit();
      // pkey01 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey02 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey03 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey04 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey05 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey06 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey07 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey08 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey09 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;
      // pkey10 = `c0de0000000000000000000000000000000000000000000032${gerarValorAleatorio(lmin, lmax)}`;

      // let publicKey01 = generatePublic(pkey01);
      // let publicKey02 = generatePublic(pkey02);
      // let publicKey03 = generatePublic(pkey03);
      // let publicKey04 = generatePublic(pkey04);
      // let publicKey05 = generatePublic(pkey05);
      // let publicKey06 = generatePublic(pkey06);
      // let publicKey07 = generatePublic(pkey07);
      // let publicKey08 = generatePublic(pkey08);
      // let publicKey09 = generatePublic(pkey09);
      // let publicKey10 = generatePublic(pkey10);

      // console.clear();
      // // console.log("Resumo: ");
      // // console.log("Chaves buscadas: ", (key - min).toLocaleString("pt-BR"));
      // console.log("Ultima chave tentada 01 : ", pkey01);
      // console.log("Ultima chave tentada 02 : ", pkey02);
      // console.log("Ultima chave tentada 03 : ", pkey03);
      // console.log("Ultima chave tentada 04 : ", pkey04);
      // console.log("Ultima chave tentada 05 : ", pkey05);
      // console.log("Ultima chave tentada 06 : ", pkey06);
      // console.log("Ultima chave tentada 07 : ", pkey07);
      // console.log("Ultima chave tentada 08 : ", pkey08);
      // console.log("Ultima chave tentada 09 : ", pkey09);
      // console.log("Ultima chave tentada 10 : ", pkey10);

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

    }
    await new Promise((resolve) => setImmediate(resolve));
  };
  await executeLoop();
}

async function validar(pkey,publicKey) {
  
  if (walletsSet.has(publicKey)  ) {
    console.log("Private key:", chalk.green(pkey));
    console.log("WIF:", chalk.green(generateWIF(pkey)));
    console.log("Public key:", chalk.green(publicKey));

    const filePath = "LotoEncontrada.txt";

    const lineToAppend = {
      "Private key 01 " : pkey,
      "WIF": generateWIF(pkey), 
      "Public Key": publicKey
    };

    try {
      fs.appendFileSync(filePath, JSON.stringify(lineToAppend));
      console.log("Chave escrita no arquivo com sucesso.");
    } catch (err) {
      console.error("Erro ao escrever chave em arquivo:", err);
    }

    await new Promise((ok) => beep(2500));
    console.info("ACHEI!!!! 🎉🎉🎉🎉🎉");
    process.exit(0);
  //  } else {
  //   console.log("nao achou", publicKey);
   }
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
