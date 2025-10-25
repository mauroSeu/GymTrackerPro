import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, Calendar, Target, Clock, Play, X, Check, Activity } from 'lucide-react';
import { workoutDays } from '../data/workoutData';
import PlayerMode from './PlayerMode';
import SettingsModal from './SettingsModal';
import ProgressTracker from './ProgressTracker';
import { useFirestore } from '../hooks/useFirestore'; 

// === Hook useDebounce ===
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useMemo(() => {
    const debouncedFn = (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
    
    // Funzione .cancel() per la pulizia
    debouncedFn.cancel = () => {
      clearTimeout(timeoutRef.current);
    };
    
    return debouncedFn;
  }, [callback, delay]);
};

// === FUNZIONE DI CACHE-FIRST RENDERING (Lettura di Fallback) ===
const getInitialState = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    // Returns the saved value, or the default if null/error
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error loading cache for ${key}. Using default value.`, error);
    return defaultValue;
  }
};

const GymTracker = () => {
  // 🔥 Hook Firebase con i 4 pilastri
  // lastSyncedData è cruciale per la logica anti-loop
  const { 
    isLoading, 
    userData, 
    saveProgress, 
    saveCustomWeights, 
    saveSkippedDays,
    saveProgressData, 
    processOfflineQueue,
    lastSyncedData 
  } = useFirestore();

  // Debounced Functions
  const debouncedSaveProgress = useDebounce(saveProgress, 1000); 
  const debouncedSaveCustomWeights = useDebounce(saveCustomWeights, 1000);
  const debouncedSaveSkippedDays = useDebounce(saveSkippedDays, 500);
  const debouncedSaveProgressData = useDebounce(saveProgressData, 2000);

  // STATI INIZIALI CON FALLBACK LOCALE/HARDCODED
  const [currentDay, setCurrentDay] = useState(getInitialState('currentDay', 0));
  const [currentWeek, setCurrentWeek] = useState(getInitialState('currentWeek', 1));
  const [completedSets, setCompletedSets] = useState(getInitialState('completedSets', {}));
  const [customWeights, setCustomWeights] = useState(getInitialState('customWeights', {}));
  const [currentView, setCurrentView] = useState(getInitialState('currentView', 'workout'));
  const [progressData, setProgressData] = useState(getInitialState('progressData', {
    start: {
      weight: '67.3', 
      chest: '', arm_r: '', arm_l: '', leg_r: '', leg_l: '', waist: '', date: ''
    },
    end: {
      weight: '', chest: '', arm_r: '', arm_l: '', leg_r: '', leg_l: '', waist: '', date: ''
    }
  }));
  
  const [playerMode, setPlayerMode] = useState(getInitialState('playerMode', false));
  const [currentExercise, setCurrentExercise] = useState(getInitialState('currentExercise', 0));
  const [currentSet, setCurrentSet] = useState(getInitialState('currentSet', 0));
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [skippedDays, setSkippedDays] = useState(getInitialState('skippedDays', {}));
  const [editingWeight, setEditingWeight] = useState(null);
  
  const modalScrollRef = useRef(null);

  const dayDisplayMap = [
    { label: "Push", icon: "💪" },
    { label: "Legs", icon: "🦵" },
    { label: "Pull", icon: "🏋️" },
    { label: "Upper", icon: "💎" },
    { label: "Recovery", icon: "🧘" }
  ];

  const currentDayData = workoutDays[currentDay];
  const currentExerciseData = currentDayData?.exercises[currentExercise]; 

  // Calcola le date di allenamento
  const getWorkoutDate = (week, day) => {
    const startDate = new Date(2025, 9, 27);
    const dayLabels = ['Lun', 'Mar', 'Gio', 'Ven', 'Sab'];
    const monthLabels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const weeksOffset = week - 1;
    let totalDaysToAdd = weeksOffset * 7;
    const daysInWeek = [0, 1, 3, 4, 5];
    totalDaysToAdd += daysInWeek[day];
    
    const workoutDate = new Date(startDate);
    workoutDate.setDate(startDate.getDate() + totalDaysToAdd);
    
    const dayNum = workoutDate.getDate();
    const monthName = monthLabels[workoutDate.getMonth()];
    
    return { dayName: dayLabels[day], dayNum, monthName };
  };

  // Verifica se tutti i set di un giorno sono completati
  const isDayCompleted = (week, day) => {
    const dayExercises = workoutDays[day].exercises;
    let totalSets = 0;
    let completedSetsCount = 0;

    dayExercises.forEach((exercise, exerciseIndex) => {
      totalSets += exercise.sets;
      for (let setIndex = 0; setIndex < exercise.sets; setIndex++) {
        const key = `${day}-${week}-${exerciseIndex}-${setIndex}`;
        if (completedSets[key]) {
          completedSetsCount++;
        }
      }
    });

    return totalSets > 0 && completedSetsCount === totalSets;
  };

  // Funzione per segnare un giorno come saltato o riattivarlo
  const toggleSkipDay = (week, day) => {
    const key = `${day}-${week}`;
    setSkippedDays(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Verifica se un giorno è segnato come saltato
  const isDaySkipped = (week, day) => {
    const key = `${day}-${week}`;
    return skippedDays[key] || false;
  };

  // Verifica se l'intera settimana è completata
  const isWeekCompleted = (week) => {
    for (let day = 0; day < 5; day++) {
      if (isDaySkipped(week, day)) continue;
      if (!isDayCompleted(week, day)) {
        return false;
      }
    }
    return true;
  };


  // 🆕 EFFECT 0: Persistenza Immediata degli stati UI critici (per Fallback Immediato)
  useEffect(() => {
    localStorage.setItem('currentDay', currentDay);
    localStorage.setItem('currentWeek', currentWeek);
    localStorage.setItem('currentView', currentView);
    localStorage.setItem('currentExercise', currentExercise);
    localStorage.setItem('currentSet', currentSet);
    localStorage.setItem('playerMode', playerMode);
  }, [currentDay, currentWeek, currentView, currentExercise, currentSet, playerMode]);


  // 🔥 1. Carica dati da Firebase quando disponibili (Cloud > Locale)
  useEffect(() => {
    // Quando i dati Cloud arrivano, hanno la priorità e sovrascrivono la cache locale.
    if (userData) {
      if (userData.completedSets) setCompletedSets(userData.completedSets);
      if (userData.customWeights) setCustomWeights(userData.customWeights);
      if (userData.skippedDays) setSkippedDays(userData.skippedDays);
      if (userData.progressData) setProgressData(userData.progressData);
    }
  }, [userData]);


  // 🆕 2. EFFECT PER COMPLETED SETS (Salvataggio Locale + Debounce Anti-Loop)
  useEffect(() => {
    // 1. Salvataggio locale IMMEDIATO
    localStorage.setItem('completedSets', JSON.stringify(completedSets));
    
    // 2. Chiamata API disciplinata: CONTROLLO ANTI-LOOP
    const currentJson = JSON.stringify(completedSets);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.completedSets || {});
    
    // ⚠️ Salva su Cloud SOLO se non è in caricamento E il dato è cambiato rispetto all'ultima sincronizzazione riuscita
    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveProgress(completedSets);
    }
    return () => { 
      debouncedSaveProgress.cancel(); 
    };
  }, [completedSets, isLoading, debouncedSaveProgress, lastSyncedData]);
  
  // 🆕 3. EFFECT PER CUSTOM WEIGHTS (Salvataggio Locale + Debounce Anti-Loop)
  useEffect(() => {
    localStorage.setItem('customWeights', JSON.stringify(customWeights));
    
    const currentJson = JSON.stringify(customWeights);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.customWeights || {});

    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveCustomWeights(customWeights);
    }
    return () => {
      debouncedSaveCustomWeights.cancel();
    };
  }, [customWeights, isLoading, debouncedSaveCustomWeights, lastSyncedData]);

  // 🆕 4. EFFECT PER SKIPPED DAYS (Salvataggio Locale + Debounce Anti-Loop)
  useEffect(() => {
    localStorage.setItem('skippedDays', JSON.stringify(skippedDays));
    
    const currentJson = JSON.stringify(skippedDays);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.skippedDays || {});

    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveSkippedDays(skippedDays);
    }
    return () => {
      debouncedSaveSkippedDays.cancel();
    };
  }, [skippedDays, isLoading, debouncedSaveSkippedDays, lastSyncedData]);
  
  // 🆕 5. EFFECT PER PROGRESS DATA (Salvataggio Locale + Debounce Anti-Loop)
  useEffect(() => {
    localStorage.setItem('progressData', JSON.stringify(progressData));

    const currentJson = JSON.stringify(progressData);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.progressData || {});
    
    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveProgressData(progressData);
    }
    return () => {
      debouncedSaveProgressData.cancel();
    };
  }, [progressData, isLoading, debouncedSaveProgressData, lastSyncedData]);


  // 🆕 6. CRITICAL EFFECT FOR AUTO-RETRY (Active Synchronization)
  useEffect(() => {
    // Si attiva solo DOPO il caricamento iniziale (che include il fallback)
    if (!isLoading && processOfflineQueue && navigator.onLine) {
        processOfflineQueue(); 
    }
  }, [isLoading, processOfflineQueue]);
  

  // Rest Timer Logic (unchanged)
  useEffect(() => {
    let interval;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  // Auto-scroll logic (unchanged)
  useEffect(() => {
    if (showSettings && modalScrollRef.current) {
      const cardWidth = 320 + 16;
      const scrollPosition = currentExercise * cardWidth - (modalScrollRef.current.clientWidth / 2) + (cardWidth / 2);
      modalScrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [showSettings, currentExercise]);

  // Toggle Set Complete (unchanged)
  const toggleSetComplete = (exerciseIndex, setIndex) => {
    const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Player Mode Activation
  const startPlayerMode = () => {
    setPlayerMode(true);
    setCurrentExercise(getInitialState('currentExercise', 0));
    setCurrentSet(getInitialState('currentSet', 0));
    setIsResting(false);
    setRestTimer(0);
  };

  // Complete Set Logic (unchanged)
  const completeSet = () => {
    if (!currentExerciseData) return;
    
    toggleSetComplete(currentExercise, currentSet);
    
    if (currentSet < currentExerciseData.sets - 1) {
      setCurrentSet(currentSet + 1);
      startRest();
    } else if (currentExercise < currentDayData.exercises.length - 1) {
       setCurrentExercise(currentExercise + 1);
       setCurrentSet(0);
       startRest();
    } else {
      setIsResting(false);
    }
  };

  // Skip Set Logic (unchanged)
  const skipSet = () => {
    if (!currentExerciseData) return;
    
    if (currentSet < currentExerciseData.sets - 1) {
      setCurrentSet(currentSet + 1);
    } else {
      if (currentExercise < currentDayData.exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setCurrentSet(0);
      }
    }
    setIsResting(false);
  };

  // Navigation Logic (unchanged)
  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setCurrentSet(0);
      setIsResting(false);
    }
  };

  // Navigation Logic (unchanged)
  const nextExercise = () => {
    if (currentExercise < currentDayData.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setCurrentSet(0);
      setIsResting(false);
    }
  };

  // Start Rest Logic (unchanged)
  const startRest = () => {
    if (!currentExerciseData) return; 

    const restTimeStr = currentExerciseData.rest.split('-')[0].trim().replace('sec', '');
    const restTime = parseInt(restTimeStr);
    
    setRestTimer(restTime);
    setIsResting(true);
  };

  // Format Time (unchanged)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSaveProgress = (data) => {
    setProgressData(data);
  };

  // --- RENDERING ---

  // Player Mode View
  if (playerMode) {
    return (
      <>
        <PlayerMode
          currentDay={currentDay}
          currentWeek={currentWeek}
          currentExercise={currentExercise}
          currentSet={currentSet}
          isResting={isResting}
          restTimer={restTimer}
          completedSets={completedSets}
          customWeights={customWeights}
          workoutDays={workoutDays}
          setPlayerMode={setPlayerMode}
          toggleSetComplete={toggleSetComplete}
          completeSet={completeSet}
          skipSet={skipSet}
          previousExercise={previousExercise}
          nextExercise={nextExercise}
          setShowSettings={setShowSettings}
          formatTime={formatTime}
        />
        <SettingsModal
          show={showSettings}
          onClose={() => setShowSettings(false)}
          currentDay={currentDay}
          currentWeek={currentWeek}
          currentExercise={currentExercise}
          workoutDays={workoutDays}
          modalScrollRef={modalScrollRef}
          completedSets={completedSets}
          customWeights={customWeights}
        />
      </>
    );
  }
  
  // Progress Tracker View
  if (currentView === 'tracker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 font-sans">
        <ProgressTracker 
          progressData={progressData}
          onSave={handleSaveProgress}
          onSwitchView={setCurrentView}
        />
      </div>
    );
  }

  // Loader (Only active during the 3s timeout or successful connection attempt)
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
  
  // Main View (Always renders when isLoading is false, using Cache-First data)
  return (
    <div className="text-white font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('tracker')}
              className="p-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all shadow-lg flex items-center gap-2 text-sm font-semibold"
              aria-label="Apri Progress Tracker"
            >
              <Activity className="w-5 h-5 text-green-400" />
              Progressi
            </button>
            
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <Dumbbell className="w-10 h-10 text-blue-400" />
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Gym Tracker
                </h1>
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                Scheda PPL - Settimana {currentWeek} di 5
              </p>
            </div>
            
            {/* Placeholder for symmetry */}
            <div className="w-[105px] h-[40px] hidden sm:block"></div> 
          </div>
        </div>

        {/* Week Tabs Selector */}
        <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-2xl p-4 mb-6 shadow-xl border border-gray-700">
          <h2 className="text-lg font-bold text-gray-300 mb-3 ml-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Ciclo di 5 Settimane
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, weekIndex) => {
              const weekNumber = weekIndex + 1;
              const isCurrent = weekNumber === currentWeek;
              const isCompleted = isWeekCompleted(weekNumber);
              
              return (
                <button
                  key={weekIndex}
                  onClick={() => setCurrentWeek(weekNumber)}
                  className={`p-3 rounded-xl transition-all text-center relative overflow-hidden ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : isCompleted
                      ? 'bg-green-700/80 text-white hover:bg-green-600'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  aria-label={`Settimana ${weekNumber}`}
                >
                  {isCompleted && (
                    <div className="absolute top-1 right-1 bg-white p-0.5 rounded-full">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                  )}
                  <div className="text-xl font-extrabold">
                    {weekNumber}
                  </div>
                  <div className="text-xs font-semibold opacity-90">
                    Sett.
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Navigation */}
        <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
              disabled={currentDay === 0}
              className={`p-3 rounded-full transition-all ${
                currentDay === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
              }`}
              aria-label="Giorno precedente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex-1 text-center">
              <div className={`inline-block bg-gradient-to-r ${currentDayData.color} rounded-2xl px-6 py-3 mb-3 shadow-lg`}>
                <div className="text-4xl mb-1">{currentDayData.icon}</div>
                <div className="text-xl font-bold">{currentDayData.shortName}</div>
                <div className="text-xs opacity-90">
                  {getWorkoutDate(currentWeek, currentDay).dayName} {getWorkoutDate(currentWeek, currentDay).dayNum} {getWorkoutDate(currentWeek, currentDay).monthName}
                </div>
              </div>
              
              {isDayCompleted(currentWeek, currentDay) && !isDaySkipped(currentWeek, currentDay) && (
                <div className="text-green-400 text-sm font-semibold flex items-center gap-1 justify-center mt-2">
                  <Check className="w-4 h-4" />
                  Allenamento Completato!
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentDay(Math.min(4, currentDay + 1))}
              disabled={currentDay === 4}
              className={`p-3 rounded-full transition-all ${
                currentDay === 4
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105'
              }`}
              aria-label="Giorno successivo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Day Pills */}
          <div className="grid grid-cols-5 gap-2">
            {dayDisplayMap.map((day, idx) => {
              const isCompleted = isDayCompleted(currentWeek, idx);
              const isSkipped = isDaySkipped(currentWeek, idx);
              const isCurrent = idx === currentDay;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentDay(idx)}
                  className={`p-3 rounded-xl transition-all text-center ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : isSkipped
                      ? 'bg-gray-700 text-gray-500'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  aria-label={`Giorno ${day.label}`}
                >
                  <div className="text-2xl mb-1">{day.icon}</div>
                  <div className="text-xs font-semibold">{day.label}</div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={startPlayerMode}
              disabled={isDaySkipped(currentWeek, currentDay)}
              className={`flex-1 py-4 rounded-full font-bold text-lg transition-transform shadow-xl flex items-center justify-center gap-2 ${
                isDaySkipped(currentWeek, currentDay)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105'
              }`}
              aria-label="Inizia allenamento"
            >
              <Play className="w-5 h-5" />
              Inizia Allenamento
            </button>
            <button
              onClick={() => toggleSkipDay(currentWeek, currentDay)}
              className={`px-6 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2 ${
                isDaySkipped(currentWeek, currentDay)
                  ? 'bg-gray-700 text-white'
                  : 'bg-red-600 text-white'
              }`}
              aria-label={isDaySkipped(currentWeek, currentDay) ? 'Riattiva giorno' : 'Salta giorno'}
            >
              <X className="w-5 h-5" />
              {isDaySkipped(currentWeek, currentDay) ? 'Riattiva' : 'Salta Giorno'}
            </button>
          </div>
        </div>

        {/* Exercise List */}
        {isDaySkipped(currentWeek, currentDay) ? (
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-2xl font-bold mb-2">Giorno Saltato</h3>
            <p className="text-gray-400">Hai deciso di saltare questo allenamento per la Settimana {currentWeek}.</p>
            <p className="text-gray-400 text-sm mt-2">Clicca su "Riattiva" per riprendere la progressione.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDayData.exercises.map((exercise, exerciseIndex) => {
              const weekData = exercise.weeklyPlan[currentWeek - 1];
              const completedCount = Array.from({ length: exercise.sets }).filter((_, setIndex) => {
                const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
                return completedSets[key];
              }).length;
              
              const weightKey = `${currentDay}-${currentWeek}-${exerciseIndex}`;
              const customWeight = customWeights[weightKey];
              const displayWeight = customWeight || weekData.weight;
              const isEditingThisWeight = editingWeight === weightKey;
              
              return (
                <div key={exerciseIndex} className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-blue-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-white">{exercise.name}</h3>
                      <p className="text-sm text-blue-400 italic mb-3">{exercise.focus}</p>
                      
                      <div className="flex flex-wrap gap-2 text-sm mb-3">
                        <div className="flex items-center gap-1 bg-blue-500 bg-opacity-20 px-3 py-1.5 rounded-full">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold">{weekData.sets}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-500 bg-opacity-20 px-3 py-1.5 rounded-full">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span>
                            {(() => {
                              const restParts = exercise.rest.replace(' sec', '').split('-').map(s => s.trim());
                              return restParts[0] + ' sec';
                            })()}
                          </span>
                        </div>
                        
                        {isEditingThisWeight ? (
                          <div className="flex items-center gap-1 bg-purple-500 bg-opacity-20 px-2 py-1 rounded-full border border-purple-500">
                            <Dumbbell className="w-4 h-4 text-purple-400" />
                            <input
                              type="text"
                              pattern="[0-9]*[.,]?[0-9]*"
                              placeholder="es. 50"
                              autoFocus
                              className="bg-transparent text-white w-16 outline-none font-semibold text-center"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const value = e.target.value.trim();
                                  if (value) {
                                    setCustomWeights(prev => ({
                                      ...prev,
                                      [weightKey]: value + (value.includes('kg') ? '' : 'kg')
                                    }));
                                  }
                                  setEditingWeight(null);
                                } else if (e.key === 'Escape') {
                                  setEditingWeight(null);
                                }
                              }}
                              onBlur={(e) => {
                                const value = e.target.value.trim();
                                if (value) {
                                  setCustomWeights(prev => ({
                                    ...prev,
                                    [weightKey]: value + (value.includes('kg') ? '' : 'kg')
                                  }));
                                }
                                setEditingWeight(null);
                              }}
                            />
                            <span className="text-xs">kg</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              // Apri la modalità di editing solo se il peso non è preimpostato dalla scheda
                              if (!weekData.weight || weekData.weight === '') {
                                setEditingWeight(weightKey);
                              }
                            }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                              displayWeight 
                                ? 'bg-purple-500 bg-opacity-20 cursor-default'
                                : 'bg-purple-500 bg-opacity-20 hover:bg-opacity-30 cursor-pointer border border-purple-500 border-opacity-50'
                            }`}
                            aria-label={`Peso attuale: ${displayWeight || 'Imposta peso'}`}
                          >
                            <Dumbbell className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold">{displayWeight || 'Imposta peso'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 bg-white bg-opacity-10 text-white rounded-xl p-3 flex flex-col items-center justify-center font-bold text-center border border-white/20 min-w-[50px]">
                      <span className="text-xl">{completedCount}</span>
                      <span className="text-xs opacity-70">/{exercise.sets}</span>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${(completedCount / exercise.sets) * 100}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                      const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
                      const isCompleted = completedSets[key];
                      
                      return (
                        <button
                          key={setIndex}
                          onClick={() => toggleSetComplete(exerciseIndex, setIndex)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm shadow-md ${
                            isCompleted
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30 hover:scale-105'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                          aria-label={`Set ${setIndex + 1} - ${isCompleted ? 'Completato' : 'Da fare'}`}
                        >
                          Set {setIndex + 1}
                        </button>
                      );
                    })}
                  </div> 
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymTracker;
