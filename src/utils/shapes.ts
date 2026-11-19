import type { BlockColorId, GridMatrix, PolyominoShape, TrayPiece } from '../types/game';

export const GRID_SIZE = 8;

export const BLOCK_COLORS: BlockColorId[] = ['royal', 'emerald', 'gold', 'ruby', 'violet'];

export const POLYOMINO_SHAPES: PolyominoShape[] = [
  // Single & Small
  { id: 'dot', matrix: [[1]], weight: 5 },
  { id: 'domino-h', matrix: [[1, 1]], weight: 8 },
  { id: 'domino-v', matrix: [[1], [1]], weight: 8 },
  { id: 'tri-h', matrix: [[1, 1, 1]], weight: 9 },
  { id: 'tri-v', matrix: [[1], [1], [1]], weight: 9 },
  { id: 'corner-sm-1', matrix: [[1, 1], [1, 0]], weight: 8 },
  { id: 'corner-sm-2', matrix: [[1, 1], [0, 1]], weight: 8 },
  { id: 'corner-sm-3', matrix: [[1, 0], [1, 1]], weight: 8 },
  { id: 'corner-sm-4', matrix: [[0, 1], [1, 1]], weight: 8 },

  // Squares
  { id: 'sq-2', matrix: [[1, 1], [1, 1]], weight: 10 },
  {
    id: 'sq-3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    weight: 4,
  },

  // Lines 4 & 5
  { id: 'line4-h', matrix: [[1, 1, 1, 1]], weight: 7 },
  { id: 'line4-v', matrix: [[1], [1], [1], [1]], weight: 7 },
  { id: 'line5-h', matrix: [[1, 1, 1, 1, 1]], weight: 4 },
  { id: 'line5-v', matrix: [[1], [1], [1], [1], [1]], weight: 4 },

  // T-Shapes
  { id: 't-up', matrix: [[0, 1, 0], [1, 1, 1]], weight: 6 },
  { id: 't-down', matrix: [[1, 1, 1], [0, 1, 0]], weight: 6 },
  { id: 't-left', matrix: [[0, 1], [1, 1], [0, 1]], weight: 6 },
  { id: 't-right', matrix: [[1, 0], [1, 1], [1, 0]], weight: 6 },

  // L & J Tetrominoes
  { id: 'l-1', matrix: [[1, 0], [1, 0], [1, 1]], weight: 6 },
  { id: 'l-2', matrix: [[0, 1], [0, 1], [1, 1]], weight: 6 },
  { id: 'l-3', matrix: [[1, 1, 1], [1, 0, 0]], weight: 6 },
  { id: 'l-4', matrix: [[1, 1, 1], [0, 0, 1]], weight: 6 },

  // Big L Corners (3x3)
  {
    id: 'big-l-1',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    weight: 4,
  },
  {
    id: 'big-l-2',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    weight: 4,
  },
  {
    id: 'big-l-3',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    weight: 4,
  },
  {
    id: 'big-l-4',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    weight: 4,
  },

  // S & Z Shapes
  { id: 'z-h', matrix: [[1, 1, 0], [0, 1, 1]], weight: 5 },
  { id: 's-h', matrix: [[0, 1, 1], [1, 1, 0]], weight: 5 },
  { id: 'z-v', matrix: [[0, 1], [1, 1], [1, 0]], weight: 5 },
  { id: 's-v', matrix: [[1, 0], [1, 1], [0, 1]], weight: 5 },
];

export function createEmptyBoard(): GridMatrix {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
}

function pickWeightedShape(): PolyominoShape {
  const totalWeight = POLYOMINO_SHAPES.reduce((acc, s) => acc + s.weight, 0);
  let r = Math.random() * totalWeight;
  for (const shape of POLYOMINO_SHAPES) {
    r -= shape.weight;
    if (r <= 0) return shape;
  }
  return POLYOMINO_SHAPES[0];
}

function pickRandomColor(): BlockColorId {
  return BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
}

export function canPlaceShape(
  board: GridMatrix,
  matrix: number[][],
  startRow: number,
  startCol: number
): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;
  if (startRow < 0 || startCol < 0 || startRow + rows > GRID_SIZE || startCol + cols > GRID_SIZE) {
    return false;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 1 && board[startRow + r][startCol + c] !== null) {
        return false;
      }
    }
  }
  return true;
}

export function canPlacePieceAnywhere(board: GridMatrix, matrix: number[][]): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let r = 0; r <= GRID_SIZE - rows; r++) {
    for (let c = 0; c <= GRID_SIZE - cols; c++) {
      if (canPlaceShape(board, matrix, r, c)) {
        return true;
      }
    }
  }
  return false;
}

