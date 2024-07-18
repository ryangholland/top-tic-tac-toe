const createCell = function (space) {
  let marker = "";

  const changeMarker = function (newMarker) {
    marker = newMarker;
  };

  const getSpace = () => space;
  const getMarker = () => marker;

  return { getSpace, getMarker, changeMarker };
};

const createPlayer = function (name, marker, color) {
  const getName = () => name;
  const getMarker = () => marker;
  const getColor = () => color;

  const changeMarker = () => {
    marker = marker === "X" ? "O" : "X";
  };

  return { getName, getMarker, getColor, changeMarker };
};

const gameBoard = (function () {
  const board = [];

  for (let i = 0; i < 9; i++) {
    const newCell = createCell(i);
    board.push(newCell);
  }

  const checkForMarker = (space) => {
    return board[space].getMarker();
  };

  const acceptMarker = (space, marker) => {
    board[space].changeMarker(marker);
  };

  const checkForWinner = () => {};

  const clear = (board) => {
    board.forEach((cell) => {
      cell.changeMarker("");
    });
  };

  return { checkForMarker, acceptMarker, clear };
})();

const gameController = (function () {
  const cells = document.querySelectorAll("[data-cell]");
  let activePlayer,
    playerOne,
    playerTwo = null;
  let gameOver = false;

  const initiateGame = () => {
    playerOne = createPlayer("Player One", "X", "blue");
    playerTwo = createPlayer("Player Two", "O", "orange");
    changeActivePlayer();
  };

  const changeActivePlayer = () => {
    if (!activePlayer) {
      activePlayer = playerOne;
    } else {
      activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }
    console.log(
      `Active Player has switched to: ${activePlayer.getName()} ${activePlayer.getMarker()}`
    );
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const cellNumber = cell.dataset.cell;
      const activeMarker = activePlayer.getMarker();

      if (gameBoard.checkForMarker(cellNumber) || gameOver) return;

      gameBoard.acceptMarker(cellNumber, activeMarker);
      displayController.drawMarker(cell, activePlayer)
      changeActivePlayer();
    });
  });

  return { initiateGame };
})();

const displayController = (function () {

  const drawMarker = (cell, activePlayer) => {
    const marker = activePlayer.getMarker();
    const color = activePlayer.getColor();

    cell.classList.add(`${marker}-${color}`)
  };

  return { drawMarker };
})();

gameController.initiateGame();
