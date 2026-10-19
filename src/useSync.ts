import { useState, useEffect } from 'react';
import { syncManager, SyncStatus } from './sync';

/**
 * Hook React para usar sincronização
 */
export function useSync() {
  const [status, setStatus] = useState<SyncStatus>(syncManager.getStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(syncManager.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...status,
    forceSync: () => syncManager.forceSync(),
    clearQueue: () => syncManager.clearQueue(),
    getData: <T,>(entity: string, id: string) => syncManager.getData<T>(entity, id),
    saveData: <T,>(entity: string, id: string, data: T) => syncManager.saveData<T>(entity, id, data),
    hasPendingFallbackData: () => syncManager.hasPendingFallbackData(),
    recoverFromFallback: () => syncManager.recoverFromFallback()
  };
}
