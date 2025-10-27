# 🪟 INTEGRAZIONE FIREBASE - GUIDA WINDOWS 11

## 🎯 Guida Completa Passo-Passo per Windows 11

---

## 📋 PREREQUISITI

Prima di iniziare, assicurati di avere:
- ✅ Node.js installato ([nodejs.org](https://nodejs.org))
- ✅ Git installato ([git-scm.com](https://git-scm.com))
- ✅ Progetto Firebase creato (fatto ✅)
- ✅ Firestore Database attivato (fatto ✅)

---

## 🚀 PARTE 1: PREPARAZIONE PROGETTO

### Step 1: Apri PowerShell come Amministratore

1. Premi `Win + X`
2. Seleziona **"Windows PowerShell (Admin)"** o **"Terminale Windows (Admin)"**

### Step 2: Vai alla cartella del progetto

**Opzione A - Se hai già il progetto su GitHub (clonalo):**

```powershell
# Vai sul Desktop (o dove preferisci)
cd C:\Users\$env:USERNAME\Desktop

# Clona il repository (sostituisci con il TUO username GitHub)
git clone https://github.com/TUO-USERNAME/gym-tracker-app.git

# Entra nella cartella
cd gym-tracker-app
```

**Opzione B - Se hai già la cartella localmente:**

```powershell
# Vai nella cartella dove hai il progetto
cd C:\percorso\completo\gym-tracker-app
```

### Step 3: Verifica di essere nella cartella giusta

```powershell
# Questo comando dovrebbe mostrare i file del progetto
dir
```

Dovresti vedere: `package.json`, `src`, `vite.config.js`, ecc.

---

## 🔥 PARTE 2: INSTALLAZIONE FIREBASE

### Step 4: Scarica i file che ho preparato

**Hai 2 opzioni:**

#### Opzione A - Download manuale:
1. [Scarica questa cartella](computer:///mnt/user-data/outputs/gym-tracker-firebase-integration)
2. Estrai i file sul Desktop

#### Opzione B - Download archivio:
1. [Scarica questo file .tar.gz](computer:///mnt/user-data/outputs/firebase-integration-files.tar.gz)
2. Estrai con 7-Zip o WinRAR

### Step 5: Copia i file nel progetto

**Copia questi file dalla cartella scaricata al tuo progetto:**

```
File da copiare:
├── setup-firebase.ps1         → nella root del progetto
├── .env.example              → nella root del progetto  
├── src/firebase/config.js    → crea cartella src/firebase e metti il file
├── src/hooks/useFirestore.js → crea cartella src/hooks e metti il file
└── GymTracker-modifications.js → nella root del progetto
```

### Step 6: Esegui lo script automatico

Nel PowerShell (nella cartella gym-tracker-app):

```powershell
# Esegui lo script
.\setup-firebase.ps1
```

**Se appare un errore di "execution policy"**, esegui prima:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Poi riprova: `.\setup-firebase.ps1`

---

## 🔐 PARTE 3: CONFIGURARE LE CREDENZIALI

### Step 7: Ottieni le credenziali Firebase

1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
2. Seleziona il tuo progetto
3. Clicca sull'icona **ingranaggio ⚙️** → **Impostazioni progetto**
4. Scorri fino a **"Le tue app"**
5. Se non hai un'app web, clicca sull'icona `</>` per crearne una
6. Registra l'app con un nome (es: "Gym Tracker Web")
7. **COPIA** i valori di `firebaseConfig`

Vedrai qualcosa tipo:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "gym-tracker-xxxxx.firebaseapp.com",
  projectId: "gym-tracker-xxxxx",
  storageBucket: "gym-tracker-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 8: Modifica il file .env

Nel PowerShell:

```powershell
# Apri il file .env con Notepad
notepad .env
```

**Sostituisci** i valori placeholder con le TUE credenziali:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=gym-tracker-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gym-tracker-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=gym-tracker-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Salva e chiudi** Notepad.

---

## ✏️ PARTE 4: MODIFICARE GymTracker.jsx

### Step 9: Apri GymTracker.jsx

Apri il file `src\components\GymTracker.jsx` con il tuo editor preferito (VS Code, Notepad++, ecc.)

### Step 10: Applica le modifiche

Apri il file **`GymTracker-modifications.js`** che hai copiato nella root.

Vedrai **4 sezioni** ben marcate da copiare:

#### 📝 Modifica 1: Aggiungi l'import

**Posizione:** Dopo gli altri import all'inizio del file

```javascript
import { useFirestore } from '../hooks/useFirestore';
```

#### 📝 Modifica 2: Aggiungi l'hook Firebase

**Posizione:** Subito dopo `const GymTracker = () => {`

```javascript
const GymTracker = () => {
  // 🔥 Hook Firebase
  const { 
    isLoading, 
    userData, 
    saveProgress, 
    saveCustomWeights, 
    saveSkippedDays 
  } = useFirestore();

  // I tuoi useState rimangono tutti uguali qui sotto...
```

#### 📝 Modifica 3: Aggiungi i 4 useEffect

**Posizione:** Dopo TUTTI gli useState esistenti

```javascript
// 🔥 Carica dati da Firebase
useEffect(() => {
  if (userData) {
    if (userData.completedSets) setCompletedSets(userData.completedSets);
    if (userData.customWeights) setCustomWeights(userData.customWeights);
    if (userData.skippedDays) setSkippedDays(userData.skippedDays);
    if (userData.progressData) setProgressData(userData.progressData);
  }
}, [userData]);

// 🔥 Salva automaticamente completedSets
useEffect(() => {
  if (!isLoading && Object.keys(completedSets).length > 0) {
    saveProgress(completedSets);
  }
}, [completedSets, isLoading, saveProgress]);

// 🔥 Salva automaticamente customWeights
useEffect(() => {
  if (!isLoading && Object.keys(customWeights).length > 0) {
    saveCustomWeights(customWeights);
  }
}, [customWeights, isLoading, saveCustomWeights]);

// 🔥 Salva automaticamente skippedDays
useEffect(() => {
  if (!isLoading) {
    saveSkippedDays(skippedDays);
  }
}, [skippedDays, isLoading, saveSkippedDays]);
```

#### 📝 Modifica 4: Aggiungi il loader

**Posizione:** All'inizio del `return`, PRIMA di tutto il resto

```javascript
// 🔥 Mostra loader mentre carica
if (isLoading) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-slate-300 text-lg font-semibold">🔥 Caricamento dati...</p>
      </div>
    </div>
  );
}

// Il tuo return normale continua qui...
return (
  <div className="min-h-screen bg-slate-900">
    {/* ... tutto il resto del codice ... */}
```

**Salva** il file.

---

## 🧪 PARTE 5: TESTARE L'INTEGRAZIONE

### Step 11: Avvia il server di sviluppo

Nel PowerShell:

```powershell
npm run dev
```

Aspetta che si avvii (circa 5-10 secondi).

### Step 12: Testa nel browser

1. Apri il browser su `http://localhost:5173`
2. **Completa alcuni set** di un esercizio
3. **Ricarica la pagina** (F5 o CTRL+R)
4. ✅ **I set completati devono essere ancora lì!**

### Step 13: Verifica su Firebase Console

1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
2. Seleziona il tuo progetto
3. Vai su **Firestore Database**
4. Dovresti vedere:
   - Collection: `users`
   - Documento con un ID univoco
   - Campi: `completedSets`, `customWeights`, `skippedDays`, `lastUpdated`

✅ **Se vedi i dati lì, funziona perfettamente!**

---

## 🌐 PARTE 6: DEPLOY SU GITHUB + VERCEL

### Step 14: Push su GitHub

```powershell
# Aggiungi tutti i file
git add .

# Commit
git commit -m "feat: Integrato Firebase per persistenza dati"

# Push su GitHub
git push origin main
```

**IMPORTANTE:** Il file `.env` NON verrà caricato su GitHub (è nel .gitignore)

### Step 15: Configura Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Vai al tuo progetto
3. **Settings** → **Environment Variables**
4. Aggiungi **una per una** tutte le variabili del file `.env`:

```
Nome: VITE_FIREBASE_API_KEY
Valore: [la tua api key]

Nome: VITE_FIREBASE_AUTH_DOMAIN
Valore: [il tuo auth domain]

Nome: VITE_FIREBASE_PROJECT_ID
Valore: [il tuo project id]

Nome: VITE_FIREBASE_STORAGE_BUCKET
Valore: [il tuo storage bucket]

Nome: VITE_FIREBASE_MESSAGING_SENDER_ID
Valore: [il tuo messaging sender id]

Nome: VITE_FIREBASE_APP_ID
Valore: [il tuo app id]
```

5. Salva
6. **Redeploy** il progetto (Deployments → ... → Redeploy)

---

## ✅ CHECKLIST FINALE

- [ ] Firebase SDK installato (`npm install firebase`)
- [ ] File `src/firebase/config.js` creato
- [ ] File `src/hooks/useFirestore.js` creato
- [ ] File `.env` creato con le credenziali corrette
- [ ] File `GymTracker.jsx` modificato (4 modifiche applicate)
- [ ] Test locale funzionante (`npm run dev`)
- [ ] Dati visibili su Firebase Console
- [ ] Variabili d'ambiente aggiunte su Vercel
- [ ] Deploy su GitHub completato
- [ ] App online funzionante

---

## 🆘 PROBLEMI COMUNI

### ❌ Errore: "cannot be loaded because running scripts is disabled"

**Soluzione:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Errore: "Firebase App already exists"

**Soluzione:**
```powershell
# Ferma il server
CTRL + C

# Riavvia
npm run dev
```

### ❌ I dati non si salvano

**Controlla:**
1. File `.env` nella root del progetto (accanto a `package.json`)
2. Credenziali corrette nel file `.env`
3. Modifiche applicate correttamente a `GymTracker.jsx`
4. Console del browser per errori (F12 → Console)

### ❌ Errore "Permission denied" su Firebase

**Soluzione:**
1. Firebase Console → Firestore Database → Regole
2. Verifica che le regole permettano l'accesso

---

## 🎉 COMPLETATO!

Ora la tua app:
- ✅ Salva automaticamente tutti i progressi
- ✅ Sincronizza tra dispositivi
- ✅ Non perde mai dati
- ✅ Funziona online su Vercel

---

## 📞 Hai bisogno di aiuto?

Se qualcosa non funziona:
1. Verifica la checklist sopra
2. Controlla i problemi comuni
3. Controlla la console del browser (F12)
4. Verifica che tutti i file siano al posto giusto

---

💪 **Ottimo lavoro! Il tuo Gym Tracker è pronto per il cloud!**
