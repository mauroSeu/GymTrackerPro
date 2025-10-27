import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, Calendar, Target, Clock, Play, X, Check, Activity } from 'lucide-react';
import { workoutDays } from '../data/workoutData';
import PlayerMode from './PlayerMode';
import SettingsModal from './SettingsModal';
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

    debouncedFn.cancel = () => {
      clearTimeout(timeoutRef.current);
    };

    return debouncedFn;
  }, [callback, delay]);
};

// === FUNZIONE DI CACHE-FIRST RENDERING ===
const getInitialState = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error loading cache for ${key}. Using default value.`, error);
    return defaultValue;
  }
};

// === NUOVA Mappa Temi Settimanali ===
const weekThemeMap = {
  1: { base: 'from-teal-500 to-cyan-500', text: 'text-white', shadow: 'shadow-cyan-500/30' },
  2: { base: 'from-cyan-500 to-blue-500', text: 'text-white', shadow: 'shadow-blue-500/40' },
  3: { base: 'from-blue-500 to-indigo-500', text: 'text-white', shadow: 'shadow-indigo-500/40' },
  4: { base: 'from-indigo-500 to-purple-600', text: 'text-white', shadow: 'shadow-purple-600/40' },
  5: { base: 'from-purple-600 to-amber-500', text: 'text-white', shadow: 'shadow-amber-500/40' }
};

const neutralTheme = "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600";
const completedTheme = "bg-green-600 text-white hover:bg-green-700 border border-green-700";
const skippedTheme = "bg-gray-800 text-gray-500 border border-gray-700 line-through";

const GymTracker = ({ currentWeek, setCurrentWeek, activeTheme, playerMode, setPlayerMode }) => {
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

  const debouncedSaveProgress = useDebounce(saveProgress, 1000);
  const debouncedSaveCustomWeights = useDebounce(saveCustomWeights, 1000);
  const debouncedSaveSkippedDays = useDebounce(saveSkippedDays, 500);
  const debouncedSaveProgressData = useDebounce(saveProgressData, 2000);

  const [currentDay, setCurrentDay] = useState(getInitialState('currentDay', 0));
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

  const [currentExercise, setCurrentExercise] = useState(getInitialState('currentExercise', 0));
  const [currentSet, setCurrentSet] = useState(getInitialState('currentSet', 0));
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [skippedDays, setSkippedDays] = useState(getInitialState('skippedDays', {}));
  const [editingWeight, setEditingWeight] = useState(null);
  
  const modalScrollRef = useRef(null);

  const dayDisplayMap = [
    { label: "Push", icon: "💪", iconSvg: <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> },
    { label: "Legs", icon: "🦵", iconSvg: <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l-2 3-2-3"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19V6l2 3 2-3"></path></svg> },
    { label: "Pull", icon: "🏋️", iconSvg: <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v10m8 0V7M3 17h18M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"></path></svg> },
    { label: "Upper", icon: "💎", iconSvg: <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V6m0 5l-4-4m4 4l4-4m-4 13v-5m0 5l-4-4m4 4l4-4"></path></svg> },
    { label: "Recovery", icon: "🧘", iconSvg: <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> }
  ];

  const activeThemeMap = weekThemeMap[currentWeek] || weekThemeMap[1];
  const activeGradient = activeThemeMap.base;

  const currentDayData = workoutDays[currentDay];
  const currentExerciseData = currentDayData?.exercises[currentExercise];

  const getWorkoutDate = (week, day) => {
    const startDate = new Date(2025, 9, 27);
    const dayLabels = ['Lun', 'Mar', 'Gio', 'Ven', 'Sab'];
    const monthLabels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const weeksOffset = week - 1;
    let totalDaysToAdd = weeksOffset * 7;
    const daysInWeek = [0, 1, 3, 4, 5];
    const dayOffset = daysInWeek[day] !== undefined ? daysInWeek[day] : 0;
    totalDaysToAdd += dayOffset;

    const workoutDate = new Date(startDate);
    workoutDate.setDate(startDate.getDate() + totalDaysToAdd);

    const dayNum = workoutDate.getDate();
    const monthName = monthLabels[workoutDate.getMonth()];
    const dayName = dayLabels[day] || '';

    return { dayName, dayNum, monthName };
  };

  const getWeekDateRange = (week) => {
      const startDay = getWorkoutDate(week, 0);
      const endDay = getWorkoutDate(week, 4);

      if (startDay.monthName === endDay.monthName) {
          return `Dal ${startDay.dayNum} al ${endDay.dayNum} ${startDay.monthName}`;
      } else {
          return `Dal ${startDay.dayNum} ${startDay.monthName} al ${endDay.dayNum} ${endDay.monthName}`;
      }
  };

  const isDayCompleted = (week, day) => {
    if (!workoutDays[day] || !workoutDays[day].exercises) return false;
    const dayExercises = workoutDays[day].exercises;
    let totalSets = 0;
    let completedSetsCount = 0;

    dayExercises.forEach((exercise, exerciseIndex) => {
      const setsPerExercise = exercise.sets || 0;
      totalSets += setsPerExercise;
      for (let setIndex = 0; setIndex < setsPerExercise; setIndex++) {
        const key = `${day}-${week}-${exerciseIndex}-${setIndex}`;
        if (completedSets[key]) {
          completedSetsCount++;
        }
      }
    });

    return totalSets > 0 && completedSetsCount === totalSets;
  };

  const toggleSkipDay = (week, day) => {
    const key = `${day}-${week}`;
    setSkippedDays(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isDaySkipped = (week, day) => {
    const key = `${day}-${week}`;
    return skippedDays[key] || false;
  };

  const isWeekCompleted = (week) => {
    for (let day = 0; day < 5; day++) {
      if (isDaySkipped(week, day)) continue;
      if (!isDayCompleted(week, day)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    localStorage.setItem('currentDay', currentDay);
    localStorage.setItem('currentExercise', currentExercise);
    localStorage.setItem('currentSet', currentSet);
  }, [currentDay, currentExercise, currentSet]); 

  useEffect(() => {
    if (userData) {
      if (userData.completedSets) setCompletedSets(userData.completedSets);
      if (userData.customWeights) setCustomWeights(userData.customWeights);
      if (userData.skippedDays) setSkippedDays(userData.skippedDays);
      if (userData.progressData) setProgressData(userData.progressData);
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('completedSets', JSON.stringify(completedSets));
    const currentJson = JSON.stringify(completedSets);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.completedSets || {});
    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveProgress(completedSets);
    }
    return () => { debouncedSaveProgress.cancel(); };
  }, [completedSets, isLoading, debouncedSaveProgress, lastSyncedData]);

  useEffect(() => {
    localStorage.setItem('customWeights', JSON.stringify(customWeights));
    const currentJson = JSON.stringify(customWeights);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.customWeights || {});
    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveCustomWeights(customWeights);
    }
    return () => { debouncedSaveCustomWeights.cancel(); };
  }, [customWeights, isLoading, debouncedSaveCustomWeights, lastSyncedData]);

  useEffect(() => {
    localStorage.setItem('skippedDays', JSON.stringify(skippedDays));
    const currentJson = JSON.stringify(skippedDays);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.skippedDays || {});
    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveSkippedDays(skippedDays);
    }
    return () => { debouncedSaveSkippedDays.cancel(); };
  }, [skippedDays, isLoading, debouncedSaveSkippedDays, lastSyncedData]);

  useEffect(() => {
    localStorage.setItem('progressData', JSON.stringify(progressData));
    const currentJson = JSON.stringify(progressData);
    const lastSyncedJson = JSON.stringify(lastSyncedData?.progressData || {});
    if (!isLoading && currentJson !== lastSyncedJson) {
      debouncedSaveProgressData(progressData);
    }
    return () => { debouncedSaveProgressData.cancel(); };
  }, [progressData, isLoading, debouncedSaveProgressData, lastSyncedData]);

  useEffect(() => {
    if (!isLoading && processOfflineQueue && navigator.onLine) {
        processOfflineQueue();
    }
  }, [isLoading, processOfflineQueue]);

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

  const toggleSetComplete = (exerciseIndex, setIndex) => {
    const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 🔥 NUOVO: Sincronizza il PlayerMode se i set vengono modificati dall'esterno
  useEffect(() => {
    if (playerMode) {
      const dayExercises = workoutDays[currentDay]?.exercises ?? [];
      let firstIncompleteExercise = 0;
      let firstIncompleteSet = 0;
      let found = false;

      for (let i = 0; i < dayExercises.length; i++) {
        const exercise = dayExercises[i];
        for (let j = 0; j < (exercise.sets || 0); j++) {
          const key = `${currentDay}-${currentWeek}-${i}-${j}`;
          if (!completedSets[key]) {
            firstIncompleteExercise = i;
            firstIncompleteSet = j;
            found = true;
            break;
          }
        }
        if (found) break;
      }

      // 🔥 CORREZIONE: Aggiorna lo stato del player se non è già sincronizzato.
      if (currentExercise !== firstIncompleteExercise || currentSet !== firstIncompleteSet) {
        setCurrentExercise(firstIncompleteExercise);
        setCurrentSet(firstIncompleteSet);
      }
    }
  }, [completedSets, playerMode, currentDay, currentWeek]);

  const startPlayerMode = () => {
    // 🔥 CORREZIONE BUG: Trova il primo esercizio e la prima serie non completati per riprendere correttamente.
    const dayExercises = workoutDays[currentDay]?.exercises || [];
    let startExerciseIndex = 0;
    let startSetIndex = 0;
    let found = false;

    for (let i = 0; i < dayExercises.length; i++) {
      const exercise = dayExercises[i];
      for (let j = 0; j < (exercise.sets || 0); j++) {
        const key = `${currentDay}-${currentWeek}-${i}-${j}`;
        if (!completedSets[key]) {
          startExerciseIndex = i;
          startSetIndex = j;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    setPlayerMode(true);
    setCurrentExercise(startExerciseIndex);
    setCurrentSet(startSetIndex);
    setIsResting(false);
    setRestTimer(0);
  };

  // Complete Set Logic (Modificata per avanzare automaticamente)
  const completeSet = () => {
    if (!currentExerciseData) return;

    toggleSetComplete(currentExercise, currentSet);

    // 🔥 CORREZIONE: Non avviare il riposo automaticamente. Avanza solo al set/esercizio successivo.
    if (currentSet < currentExerciseData.sets - 1) {
      // Se non è l'ultima serie, vai alla successiva
      setCurrentSet(currentSet + 1);
    } else {
      // Se è l'ultima serie, passa automaticamente all'esercizio successivo
      nextExercise();
    }
  };

  const skipSet = () => {
    if (!currentExerciseData) return;
     const setsTotal = currentExerciseData.sets || 0;
     const exercisesTotal = currentDayData?.exercises?.length || 0;

    if (currentSet < setsTotal - 1) {
      setCurrentSet(currentSet + 1);
    } else {
      if (currentExercise < exercisesTotal - 1) {
        setCurrentExercise(currentExercise + 1);
        setCurrentSet(0);
      }
    }
    setIsResting(false);
  };

  // 🆕 NUOVA FUNZIONE: Salta solo il timer, non il set
  const skipTimer = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  // 🔥 FUNZIONE MIGLIORATA: Trova il primo set non completato per un dato esercizio
  const findFirstIncompleteSet = (exerciseIndex) => {
    const exercise = workoutDays[currentDay]?.exercises[exerciseIndex];
    if (!exercise) return 0;

    for (let i = 0; i < (exercise.sets || 0); i++) {
      const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${i}`;
      if (!completedSets[key]) {
        return i;
      }
    }
    return 0; // Ritorna 0 se tutti i set sono completati
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      const prevExerciseIndex = currentExercise - 1;
      setCurrentExercise(prevExerciseIndex);
      setCurrentSet(findFirstIncompleteSet(prevExerciseIndex));
      setIsResting(false);
    }
  };

  const nextExercise = () => {
    if (currentDayData && currentDayData.exercises && currentExercise < currentDayData.exercises.length - 1) {
        const nextExerciseIndex = currentExercise + 1;
        setCurrentExercise(nextExerciseIndex);
        setCurrentSet(findFirstIncompleteSet(nextExerciseIndex));
        setIsResting(false);
    }
  };

  const startRest = () => {
    if (!currentExerciseData || !currentExerciseData.rest) {
      console.warn("Dati esercizio o tempo di riposo mancanti:", currentExerciseData);
      setIsResting(false);
      return;
    };

    const restTimeStr = currentExerciseData.rest.split('-')[0].trim().replace('sec', '');
    const restTime = parseInt(restTimeStr);

    if (isNaN(restTime) || restTime <= 0) {
        console.warn("Tempo di riposo non valido:", currentExerciseData.rest);
        setIsResting(false);
        return;
    }

    setRestTimer(restTime);
    setIsResting(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveProgress = (data) => {
    setProgressData(data);
  };

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
          skipTimer={skipTimer}
          previousExercise={previousExercise}
          nextExercise={nextExercise}
          setShowSettings={setShowSettings}
          formatTime={formatTime}
          activeThemeGradient={activeGradient}
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

  return (
    <div className="text-white font-sans">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 space-y-6 shadow-2xl border border-gray-700">

          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-700 pb-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-8 h-8 mt-1 text-blue-400 flex-shrink-0" />
              <div className="flex flex-col justify-center">
                <h2 className={`text-2xl font-extrabold whitespace-nowrap bg-gradient-to-r ${activeGradient} text-transparent bg-clip-text transition-all duration-300`}>
                  Settimana {currentWeek}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {getWeekDateRange(currentWeek)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, weekIndex) => {
                const weekNumber = weekIndex + 1;
                const isCurrent = weekNumber === currentWeek;
                const isCompleted = isWeekCompleted(weekNumber);
                const theme = weekThemeMap[weekNumber];
                let chipStyle;
                if (isCurrent) {
                  chipStyle = `bg-gradient-to-r ${theme.base} ${theme.text} shadow-lg ${theme.shadow} border-transparent scale-105`;
                } else if (isCompleted) {
                  chipStyle = completedTheme + " opacity-70";
                } else {
                  chipStyle = neutralTheme;
                }
                return (
                  <button
                    key={weekIndex}
                    onClick={() => setCurrentWeek(weekNumber)}
                    className={`rounded-lg w-10 h-10 text-sm flex items-center justify-center font-bold flex-shrink-0 transition-all duration-200 hover:opacity-100 hover:scale-110 ${chipStyle}`}
                  >
                    {weekNumber}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
             {dayDisplayMap.map((day, idx) => {
                const isCurrent = idx === currentDay;
                const isCompleted = isDayCompleted(currentWeek, idx);
                const isSkipped = isDaySkipped(currentWeek, idx);
                let buttonStyle;
                let iconColor = "text-gray-400";

                if (isCurrent) {
                  buttonStyle = `bg-gradient-to-r ${activeGradient} ${activeThemeMap.text} shadow-xl ${activeThemeMap.shadow} border-transparent`;
                  iconColor = "text-white";
                } else if (isCompleted && !isSkipped) {
                  buttonStyle = completedTheme + " opacity-80";
                  iconColor = "text-white";
                } else if (isSkipped) {
                  buttonStyle = skippedTheme;
                  iconColor = "text-gray-600";
                } else {
                  buttonStyle = neutralTheme;
                }

                 const coloredIcon = day.iconSvg && React.isValidElement(day.iconSvg)
                    ? React.cloneElement(day.iconSvg, {
                        className: `w-6 h-6 mb-1 transition-colors duration-200 ${iconColor}`
                      })
                    : <span className={`text-xl mb-1 ${iconColor}`}>{day.icon}</span>;

                return (
                    <button
                        key={idx}
                        onClick={() => setCurrentDay(idx)}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs font-semibold h-20 transition duration-200 hover:scale-[1.03] hover:opacity-100 ${buttonStyle}`}
                    >
                        {coloredIcon}
                        <span className="mt-1 text-center leading-tight">{day.label}</span>
                    </button>
                );
            })}
          </div>
        </div>

        <button
          onClick={startPlayerMode}
          disabled={isDaySkipped(currentWeek, currentDay)}
          className={`relative w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
            isDaySkipped(currentWeek, currentDay)
              ? 'bg-gray-700 cursor-not-allowed'
              : 'hover:scale-[1.02]'
          }`}
          style={{ minHeight: '180px' }}
          aria-label="Inizia allenamento"
        >
          {!isDaySkipped(currentWeek, currentDay) && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                style={{
                  backgroundImage: 'url(/GymTrackerPro/cta-background.JPG)',
                  filter: 'brightness(0.8)',
                }}
              />
              <div className="absolute inset-0 bg-black opacity-40" />
            </>
          )}
          
          <div className={`relative z-10 flex flex-col items-center justify-center h-full ${
            isDaySkipped(currentWeek, currentDay) ? 'text-gray-500' : 'text-white'
          }`}>
            <Play className="w-10 h-10 mb-2 drop-shadow-2xl animate-pulse" />
            <span className="text-2xl font-black tracking-widest drop-shadow-2xl">
              INIZIA ALLENAMENTO
            </span>
            <span className="text-sm mt-2 opacity-90 font-semibold">
              Modalità Player
            </span>
          </div>
        </button>

        {isDaySkipped(currentWeek, currentDay) ? (
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-2xl font-bold mb-2">Giorno Saltato</h3>
            <p className="text-gray-400">Hai deciso di saltare questo allenamento per la Settimana {currentWeek}.</p>
          </div>
        ) : (
          <div className="space-y-4">
             {currentDayData && currentDayData.exercises && currentDayData.exercises.length > 0 ? (
                 currentDayData.exercises.map((exercise, exerciseIndex) => {
                    if (!exercise || !exercise.weeklyPlan) {
                        console.error("Dati esercizio o weeklyPlan mancanti:", exerciseIndex, exercise);
                        return null;
                    }
                    const weekData = exercise.weeklyPlan[currentWeek - 1];
                    if (!weekData) {
                         console.error(`Dati mancanti per week ${currentWeek} nell'esercizio ${exerciseIndex}`);
                         return (
                             <div key={exerciseIndex} className="bg-red-900 bg-opacity-50 rounded-2xl p-6 shadow-xl border border-red-700">
                                 <p className="text-red-300">Errore: Dati mancanti per Sett. {currentWeek} - {exercise.name || `Esercizio ${exerciseIndex + 1}`}.</p>
                             </div>
                         );
                    }

                    const setsTotal = exercise.sets || 0;
                    const completedCount = Array.from({ length: setsTotal }).filter((_, setIndex) => {
                        const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
                        return completedSets[key];
                    }).length;

                    const weightKey = `${currentDay}-${currentWeek}-${exerciseIndex}`;
                    const customWeight = customWeights[weightKey];
                    const displayWeight = customWeight || weekData.weight || '';
                    const isEditingThisWeight = editingWeight === weightKey;

                    return (
                        <div key={exerciseIndex} className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-blue-500/50 transition-all">
                             <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 pr-4">
                                  <h3 className="text-xl font-bold mb-2 text-white">{exercise.name || 'Nome Esercizio Mancante'}</h3>
                                  <p className="text-sm text-blue-400 italic mb-3">{exercise.focus || 'Focus Mancante'}</p>

                                  <div className="flex flex-wrap gap-2 text-sm mb-3">
                                    <div className="flex items-center gap-1 bg-blue-500 bg-opacity-20 px-3 py-1.5 rounded-full">
                                      <Target className="w-4 h-4 text-blue-400" />
                                      <span className="font-semibold">{weekData.sets || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-500 bg-opacity-20 px-3 py-1.5 rounded-full">
                                      <Clock className="w-4 h-4 text-yellow-400" />
                                      <span>
                                        {(() => {
                                          if (!exercise.rest) return 'N/A';
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
                                          placeholder="Peso"
                                          autoFocus
                                          defaultValue={customWeight ? customWeight.replace(/kg$/i,'') : ''}
                                          className="bg-transparent text-white w-16 outline-none font-semibold text-center"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              const value = e.target.value.trim();
                                              setCustomWeights(prev => ({
                                                ...prev,
                                                [weightKey]: value ? value + (value.match(/kg$/i) ? '' : 'kg') : undefined
                                              }));
                                              setEditingWeight(null);
                                            } else if (e.key === 'Escape') {
                                              setEditingWeight(null);
                                            }
                                          }}
                                          onBlur={(e) => {
                                            const value = e.target.value.trim();
                                             setCustomWeights(prev => ({
                                                ...prev,
                                                [weightKey]: value ? value + (value.match(/kg$/i) ? '' : 'kg') : undefined
                                              }));
                                            setEditingWeight(null);
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => { setEditingWeight(weightKey); }}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                                            displayWeight
                                            ? 'bg-purple-500 bg-opacity-20 cursor-pointer hover:bg-opacity-30'
                                            : 'bg-gray-600 bg-opacity-50 hover:bg-opacity-70 cursor-pointer border border-gray-500 border-opacity-50'
                                        }`}
                                        aria-label={`Peso attuale: ${displayWeight || 'Imposta peso'}`}
                                      >
                                        <Dumbbell className="w-4 h-4 text-purple-400" />
                                        <span className="font-semibold">{displayWeight || 'Imposta'}</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {completedCount === setsTotal && setsTotal > 0 && (
                                  <div className="ml-4 flex items-center justify-center">
                                    <div className="bg-green-500/20 p-3 rounded-full animate-pulse">
                                      <Check className="w-6 h-6 text-green-400" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {setsTotal > 0 && (
                                  <>
                                      <div className="flex flex-wrap gap-2">
                                          {Array.from({ length: setsTotal }).map((_, setIndex) => {
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
                                  </>
                              )}
                        </div>
                    );
                })
             ) : (
                 <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-gray-700 text-center">
                    <p className="text-gray-400">Nessun esercizio definito per questo giorno.</p>
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymTracker;