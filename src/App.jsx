// 1. IMPORTS
import confetti from 'canvas-confetti'
import { useState } from 'react'
import { Square } from './components/Square.jsx'
import { WinnerModal } from './components/WinnerModal.jsx'
import { PLAYERS_NAMES, TURNS } from './constants.js'
import { checkWinnerFrom } from './logic/board.js'
import { 
  saveBoardToStorage, 
  resetBoardFromStorage, 
  savePlayerNamesToStorage, 
  resetPlayerNamesFromStorage, 
  saveScoreToStorage, 
  resetScoreFromStorage, 
  saveIsCpuMatchToStorage, 
  resetIsCpuMatchFromStorage 
} from './logic/storage/index.js'
import { getNextMoveAI } from './logic/cpuMoves/nextMoveAI.js'
import { getNextMoveLocalCPU } from './logic/cpuMoves/nextMoveLocalCPU.js'

function App() {
  // 2. STATES
  const [gameStarted, setGameStarted] = useState(false)
  const [isCpuMatch, setIsCpuMatch] = useState(() => {
    const isCpuMatchFromStorage = window.localStorage.getItem('isCpuMatch')
    if (isCpuMatchFromStorage) {
      setGameStarted(true)
      return isCpuMatchFromStorage
    }
    return false
  })
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
  const [score, setScore] = useState(() => {
    const scoreFromStorage = window.localStorage.getItem('score')
    if (scoreFromStorage) return JSON.parse(scoreFromStorage)
    return [0, 0]
  })
  const [winner, setWinner] = useState(null)
  const [winnerName, setWinnerName] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 3. GAME START/END FUNCTIONS
  const startGame = () => {
    setGameStarted(true)
    updatePlayerNames(PLAYERS_NAMES)
  }

  const startCpuGame = () => {
    setIsCpuMatch(true)
    saveIsCpuMatchToStorage(true)
    startGame()
    updatePlayerNames({ ...playerNames, player2: { ...playerNames.player2, name: 'CPU' } })
  }

  const closeGame = () => {
    setGameStarted(false)
    setIsCpuMatch(false)
    resetPlayerNamesFromStorage()
    resetIsCpuMatchFromStorage()
    setPlayerNames(PLAYERS_NAMES)
    resetScoreFromStorage()
    setScore([0, 0])
    resetGame()
  }

  // 4. GAME LOGIC FUNCTIONS
  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = async (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X

    newBoard[index] = turn
    setBoard(newBoard)
    let newWinner = checkWinnerFrom(newBoard)

    if (isCpuMatch && newTurn === TURNS.O && !newWinner) {
      try {
        setIsLoading(true)
        const nextMove = await getNextMoveAI(newBoard)
        setIsLoading(false)
        newBoard[nextMove] = newTurn
      } catch (error) {
        setIsLoading(false)
        console.error('Error getting AI move:', error)
        const fallbackMove = getNextMoveLocalCPU(newBoard, newTurn)
        newBoard[fallbackMove] = newTurn
      }
    }

    setBoard(newBoard)
    setTurn(isCpuMatch ? turn : newTurn)
    saveBoardToStorage(newBoard, newTurn)

    newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      const newWinnerName = newWinner === playerNames.player1.symbol 
        ? playerNames.player1.name 
        : playerNames.player2.name

      const newScore = [...score]
      if (newWinner === playerNames.player1.symbol) {
        newScore[0] += 1
      } else {
        newScore[1] += 1
      }
      setScore(newScore)
      saveScoreToStorage(newScore)
      setWinnerName(newWinnerName)
      confetti()
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  // 5. UPDATE FUNCTIONS
  const updatePlayerNames = (playerNames) => {
    setPlayerNames(playerNames)
    savePlayerNamesToStorage(playerNames)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetBoardFromStorage()
  }

  // 6. RENDER
  return (
    <div className='container'>
      <main className='board'>
        <h1 className='title'>Tic Tac Toe</h1>
        {!gameStarted ? (
          <>
            <h2>Project inspired by @<a target="_blank" rel="noopener noreferrer" href="https://x.com/midudev">midudev</a> and made with React</h2>
            <h2>CPU logic powered by <a target="_blank" rel="noopener noreferrer" href="https://deepseek.ai">DeepSeek</a> intelligence model</h2>
            <span>Visit my site <a target="_blank" href="https://www.javiermaldonadorivera.com">javiermaldonadorivera.com</a></span>
            <button onClick={startCpuGame}>1 Player (CPU)</button>
            <button onClick={startGame}>2 Players (Human)</button>
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

            {
              !isCpuMatch && (
                <section className='turn'>
                  <span>Current Turn: </span>
                  {turn === TURNS.X ? playerNames.player1.name : playerNames.player2.name}
                  <Square isSelected={true}>{turn}</Square>
                </section>
              )
            }

            <section className='players'>
              <span>W: <span>{score[0]}</span></span>
              <input
                type='text'
                placeholder='Player 1'
                value={playerNames.player1.name}
                onChange={(e) => updatePlayerNames({ ...playerNames, player1: { ...playerNames.player1, name: e.target.value } })}
              />
              <span className='vs'>vs</span>
              {
                !isCpuMatch ? (
                  <input
                    type='text'
                    placeholder='Player 2'
                    value={playerNames.player2.name}
                    onChange={(e) => updatePlayerNames({ ...playerNames, player2: { ...playerNames.player2, name: e.target.value } })}
                  />
                ) : (
                  <span>CPU</span>
                )
              }
              <span>W: <span>{score[1]}</span></span>
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

            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
