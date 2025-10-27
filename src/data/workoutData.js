// Definizione della scheda PPL a 5 giorni
export const workoutDays = [
  {
    name: "Push (Petto/Spalle/Tricipiti)",
    shortName: "Push",
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
          { week: 5, sets: "3x20", weight: "" }
        ]
      },
      {
        name: "Leg Curl",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Femorali (Isolamento)",
        weeklyPlan: [
          { week: 1, sets: "3x12", weight: "" },
          { week: 2, sets: "3x13", weight: "" },
          { week: 3, sets: "3x14", weight: "" },
          { week: 4, sets: "3x15", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Hip Thrust o Ponte Glutei",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Glutei (Contrazione di Picco)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Calf Raise Seduto/In Piedi",
        sets: 4,
        repsRange: "12-20",
        rest: "60-90 sec",
        focus: "Polpacci (Massimo Range)",
        weeklyPlan: [
          { week: 1, sets: "4x12", weight: "" },
          { week: 2, sets: "4x14", weight: "" },
          { week: 3, sets: "4x16", weight: "" },
          { week: 4, sets: "4x18", weight: "" },
          { week: 5, sets: "4x20", weight: "" }
        ]
      }
    ]
  },
  {
    name: "Pull (Dorso/Bicipiti/Deltoidi Posteriori)",
    shortName: "Pull",
    icon: "🏋️",
    exercises: [
      {
        name: "Pulley Basso",
        sets: 3,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Dorsali (Spessore)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "62kg" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Lat Machine Presa Stretta (Sottomano)",
        sets: 3,
        repsRange: "10-15",
        rest: "90-120 sec",
        focus: "Dorsali (Contrazione)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "52kg" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Pullover Manubrio o Cavo",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Dorsali (Stretch Lungo)",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "14kg" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Face Pull",
        sets: 4,
        repsRange: "15-20",
        rest: "60 sec",
        focus: "Deltoidi Posteriori + Cuffia Rotatori",
        weeklyPlan: [
          { week: 1, sets: "4x15", weight: "21kg" },
          { week: 2, sets: "4x16", weight: "" },
          { week: 3, sets: "4x17", weight: "" },
          { week: 4, sets: "4x18", weight: "" },
          { week: 5, sets: "4x20", weight: "" }
        ]
      },
      {
        name: "Curl Bilanciere EZ",
        sets: 3,
        repsRange: "8-12",
        rest: "60-90 sec",
        focus: "Bicipiti (Tensione Meccanica)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "22kg" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Hammer Curl",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Brachiale + Brachioradiale",
        weeklyPlan: [
          { week: 1, sets: "3x10", weight: "15kg" },
          { week: 2, sets: "3x11", weight: "" },
          { week: 3, sets: "3x12", weight: "" },
          { week: 4, sets: "3x13", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      }
    ]
  },
  {
    name: "Upper (Petto/Dorso/Spalle)",
    shortName: "Upper",
    icon: "💎",
    exercises: [
      {
        name: "Panca Inclinata con Manubri",
        sets: 3,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Petto Alto (Range Stretch)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "14kg" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Rematore con Bilanciere Pendlay",
        sets: 3,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Dorso (Tensione Meccanica)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "30kg" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Shoulder Press Manubri",
        sets: 3,
        repsRange: "8-12",
        rest: "90-120 sec",
        focus: "Deltoidi (Tensione)",
        weeklyPlan: [
          { week: 1, sets: "3x8", weight: "14kg" },
          { week: 2, sets: "3x9", weight: "" },
          { week: 3, sets: "3x10", weight: "" },
          { week: 4, sets: "3x11", weight: "" },
          { week: 5, sets: "3x12", weight: "" }
        ]
      },
      {
        name: "Cable Fly Alto o Basso",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Petto (Contrazione di Picco)",
        weeklyPlan: [
          { week: 1, sets: "3x12", weight: "7kg" },
          { week: 2, sets: "3x13", weight: "" },
          { week: 3, sets: "3x14", weight: "" },
          { week: 4, sets: "3x15", weight: "" },
          { week: 5, sets: "3x15", weight: "" }
        ]
      },
      {
        name: "Alzate Frontali + Laterali Superset",
        sets: 3,
        repsRange: "12-15",
        rest: "60-90 sec",
        focus: "Spalle (Pompaggio)",
        weeklyPlan: [
          { week: 1, sets: "3x12+12", weight: "8kg+8kg" },
          { week: 2, sets: "3x12+12", weight: "" },
          { week: 3, sets: "3x13+13", weight: "" },
          { week: 4, sets: "3x14+14", weight: "" },
          { week: 5, sets: "3x15+15", weight: "" }
        ]
      },
      {
        name: "Curl Concentrato + Push Down Tricipiti",
        sets: 3,
        repsRange: "10-15",
        rest: "60-90 sec",
        focus: "Braccia (Completamento)",
        weeklyPlan: [
          { week: 1, sets: "3x10+10", weight: "11kg+21kg" },
          { week: 2, sets: "3x11+11", weight: "" },
          { week: 3, sets: "3x12+12", weight: "" },
          { week: 4, sets: "3x13+13", weight: "" },
          { week: 5, sets: "3x15+15", weight: "" }
        ]
      }
    ]
  },
  {
    name: "Active Recovery",
    shortName: "Recovery",
    icon: "🧘",
    exercises: [
      {
        name: "Camminata Leggera o Cyclette",
        sets: 1,
        repsRange: "20-30 min",
        rest: "N/A",
        focus: "Recupero Attivo (Bassa Intensità)",
        weeklyPlan: [
          { week: 1, sets: "20 min", weight: "" },
          { week: 2, sets: "22 min", weight: "" },
          { week: 3, sets: "25 min", weight: "" },
          { week: 4, sets: "27 min", weight: "" },
          { week: 5, sets: "30 min", weight: "" }
        ]
      },
      {
        name: "Stretching Dinamico",
        sets: 1,
        repsRange: "10-15 min",
        rest: "N/A",
        focus: "Mobilità + Flessibilità",
        weeklyPlan: [
          { week: 1, sets: "10 min", weight: "" },
          { week: 2, sets: "12 min", weight: "" },
          { week: 3, sets: "13 min", weight: "" },
          { week: 4, sets: "14 min", weight: "" },
          { week: 5, sets: "15 min", weight: "" }
        ]
      },
      {
        name: "Core Work (Plank + Russian Twist)",
        sets: 3,
        repsRange: "60 sec + 20 reps",
        rest: "60 sec",
        focus: "Addominali (Stabilizzazione)",
        weeklyPlan: [
          { week: 1, sets: "3x60s+20", weight: "" },
          { week: 2, sets: "3x65s+22", weight: "" },
          { week: 3, sets: "3x70s+24", weight: "" },
          { week: 4, sets: "3x75s+26", weight: "" },
          { week: 5, sets: "3x80s+30", weight: "" }
        ]
      },
      {
        name: "Foam Rolling",
        sets: 1,
        repsRange: "10-15 min",
        rest: "N/A",
        focus: "Rilascio Miofasciale",
        weeklyPlan: [
          { week: 1, sets: "10 min", weight: "" },
          { week: 2, sets: "12 min", weight: "" },
          { week: 3, sets: "13 min", weight: "" },
          { week: 4, sets: "14 min", weight: "" },
          { week: 5, sets: "15 min", weight: "" }
        ]
      }
    ]
  }
];