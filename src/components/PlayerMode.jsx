import React from 'react';
import { X, SkipBack, SkipForward, Check, Timer } from 'lucide-react';

const PlayerMode = ({
  currentDay,
  currentWeek,
  currentExercise,
  currentSet,
  isResting,
  restTimer,
  completedSets,
  customWeights,
  workoutDays,
  setPlayerMode,
  toggleSetComplete,
  completeSet,
  skipSet,
  previousExercise,
  nextExercise,
  setShowSettings,
  formatTime
}) => {
  const currentDayData = workoutDays[currentDay];
  const currentExerciseData = currentDayData.exercises[currentExercise];
  const weekData = currentExerciseData.weeklyPlan[currentWeek - 1];
  const weightKey = `${currentDay}-${currentWeek}-${currentExercise}`;
  const customWeight = customWeights[weightKey];
  const displayWeight = customWeight || weekData.weight || 'N/A';
  
  const progress = ((currentExercise + (currentSet / currentExerciseData.sets)) / currentDayData.exercises.length) * 100;

  const completedExercises = currentDayData.exercises.filter((ex, idx) => {
    return Array.from({ length: ex.sets }).every((_, setIdx) => {
      const key = `${currentDay}-${currentWeek}-${idx}-${setIdx}`;
      return completedSets[key];
    });
  }).length;

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
              {completedExercises}/{currentDayData.exercises.length} completati
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

      {/* Progress Bar */}
      <div className="bg-black bg-opacity-20 flex-shrink-0">
        <div 
          className="bg-white h-1 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        {/* Timer di riposo */}
        {isResting && (
          <div className="bg-white bg-opacity-95 rounded-3xl p-8 shadow-2xl mb-8 text-center animate-pulse">
            <Timer className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {formatTime(restTimer)}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Riposo</div>
          </div>
        )}

        {/* Exercise Card */}
        <div className="bg-white bg-opacity-95 rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-sm font-semibold text-gray-500 mb-2">
              Esercizio {currentExercise + 1}/{currentDayData.exercises.length}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentExerciseData.name}
            </h2>
            <p className="text-sm text-blue-600 italic">
              {currentExerciseData.focus}
            </p>
          </div>

          {/* Set Counter */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 mb-6 text-white text-center">
            <div className="text-6xl font-bold mb-2">
              {currentSet + 1}/{currentExerciseData.sets}
            </div>
            <div className="text-sm uppercase tracking-wide">Set</div>
          </div>

          {/* Exercise Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">Target</div>
              <div className="text-xl font-bold text-gray-900">{weekData.sets}</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">Peso</div>
              <div className="text-xl font-bold text-gray-900">{displayWeight}</div>
            </div>
          </div>

          {/* Completed Sets Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Set completati</span>
              <span>
                {Array.from({ length: currentExerciseData.sets }).filter((_, idx) => {
                  const key = `${currentDay}-${currentWeek}-${currentExercise}-${idx}`;
                  return completedSets[key];
                }).length}/{currentExerciseData.sets}
              </span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: currentExerciseData.sets }).map((_, idx) => {
                const key = `${currentDay}-${currentWeek}-${currentExercise}-${idx}`;
                const isCompleted = completedSets[key];
                const isCurrent = idx === currentSet;
                
                return (
                  <div
                    key={idx}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      isCompleted
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-300'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Controls (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-lg p-6 flex-shrink-0">
        <div className="max-w-md mx-auto">
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={previousExercise}
              disabled={currentExercise === 0}
              className={`p-3 rounded-full ${
                currentExercise === 0
                  ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                  : 'bg-white hover:scale-105'
              } transition-all shadow-lg`}
              aria-label="Esercizio precedente"
            >
              <SkipBack className="w-6 h-6 text-gray-900" />
            </button>
            
            <div className="text-white text-center">
              <div className="text-xs opacity-80">Prossimo</div>
              <div className="text-sm font-semibold">
                {currentExercise < currentDayData.exercises.length - 1
                  ? currentDayData.exercises[currentExercise + 1].name.substring(0, 20) + '...'
                  : 'Fine'}
              </div>
            </div>
            
            <button
              onClick={nextExercise}
              disabled={currentExercise === currentDayData.exercises.length - 1}
              className={`p-3 rounded-full ${
                currentExercise === currentDayData.exercises.length - 1
                  ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                  : 'bg-white hover:scale-105'
              } transition-all shadow-lg`}
              aria-label="Esercizio successivo"
            >
              <SkipForward className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={skipSet}
              className="bg-yellow-500 text-white py-4 rounded-2xl font-bold hover:bg-yellow-600 transition-all shadow-lg flex items-center justify-center gap-2"
              aria-label="Salta set"
            >
              <X className="w-5 h-5" />
              Salta
            </button>
            <button
              onClick={completeSet}
              className="bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2"
              aria-label="Completa set"
            >
              <Check className="w-5 h-5" />
              Fatto!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerMode;
