import React from 'react';
import { DraftCard, Rank, Suit } from '../../utils/scoringLogic';
import './PlayerHand.css';

const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
const suits = ['clubs', 'diamonds', 'hearts', 'spades'] as const;

interface PlayerHandProps {
  cards: DraftCard[];
  onChange: (cards: DraftCard[]) => void;
}

const formatSuit = (suit: string) => suit.charAt(0).toUpperCase() + suit.slice(1);

export default function PlayerHand({ cards, onChange }: PlayerHandProps) {
  const updateCard = (index: number, field: 'rank' | 'suit', value: string) => {
    const nextCards = [...cards];
    const existing = nextCards[index] ?? { rank: '', suit: '' };
    nextCards[index] = {
      ...existing,
      [field]: value as Rank | Suit | '',
    };
    onChange(nextCards);
  };

  return (
    <section className="card-panel">
      <div className="panel-heading">
        <div>
          <p className="panel-label">Player Hand</p>
          <h2>Enter the four cards you kept.</h2>
        </div>
      </div>

      <div className="card-grid">
        {cards.map((card, index) => (
          <div className="card-input" key={`hand-card-${index + 1}`}>
            <span className="card-slot">Card {index + 1}</span>
            <label>
              Rank
              <select value={card?.rank ?? ''} onChange={(event) => updateCard(index, 'rank', event.target.value)}>
                <option value="">Select rank</option>
                {ranks.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Suit
              <select value={card?.suit ?? ''} onChange={(event) => updateCard(index, 'suit', event.target.value)}>
                <option value="">Select suit</option>
                {suits.map((suit) => (
                  <option key={suit} value={suit}>
                    {formatSuit(suit)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
