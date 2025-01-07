import confetti from 'canvas-confetti'
import './App.css'
import { useState } from 'react'
import { Square } from './components/Square.jsx'
import { WinnerModal } from './components/WinnerModal.jsx'
import { TURNS } from './constants.js'
import { checkWinnerFrom } from './logic/board.js'
import { saveGameFromStorage, resetGameFromStorage } from './logic/storage/index.js'

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  const startGame = () => {
    setGameStarted(true)
  }

  const closeGame = () => {
    setGameStarted(false)
    resetGame()
  }

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) {
      setGameStarted(true)
      return JSON.parse(boardFromStorage)
    }
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
    <div className='container'>
      <main className='board'>
        <h1 className='title'>Tic Tac Toe</h1>
        {!gameStarted ? (
          <>
            <h2>Project inspired by @<a href="https://x.com/midudev">midudev</a> and made with React</h2>
            <span>Visit my site <a href="https://www.javiermaldonadorivera.com">javiermaldonadorivera.com</a></span>
            <button onClick={startGame}>Start Game</button>
          </>
        ) : (
          <section className='game-container'>
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
              <button 
                className={board.every(square => square === null) ? 'disabled' : ''} 
                disabled={board.every(square => square === null)} 
                onClick={resetGame}
              >
                Reset game
              </button>
              <button onClick={closeGame}>Close Game</button>
            </section>
            <WinnerModal winner={winner} resetGame={resetGame} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
