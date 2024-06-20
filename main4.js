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

// min = BigInt("0x200000000000000000000000000000000");
// max = BigInt("0x3ffffffffffffffffffffffffffffffff");
// key = BigInt("0x200000000000000000000000000000000");

encontrarBitcoins(key, key, min, max, () => shouldStop);

async function encontrarBitcoins(
  key,
  key2,
  min,
  max,
  shouldStop,
  rand = 0,
  rand2 = 10
) {
  let segundos = 0;
  let pkey = 0;
  let pkey2 = 0;
  let um = 0;
  let um2 = 0;
  if (rand === 0) {
    um = BigInt(1);
  } else {
    um = BigInt(rand);
  }
  if (rand2 === 0) {
    um2 = BigInt(1);
  } else {
    um2 = rand2;
  }

  const startTime = Date.now();

  let zeroes = new Array(65).fill("");
  for (let i = 1; i < 64; i++) {
    zeroes[i] = "0".repeat(64 - i);
  }

  console.log("Buscando Bitcoins...");

  key = generateRandomNumber(min, max);
  // key2 = generateRandomNumber(min, max);
  // console.log(`${zeroes[key.length]}${key}`);

  // exit();
  const executeLoop = async () => {
    console.clear();
    while (!shouldStop()) {
      // key2 += um2;
      // pkey = key.toString(16);
      pkey = `${zeroes[key.length]}${key}`;
      // pkey2 = `${zeroes[key2.length]}${key2}`;

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

      // if (key >= max) {
      //   key = min;
      // }
      //   }
      // }
      let publicKey = generatePublic(pkey);
      // let publicKey2 = generatePublic(pkey2);

      key = generateRandomNumber(min, max); // randomBytes = 16 = Puzze 130
      // key2 = generateRandomNumber(min, max); // randomBytes = 16 = Puzze 130

      // process.stdout.write(
      //   `Buscando Public Key : ${pkey} - ${publicKey} / ${pkey2} - ${publicKey2}\r`
      // );
      process.stdout.write(`Buscando Public Key : ${publicKey}\r`);
      // console.log(pkey, publicKey, pkey2, publicKey2);

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

      await sleep(20);
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

function generateRandomNumber(lowerLimit, upperLimit, randomBytes = 8) {
  // Definindo os limites
  // const lowerLimit = BigInt('0x100000000000000000');
  // const upperLimit = BigInt('0x1fffffffffffffffff');

  // Gera 64 bits aleatórios
  const randomBuffer = crypto.randomBytes(randomBytes);
  let randomBits = BigInt("0x" + randomBuffer.toString("hex"));

  // Calcula o número aleatório dentro do intervalo
  let randomNumber = lowerLimit + randomBits;

  // Certifique-se de que o número está dentro do limite superior
  if (randomNumber > upperLimit) {
    randomNumber = upperLimit;
  }

  return randomNumber.toString(16);
}

export default encontrarBitcoins;
