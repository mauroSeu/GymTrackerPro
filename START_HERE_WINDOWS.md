# 🪟 INIZIA DA QUI - Windows 11

## 🎯 Integrazione Firebase in 5 Step

---

## 📦 STEP 1: Vai nella cartella del progetto

Apri **PowerShell** (Win + X → Windows PowerShell)

```powershell
# Vai dove hai il progetto
cd C:\percorso\gym-tracker-app

# OPPURE clona da GitHub se non ce l'hai ancora
cd C:\Users\$env:USERNAME\Desktop
git clone https://github.com/TUO-USERNAME/gym-tracker-app.git
cd gym-tracker-app
```

---

## 📥 STEP 2: Copia i file scaricati

Dalla cartella che hai scaricato, **copia questi file** nel progetto:

```
✅ Copia questi file:
├── setup-firebase.ps1          → nella root
├── .env.example               → nella root
├── FIREBASE_SETUP_WINDOWS.md  → nella root
├── GymTracker-modifications.js → nella root
├── src/firebase/config.js     → crea cartella src/firebase/
└── src/hooks/useFirestore.js  → crea cartella src/hooks/
```

---

## 🚀 STEP 3: Esegui lo script automatico

Nel PowerShell:

```powershell
# Se appare errore di execution policy, esegui prima:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Poi esegui lo script:
.\setup-firebase.ps1
```

Questo installerà Firebase e creerà il file `.env`

---

## 🔐 STEP 4: Configura le credenziali

### A. Ottieni le credenziali da Firebase:
1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
2. Seleziona il tuo progetto
3. ⚙️ Impostazioni progetto → **Le tue app** → Icona `</>`
4. Copia i valori di `firebaseConfig`

### B. Apri e modifica .env:

```powershell
notepad .env
```

Incolla le TUE credenziali:

```env
VITE_FIREBASE_API_KEY=la_tua_api_key
VITE_FIREBASE_AUTH_DOMAIN=tuo-progetto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tuo-project-id
VITE_FIREBASE_STORAGE_BUCKET=tuo-progetto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
```

Salva e chiudi.

---

## ✏️ STEP 5: Modifica GymTracker.jsx

### A. Apri il file con il tuo editor:

```powershell
code src\components\GymTracker.jsx
# Oppure usa notepad, notepad++, ecc.
```

### B. Apri anche GymTracker-modifications.js per copiare il codice:

```powershell
notepad GymTracker-modifications.js
```

### C. Copia le 4 sezioni nel file GymTracker.jsx:

1. **Import** dell'hook (all'inizio)
2. **Hook Firebase** (dentro il componente)
3. **4 useEffect** (dopo gli useState)
4. **Loader** (all'inizio del return)

Ogni sezione è marcata con commenti chiari!

Salva il file.

---

## 🧪 TESTA!

```powershell
npm run dev
```

Vai su `http://localhost:5173`

1. Completa alcuni set
2. Ricarica la pagina (F5)
3. ✅ I set devono essere ancora completati!

---

## 🌐 DEPLOY (Opzionale)

### Push su GitHub:
```powershell
git add .
git commit -m "feat: Firebase integration"
git push
```

### Configura Vercel:
1. [vercel.com](https://vercel.com) → Il tuo progetto
2. Settings → Environment Variables
3. Aggiungi TUTTE le variabili del file `.env`
4. Redeploy

---

## 📖 Guida Completa

Per istruzioni dettagliate, leggi:
👉 **FIREBASE_SETUP_WINDOWS.md**

---

## 🆘 Problemi?

### Script non si esegue:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Dati non si salvano:
- Verifica file `.env` nella root
- Riavvia: `npm run dev`
- Controlla console browser (F12)

---

## ⏱️ Tempo Totale: 10 minuti

✅ Step 1: 1 minuto  
✅ Step 2: 2 minuti  
✅ Step 3: 2 minuti  
✅ Step 4: 2 minuti  
✅ Step 5: 3 minuti  

---

💪 **Sei pronto! Inizia dallo Step 1!**
