import { describe, expect, it } from "vitest";
import {
    evaluateGuess,
    Game,
    getAnswerForSeed,
    parseSeed,
    isValidGuess,
    max_attempts,
    word_length,
} from "./game";
import { ANSWERS, DEFINITIONS, EXTRA_GUESSES, VALID_GUESSES } from "./words";

describe("evaluateGuess", () => {
    it("marks every tile green for an exact match", () => {
        expect(evaluateGuess("NUMPTY", "NUMPTY")).toEqual(Array(6).fill("green"));
    });

    it("marks every tile gray when no letters are shared", () => {
        expect(evaluateGuess("ABCDEF", "GHIJKL")).toEqual(Array(6).fill("gray"));
    });

    it("marks letters in the wrong position yellow", () => {
        // Same letters, rotated by one position
        expect(evaluateGuess("BCDEFA", "ABCDEF")).toEqual(Array(6).fill("yellow"));
    });

    it("is case-insensitive", () => {
        expect(evaluateGuess("numpty", "NuMpTy")).toEqual(Array(6).fill("green"));
    });

    it("does not mark a repeated guess letter yellow more times than it appears in the answer", () => {
        // Answer has one A; guess has three. Only the first unmatched A is yellow.
        expect(evaluateGuess("AAABCD", "XYZAQR")).toEqual([
            "yellow", "gray", "gray", "gray", "gray", "gray",
        ]);
    });

    it("gives green priority over yellow for duplicate letters", () => {
        // Answer BUGGER has two Gs (positions 2 and 3). Guess has G at 0 and 2.
        // G at 2 is green; G at 0 is yellow (one G left over).
        expect(evaluateGuess("GXGXXX", "BUGGER")).toEqual([
            "yellow", "gray", "green", "gray", "gray", "gray",
        ]);
    });

    it("does not mark a letter yellow once all its copies are used by greens", () => {
        // Answer NUMPTY has one N, matched green at position 0; the second N is gray.
        expect(evaluateGuess("NNXXXX", "NUMPTY")).toEqual([
            "green", "gray", "gray", "gray", "gray", "gray",
        ]);
    });
});

describe("isValidGuess", () => {
    it("accepts a word from the list in any case", () => {
        expect(isValidGuess("NUMPTY")).toBe(true);
        expect(isValidGuess("numpty")).toBe(true);
    });

    it("rejects words not in the list", () => {
        expect(isValidGuess("ZZZZZZ")).toBe(false);
        expect(isValidGuess("XQZJKV")).toBe(false);
    });

    it("accepts ordinary English words, including plurals and British spellings", () => {
        for (const word of ["PLANET", "GARDEN", "CRISPS", "COLOUR", "FAVOUR", "QUICHE", "SELFIE"]) {
            expect(isValidGuess(word), word).toBe(true);
        }
    });

    it("accepts swears and insults", () => {
        for (const word of ["FUCKED", "WANKER", "TOSSER", "BUGGER"]) {
            expect(isValidGuess(word), word).toBe(true);
        }
    });

    it("accepts extra Scots words that aren't answers", () => {
        for (const word of EXTRA_GUESSES) {
            expect(isValidGuess(word), word).toBe(true);
        }
    });

    it("rejects names of people, places and days", () => {
        for (const word of ["ANDREW", "ARTHUR", "ROBERT", "LONDON", "FRANCE", "SYDNEY", "MONDAY", "GEORGE", "DUBLIN"]) {
            expect(isValidGuess(word), word).toBe(false);
        }
    });

    it("rejects words of the wrong length", () => {
        expect(isValidGuess("NUMPT")).toBe(false);
        expect(isValidGuess("NUMPTYS")).toBe(false);
        expect(isValidGuess("")).toBe(false);
    });
});

describe("parseSeed", () => {
    it("parses non-negative integers", () => {
        expect(parseSeed("0")).toBe(0);
        expect(parseSeed("42")).toBe(42);
    });

    it("returns null for missing or malformed input", () => {
        for (const raw of [null, "", "abc", "-1", "1.5", "1e3", " 7", "0x10", "99999999999999999999"]) {
            expect(parseSeed(raw), `input ${raw}`).toBeNull();
        }
    });
});

