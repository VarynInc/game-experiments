document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.gameBoard');
  const flagsLeft = document.querySelector('#flags-left');
  const result = document.querySelector('#result');
  const numberClasses = ["none", "one", "two", "three", "four", "five", "six", "seven", "eight"];
  const levels = {
    easy: {width: 10, spies: 10},
    intermediate: {width: 14, spies: 30},
    expert: {width: 20, spies: 50}
  };
  let difficulty = "easy";
  let width = levels[difficulty].width;
  let numberOfSpies = levels[difficulty].spies;
  let flagCount = 0;
  let allCells = [];
  let isGameOver = false;

  function createBoard(width, numberOfSpies) {
    let numberOfCells = width * width;

    // generate shuffled game array with random spies and empty cells
    const setCells = [];
    for (let cellIndex = 0; cellIndex < numberOfCells; cellIndex += 1) {
      setCells[cellIndex] = (cellIndex < numberOfSpies) ? "spy" : "empty";
    }
    const shuffledArray = setCells.sort(() => Math.random() -0.5);

    for (let cellIndex = 0; cellIndex < numberOfCells; cellIndex += 1) {
      const cell = document.createElement("div");
      cell.setAttribute("id", cellIndex);
      cell.classList.add(shuffledArray[cellIndex]);
      gameBoard.appendChild(cell);
      allCells.push(cell);

      //normal click
      cell.addEventListener("click", function(e) {
        click(cell);
      })

      //ctrl and left click
      cell.oncontextmenu = function(e) {
        e.preventDefault();
        addFlag(cell);
      }
    }

    // iterate each cell to determine how many adjacent spies
    for (let i = 0; i < allCells.length; i += 1) {
      if (allCells[i].classList.contains("empty")) {
        let spiesNearBy = 0
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);
        const isTopRow = i < width;
        const isBottomRow = i >= width * (width - 1);
        if (! isLeftEdge && allCells[i - 1].classList.contains("spy")) spiesNearBy ++; // spy to the left
        if (! isRightEdge && allCells[i + 1].classList.contains("spy")) spiesNearBy ++; // spy to the right
        if (! isTopRow && allCells[i - width].classList.contains("spy")) spiesNearBy ++; // spy above
        if (! isBottomRow && allCells[i + width].classList.contains("spy")) spiesNearBy ++; // spy below
        if (! isTopRow && ! isLeftEdge && allCells[i - 1 - width].classList.contains("spy")) spiesNearBy ++; // spy above left
        if (! isTopRow && ! isRightEdge && allCells[i + 1 - width].classList.contains("spy")) spiesNearBy ++; // spy above right
        if (! isBottomRow && ! isLeftEdge && allCells[i - 1 + width].classList.contains("spy")) spiesNearBy ++; // spy below left
        if (! isBottomRow && ! isRightEdge && allCells[i + 1 + width].classList.contains("spy")) spiesNearBy ++; // spy below right
        allCells[i].setAttribute("data", spiesNearBy)
      }
    }
  }
  createBoard(width, numberOfSpies)
  flagsLeft.innerHTML = numberOfSpies

  //add Flag with right click
  function addFlag(cell) {
    if (isGameOver) { return };
    if ( ! cell.classList.contains("checked")) {
      if ( ! cell.classList.contains("flag") && (flagCount < numberOfSpies)) {
        cell.classList.add("flag");
        cell.innerHTML = " 🚩";
        flagCount += 1;
        checkForWin();
      } else {
        cell.classList.remove("flag");
        cell.innerHTML = "";
        flagCount -= 1;
      }
      flagsLeft.innerHTML = numberOfSpies - flagCount;
    }
  }

  // click on cell actions
  function click(cell) {
    if (isGameOver || cell.classList.contains("checked") || cell.classList.contains("flag")) {
      return
    };
    if (cell.classList.contains("spy")) {
      cell.classList.add("badGuess");
      gameOver(cell);
    } else {
      let spyCount = cell.getAttribute("data");
      if (spyCount == 0) {
        cell.classList.add("checked");
        checkNeighboringCells(cell);
      } else {
        cell.classList.add("checked");
        cell.classList.add(numberClasses[spyCount]);
        cell.innerHTML = spyCount;
      }
    }
  }

  // check neighboring cells on clicked
  function checkNeighboringCells(cell) {
    const cellId = parseInt(cell.id);
    const isLeftEdge = (cellId % width === 0);
    const isRightEdge = (cellId % width === width - 1);
    const isTopRow = cellId < width;
    const isBottomRow = cellId >= width * (width - 1);

    setTimeout(function() {
      if ( ! isLeftEdge) {
        click(document.getElementById(allCells[cellId - 1].id)); // check cell left of this one
      }
      if ( ! isTopRow && ! isRightEdge) {
        click(document.getElementById(allCells[cellId + 1 - width].id)); // check cell above right of this one
      }
      if ( ! isTopRow) {
        click(document.getElementById(allCells[cellId - width].id)); // check cell above this one
      }
      if ( ! isTopRow && ! isLeftEdge) {
        click(document.getElementById(allCells[cellId - 1 - width].id)); // check cell above left of this one
      }
      if ( ! isRightEdge) {
        click(document.getElementById(allCells[cellId + 1].id)); // check cell right of this one
      }
      if ( ! isBottomRow && ! isLeftEdge) {
        click(document.getElementById(allCells[cellId - 1 + width].id)); // check cell below left of this one
      }
      if ( ! isBottomRow && ! isRightEdge) {
        click(document.getElementById(allCells[cellId + 1 + width].id)); // check cell below right of this one
      }
      if ( ! isBottomRow) {
        click(document.getElementById(allCells[cellId + width].id)); // check cell below this one
      }
    }, 20);
  }

  // Game is game over when player clicks a cell that is a spy.
  // Show all remaining spies.
  function gameOver() {
    result.innerHTML = "GAME OVER! You've been caught!";
    isGameOver = true;
    const delay = 30;
    let spyCount = 0;

    allCells.forEach(function(cell) {
      if (cell.classList.contains("spy")) {
        spyCount += 1;
        window.setTimeout(function() {
          cell.innerHTML = "🕵️";
          cell.classList.remove("spy");
          cell.classList.add("checked");
        }, delay * spyCount);
      }
    });
  }

  function checkForWin() {
    let matches = 0

    for (let i = 0; i < allCells.length; i += 1) {
      if (allCells[i].classList.contains("flag") && allCells[i].classList.contains("spy")) {
        matches += 1;
      }
      if (matches === numberOfSpies) {
        result.innerHTML = "YOU WIN! You found all the spies!";
        isGameOver = true;
      }
    }
  }
})
