import React from 'react';
import { DraftCard } from '../../utils/scoringLogic';
import './DrawCard.css';

const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
const suits = ['clubs', 'diamonds', 'hearts', 'spades'] as const;

interface DrawCardProps {
  card: DraftCard;
  onChange: (card: DraftCard) => void;
}

const formatSuit = (suit: string) => suit.charAt(0).toUpperCase() + suit.slice(1);

export default function DrawCard({ card, onChange }: DrawCardProps) {
  return (
    <section className="starter-panel">
      <div className="panel-heading">
        <div>
          <p className="panel-label">Starter</p>
          <h2>Choose the cut card.</h2>
        </div>
      </div>

      <div className="starter-grid">
        <label>
          Rank
          <select
            value={card.rank}
            onChange={(event) => onChange({ ...card, rank: event.target.value as DraftCard['rank'] })}
          >
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
          <select
            value={card.suit}
            onChange={(event) => onChange({ ...card, suit: event.target.value as DraftCard['suit'] })}
          >
            <option value="">Select suit</option>
            {suits.map((suit) => (
              <option key={suit} value={suit}>
                {formatSuit(suit)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
