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

function retornaZeros(numero) {
  let zeros = `${"00000000000000000000000000000000000000000000000000000000000000000".slice(
    +numero
  )}`;
  return zeros;
}

async function encontrarBitcoinsLoteria(start, start2, lmin, lmax, shouldStop) {
  let pkeyZ = 0;
  let pkeyZ2 = 0;
  let pkey = Array();
  let publicKey = Array();

  console.log("Buscando Bitcoins...");
  const executeLoop = async () => {
    // const resultado = encontrarCarteira(129);
    // const resultado = encontrarCarteira(57);

    while (!shouldStop()) {
      //console.clear();
      start++;
      start2++;
      pkeyZ = start.toString(16);
      pkeyZ2 = start2.toString(16);
      //for (let index = 0; index <= loop; index++) {

      //c0de0000000000000000000000000000000000000000000032000b5e620f481b8
      //c0de0000000000000000000000000000000000000000000032
      //00000000000000000000000000000000000000000000000000000000000000000
      // pkey[0] = `c0de0000000000000000000000000000000000000000000032${(
      //   "00000000000000" +
      //   gerarValorAleatorio("20000000000000", "ffffffffffffff")
      // ).slice(-"ffffffffffffff".length)}`;
      pkey[2] = Number(start2);
      pkey[0] =
        "c0de0000000000000000000000000000000000000000000032" +
        retornaZeros(pkeyZ2.length + 50) +
        pkeyZ2; //gerarValorAleatorio(lmin, lmax);

      pkey[1] = retornaZeros(pkeyZ.length) + pkeyZ; //gerarValorAleatorio(lmin, lmax);
      // console.log(pkey[1]);
      //exit();

      //                                                10000000000000000
      // 000000000000000000000000000000000000000000000000000038d7ea4c68430
      // 000000000000000000000000000000000000000000000000000038d7ea4c683d1
      // 00000000000000000000000000000000000000000000000000000000000000000

      publicKey[0] = generatePublic(pkey[0]);
      publicKey[1] = generatePublic(pkey[1]);
      // console.log(
      //   `Ultima chave tentada ${("00" + (index + 1)).slice(-2)} : `,
      //   pkey[index],
      //   publicKey[index]
      // );
      await validar(pkey[0], publicKey[0]);
      await validar(pkey[1], publicKey[1]);
      process.stdout.write(
        `${start}-${start2} / Buscando Public Key 1 : ${pkey[0]} - Buscando Public Key 2 : ${pkey[1]}\r`
      );

      const filePath = "keysUltima.json";
      const chaves = {
        key1: {
          key: pkey[0],
          start: Number(start),
        },
        key2: {
          start: Number(start2),
          key: pkey[1],
        },
      };
      fs.writeFileSync(filePath, JSON.stringify(chaves));
    }
    await new Promise((resolve) => setImmediate(resolve));
  };
  await executeLoop();
}

async function validar(pkey, publicKey) {
  if (walletsSet.has(publicKey)) {
    console.clear();
    console.log("Private key:", chalk.green(pkey));
    console.log("WIF:", chalk.green(generateWIF(pkey)));
    console.log("Public key:", chalk.green(publicKey));

    const filePath = "LotoEncontrada.txt";

    const lineToAppend = {
      "Private key": pkey,
      WIF: generateWIF(pkey),
      "Public Key": publicKey,
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
