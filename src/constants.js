export const TURNS = {
    X: '×',
    O: '○'
}

export const WINNER_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

export const PLAYERS_NAMES = {
    player1: {
        name: 'Player 1',
        symbol: TURNS.X
    },
    player2: {
        name: 'Player 2',
        symbol: TURNS.O
    }
}