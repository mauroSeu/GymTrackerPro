// src/components/WorkoutDayCard.jsx
import React from 'react';

const WorkoutDayCard = ({ 
  index, dayData, displayDay, currentDay, currentWeek, 
  isCompleted, isSkipped, setCurrentDay, toggleSkipDay 
}) => {
  return (
    <button
      onClick={() => setCurrentDay(index)}
      className={`flex flex-col items-center justify-center p-3 h-28 rounded-xl font-bold transition-all relative shadow-xl ${
        currentDay === index
          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white scale-105 shadow-purple-500/30 border-2 border-white'
          : isSkipped
          ? 'bg-red-500 bg-opacity-70 text-white shadow-red-500/30 hover:opacity-90'
          : isCompleted
          ? 'bg-green-500 bg-opacity-70 text-white shadow-green-500/30 hover:opacity-90'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
      aria-label={displayDay.label}
    >
      <div className="text-3xl mb-1">{displayDay.icon}</div>
      <div className="font-extrabold text-sm">{displayDay.label}</div>
      {isCompleted && !isSkipped && (
        <div className="absolute top-1 right-1 bg-green-400 rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
          ✔️
        </div>
      )}
      {isSkipped && (
        <div className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
          ❌
        </div>
      )}
    </button>
  );
};

export default WorkoutDayCard;