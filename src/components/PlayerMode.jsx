import React, { useEffect } from 'react';
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
  skipTimer,
  previousExercise,
  nextExercise,
  setShowSettings,
  formatTime,
  activeThemeGradient 
}) => {
  
  // === BLOCCO SCORRIMENTO PAGINA ===
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Controlli per evitare errori
  const currentDayData = workoutDays[currentDay];
  if (!currentDayData || !currentDayData.exercises || !currentDayData.exercises[currentExercise]) {
      return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Caricamento dati allenamento...</div>;
  }
  
  const currentExerciseData = currentDayData.exercises[currentExercise];
  const weekData = currentExerciseData.weeklyPlan && currentExerciseData.weeklyPlan[currentWeek - 1] 
    ? currentExerciseData.weeklyPlan[currentWeek - 1] 
    : { sets: 'N/A', weight: 'N/A' };

  const weightKey = `${currentDay}-${currentWeek}-${currentExercise}`;
  const customWeight = customWeights[weightKey];
  const displayWeight = customWeight || weekData.weight || 'N/A';

  // Calcolo barra progresso basato su serie completate
  const totalSets = currentDayData.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  const completedSetsCount = currentDayData.exercises.reduce((count, ex, exIdx) => {
    return count + Array.from({ length: ex.sets || 0 }).filter((_, setIdx) => {
      const key = `${currentDay}-${currentWeek}-${exIdx}-${setIdx}`;
      return completedSets[key];
    }).length;
  }, 0);
  const progress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0;

  const completedExercises = currentDayData.exercises.filter((ex, idx) => {
    return Array.from({ length: ex.sets || 0 }).every((_, setIdx) => {
      const key = `${currentDay}-${currentWeek}-${idx}-${setIdx}`;
      return completedSets[key];
    });
  }).length;

  // Check se l'esercizio corrente è completato
  const isExerciseCompleted = Array.from({ length: currentExerciseData.sets || 0 }).every((_, setIdx) => {
    const key = `${currentDay}-${currentWeek}-${currentExercise}-${setIdx}`;
    return completedSets[key];
  });

  // 🔥 CORREZIONE BUG: Calcola il numero di serie completate per l'esercizio corrente
  const currentExerciseCompletedSetsCount = Array.from({ length: currentExerciseData.sets || 0 }).filter((_, setIdx) => {
    const key = `${currentDay}-${currentWeek}-${currentExercise}-${setIdx}`;
    return completedSets[key];
  }).length;


  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeThemeGradient} grid font-sans`} style={{ gridTemplateRows: 'auto 1fr auto' }}>
     
      {/* === HEADER === */}
      <header>
        {/* Header Player */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPlayerMode(false)}
              className="p-2 active:bg-white active:bg-opacity-20 rounded-lg transition-all"
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
              className="p-2 bg-white bg-opacity-20 active:bg-white active:bg-opacity-30 rounded-lg transition-all"
              aria-label="Vedi statistiche esercizi"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center">
        <div className="w-full px-6 flex justify-center">
          
          {/* RIQUADRO BIANCO - Exercise Card */}
          <div className="bg-[#2c3855] bg-opacity-95 rounded-3xl shadow-2xl max-w-xs w-full p-1">
            <div className="bg-[#2c3855] rounded-[21px] p-5 flex flex-col justify-between min-h-[23rem]">
              
              {/* Header Esercizio - SEMPRE VISIBILE - ALTEZZA FISSA */}
              <div className="text-center mb-4 flex-shrink-0">
                <div className="text-xs font-semibold text-gray-400 mb-1">
                  Esercizio {currentExercise + 1}/{currentDayData.exercises.length}
                </div>
                <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">
                  {currentExerciseData.name || 'Nome Esercizio'}
                </h2>
                <p className="text-xs text-blue-400 italic line-clamp-1">
                  {currentExerciseData.focus || 'Focus'}
                </p>
              </div>

              <div className="flex-grow flex flex-col justify-center">
                {/* STATO 2: Esercizio Completato */}
                {isExerciseCompleted && (
                  <div className="flex flex-col justify-center">
                  {/* Exercise Details - 3 colonne: Serie, Ripetizioni, Peso */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-[#3a4a6e] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Serie</div>
                      <div className="text-lg font-bold text-white">{currentExerciseCompletedSetsCount}/{currentExerciseData.sets || 0}</div>
                    </div>
                    <div className="bg-[#3a4a6e] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Ripetizioni</div>
                      <div className="text-lg font-bold text-white">
                        {typeof weekData.sets === 'string' && weekData.sets.includes('x') 
                          ? weekData.sets.split('x')[1] 
                          : weekData.sets}
                      </div>
                    </div>
                    <div className="bg-[#3a4a6e] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Peso</div>
                      <div className="text-lg font-bold text-white">{displayWeight}</div>
                    </div>
                  </div>

                  {/* Completed Sets Progress */}
                  {(currentExerciseData.sets || 0) > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Progresso Serie</span>
                        <span>{currentExerciseCompletedSetsCount}/{currentExerciseData.sets || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        {Array.from({ length: currentExerciseData.sets || 0 }).map((_, idx) => {
                          return (
                            <div
                              key={idx}
                              className="flex-1 h-2 rounded-full bg-green-500"
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SCRITTA COMPLETATO al posto del bottone */}
                  <div className="w-full py-4 px-6 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center gap-3">
                    <div className="bg-green-500/30 rounded-full p-2">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="font-semibold text-lg text-green-300">Esercizio Completato</span>
                  </div>
                  </div>
                )}

                {/* STATO 3: Serie Attiva & Timer di Recupero (COMBINED) */}
                {!isExerciseCompleted && (
                  <div className="flex flex-col justify-center">
                  {/* Exercise Details - 3 colonne: Serie, Ripetizioni, Peso */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-[#3a4a6e] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Serie</div>
                      <div className="text-lg font-bold text-white">{isResting ? currentSet : currentSet + 1}/{currentExerciseData.sets || 0}</div>
                    </div>
                    <div className="bg-[#3a4a6e] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Ripetizioni</div>
                      <div className="text-lg font-bold text-white">
                        {typeof weekData.sets === 'string' && weekData.sets.includes('x') 
                          ? weekData.sets.split('x')[1] 
                          : weekData.sets}
                      </div>
                    </div>
                    <div className="bg-[#3a4a6e] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Peso</div>
                      <div className="text-lg font-bold text-white">{displayWeight}</div>
                    </div>
                  </div>

                  {/* Completed Sets Progress */}
                  {(currentExerciseData.sets || 0) > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Progresso Serie</span>
                        <span>{currentExerciseCompletedSetsCount}/{currentExerciseData.sets || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        {Array.from({ length: currentExerciseData.sets || 0 }).map((_, idx) => {
                          const key = `${currentDay}-${currentWeek}-${currentExercise}-${idx}`;
                          const isCompleted = completedSets[key];
                          const isCurrent = idx === currentSet;

                          return (
                            <div
                              key={idx}
                              className={`flex-1 h-2 rounded-full transition-all ${
                                isCompleted
                                  ? 'bg-green-500'
                                  : isCurrent && !isResting
                                  ? 'bg-blue-500 animate-pulse'
                                  : 'bg-gray-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* BOTTONE / TIMER */}
                  {isResting ? (
                    <button
                      onClick={skipTimer}
                      className="w-full py-4 px-6 rounded-full font-bold text-lg text-white
                               bg-gradient-to-r from-orange-400 to-red-500
                               shadow-lg active:scale-95 transition-transform
                               flex items-center justify-center gap-2"
                    >
                      <Timer className="w-6 h-6 animate-spin" />
                      {formatTime(restTimer)}
                    </button>
                  ) : (
                    <button
                      onClick={completeSet}
                      className="w-full py-4 px-6 rounded-full font-bold text-lg text-white
                               bg-gradient-to-r from-green-400 via-green-500 to-green-600
                               shadow-lg active:scale-95 transition-transform
                               flex items-center justify-center gap-2"
                    >
                      <Check className="w-6 h-6" />
                      Completa Serie
                    </button>
                  )}                  
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* === FOOTER === */}
      <footer className="bg-black bg-opacity-40 backdrop-blur-lg pt-2 pb-6 px-6 flex-shrink-0">
        {/* Progress Bar */}
        <div className="bg-black bg-opacity-20 flex-shrink-0 mb-4">
          <div
            className="bg-white h-1 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-md mx-auto">
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousExercise}
              disabled={currentExercise === 0}
              className={`p-3 rounded-full ${
                currentExercise === 0
                  ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                  : 'bg-white active:scale-95'
              } transition-all shadow-lg`}
              aria-label="Esercizio precedente"
            >
              <SkipBack className="w-6 h-6 text-gray-900" />
            </button>

            <div className="text-white text-center">
              {completedExercises === currentDayData.exercises.length ? (
                <div className="text-green-400 font-bold text-lg flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Scheda Completata!
                </div>
              ) : (
                <>
                  <div className="text-xs opacity-80">Prossimo</div>
                  <div className="text-sm font-semibold">
                    {currentExercise < currentDayData.exercises.length - 1
                      ? (currentDayData.exercises[currentExercise + 1].name || 'Esercizio').substring(0, 20) + '...'
                      : 'Fine'}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={nextExercise}
              disabled={currentExercise === currentDayData.exercises.length - 1}
              className={`p-3 rounded-full ${
                currentExercise === currentDayData.exercises.length - 1
                  ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                  : 'bg-white active:scale-95'
              } transition-all shadow-lg`}
              aria-label="Esercizio successivo"
            >
              <SkipForward className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlayerMode;
