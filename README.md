# Cribbage Scoring App

A React + TypeScript app for scoring a cribbage hand, the crib, and the starter card from a single screen.

## What The App Does

The app lets you:

- Enter a 4-card player hand
- Enter a 4-card crib
- Choose a starter card
- Score the hand and crib separately
- See a scoring breakdown for fifteens, pairs, runs, flushes, and nobs
- Catch duplicate card selections before trusting the result

The player hand uses normal cribbage hand rules, and the crib uses crib-specific flush rules.

## Tech Stack

- React 19
- TypeScript
- Vite

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`.

## Production Build

Build the app:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## How To Use It

1. Select the four cards in the player hand section.
2. Select the four cards in the crib section if you want to score the crib too.
3. Choose the starter card.
4. Review the score panels for the hand and crib totals.
5. Check the scoring breakdown to see exactly where each point came from.

If the app reports duplicate cards, update the selections until each physical card appears only once.

Use the `Clear all cards` button to reset the board and start a new score.

## Scoring Supported

The scoring engine currently handles:

- Fifteens
- Pairs
- Runs
- Flushes
- Nobs

## Project Structure

Important files:

- `src/components/HomePage/HomePage.tsx` manages app state and score calculation
- `src/components/PlayerHand/PlayerHand.tsx` renders player hand inputs
- `src/components/Crib/Crib.tsx` renders crib inputs
- `src/components/DrawCard/DrawCard.tsx` renders starter card inputs
- `src/components/ScoreResult/ScoreResult.tsx` renders totals and scoring details
- `src/utils/scoringLogic.ts` contains the cribbage scoring rules

## Possible Next Steps

- Add automated tests for known cribbage hands
- Add faster card selection with visual card buttons
- Add example hands for quick QA
- Add pegging score helpers
