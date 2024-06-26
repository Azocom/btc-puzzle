import { randomBytes as _randomBytes } from "crypto";

// Definindo os limites inferior e superior do intervalo
const lowerLimit = BigInt("0x2000000000000000");
const upperLimit = BigInt("0x3FFFFFFFFFFFFFFFF");

// Função para gerar um número aleatório no intervalo especificado
function getRandomHexInRange(lowerLimit, upperLimit) {
  const range = upperLimit - lowerLimit;
  const bytesNeeded = Math.ceil(range.toString(2).length / 8);
  let randomBigInt;

  do {
    const randomBytes = _randomBytes(bytesNeeded);
    randomBigInt = BigInt("0x" + randomBytes.toString("hex"));
  } while (randomBigInt > range);

  return (lowerLimit + randomBigInt).toString(16);
}

// Gerando o número aleatório
const randomHex = getRandomHexInRange(lowerLimit, upperLimit);
console.log(`0x${randomHex}`);
