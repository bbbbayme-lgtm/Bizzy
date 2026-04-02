import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [abstract, setAbstract] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setAbstract('');

    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAbstract(data.abstract);
      setResults(data.results);
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '60px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '24px' }}>bizzyb 🔍</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '6px',
            background: '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {abstract && (
        <p style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          {abstract}
        </p>
      )}

      {results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map((r, i) => (
            <li key={i} style={{ marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1a0dab', textDecoration: 'none', fontSize: '1rem' }}
              >
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && results.length === 0 && query && (
        <p style={{ color: '#999' }}>No results found.</p>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
