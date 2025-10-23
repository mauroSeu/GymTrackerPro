// src/components/ExerciseStatsModal.jsx
import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

const ExerciseStatsModal = ({ 
    setShowSettings, modalScrollRef, currentDayData, currentDay, currentWeek, 
    currentExercise, setCurrentExercise, setCurrentSet, setIsResting,
    completedSets, customWeights, isExerciseCompleted
}) => {
    
  // Auto-scroll all'esercizio corrente (logica ripresa dal codice originale)
  useEffect(() => {
    if (modalScrollRef.current) {
      // Calcola la larghezza della card + margine (320px + 16px)
      const cardWidth = 320 + 16; 
      // Calcola la posizione di scorrimento per centrare la card corrente
      const scrollPosition = currentExercise * cardWidth - (modalScrollRef.current.clientWidth / 2) + (cardWidth / 2);
      modalScrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentExercise, modalScrollRef]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowSettings(false)}
    >
      <div 
        className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl border border-gray-700 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header compatto */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-white font-bold text-xl">Statistiche Esercizi</h3>
            <p className="text-white text-sm opacity-80">Progressione e performance (Settimana {currentWeek})</p>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Scroll ORIZZONTALE OTTIMIZZATO */}
        <div ref={modalScrollRef} className="p-6 overflow-x-auto overflow-y-hidden flex-1 flex gap-4 items-start min-h-0">
          {currentDayData.exercises.map((ex, idx) => {
            const weightKey = `${currentDay}-${currentWeek}-${idx}`;
            const customWeight = customWeights[weightKey];
            const weekDataCurrent = ex.weeklyPlan[currentWeek - 1];
            const displayWeightModal = customWeight || weekDataCurrent.weight;
            
            let totalRepsCompleted = 0; // Reps completate questa settimana
            const currentWeekTargetReps = parseInt(weekDataCurrent.sets.split('x')[0]) * parseInt(weekDataCurrent.sets.split('x')[1]);
            
            const completedSetsCount = Array.from({ length: ex.sets }).filter((_, setIdx) => {
              const key = `${currentDay}-${currentWeek}-${idx}-${setIdx}`;
              if (completedSets[key]) {
                const repsNum = parseInt(weekDataCurrent.sets.split('x')[1]);
                totalRepsCompleted += repsNum;
                return true;
              }
              return false;
            }).length;

            const isComplete = isExerciseCompleted(currentDay, currentWeek, idx);
            const completionPercent = (totalRepsCompleted / currentWeekTargetReps) * 100;

            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentExercise(idx);
                  setCurrentSet(0);
                  setIsResting(false);
                  setShowSettings(false);
                }}
                className={`flex-shrink-0 w-80 rounded-xl p-5 transition-all relative overflow-hidden flex flex-col text-white border-2 cursor-pointer ${
                  idx === currentExercise
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-2xl scale-105 border-white'
                    : isComplete
                    ? 'bg-green-500 bg-opacity-20 border-green-500 hover:scale-102'
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-102'
                }`}
                style={{ minHeight: '300px' }}
              >
                <div className="relative flex flex-col gap-2 h-full">
                  {/* Header */}
                  <div className="mb-3 flex-shrink-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl font-bold opacity-70">#{idx + 1}</span>
                      {isComplete ? (
                        <div className="bg-green-400 rounded-full p-1.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : idx === currentExercise ? (
                        <div className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs font-bold text-gray-900">
                          IN CORSO
                        </div>
                      ) : null}
                    </div>
                    <h4 className="font-bold text-lg leading-tight mb-1">{ex.name}</h4>
                    <p className="text-xs opacity-70">{ex.focus}</p>
                  </div>
                  
                  {/* Statistiche - Box Flessibili */}
                  <div className="flex-1 flex flex-col justify-end space-y-2 mt-4">
                    {/* Progresso Totale Settimanale (Reps) */}
                    <div className={`rounded-lg p-3 ${idx === currentExercise ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'}`}>
                      <div className="text-xs opacity-70 mb-1">Progresso Reps (W{currentWeek})</div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold">{totalRepsCompleted}</span>
                        <span className="text-xs opacity-70">/ {currentWeekTargetReps} Reps</span>
                      </div>
                      {/* Progress bar */}
                      <div className="bg-black bg-opacity-20 rounded-full h-1.5 mt-1.5">
                        <div 
                          className={`h-full rounded-full transition-all ${completionPercent >= 100 ? 'bg-green-400' : 'bg-blue-400'}`}
                          style={{ width: `${Math.min(completionPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Carico Previsto */}
                    <div className={`rounded-lg p-3 ${idx === currentExercise ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'}`}>
                      <div className="text-xs opacity-70 mb-1">Carico Previsto</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold">
                          {displayWeightModal 
                            ? displayWeightModal.replace('kg', '')
                            : 'N/A'}
                        </span>
                        <span className="text-sm">kg</span>
                      </div>
                    </div>
                    
                    {/* Set Fatti */}
                    <div className={`rounded-lg p-3 ${idx === currentExercise ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'}`}>
                      <div className="text-xs opacity-70 mb-1">Set Fatti</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold">{completedSetsCount}</span>
                        <span className="text-sm">/ {ex.sets}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExerciseStatsModal;