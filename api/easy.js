export const player = (p) => {
  if (p == "o") {
    return "x";
  }
  return "o";
};

export const checkDraw = (board) => {
  // Check if all cells are filled
for(let i =0 ; i < board.length ; i++){
  for(let  j=0 ; j < board.length ; j++){
  if(board[i][j]=="")return false;
  }
}
  // If the board is full and there's no winner, it's a draw
  return true;
};
export const updateBoard = (board, row, col, p) => {
  let newboard = [...board];
  newboard[row][col] = p;
  return newboard;
};
 
export const checkWin = (row, col, board, p) => {
  let flag = true;
     const p1 =  board[row][col];
  // Check Row
  for (let i = 0; i < 3; i++) {
    if (board[row][i] !== p1) {
      flag = false;
      break;
    }
  }
  if (flag) return true; // Return if row is winning

  // Check Column
  flag = true;
  for (let i = 0; i < 3; i++) {
    if (board[i][col] !== p1) {
      flag = false;
      break;
    }
  }
  if (flag) return true; // Return if column is winning

  // Check Main Diagonal (Top-left to Bottom-right)
  if (row === col) {
    flag = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i][i] !== p1) {
        flag = false;
        break;
      }
    }
    if (flag) return true; // Return if main diagonal is winning
  }

  // Check Anti-Diagonal (Top-right to Bottom-left)
  if (row + col === board.length - 1) {
    flag = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i][board.length - 1 - i] !== p) {
        flag = false;
        break;
      }
    }
    if (flag) return true; // Return if anti-diagonal is winning
  }

  return false; // No win condition met
};
