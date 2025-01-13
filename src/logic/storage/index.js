export const saveBoardFromStorage = (board, turn) => {
  window.localStorage.setItem('board', JSON.stringify(board))
  window.localStorage.setItem('turn', turn)
}

export const resetBoardFromStorage = () => {
  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}

export const savePlayerNamesFromStorage = (playerNames) => {
  window.localStorage.setItem('playerNames', JSON.stringify(playerNames))
}

export const resetPlayerNamesFromStorage = () => {
  window.localStorage.removeItem('playerNames')
}
