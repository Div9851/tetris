"use client";
import { useEffect, useRef } from "react";

import type { Color } from "@/types/Color";
import { BOARD_HEIGHT, BOARD_WIDTH } from "@/consts";

type BoardProps = {
  board: Color[];
  blockSize: number;
};

export default function Board({ board, blockSize }: BoardProps) {
  const boardHeight = BOARD_HEIGHT * blockSize;
  const boardWidth = BOARD_WIDTH * blockSize;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBlock = (
    ctx: CanvasRenderingContext2D,
    y: number,
    x: number,
    blockSize: number,
    color: Color
  ) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx != null) {
      ctx.clearRect(0, 0, boardWidth, boardHeight);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, boardWidth, boardHeight);
      board.forEach((color, index) => {
        const y = Math.floor(index / BOARD_WIDTH);
        const x = index % BOARD_WIDTH;
        drawBlock(ctx, y, x, blockSize, color);
      });
    }
  }, [board, blockSize]);

  return (
    <canvas ref={canvasRef} height={boardHeight} width={boardWidth}></canvas>
  );
}
