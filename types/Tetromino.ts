import { Color } from "@/types/Color";

export type TetrominoKind = "I" | "O" | "S" | "Z" | "J" | "L" | "T";

export class Tetromino {
  kind: TetrominoKind;
  size: number;
  y: number;
  x: number;
  blocks: Color[];

  constructor(kind: TetrominoKind, y: number, x: number) {
    this.kind = kind;
    this.y = y;
    this.x = x;
    this.blocks = [];
    switch (kind) {
      case "I":
        this.size = 4;
        this.blocks[4] =
          this.blocks[5] =
          this.blocks[6] =
          this.blocks[7] =
            "aqua";
        break;
      case "O":
        this.size = 2;
        this.blocks[0] =
          this.blocks[1] =
          this.blocks[2] =
          this.blocks[3] =
            "yellow";
        break;
      case "S":
        this.size = 3;
        this.blocks[1] =
          this.blocks[2] =
          this.blocks[3] =
          this.blocks[4] =
            "green";
        break;
      case "Z":
        this.size = 3;
        this.blocks[0] =
          this.blocks[1] =
          this.blocks[4] =
          this.blocks[5] =
            "red";
        break;
      case "J":
        this.size = 3;
        this.blocks[0] =
          this.blocks[3] =
          this.blocks[4] =
          this.blocks[5] =
            "blue";
        break;
      case "L":
        this.size = 3;
        this.blocks[2] =
          this.blocks[3] =
          this.blocks[4] =
          this.blocks[5] =
            "orange";
        break;
      case "T":
        this.size = 3;
        this.blocks[1] =
          this.blocks[3] =
          this.blocks[4] =
          this.blocks[5] =
            "purple";
        break;
    }
  }

  clone(): Tetromino {
    const tetromino = new Tetromino(this.kind, this.y, this.x);
    tetromino.blocks = this.blocks.slice();
    return tetromino;
  }

  rotateRight(): Tetromino {
    const tetromino = this.clone();
    tetromino.blocks = [];
    this.blocks.forEach((color, index) => {
      const y = Math.floor(index / this.size);
      const x = index % this.size;
      tetromino.blocks[x * this.size + (this.size - 1 - y)] = color;
    });
    return tetromino;
  }

  move(dy: number, dx: number): Tetromino {
    const tetromino = this.clone();
    tetromino.y += dy;
    tetromino.x += dx;
    return tetromino;
  }
}
