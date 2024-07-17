const createCell = function (space) {
  let marker = "";

  const changeMarker = function (newMarker) {
    marker = newMarker;
  };

  const getSpace = () => space;
  const getMarker = () => marker;

  return { getSpace, getMarker, changeMarker };
};

const createPlayer = function () {};

const gameBoard = (function () {
  const board = [];

  for (let i = 0; i < 9; i++) {
    const newCell = createCell(i);
    board.push(newCell);
  }

  const acceptMarker = (space, marker) => {
    board[space].changeMarker(marker);
  };

  const clear = (board) => {
    board.forEach((cell) => {
      cell.changeMarker("");
    });
  };

  return { board, acceptMarker, clear };
})();

const gameController = (function () {})();

const displayController = (function () {})();

gameBoard.acceptMarker(0, "X");
gameBoard.acceptMarker(1, "O");
console.log(gameBoard.board[0].getMarker());
console.log(gameBoard.board[1].getMarker());
