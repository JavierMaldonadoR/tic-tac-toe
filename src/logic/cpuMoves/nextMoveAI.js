import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true //required for browser environments
});

export async function getNextMoveAI(board) {
  const prompt = `
                  You are playing Tic Tac Toe. You are player ("○").
                  Current board state (0-8 index positions):
                  [0][1][2]
                  [3][4][5]
                  [6][7][8]

                  Current board:
                  [${board[0] || '_'}][${board[1] || '_'}][${board[2] || '_'}]
                  [${board[3] || '_'}][${board[4] || '_'}][${board[5] || '_'}]
                  [${board[6] || '_'}][${board[7] || '_'}][${board[8] || '_'}]

                  Analyze the board and return ONLY a number 0-8 representing your next move position.
                  Choose the best move to either:
                  1. Win immediately if possible
                  2. Block opponent from winning
                  3. Create a fork (two winning paths)
                  4. Take center if available
                  5. Take corner if available
                  6. Take any available side

                  Return only the number, no explanation.`

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert Tic Tac Toe AI player. Respond only with a single number 0-8. You are player ○. Be aggressive and play to win." },
        { role: "user", content: prompt }
      ],
      model: "deepseek-chat",
      max_tokens: 1,
      temperature: 0
    });

    const move = parseInt(completion.choices[0].message.content);
    console.log(`AI move: ${move + 1}`);

    // Validate if the move is valid
    if (isNaN(move) || move < 0 || move > 8 || board[move] !== null) {
      throw new Error('Invalid move returned by AI');
    }

    return move;
  } catch (error) {
    console.error('Error getting AI move:', error);
    throw error;
  }
}

