start_hex = '0x20000000000000000'
end_hex = '0xfffffffffffffffff'

start_int = int(start_hex, 16)
end_int = int(end_hex, 16)

# Quantidade desejada de blocos
num_blocks = 1000

# Calcula o tamanho de cada bloco
block_size = (end_int - start_int + 1) // num_blocks

# Lista para armazenar os blocos gerados
blocks = []

# Gerar os blocos
for i in range(num_blocks):
    block_start = start_int + i * block_size
    block_end = start_int + (i + 1) * block_size - 1
    if i == num_blocks - 1:
        block_end = end_int  # Ajuste para garantir que o último bloco inclua o fim exato
    
    # Quantidade de chaves no bloco
    num_keys = block_end - block_start + 1
    
    # Tempo estimado para percorrer todas as chaves (em segundos)
    seconds = num_keys  # Assumindo 1 chave por segundo
    
    # Converter segundos para dias, meses e anos
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    days, hours = divmod(hours, 24)
    months = days // 30.436875  # média de dias por mês
    years = days // 365.25      # média de dias por ano
    
    blocks.append((hex(block_start), hex(block_end) )) #, num_keys, seconds, days, months, years))

# Imprimir os blocos gerados com as estimativas de tempo
for idx, (block_start_hex, block_end_hex) in enumerate(blocks):
# for idx, (block_start_hex, block_end_hex, num_keys, seconds, days, months, years) in enumerate(blocks):
    print(f'Bloco {idx+1}: de {block_start_hex} até {block_end_hex}, quantidade de chaves: {num_keys}')
    # print(f'  - Tempo estimado para percorrer todas as chaves:')
    # print(f'    - Dias: {days}')
    # print(f'    - Meses: {months}')
    # print(f'    - Anos: {years}')
    # print(blocks)
