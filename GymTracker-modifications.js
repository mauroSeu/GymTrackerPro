// 🔥 MODIFICHE DA FARE A src/components/GymTracker.jsx
// Copia e incolla queste sezioni nel tuo file esistente

// ===================================
// 1️⃣ AGGIUNGI QUESTO IMPORT (dopo gli altri import all'inizio del file)
// ===================================

import { useFirestore } from '../hooks/useFirestore';


// ===================================
// 2️⃣ DENTRO IL COMPONENTE, SUBITO ALL'INIZIO (dopo "const GymTracker = () => {")
// ===================================

const GymTracker = () => {
  // 🔥 Hook Firebase - AGGIUNGI QUESTA SEZIONE
  const { 
    isLoading, 
    userData, 
    saveProgress, 
    saveCustomWeights, 
    saveSkippedDays 
  } = useFirestore();

  // I tuoi useState rimangono tutti uguali, non toccarli!
  const [currentDay, setCurrentDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedSets, setCompletedSets] = useState({});
  const [customWeights, setCustomWeights] = useState({});
  const [currentView, setCurrentView] = useState('workout');
  const [progressData, setProgressData] = useState({
    start: { weight: '67.3', chest: '', arm_r: '', arm_l: '', leg_r: '', leg_l: '', waist: '', date: '' },
    end: { weight: '', chest: '', arm_r: '', arm_l: '', leg_r: '', leg_l: '', waist: '', date: '' }
  });
  // ... tutti gli altri useState ...


// ===================================
// 3️⃣ AGGIUNGI QUESTI useEffect DOPO TUTTI GLI useState
// ===================================

  // 🔥 Carica dati da Firebase quando disponibili
  useEffect(() => {
    if (userData) {
      if (userData.completedSets) setCompletedSets(userData.completedSets);
      if (userData.customWeights) setCustomWeights(userData.customWeights);
      if (userData.skippedDays) setSkippedDays(userData.skippedDays);
      if (userData.progressData) setProgressData(userData.progressData);
    }
  }, [userData]);

  // 🔥 Salva automaticamente completedSets su Firebase
  useEffect(() => {
    if (!isLoading && Object.keys(completedSets).length > 0) {
      saveProgress(completedSets);
    }
  }, [completedSets, isLoading, saveProgress]);

  // 🔥 Salva automaticamente customWeights su Firebase
  useEffect(() => {
    if (!isLoading && Object.keys(customWeights).length > 0) {
      saveCustomWeights(customWeights);
    }
  }, [customWeights, isLoading, saveCustomWeights]);

  // 🔥 Salva automaticamente skippedDays su Firebase
  useEffect(() => {
    if (!isLoading) {
      saveSkippedDays(skippedDays);
    }
  }, [skippedDays, isLoading, saveSkippedDays]);


// ===================================
// 4️⃣ AGGIUNGI QUESTO LOADER ALL'INIZIO DEL RETURN
// (Prima di qualsiasi altro contenuto nel return)
// ===================================

  // 🔥 Mostra loader mentre carica i dati da Firebase
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-300 text-lg font-semibold">🔥 Caricamento dati...</p>
        </div>
      </div>
    );
  }

  // Il tuo return normale continua qui...
  return (
    <div className="min-h-screen bg-slate-900">
      {/* ... tutto il resto del tuo codice ... */}
    </div>
  );
};

export default GymTracker;


// ===================================
// ✅ FATTO! QUESTE SONO TUTTE LE MODIFICHE NECESSARIE
// ===================================

/* 
RIEPILOGO:
1. Import dell'hook useFirestore
2. Chiamata dell'hook all'inizio del componente
3. 4 useEffect per caricare e salvare automaticamente
4. Loader all'inizio del return

Il resto del tuo codice rimane IDENTICO! 
*/
