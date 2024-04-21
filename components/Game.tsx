"use client";
import Board from "./Board";
import type { Color } from "@/types/Color";

export default function Game() {
  const board: Color[] = [];
  board[166] = "aqua";
  board[176] = "aqua";
  board[186] = "aqua";
  board[196] = "aqua";
  board[187] = "red";
  board[197] = "red";
  board[198] = "red";
  board[199] = "red";
  return <Board board={board} blockSize={20} />;
}
