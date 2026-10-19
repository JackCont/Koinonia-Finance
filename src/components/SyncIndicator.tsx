import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useSync } from '../useSync';

/**
 * Componente de Indicador de Sincronização
 * Mostra o status atual da conexão e permite ações manuais
 */
export default function SyncIndicator() {
  const { 
    mode, 
    online, 
    pendingOperations, 
    lastSync, 
    forceSync, 
    recoverFromFallback 
  } = useSync();
  
  const [syncing, setSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      await forceSync();
      await recoverFromFallback();
    } finally {
      setSyncing(false);
    }
  };

  const getModeInfo = () => {
    switch (mode) {
      case 'online':
        return {
          icon: <Wifi size={16} className="text-green-500" />,
          label: 'Online',
          color: 'bg-green-50 border-green-200 text-green-800',
          description: 'Conectado ao servidor'
        };
      case 'offline':
        return {
          icon: <WifiOff size={16} className="text-yellow-500" />,
          label: 'Offline',
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          description: 'Servidor indisponível, usando localStorage'
        };
      case 'fallback':
        return {
          icon: <CloudOff size={16} className="text-orange-500" />,
          label: 'Fallback',
          color: 'bg-orange-50 border-orange-200 text-orange-800',
          description: 'Modo offline ativo, dados salvos localmente'
        };
      default:
        return {
          icon: <WifiOff size={16} className="text-gray-500" />,
          label: 'Desconhecido',
          color: 'bg-gray-50 border-gray-200 text-gray-800',
          description: 'Status desconhecido'
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="relative">
      {/* Indicador Principal */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${modeInfo.color} transition-all hover:shadow-md`}
        title={modeInfo.description}
      >
        {modeInfo.icon}
        <span className="text-sm font-medium">{modeInfo.label}</span>
        
        {pendingOperations > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
            <AlertCircle size={12} />
            {pendingOperations}
          </span>
        )}
      </button>

      {/* Painel de Detalhes */}
      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <div className="space-y-3">
            {/* Status Atual */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex items-center gap-2">
                {modeInfo.icon}
                <span className="text-sm text-gray-600">{modeInfo.label}</span>
              </div>
            </div>

            {/* Última Sincronização */}
            {lastSync && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Última sync:</span>
                <span className="text-xs text-gray-500">
                  {new Date(lastSync).toLocaleString('pt-BR')}
                </span>
              </div>
            )}

            {/* Operações Pendentes */}
            {pendingOperations > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Pendentes:</span>
                <span className="text-sm text-red-600 font-medium">
                  {pendingOperations} operação(ões)
                </span>
              </div>
            )}

            {/* Modo Fallback */}
            {mode === 'fallback' && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800">
                  <AlertCircle size={12} className="inline mr-1" />
                  Modo fallback ativo. Os dados estão sendo salvos localmente e serão sincronizados quando o servidor voltar.
                </p>
              </div>
            )}

            {/* Botão de Sincronização Manual */}
            <button
              onClick={handleForceSync}
              disabled={syncing || mode === 'offline'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">
                {syncing ? 'Sincronizando...' : 'Forçar Sincronização'}
              </span>
            </button>

            {/* Descrição do Modo */}
            <p className="text-xs text-gray-500 text-center">
              {modeInfo.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
