import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <h1>bizzyb</h1>
      <p>Search app foundation is live.</p>
      <Analytics />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);