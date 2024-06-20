start_hex = '0x20000000000000000'
end_hex = '0x3ffffffffffffffff'
block_size = 6000000             

blocks = []
start_int = int(start_hex, 16)
end_int = int(end_hex, 16)

block_end = min(start_int + block_size - 1, end_int)
print(f"{block_end}")

# while start_int < end_int:
#     block_end = min(start_int + block_size - 1, end_int)
#     blocks.append((start_int, block_end))
#     start_int = block_end + 1

# for block in blocks:
#     print(f"Bloco de {hex(block[0])} até {hex(block[1])}")
