import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const quickSearches = [
  'best brunch in Atlanta',
  'React responsive design tips',
  'Render deploy Node API',
  'today tech headlines',
];

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(180deg, #0f172a 0%, #111827 45%, #f8fafc 45%, #f8fafc 100%);
    color: #0f172a;
  }

  a {
    color: inherit;
  }

  .page {
    min-height: 100vh;
    padding: 32px 16px 48px;
  }

  .shell {
    max-width: 1100px;
    margin: 0 auto;
  }

  .hero {
    color: #f8fafc;
    margin-bottom: 28px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.06);
    margin-bottom: 18px;
  }

  .hero h1 {
    font-size: clamp(2.25rem, 6vw, 4.75rem);
    line-height: 0.95;
    margin: 0 0 14px;
    letter-spacing: -0.04em;
  }

  .hero p {
    max-width: 650px;
    margin: 0;
    color: rgba(248, 250, 252, 0.82);
    font-size: 1rem;
    line-height: 1.6;
  }

  .app-grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(260px, 0.95fr);
    gap: 20px;
    align-items: start;
  }

  .panel {
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 24px;
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(8px);
  }

  .search-panel {
    padding: 24px;
  }

  .sidebar {
    padding: 22px;
  }

  .search-form {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
  }

  .search-input {
    flex: 1;
    min-width: 0;
    padding: 16px 18px;
    font-size: 1rem;
    border-radius: 16px;
    border: 1px solid #dbe3f0;
    background: #f8fafc;
    color: #0f172a;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .search-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
    background: #fff;
  }

  .search-button {
    border: none;
    border-radius: 16px;
    padding: 0 22px;
    min-height: 54px;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #fff;
    font-size: 0.98rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 14px 24px rgba(79, 70, 229, 0.25);
  }

  .search-button:hover {
    transform: translateY(-1px);
  }

  .search-button:disabled {
    cursor: wait;
    opacity: 0.75;
    transform: none;
  }

  .helper-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }

  .chip {
    border: 1px solid #dbe3f0;
    background: #fff;
    color: #334155;
    padding: 10px 14px;
    border-radius: 999px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .chip:hover {
    border-color: #4f46e5;
    color: #312e81;
    background: #eef2ff;
  }

  .status {
    border-radius: 16px;
    padding: 14px 16px;
    margin-bottom: 16px;
    font-size: 0.96rem;
  }

  .status.loading {
    background: #eef2ff;
    color: #3730a3;
  }

  .status.error {
    background: #fff1f2;
    color: #be123c;
  }

  .summary-card {
    background: linear-gradient(135deg, #f8fafc, #eef2ff);
    border: 1px solid #dbe3f0;
    border-radius: 18px;
    padding: 18px;
    margin-bottom: 18px;
  }

  .summary-card h2,
  .results-header h2,
  .sidebar h3 {
    margin: 0 0 10px;
    font-size: 1rem;
  }

  .summary-card p,
  .empty-state p,
  .sidebar p,
  .result-snippet {
    margin: 0;
    color: #475569;
    line-height: 1.6;
  }

  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .result-count {
    font-size: 0.88rem;
    color: #64748b;
  }

  .results-list {
    display: grid;
    gap: 14px;
  }

  .result-card {
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 18px;
    background: #fff;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  }

  .result-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px rgba(15, 23, 42, 0.08);
    border-color: #c7d2fe;
  }

  .result-link {
    display: inline-block;
    color: #0f172a;
    text-decoration: none;
    font-size: 1.04rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .result-link:hover {
    color: #4338ca;
  }

  .result-meta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: #6366f1;
    font-size: 0.86rem;
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    border: 1px dashed #cbd5e1;
    border-radius: 18px;
    padding: 28px 18px;
    background: #f8fafc;
  }

  .sidebar-section + .sidebar-section {
    margin-top: 22px;
    padding-top: 22px;
    border-top: 1px solid #e2e8f0;
  }

  .sidebar-list {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    display: grid;
    gap: 10px;
  }

  .sidebar-list li {
    color: #334155;
    line-height: 1.5;
  }

  .footer-note {
    margin-top: 28px;
    text-align: center;
    color: #cbd5e1;
    font-size: 0.9rem;
  }

  @media (max-width: 900px) {
    .app-grid {
      grid-template-columns: 1fr;
    }

    .sidebar {
      order: -1;
    }
  }

  @media (max-width: 640px) {
    .page {
      padding: 20px 12px 36px;
    }

    .search-panel,
    .sidebar {
      padding: 18px;
      border-radius: 20px;
    }

    .search-form {
      flex-direction: column;
    }

    .search-button {
      width: 100%;
    }

    .hero p {
      font-size: 0.96rem;
    }
  }
`;

function formatDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'External result';
  }
}

function normalizeResults(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      title: item.title || item.Text || 'Untitled result',
      url: item.url || item.FirstURL || '#',
      snippet: item.snippet || item.description || item.Text || '',
    }))
    .filter((item) => item.url && item.url !== '#');
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [abstract, setAbstract] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearch, setLastSearch] = useState('');

  const hasResults = results.length > 0;
  const showEmpty = !loading && !error && lastSearch && !hasResults;

  const searchLabel = useMemo(() => {
    if (!lastSearch) return 'Search smarter';
    return `Results for “${lastSearch}”`;
  }, [lastSearch]);

  const runSearch = async (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setResults([]);
    setAbstract('');
    setLastSearch(trimmed);

    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(trimmed)}`);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAbstract(data.abstract || data.AbstractText || '');
      setResults(normalizeResults(data.results));
    } catch (err) {
      setError('Search ran into a problem. Try again in a sec.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await runSearch(query);
  };

  const handleQuickSearch = async (value) => {
    setQuery(value);
    await runSearch(value);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="shell">
          <header className="hero">
            <div className="eyebrow">⚡ Fast web search for everyday curiosity</div>
            <h1>bizzyb</h1>
            <p>
              A lightweight search app with a cleaner layout, mobile-friendly spacing, and a more polished
              results view.
            </p>
          </header>

          <main className="app-grid">
            <section className="panel search-panel">
              <form className="search-form" onSubmit={handleSubmit}>
                <input
                  className="search-input"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search anything..."
                  aria-label="Search query"
                />
                <button className="search-button" type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>

              <div className="helper-row">
                {quickSearches.map((item) => (
                  <button key={item} type="button" className="chip" onClick={() => handleQuickSearch(item)}>
                    {item}
                  </button>
                ))}
              </div>

              {loading && <div className="status loading">Pulling results for “{lastSearch || query}”...</div>}
              {error && <div className="status error">{error}</div>}

              {abstract && (
                <section className="summary-card">
                  <h2>Quick summary</h2>
                  <p>{abstract}</p>
                </section>
              )}

              <div className="results-header">
                <h2>{searchLabel}</h2>
                {hasResults && <span className="result-count">{results.length} result{results.length === 1 ? '' : 's'}</span>}
              </div>

              {hasResults ? (
                <div className="results-list">
                  {results.map((result, index) => (
                    <article className="result-card" key={`${result.url}-${index}`}>
                      <a
                        className="result-link"
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {result.title}
                      </a>
                      <div className="result-meta">↗ {formatDomain(result.url)}</div>
                      {result.snippet && <p className="result-snippet">{result.snippet}</p>}
                    </article>
                  ))}
                </div>
              ) : (
                showEmpty && (
                  <div className="empty-state">
                    <p>No results came back for that one. Try a broader phrase or tap one of the quick searches.</p>
                  </div>
                )
              )}
            </section>

            <aside className="panel sidebar">
              <section className="sidebar-section">
                <h3>What changed</h3>
                <p>
                  The interface now uses a card layout, stronger visual hierarchy, and spacing that adapts better on
                  smaller screens.
                </p>
              </section>

              <section className="sidebar-section">
                <h3>Mobile improvements</h3>
                <ul className="sidebar-list">
                  <li>• Search form stacks cleanly on phones</li>
                  <li>• Tap targets are larger and easier to hit</li>
                  <li>• Results read more like cards instead of a plain list</li>
                </ul>
              </section>

              <section className="sidebar-section">
                <h3>Next up</h3>
                <ul className="sidebar-list">
                  <li>• Add loading skeletons</li>
                  <li>• Save recent searches</li>
                  <li>• Introduce light/dark theme toggle</li>
                </ul>
              </section>
            </aside>
          </main>

          <div className="footer-note">Built for quick search, cleaner UI, and easier phone use.</div>
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
