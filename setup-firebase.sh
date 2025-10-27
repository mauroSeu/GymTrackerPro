#!/bin/bash

echo "🔥 Setup Firebase per Gym Tracker"
echo "=================================="
echo ""

# Step 1: Installa Firebase
echo "📦 Step 1/3: Installazione Firebase SDK..."
npm install firebase

echo ""
echo "✅ Firebase installato!"
echo ""

# Step 2: Crea file .env se non esiste
if [ ! -f .env ]; then
    echo "📝 Step 2/3: Creazione file .env..."
    cp .env.example .env
    echo "✅ File .env creato! RICORDA di inserire le tue credenziali Firebase!"
else
    echo "⚠️  Step 2/3: File .env già esistente"
fi

echo ""

# Step 3: Verifica .gitignore
echo "🔒 Step 3/3: Verifica .gitignore..."
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    echo "✅ .env aggiunto al .gitignore"
else
    echo "✅ .env già nel .gitignore"
fi

echo ""
echo "=================================="
echo "🎉 Setup completato!"
echo ""
echo "📋 Prossimi passi:"
echo "1. Apri il file .env"
echo "2. Inserisci le tue credenziali Firebase"
echo "3. Modifica src/components/GymTracker.jsx come indicato in FIREBASE_SETUP.md"
echo "4. Esegui: npm run dev"
echo ""
echo "📖 Guida completa: FIREBASE_SETUP.md"
