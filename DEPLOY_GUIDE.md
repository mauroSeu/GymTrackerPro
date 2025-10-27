# 🚀 Guida Rapida: Git e Deploy

## 📤 Caricare su GitHub

### 1. Inizializza il repository Git
```bash
cd gym-tracker-app
git init
```

### 2. Aggiungi tutti i file
```bash
git add .
```

### 3. Fai il primo commit
```bash
git commit -m "Initial commit: Gym Tracker PPL App"
```

### 4. Crea un repository su GitHub
1. Vai su [github.com](https://github.com)
2. Clicca su "New repository"
3. Dai un nome (es. `gym-tracker-app`)
4. **NON** inizializzare con README (l'abbiamo già)
5. Clicca "Create repository"

### 5. Collega il repository remoto
```bash
git remote add origin https://github.com/TUO-USERNAME/gym-tracker-app.git
git branch -M main
git push -u origin main
```

✅ **Fatto!** Il codice è ora su GitHub.

---

## 🌐 Deploy su Vercel (FACILE E VELOCE!)

### Metodo 1: Tramite interfaccia web (CONSIGLIATO)

1. **Vai su [vercel.com](https://vercel.com)**
2. **Clicca "Sign Up"** e registrati con GitHub
3. **Clicca "New Project"**
4. **Importa il tuo repository** `gym-tracker-app`
5. **Vercel rileva automaticamente** che è un progetto Vite
6. **Clicca "Deploy"**
7. **Aspetta 30-60 secondi** ⏳
8. **🎉 IL TUO LINK È PRONTO!** (es. `gym-tracker-app.vercel.app`)

### Metodo 2: Tramite CLI

```bash
# Installa Vercel CLI
npm install -g vercel

# Login (si apre il browser)
vercel login

# Deploy
cd gym-tracker-app
vercel

# Segui le istruzioni (premi Enter per i default)

# Deploy in produzione
vercel --prod
```

✅ **Link generato automaticamente!**

---

## 🎯 Deploy su Netlify (ALTERNATIVA)

### Metodo 1: Drag & Drop

```bash
# Prima fai la build
npm run build
```

1. Vai su [netlify.com](https://netlify.com)
2. Trascina la cartella `dist/` nel box "Drop your site here"
3. **🎉 ONLINE in 10 secondi!**

### Metodo 2: Tramite GitHub

1. Vai su [netlify.com](https://netlify.com)
2. Clicca "New site from Git"
3. Connetti GitHub
4. Seleziona il repository `gym-tracker-app`
5. **Build command:** `npm run build`
6. **Publish directory:** `dist`
7. Clicca "Deploy"

✅ **Link generato: `nomeapp.netlify.app`**

---

## 🔄 Aggiornare il Sito

Dopo modifiche al codice:

```bash
# Commit le modifiche
git add .
git commit -m "Descrizione modifiche"
git push

# Vercel/Netlify rileveranno automaticamente il push
# e rifaranno il deploy in automatico! 🎉
```

---

## 💡 Link Personalizzato (Opzionale)

### Su Vercel:
1. Vai su Settings → Domains
2. Aggiungi dominio personalizzato (es. `iltuodominio.com`)

### Su Netlify:
1. Vai su Domain Settings
2. Aggiungi dominio personalizzato

---

## ⚡ Riepilogo Veloce

```bash
# 1. Carica su Git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/gym-tracker-app.git
git push -u origin main

# 2. Deploy su Vercel
vercel
vercel --prod

# 3. Oppure Netlify
npm run build
# Poi trascina dist/ su netlify.com
```

---

## 🎊 Congratulazioni!

Ora hai l'app online e accessibile da qualsiasi dispositivo! 

**Condividi il link con amici che si allenano! 💪**
