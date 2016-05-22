(function() {
  var width = 32;
  var height = 24;
  var cellSize = 20;
  var stepSpeed = 250; //in ms
  var isRunning = false;
  var cells = [];
  var directions = [new Pair(-1, -1), new Pair(0, -1), new Pair(1, -1),
                    new Pair(-1,  0),                  new Pair(1,  0),
                    new Pair(-1,  1), new Pair(0,  1), new Pair(1,  1)];

  $(document).ready(function() {
    var board = $("#board");
    $.jCanvas.defaults.fromCenter = false;
    initializeCells();
    drawGrid();
    board.click(function(e){
      if (isRunning) {
        return;
      }
      var col = Math.floor((e.pageX-board.offset().left) / cellSize);
      var row = Math.floor((e.pageY-board.offset().top) / cellSize);
      if (offBoard(col, row)) {
        return;
      }
      cells[col][row].alive = !cells[col][row].alive;
      calculateAllNeighbors();
      drawGrid();
    });

    var clearButton = $("#clear");
    var startStopButton = $("#start");
    startStopButton.click(function(){
      if (!isRunning && startStopButton.data("state") !== "running") {
        isRunning = true;
        startStopButton.val("Stop");
        startStopButton.data("state", "running");
        clearButton.toggle(false);
        step();
      } else {
        isRunning = false;
        startStopButton.val("Start");
        startStopButton.data("state", "stopped");
        clearButton.toggle(true);
      }
    });

    clearButton.click(function(){
      initializeCells();
      drawGrid();
    });
  });


  function initializeCells() {
    cells = [];
    for (var colNum = 0; colNum < width; colNum++) {
      var col = [];
      for (var rowNum = 0; rowNum < height; rowNum++) {
        col.push(new Cell(false));
      }
      cells.push(col);
    }
  }

  function drawGrid() {
    var board = $("#board");
    board.clearCanvas();
    for (var colNum = 0; colNum < width; colNum++) {
      for (var rowNum = 0; rowNum < height; rowNum++) {
        var fill = getFillStyle(colNum, rowNum);
        board.drawRect({
          strokeStyle: '#f3f3f3',
          fillStyle: fill,
          x: colNum * cellSize,
          y: rowNum * cellSize,
          width: cellSize,
          height: cellSize
        });
      }
    }
  }

  function getFillStyle(colNum, rowNum) {
    var fill = 'transparent';
    if (cells[colNum][rowNum].alive === true) {
      if (cells[colNum][rowNum].neighbors < 2) {
        fill = '#66ff66';
      } else if (cells[colNum][rowNum].neighbors <= 3) {
        fill = '#00e600';
      } else if (cells[colNum][rowNum].neighbors > 3) {
        fill = '#006600';
      }
    }
    return fill;
  }

  function calculateAllNeighbors() {
    for (var colNum = 0; colNum < width; colNum++) {
      for (var rowNum = 0; rowNum < height; rowNum++) {
        cells[colNum][rowNum].neighbors = calculateNeighbors(colNum, rowNum);
        cells[colNum][rowNum].nextAlive = getNextAlive(colNum, rowNum);
      }
    }
  }

  function calculateNeighbors(colNum, rowNum) {
    var neighbors = 0;
    for (var d = 0; d < directions.length; d++) {
      var direction = directions[d];
      var row = rowNum + direction.x;
      var col = colNum + direction.y;
      if (offBoard(col, row)) {
        continue;
      }
      if (cells[col][row].alive === true) {
        neighbors = neighbors + 1;
      }
    }
    return neighbors;
  }

  function getNextAlive(colNum, rowNum) {
    var nextAlive = false;
    if (cells[colNum][rowNum].alive === true) {
      if (cells[colNum][rowNum].neighbors >= 2 && cells[colNum][rowNum].neighbors <= 3) {
        nextAlive = true;
      }
    } else if (cells[colNum][rowNum].neighbors === 3) {
      nextAlive = true;
    }
    return nextAlive;
  }

  function offBoard(col, row) {
    return row < 0 || row >= height || col < 0 || col >= width;
  }

  function step() {
    if (isRunning === true) {
      setTimeout(function(){nextStep();}, stepSpeed);
    }
  }

  function nextStep() {
    for (var colNum = 0; colNum < width; colNum++) {
      for (var rowNum = 0; rowNum < height; rowNum++) {
        cells[colNum][rowNum].alive = cells[colNum][rowNum].nextAlive;
      }
    }
    calculateAllNeighbors();
    drawGrid();
    step();
  }

  function Cell(initialAlive) {
    this.alive = initialAlive;
    this.neighbors = 0;
    this.nextAlive = initialAlive;
  }

  function Pair(x, y) {
    this.x = x;
    this.y = y;
  }
})();
