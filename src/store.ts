import { Member, Transaction, Commitment, AuditLog, AppConfig, BackupData, CategoryConfig } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  MEMBERS: 'iead_members',
  TRANSACTIONS: 'iead_transactions',
  COMMITMENTS: 'iead_commitments',
  AUDIT_LOG: 'iead_audit_log',
  CONFIG: 'iead_config',
};

function generateIntegrityKey(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Default categories
const defaultCategories: CategoryConfig[] = [
  { id: '1', nome: 'Dízimo', tipo: 'ENTRADA', percentualRepasse: 10, cor: '#10b981' },
  { id: '2', nome: 'Oferta', tipo: 'ENTRADA', cor: '#3b82f6' },
  { id: '3', nome: 'Doação', tipo: 'ENTRADA', cor: '#8b5cf6' },
  { id: '4', nome: 'Outras Receitas', tipo: 'ENTRADA', cor: '#06b6d4' },
  { id: '5', nome: 'Despesa Operacional', tipo: 'SAIDA', cor: '#ef4444' },
  { id: '6', nome: 'Despesa Manutenção', tipo: 'SAIDA', cor: '#f97316' },
  { id: '7', nome: 'Despesa Pessoal', tipo: 'SAIDA', cor: '#ec4899' },
  { id: '8', nome: 'Despesa Missionária', tipo: 'SAIDA', cor: '#a855f7' },
  { id: '9', nome: 'Repasse Denominacional', tipo: 'SAIDA', cor: '#6366f1' },
  { id: '10', nome: 'Patrimônio', tipo: 'ENTRADA', cor: '#14b8a6' },
  { id: '11', nome: 'Outras Despesas', tipo: 'SAIDA', cor: '#64748b' },
];

const defaultConfig: AppConfig = {
  nomeIgreja: 'Igreja Evangélica',
  cnpj: '',
  endereco: '',
  pastorPresidente: '',
  tesoureiro: '',
  percentualRepasse: 10,
  taxaDenominacional: 10,
  categories: defaultCategories,
  ministerios: ['Louvor', 'Ensino', 'Intercessão', 'Juventude', 'Infantil', 'Diaconia', 'Missões'],
};

// Members
export function getMembers(): Member[] {
  return getFromStorage<Member[]>(STORAGE_KEYS.MEMBERS, []);
}

export function saveMember(member: Member): void {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === member.id);
  if (idx >= 0) {
    members[idx] = member;
  } else {
    members.push(member);
  }
  saveToStorage(STORAGE_KEYS.MEMBERS, members);
  addAuditLog('MEMBRO', `Membro ${member.nome} salvo`);
}

export function deleteMember(id: string): void {
  const members = getMembers().filter(m => m.id !== id);
  saveToStorage(STORAGE_KEYS.MEMBERS, members);
  addAuditLog('MEMBRO', `Membro ${id} removido`);
}

// Transactions
export function getTransactions(): Transaction[] {
  return getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

export function saveTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  const idx = transactions.findIndex(t => t.id === transaction.id);
  if (idx >= 0) {
    transactions[idx] = transaction;
  } else {
    transactions.push(transaction);
  }
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  addAuditLog('LANCAMENTO', `Transação ${transaction.descricao} - R$ ${transaction.valor.toFixed(2)} salva`);
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter(t => t.id !== id);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  addAuditLog('LANCAMENTO', `Transação ${id} removida`);
}

export function estornarTransaction(id: string, motivo: string): Transaction | null {
  const transactions = getTransactions();
  const idx = transactions.findIndex(t => t.id === id);
  if (idx < 0 || transactions[idx].estornada) return null;

  const original = transactions[idx];
  original.estornada = true;
  original.estornoMotivo = motivo;

  const estorno: Transaction = {
    id: uuidv4(),
    data: new Date().toISOString().split('T')[0],
    tipo: original.tipo === 'ENTRADA' ? 'SAIDA' : 'ENTRADA',
    categoria: original.categoria,
    valor: original.valor,
    memberId: original.memberId,
    descricao: `ESTORNO: ${original.descricao} | Motivo: ${motivo}`,
    estornada: false,
    createdAt: new Date().toISOString(),
  };

  transactions[idx] = original;
  transactions.push(estorno);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  addAuditLog('ESTORNO', `Estorno da transação ${id}. Motivo: ${motivo}`);
  return estorno;
}

