import hashlib

# Função para calcular PublicKeyHash (Hash160)
def hash160(public_key):
    sha256 = hashlib.sha256(public_key).digest()
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(sha256)
    return ripemd160.digest()

# Chave privada correspondente ao PublicKeyHash fornecido
private_key_hex = '000000000000000000000000000000000000000000000001a838b13505b26867'

# Converter chave privada para bytes
private_key_bytes = bytes.fromhex(private_key_hex)

# Gerar chave pública a partir da chave privada
# Você pode usar alguma biblioteca de Bitcoin para fazer isso corretamente
# Aqui, para simplificar, vamos calcular a chave pública sem compressão
# Consulte a documentação da biblioteca bitcoinlib ou outra biblioteca para fazer isso corretamente
from ecdsa import SigningKey, SECP256k1

sk = SigningKey.from_string(private_key_bytes, curve=SECP256k1)
vk = sk.verifying_key
public_key = b'\04' + vk.to_string()

# Calcular PublicKeyHash (Hash160) da chave pública
public_key_hash = hash160(public_key)

# Converter PublicKeyHash para formato hexadecimal
public_key_hash_hex = '0x' + public_key_hash.hex()

# Blocos gerados anteriormente
blocks = [
    ('0x10000000000000000', '0x1ffffffffffffffff'),
    ('0x3fffffffffffffff', '0x5fffffffffffffffe'),
    ('0x5fffffffffffffff', '0x7fffffffffffffffe'),
    ('0x7fffffffffffffff', '0x9fffffffffffffffe'),
    ('0x9fffffffffffffff', '0x1ffffffffffffffff')
]

# Converter PublicKeyHash para inteiro para comparar com os blocos gerados
public_key_hash_int = int(public_key_hash_hex, 16)
print(public_key_hash_int)

# Verificar em qual bloco o PublicKeyHash está localizado
for idx, (block_start_hex, block_end_hex) in enumerate(blocks):
    block_start_int = int(block_start_hex, 16)
    block_end_int = int(block_end_hex, 16)
    
    if block_start_int <= public_key_hash_int <= block_end_int:
        print(f'A chave privada está no bloco {idx+1}: de {block_start_hex} até {block_end_hex}')
        break
