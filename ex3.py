import hashlib
import base58
from ecdsa import SigningKey, SECP256k1

def private_key_to_address(private_key_hex, compressed=False):
    # Convertendo a chave privada de hexadecimal para bytes
    private_key_bytes = bytes.fromhex(private_key_hex)
    
    # Gerando a chave privada a partir do bytes
    signing_key = SigningKey.from_string(private_key_bytes, curve=SECP256k1)
    
    # Gerando a chave pública não comprimida
    verifying_key = signing_key.verifying_key
    public_key_bytes = verifying_key.to_string("uncompressed")
    
    # Se for comprimida, ajustar a chave pública
    if compressed:
        # Obtendo a chave pública comprimida
        public_key_bytes = verifying_key.to_string("compressed")
    
    # Usando SHA-256 na chave pública
    sha256_hash = hashlib.sha256(public_key_bytes).digest()
    
    # Usando RIPEMD-160 no resultado do SHA-256
    ripemd160_hash = hashlib.new('ripemd160', sha256_hash).digest()
    
    # Prefixo 0x00 para endereços principais da rede Bitcoin (mainnet)
    network_byte = b'\x00'
    
    # Criando o payload para o endereço Bitcoin (network_byte + ripemd160_hash)
    payload = network_byte + ripemd160_hash
    
    # Double SHA256 checksum
    checksum = hashlib.sha256(hashlib.sha256(payload).digest()).digest()[:4]
    
    # Concatenando payload e checksum
    payload_with_checksum = payload + checksum
    
    # Codificando para Base58 para obter o endereço Bitcoin
    bitcoin_address = base58.b58encode(payload_with_checksum)
    
    return bitcoin_address.decode('utf-8')

# Exemplo de uso com a chave privada específica 0000000000000000000000000000000000000000000000000000000000000001
private_key_hex = '0000000000000000000000000000000000000000000000000000000000000001'

# Gerar endereço Bitcoin não comprimido
bitcoin_address_uncompressed = private_key_to_address(private_key_hex, compressed=False)
print(f'Chave Privada: {private_key_hex}')
print(f'Endereço Bitcoin não comprimido: {bitcoin_address_uncompressed}')

# Gerar endereço Bitcoin comprimido
bitcoin_address_compressed = private_key_to_address(private_key_hex, compressed=True)
print(f'Endereço Bitcoin comprimido: {bitcoin_address_compressed}')
