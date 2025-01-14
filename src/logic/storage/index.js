export const saveBoardToStorage = (board, turn) => {
  window.localStorage.setItem('board', JSON.stringify(board))
  window.localStorage.setItem('turn', turn)
}

export const resetBoardFromStorage = () => {
  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}

export const savePlayerNamesToStorage = (playerNames) => {
  window.localStorage.setItem('playerNames', JSON.stringify(playerNames))
}

export const resetPlayerNamesFromStorage = () => {
  window.localStorage.removeItem('playerNames')
}

export const saveScoreToStorage = (score) => {
  window.localStorage.setItem('score', JSON.stringify(score))
}

export const resetScoreFromStorage = () => {
  window.localStorage.removeItem('score')
}

export const saveIsCpuMatchToStorage = (isCpuMatch) => {
  window.localStorage.setItem('isCpuMatch', isCpuMatch)
}

export const resetIsCpuMatchFromStorage = () => {
  window.localStorage.removeItem('isCpuMatch')
}