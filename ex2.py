import base58
import binascii

# Suponha que 'btc_address' seja o endereço Bitcoin que você deseja decodificar
btc_address = '19vkiEajfhuZ8bs8Zu2jgmC6oqZbWqhxhG'

# Decodifica o endereço Bitcoin da base58 para bytes
decoded_address = base58.b58decode(btc_address)

# O Public Key Hash é o segundo byte até o penúltimo byte (20 bytes no total)
public_key_hash = decoded_address[1:-4]

# Converte o Public Key Hash para formato hexadecimal
hex_public_key_hash = binascii.hexlify(public_key_hash).decode('utf-8')

print(f'Public Key Hash (Hash 160): {hex_public_key_hash}')
