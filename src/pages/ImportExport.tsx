import { useState, useRef } from 'react';
import { Download, Upload, FileDown, FileUp, Shield, AlertTriangle, Check, Database, Trash2 } from 'lucide-react';
import { createBackup, restoreBackup, exportToCSV, getMemberTemplate, getTransactionTemplate, getCommitmentTemplate, parseCSV, getMembers, getTransactions, getCommitments, saveMember, saveTransaction, getConfig } from '../store';
import { BackupData, Member, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export default function ImportExport() {
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [importType, setImportType] = useState<'members' | 'transactions' | 'commitments'>('members');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const backup = createBackup();
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_tesouraria_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setImportStatus({ type: 'success', message: 'Backup realizado com sucesso! Chave de integridade incluída.' });
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: BackupData = JSON.parse(e.target?.result as string);
        if (!data.version || !data.integrityKey) {
          setImportStatus({ type: 'error', message: 'Arquivo de backup inválido. Formato não reconhecido.' });
          return;
        }
        if (!confirm('⚠️ ATENÇÃO: Esta operação substituirá TODOS os dados atuais. Deseja continuar?')) {
          return;
        }
        const success = restoreBackup(data);
        if (success) {
          setImportStatus({ type: 'success', message: 'Backup restaurado com sucesso! Chave de integridade verificada ✓' });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setImportStatus({ type: 'error', message: 'Falha na restauração. Chave de integridade inválida - dados possivelmente corrompidos.' });
        }
      } catch {
        setImportStatus({ type: 'error', message: 'Erro ao ler o arquivo. Verifique se é um backup válido.' });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        
        if (rows.length === 0) {
          setImportStatus({ type: 'error', message: 'Arquivo CSV vazio ou formato inválido.' });
          return;
        }

        let imported = 0;
        const config = getConfig();

        if (importType === 'members') {
          rows.forEach(row => {
            const member: Member = {
              id: uuidv4(),
              nome: row.nome || '',
              cpf: row.cpf || '',
              email: row.email || '',
              telefone: row.telefone || '',
              endereco: row.endereco || '',
              dataNascimento: row.dataNascimento || '',
              dataAdmissao: row.dataAdmissao || '',
              status: (row.status as any) || 'ATIVO',
              ministerios: row.ministerios ? row.ministerios.split(',').map(m => m.trim()) : [],
              observacoes: row.observacoes || '',
            };
            if (member.nome) {
              saveMember(member);
              imported++;
            }
          });
        } else if (importType === 'transactions') {
          rows.forEach(row => {
            const dateParts = (row.data || '').split('/');
            let dateStr = '';
            if (dateParts.length === 3) {
              dateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            } else {
              dateStr = row.data || format(new Date(), 'yyyy-MM-dd');
            }

            const transaction: Transaction = {
              id: uuidv4(),
              data: dateStr,
              tipo: (row.tipo as any) || 'ENTRADA',
              categoria: (row.categoria as any) || 'OUTRAS_RECEITAS',
              valor: parseFloat(row.valor) || 0,
              descricao: row.descricao || '',
              memberId: row.memberId || undefined,
              estornada: false,
              createdAt: new Date().toISOString(),
            };
            if (transaction.descricao && transaction.valor > 0) {
              saveTransaction(transaction);
              imported++;
            }
          });
        }

        setImportStatus({ type: 'success', message: `${imported} registros importados com sucesso!` });
      } catch {
        setImportStatus({ type: 'error', message: 'Erro ao processar o arquivo CSV.' });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const downloadTemplate = (type: 'members' | 'transactions' | 'commitments') => {
    let content = '';
    let filename = '';
    switch (type) {
      case 'members':
        content = getMemberTemplate();
        filename = 'modelo_membros';
        break;
      case 'transactions':
        content = getTransactionTemplate();
        filename = 'modelo_lancamentos';
        break;
      case 'commitments':
        content = getCommitmentTemplate();
        filename = 'modelo_compromissos';
        break;
    }
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleClearData = () => {
    if (confirm('⚠️ ATENÇÃO: Esta ação irá APAGAR TODOS os dados permanentemente. Faça um backup antes!\n\nDeseja realmente limpar todos os dados?')) {
      if (confirm('Confirmação final: Todos os dados serão perdidos. Continuar?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const stats = {
    members: getMembers().length,
    transactions: getTransactions().length,
    commitments: getCommitments().length,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Status message */}
      {importStatus && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          importStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {importStatus.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          <span className="text-sm font-medium">{importStatus.message}</span>
          <button onClick={() => setImportStatus(null)} className="ml-auto text-sm hover:opacity-70">×</button>
        </div>
      )}

      {/* Data overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Database size={18} /> Dados Armazenados
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-indigo-700">{stats.members}</p>
            <p className="text-xs text-indigo-600">Membros</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{stats.transactions}</p>
            <p className="text-xs text-emerald-600">Lançamentos</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{stats.commitments}</p>
            <p className="text-xs text-amber-600">Compromissos</p>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Shield size={18} /> Backup e Restauração
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          O backup inclui todos os dados com uma chave de integridade interna para verificação.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleBackup}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Download size={16} /> Gerar Backup
          </button>
          <button onClick={() => backupInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors">
            <Upload size={16} /> Restaurar Backup
          </button>
          <input ref={backupInputRef} type="file" accept=".json" onChange={handleRestore} className="hidden" />
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs text-amber-700 flex items-center gap-1">
            <AlertTriangle size={12} /> 
            A restauração substitui TODOS os dados atuais. A chave de integridade será verificada automaticamente.
          </p>
        </div>
      </div>

      {/* CSV Import */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <FileUp size={18} /> Importação via CSV
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Importe dados em massa a partir de planilhas CSV. Baixe o modelo primeiro para garantir o formato correto.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo de Importação</label>
            <div className="flex gap-2">
              {(['members', 'transactions', 'commitments'] as const).map(type => (
                <button key={type} onClick={() => setImportType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    importType === type ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}>
                  {type === 'members' ? 'Membros' : type === 'transactions' ? 'Lançamentos' : 'Compromissos'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => downloadTemplate(importType)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
              <FileDown size={16} /> Baixar Modelo CSV
            </button>
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              <Upload size={16} /> Importar CSV
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-medium text-slate-600 mb-2">Formato esperado (separador: ponto e vírgula ";"):</p>
            <code className="text-xs text-slate-500 font-mono block overflow-x-auto">
              {importType === 'members' && 'nome;cpf;email;telefone;endereco;dataNascimento;dataAdmissao;status;ministerios;observacoes'}
              {importType === 'transactions' && 'data;tipo;categoria;valor;descricao;memberId'}
              {importType === 'commitments' && 'descricao;valorTotal;valorParcela;dataVencimento;frequencia;status;categoria;observacoes'}
            </code>
          </div>
        </div>
      </div>

      {/* Export all data */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <FileDown size={18} /> Exportar Dados
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Exporte dados individuais em formato CSV para uso em outras aplicações.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => {
            const members = getMembers();
            exportToCSV(members.map(m => ({
              nome: m.nome, cpf: m.cpf, email: m.email, telefone: m.telefone,
              endereco: m.endereco, status: m.status, ministerios: m.ministerios.join(', '),
            })), 'membros');
          }} className="px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">
            Exportar Membros
          </button>
          <button onClick={() => {
            const transactions = getTransactions();
            exportToCSV(transactions.map(t => ({
              data: t.data, tipo: t.tipo, categoria: t.categoria,
              valor: t.valor.toFixed(2), descricao: t.descricao, estornada: t.estornada ? 'Sim' : 'Não',
            })), 'lancamentos');
          }} className="px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">
            Exportar Lançamentos
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
          <AlertTriangle size={18} /> Zona de Perigo
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Esta ação é irreversível. Faça um backup antes de prosseguir.
        </p>
        <button onClick={handleClearData}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
          <Trash2 size={16} /> Limpar Todos os Dados
        </button>
      </div>
    </div>
  );
}
