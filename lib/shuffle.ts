const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const EMPTY = -1;

type Board = number[];

function getNeighbors(index: number): number[] {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const neighbors: number[] = [];

  if (row > 0) neighbors.push(index - GRID_SIZE);
  if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE);
  if (col > 0) neighbors.push(index - 1);
  if (col < GRID_SIZE - 1) neighbors.push(index + 1);

  return neighbors;
}

export function shuffleBoard(moves: number = 300): Board {
  // Start from solved state and perform random valid moves
  // This guarantees the resulting board is always solvable
  const board: Board = [];
  for (let i = 0; i < TOTAL_TILES - 1; i++) {
    board.push(i);
  }
  board.push(EMPTY);

  let emptyIndex = TOTAL_TILES - 1;
  let lastEmpty = -1;

  for (let i = 0; i < moves; i++) {
    const neighbors = getNeighbors(emptyIndex).filter((n) => n !== lastEmpty);
    const randomNeighbor =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    board[emptyIndex] = board[randomNeighbor];
    board[randomNeighbor] = EMPTY;

    lastEmpty = emptyIndex;
    emptyIndex = randomNeighbor;
  }

  return board;
}

export function isSolved(board: Board): boolean {
  for (let i = 0; i < TOTAL_TILES - 1; i++) {
    if (board[i] !== i) return false;
  }
  return board[TOTAL_TILES - 1] === EMPTY;
}

export { GRID_SIZE, TOTAL_TILES, EMPTY };
export type { Board };
