import React from 'react';
import { HandScore } from '../../utils/scoringLogic';
import './ScoreResult.css';

interface ScoreResultProps {
  title: string;
  subtitle: string;
  result: HandScore | null;
  isReady: boolean;
}

const renderEntries = (heading: string, entries: Array<{ label: string; points: number }>) => (
  <div className="score-group">
    <h4>{heading}</h4>
    {entries.length > 0 ? (
      <ul>
        {entries.map((entry) => (
          <li key={`${heading}-${entry.label}`}>
            <span>{entry.label}</span>
            <strong>{entry.points}</strong>
          </li>
        ))}
      </ul>
    ) : (
      <p className="empty-copy">No {heading.toLowerCase()}.</p>
    )}
  </div>
);

export default function ScoreResult({ title, subtitle, result, isReady }: ScoreResultProps) {
  return (
    <section className="score-card">
      <div className="score-card-header">
        <div>
          <p className="panel-label">{title}</p>
          <h2>{subtitle}</h2>
        </div>
        <div className="score-total">
          <span>Total</span>
          <strong>{result?.total ?? '--'}</strong>
        </div>
      </div>

      {!isReady || !result ? (
        <p className="empty-copy">Finish choosing four cards and a starter card to calculate this score.</p>
      ) : (
        <div className="score-breakdown">
          {renderEntries('Fifteens', result.breakdown.fifteens)}
          {renderEntries('Pairs', result.breakdown.pairs)}
          {renderEntries('Runs', result.breakdown.runs)}
          {renderEntries('Flush', result.breakdown.flush ? [result.breakdown.flush] : [])}
          {renderEntries('Nobs', result.breakdown.nobs ? [result.breakdown.nobs] : [])}
        </div>
      )}
    </section>
  );
}
