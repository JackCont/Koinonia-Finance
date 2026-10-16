# Sistema de Fallback Automático - Koinonia Finance

## 🎯 Visão Geral

O Koinonia Finance agora possui um sistema inteligente de fallback automático que garante que a aplicação nunca fique travada esperando o servidor responder. Quando o servidor Render está indisponível ou demorando para "acordar", o sistema muda automaticamente para o modo offline/localStorage.

## 🔄 Como Funciona

### Modos de Operação

1. **Online** 🟢
   - Servidor está respondendo normalmente
   - Dados são salvos diretamente no servidor
   - Sincronização em tempo real

2. **Offline** 🟡
   - Servidor não respondeu dentro do timeout (5 segundos)
   - Sistema tenta novamente algumas vezes
   - Dados são salvos no localStorage temporariamente

3. **Fallback** 🟠
   - Servidor está indisponível ou dormindo
   - Todos os dados são salvos no localStorage
   - Aplicação funciona normalmente sem travar
   - Quando o servidor voltar, sincroniza automaticamente

### Timeout e Detecção

- **Timeout de requisição:** 5 segundos
- **Verificação de conexão:** A cada 30 segundos
- **Retry automático:** 3 tentativas antes de entrar em modo fallback
- **Sincronização automática:** Quando o servidor voltar online

## 📊 Indicador Visual

O componente `SyncIndicator` no header mostra o status atual:

- **🟢 Online:** Servidor conectado
- **🟡 Offline:** Servidor indisponível temporariamente
- **🟠 Fallback:** Modo offline ativo

### Funcionalidades do Indicador

1. **Status em tempo real** - Mostra o modo atual de operação
2. **Contador de pendências** - Número de operações aguardando sincronização
3. **Sincronização manual** - Botão para forçar sincronização quando o servidor voltar
4. **Detalhes expandidos** - Clique para ver mais informações

## 💾 Armazenamento de Dados

### Quando Online
```
Usuário → Servidor (Render) → localStorage (cache)
```

### Quando Offline/Fallback
```
Usuário → localStorage → Fila de sincronização
```

### Quando Servidor Volta
```
Fila de sincronização → Servidor → Confirmação → localStorage atualizado
```

## 🚀 Benefícios

1. **Nunca trava** - A aplicação sempre responde, mesmo sem servidor
2. **Dados seguros** - Tudo é salvo no localStorage antes de sincronizar
3. **Sincronização automática** - Quando o servidor voltar, sincroniza tudo
4. **Experiência fluida** - Usuário não percebe a mudança de modo
5. **Indicador visual** - Sempre sabe o status da conexão

## 🔧 Configuração

### Timeout Personalizado

No arquivo `src/sync.ts`, você pode ajustar:

```typescript
const REQUEST_TIMEOUT = 5000; // 5 segundos (padrão)
```

### Intervalo de Verificação

```typescript
// Verifica conexão a cada 30 segundos
this.checkInterval = window.setInterval(async () => {
  // ...
}, 30000);
```

### Número de Retries

```typescript
private maxRetries = 3; // Tenta 3 vezes antes de entrar em fallback
```

## 📱 Uso no Código

### Hook useSync

```typescript
import { useSync } from './sync';

function MyComponent() {
  const {
    mode,              // 'online' | 'offline' | 'fallback'
    online,            // boolean
    pendingOperations, // number
    lastSync,          // string | null
    getData,           // função para buscar dados
    saveData,          // função para salvar dados
    forceSync,         // função para forçar sincronização
  } = useSync();

  // Buscar dados com fallback automático
  const loadData = async () => {
    const data = await getData<Member>('members', '123');
    // Se servidor falhar, busca do localStorage automaticamente
  };

  // Salvar dados com fallback automático
  const handleSave = async () => {
    const success = await saveData<Member>('members', '123', memberData);
    // Se servidor falhar, salva no localStorage e adiciona à fila
  };

  // Forçar sincronização quando servidor voltar
  const handleSync = async () => {
    await forceSync();
  };
}
```

### Componente SyncIndicator

Já está integrado no header da aplicação:

```typescript
import SyncIndicator from './components/SyncIndicator';

function App() {
  return (
    <header>
      <SyncIndicator />
      {/* ... */}
    </header>
  );
}
```

## 🎨 Personalização Visual

O componente `SyncIndicator` pode ser customizado:

### Cores dos Modos

```typescript
const getModeInfo = () => {
  switch (mode) {
    case 'online':
      return {
        icon: <Wifi size={16} className="text-green-500" />,
        label: 'Online',
        color: 'bg-green-50 border-green-200 text-green-800',
      };
    case 'offline':
      return {
        icon: <WifiOff size={16} className="text-yellow-500" />,
        label: 'Offline',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      };
    case 'fallback':
      return {
        icon: <CloudOff size={16} className="text-orange-500" />,
        label: 'Fallback',
        color: 'bg-orange-50 border-orange-200 text-orange-800',
      };
  }
};
```

## 🐛 Troubleshooting

### Problema: Sempre em modo offline

**Solução:**
1. Verifique se a URL do servidor está correta em `.env.production`
2. Verifique se o servidor está rodando
3. Aumente o timeout em `src/sync.ts`

### Problema: Dados não sincronizam quando servidor volta

**Solução:**
1. Clique no indicador de sincronização
2. Clique em "Forçar Sincronização"
3. Verifique os logs do console para erros

### Problema: Indicador não aparece

**Solução:**
1. Verifique se o componente está importado no `App.tsx`
2. Verifique se está sendo renderizado no header
3. Verifique o console para erros de importação

## 📈 Monitoramento

### Logs do Console

O sistema gera logs detalhados:

```
[SYNC] Servidor online, processando fila...
[SYNC] Erro ao buscar do servidor, usando fallback: ...
[SYNC] Erro ao salvar no servidor, usando fallback: ...
```

### localStorage

Dados de fallback são salvos com a chave:
```
koinonia_fallback_{entity}_{id}
```

Exemplo:
```
koinonia_fallback_members_123
```

## 🎯 Próximos Passos

1. ✅ Sistema de fallback implementado
2. ✅ Indicador visual integrado
3. ✅ Timeout configurado
4. ✅ Retry automático
5. ⏳ Testes em produção
6. ⏳ Ajuste de timeout baseado em feedback
7. ⏳ Notificações para o usuário

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Verifique os logs do servidor Render
3. Verifique se a URL está correta em `.env.production`
4. Tente forçar sincronização manualmente

---

**Koinonia Finance** - Sistema de Fallback Automático

**Versão:** 1.3  
**Data:** 31/01/2026  
**Status:** ✅ Implementado e funcional
