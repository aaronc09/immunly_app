import { useState, useMemo } from 'react';
import { REFERENCE_TABLES, type RefEntry } from '../data/reference';
import './ReferencePage.css';

function matches(row: RefEntry, q: string): boolean {
  if (!q) return true;
  const hay = [row.name, row.aka, row.fn, row.source, row.receptor]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

export default function ReferencePage() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string>('all');

  const filtered = useMemo(() => {
    return REFERENCE_TABLES
      .filter(t => active === 'all' || t.id === active)
      .map(t => ({ ...t, rows: t.rows.filter(r => matches(r, query)) }))
      .filter(t => t.rows.length > 0);
  }, [query, active]);

  const totalHits = filtered.reduce((s, t) => s + t.rows.length, 0);

  return (
    <div className="reference-page page-content">
      <div className="container">
        <div className="reference-header">
          <h1>Reference Library</h1>
          <p>
            The memorization-heavy material — every cytokine, ligand, and receptor in one searchable place.
            Use this as a lookup table while you work through the courses; you don't need to memorize it all at once.
          </p>
          <div className="reference-search">
            <input
              type="text"
              placeholder="Search by name, function, cell type… (e.g. 'IL-2', 'neutrophil', 'CXCR4')"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="reference-search__clear" onClick={() => setQuery('')}>✕</button>
            )}
          </div>
          {query && <div className="reference-hits">{totalHits} match{totalHits === 1 ? '' : 'es'}</div>}
        </div>

        {/* Category chips */}
        <div className="reference-chips">
          <button
            className={`ref-chip ${active === 'all' ? 'ref-chip--active' : ''}`}
            onClick={() => setActive('all')}
          >
            All
          </button>
          {REFERENCE_TABLES.map(t => (
            <button
              key={t.id}
              className={`ref-chip ${active === t.id ? 'ref-chip--active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.title.replace(/\s*\(.*\)/, '')}
            </button>
          ))}
        </div>

        {/* Tables */}
        {filtered.length === 0 ? (
          <div className="reference-empty">
            <p>No entries match "{query}".</p>
            <button className="btn btn-outline" onClick={() => setQuery('')}>Clear search</button>
          </div>
        ) : (
          filtered.map(table => (
            <section key={table.id} id={table.id} className="reference-table-block">
              <div className="reference-table-block__head">
                <h2>{table.title}</h2>
                <p>{table.blurb}</p>
              </div>
              <div className="reference-table-wrap card">
                <table className="reference-table">
                  <thead>
                    <tr>
                      {table.cols.map(c => (
                        <th key={c.key}>{c.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i}>
                        {table.cols.map(c => {
                          if (c.key === 'name') {
                            return (
                              <td key={c.key} className="reference-table__name">
                                {row.name}
                                {row.aka && <span className="reference-table__aka">{row.aka}</span>}
                              </td>
                            );
                          }
                          return <td key={c.key}>{row[c.key] || '—'}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
