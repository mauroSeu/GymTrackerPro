# 🔥 Setup Firebase per Gym Tracker - Windows 11
# Script PowerShell

Write-Host "=================================="
Write-Host "🔥 Firebase Setup per Gym Tracker"
Write-Host "=================================="
Write-Host ""

# Step 1: Verifica che siamo nella cartella giusta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERRORE: Non trovo package.json" -ForegroundColor Red
    Write-Host "Assicurati di essere nella cartella gym-tracker-app" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usa: cd percorso\alla\cartella\gym-tracker-app" -ForegroundColor Cyan
    pause
    exit 1
}

Write-Host "✅ Cartella corretta trovata!" -ForegroundColor Green
Write-Host ""

# Step 2: Installa Firebase
Write-Host "📦 Step 1/4: Installazione Firebase SDK..." -ForegroundColor Cyan
npm install firebase

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Firebase installato con successo!" -ForegroundColor Green
} else {
    Write-Host "❌ Errore durante l'installazione di Firebase" -ForegroundColor Red
    pause
    exit 1
}
Write-Host ""

# Step 3: Crea cartelle necessarie
Write-Host "📁 Step 2/4: Creazione cartelle..." -ForegroundColor Cyan

if (-not (Test-Path "src\firebase")) {
    New-Item -Path "src\firebase" -ItemType Directory -Force | Out-Null
    Write-Host "✅ Cartella src\firebase creata" -ForegroundColor Green
} else {
    Write-Host "✅ Cartella src\firebase già esistente" -ForegroundColor Green
}

if (-not (Test-Path "src\hooks")) {
    New-Item -Path "src\hooks" -ItemType Directory -Force | Out-Null
    Write-Host "✅ Cartella src\hooks creata" -ForegroundColor Green
} else {
    Write-Host "✅ Cartella src\hooks già esistente" -ForegroundColor Green
}
Write-Host ""

# Step 4: Crea file .env
Write-Host "📝 Step 3/4: Creazione file .env..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ File .env creato da .env.example" -ForegroundColor Green
    } else {
        # Crea .env da zero
        @"
# 🔥 Firebase Configuration
VITE_FIREBASE_API_KEY=inserisci_qui_la_tua_api_key
VITE_FIREBASE_AUTH_DOMAIN=tuo-progetto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tuo-project-id
VITE_FIREBASE_STORAGE_BUCKET=tuo-progetto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ File .env creato" -ForegroundColor Green
    }
    Write-Host "⚠️  IMPORTANTE: Devi modificare .env con le TUE credenziali Firebase!" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  File .env già esistente" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Verifica .gitignore
Write-Host "🔒 Step 4/4: Verifica .gitignore..." -ForegroundColor Cyan

$gitignoreContent = ""
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
}

if ($gitignoreContent -notmatch "\.env") {
    Add-Content ".gitignore" "`n.env`n.env.local`n.env.production"
    Write-Host "✅ .env aggiunto al .gitignore" -ForegroundColor Green
} else {
    Write-Host "✅ .env già nel .gitignore" -ForegroundColor Green
}

Write-Host ""
Write-Host "=================================="
Write-Host "🎉 Setup completato con successo!"
Write-Host "=================================="
Write-Host ""
Write-Host "📋 Prossimi passi:" -ForegroundColor Cyan
Write-Host "1. Copia i file config.js e useFirestore.js nelle cartelle create"
Write-Host "2. Modifica il file .env con le tue credenziali Firebase"
Write-Host "3. Modifica src\components\GymTracker.jsx (vedi GymTracker-modifications.js)"
Write-Host "4. Esegui: npm run dev"
Write-Host ""
Write-Host "📖 Leggi FIREBASE_SETUP_WINDOWS.md per la guida completa"
Write-Host ""

pause
