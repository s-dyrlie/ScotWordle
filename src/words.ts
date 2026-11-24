import guessList from "./data/guesses.txt?raw";

export const ANSWERS: string[] = [
  "NUMPTY", "BAWBAG", "BAMPOT", "DOBBER", "GALLUS", "HACKIT",
  "CLARTY", "CLATTY", "NUGGET", "JOBBIE", "FANDAN", "MAWKIT",
  "BONNIE", "HOWLIN", "SCABBY", "TADGER", "WALLAP", "WEEGIE",
  "DRUTHY", "WHITEY", "CURPLE", "MINGER", "MUPPET", "NUTTER",
  "WANKER", "CODGER", "BUGGER", "TOSSER", "GUBBED", "LALDIE",
  "OXTERS", "BOGGIN", "BOWFIN", "RADGIE", "DAFTIE", "FEARTY", 
  "GADGIE", "NYAFFS", "TOLLIE","CHANTY", "SKELLY", "HEIDER",
  "PISHED", "MORTAL", "MINGIN", "HONKIN", "HUMMIN", "MOCKIT",
  "BOAKIN", "SCUDDY", "BEALIN", "BEAMER", "DREICH", "HAVERS", 
  "CRABIT", "FANKLE", "SCHEME", "PATTER", "SCOOBY", "SCOOSH", 
  "DINGIE", "BELTER",
];

// Extra Scots/slang words that are allowed as guesses but aren't answers
// (and aren't in the English dictionary list). Add more here.
export const EXTRA_GUESSES: string[] = [
  "SWALLY", "PLOOKS", "PLOOKY", "PECHIN", "KEEKIT", "KEEKIN", "YERSEL",
  "DOOKIN", "PEEVER", "CLYPES", "CLYPED", "JAKEYS",
];

// Every 6-letter English word except proper nouns (see scripts/build-guesses.mjs)
const DICTIONARY: string[] = guessList
  .split(/\r?\n/)
  .filter((line) => line !== "" && !line.startsWith("#"));

export const VALID_GUESSES: Set<string> = new Set([
  ...DICTIONARY,
  ...ANSWERS,
  ...EXTRA_GUESSES,
]);

export const DEFINITIONS: Record<string, string> = {
  NUMPTY: "an idiot or fool",
  BAWBAG: "a scrotum; used affectionately or as a general insult",
  BAMPOT: "an unhinged idiot",
  DOBBER: "slang for penis, commonly used as an insult",
  GALLUS: "bold, daring, or overconfident",
  HACKIT: "haggard or ugly",
  CLARTY: "dirty or covered in muck",
  CLATTY: "dirty or of questionable hygiene, same as clarty",
  NUGGET: "an unpredictable or foolish person",
  JOBBIE: "a piece of excrement",
  FANDAN: "a pretentious idiot",
  MAWKIT: "disgusting and covered in dirt",
  BONNIE: "beautiful or pretty",
  HOWLIN: "smelly",
  SCABBY: "dirty or of poor quality",
  TADGER: "slang for penis, used as a mild insult",
  WALLAP: "to hit or strike someone",
  WEEGIE: "a person from Glasgow",
  DRUTHY: "thirsty, especially for a drink",
  WHITEY: "vomit from drinking too much",
  CURPLE: "the buttocks",
  MINGER: "an unattractive person",
  MUPPET: "an incompetent or foolish person",
  NUTTER: "someone who is crazy or unhinged",
  WANKER: "a general term of contempt for an unpleasant person",
  CODGER: "an eccentric or foolish older person",
  BUGGER: "a mild, versatile term for an annoying person",
  TOSSER: "an irritating or contemptible person",
  GUBBED: "tired or exhausted",
  LALDIE: "a thrashing; a sound beating",
  OXTERS: "the armpits",
  BOGGIN: "disgusting or filthy",
  BOWFIN: "smelly or foul, same as boggin",
  RADGIE: "a volatile, aggressive nutcase; 'to take a radgie' is to lose the plot",
  DAFTIE: "a daft, foolish person",
  FEARTY: "a coward, a scaredy-cat",
  GADGIE: "a bloke, usually a dodgy-looking one",
  NYAFFS: "small, irritating, insignificant people (singular: nyaff)",
  TOLLIE: "a turd",
  CHANTY: "a chamber pot",
  SKELLY: "cross-eyed, squinting",
  HEIDER: "a headbutt",
  PISHED: "drunk",
  MORTAL: "absolutely steaming drunk",
  MINGIN: "disgusting; also very drunk",
  HONKIN: "stinking",
  HUMMIN: "reeking, smelly",
  MOCKIT: "filthy, manky",
  BOAKIN: "retching, about to be sick",
  SCUDDY: "naked, as in 'in the scuddy'",
  BEALIN: "raging, furious",
  BEAMER: "a red face from embarrassment ('taking a beamer')",
  DREICH: "dull, grey and wet weather",
  HAVERS: "nonsense, as in 'talking havers'",
  CRABIT: "grumpy, bad-tempered",
  FANKLE: "a tangle or muddle",
  SCHEME: "a council housing estate",
  PATTER: "chat or banter, as in 'the patter's pure mince'",
  SCOOBY: "a clue, as in 'nae scooby' (from Scooby-Doo rhyming slang)",
  SCOOSH: "a squirt; also something easy ('it's a scoosh')",
  DINGIE: "to ignore or snub someone",
  BELTER: "something brilliant",
};