// Commitments
export function getCommitments(): Commitment[] {
  return getFromStorage<Commitment[]>(STORAGE_KEYS.COMMITMENTS, []);
}

export function saveCommitment(commitment: Commitment): void {
  const commitments = getCommitments();
  const idx = commitments.findIndex(c => c.id === commitment.id);
  if (idx >= 0) {
    commitments[idx] = commitment;
  } else {
    commitments.push(commitment);
  }
  saveToStorage(STORAGE_KEYS.COMMITMENTS, commitments);
  addAuditLog('COMPROMISSO', `Compromisso ${commitment.descricao} salvo`);
}

export function deleteCommitment(id: string): void {
  const commitments = getCommitments().filter(c => c.id !== id);
  saveToStorage(STORAGE_KEYS.COMMITMENTS, commitments);
}

// Audit Log
export function getAuditLog(): AuditLog[] {
  return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOG, []);
}

export function addAuditLog(acao: string, detalhes: string): void {
  const log = getAuditLog();
  log.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    userId: 'tesoureiro',
    acao,
    detalhes,
  });
  // Keep only last 1000 entries
  if (log.length > 1000) log.splice(0, log.length - 1000);
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, log);
}

// Config
export function getConfig(): AppConfig {
  return getFromStorage<AppConfig>(STORAGE_KEYS.CONFIG, defaultConfig);
}

export function saveConfig(config: AppConfig): void {
  saveToStorage(STORAGE_KEYS.CONFIG, config);
  addAuditLog('CONFIG', 'Configurações atualizadas');
}

// Backup & Restore
export function createBackup(): BackupData {
  const data: BackupData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    integrityKey: '',
    members: getMembers(),
    transactions: getTransactions(),
    commitments: getCommitments(),
    auditLog: getAuditLog(),
    config: getConfig(),
  };
  const dataStr = JSON.stringify({ ...data, integrityKey: '' });
  data.integrityKey = generateIntegrityKey(dataStr);
  return data;
}

export function restoreBackup(data: BackupData): boolean {
  const { integrityKey, ...rest } = data;
  const dataStr = JSON.stringify({ ...rest, integrityKey: '' });
  const expectedKey = generateIntegrityKey(dataStr);
  
  if (integrityKey !== expectedKey) {
    alert('⚠️ Chave de integridade inválida! Os dados podem ter sido corrompidos.');
    return false;
  }

  saveToStorage(STORAGE_KEYS.MEMBERS, data.members);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, data.transactions);
  saveToStorage(STORAGE_KEYS.COMMITMENTS, data.commitments);
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, data.auditLog);
  saveToStorage(STORAGE_KEYS.CONFIG, data.config);
  return true;
}

// CSV helpers
export function exportToCSV(data: Record<string, any>[], filename: string): void {
  if (data.length === 0) {
    alert('Nenhum dado para exportar.');
    return;
  }
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(';'),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (typeof val === 'string' && val.includes(';')) return `"${val}"`;
      return val ?? '';
    }).join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(';').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

// Template generators
export function getMemberTemplate(): string {
  return 'nome;cpf;email;telefone;endereco;dataNascimento;dataAdmissao;status;ministerios;observacoes\nJoão Silva;123.456.789-00;joao@email.com;(11) 99999-0000;Rua A, 123;01/01/1990;01/01/2020;ATIVO;Louvor;';
}

export function getTransactionTemplate(): string {
  return 'data;tipo;categoria;valor;descricao;memberId\n01/01/2024;ENTRADA;DIZIMO;100.00;Dízimo João;MEMBRO_ID_AQUI\n01/01/2024;SAIDA;DESPESA_OPERACIONAL;500.00;Conta de luz;';
}

export function getCommitmentTemplate(): string {
  return 'descricao;valorTotal;valorParcela;dataVencimento;frequencia;status;categoria;observacoes\nAluguel;12000;1000;05/01/2024;MENSAL;PENDENTE;DESPESA_OPERACIONAL;Aluguel do templo';
}
