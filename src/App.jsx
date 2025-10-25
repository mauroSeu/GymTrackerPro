import React, { useState } from 'react';
import GymTracker from './components/GymTracker';
import BottomNavigation from './components/BottomNavigation'; // Assicurati che questo file esista in src/components/

function App() {
  // Inizializza lo stato per la sezione attiva.
  // 'workout' è il default dato che è la funzionalità principale.
  const [activeSection, setActiveSection] = useState('workout');

  // Mappa i titoli per l'Header
  const pageTitle = {
    home: '匠 Dashboard',
    workout: '潮 Scheda Allenamento',
    stats: '投 Statistiche',
    profile: '側 Profilo'
  };

  // Logica di rendering condizionale delle pagine
  const PageContent = () => {
    switch (activeSection) {
      case 'workout':
        // **BRUTALITÀ UTILE:** Tutta la tua applicazione attuale è qui.
        // GymTracker è il cuore del segmento 'workout'.
        return <GymTracker />;
      
      case 'home':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-20">
            <h2 className="text-3xl font-bold text-slate-300">Home / Dashboard</h2>
            <p className="text-slate-500 mt-2">Qui andranno i tuoi obiettivi e il riepilogo giornaliero.</p>
          </div>
        );

      case 'stats':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-20">
            <h2 className="text-3xl font-bold text-slate-300">Statistiche</h2>
            <p className="text-slate-500 mt-2">Implementazione richiesta: Grafici e analisi dei progressi.</p>
          </div>
        );
        
      case 'profile':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-20">
            <h2 className="text-3xl font-bold text-slate-300">Profilo</h2>
            <p className="text-slate-500 mt-2">Dati utente e impostazioni personali.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // 'pb-20' è essenziale per evitare che la nav bar copra il contenuto
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20"> 
      
      {/* Header Fissato e Trasparente */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-5 py-4 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {pageTitle[activeSection]}
          </h1>
        </div>
      </header>

      {/* Contenuto Principale: Wrapper per il layout */}
      <main className="max-w-7xl mx-auto px-5 py-5">
        <PageContent />
      </main>

      {/* Navigazione Inferiore */}
      <BottomNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
    </div>
  );
}

export default App;