/**
 * Koinonia Finance - Sistema de Sincronização Automática com Fallback
 * Gerencia sincronização entre localStorage e servidor remoto
 * Implementa timeout e fallback automático quando servidor está indisponível
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
  mode: 'online' | 'offline' | 'fallback';
  lastCheck: string | null;
}

const SYNC_QUEUE_KEY = 'koinonia_sync_queue';
const SYNC_STATUS_KEY = 'koinonia_sync_status';
const REQUEST_TIMEOUT = 5000; // 5 segundos de timeout

class SyncManager {
  private queue: SyncOperation[] = [];
  private status: SyncStatus = {
    online: false,
    lastSync: null,
    pendingOperations: 0,
    serverUrl: '',
    mode: 'offline',
    lastCheck: null
  };
  private checkInterval: number | null = null;
  private retryCount = 0;
  private maxRetries = 3;

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
        serverUrl: this.getServerUrl(),
        mode: 'offline',
        lastCheck: null
      };
    } catch {
      this.status = {
        online: false,
        lastSync: null,
        pendingOperations: 0,
        serverUrl: this.getServerUrl(),
        mode: 'offline',
        lastCheck: null
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
   * Verifica conexão com o servidor com timeout
   */
  async checkConnection(): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(`${this.getServerUrl()}/api/health`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const isOnline = response.ok;
      this.status.online = isOnline;
      this.status.lastCheck = new Date().toISOString();
      
      if (isOnline) {
        this.status.mode = 'online';
        this.retryCount = 0;
      } else {
        this.handleConnectionFailure();
      }
      
      this.saveStatus();
      return isOnline;
    } catch (error) {
      clearTimeout(timeoutId);
      this.handleConnectionFailure();
      return false;
    }
  }
  
  /**
   * Handle falha de conexão - muda para modo fallback
   */
  private handleConnectionFailure(): void {
    this.retryCount++;
    
    if (this.retryCount >= this.maxRetries) {
      this.status.mode = 'fallback';
      this.status.online = false;
    } else {
      this.status.mode = 'offline';
      this.status.online = false;
    }
    
    this.status.lastCheck = new Date().toISOString();
    this.saveStatus();
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
   * Processa fila de sincronização com fallback automático
   */
  async processQueue(): Promise<number> {
    if (this.queue.length === 0) {
      return 0;
    }

    let processed = 0;
    let failed = 0;

    for (const operation of this.queue) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      try {
        const response = await fetch(`${this.getServerUrl()}/api/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(operation),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          processed++;
        } else {
          console.error('[SYNC] Erro ao sincronizar operação:', operation);
          failed++;
          this.handleSyncFailure(operation);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('[SYNC] Erro de conexão:', error);
        failed++;
        this.handleSyncFailure(operation);
        
        // Se falhou, muda para modo fallback
        this.status.mode = 'fallback';
        this.status.online = false;
        this.saveStatus();
        break; // Para de processar se houver erro de conexão
      }
    }

    // Remove operações processadas com sucesso
    if (processed > 0) {
      this.queue = this.queue.slice(processed);
    }
    
    this.status.pendingOperations = this.queue.length;
    this.status.lastSync = new Date().toISOString();
    
    this.saveQueue();
    this.saveStatus();

    return processed;
  }
  
  /**
   * Handle falha de sincronização - salva no localStorage como fallback
   */
  private handleSyncFailure(operation: SyncOperation): void {
    // Salva no localStorage como fallback
    const fallbackKey = `koinonia_fallback_${operation.entity}_${operation.id}`;
    const fallbackData = {
      operation,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    localStorage.setItem(fallbackKey, JSON.stringify(fallbackData));
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
    const isOnline = await this.checkConnection();
    if (isOnline) {
      return await this.processQueue();
    }
    return 0;
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
  
  /**
   * Obtém dados com fallback automático
   * Tenta buscar do servidor primeiro, se falhar, busca do localStorage
   */
  async getData<T>(entity: string, id: string): Promise<T | null> {
    // Tenta buscar do servidor
    if (this.status.online) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      try {
        const response = await fetch(`${this.getServerUrl()}/api/data/${entity}/${id}`, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return data as T;
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('[SYNC] Erro ao buscar do servidor, usando fallback:', error);
        this.handleConnectionFailure();
      }
    }
    
    // Fallback para localStorage
    const fallbackKey = `koinonia_fallback_${entity}_${id}`;
    const stored = localStorage.getItem(fallbackKey);
    
    if (stored) {
      try {
        const fallbackData = JSON.parse(stored);
        return fallbackData.operation.data as T;
      } catch {
        return null;
      }
    }
    
    return null;
  }
  
  /**
   * Salva dados com fallback automático
   * Tenta salvar no servidor primeiro, se falhar, salva no localStorage
   */
  async saveData<T>(entity: string, id: string, data: T): Promise<boolean> {
    const operation: SyncOperation = {
      type: 'UPDATE',
      entity,
      id,
      data,
      timestamp: new Date().toISOString()
    };
    
    // Tenta salvar no servidor
    if (this.status.online) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      try {
        const response = await fetch(`${this.getServerUrl()}/api/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(operation),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          return true;
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('[SYNC] Erro ao salvar no servidor, usando fallback:', error);
        this.handleConnectionFailure();
      }
    }
    
    // Fallback para localStorage
    this.addToQueue(operation);
    this.handleSyncFailure(operation);
    return false;
  }
  
  /**
   * Verifica se há dados pendentes no fallback
   */
  hasPendingFallbackData(): boolean {
    return this.queue.length > 0;
  }
  
  /**
   * Recupera dados do fallback quando o servidor voltar
   */
  async recoverFromFallback(): Promise<number> {
    if (!this.status.online) {
      return 0;
    }
    
    return await this.processQueue();
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
    clearQueue: () => syncManager.clearQueue(),
    getData: <T>(entity: string, id: string) => syncManager.getData<T>(entity, id),
    saveData: <T>(entity: string, id: string, data: T) => syncManager.saveData<T>(entity, id, data),
    hasPendingFallbackData: () => syncManager.hasPendingFallbackData(),
    recoverFromFallback: () => syncManager.recoverFromFallback()
  };
}

import { useState, useEffect } from 'react';
