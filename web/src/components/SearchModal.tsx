import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLessons, type SearchResult } from '../data/searchIndex';
import './SearchModal.css';

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      // Wait a tick for the modal to mount before focusing.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  function handleChange(value: string) {
    setQuery(value);
    setResults(searchLessons(value));
  }

  function goTo(result: SearchResult) {
    navigate(`/module/${result.moduleId}/lesson/${result.lessonId}`);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="search-modal__backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal__input-row">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lessons — try “herd immunity” or “CRISPR”"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button className="search-modal__close" onClick={onClose} aria-label="Close search">✕</button>
        </div>

        {query.trim().length >= 2 && (
          <div className="search-modal__results">
            {results.length === 0 ? (
              <p className="search-modal__empty">No lessons found for "{query}".</p>
            ) : (
              results.map((r) => (
                <button key={r.lessonId} className="search-modal__result" onClick={() => goTo(r)}>
                  <span className="search-modal__result-body">
                    <span className="search-modal__result-title">{r.lessonTitle}</span>
                    <span className="search-modal__result-snippet">{r.snippet}</span>
                    <span className="search-modal__result-module" style={{ color: r.moduleColor }}>
                      {r.moduleTitle}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
