import confetti from 'canvas-confetti'
import './App.css'
import { useState } from 'react'
import { Square } from './components/Square.jsx'
import { WinnerModal } from './components/WinnerModal.jsx'
import { TURNS } from './constants.js'
import { checkWinnerFrom } from './logic/board.js'
import { saveGameFromStorage, resetGameFromStorage } from './logic/storage/index.js'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    if (turnFromStorage) return turnFromStorage
    return TURNS.X
  })
  const [winner, setWinner] = useState(null)

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    saveGameFromStorage(newBoard, newTurn)

    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameFromStorage()
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <>
        <section className='game'>
          {
            board.map((_, index) => {
              return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {board[index]}
                </Square>
              )
            })
          }
        </section>

        <section className='turn'>
          <span>Current Turn: </span>
          <Square isSelected={true}>{turn}</Square>
        </section>
        
        <section>
          <button className='reset' onClick={resetGame}>Reset game</button>
        </section>
        <WinnerModal winner={winner} resetGame={resetGame} />
      </>
    </main>
  )
}

export default App
