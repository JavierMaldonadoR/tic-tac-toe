import confetti from 'canvas-confetti'
import { useState } from 'react'
import { Square } from './components/Square.jsx'
import { WinnerModal } from './components/WinnerModal.jsx'
import { PLAYERS_NAMES, TURNS } from './constants.js'
import { checkWinnerFrom } from './logic/board.js'
import { saveBoardFromStorage, resetBoardFromStorage, savePlayerNamesFromStorage, resetPlayerNamesFromStorage } from './logic/storage/index.js'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [playerNames, setPlayerNames] = useState(() => {
    const playerNamesFromStorage = window.localStorage.getItem('playerNames')
    if (playerNamesFromStorage) {
      setGameStarted(true)
      return JSON.parse(playerNamesFromStorage)
    } 
    return PLAYERS_NAMES
  })

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
  const [winnerName, setWinnerName] = useState(null)

  const startGame = () => {
    setGameStarted(true)
  }

  const closeGame = () => {
    setGameStarted(false)
    resetPlayerNamesFromStorage()
    updatePlayerNames(PLAYERS_NAMES)
    resetGame()
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    saveBoardFromStorage(newBoard, newTurn)

    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      const newWinnerName = newWinner === playerNames.player1.symbol ? playerNames.player1.name : playerNames.player2.name
      setWinnerName(newWinnerName)
      confetti()
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  const updatePlayerNames = (playerNames) => {
    setPlayerNames(playerNames)
    savePlayerNamesFromStorage(playerNames)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetBoardFromStorage()
  }

  return (
    <div className='container'>
      <main className='board'>
        <h1 className='title'>Tic Tac Toe</h1>
        {!gameStarted ? (
          <>
            <h2>Project inspired by @<a href="https://x.com/midudev">midudev</a> and made with React</h2>
            <span>Visit my site <a href="https://www.javiermaldonadorivera.com">javiermaldonadorivera.com</a></span>
            <button onClick={startGame}>2 Players</button>
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
              {turn === TURNS.X ? playerNames.player1.name : playerNames.player2.name}
              <Square isSelected={true}>{turn}</Square>
            </section>

            <section className='players'>
              <input
                type='text'
                placeholder='Player 1'
                value={playerNames.player1.name}
                onChange={(e) => updatePlayerNames({ ...playerNames, player1: { ...playerNames.player1, name: e.target.value } })}
              />
              <span className='vs'>vs</span>
              <input
                type='text'
                placeholder='Player 2'
                value={playerNames.player2.name}
                onChange={(e) => updatePlayerNames({ ...playerNames, player2: { ...playerNames.player2, name: e.target.value } })}
              />
            </section>
            
            <section>
              <button 
                className={board.every(square => square === null) ? 'disabled' : ''} 
                disabled={board.every(square => square === null)} 
                onClick={resetGame}
              >
                Reset game
              </button>
              <button onClick={closeGame}>End Game</button>
            </section>
            <WinnerModal winner={winner} winnerName={winnerName} resetGame={resetGame} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
