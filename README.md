# 🏋️ Gym Tracker - PPL Workout

Applicazione React per tracciare gli allenamenti secondo una scheda PPL (Push-Pull-Legs) di 5 settimane.

## 🚀 Caratteristiche

- **5 giorni di allenamento** (Push, Legs, Pull, Upper, Recovery)
- **5 settimane di progressione** con aumento graduale del volume
- **Modalità Player** per seguire l'allenamento in tempo reale
- **Timer di riposo** automatico tra i set
- **Tracking completo** dei set completati
- **Personalizzazione pesi** per ogni esercizio
- **Possibilità di saltare giorni** di allenamento
- **Design responsive** e moderno con Tailwind CSS

## 📦 Installazione

### Prerequisiti
- Node.js 16+ installato sul tuo sistema
- npm o yarn

### Passo 1: Clona il repository
```bash
git clone <url-tuo-repository>
cd gym-tracker-app
```

### Passo 2: Installa le dipendenze
```bash
npm install
```

### Passo 3: Avvia il server di sviluppo
```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 🛠️ Build per produzione

Per creare la build di produzione:
```bash
npm run build
```

I file saranno generati nella cartella `dist/`

Per testare la build di produzione localmente:
```bash
npm run preview
```

## 🌐 Deploy Online

### Deploy su Vercel (Consigliato)

1. **Installa Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login su Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. Per il deploy in produzione:
   ```bash
   vercel --prod
   ```

**Oppure tramite GitHub:**
1. Carica il codice su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Importa il tuo repository
4. Vercel configurerà automaticamente il progetto
5. Il tuo sito sarà live in pochi secondi!

### Deploy su Netlify

1. **Installa Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login su Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

**Oppure tramite interfaccia web:**
1. Vai su [netlify.com](https://netlify.com)
2. Trascina la cartella `dist/` dopo aver eseguito `npm run build`
3. Il sito sarà online immediatamente!

## 📁 Struttura del Progetto

```
gym-tracker-app/
├── src/
│   ├── components/
│   │   ├── GymTracker.jsx      # Componente principale
│   │   ├── PlayerMode.jsx      # Modalità allenamento
│   │   └── SettingsModal.jsx   # Modale statistiche
│   ├── data/
│   │   └── workoutData.js      # Dati degli allenamenti
│   ├── App.jsx                 # App principale
│   ├── index.jsx               # Entry point
│   └── index.css               # Stili globali
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Come Usare l'App

1. **Seleziona la settimana** usando le frecce
2. **Scegli il giorno** di allenamento
3. **Clicca "Inizia Allenamento"** per attivare la modalità Player
4. **Completa ogni set** cliccando su "Fatto!"
5. **Segui il timer di riposo** tra i set
6. **Traccia i tuoi progressi** settimana dopo settimana

## 🔧 Tecnologie Utilizzate

- **React 18** - Framework UI
- **Vite** - Build tool velocissimo
- **Tailwind CSS** - Styling utility-first
- **Lucide React** - Icone moderne
- **JavaScript ES6+** - Linguaggio principale

## 📝 Personalizzazione

### Modificare gli esercizi
Modifica il file `src/data/workoutData.js` per aggiungere/rimuovere esercizi o modificare le serie.

### Cambiare i colori
I gradienti sono definiti in `workoutData.js` nel campo `color` di ogni giorno.

### Aggiungere nuove funzionalità
I componenti sono modulari e facili da estendere in `src/components/`.

## 🤝 Contribuire

Sentiti libero di aprire issue o pull request per migliorare l'app!

## 📄 Licenza

MIT License - Sentiti libero di usare questo progetto come preferisci.

## 💪 Buon Allenamento!

Creato con ❤️ per chi ama la palestra e la tecnologia.
