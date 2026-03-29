#!/usr/bin/env python3
"""
Convert JSON crossword format to .puz (AcrossLite) format.

JSON format:
{
    "date": "YYYY-MM-DD",
    "size": [height, width],
    "blocks": [[row, col], ...],
    "author": "Author Name",
    "across": [{"n": number, "where": row, "clue": "...", "ans": "ANSWER"}, ...],
    "down": [{"n": number, "where": col, "clue": "...", "ans": "ANSWER"}, ...]
}
"""

import json
import struct
import sys
from pathlib import Path
from typing import List, Tuple


def build_puz_file(data: dict) -> bytes:
    """Build a .puz file from JSON crossword data."""
    
    rows, cols = data['size'][0], data['size'][1]
    author = data.get('author', '')
    
    # Initialize grid: '.' for blocks, '-' for empty cells
    grid = [['-' for _ in range(cols)] for _ in range(rows)]
    solution = [['-' for _ in range(cols)] for _ in range(rows)]
    
    # Mark blocks (1-indexed in JSON)
    for r, c in data.get('blocks', []):
        if 1 <= r <= rows and 1 <= c <= cols:
            grid[r-1][c-1] = '.'
            solution[r-1][c-1] = '.'
    
    # Build solution grid by placing answers
    across_by_num = {clue['n']: clue for clue in data.get('across', [])}
    down_by_num = {clue['n']: clue for clue in data.get('down', [])}
    
    # Place across answers (where = row number, 1-indexed)
    for clue in data.get('across', []):
        r = clue['where'] - 1
        ans = clue['ans']
        
        # Find the starting column for this clue
        # (first cell in this row that's not a block, after blocks)
        col = 0
        across_count = 0
        for c in range(cols):
            if grid[r][c] == '-' and (c == 0 or grid[r][c-1] == '.'):
                across_count += 1
                if across_count == clue['n']:
                    col = c
                    break
        
        # Place the answer
        for i, char in enumerate(ans):
            if col + i < cols and grid[r][col + i] == '-':
                solution[r][col + i] = char.upper()
    
    # Place down answers (where = col number, 1-indexed)
    for clue in data.get('down', []):
        c = clue['where'] - 1
        ans = clue['ans']
        
        # Find the starting row for this clue
        row = 0
        down_count = 0
        for r in range(rows):
            if grid[r][c] == '-' and (r == 0 or grid[r-1][c] == '.'):
                down_count += 1
                if down_count == clue['n']:
                    row = r
                    break
        
        # Place the answer
        for i, char in enumerate(ans):
            if row + i < rows and grid[row + i][c] == '-':
                solution[row + i][c] = char.upper()
    
    # Build the .puz file
    # Header: 52 bytes (0x00-0x33)
    header = bytearray(52)
    
    # Checksum placeholder (we'll use 0000)
    struct.pack_into('<H', header, 0x00, 0)
    
    # Version (empty)
    struct.pack_into('<H', header, 0x04, 0)
    
    # Reserved bytes (0x06-0x0D): all zero
    
    # Scrambled checksum (0x0E-0x0F)
    struct.pack_into('<H', header, 0x0E, 0)
    
    # Width and height
    header[0x2C] = cols
    header[0x2D] = rows
    
    # Number of clues
    num_clues = len(data.get('across', [])) + len(data.get('down', []))
    struct.pack_into('<H', header, 0x2E, num_clues)
    
    # Puzzle size
    puzzle_size = rows * cols
    struct.pack_into('<H', header, 0x14, puzzle_size)
    
    # Convert grids to strings
    grid_str = ''.join(''.join(row) for row in grid)
    solution_str = ''.join(''.join(row) for row in solution)
    
    # Build clues section
    clues_list = []
    
    # Across clues
    for clue in sorted(data.get('across', []), key=lambda x: x['n']):
        clues_list.append(clue['clue'])
    
    # Down clues
    for clue in sorted(data.get('down', []), key=lambda x: x['n']):
        clues_list.append(clue['clue'])
    
    # Null-separated clue strings: title, author, copyright, then clues
    clues_section = b'\x00'.join([
        b'',  # title
        author.encode('utf-8', errors='replace'),
        b'',  # copyright
    ])
    
    for clue in clues_list:
        clues_section += b'\x00' + clue.encode('utf-8', errors='replace')
    
    clues_section += b'\x00'
    
    # Assemble the complete file
    puz_file = bytes(header) + grid_str.encode('ascii') + solution_str.encode('ascii') + clues_section
    
    return puz_file


def json_to_puz(json_path: Path, puz_path: Path = None):
    """Convert a JSON crossword file to .puz format."""
    
    if puz_path is None:
        puz_path = json_path.with_suffix('.puz')
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    try:
        puz_bytes = build_puz_file(data)
        with open(puz_path, 'wb') as f:
            f.write(puz_bytes)
        print(f"✓ {json_path.name:20} → {puz_path.name}")
        return True
    except Exception as e:
        print(f"✗ {json_path.name:20} ERROR: {e}")
        return False


def main():
    """Convert all JSON files in _data/crosswords/ to .puz."""
    
    # Get the crosswords directory
    current_dir = Path(__file__).parent.parent
    data_dir = current_dir / '_data' / 'crosswords'
    
    if not data_dir.exists():
        print(f"Error: {data_dir} does not exist")
        sys.exit(1)
    
    json_files = sorted(data_dir.glob('mini-*.json'))
    
    if not json_files:
        print(f"No JSON files found in {data_dir}")
        sys.exit(1)
    
    print(f"Converting {len(json_files)} JSON files to .puz format...\n")
    
    success_count = 0
    for json_file in json_files:
        if json_to_puz(json_file):
            success_count += 1
    
    print(f"\n✓ Successfully converted {success_count}/{len(json_files)} files")


if __name__ == '__main__':
    main()