describe("getAnswerForSeed", () => {
    it("always returns an answer, wrapping large seeds", () => {
        expect(getAnswerForSeed(0)).toBe(ANSWERS[0]);
        expect(getAnswerForSeed(ANSWERS.length)).toBe(ANSWERS[0]);
        expect(getAnswerForSeed(Number.MAX_SAFE_INTEGER)).toBeDefined();
    });
});

describe("Game", () => {
    it("starts in the playing state with no guesses", () => {
        const game = new Game("numpty");
        expect(game.answer).toBe("NUMPTY");
        expect(game.status).toBe("playing");
        expect(game.guesses).toEqual([]);
        expect(game.statuses).toEqual([]);
    });

    it("records a valid guess and its evaluation", () => {
        const game = new Game("NUMPTY");
        expect(game.submitGuess("bampot")).toEqual({ ok: true });
        expect(game.guesses).toEqual(["BAMPOT"]);
        expect(game.statuses).toEqual([evaluateGuess("BAMPOT", "NUMPTY")]);
        expect(game.status).toBe("playing");
    });

    it("rejects an invalid guess without using an attempt", () => {
        const game = new Game("NUMPTY");
        expect(game.submitGuess("ZZZZZZ")).toEqual({ ok: false });
        expect(game.submitGuess("SHORT")).toEqual({ ok: false });
        expect(game.guesses).toEqual([]);
        expect(game.status).toBe("playing");
    });

    it("is won when the answer is guessed", () => {
        const game = new Game("NUMPTY");
        game.submitGuess("BAMPOT");
        expect(game.submitGuess("numpty")).toEqual({ ok: true });
        expect(game.status).toBe("won");
    });

    it("is lost after max_attempts wrong guesses", () => {
        const game = new Game("NUMPTY");
        const wrong = ANSWERS.filter((w) => w !== "NUMPTY").slice(0, max_attempts);

        wrong.forEach((word, i) => {
            expect(game.submitGuess(word)).toEqual({ ok: true });
            expect(game.status).toBe(i < max_attempts - 1 ? "playing" : "lost");
        });
        expect(game.guesses).toHaveLength(max_attempts);
    });

    it("is won when the answer is guessed on the last attempt", () => {
        const game = new Game("NUMPTY");
        ANSWERS.filter((w) => w !== "NUMPTY")
            .slice(0, max_attempts - 1)
            .forEach((word) => game.submitGuess(word));

        game.submitGuess("NUMPTY");
        expect(game.status).toBe("won");
    });

    it("accepts no more guesses once the game is over", () => {
        const game = new Game("NUMPTY");
        game.submitGuess("NUMPTY");
        expect(game.submitGuess("BAMPOT")).toEqual({ ok: false });
        expect(game.guesses).toEqual(["NUMPTY"]);
    });
});

describe("word list", () => {
    it("has only uppercase words of the right length", () => {
        for (const word of ANSWERS) {
            expect(word).toMatch(new RegExp(`^[A-Z]{${word_length}}$`));
        }
    });

    it("has only valid guesses that are six uppercase letters", () => {
        const bad = [...VALID_GUESSES].filter((w) => !/^[A-Z]{6}$/.test(w));
        expect(bad).toEqual([]);
        expect(VALID_GUESSES.size).toBeGreaterThan(10000);
    });

    it("has no duplicate answers", () => {
        expect(new Set(ANSWERS).size).toBe(ANSWERS.length);
    });

    it("accepts every answer as a valid guess", () => {
        for (const word of ANSWERS) {
            expect(VALID_GUESSES.has(word)).toBe(true);
        }
    });

    it("has a definition for every answer", () => {
        for (const word of ANSWERS) {
            expect(DEFINITIONS[word], `missing definition for ${word}`).toBeTruthy();
        }
    });
});
