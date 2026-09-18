export const WORD_LENGTH = 8;

export const ANSWERS: string[] = [
  "NUMPTY", "BAWBAG", "BAMPOT", "DOBBER", "GALLUS", "HACKIT",
  "CLARTY", "CLATTY", "NUGGET", "JOBBIE", "FANDAN", "MAWKIT",
  "BONNIE", "HOWLIN", "SCABBY", "TADGER", "WALLAP", "WEEGIE",
  "DRUTHY", "WHITEY", "CURPLE", "MINGER", "MUPPET", "NUTTER",
  "WANKER", "CODGER", "BUGGER", "TOSSER", "GUBBED", "LALDIE",
  "OXTERS", "BOGGIN", "BOWFIN",
];

export const VALID_GUESSES: Set<string> = new Set(ANSWERS);

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
}; 
