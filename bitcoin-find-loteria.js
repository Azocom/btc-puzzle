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
    
    async function encontrarBitcoinsLoteria(loop, lmin, lmax, shouldStop) {
      let pkey = Array();
      let publicKey = Array();
      
      console.log("Buscando Bitcoins...");    
  
  const executeLoop = async () => {
    // const resultado = encontrarCarteira(129);
    // const resultado = encontrarCarteira(57);
    while (!shouldStop()) {

      // console.clear();
      for (let index = 0; index <= loop; index++) {
        pkey[index] = `c0de0000000000000000000000000000000000000000000032${("00000000000000" + gerarValorAleatorio(lmin, lmax) ).slice(-lmin.length)}`;
        publicKey[index] = generatePublic(pkey[index]);
        // console.log(`Ultima chave tentada ${("00" + (index+1)).slice(-2)} : `, pkey[index] ,publicKey[index] );
        await validar(pkey[index] , publicKey[index]);
      }

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
      "Private key" : pkey,
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
   } else {
    // console.log("Buscando Bitcoins...");    
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
