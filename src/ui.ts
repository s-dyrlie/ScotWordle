import {Game, getAnswerForSeed, isValidGuess, max_attempts, parseSeed, word_length, type tileStatus} from "./game"
import {ANSWERS, DEFINITIONS} from "./words"


const existingSeed = getSeedFromUrl();
const seed = existingSeed ?? Math.floor(Math.random() * ANSWERS.length);

if (existingSeed === null) {
  const url = new URL(window.location.href);
  url.searchParams.set("seed", String(seed));
  window.history.replaceState({}, "", url);
}

let game = new Game(getAnswerForSeed(seed));


let currentGuess = "";

const board = document.querySelector("#board") as HTMLDivElement;
const keyboard = document.querySelector("#keyboard") as HTMLDivElement;
const message = document.querySelector("#message") as HTMLDivElement;


function startNewGame() {
  const newSeed = Math.floor(Math.random() * ANSWERS.length);

  const url = new URL(window.location.href);
  url.searchParams.set("seed", String(newSeed));
  window.history.replaceState({}, "", url);

  game = new Game(getAnswerForSeed(newSeed));
  currentGuess = "";
  message.textContent = "";
  createBoard(); 
  createKeyboard(); 
  hideModal();
}

const newGameButton = document.querySelector("#new-game") as HTMLButtonElement;
newGameButton.addEventListener("click", startNewGame);

function createBoard() {
    board.replaceChildren();

    for (let row = 0; row < max_attempts; row++) {
        const rowElement = document.createElement("div");
        rowElement.classList.add("row");

        for (let column = 0; column < word_length; column++) {
            const tile = document.createElement("div")
            tile.classList.add("tile");
            rowElement.appendChild(tile);
        }
        board.appendChild(rowElement);
    }
}

function createKeyboard() {
    const rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
    ];
    keyboard.replaceChildren();

  for (const row of rows) {
    const rowElement = document.createElement("div"); //create a <div> per row for easier styling
    rowElement.classList.add("keyboard-row");

    for (const key of row) {
      const button = document.createElement("button");
      button.dataset.key = key;
      button.textContent = key === "BACKSPACE" ? "⌫" : key;
      button.classList.add("key");

      if (key === "ENTER" || key === "BACKSPACE") {
        button.classList.add("wide"); //gives these keys a separate class for styling
      }

      button.addEventListener("click", () => {
        handleKey(key);
      });

      rowElement.appendChild(button);
    }

    keyboard.appendChild(rowElement);
  }
}

function updateKeyboardColors() {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".key");

  buttons.forEach((button) => {
    const key = button.dataset.key;
    if (!key) return;

    if (key === "ENTER" || key === "BACKSPACE") return;

    let bestStatus: tileStatus | null = null;

    for (let row = 0; row < game.guesses.length; row++) {
      const guess = game.guesses[row];
      const statuses = game.statuses[row];

      for (let i = 0; i < guess.length; i++) {
        if (guess[i] !== key) continue;

        const status = statuses[i];

        if (status === "green") {
          bestStatus = "green";
        } else if (status === "yellow" && bestStatus !== "green") {
          bestStatus = "yellow";
        } else if (status === "gray" && bestStatus === null) {
          bestStatus = "gray";
        }
      }
    }

    button.classList.remove("green", "yellow", "gray");
    if (bestStatus) {
      button.classList.add(bestStatus);
    }
  });
}

function updateBoard() {
    const tiles = document.querySelectorAll(".tile"); //fetch all tiles on the board

    for (let row = 0; row < game.guesses.length; row++) {
        const guess = game.guesses[row];
        const statuses = game.statuses[row];

        for (let column = 0; column < word_length; column++) {
            const tile  = tiles[row * word_length + column] as HTMLDivElement; //find tile on boeard
            tile.textContent = guess[column]; //show letter on tile
            tile.classList.add(statuses[column]); //adds tile to correct colour class
        }
    }
    if (game.status === "playing" && game.guesses.length < max_attempts) {
        const curRow = game.guesses.length; //finds active row

        for (let column = 0; column < word_length; column++) {
                const tile  = tiles[curRow * word_length + column] as HTMLDivElement; //find tile on boeard

                if (currentGuess[column]) {
                tile.textContent = currentGuess[column];
            } else {
                tile.textContent = "";
            }
        }
    }
    updateKeyboardColors();
}

