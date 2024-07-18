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

  const checkForWinner = () => {
    const WINNING_COMBOS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let gameOver = false;

    WINNING_COMBOS.forEach((combo) => {
      const markerOne = board[combo[0]].getMarker();
      const markerTwo = board[combo[1]].getMarker();
      const markerThree = board[combo[2]].getMarker();

      if (markerOne && markerOne == markerTwo && markerOne == markerThree) {
        gameOver = true;
      }
    });

    return gameOver;
  };

  const clear = (board) => {
    board.forEach((cell) => {
      cell.changeMarker("");
    });
  };

  return { checkForMarker, acceptMarker, checkForWinner, clear };
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
      `Active Player has switched to: ${activePlayer.getName()} (${activePlayer.getMarker()})`
    );
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const cellNumber = cell.dataset.cell;
      const activeMarker = activePlayer.getMarker();
      console.log(gameOver)

      if (gameBoard.checkForMarker(cellNumber) || gameOver) return;

      gameBoard.acceptMarker(cellNumber, activeMarker);
      displayController.drawMarker(cell, activePlayer);

      gameOver = gameBoard.checkForWinner();
      console.log(`Game is over: ${gameOver}`)

      changeActivePlayer();
    });
  });

  return { initiateGame };
})();

const displayController = (function () {
  const drawMarker = (cell, activePlayer) => {
    const marker = activePlayer.getMarker();
    const color = activePlayer.getColor();

    cell.classList.add(`${marker}-${color}`);
  };

  return { drawMarker };
})();

gameController.initiateGame();
