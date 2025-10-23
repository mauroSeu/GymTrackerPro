// src/GymTracker.jsx
import React from 'react';
import { useGymTracker } from './hooks/useTrackerLogic';
import PlayerMode from './components/PlayerMode';
import OverviewMode from './components/OverviewMode';

const GymTracker = () => {
  // Ottiene tutta la logica dal custom hook
  const logic = useGymTracker();
  
  // Player Mode prende il sopravvento su tutta la schermata
  if (logic.playerMode) {
    // Passa tutte le proprietà dell'hook al componente PlayerMode
    return <PlayerMode {...logic} />;
  }

  // Vista principale (Overview)
  return <OverviewMode {...logic} />;
};

// Componente di fallback per la vista principale, ora isolato
const OverviewMode = ({ 
  currentDay, setCurrentDay, currentWeek, setCurrentWeek, workoutDays, dayDisplayMap,
  isDayCompleted, isDaySkipped, isWeekCompleted, toggleSkipDay, startPlayerMode,
  currentDayData, currentExerciseData, completedSets, customWeights,
  toggleSetComplete, setWeight, editingWeight, setEditingWeight, isExerciseCompleted
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-4xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="mb-8 pt-6 flex items-center justify-start">
          <div className="flex items-center gap-3">
            {/* Dumbbell non importato, usa emoji o importalo */}
            <div className="text-3xl text-blue-400">🏋️</div> 
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Gym Tracker
            </h1>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-6">Progressione e Volume 5 Settimane</p>

        {/* CONTENITORE PRINCIPALE DI SELEZIONE (Settimana e Giorno) */}
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl border border-gray-700">
          
          {/* Riga 1: Titolo Settimana e Selettori Settimana */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center justify-start gap-3">
              <div className="text-xl text-blue-400">🗓️</div> 
              <span className="text-xl font-bold">Settimana {currentWeek}</span>
            </div>
            
            {/* Bottoni Settimana (Mappa) */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(week => {
                const weekCompleted = isWeekCompleted(week);
                return (
                  <button
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all relative text-sm shadow-md
                      ${
                        currentWeek === week
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-purple-500/30 border-2 border-white'
                          : weekCompleted
                          ? 'bg-gray-700 text-white opacity-90 hover:bg-gray-600'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }
                    `}
                    aria-label={`Settimana ${week}`}
                  >
                    {week}
                    {weekCompleted && currentWeek !== week && (
                      <div className="absolute -top-1 -right-1 bg-green-400 rounded-full w-4 h-4 flex items-center justify-center border-2 border-gray-900">
                        ✔️
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Riga 2: Bottoni Giorno (Mappa) */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            {workoutDays.map((day, index) => {
              const isCompleted = isDayCompleted(currentWeek, index);
              const isSkipped = isDaySkipped(currentWeek, index);
              const displayDay = dayDisplayMap[index];
              
              return (
                <WorkoutDayCard 
                  key={index}
                  index={index}
                  dayData={day}
                  displayDay={displayDay}
                  currentDay={currentDay}
                  currentWeek={currentWeek}
                  isCompleted={isCompleted}
                  isSkipped={isSkipped}
                  setCurrentDay={setCurrentDay}
                  toggleSkipDay={toggleSkipDay}
                />
              );
            })}
          </div>
        </div>

        {/* Current Day Card / Inizia Allenamento */}
        <div className={`bg-gradient-to-br ${currentDayData.color} rounded-2xl p-8 mb-6 shadow-2xl transition-transform border border-white border-opacity-10`}>
          <div className="text-center">
            <div className="text-5xl mb-3 text-white">{currentDayData.icon}</div>
            <h2 className="text-3xl font-bold mb-2 text-white">{currentDayData.name}</h2>
            <p className="text-lg opacity-90 text-white mb-6">{currentDayData.exercises.length} esercizi</p>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={startPlayerMode}
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-3"
                aria-label="Inizia allenamento"
              >
                ▶️ Inizia Allenamento
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
                {isDaySkipped(currentWeek, currentDay) ? 'Riattiva' : 'Salta Giorno'} ❌
              </button>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        {isDaySkipped(currentWeek, currentDay) ? (
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-2xl font-bold mb-2">Giorno Saltato</h3>
            <p className="text-gray-400">Hai deciso di saltare questo allenamento per la Settimana {currentWeek}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDayData.exercises.map((exercise, exerciseIndex) => (
              <ExerciseListItem
                key={exerciseIndex}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                currentDay={currentDay}
                currentWeek={currentWeek}
                completedSets={completedSets}
                customWeights={customWeights}
                toggleSetComplete={toggleSetComplete}
                setWeight={setWeight}
                editingWeight={editingWeight}
                setEditingWeight={setEditingWeight}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymTracker;