import React, { useMemo, useState } from 'react';
import Crib from '../Crib/Crib';
import DrawCard from '../DrawCard/DrawCard';
import PlayerHand from '../PlayerHand/PlayerHand';
import ScoreResult from '../ScoreResult/ScoreResult';
import { Card, DraftCard, scoreCribbageHand } from '../../utils/scoringLogic';
import './HomePage.css';

const emptyCard = (): DraftCard => ({ rank: '', suit: '' });
const emptyCards = (): DraftCard[] => [emptyCard(), emptyCard(), emptyCard(), emptyCard()];

const toCard = (card: DraftCard): Card | null => (card.rank && card.suit ? { rank: card.rank, suit: card.suit } : null);

const serializeCard = (card: Card | null) => (card ? `${card.rank}-${card.suit}` : '');

const findDuplicates = (cards: Card[]) => {
  const counts = cards.reduce<Record<string, number>>((accumulator, card) => {
    const key = serializeCard(card);
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([key]) => key.replace('-', ' '));
};

export default function HomePage() {
  const [handCards, setHandCards] = useState<DraftCard[]>(emptyCards);
  const [cribCards, setCribCards] = useState<DraftCard[]>(emptyCards);
  const [starter, setStarter] = useState<DraftCard>(emptyCard());

  const completeHandCards = useMemo(() => handCards.map(toCard), [handCards]);
  const completeCribCards = useMemo(() => cribCards.map(toCard), [cribCards]);
  const completeStarter = useMemo(() => toCard(starter), [starter]);

  const allSelectedCards = useMemo(
    () => [...completeHandCards, ...completeCribCards, completeStarter].filter((card): card is Card => card !== null),
    [completeCribCards, completeHandCards, completeStarter],
  );

  const duplicateCards = useMemo(() => findDuplicates(allSelectedCards), [allSelectedCards]);
  const hasDuplicateCards = duplicateCards.length > 0;

  const handReady = completeHandCards.every((card) => card !== null) && completeStarter !== null && !hasDuplicateCards;
  const cribReady = completeCribCards.every((card) => card !== null) && completeStarter !== null && !hasDuplicateCards;

  const handScore = useMemo(
    () => (handReady ? scoreCribbageHand(completeHandCards as Card[], completeStarter as Card, false) : null),
    [completeHandCards, completeStarter, handReady],
  );

  const cribScore = useMemo(
    () => (cribReady ? scoreCribbageHand(completeCribCards as Card[], completeStarter as Card, true) : null),
    [completeCribCards, completeStarter, cribReady],
  );

  const resetBoard = () => {
    setHandCards(emptyCards());
    setCribCards(emptyCards());
    setStarter(emptyCard());
  };

  return (
    <main className="home-page">
      <section className="hero-panel">
        <p className="eyebrow">Cribbage Scoring</p>
        <h1>Score a hand, the crib, and the starter card in one place.</h1>
        <p className="hero-copy">
          Enter four cards for the hand, four for the crib if you want to score it too, and one starter.
          The app calculates fifteens, pairs, runs, flushes, and nobs with a full breakdown.
        </p>
        <div className="hero-actions">
          <button type="button" className="secondary-button" onClick={resetBoard}>
            Clear all cards
          </button>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="board-column">
          <PlayerHand cards={handCards} onChange={setHandCards} />
          <Crib cards={cribCards} onChange={setCribCards} />
          <DrawCard card={starter} onChange={setStarter} />
        </div>

        <div className="results-column">
          {hasDuplicateCards ? (
            <div className="warning-card">
              <h2>Duplicate cards found</h2>
              <p>Each physical card can only appear once across the hand, crib, and starter.</p>
              <p>{duplicateCards.join(', ')}</p>
            </div>
          ) : null}

          <ScoreResult
            title="Player hand"
            subtitle="Scores as a standard cribbage hand."
            result={handScore}
            isReady={handReady}
          />
          <ScoreResult
            title="Crib"
            subtitle="Uses crib flush rules."
            result={cribScore}
            isReady={cribReady}
          />
        </div>
      </section>
    </main>
  );
}
