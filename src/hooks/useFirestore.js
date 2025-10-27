// src/hooks/useFirestore.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config'; 
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'; 

// --- UTILITY FOR OFFLINE RESILIENCE (WRITE-BEHIND) ---
const OFFLINE_QUEUE_KEY = 'offlineSyncQueue';
const LOAD_TIMEOUT_MS = 3000; // 3 second timeout for loading

const loadOfflineQueue = () => {
  try {
    const queue = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (e) {
    console.error("Error loading offline queue:", e);
    return [];
  }
};

const saveToOfflineQueue = (field, data) => {
  const queue = loadOfflineQueue();
  queue.push({ type: field, data, timestamp: Date.now() });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};


// --- MAIN HOOK ---
export const useFirestore = () => {
  const [userId, setUserId] = useState('mauro_seu_1988'); 
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // STATO PER TRACCIARE L'ULTIMO DATO SALVATO (EVITA LOOP)
  const [lastSyncedData, setLastSyncedData] = useState(null);

  // A. Data Loading (CRITICAL UNSUBSCRIBE + TIMEOUT)
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return; 
    }
    
    const docRef = doc(db, 'users', userId);
    
    // 1. Set the fallback timeout
    let timeoutId = setTimeout(() => {
        if (isLoading) {
            console.warn("Loading Timeout. Forcing interface open with local data.");
            setIsLoading(false); 
        }
    }, LOAD_TIMEOUT_MS);
    
    // 2. onSnapshot Listener (Reads)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      clearTimeout(timeoutId); // Cancel timeout if response is received
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setLastSyncedData(data); // 🆕 Aggiorna l'ultimo stato sincronizzato
      } else {
        setUserData({
            completedSets: {},
            customWeights: {},
            skippedDays: {},
            progressData: { 
                start: { weight: '67.3', chest: '', arm_r: '', arm_l: '', leg_r: '', leg_l: '', waist: '', date: '' },
                end: { weight: '', chest: '', arm_r: '', arm_l: '', leg_r: '', leg_l: '', waist: '', date: '' }
            }
        }); 
      }
      setIsLoading(false);
    }, (error) => {
      // 3. In case of error (e.g., Quota Exceeded)
      clearTimeout(timeoutId); 
      console.error("onSnapshot Error (Failed Read): Forcing interface open.", error);
      setIsLoading(false);
    });

    // 🛑 CLEANUP FUNCTION (UNSUBSCRIBE): Blocks read consumption on refresh
    return () => {
      clearTimeout(timeoutId);
      unsubscribe(); 
    };
    
  }, [userId]);


  // B. Process Queue Function (Auto-Retry)
  const processOfflineQueue = async () => {
    const queue = loadOfflineQueue();
    if (queue.length === 0 || !userId) return;

    const successfulIndexes = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const docRef = doc(db, 'users', userId);
      
      try {
        await setDoc(docRef, { 
            [item.type]: item.data,
            lastSynced: serverTimestamp() 
        }, { merge: true }); 
        successfulIndexes.push(i);
      } catch (e) {
        console.error(`Persistent failure in synchronizing ${item.type}. Item remains in queue.`, e);
      }
    }

    if (successfulIndexes.length > 0) {
        const newQueue = queue.filter((_, index) => !successfulIndexes.includes(index));
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(newQueue));
        console.log(`Synchronization complete: ${successfulIndexes.length} items sent.`);
    }
  };


  // C. Save Functions (WRITE-BEHIND IMPLEMENTATION)
  const saveToDb = async (field, data) => {
    if (!userId) {
        saveToOfflineQueue(field, data);
        return;
    }
    
    const docRef = doc(db, 'users', userId);
    
    try {
      // setDoc con merge: crea se non esiste, aggiorna se esiste.
      await setDoc(docRef, {
        [field]: data,
        lastUpdated: serverTimestamp()
      }, { merge: true }); 
      
      // 🆕 Aggiorna lo stato sincronizzato dopo il successo
      setLastSyncedData(prev => ({ ...prev, [field]: data }));

    } catch (error) {
      // 🛡️ Salvataggio in coda offline in caso di fallimento
      console.error(`Write to ${field} failed. Salvataggio in coda offline.`, error);
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
    processOfflineQueue,
    lastSyncedData // 🆕 Esporta il dato per il controllo anti-loop
  };
};
