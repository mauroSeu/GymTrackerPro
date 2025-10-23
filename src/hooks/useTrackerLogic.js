// src/hooks/useTrackerLogic.js
import { useState, useEffect, useRef } from 'react';
import { workoutDays } from '../data/workoutPlan';

const TOTAL_WEEKS = 5;

// Funzione per salvare lo stato nel localStorage
const saveState = (key, state) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error("Errore salvataggio localStorage:", error);
  }
};

// Funzione per caricare lo stato dal localStorage
const loadState = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Errore caricamento localStorage:", error);
    return defaultValue;
  }
};

// Hook Personalizzato
export const useGymTracker = () => {
  // Stati principali con persistenza (default: settimana 1, giorno 0)
  const [currentDay, setCurrentDay] = useState(() => loadState('currentDay', 0));
  const [currentWeek, setCurrentWeek] = useState(() => loadState('currentWeek', 1));
  const [completedSets, setCompletedSets] = useState(() => loadState('completedSets', {}));
  const [customWeights, setCustomWeights] = useState(() => loadState('customWeights', {}));
  const [skippedDays, setSkippedDays] = useState(() => loadState('skippedDays', {}));
  
  // Stati Player Mode (non persistenti, resettano all'avvio)
  const [playerMode, setPlayerMode] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [editingWeight, setEditingWeight] = useState(null); // formato: "day-week-exerciseIndex"

  // Ref per lo scrolling (non deve essere nello stato)
  const modalScrollRef = useRef(null);
  
  // Dati calcolati
  const currentDayData = workoutDays[currentDay];
  // Controllo di sicurezza per evitare crash se currentDay è fuori range
  const currentExerciseData = currentDayData?.exercises[currentExercise] || {};


  // --- PERSISTENZA DEI DATI PRINCIPALI ---
  useEffect(() => { saveState('currentDay', currentDay); }, [currentDay]);
  useEffect(() => { saveState('currentWeek', currentWeek); }, [currentWeek]);
  useEffect(() => { saveState('completedSets', completedSets); }, [completedSets]);
  useEffect(() => { saveState('customWeights', customWeights); }, [customWeights]);
  useEffect(() => { saveState('skippedDays', skippedDays); }, [skippedDays]);


  // --- UTILITY E CALCOLI ---

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getRestTime = (exerciseData, week) => {
    // Estrae il tempo di riposo minimo dalla stringa (es. "120-180 sec")
    const restStr = exerciseData.rest || '90-120 sec';
    const restParts = restStr.replace(' sec', '').split('-').map(s => s.trim());
    if (restParts.length === 1) return parseInt(restParts[0]);
    // Logica di progressione del riposo
    return parseInt(week <= 3 ? restParts[0] : restParts[1]);
  }

  // Verifica se tutti i set di un giorno sono completati
  const isDayCompleted = (week, day) => {
    const dayExercises = workoutDays[day]?.exercises || [];
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
  
  const isDaySkipped = (week, day) => {
    const key = `${day}-${week}`;
    return skippedDays[key] || false;
  };

  const isWeekCompleted = (week) => {
    for (let day = 0; day < workoutDays.length; day++) {
      if (isDaySkipped(week, day)) continue;
      if (!isDayCompleted(week, day)) return false;
    }
    return true;
  };

  // --- AZIONI/HANDLERS PLAYER MODE ---

  const toggleSetComplete = (exerciseIndex, setIndex) => {
    const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const toggleSkipDay = (week, day) => {
    const key = `${day}-${week}`;
    setSkippedDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startRest = (exerciseData) => {
    const restTime = getRestTime(exerciseData, currentWeek);
    setRestTimer(restTime);
    setIsResting(true);
  };
  
  const completeSet = () => {
    // Controllo di sicurezza
    if (!currentExerciseData.sets) return;
    
    toggleSetComplete(currentExercise, currentSet);
    
    // Se non è l'ultimo set, passa al set successivo e avvia il riposo
    if (currentSet < currentExerciseData.sets - 1) {
      setCurrentSet(currentSet + 1);
      startRest(currentExerciseData);
    } else {
      // Ultimo set dell'esercizio: passa all'esercizio successivo, ma non parte il timer
      setIsResting(false);
      
      // Auto-avanza all'esercizio successivo (solo se non è l'ultimo)
      if (currentExercise < currentDayData.exercises.length - 1) {
         // Piccolo delay per far vedere il check
         setTimeout(nextExercise, 500); 
      }
    }
  };

  const skipSet = () => {
    // Se non è l'ultimo set, avanza il set
    if (currentSet < currentExerciseData.sets - 1) {
      setCurrentSet(currentSet + 1);
    } else {
      // Se è l'ultimo set, passa all'esercizio successivo
      if (currentExercise < currentDayData.exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setCurrentSet(0);
      }
    }
    setIsResting(false);
  };

  const nextExercise = () => {
    if (currentExercise < currentDayData.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setCurrentSet(0);
      setIsResting(false);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setCurrentSet(0);
      setIsResting(false);
    }
  };

  const setWeight = (key, weight) => {
    setCustomWeights(prev => ({ ...prev, [key]: weight }));
  };
  
  // Funzione per avviare il Player Mode
  const startPlayerMode = () => {
    setPlayerMode(true);
    // Cerca il primo esercizio non completato per iniziare
    let startIdx = currentDayData.exercises.findIndex((ex, idx) => !isExerciseCompleted(currentDay, currentWeek, idx));
    
    // Se tutti completati, riparte dal primo. Altrimenti riparte dal primo non completato.
    setCurrentExercise(startIdx >= 0 ? startIdx : 0); 
    setCurrentSet(0);
    setIsResting(false);
    setRestTimer(0);
  };
  
  // Calcola se un singolo esercizio è completato
  const isExerciseCompleted = (day, week, exerciseIndex) => {
    const exercise = workoutDays[day]?.exercises[exerciseIndex];
    if (!exercise) return false;
    
    return Array.from({ length: exercise.sets }).every((_, setIdx) => {
        const key = `${day}-${week}-${exerciseIndex}-${setIdx}`;
        return completedSets[key];
    });
  };

  // --- EFFECT PER IL TIMER DI RIPOSO ---
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
  
  return {
    // Stati e Ref
    currentDay, setCurrentDay, currentWeek, setCurrentWeek, 
    completedSets, customWeights, skippedDays, playerMode, setPlayerMode,
    currentExercise, setCurrentExercise, currentSet, setCurrentSet, 
    isResting, setIsResting, restTimer, modalScrollRef, editingWeight, setEditingWeight,
    currentDayData, currentExerciseData, workoutDays, dayDisplayMap,

    // Funzioni di Logica
    isDayCompleted, isDaySkipped, isWeekCompleted, toggleSkipDay,
    toggleSetComplete, startRest, completeSet, skipSet, 
    nextExercise, previousExercise, formatTime, setWeight, startPlayerMode, isExerciseCompleted, getRestTime
  };
};