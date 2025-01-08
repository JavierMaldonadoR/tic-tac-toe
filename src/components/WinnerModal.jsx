import { Square } from "./Square"

export function WinnerModal({ winner, winnerName, resetGame }) {
  if (winner === null) return null

  const winnerText = winner === false ? 'It\'s a draw!' : `The Winner is`

  return (
    <section className='winner'>
      <div className='modal'>
        <h2>{winnerText} {winner && (
          <span>{winnerName}</span>
        )}</h2>
        {winner && (
          <header className='win'>
            <Square>{winner}</Square>
          </header>
        )}

        <footer>
          <button className="reset" onClick={resetGame}>Play again</button>
        </footer>
      </div>
    </section>
  )
}