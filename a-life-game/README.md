# a-life demo

Simulate artificial life.

[Play](./index.html)

- Any live cell with fewer than two (2) live neighbors dies (1 or 0), as if by underpopulation.
- Any live cell with more than three (3+) live neighbors dies, as if by overpopulation.
- Any live cell with two or three live neighbors lives on to the next generation.
- Any empty cell with exactly three live neighbors becomes a live cell, as if by reproduction.

Grid: each cell has 8 neighbors

123
456
789

Hex: each cell has 8 neighbors
    1
   2 3
  4 5 6
   7 8
    9