export function generateTrayBatch(board: GridMatrix): TrayPiece[] {
  const pieces: TrayPiece[] = [];
  for (let i = 0; i < 3; i++) {
    const shape = pickWeightedShape();
    pieces.push({
      instanceId: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      shapeId: shape.id,
      matrix: shape.matrix.map((row) => [...row]),
      color: pickRandomColor(),
    });
  }

  // Ensure at least 1 piece in a fresh batch is playable on the current board if the board has space
  const anyPlayable = pieces.some((p) => canPlacePieceAnywhere(board, p.matrix));
  if (!anyPlayable) {
    const fittingShapes = POLYOMINO_SHAPES.filter((s) => canPlacePieceAnywhere(board, s.matrix));
    if (fittingShapes.length > 0) {
      const rescue = fittingShapes[Math.floor(Math.random() * fittingShapes.length)];
      pieces[0] = {
        ...pieces[0],
        shapeId: rescue.id,
        matrix: rescue.matrix.map((row) => [...row]),
      };
    }
  }

  return pieces;
}

export function hasAnyValidMove(board: GridMatrix, tray: (TrayPiece | null)[]): boolean {
  for (const piece of tray) {
    if (piece && canPlacePieceAnywhere(board, piece.matrix)) {
      return true;
    }
  }
  return false;
}

export interface PlacementAnalysis {
  nextBoard: GridMatrix;
  clearedRows: number[];
  clearedCols: number[];
  placedCellsCount: number;
  clearedCellsCoords: { row: number; col: number; color: BlockColorId }[];
}

export function simulatePlacementLines(
  board: GridMatrix,
  matrix: number[][],
  startRow: number,
  startCol: number
): { rowsToClear: number[]; colsToClear: number[] } {
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    let full = true;
    for (let c = 0; c < GRID_SIZE; c++) {
      const mr = r - startRow;
      const mc = c - startCol;
      const fromPiece =
        mr >= 0 && mr < matrix.length && mc >= 0 && mc < matrix[0].length && matrix[mr][mc] === 1;
      if (!fromPiece && board[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) rowsToClear.push(r);
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      const mr = r - startRow;
      const mc = c - startCol;
      const fromPiece =
        mr >= 0 && mr < matrix.length && mc >= 0 && mc < matrix[0].length && matrix[mr][mc] === 1;
      if (!fromPiece && board[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) colsToClear.push(c);
  }

  return { rowsToClear, colsToClear };
}

export function applyPiecePlacement(
  board: GridMatrix,
  piece: TrayPiece,
  startRow: number,
  startCol: number
): PlacementAnalysis {
  const nextBoard: GridMatrix = board.map((r) => [...r]);
  let placedCellsCount = 0;

  for (let r = 0; r < piece.matrix.length; r++) {
    for (let c = 0; c < piece.matrix[0].length; c++) {
      if (piece.matrix[r][c] === 1) {
        nextBoard[startRow + r][startCol + c] = piece.color;
        placedCellsCount++;
      }
    }
  }

  const clearedRows: number[] = [];
  const clearedCols: number[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    if (nextBoard[r].every((cell) => cell !== null)) {
      clearedRows.push(r);
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let colFull = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (nextBoard[r][c] === null) {
        colFull = false;
        break;
      }
    }
    if (colFull) clearedCols.push(c);
  }

  const clearedCellsCoords: { row: number; col: number; color: BlockColorId }[] = [];
  const seen = new Set<string>();

  for (const r of clearedRows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const key = `${r}-${c}`;
      if (!seen.has(key)) {
        seen.add(key);
        const colColor = nextBoard[r][c];
        if (colColor) clearedCellsCoords.push({ row: r, col: c, color: colColor });
      }
    }
  }

  for (const c of clearedCols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      const key = `${r}-${c}`;
      if (!seen.has(key)) {
        seen.add(key);
        const rowColor = nextBoard[r][c];
        if (rowColor) clearedCellsCoords.push({ row: r, col: c, color: rowColor });
      }
    }
  }

  for (const coord of clearedCellsCoords) {
    nextBoard[coord.row][coord.col] = null;
  }

  return {
    nextBoard,
    clearedRows,
    clearedCols,
    placedCellsCount,
    clearedCellsCoords,
  };
}

export function clearRowsForRevive(board: GridMatrix): {
  nextBoard: GridMatrix;
  clearedCoords: { row: number; col: number; color: BlockColorId }[];
} {
  // Pick the 3 most populated rows (or middle rows if tied) to give the player maximum breathing room
  const rowCounts = board.map((row, index) => ({
    index,
    count: row.filter((c) => c !== null).length,
  }));
  rowCounts.sort((a, b) => b.count - a.count);
  const rowsToClear = rowCounts.slice(0, 3).map((r) => r.index);

  const nextBoard: GridMatrix = board.map((r) => [...r]);
  const clearedCoords: { row: number; col: number; color: BlockColorId }[] = [];

  for (const r of rowsToClear) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = nextBoard[r][c];
      if (cell) {
        clearedCoords.push({ row: r, col: c, color: cell });
        nextBoard[r][c] = null;
      }
    }
  }

  return { nextBoard, clearedCoords };
}
