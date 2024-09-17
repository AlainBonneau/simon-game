const app = {
  // just a utility var to remember all the colors
  colors: ["red", "green", "blue", "yellow"],

  // this var will contain the sequence said by Simon
  playerScore: document.getElementById("scoreboard"),
  replayBtn: document.getElementById("replay"),
  playerCounter: 0,
  counter: 0,
  sequence: [],
  isSimonTurn: false,
  isGameOver: false,
  isGameOn: false,

  drawCells: function () {
    const playground = document.getElementById("playground");
    for (const color of app.colors) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.id = color;
      cell.style.backgroundColor = color;
      playground.appendChild(cell);
      cell.addEventListener("click", app.userGuess);
    }
  },

  userGuess: function () {
    if (app.isSimonTurn) {
      app.showMessage("Mémorisez la séquence");
      return;
    }
    app.bumpCell(this.id);
    if (this.id === app.sequence[app.counter]) {
      app.counter++;

      if (app.counter === app.sequence.length) {
        app.playerCounter++; // Update player score immediately
        app.showScore(); // Directly show updated score
        app.showMessage("Bien joué !");
        setTimeout(app.nextMove, 1000);
      }
    } else {
      app.showMessage("Perdu !");
      app.endGame();
    }
  },

  nextMove: function () {
    app.showMessage("Mémorisez la séquence");
    app.counter = 0;
    app.isSimonTurn = true;
    let random = Math.floor(Math.random() * 4);
    app.sequence.push(app.colors[random]);
    app.simonSays(app.sequence);
  },

  bumpCell: function (color) {
    if (!app.isGameOn) {
      return;
    }
    // let's modify the style directly
    document.getElementById(color).style.borderWidth = "45px";
    // and reset the same style, after a small pause (150 ms)
    setTimeout(() => {
      document.getElementById(color).style.borderWidth = "0";
    }, 150);
  },

  newGame: function () {
    app.isGameOn = true;
    app.isGameOver = false;
    app.playerCounter = 0;
    app.showScore();
    app.counter = 0;
    app.showMessage("Mémorisez la séquence");
    app.sequence = [];
    for (let index = 0; index < 3; index++) {
      let random = Math.floor(Math.random() * 4);
      app.sequence.push(app.colors[random]);
    }

    app.isSimonTurn = true;
    app.simonSays(app.sequence);
  },

  simonSays: function (sequence) {
    if (sequence && sequence.length) {
      setTimeout(app.bumpCell, 500, sequence[0]);
      setTimeout(app.simonSays, 850, sequence.slice(1));
    } else {
      app.isSimonTurn = false;
      app.showMessage("Reproduisez la séquence");
    }
  },

  init: function () {
    app.drawCells();
    app.isSimonTurn = false;

    document.getElementById("go").addEventListener("click", app.newGame);
  },

  showMessage: function (message) {
    document.getElementById("message").innerHTML = message;
    document.getElementById("go").style.display = "none";
  },

  showButton: function () {
    document.getElementById("go").style.display = "block";
    document.getElementById("message").innerHTML = "";
  },

  endGame: function () {
    app.isGameOn = false;
    app.isGameOver = true;
    app.playerScore.innerHTML = `Partie terminée, votre score est de : ${app.playerCounter}`;
    app.sequence = [];
    app.counter = 0;
    app.isSimonTurn = false;
    app.replayBtn.style.display = "block";
    app.replayBtn.removeEventListener("click", app.refreshPage);
    app.replayBtn.addEventListener("click", app.refreshPage);
  },

  showScore: function () {
    app.playerScore.innerHTML = `Votre score est de : ${app.playerCounter}`;
  },

  refreshPage: function () {
    location.reload();
  },
};

document.addEventListener("DOMContentLoaded", app.init);

// Faire le design pour mobile + trouver un background adéquat + Chercher d'eventuel bug et/ou amélioration
