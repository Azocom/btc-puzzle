const bs58 = require("bs58");
const decode = bs58.decode || bs58.default.decode;
const bitcoin = require("bitcoinjs-lib");

function base58ToHex(address) {
  const bytes = decode(address);
  const hex = Buffer.from(bytes).toString("hex");
  return hex;
}

function getPublicKeyHash(hex) {
  return hex.slice(2, -8);
}

const address = "1cryptoGeCRiTzVgxBQcKFFjSVydN1GW7";
const hexData = base58ToHex(address);
const publicKeyHash = getPublicKeyHash(hexData);

console.log("Hex Data:", hexData);
console.log("Public Key Hash:", publicKeyHash);

function generateCompressedPublicKey(privateKeyWIF) {
  const keyPair = bitcoin.ECPair.fromWIF(
    privateKeyWIF,
    bitcoin.networks.bitcoin
  );
  return keyPair.publicKey.toString("hex");
}

// Exemplo de chave privada WIF para gerar a chave pública comprimida
const examplePrivateKeyWIF =
  "KzFZ3Pm9MrN96bcz4yp8nft3Yup1xwYCGxjz6k1XT8arVWRNhWZn";
const compressedPublicKey = generateCompressedPublicKey(examplePrivateKeyWIF);

console.log("Compressed Public Key:", compressedPublicKey);
