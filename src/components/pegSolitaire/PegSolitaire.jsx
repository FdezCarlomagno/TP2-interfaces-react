"use client"

import { useState, useCallback } from "react"
import "./peg-solitaire.css"

const INITIAL_BOARD = [
  ["invalid", "invalid", "peg", "peg", "peg", "invalid", "invalid"],
  ["invalid", "invalid", "peg", "peg", "peg", "invalid", "invalid"],
  ["peg", "peg", "peg", "peg", "peg", "peg", "peg"],
  ["peg", "peg", "peg", "empty", "peg", "peg", "peg"],
  ["peg", "peg", "peg", "peg", "peg", "peg", "peg"],
  ["invalid", "invalid", "peg", "peg", "peg", "invalid", "invalid"],
  ["invalid", "invalid", "peg", "peg", "peg", "invalid", "invalid"],
]

export default function PegSolitaire() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [validMoves, setValidMoves] = useState([])
  const [pegsRemaining, setPegsRemaining] = useState(32)
  const [moveCount, setMoveCount] = useState(0)

  const countPegs = useCallback((currentBoard) => {
    return currentBoard.flat().filter((cell) => cell === "peg").length
  }, [])

  const getValidMoves = useCallback((row, col, currentBoard) => {
    const moves = []
    const directions = [
      { dr: -2, dc: 0, mr: -1, mc: 0 }, // arriba
      { dr: 2, dc: 0, mr: 1, mc: 0 }, // abajo
      { dr: 0, dc: -2, mr: 0, mc: -1 }, // izquierda
      { dr: 0, dc: 2, mr: 0, mc: 1 }, // derecha
    ]

    directions.forEach(({ dr, dc, mr, mc }) => {
      const newRow = row + dr
      const newCol = col + dc
      const midRow = row + mr
      const midCol = col + mc

      if (
        newRow >= 0 &&
        newRow < 7 &&
        newCol >= 0 &&
        newCol < 7 &&
        currentBoard[newRow][newCol] === "empty" &&
        currentBoard[midRow][midCol] === "peg"
      ) {
        moves.push({ row: newRow, col: newCol })
      }
    })

    return moves
  }, [])

  const handleCellClick = useCallback(
    (row, col) => {
      const cell = board[row][col]

      if (cell === "invalid") return

      // Si hay una ficha seleccionada y se hace clic en un movimiento válido
      if (selectedPeg) {
        const isValidMove = validMoves.some((move) => move.row === row && move.col === col)

        if (isValidMove) {
          // Realizar el movimiento
          const newBoard = board.map((r) => [...r])
          const midRow = (selectedPeg.row + row) / 2
          const midCol = (selectedPeg.col + col) / 2

          newBoard[selectedPeg.row][selectedPeg.col] = "empty"
          newBoard[midRow][midCol] = "empty"
          newBoard[row][col] = "peg"

          setBoard(newBoard)
          setPegsRemaining(countPegs(newBoard))
          setMoveCount((prev) => prev + 1)
          setSelectedPeg(null)
          setValidMoves([])
        } else if (cell === "peg") {
          // Seleccionar otra ficha
          const moves = getValidMoves(row, col, board)
          setSelectedPeg({ row, col })
          setValidMoves(moves)
        } else {
          // Deseleccionar
          setSelectedPeg(null)
          setValidMoves([])
        }
      } else if (cell === "peg") {
        // Seleccionar una ficha
        const moves = getValidMoves(row, col, board)
        setSelectedPeg({ row, col })
        setValidMoves(moves)
      }
    },
    [board, selectedPeg, validMoves, getValidMoves, countPegs],
  )

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD)
    setSelectedPeg(null)
    setValidMoves([])
    setPegsRemaining(32)
    setMoveCount(0)
  }, [])

  const isSelected = useCallback(
    (row, col) => {
      return selectedPeg?.row === row && selectedPeg?.col === col
    },
    [selectedPeg],
  )

  const isValidMove = useCallback(
    (row, col) => {
      return validMoves.some((move) => move.row === row && move.col === col)
    },
    [validMoves],
  )

  const hasWon = pegsRemaining === 1
  const hasLost =
    pegsRemaining > 1 &&
    !board.some((row, r) => row.some((cell, c) => cell === "peg" && getValidMoves(r, c, board).length > 0))

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex gap-8 items-center justify-center flex-wrap">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{pegsRemaining}</div>
          <div className="text-sm text-muted-foreground">Fichas restantes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent">{moveCount}</div>
          <div className="text-sm text-muted-foreground">Movimientos</div>
        </div>
      </div>

      {(hasWon || hasLost) && (
        <div className="text-center p-4 rounded-lg bg-card border border-border">
          <p className="text-xl font-semibold text-foreground">{hasWon ? "¡Felicidades! 🎉" : "Juego terminado"}</p>
          <p className="text-muted-foreground">
            {hasWon ? "¡Has ganado el juego!" : "No hay más movimientos posibles"}
          </p>
        </div>
      )}

      <div className="peg-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="peg-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`peg-cell ${cell} ${
                  isSelected(rowIndex, colIndex) ? "selected" : ""
                } ${isValidMove(rowIndex, colIndex) ? "valid-move" : ""}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell === "peg" && <div className="peg" />}
                {isValidMove(rowIndex, colIndex) && <div className="move-indicator" />}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="ps-reset-button" onClick={resetGame} aria-label="Reiniciar juego">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12a9 9 0 11-3.95-7.05" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M21 3v6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
        Reiniciar juego
      </button>

      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>
          <strong>Cómo jugar:</strong> Haz clic en una ficha para seleccionarla, luego haz clic en un espacio válido
          (resaltado) para saltar sobre una ficha adyacente y eliminarla.
        </p>
      </div>
    </div>
  )
}
