# ScotWordle

Learn all the important Scottish swear words, insults and slang.

Play the game here:
<link>

## Features

- 6-letter words, 6 attempts, the classic green / yellow / gray feedback
- A definition of the answer after every game
- Share links: each game has a seed in the URL, so friends get the same word
- Copy your result and share
- On-screen keyboard that colours letters as you go, plus full physical keyboard support
- Responsive layout for mobile and desktop compatability

## How to play

Guess the word in six tries. After each guess the tiles change colour:

- 🟩 right letter, right place
- 🟨 right letter, wrong place
- ⬛ letter not in the word

## Built with

TypeScript (no framework), Vite, Vitest

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm test         # run the tests
npm run build    # production build
```

## Project structure

```
src/game.ts       game logic: guess evaluation and game state
src/ui.ts         board, keyboard, modal and sharing
src/words.ts      answers and definitions
src/game.test.ts  tests
```
