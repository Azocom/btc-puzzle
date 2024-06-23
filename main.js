import axios from "axios";
import CoinKey from "coinkey";
import crypto from "crypto";
import mysql from "mysql2/promise";
import os from "os";
import walletsArray from "./wallets.js";
const walletsSet = new Set(walletsArray);

const connectSql = await mysql.createConnection({
  host: "34.95.167.202",
  user: "acesso",
  password: "CFm7m9iP[nIzR5(",
  database: "diversos",
});

const sorteioBloco = async function (hostname) {
  const result = await connectSql.query(
    "UPDATE T_Blocos SET IC_Exec = 'S', hostname = ? WHERE IC_Exec = 'N' AND  IC_Valid = 'N' ORDER BY RAND() LIMIT 1;",
    [hostname]
  );
  const result2 = await connectSql.query(
    "SELECT * FROM T_Blocos WHERE IC_Exec = 'S' AND  IC_Valid = 'N' AND hostname = ? ORDER BY RAND() LIMIT 1;",
    [hostname]
  );
  return result2;
};

const execBloco = async function (hostname) {
  const result = await connectSql.query(
    "SELECT * FROM T_Blocos WHERE IC_Exec = 'S' AND IC_Valid = 'N' AND hostname = ? LIMIT 1;",
    [hostname]
  );
  return result;
};

const acabouBloco = async function (ID_T_Blocos) {
  const result = await connectSql.query(
    "UPDATE T_Blocos SET IC_Valid = 'S' WHERE ID_T_Blocos = ?;",
    [ID_T_Blocos]
  );
  return result;
};

const checkKey = async function (publicKey) {
  console.log("blockchain");
  const result = await axios
    .get(`https://api.ssita.com.br/sendFCM.php?key=159753&msg=` + publicKey, {})
    .then(async (response) => {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

async function achou(id, chave) {
  const [rows, fields] = await connectSql.query(
    "INSERT INTO T_ACH ( ID, CH ) VALUES ( ?, ?);",
    [id, chave]
  );
}

//Bloco 587508
const hostname = os.hostname();
let sorteio;

const validExec = await execBloco(hostname);

if (validExec[0].length == 0) {
  sorteio = await sorteioBloco(hostname);
} else {
  sorteio = validExec;
}

let ID_T_Blocos = BigInt(sorteio[0][0].ID_T_Blocos);
let min = BigInt(sorteio[0][0].Inicio);
let max = BigInt(sorteio[0][0].Fim);
let total = BigInt(10000000); //BigInt(sorteio[0][0].Total);
let buscados = 0;

// min = BigInt("0x20000000000000000");
// max = BigInt("0x3ffffffffffffffff");

// min = BigInt("0x200000000000000000000000000000000");
// max = BigInt("0x3ffffffffffffffffffffffffffffffff");
// key = BigInt("0x200000000000000000000000000000000");

let zeroes = new Array(65).fill("");
for (let i = 1; i < 64; i++) {
  zeroes[i] = "0".repeat(64 - i);
}

console.log("Buscando Bloco : " + sorteio[0][0].ID_T_Blocos);

let key = generateRandomNumber(min, max);

const executeLoop = async (minx, maxx) => {
  buscados++;
  // key++;
  // let pkey = key.toString(16);
  let pkey = `${zeroes[key.length]}${key}`;
  let pk = generatePublic(pkey);
  // console.log("Buscando...", key, pk);
  process.stdout.write(`Buscando ${key} - ${buscados} Public Key : ${pk}\r`);
  if (buscados >= total) {
    console.clear();
    await acabouBloco(ID_T_Blocos);
    clearInterval(myInterval);
    const sorteio2 = await sorteioBloco();
    ID_T_Blocos = BigInt(sorteio2[0][0].ID_T_Blocos);
    min = BigInt(sorteio2[0][0].Inicio);
    max = BigInt(sorteio2[0][0].Fim);
    total = BigInt(10000000); //BigInt(sorteio2[0][0].Total);
    buscados = 0;
    await sleep(5000);
    console.log("\n\n\nBuscando Bloco : " + sorteio2[0][0].ID_T_Blocos);
    start();
  }

  if (walletsSet.has(pk)) {
    console.log("🎉🎉🎉🎉🎉", pk);
    await checkKey(key);
    clearInterval(myInterval);
    return;
  }
  key = generateRandomNumber(minx, maxx);
};

var myInterval;
function start() {
  myInterval = setInterval(async () => {
    executeLoop(min, max);
  }, 10);
}
start();

function generatePublic(privateKey) {
  let _key = new CoinKey(new Buffer.from(privateKey, "hex"));
  _key.compressed = true;
  return _key.publicAddress;
}

function generateWIF(privateKey) {
  let _key = new CoinKey(new Buffer.from(privateKey, "hex"));
  return _key.privateWif;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateRandomNumber(lowerLimit, upperLimit) {
  const range = upperLimit - lowerLimit + BigInt(1);
  const rangeBits = range.toString(2).length; // Número de bits necessários para representar o intervalo

  while (true) {
    const byteLength = Math.ceil(rangeBits / 8);
    const randomBuffer = crypto.randomBytes(byteLength);
    let randomBits = BigInt(0);
    for (let i = 0; i < randomBuffer.length; i++) {
      randomBits = (randomBits << 8n) | BigInt(randomBuffer[i]);
    }
    randomBits = randomBits & ((1n << BigInt(rangeBits)) - 1n);
    if (randomBits < range) {
      return (lowerLimit + randomBits).toString(16);
    }
  }
}