function handleKey(key: string) {
    if (game.status !== "playing") return;

    if (key === "ENTER") {
        submitGuess();
        return;
    }

    message.textContent = "";

    if (key === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
        return;
    }

    if (currentGuess.length < word_length) {
        currentGuess += key;
        updateBoard();
    }
}

function submitGuess() {
    if (currentGuess.length < word_length) {
        message.textContent = "Not enough letters";
        return;
    }

    if (!isValidGuess(currentGuess)) {
        message.textContent = "Not in word list";
        return;
    }

    const result = game.submitGuess(currentGuess);

    if (result.ok === false) {
        return;
    }

    currentGuess = "";
    updateBoard();

    if (game.status === "won") {
        showModal(
            "You won!",
            `You solved it in ${game.guesses.length} ${game.guesses.length === 1 ? "attempt" : "attempts"}`
        );
    } else if (game.status === "lost") {
        showModal(
            "You lost!",
            `The answer was ${game.answer}`
        );
    } else {
        message.textContent = "";
    }
}

window.addEventListener("keydown", (event) => {
    // Leave browser/OS shortcuts (Cmd+R, Ctrl+C, ...) alone
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === "Enter") {
        // Stop Enter from also "clicking" whichever on-screen key has focus
        event.preventDefault();
        handleKey("ENTER");
    } else if (event.key === "Backspace") {
        handleKey("BACKSPACE");
    } else {
        const upper = event.key.toUpperCase();

        if (/^[A-Z]$/.test(upper)) {
            handleKey(upper);
        }
    }
});

const modalOverlay = document.querySelector("#modal-overlay") as HTMLDivElement;
const modalTitle = document.querySelector("#modal-title") as HTMLHeadingElement;
const modalText = document.querySelector("#modal-text") as HTMLParagraphElement;
const modalClose = document.querySelector("#modal-close") as HTMLButtonElement;
const resultGrid = document.querySelector("#result-grid") as HTMLDivElement;
const resultDefinition = document.querySelector("#result-definition") as HTMLDivElement;

function showModal(title: string, text: string) {
    modalTitle.textContent = title;
    modalText.textContent = text;

    const definition = DEFINITIONS[game.answer] ?? "no definition available";
    const defWord = document.createElement("p");
    defWord.className = "def-word";
    defWord.textContent = game.answer;
    const defText = document.createElement("p");
    defText.className = "def-text";
    defText.textContent = `Definition: ${definition}`;
    resultDefinition.replaceChildren(defWord, defText);

    resultGrid.textContent = buildShareText();
    modalOverlay.classList.remove("hidden"); //make modal visible
}

function hideModal() {
    modalOverlay.classList.add("hidden");
}

function buildShareText(): string {
  const result = game.status === "won"
    ? `${game.guesses.length}/${max_attempts}`
    : `X/${max_attempts}`;

  const grid = game.statuses
    .map((row) =>
      row
        .map((status) => {
          if (status === "green") return "🟩";
          if (status === "yellow") return "🟨";
          return "⬛";
        })
        .join("") 
    )
    .join("\n"); 

  return `ScotWordle \n${result}\n\n${grid}`;
}

const copyResultButton = document.querySelector("#copy-result") as HTMLButtonElement;

copyResultButton.addEventListener("click", async () => {
  const text = buildShareText();

  try {
    await navigator.clipboard.writeText(text);
    copyResultButton.textContent = "Copied";

    setTimeout(() => {
      copyResultButton.textContent = "Copy result";
    }, 2000);
  } catch (error) {
    console.error("Could not copy:", error);
  }
});

modalClose.addEventListener("click", hideModal);

function getSeedFromUrl(): number | null  {
    const params = new URLSearchParams(window.location.search);
    return parseSeed(params.get("seed"));
}

createBoard();
createKeyboard();