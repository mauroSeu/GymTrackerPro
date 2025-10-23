// src/components/ExerciseListItem.jsx
import React from 'react';
import { Target, Clock, Dumbbell } from 'lucide-react';

const ExerciseListItem = ({
  exercise, exerciseIndex, currentDay, currentWeek, completedSets, customWeights,
  toggleSetComplete, setWeight, editingWeight, setEditingWeight
}) => {
  const weekData = exercise.weeklyPlan[currentWeek - 1];
  const completedCount = Array.from({ length: exercise.sets }).filter((_, setIndex) => {
    const key = `${currentDay}-${currentWeek}-${exerciseIndex}-${setIndex}`;
    return completedSets[key];
  }).length;
  
  const weightKey = `${currentDay}-${currentWeek}-${exerciseIndex}`;
  const customWeight = customWeights[weightKey];
  const displayWeight = customWeight || weekData.weight;
  const isEditingThisWeight = editingWeight === weightKey;
  
  const handleWeightInput = (e) => {
    const value = e.target.value.trim();
    if (value) {
      setWeight(weightKey, value + (value.includes('kg') ? '' : 'kg'));
    }
    setEditingWeight(null);
  };
  
  const getRestTimeDisplay = () => {
    const restParts = exercise.rest.replace(' sec', '').split('-').map(s => s.trim());
    if (restParts.length === 1) return restParts[0] + ' sec';
    return (currentWeek <= 3 ? restParts[0] : restParts[1]) + ' sec';
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-blue-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-white">{exercise.name}</h3>
          <p className="text-sm text-blue-400 italic mb-3">{exercise.focus}</p>
          
          <div className="flex flex-wrap gap-2 text-sm mb-3">
            {/* Target Sets/Reps */}
            <div className="flex items-center gap-1 bg-blue-500 bg-opacity-20 px-3 py-1.5 rounded-full">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="font-semibold">{weekData.sets}</span>
            </div>
            {/* Rest Time */}
            <div className="flex items-center gap-1 bg-yellow-500 bg-opacity-20 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>{getRestTimeDisplay()}</span>
            </div>
            
            {/* Weight badge/Input */}
            {isEditingThisWeight ? (
              <div className="flex items-center gap-1 bg-purple-500 bg-opacity-20 px-2 py-1 rounded-full border border-purple-500">
                <Dumbbell className="w-4 h-4 text-purple-400" />
                <input
                  type="number"
                  pattern="[0-9]*"
                  placeholder="es. 50"
                  autoFocus
                  className="bg-transparent text-white w-16 outline-none font-semibold text-center"
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') handleWeightInput(e) }}
                  onBlur={handleWeightInput}
                />
                <span className="text-xs">kg</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!weekData.weight) { setEditingWeight(weightKey); }
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
        
        {/* Contatore Set Completati */}
        <div className="ml-4 bg-white bg-opacity-10 text-white rounded-xl p-3 flex flex-col items-center justify-center font-bold text-center border border-white/20 min-w-[50px]">
          <span className="text-xl">{completedCount}</span>
          <span className="text-xs opacity-70">/{exercise.sets}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
          style={{ width: `${(completedCount / exercise.sets) * 100}%` }}
        />
      </div>

      {/* Set buttons (per segnare il completamento manuale) */}
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
            >
              Set {setIndex + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExerciseListItem;