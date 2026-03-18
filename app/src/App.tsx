import { useEffect, useState } from 'react';
import { initConsents } from './lib/ConsentManager';
import { CookieBanner } from './components/CookieBanner';
import { CookieSettings } from './components/CookieSettings';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    initConsents();
  }, []);

  return (
    <>
      {/* Routes + pages will go here */}

      {/* Always rendered — self-hides when consent is already stored */}
      <CookieBanner />

      {/* Modal — opened from footer "Gérer mes cookies" or Account page */}
      <CookieSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Temporary test button — simulates the footer "Gérer mes cookies" link */}
      <button
        onClick={() => setSettingsOpen(true)}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 900,
          padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
          background: '#3d6b4f', color: '#fff', border: 'none',
          fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600,
        }}
      >
        Gérer mes cookies
      </button>
    </>
  );
}

export default App;
