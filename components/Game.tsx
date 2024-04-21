"use client";

import { useEffect, useRef, useState } from "react";

import Board from "./Board";
import type { Color } from "@/types/Color";
import { Tetromino } from "@/types/Tetromino";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  INITIAL_DROP_SPEED,
  LEFT_KEY,
  RIGHT_KEY,
  ROTATE_RIGHT_KEY,
  SOFT_DROP_KEY,
} from "@/consts";

type KeyState = {
  rotateRightKeyPressed: boolean;
  leftKeyPressed: boolean;
  rightKeyPressed: boolean;
  softDropKeyPressed: boolean;
};

function isValidPlacement(tetromino: Tetromino, board: Color[]): boolean {
  return tetromino.blocks.every((_, index) => {
    const y = tetromino.y + Math.floor(index / tetromino.size);
    const x = tetromino.x + Math.floor(index % tetromino.size);
    if (y >= BOARD_HEIGHT || x < 0 || x >= BOARD_WIDTH) {
      return false;
    }
    return board[y * BOARD_WIDTH + x] == null;
  });
}

function placeTetromino(tetromino: Tetromino, board: Color[]): Color[] {
  const nextBoard = board.slice();
  tetromino.blocks.forEach((color, index) => {
    const y = tetromino.y + Math.floor(index / tetromino.size);
    const x = tetromino.x + Math.floor(index % tetromino.size);
    nextBoard[y * BOARD_WIDTH + x] = color;
  });
  return nextBoard;
}

function clearLines(board: Color[]): Color[] {
  const nextBoard: Color[] = [];
  let numClearLines = 0;
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let clear = true;
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y * BOARD_WIDTH + x] == null) {
        clear = false;
      }
    }
    if (clear) {
      numClearLines++;
    } else {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y * BOARD_WIDTH + x] != null) {
          nextBoard[(y + numClearLines) * BOARD_WIDTH + x] =
            board[y * BOARD_WIDTH + x];
        }
      }
    }
  }
  return nextBoard;
}

function shuffle(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function createBag(): Tetromino[] {
  const bag = [
    new Tetromino("I", -2, 3),
    new Tetromino("O", -2, 4),
    new Tetromino("S", -2, 4),
    new Tetromino("Z", -2, 4),
    new Tetromino("J", -2, 4),
    new Tetromino("L", -2, 4),
    new Tetromino("T", -2, 4),
  ];
  shuffle(bag);
  return bag;
}

export default function Game() {
  const [board, setBoard] = useState<Color[]>([]);
  const [bag, setBag] = useState(createBag());
  const [keyState, setKeyState] = useState<KeyState>({
    rotateRightKeyPressed: false,
    leftKeyPressed: false,
    rightKeyPressed: false,
    softDropKeyPressed: false,
  });
  const [prevKeyState, setPrevKeyState] = useState<KeyState>({
    rotateRightKeyPressed: false,
    leftKeyPressed: false,
    rightKeyPressed: false,
    softDropKeyPressed: false,
  });
  const [prevDropTimestamp, setPrevDropTimestamp] = useState(0);
  const [baseDropSpeed, setBaseDropSpeed] = useState(INITIAL_DROP_SPEED);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const keyUpHandler = (e: KeyboardEvent) => {
      const nextKeyState = {
        ...keyState,
      };
      switch (e.key) {
        case ROTATE_RIGHT_KEY:
          nextKeyState.rotateRightKeyPressed = false;
          break;
        case LEFT_KEY:
          nextKeyState.leftKeyPressed = false;
          break;
        case RIGHT_KEY:
          nextKeyState.rightKeyPressed = false;
          break;
        case SOFT_DROP_KEY:
          nextKeyState.softDropKeyPressed = false;
          break;
      }
      setKeyState(nextKeyState);
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      const nextKeyState = {
        ...keyState,
      };
      switch (e.key) {
        case ROTATE_RIGHT_KEY:
          nextKeyState.rotateRightKeyPressed = true;
          break;
        case LEFT_KEY:
          nextKeyState.leftKeyPressed = true;
          break;
        case RIGHT_KEY:
          nextKeyState.rightKeyPressed = true;
          break;
        case SOFT_DROP_KEY:
          nextKeyState.softDropKeyPressed = true;
          break;
      }
      setKeyState(nextKeyState);
    };

    const update = (timestamp: number) => {
      let nextBag = bag.slice();
      const tetromino = nextBag[nextBag.length - 1];
      if (
        keyState.rotateRightKeyPressed &&
        !prevKeyState.rotateRightKeyPressed
      ) {
        const nextTetromino = tetromino.rotateRight();
        if (isValidPlacement(nextTetromino, board)) {
          nextBag[nextBag.length - 1] = nextTetromino;
        }
      } else if (keyState.leftKeyPressed && !prevKeyState.leftKeyPressed) {
        const nextTetromino = tetromino.move(0, -1);
        if (isValidPlacement(nextTetromino, board)) {
          nextBag[nextBag.length - 1] = nextTetromino;
        }
      } else if (keyState.rightKeyPressed && !prevKeyState.rightKeyPressed) {
        const nextTetromino = tetromino.move(0, 1);
        if (isValidPlacement(nextTetromino, board)) {
          nextBag[nextBag.length - 1] = nextTetromino;
        }
      } else {
        const elapsed = (timestamp - prevDropTimestamp) / 1000;
        const dropSpeed =
          baseDropSpeed * (keyState.softDropKeyPressed ? 20 : 1);
        if (elapsed * dropSpeed >= 1) {
          const nextTetromino = tetromino.move(1, 0);
          if (isValidPlacement(nextTetromino, board)) {
            nextBag[nextBag.length - 1] = nextTetromino;
          } else {
            setBoard(clearLines(placeTetromino(tetromino, board)));
            if (nextBag.length > 1) {
              nextBag.pop();
            } else {
              nextBag = createBag();
            }
          }
          setPrevDropTimestamp(timestamp);
        }
      }
      setBag(nextBag);
      setPrevKeyState(keyState);
      animationRef.current = requestAnimationFrame(update);
    };

    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("keydown", keyDownHandler);
    animationRef.current = requestAnimationFrame(update);

    return () => {
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("keydown", keyDownHandler);
      if (animationRef.current != null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [board, bag, keyState, prevKeyState, prevDropTimestamp, baseDropSpeed]);

  return <Board board={board} tetromino={bag[bag.length - 1]} blockSize={20} />;
}
