import React from 'react';
import { X, Target, Dumbbell, Clock } from 'lucide-react';

const SettingsModal = ({
  show,
  onClose,
  currentDay,
  currentWeek,
  currentExercise,
  workoutDays,
  modalScrollRef,
  completedSets,
  customWeights
}) => {
  if (!show) return null;

  const currentDayData = workoutDays[currentDay];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Panoramica Esercizi</h2>
            <p className="text-blue-100 text-sm">Settimana {currentWeek} • {currentDayData.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all"
            aria-label="Chiudi panoramica"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Scrollable Exercise List */}
        <div
          ref={modalScrollRef}
          className="overflow-x-auto overflow-y-hidden p-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
            {currentDayData.exercises.map((exercise, exerciseIndex) => {
              const weekData = exercise.weeklyPlan[currentWeek - 1];
              const completedCount = Array.from({ length: exercise.sets }).filter((_, setIndex) => {
                const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
                return completedSets[key];
              }).length;
              
              const weightKey = `${currentDay}-${currentWeek}-${exerciseIndex}`;
              const customWeight = customWeights[weightKey];
              const displayWeight = customWeight || weekData.weight || 'N/A';
              
              const isCompleted = completedCount === exercise.sets;
              const isCurrent = exerciseIndex === currentExercise;

              return (
                <div
                  key={exerciseIndex}
                  className={`flex-shrink-0 w-80 bg-gray-800 rounded-2xl p-6 border-2 transition-all ${
                    isCurrent
                      ? 'border-blue-500 shadow-lg shadow-blue-500/50'
                      : isCompleted
                      ? 'border-green-500'
                      : 'border-gray-700'
                  }`}
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-400">
                        #{exerciseIndex + 1}
                      </span>
                      {isCompleted && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-semibold">
                          ✓ Completato
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-semibold animate-pulse">
                          In corso
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {exercise.name}
                    </h3>
                    <p className="text-sm text-blue-400 italic">
                      {exercise.focus}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-700 rounded-lg p-2 text-center">
                      <Target className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-400">Target</div>
                      <div className="text-sm font-bold text-white">{weekData.sets}</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-2 text-center">
                      <Dumbbell className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-400">Peso</div>
                      <div className="text-sm font-bold text-white">{displayWeight}</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-2 text-center">
                      <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-400">Riposo</div>
                      <div className="text-xs font-bold text-white">{exercise.rest.split(' ')[0]}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Progresso</span>
                      <span>{completedCount}/{exercise.sets}</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(completedCount / exercise.sets) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Set indicators */}
                  <div className="flex gap-1">
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                      const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
                      const isSetCompleted = completedSets[key];
                      
                      return (
                        <div
                          key={setIndex}
                          className={`flex-1 h-1.5 rounded-full ${
                            isSetCompleted ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
