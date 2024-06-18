import random
import hashlib
import base58

def generate_private_key():
    return random.randint(lower_bound, upper_bound)

def private_key_to_wif(private_key_hex):
    extended_key = '80' + private_key_hex
    first_sha256 = hashlib.sha256(bytes.fromhex(extended_key)).hexdigest()
    second_sha256 = hashlib.sha256(bytes.fromhex(first_sha256)).hexdigest()
    checksum = second_sha256[:8]
    wif = extended_key + checksum
    wif_encoded = base58.b58encode(bytes.fromhex(wif)).decode()
    return wif_encoded

def wif_to_public_key(wif):
    decoded_wif = base58.b58decode(wif).hex()
    private_key = decoded_wif[2:-8]
    return private_key_to_address(private_key)

def private_key_to_address(private_key_hex):
    # Public key generation would be here, including elliptic curve multiplication
    # For the sake of this example, let's just use a placeholder function
    # Normally, you would use the ecdsa library to generate the public key
    public_key = 'placeholder_public_key_derived_from_private_key'
    sha256_public_key = hashlib.sha256(bytes.fromhex(public_key)).hexdigest()
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(bytes.fromhex(sha256_public_key))
    hashed_public_key = ripemd160.hexdigest()
    network_byte = '00' + hashed_public_key
    sha256_network_byte = hashlib.sha256(bytes.fromhex(network_byte)).hexdigest()
    sha256_network_byte_2 = hashlib.sha256(bytes.fromhex(sha256_network_byte)).hexdigest()
    checksum = sha256_network_byte_2[:8]
    binary_address = network_byte + checksum
    address = base58.b58encode(bytes.fromhex(binary_address)).decode()
    return address

# Intervalo definido
lower_bound = 0x100000000000000000
upper_bound = 0x11ffffffffffffffff

# Iterar até encontrar o endereço correspondente
target_address = "19vkiEajfhuZ8bs8Zu2jgmC6oqZbWqhxhG"

while True:
    private_key = generate_private_key()
    private_key_hex = hex(private_key)[2:]
    private_key_wif = private_key_to_wif(private_key_hex)
    generated_address = wif_to_public_key(private_key_wif)
    
    if generated_address == target_address:
        print(f'Chave privada correspondente: {private_key_hex}')
        print(f'Chave privada (WIF): {private_key_wif}')
        break
