export const isDev = Boolean(import.meta.env.DEV);

export const fuzzyScore = (text: string, term: string): number => {
  if (term === '') return 0;
  text = text.toLowerCase();
  term = term.toLowerCase();

  let score = 0;
  let termIndex = 0;

  for (const char of text) {
    if (char === term[termIndex]) {
      score += 1 - termIndex * 0.1;
      termIndex++;
      if (termIndex === term.length) return score;
    }
  }
  return termIndex === term.length ? score : -Infinity;
};
