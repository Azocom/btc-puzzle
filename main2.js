import chalk from "chalk";
import { exec } from "child_process";
import CoinKey from "coinkey";
import crypto from "crypto";
import fs from "fs";
import mysql from "mysql2/promise";
import walletsArray from "./wallets.js";
import walletsArray2 from "./wallets2.js";
const walletsSet = new Set(walletsArray);
const walletsSet2 = new Set(walletsArray2);

const connectSql = await mysql.createConnection({
  host: "34.95.167.202",
  user: "acesso",
  password: "CFm7m9iP[nIzR5(",
  database: "diversos",
});

async function startSql(id) {
  const [rows, fields] = await connectSql.query(
    "SELECT * FROM `T_Diversos` WHERE `ID_T_Diversos` = ?;",
    [id]
  );
  return rows;
}

async function atualiza(num, num2, id) {
  const [rows, fields] = await connectSql.query(
    "UPDATE `T_Diversos` SET `Key1` = ?, `Key2` = ? WHERE `ID_T_Diversos` = ?;",
    [num, num2, id]
  );
}

async function achou(id, chave) {
  const [rows, fields] = await connectSql.query(
    "INSERT INTO T_ACH ( ID, CH ) VALUES ( ?, ?);",
    [id, chave]
  );
}

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

function retornaMaximo(minimo, maximo) {
  const minimoDecimal = parseInt(minimo, 16);
  const maximoDecimal = parseInt(maximo, 16);
  const valorDecimal = maximoDecimal - minimoDecimal + minimoDecimal;
  return valorDecimal;
}

function getRandomBigInt(min, max) {
  if (min >= max) {
    throw new Error("min should be less than max");
  }

  // Calculate the range
  const range = max - min;

  // Generate a random BigInt within the range
  const randomBigIntInRange =
    BigInt(`0x${crypto.randomBytes(32).toString("hex")}`) % range;

  // Add the minimum value to get a number within the desired range
  const randomBigInt = min + randomBigIntInRange;

  return randomBigInt;
}
function retornaZeros(numero) {
  let zeros = `${"00000000000000000000000000000000000000000000000000000000000000000".slice(
    +numero
  )}`;
  return zeros;
}

// exit();
console.clear();
// async function encontrarBitcoinsLoteria(
//   idDispositivo,
//   start, 1000000000075029
//   start2,100000000000049660
//   end,
//   end2,
//   shouldStop
// ) {

const args = process.argv.slice(2);

let idDispositivo = args[0] ?? 1;

let sqlQuery = await startSql(idDispositivo);

// console.log("...", sqlQuery[0].Key1);
// console.log("...", sqlQuery[0]);
// exit();
let shouldStop = false;

let pfx = sqlQuery[0].PFX;

let start = BigInt(sqlQuery[0].Key1);

let startX = BigInt(sqlQuery[0].Key1);
let start2 = BigInt(sqlQuery[0].Key2);

let pkeyZ = 0;
let pkeyZ2 = 0;
let pkeyL = 0;

let limiteSql = 0;
// let pkeyL2 = retornaMaximo(start2, end2);
// let pkeyL22 = retornaMaximo(start2, end2);
let pkey = Array();
let publicKey = Array();
const startTime = Date.now();
const zeroes = Array.from({ length: 65 }, (_, i) => "0".repeat(64 - i));
let segundos = 0;
// pkeyL2 = retornaMaximo(start2, end2);
// console.log("Buscando Bitcoins...", end2);

// console.log("Buscando Bitcoins...");
// const executeLoop = async () => {
// const resultado = encontrarCarteira(129);
// const resultado = encontrarCarteira(57);

while (!shouldStop) {
  // limiteSql++;

  start++;
  pkeyZ = getRandomBigInt(start, start2); //start.toString(16);
  //pkeyZ = start.toString(16);

  console.log(start);
  console.log(pkeyZ);
  exit();

  // start2++;
  // pkeyZ2 = start2.toString(16);

  //0xC0DE000000000000000000000000000000000000000000003270000000000000
  //0xC0DE00000000000000000000000000000000000000000000327fffffffffffff
  //0xc0de000000000000000000000000000000000000000000003270000000000001
  //3270000000000000
  //b9e0c346a6001

  pkey[0] = pkeyZ; //`${zeroes[pkeyZ.length]}${pkeyZ}`; //pfx + zeroes(pkeyZ.length) + pkeyZ; //gerarValorAleatorio(lmin, lmax);
  // pkey[1] = retornaZeros(pkeyZ.length) + pkeyZ; //gerarValorAleatorio(lmin, lmax);
  publicKey[0] = generatePublic(pkey[0]);

  // publicKey[1] = generatePublic(pkey[1]);
  await validar2(pkey[0], publicKey[0]);
  // await validar(pkey[1], publicKey[1]);

  process.stdout.write(`Buscando Public Key : ${pkey[0]} - ${publicKey[0]}\r`);

  if (Date.now() - startTime > segundos) {
    segundos += 1000;
    if (segundos % 10000 === 0) {
      const tempo = (Date.now() - startTime) / 1000;
      console.clear();
      console.log("Resumo: ");
      console.log(
        "Velocidade:",
        (Number(start) - Number(startX)) / tempo,
        " chaves por segundo"
      );
      console.log(
        "Chaves buscadas: ",
        (start - startX).toLocaleString("pt-BR")
      );
      console.log("Ultima chave tentada: ", pkey[0]);
      // await atualiza(Number(start), Number(start2), idDispositivo);
      // limiteSql = 0;
      // const filePath = "keysUltima.json";
      // const chaves = {
      //   key1: {
      //     key: pkey[0],
      //     start: Number(start),
      //   },
      //   key2: {
      //     start: Number(start2),
      //     key: pkey[1],
      //   },
      // };
      // fs.writeFileSync(filePath, JSON.stringify(chaves));
    }
  }
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

async function validar2(pkey, publicKey) {
  if (walletsSet2.has(publicKey)) {
    console.clear();
    console.log("Private key:", chalk.green(pkey));
    console.log("WIF:", chalk.green(generateWIF(pkey)));
    console.log("Public key:", chalk.green(publicKey));

    const filePath = "LotoEncontrada2.txt";

    const lineToAppend = {
      "Private key": pkey,
      WIF: generateWIF(pkey),
      "Public Key": publicKey,
    };

    await achou(idDispositivo, JSON.stringify(lineToAppend));

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
  let _key = new CoinKey(Buffer.from(privateKey, "hex"));
  _key.compressed = true;
  return _key.publicAddress;
}

function generateWIF(privateKey) {
  let _key = new CoinKey(Buffer.from(privateKey, "hex"));
  return _key.privateWif;
}

// export default encontrarBitcoinsLoteria;
