import ecdsa
import hashlib
import base58
import winsound
import random

# Função para gerar chaves privadas a partir de números aleatórios em um intervalo
def generate_private_keys(start, end, num_keys):
    private_keys = []
    curve = ecdsa.curves.SECP256k1
    while len(private_keys) < num_keys:
        random_number = random.randint(start, end)
        private_key = ecdsa.SigningKey.from_secret_exponent(random_number, curve=curve)
        private_keys.append(private_key)
    return private_keys

# Função para calcular o Public Key Hash a partir da chave pública
def calculate_public_key_hash(public_key):
    sha256_pk = hashlib.sha256(public_key).digest()
    ripemd160_pk = hashlib.new('ripemd160', sha256_pk).digest()
    return ripemd160_pk

# Função para converter chave pública em endereço Bitcoin comprimido
def public_key_to_compressed_bitcoin_address(public_key):
    sha256_pk = hashlib.sha256(public_key).digest()
    ripemd160_pk = hashlib.new('ripemd160', sha256_pk).digest()
    
    # Prefixo 0x00 para endereços principais da rede Bitcoin (mainnet)
    network_byte = b'\x00'
    hashed_payload = network_byte + ripemd160_pk
    
    # Double SHA256 checksum
    checksum = hashlib.sha256(hashlib.sha256(hashed_payload).digest()).digest()[:4]
    
    # Concatena payload e checksum
    payload_with_checksum = hashed_payload + checksum
    
    # Codifica para Base58
    bitcoin_address = base58.b58encode(payload_with_checksum)
    return bitcoin_address.decode('utf-8')

# Função para carregar a lista destino de um arquivo
def load_destino_from_file(file_path):
    with open(file_path, 'r') as file:
        destino = [line.strip() for line in file]
    return destino

# Função para verificar se um Public Key Hash existe na lista destino
def check_if_exists(public_key_hash, public_key, destino):
    if public_key_hash in destino:
        index = destino.index(public_key_hash)
        with open('encontrado.txt', 'w') as file:
            file.write(f'Public Key Hash {public_key_hash} encontrado na posição {index} da lista destino.\n')
            file.write(f'Chave Pública correspondente: {public_key.hex()}\n')
        print(f'Public Key Hash {public_key_hash} encontrado na lista destino.')
        return True
    else:
        return False

# Função para tocar um tom (ou som) simples
def play_tone():
    frequency = 440  # Frequência do tom em Hz (440 Hz = A4)
    duration = 1000  # Duração do tom em milissegundos (1 segundo)
    winsound.Beep(frequency, duration)

# Função para calcular os Public Key Hashes e endereços Bitcoin comprimidos para um intervalo de números aleatórios dentro do range inicial e final
def calculate_and_check_compressed_public_key_hashes(start, end, destino_file):
    num_keys = end - start + 1  # Calcula o número de chaves privadas a serem geradas
    private_keys = generate_private_keys(start, end, num_keys)
    destino = load_destino_from_file(destino_file)
    
    for private_key in private_keys:
        public_key = private_key.verifying_key.to_string('compressed')
        public_key_hash = calculate_public_key_hash(public_key)
        hex_public_key_hash = public_key_hash.hex()
        bitcoin_address = public_key_to_compressed_bitcoin_address(public_key)
        
        if check_if_exists(hex_public_key_hash, public_key, destino):
            print(f'Chave Privada correspondente: {private_key.to_string().hex()}')
            print(f'Endereço Bitcoin comprimido correspondente: {bitcoin_address}')
            play_tone()  # Toca um tom quando o Public Key Hash é encontrado
            return  # Termina a execução do programa após encontrar o hash público
        else:
            print(f'Public Key Hash {hex_public_key_hash} não encontrado na lista destino.')
            print(f'Chave Privada correspondente: {private_key.to_string().hex()}')
            print(f'Endereço Bitcoin comprimido correspondente: {bitcoin_address}')
    
    print("Nenhum Public Key Hash encontrado na lista destino.")

# Função principal para execução do programa com controle do intervalo de busca
def main(start_hex, end_hex, destino_file):
    start = int(start_hex, 16)  # Converte de hexadecimal para inteiro
    end = int(end_hex, 16)      # Converte de hexadecimal para inteiro
    
    calculate_and_check_compressed_public_key_hashes(start, end, destino_file)

if __name__ == "__main__":
    start_hex = '0x20000000000000000'
    end_hex = '0x20395810624dd2f19'  # Exemplo de um intervalo grande em hexadecimal
    destino_file = 'destino.txt'
    
    main(start_hex, end_hex, destino_file)
