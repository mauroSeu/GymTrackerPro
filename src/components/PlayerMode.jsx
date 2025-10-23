// src/components/PlayerMode.jsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Check, X, Timer } from 'lucide-react';
import ExerciseStatsModal from './ExerciseStatsModal'; // Importa il modale

const PlayerMode = (props) => {
  const { 
    playerMode, setPlayerMode, currentDayData, currentWeek, currentDay,
    currentExercise, currentSet, isResting, setIsResting, restTimer,
    currentExerciseData, completedSets, customWeights, formatTime,
    completeSet, skipSet, nextExercise, previousExercise, isExerciseCompleted, getRestTime
  } = props;
  
  const [showSettings, setShowSettings] = useState(false);

  // Calcoli per la vista Player
  const weekData = currentExerciseData.weeklyPlan[currentWeek - 1];
  const weightKey = `${currentDay}-${currentWeek}-${currentExercise}`;
  const customWeight = customWeights[weightKey];
  const displayWeight = customWeight || weekData.weight || 'N/A';
  
  const progress = ((currentExercise + (currentSet / currentExerciseData.sets)) / currentDayData.exercises.length) * 100;
  
  // Funzione per il calcolo del numero di esercizi completati
  const completedExercisesCount = currentDayData.exercises.filter((_, idx) => 
    isExerciseCompleted(currentDay, currentWeek, idx)
  ).length;

  // Renderizza il modale in cima a tutto se richiesto
  if (showSettings) {
      return <ExerciseStatsModal {...props} setShowSettings={setShowSettings} />;
  }

  // Vista Player
  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentDayData.color} flex flex-col font-sans`}>
      {/* Header Player */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPlayerMode(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            aria-label="Esci dalla modalità allenamento"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="text-white text-center flex-1">
            <div className="text-sm opacity-80">Settimana {currentWeek} • {currentDayData.shortName}</div>
            <div className="font-bold text-xs mt-1 opacity-70">
              {completedExercisesCount}/{currentDayData.exercises.length} completati
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all"
            aria-label="Vedi statistiche esercizi"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Player */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-md">
          {/* Exercise Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{currentDayData.icon}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{currentExerciseData.name}</h1>
              {isExerciseCompleted(currentDay, currentWeek, currentExercise) && (
                <div className="bg-green-400 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm opacity-80">{currentExerciseData.focus}</p>
          </div>

          {/* Set Counter - Big and Bold with Timer */}
          <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-3xl p-6 mb-4 text-center">
            {isResting ? (
              <>
                {/* Vista Timer di Riposo */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Timer className="w-5 h-5 animate-pulse" />
                  <div className="text-sm opacity-70">Riposo</div>
                </div>
                <div className="text-6xl font-bold mb-2">
                  {formatTime(restTimer)}
                </div>
                <button
                  onClick={() => setIsResting(false)}
                  className="text-sm underline opacity-70 hover:opacity-100 transition-opacity"
                >
                  Salta riposo
                </button>
              </>
            ) : (
              <>
                {isExerciseCompleted(currentDay, currentWeek, currentExercise) ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="bg-green-500 rounded-full p-4 mb-4">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-green-400">Completato!</div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm opacity-70 mb-2">Serie</div>
                    <div className="text-6xl font-bold mb-2">
                      {currentSet + 1}<span className="text-3xl opacity-50">/{currentExerciseData.sets}</span>
                    </div>
                    <div className="text-lg font-semibold opacity-90">
                      {weekData.sets} (Obiettivo)
                    </div>
                    {/* Barre di progresso set */}
                    <div className="flex gap-2 justify-center mt-4">
                      {Array.from({ length: currentExerciseData.sets }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            completedSets[`${currentDay}-${currentWeek}-${currentExercise}-${idx}`]
                              ? 'bg-green-400'
                              : idx === currentSet 
                              ? 'bg-white' 
                              : 'bg-white bg-opacity-20'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Info Cards - Compact */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-3 text-center">
              <div className="text-xs opacity-70 mb-1">Target</div>
              <div className="text-lg font-bold">{weekData.sets}</div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-3 text-center">
              <div className="text-xs opacity-70 mb-1">Recupero</div>
              <div className="text-lg font-bold">
                {getRestTime(currentExerciseData, currentWeek)}s
              </div>
            </div>
            <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-2xl p-3 text-center">
              <div className="text-xs opacity-70 mb-1">Carico</div>
              <div className="text-lg font-bold">{displayWeight}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isResting ? (
              <button
                onClick={() => setIsResting(false)}
                className="flex-1 px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
              >
                <SkipForward className="w-5 h-5" />
                Continua
              </button>
            ) : isExerciseCompleted(currentDay, currentWeek, currentExercise) ? (
              <button
                onClick={nextExercise}
                disabled={currentExercise === currentDayData.exercises.length - 1}
                className="flex-1 px-6 py-4 bg-green-500 text-white rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                <SkipForward className="w-5 h-5" />
                {currentExercise === currentDayData.exercises.length - 1 ? 'Allenamento Finito!' : 'Prossimo Esercizio'}
              </button>
            ) : (
              <>
                <button
                  onClick={skipSet}
                  className="flex-1 px-6 py-4 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
                >
                  <X className="w-5 h-5" />
                  Salta
                </button>
                <button
                  onClick={completeSet}
                  className="flex-1 px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl"
                >
                  <Check className="w-5 h-5" />
                  Fatto
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar & Progress */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm p-4 flex-shrink-0">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="bg-black bg-opacity-30 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className="bg-white h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white text-xs text-center opacity-80">
            Esercizio {currentExercise + 1} di {currentDayData.exercises.length}
          </div>
        </div>
        
        {/* Exercise Dots Indicator */}
        <div className="flex gap-1.5 justify-center mb-4">
          {currentDayData.exercises.map((ex, idx) => {
            const isComplete = isExerciseCompleted(currentDay, currentWeek, idx);
            
            return (
              <div
                key={idx}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  isComplete
                    ? 'bg-green-400'
                    : idx === currentExercise
                    ? 'bg-white w-8'
                    : 'bg-white bg-opacity-30'
                }`}
              />
            );
          })}
        </div>

        {/* Arrow Navigation */}
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            onClick={previousExercise}
            disabled={currentExercise === 0}
            className="p-4 hover:bg-white hover:bg-opacity-20 rounded-full transition-all disabled:opacity-30"
            aria-label="Esercizio precedente"
          >
            <SkipBack className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-white text-sm font-semibold opacity-80 text-center px-4">
            {currentExerciseData.name}
          </div>

          <button
            onClick={nextExercise}
            disabled={currentExercise === currentDayData.exercises.length - 1}
            className="p-4 hover:bg-white hover:bg-opacity-20 rounded-full transition-all disabled:opacity-30"
            aria-label="Prossimo esercizio"
          >
            <SkipForward className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerMode;