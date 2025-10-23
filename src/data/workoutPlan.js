// src/data/workoutPlan.js

// Definizione della scheda PPL a 5 giorni
export const workoutDays = [
  {
    name: "Push (Petto/Spalle/Tricipiti)",
    shortName: "Push",
    color: "from-red-500 to-pink-500",
    icon: "💪",
    exercises: [
      {
        name: "Panca Piana con Bilanciere",
        sets: 3,
        repsRange: "8-12",
        rest: "120-180 sec",
        focus: "Petto (Tensione Meccanica)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "15kg" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Lat Machine Presa Larga",
        sets: 3,
        repsRange: "10-15",
        rest: "90-120 sec",
        focus: "Dorsali (Larghezza)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "45kg" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Dips o Chest Press Macchina",
        sets: 3,
        repsRange: "10-15",
        rest: "90-120 sec",
        focus: "Petto (Range Controllato)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "46kg" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x14", weight: "" }
        ]
      },
      {
        name: "Rematore con Manubrio a 1 Braccio",
        sets: 3,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Spessore Schiena",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "14kg" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Alzate Laterali Cavi/Manubri",
        sets: 4,
        repsRange: "12-20",
        rest: "60-90 sec",
        focus: "Deltoidi Mediali (Massimo Pompaggio)",
        weeklyPlan: [
          { week: 1, sets: "4x12", weight: "9kg" },
          { week: 2, sets: "4x12", weight: "" },
          { week: 3, sets: "4x13", weight: "" },
          { week: 4, sets: "4x14", weight: "" },
          { week: 5, sets: "4x15", weight: "" }
        ]
      },
      {
        name: "Estensioni Tricipiti Cavi (Overhead)",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Tricipiti (Capo Lungo in Stretch)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "14kg" },
          { week: 2, sets: "3x10", weight: "" },
          { week: 3, sets: "3x11", weight: "" },
          { week: 4, sets: "3x12", weight: "" },
          { week: 5, sets: "3x13", weight: "" }
        ]
      },
      {
        name: "Curl Manubri Panca Inclinata",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Bicipiti (Capo Lungo in Stretch)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "23kg" },
          { week: 2, sets: "3x10", weight: "" },
          { week: 3, sets: "3x11", weight: "" },
          { week: 4, sets: "3x12", weight: "" },
          { week: 5, sets: "3x13", weight: "" }
        ]
      }
    ]
  },
  {
    name: "Gambe",
    shortName: "Legs",
    color: "from-blue-500 to-cyan-500",
    icon: "🦵",
    exercises: [
      {
        name: "Hack Squat o Leg Press (Piedi Bassi)",
        sets: 4,
        repsRange: "10-15",
        rest: "120-180 sec",
        focus: "Quadricipiti (Volume Alto)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Stacchi Rumeni con Bilanciere/Manubri",
        sets: 3,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Femorali/Glutei (Tensione)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Leg Extension",
        sets: 3,
        repsRange: "15-20",
        rest: "60-90 sec",
        focus: "Quadricipiti (Pompaggio/Isolamento)",
        weeklyPlan: [
          { week: 1, sets: "3x15", weight: "" },
          { week: 2, sets: "3x16", weight: "" },
          { week: 3, sets: "3x17", weight: "" },
          { week: 4, sets: "3x18", weight: "" },
          { week: 5, sets: "3x19", weight: "" }
        ]
      },
      {
        name: "Affondi con Manubri (in camminata o statici)",
        sets: 3,
        repsRange: "10-15",
        rest: "90-120 sec",
        focus: "Quadricipiti/Glutei (Unilaterale)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Leg Curl Seduto/Sdraiato",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Femorali (Isolamento)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Calf Raise in Piedi (Stretch completo)",
        sets: 4,
        repsRange: "15-20",
        rest: "60 sec",
        focus: "Polpacci (Volume)",
        weeklyPlan: [
          { week: 1, sets: "3x15", weight: "" },
          { week: 2, sets: "3x16", weight: "" },
          { week: 3, sets: "3x17", weight: "" },
          { week: 4, sets: "3x18", weight: "" },
          { week: 5, sets: "3x19", weight: "" }
        ]
      },
      {
        name: "Crunch al Cavo",
        sets: 3,
        repsRange: "15-20",
        rest: "60 sec",
        focus: "Addominali (Volume)",
        weeklyPlan: [
          { week: 1, sets: "3x15", weight: "" },
          { week: 2, sets: "3x16", weight: "" },
          { week: 3, sets: "3x17", weight: "" },
          { week: 4, sets: "3x18", weight: "" },
          { week: 5, sets: "3x19", weight: "" }
        ]
      }
    ]
  },
  {
    name: "Push (Spalle/Petto Superiore)",
    shortName: "Push",
    color: "from-purple-500 to-pink-500",
    icon: "🏋️",
    exercises: [
      {
        name: "Shoulder Press Manubri da Seduto",
        sets: 3,
        repsRange: "8-12",
        rest: "120-180 sec",
        focus: "Deltoidi Anteriori (Forza/Volume)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Panca Inclinata con Manubri",
        sets: 3,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Petto Superiore (Stretch e Tensione)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Alzate Laterali Cavi (in superset con Face Pull)",
        sets: 3,
        repsRange: "15-20",
        rest: "60 sec",
        focus: "Deltoidi Mediali (Massimo Pompaggio)",
        weeklyPlan: [
          { week: 1, sets: "3x15", weight: "" },
          { week: 2, sets: "3x16", weight: "" },
          { week: 3, sets: "3x17", weight: "" },
          { week: 4, sets: "3x18", weight: "" },
          { week: 5, sets: "3x19", weight: "" }
        ]
      },
      {
        name: "Face Pull",
        sets: 3,
        repsRange: "15-20",
        rest: "60 sec",
        focus: "Cuffia Rotatori/Deltoidi Posteriori",
        weeklyPlan: [
          { week: 1, sets: "3x15", weight: "" },
          { week: 2, sets: "3x16", weight: "" },
          { week: 3, sets: "3x17", weight: "" },
          { week: 4, sets: "3x18", weight: "" },
          { week: 5, sets: "3x19", weight: "" }
        ]
      },
      {
        name: "Croci ai Cavi (dal basso verso l'alto)",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Petto Superiore (Isolamento)",
        weeklyPlan: [
          { week: 1, sets: "3x12", weight: "" },
          { week: 2, sets: "3x12", weight: "" },
          { week: 3, sets: "3x13", weight: "" },
          { week: 4, sets: "3x14", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Pushdown Cavi con Corda",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Tricipiti (Contrazione)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Alzate Frontali con Manubri/Disco",
        sets: 2,
        repsRange: "10-15",
        rest: "60 sec",
        focus: "Deltoidi Anteriori (Volume extra)",
        weeklyPlan: [
          { week: 1, sets: "2x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      }
    ]
  },
  {
    name: "Pull (Schiena/Bicipiti)",
    shortName: "Pull",
    color: "from-green-500 to-emerald-500",
    icon: "💪",
    exercises: [
      {
        name: "Rematore con Bilanciere (Presa Prona)",
        sets: 3,
        repsRange: "8-12",
        rest: "120-180 sec",
        focus: "Spessore Schiena (Fondamentale)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Trazioni o Lat Machine Presa Neutra (Close Grip)",
        sets: 3,
        repsRange: "10-15",
        rest: "90-120 sec",
        focus: "Dorsali (Stretch/Larghezza)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Pullover con Manubrio o Cavo",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Dorsali (Isolamento/Stretch)",
        weeklyPlan: [
          { week: 1, sets: "3x12", weight: "" },
          { week: 2, sets: "3x12", weight: "" },
          { week: 3, sets: "3x13", weight: "" },
          { week: 4, sets: "3x14", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Rematore alla Macchina (Tipo T-Bar o Seduto)",
        sets: 3,
        repsRange: "10-15",
        rest: "90-120 sec",
        focus: "Spessore Schiena (Isolamento)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Curl al Cavo con Barra Dritta",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Bicipiti (Contrazione)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Hammer Curl Manubri",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Brachiale/Avambracci (Spessore Braccio)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Shrugs con Manubri/Bilanciere",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Trapezi Superiori",
        weeklyPlan: [
          { week: 1, sets: "3x12", weight: "" },
          { week: 2, sets: "3x12", weight: "" },
          { week: 3, sets: "3x13", weight: "" },
          { week: 4, sets: "3x14", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      }
    ]
  },
  {
    name: "Gambe (Glutei/Femorali)",
    shortName: "Legs",
    color: "from-orange-500 to-red-500",
    icon: "🦵",
    exercises: [
      {
        name: "Hip Thrust con Bilanciere/Macchina",
        sets: 4,
        repsRange: "8-12",
        rest: "120-180 sec",
        focus: "Glutei/Femorali (Contrazione di Picco)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Leg Press (Piedi Alti)",
        sets: 3,
        repsRange: "10-15",
        rest: "90-120 sec",
        focus: "Quadricipiti/Glutei (Volume)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Leg Curl Seduto/Sdraiato",
        sets: 4,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Femorali (High Volume/Tensione)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Hack Squat Invertito o Sissy Squat",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Quadricipiti (Isolamento/Pompaggio)",
        weeklyPlan: [
          { week: 1, sets: "3x12", weight: "" },
          { week: 2, sets: "3x12", weight: "" },
          { week: 3, sets: "3x13", weight: "" },
          { week: 4, sets: "3x14", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Iperestensioni (Hyperextension) 45°",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Femorali/Lombari (Range Completo)",
        weeklyPlan: [
          { week: 1, sets: "3x12", weight: "" },
          { week: 2, sets: "3x12", weight: "" },
          { week: 3, sets: "3x13", weight: "" },
          { week: 4, sets: "3x14", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Calf Raise Seduto",
        sets: 4,
        repsRange: "15-20",
        rest: "60 sec",
        focus: "Polpacci (Capo Soleo)",
        weeklyPlan: [
          { week: 1, sets: "3x15", weight: "" },
          { week: 2, sets: "3x16", weight: "" },
          { week: 3, sets: "3x17", weight: "" },
          { week: 4, sets: "3x18", weight: "" },
          { week: 5, sets: "3x19", weight: "" }
        ]
      },
      {
        name: "Oblique Crunches o Side Bend con Manubrio",
        sets: 3,
        repsRange: "15-20",
        rest: "60 sec",
        focus: "Obliqui",
        weeklyPlan: [
          { week: 1, sets: "3x15", weight: "" },
          { week: 2, sets: "3x16", weight: "" },
          { week: 3, sets: "3x17", weight: "" },
          { week: 4, sets: "3x18", weight: "" },
          { week: 5, sets: "3x19", weight: "" }
        ]
      }
    ]
  }
];

// Mappa per le etichette di visualizzazione dei giorni
export const dayDisplayMap = [
  { label: "Push", icon: "💪" },
  { label: "Legs", icon: "🦵" },
  { label: "Upper", icon: "🏋️" }, 
  { label: "Pull", icon: "↩️" }, 
  { label: "Lower", icon: "🏃" }, 
];