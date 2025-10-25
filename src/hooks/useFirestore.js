// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config'; 
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'; 

// --- UTILITY PER LA RESILIENZA OFFLINE (WRITE-BEHIND) ---
const OFFLINE_QUEUE_KEY = 'offlineSyncQueue';
const LOAD_TIMEOUT_MS = 3000; // Timeout di 3 secondi per il caricamento

const loadOfflineQueue = () => {
  try {
    const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (e) {
    console.error("Errore nel caricamento della coda offline:", e);
    return [];
  }
};

const saveToOfflineQueue = (field, data) => {
  const queue = loadOfflineQueue();
  queue.push({ type: field, data, timestamp: Date.now() });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};


// --- HOOK PRINCIPALE ---
export const useFirestore = () => {
  const [userId, setUserId] = useState('mauro_seu_1988'); 
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // A. Caricamento Dati (UNSUBSCRIBE + TIMEOUT CRITICA)
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return; 
    }
    
    // Riferimento al documento creato qui SOLO per onSnapshot
    const docRef = doc(db, 'users', userId);
    
    // 1. Imposta il timeout di fallback
    let timeoutId = setTimeout(() => {
        if (isLoading) {
            console.warn("Timeout di caricamento. Forza l'interfaccia ad aprirsi con i dati locali.");
            setIsLoading(false); 
        }
    }, LOAD_TIMEOUT_MS);
    
    // 2. Listener onSnapshot
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      clearTimeout(timeoutId); // Il listener ha risposto: annulla il timeout
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData({}); 
      }
      setIsLoading(false);
    }, (error) => {
      // 3. In caso di errore (es. Quota Exceeded)
      clearTimeout(timeoutId); 
      console.error("Errore onSnapshot (Lettura dati): Forza l'apertura interfaccia.", error);
      setIsLoading(false);
    });

    // 🛑 FUNZIONE DI CLEANUP (UNSUBSCRIBE):
    return () => {
      clearTimeout(timeoutId); // Pulizia del timeout
      unsubscribe(); 
    };
    
  }, [userId]);


  // B. Funzione di Processo Coda (Chiamata da GymTracker.jsx)
  const processOfflineQueue = async () => {
    const queue = loadOfflineQueue();
    if (queue.length === 0 || !userId) return;

    const successfulIndexes = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      
      // ⚠️ CORREZIONE SCOPE: docRef è creato qui!
      const docRef = doc(db, 'users', userId);
      
      try {
        await setDoc(docRef, { 
            [item.type]: item.data,
            lastSynced: serverTimestamp() 
        }, { merge: true }); 
        successfulIndexes.push(i);
      } catch (e) {
        console.error(`Fallimento continuo nel sincronizzare ${item.type}. L'elemento rimane in coda.`, e);
      }
    }

    if (successfulIndexes.length > 0) {
        const newQueue = queue.filter((_, index) => !successfulIndexes.includes(index));
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(newQueue));
        console.log(`Sincronizzazione completata: ${successfulIndexes.length} elementi inviati.`);
    }
  };


  // C. Funzioni di Salvataggio (WRITE-BEHIND IMPLEMENTAZIONE)
  const saveToDb = async (field, data) => {
    if (!userId) {
        saveToOfflineQueue(field, data);
        return;
    }
    
    // ⚠️ CORREZIONE SCOPE: docRef è creato qui!
    const docRef = doc(db, 'users', userId);
    
    try {
      // setDoc con merge: crea se non esiste, aggiorna se esiste.
      await setDoc(docRef, {
        [field]: data,
        lastUpdated: serverTimestamp()
      }, { merge: true }); 
    } catch (error) {
      // 🛡️ Salvataggio in coda offline in caso di fallimento
      console.error(`Scrittura ${field} fallita. Salvataggio in coda offline.`, error);
      saveToOfflineQueue(field, data);
    }
  };

  // Funzioni pubbliche da esportare
  const saveProgress = (data) => saveToDb('completedSets', data);
  const saveCustomWeights = (data) => saveToDb('customWeights', data);
  const saveSkippedDays = (data) => saveToDb('skippedDays', data);
  const saveProgressData = (data) => saveToDb('progressData', data); 

  return { 
    isLoading, 
    userData, 
    saveProgress, 
    saveCustomWeights, 
    saveSkippedDays, 
    saveProgressData,
    processOfflineQueue 
  };
};