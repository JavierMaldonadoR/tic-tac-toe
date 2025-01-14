import { WINNER_COMBOS } from "../constants";

export function getNextMove(board, player) {
    const opponent = player === "×" ? "○" : "×";
  
    const winningCombos = WINNER_COMBOS
  
    function findBestMove(currentPlayer) {
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        const values = [board[a], board[b], board[c]];
  
        if (values.filter(v => v === currentPlayer).length === 2 && values.includes(null)) {
          return combo[values.indexOf(null)];
        }
      }
      return null;
    }
  
    let move = findBestMove(player);
    if (move !== null) return move;
  
    move = findBestMove(opponent);
    if (move !== null) return move;
  
    if (board[4] === null) return 4;
  
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
      if (board[corner] === null) return corner;
    }
  
    const sides = [1, 3, 5, 7];
    for (const side of sides) {
      if (board[side] === null) return side;
    }
  
    return null;
}
  
export default getNextMove;