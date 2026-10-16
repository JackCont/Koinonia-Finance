/**
 * Koinonia Finance - Sistema de Sincronização Automática
 * Gerencia sincronização entre localStorage e servidor remoto
 */

export interface SyncOperation {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  id: string;
  data?: any;
  timestamp: string;
}

export interface SyncStatus {
  online: boolean;
  lastSync: string | null;
  pendingOperations: number;
  serverUrl: string;
}

const SYNC_QUEUE_KEY = 'koinonia_sync_queue';
const SYNC_STATUS_KEY = 'koinonia_sync_status';

class SyncManager {
  private queue: SyncOperation[] = [];
  private status: SyncStatus = {
    online: false,
    lastSync: null,
    pendingOperations: 0,
    serverUrl: ''
  };
  private checkInterval: number | null = null;

  constructor() {
    this.loadQueue();
    this.loadStatus();
    this.startConnectionCheck();
  }

  /**
   * Carrega fila de sincronização do localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      this.queue = stored ? JSON.parse(stored) : [];
    } catch {
      this.queue = [];
    }
  }

  /**
   * Salva fila de sincronização no localStorage
   */
  private saveQueue(): void {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.queue));
  }

  /**
   * Carrega status de sincronização
   */
  private loadStatus(): void {
    try {
      const stored = localStorage.getItem(SYNC_STATUS_KEY);
      this.status = stored ? JSON.parse(stored) : {
        online: false,
        lastSync: null,
        pendingOperations: 0,
        serverUrl: this.getServerUrl()
      };
    } catch {
      this.status = {
        online: false,
        lastSync: null,
        pendingOperations: 0,
        serverUrl: this.getServerUrl()
      };
    }
  }

  /**
   * Salva status de sincronização
   */
  private saveStatus(): void {
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(this.status));
  }

  /**
   * Obtém URL do servidor (Render ou fallback)
   */
  private getServerUrl(): string {
    // Tenta obter de variável de ambiente (Vite)
    try {
      // @ts-ignore - import.meta.env pode não estar disponível em todos os ambientes
      const envUrl = import.meta?.env?.VITE_API_URL;
      if (envUrl) return envUrl;
    } catch {
      // Ignora erro se import.meta não estiver disponível
    }
    
    // Fallback para localStorage ou padrão
    return localStorage.getItem('koinonia_server_url') || 'http://localhost:8080';
  }

  /**
   * Verifica conexão com o servidor
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getServerUrl()}/api/health`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      this.status.online = response.ok;
      this.saveStatus();
      return response.ok;
    } catch {
      this.status.online = false;
      this.saveStatus();
      return false;
    }
  }

  /**
   * Inicia verificação periódica de conexão
   */
  private startConnectionCheck(): void {
    // Verifica a cada 30 segundos
    this.checkInterval = window.setInterval(async () => {
      const wasOnline = this.status.online;
      const isOnline = await this.checkConnection();
      
      // Se acabou de ficar online, processa fila
      if (!wasOnline && isOnline && this.queue.length > 0) {
        console.log('[SYNC] Servidor online, processando fila...');
        await this.processQueue();
      }
    }, 30000);

    // Verificação inicial
    this.checkConnection();
  }

  /**
   * Para verificação periódica
   */
  stopConnectionCheck(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Adiciona operação à fila de sincronização
   */
  addToQueue(operation: Omit<SyncOperation, 'timestamp'>): void {
    const fullOperation: SyncOperation = {
      ...operation,
      timestamp: new Date().toISOString()
    };
    
    this.queue.push(fullOperation);
    this.status.pendingOperations = this.queue.length;
    this.saveQueue();
    this.saveStatus();

    // Se está online, tenta sincronizar imediatamente
    if (this.status.online) {
      this.processQueue();
    }
  }

  /**
   * Processa fila de sincronização
   */
  async processQueue(): Promise<number> {
    if (this.queue.length === 0 || !this.status.online) {
      return 0;
    }

    let processed = 0;

    for (const operation of this.queue) {
      try {
        const response = await fetch(`${this.getServerUrl()}/api/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(operation)
        });

        if (response.ok) {
          processed++;
        } else {
          console.error('[SYNC] Erro ao sincronizar operação:', operation);
          break; // Para de processar se houver erro
        }
      } catch (error) {
        console.error('[SYNC] Erro de conexão:', error);
        this.status.online = false;
        this.saveStatus();
        break;
      }
    }

    // Remove operações processadas
    this.queue = this.queue.slice(processed);
    this.status.pendingOperations = this.queue.length;
    this.status.lastSync = new Date().toISOString();
    
    this.saveQueue();
    this.saveStatus();

    return processed;
  }

  /**
   * Obtém status atual de sincronização
   */
  getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Força sincronização manual
   */
  async forceSync(): Promise<number> {
    await this.checkConnection();
    return await this.processQueue();
  }

  /**
   * Limpa fila de sincronização
   */
  clearQueue(): void {
    this.queue = [];
    this.status.pendingOperations = 0;
    this.saveQueue();
    this.saveStatus();
  }
}

// Instância singleton
export const syncManager = new SyncManager();

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
    clearQueue: () => syncManager.clearQueue()
  };
}

import { useState, useEffect } from 'react';
