import React, { useState } from 'react';
import GymTracker from './components/GymTracker';
import BottomNavigation from './components/BottomNavigation';

function App() {
  // Lo stato serve ancora per la navigazione inferiore
  const [activeSection, setActiveSection] = useState('workout');

  // Logica di rendering condizionale delle pagine
  const PageContent = () => {
    switch (activeSection) {
      case 'workout':
        // **BRUTALITÀ UTILE:** Tutta la tua applicazione attuale è qui.
        return <GymTracker />;
      
      case 'home':
        return (
          // Aggiunto padding verticale per riempire l'area senza l'header
          <div className="max-w-5xl mx-auto p-4 text-center py-10 sm:py-20">
            <h2 className="text-3xl font-bold text-slate-300">Dashboard</h2>
            <p className="text-slate-500 mt-2">Qui andranno i tuoi obiettivi e il riepilogo giornaliero.</p>
          </div>
        );

      case 'stats':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-10 sm:py-20">
            <h2 className="text-3xl font-bold text-slate-300">Statistiche</h2>
            <p className="text-slate-500 mt-2">Qui avrai l'analisi dei tuoi progressi.</p>
          </div>
        );
        
      case 'profile':
        return (
          <div className="max-w-5xl mx-auto p-4 text-center py-10 sm:py-20">
            <h2 className="text-3xl font-bold text-slate-300">Profilo</h2>
            <p className="text-slate-500 mt-2">Dati utente e impostazioni personali.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // 'pt-4' aggiunto come piccolo margine superiore (nuovo: min-h-screen)
    // 'pb-20' è essenziale per evitare che la nav bar copra il contenuto
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 pt-4"> 
      
      {/* Header Fissato e Trasparente - Rimosso per pulizia */}

      {/* Contenuto Principale: Wrapper per il layout */}
      {/* Rimosso px-5 per permettere al GymTracker di gestire il suo padding interno */}
      <main className="max-w-7xl mx-auto">
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