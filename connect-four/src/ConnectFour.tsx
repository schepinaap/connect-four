import { useState } from "react";
import "./ConnectFour.css";

type Cell = "green" | "violet" | null;

const rows = 6;
const cols = 7;

function ConnectFour() {
  const createBoard = (): Cell[][] =>
    Array.from({ length: rows }, () => Array(cols).fill(null));

  const [board, setBoard] = useState<Cell[][]>(createBoard());
  const [isGreenPlayer, setIsGreenPlayer] = useState<boolean>(true);
  const [winner, setWinner] = useState<Cell | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const handleColumnClick = (colIndex: number) => {
    if (winner || isDraw) return;

    const rowIndex = findAvailableRow(colIndex);
    if (rowIndex < 0) return;

    const newBoard = board.map((row) => row.slice());

    newBoard[rowIndex][colIndex] = isGreenPlayer ? "green" : "violet";

    setBoard(newBoard);

    if (
      checkWin(newBoard, rowIndex, colIndex, isGreenPlayer ? "green" : "violet")
    ) {
      setWinner(isGreenPlayer ? "green" : "violet");
    } else if (checkDraw(newBoard)) {
      setIsDraw(true);
    } else {
      setIsGreenPlayer((prev) => !prev);
    }
  };

  const findAvailableRow = (colIndex: number): number => {
    for (let row = rows - 1; row >= 0; row--) {
      if (board[row][colIndex] === null) {
        return row;
      }
    }
    return -1;
  };

  const checkWin = (
    board: Cell[][],
    row: number,
    col: number,
    color: Cell
  ): boolean => {
    if (!color) return false;

    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];

    for (const { dr, dc } of directions) {
      let count = 1;

      count += countInDirection(board, row, col, dr, dc, color);
      count += countInDirection(board, row, col, -dr, -dc, color);

      if (count >= 4) return true;
    }

    return false;
  };
  
  const checkDraw = (board: Cell[][]): boolean => {
    return board.every((row) => row.every((cell) => cell !== null));
  };
  const countInDirection = (
    board: Cell[][],
    row: number,
    col: number,
    dr: number,
    dc: number,
    color: Cell
  ): number => {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === color) {
      count++;
      r += dr;
      c += dc;
    }

    return count;
  };

  const handleReset = () => {
    setBoard(createBoard());
    setIsGreenPlayer(true);
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="content">
      <h1 className="game-title">Connect Four</h1>
        <p className="current-player">
          Текущий игрок:{" "}
          <span style={{ color: isGreenPlayer ? "green" : "violet" }}>
            {isGreenPlayer ? "Зеленый" : "Фиолетовый"}
          </span>
        </p>
        {winner && (
         <div className="win"> <h3  style={{ color: winner === "green" ? "green" : "violet", margin: 0, borderColor: winner === "green" ? "green" : "violet"}}>
            Победитель: {winner === "green" ? "Зеленый" : "Фиолетовый"}
          </h3>
          <button className="button" onClick={handleReset}>начать заново</button></div>
        )}

      <div className="table"
       style={{borderColor: isGreenPlayer ? "green" : "violet"}}>
        {Array.from({ length: cols }).map((_, colIdx) => (
          <div
            className="cols"
            key={colIdx}
            onClick={() => handleColumnClick(colIdx)}
            title={`Кликните, чтобы вставить в колонку ${colIdx + 1}`}
          />
        ))}

        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              className="cell"
              key={`${rowIdx}-${colIdx}`}
              onClick={() => handleColumnClick(colIdx)}
              style={{
                backgroundColor: cell ?? "lightgray",
              }}
            />
          ))
        )}
      </div>

      {isDraw && <h3 style={{ color: "gray" }}>Игра окончена: ничья</h3>}
      <button className="button" onClick={handleReset}>начать заново</button>
    </div>
  );
}

export default ConnectFour;
