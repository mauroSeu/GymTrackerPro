// src/App.jsx
import React, { useState, useEffect } from 'react';
import GymTracker from './components/GymTracker';
import BottomNavigation from './components/BottomNavigation';

// Funzione per caricare lo stato iniziale da localStorage
const getInitialState = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error loading cache for ${key}. Using default value.`, error);
    return defaultValue;
  }
};

// Mappa Temi Settimanali (invariata)
const weekThemeMap = {
  1: { base: 'from-teal-500 to-cyan-500', text: 'text-white', shadow: 'shadow-cyan-500/30' },
  2: { base: 'from-cyan-500 to-blue-500', text: 'text-white', shadow: 'shadow-blue-500/40' },
  3: { base: 'from-blue-500 to-indigo-500', text: 'text-white', shadow: 'shadow-indigo-500/40' },
  4: { base: 'from-indigo-500 to-purple-600', text: 'text-white', shadow: 'shadow-purple-600/40' },
  5: { base: 'from-purple-600 to-amber-500', text: 'text-white', shadow: 'shadow-amber-500/40' }
};

function App() {
  // Stato per la sezione attiva nella BottomNavigation
  const [activeSection, setActiveSection] = useState(getInitialState('activeSection', 'workout')); 

  // Stato per la settimana corrente (sollevato)
  const [currentWeek, setCurrentWeek] = useState(getInitialState('currentWeek', 1));

  // 🔥 AGGIUNTO: Stato PlayerMode (sollevato per controllare la navigazione)
  const [playerMode, setPlayerMode] = useState(getInitialState('playerMode', false));

  // Persistenza dello stato della settimana corrente
  useEffect(() => {
    localStorage.setItem('currentWeek', currentWeek);
  }, [currentWeek]);
  
  // 🔥 AGGIUNTO: Persistenza dello stato PlayerMode
  useEffect(() => {
    localStorage.setItem('playerMode', playerMode);
  }, [playerMode]);
  
  // Persistenza stato attivo navigazione (miglioramento UX)
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);


  // Calcolo del tema attivo basato sulla settimana
  const activeTheme = weekThemeMap[currentWeek] || weekThemeMap[1];

  // === Logica di rendering condizionale ===
  const PageContent = () => {
    switch (activeSection) {
      case 'workout':
      default:
        return (
          <GymTracker
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
            activeTheme={activeTheme.base} 
            // 🔥 PASSA LE NUOVE PROP:
            playerMode={playerMode}
            setPlayerMode={setPlayerMode}
          />
        );
      case 'dashboard':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-10 sm:py-20">
            <h2 className="text-3xl font-bold text-slate-300">Dashboard</h2>
            <p className="text-slate-500 mt-2">Qui andranno i tuoi obiettivi e il riepilogo giornaliero.</p>
          </div>
        );

      case 'progresso':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-10 sm:py-20">
            <h2 className="text-3xl font-bold text-slate-300">Progresso</h2>
            <p className="text-slate-500 mt-2">Qui avrai l'analisi dei tuoi progressi.</p>
          </div>
        );

      case 'altro':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-10 sm:py-20">
            <h2 className="text-3xl font-bold text-slate-300">Altro</h2>
            <p className="text-slate-500 mt-2">Impostazioni e altre opzioni.</p>
          </div>
        );
    }
  };

  return (
    // pb-20 è cruciale per lasciare spazio alla BottomNavigation, che viene nascosta in PlayerMode.
    <div className={`min-h-screen text-slate-100 ${!playerMode ? 'pb-20' : ''} pt-4 bg-gradient-to-br from-slate-900 to-gray-900 transition-all duration-500`}>

      <main className="max-w-7xl mx-auto">
        <PageContent />
      </main>

      {/* Navigazione Inferiore (Conditional Render) */}
      {/* 🔥 NASCONDE LA NAVIGAZIONE QUANDO IL PLAYER È ATTIVO */}
      {!playerMode && (
        <BottomNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      )}
    </div>
  );
}

export default App;

