export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades';

export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export interface DraftCard {
  rank: Rank | '';
  suit: Suit | '';
}

export interface ScoreEntry {
  label: string;
  points: number;
  cards?: Card[];
}

export interface HandScore {
  total: number;
  breakdown: {
    fifteens: ScoreEntry[];
    pairs: ScoreEntry[];
    runs: ScoreEntry[];
    flush: ScoreEntry | null;
    nobs: ScoreEntry | null;
  };
}

const rankOrder: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const FIFTEEN_VALUE: Record<Rank, number> = {
  A: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 10,
  Q: 10,
  K: 10,
};

const rankValue = (rank: Rank) => rankOrder.indexOf(rank) + 1;

const isRun = (cards: Card[]) => {
  const values = cards.map((card) => rankValue(card.rank)).sort((a, b) => a - b);

  for (let index = 1; index < values.length; index += 1) {
    if (values[index] === values[index - 1]) {
      return false;
    }

    if (values[index] !== values[index - 1] + 1) {
      return false;
    }
  }

  return true;
};

const buildCombinations = <T,>(items: T[], size: number, start = 0, prefix: T[] = []): T[][] => {
  if (prefix.length === size) {
    return [prefix];
  }

  const combinations: T[][] = [];

  for (let index = start; index <= items.length - (size - prefix.length); index += 1) {
    combinations.push(...buildCombinations(items, size, index + 1, [...prefix, items[index]]));
  }

  return combinations;
};

const describeCards = (cards: Card[]) => cards.map((card) => `${card.rank}${card.suit[0].toUpperCase()}`).join(', ');

export const scoreCribbageHand = (baseHand: Card[], starter: Card, isCrib = false): HandScore => {
  if (baseHand.length !== 4) {
    throw new Error('A cribbage hand must contain exactly four cards before the starter card.');
  }

  const fullHand = [...baseHand, starter];

  const fifteens = [2, 3, 4, 5].flatMap((size) =>
    buildCombinations(fullHand, size)
      .filter((combo) => combo.reduce((sum, card) => sum + FIFTEEN_VALUE[card.rank], 0) === 15)
      .map((combo) => ({
        label: `Fifteen for 2 (${describeCards(combo)})`,
        points: 2,
        cards: combo,
      })),
  );

  const pairs = buildCombinations(fullHand, 2)
    .filter(([left, right]) => left.rank === right.rank)
    .map(([left, right]) => ({
      label: `Pair for 2 (${describeCards([left, right])})`,
      points: 2,
      cards: [left, right],
    }));

  let runs: ScoreEntry[] = [];

  for (let size = fullHand.length; size >= 3; size -= 1) {
    const matchingRuns = buildCombinations(fullHand, size)
      .filter((combo) => isRun(combo))
      .map((combo) => ({
        label: `Run of ${size} (${describeCards(combo)})`,
        points: size,
        cards: combo,
      }));

    if (matchingRuns.length > 0) {
      runs = matchingRuns;
      break;
    }
  }

  const handSuit = baseHand[0].suit;
  const handFlush = baseHand.every((card) => card.suit === handSuit);
  const starterMatches = starter.suit === handSuit;
  let flush: ScoreEntry | null = null;

  if (isCrib) {
    if (handFlush && starterMatches) {
      flush = {
        label: 'Five-card flush',
        points: 5,
        cards: fullHand,
      };
    }
  } else if (handFlush) {
    flush = {
      label: starterMatches ? 'Five-card flush' : 'Four-card flush',
      points: starterMatches ? 5 : 4,
      cards: starterMatches ? fullHand : baseHand,
    };
  }

  const nobsCard = baseHand.find((card) => card.rank === 'J' && card.suit === starter.suit);
  const nobs = nobsCard
    ? {
        label: `His nobs (${describeCards([nobsCard, starter])})`,
        points: 1,
        cards: [nobsCard, starter],
      }
    : null;

  const total =
    fifteens.reduce((sum, item) => sum + item.points, 0) +
    pairs.reduce((sum, item) => sum + item.points, 0) +
    runs.reduce((sum, item) => sum + item.points, 0) +
    (flush?.points ?? 0) +
    (nobs?.points ?? 0);

  return {
    total,
    breakdown: {
      fifteens,
      pairs,
      runs,
      flush,
      nobs,
    },
  };
};
