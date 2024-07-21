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

  const checkForTie = () => {
    let gameOver = false;
    const emptySpaces = board.filter((cell) => !cell.getMarker());
    if (emptySpaces.length == 0) {
      gameOver = true;
    }
    return gameOver;
  };

  const clear = () => {
    board.forEach((cell) => {
      cell.changeMarker("");
    });
  };

  return { checkForMarker, acceptMarker, checkForWinner, checkForTie, clear };
})();

const gameController = (function () {
  const cells = document.querySelectorAll("[data-cell]");
  const restartButton = document.querySelector(".restart-btn");
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

    displayController.renderGameInfo(activePlayer);
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const cellNumber = cell.dataset.cell;
      const activeMarker = activePlayer.getMarker();

      if (gameBoard.checkForMarker(cellNumber) || gameOver) return;

      gameBoard.acceptMarker(cellNumber, activeMarker);
      displayController.drawMarker(cell, activePlayer);

      gameOver = gameBoard.checkForWinner();
      if (gameOver) {
        displayController.displayWinner(activePlayer);
        return;
      }

      if (!gameOver) {
        gameOver = gameBoard.checkForTie();
        if (gameOver) {
          displayController.displayTie();
          return;
        }
      }

      changeActivePlayer();
    });
  });

  restartButton.addEventListener("click", () => {
    displayController.resetGameInfo();
    cells.forEach((cell) => {
      cell.className = "";
      cell.classList.add("ttt-cell");
    });
    gameOver = false;
    gameBoard.clear();
    initiateGame();
  });

  return { initiateGame };
})();

const displayController = (function () {
  const BLUE = "#0000F5";
  const ORANGE = "#EA3323";
  const gameInfo = document.querySelector(".game-info");
  const resultInfo = document.querySelector(".result-info");
  const playerName = document.querySelector(".player-name");
  const playerMarker = document.querySelector(".player-marker");

  const drawMarker = (cell, activePlayer) => {
    const marker = activePlayer.getMarker();
    const color = activePlayer.getColor();

    cell.classList.add(`${marker}-${color}`);
  };

  const renderGameInfo = (player) => {
    const activeName = player.getName();
    const activeColor = player.getColor();
    const activeMarker = player.getMarker();

    gameInfo.style.color = activeColor === "blue" ? BLUE : ORANGE;
    playerName.textContent = activeName;
    playerMarker.textContent = activeMarker;
  };

  const displayWinner = (player) => {
    const activeName = player.getName();
    const activeColor = player.getColor();

    gameInfo.style.display = "none";
    resultInfo.style.display = "block";

    resultInfo.style.color = activeColor === "blue" ? BLUE : ORANGE;
    resultInfo.textContent = `Game over! ${activeName} wins!`;
  };

  const displayTie = () => {
    gameInfo.style.display = "none";
    resultInfo.style.display = "block";

    resultInfo.style.color = "black";
    resultInfo.textContent = `Game over! It's a tie!`;
  };

  const resetGameInfo = () => {
    gameInfo.style.display = "block";
    resultInfo.style.display = "none";
  };

  return {
    drawMarker,
    renderGameInfo,
    displayWinner,
    displayTie,
    resetGameInfo,
  };
})();

gameController.initiateGame();
