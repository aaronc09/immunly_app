import React from 'react';
import type { Section as LessonSection } from '../data/curriculum';
import './LessonContent.css';

interface Props {
  sections: LessonSection[];
}

// Callouts in the curriculum are tagged with assorted colours. They collapse to
// two tones so lessons match the site palette: warm tags flag a caution, the
// rest use the brand accent.
const CAUTION_TAGS = new Set(['red', 'amber', 'orange']);

function calloutColor(tag?: string) {
  return tag && CAUTION_TAGS.has(tag) ? 'var(--warning)' : 'var(--accent)';
}

export default function LessonContent({ sections }: Props) {
  return (
    <div className="lesson-content">
      {sections.map((section, i) => {
        switch (section.type) {
          case 'text':
            return (
              <div key={i} className="lc-text">
                {section.heading && <h3 className="lc-heading">{section.heading}</h3>}
                <p className="lc-body">{section.body}</p>
              </div>
            );

          case 'callout':
            return (
              <div key={i} className="lc-callout" style={{ '--callout-color': calloutColor(section.color) } as React.CSSProperties}>
                <span className="lc-callout__label">{section.label}</span>
                <p>{section.text}</p>
              </div>
            );

          case 'table':
            return (
              <div key={i} className="lc-table-wrap">
                <h3 className="lc-heading">{section.heading}</h3>
                <table className="lc-table">
                  <thead>
                    <tr>
                      <th>{section.leftHeader}</th>
                      <th>{section.rightHeader}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, j) => (
                      <tr key={j}>
                        <td>{row.left}</td>
                        <td>{row.right}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'steps':
            return (
              <div key={i} className="lc-steps">
                <h3 className="lc-heading">{section.heading}</h3>
                <ol className="lc-steps__list">
                  {section.steps.map((step, j) => (
                    <li key={j} className="lc-step">
                      <div className="lc-step__num">{j + 1}</div>
                      <div className="lc-step__body">
                        <strong>{step.label}</strong>
                        <span>{step.detail}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );

          case 'terms':
            return (
              <div key={i} className="lc-terms">
                <h3 className="lc-heading">{section.heading}</h3>
                <dl className="lc-terms__list">
                  {section.terms.map((t, j) => (
                    <div key={j} className="lc-term">
                      <dt>{t.term}</dt>
                      <dd>{t.definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
