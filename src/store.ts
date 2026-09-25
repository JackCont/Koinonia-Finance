import { Member, Transaction, Commitment, AuditLog, AppConfig, BackupData, CategoryConfig, User, RemittanceRule, Congregation, AppTheme } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  MEMBERS: 'iead_members',
  TRANSACTIONS: 'iead_transactions',
  COMMITMENTS: 'iead_commitments',
  AUDIT_LOG: 'iead_audit_log',
  CONFIG: 'iead_config',
  USERS: 'iead_users',
  CURRENT_USER: 'iead_current_user',
  THEME: 'iead_theme',
};

function generateIntegrityKey(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
}

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, content: T): void {
  localStorage.setItem(key, JSON.stringify(content));
}

// Função para normalizar nomes de categorias
export function normalizeCategoryName(name: string): string {
  if (!name) return 'OUTRAS_RECEITAS';
  
  // Remove acentos, converte para minúsculas e remove espaços extras
  const normalized = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, ' ') // Normaliza espaços
    .replace(/[.]/g, '') // Remove pontos
    .trim();
  
  // Mapeamento direto
  const mapping: Record<string, string> = {
    'dizimo': 'DIZIMO',
    'dizimos': 'DIZIMO',
    'oferta': 'OFERTA',
    'ofertas': 'OFERTA',
    'doacao': 'DOACAO',
    'doacoes': 'DOACAO',
    'missoes': 'MISSOES',
    'missao': 'MISSOES',
    'agua': 'DESPESA_AGUA',
    'conta agua': 'DESPESA_AGUA',
    'luz': 'DESPESA_LUZ',
    'energia': 'DESPESA_LUZ',
    'conta luz': 'DESPESA_LUZ',
    'conta energia': 'DESPESA_LUZ',
    'aluguel': 'DESPESA_ALUGUEL',
    'iptu': 'DESPESA_IPTU',
    'jubilados': 'DESPESA_JUBILADOS',
    'jubilado': 'DESPESA_JUBILADOS',
    'mat ceia': 'DESPESA_CEIA',
    'material ceia': 'DESPESA_CEIA',
    'ceia': 'DESPESA_CEIA',
    'mat secretaria': 'DESPESA_SECRETARIA',
    'material secretaria': 'DESPESA_SECRETARIA',
    'secretaria': 'DESPESA_SECRETARIA',
    'mat limpeza': 'DESPESA_LIMPEZA',
    'material limpeza': 'DESPESA_LIMPEZA',
    'limpeza': 'DESPESA_LIMPEZA',
    'viagem': 'DESPESA_VIAGEM',
    'viagens': 'DESPESA_VIAGEM',
    'despesas diversas': 'DESPESA_DIVERSAS',
    'despesa diversa': 'DESPESA_DIVERSAS',
    'diversas': 'DESPESA_DIVERSAS',
    'pastor': 'DESPESA_PESSOAL',
    'pastores': 'DESPESA_PESSOAL',
    'pessoal': 'DESPESA_PESSOAL',
    'patrimonio': 'PATRIMONIO',
    'outras receitas': 'OUTRAS_RECEITAS',
    'outra receita': 'OUTRAS_RECEITAS',
    'outras despesas': 'OUTRAS_DESPESAS',
    'outra despesa': 'OUTRAS_DESPESAS',
  };
  
  // Tenta encontrar no mapeamento
  if (mapping[normalized]) {
    return mapping[normalized];
  }
  
  // Se já está no formato correto (ex: DIZIMO, DESPESA_AGUA), retorna como está
  const upperName = name.toUpperCase().trim();
  const validCategories = [
    'DIZIMO', 'OFERTA', 'DOACAO', 'MISSOES', 'OUTRAS_RECEITAS', 'PATRIMONIO',
    'DESPESA_AGUA', 'DESPESA_LUZ', 'DESPESA_ALUGUEL', 'DESPESA_IPTU',
    'DESPESA_JUBILADOS', 'DESPESA_CEIA', 'DESPESA_SECRETARIA', 'DESPESA_LIMPEZA',
    'DESPESA_VIAGEM', 'DESPESA_DIVERSAS', 'DESPESA_PESSOAL', 'DESPESA_MANUTENCAO',
    'DESPESA_MISSIONARIA', 'REPASSE_DENOMINACIONAL', 'OUTRAS_DESPESAS'
  ];
  
  if (validCategories.includes(upperName)) {
    return upperName;
  }
  
  // Fallback: converte para formato padrão
  return upperName.replace(/\s+/g, '_');
}

const defaultCategories: CategoryConfig[] = [
  { id: '1', nome: 'Dízimo', tipo: 'ENTRADA', percentualRepasse: 20, cor: '#10b981' },
  { id: '2', nome: 'Oferta', tipo: 'ENTRADA', cor: '#3b82f6' },
  { id: '3', nome: 'Doação', tipo: 'ENTRADA', cor: '#8b5cf6' },
  { id: '4', nome: 'Missões', tipo: 'ENTRADA', cor: '#06b6d4' },
  { id: '5', nome: 'Outras Receitas', tipo: 'ENTRADA', cor: '#14b8a6' },
  { id: '6', nome: 'Água', tipo: 'SAIDA', cor: '#0ea5e9' },
  { id: '7', nome: 'Luz', tipo: 'SAIDA', cor: '#f59e0b' },
  { id: '8', nome: 'Aluguel', tipo: 'SAIDA', cor: '#ef4444' },
  { id: '9', nome: 'IPTU', tipo: 'SAIDA', cor: '#dc2626' },
  { id: '10', nome: 'Jubilados', tipo: 'SAIDA', cor: '#ec4899' },
  { id: '11', nome: 'Mat. Ceia', tipo: 'SAIDA', cor: '#a855f7' },
  { id: '12', nome: 'Mat. Secretaria', tipo: 'SAIDA', cor: '#6366f1' },
  { id: '13', nome: 'Mat. Limpeza', tipo: 'SAIDA', cor: '#8b5cf6' },
  { id: '14', nome: 'Viagem', tipo: 'SAIDA', cor: '#f97316' },
  { id: '15', nome: 'Despesas Diversas', tipo: 'SAIDA', cor: '#64748b' },
  { id: '16', nome: 'Pastor', tipo: 'SAIDA', cor: '#7c3aed' },
  { id: '17', nome: 'Patrimônio', tipo: 'ENTRADA', cor: '#059669' },
  { id: '18', nome: 'Outras Despesas', tipo: 'SAIDA', cor: '#475569' },
];

const defaultConfig: AppConfig = {
  nomeIgreja: 'Igreja Evangélica Assembleia de Deus',
  cnpj: '',
  endereco: '',
  pastorPresidente: '',
  tesoureiro: '',
  regiao: 'SUL DE MINAS GERAIS',
  cidade: '',
  setor: '',
  percentualRepasse: 20,
  taxaDenominacional: 20,
  categories: defaultCategories,
  ministerios: ['Louvor', 'Ensino', 'Intercessão', 'Juventude', 'Infantil', 'Diaconia', 'Missões'],
  congregacoes: [],
  remittanceRules: [
    {
      id: 'default',
      percentual: 20,
      dataInicio: '2024-01-01',
      dataFim: '',
      descricao: 'Regra padrão de remessa',
      createdAt: new Date().toISOString(),
    }
  ],
};

const defaultUsers: User[] = [
  {
    id: 'master-001',
    username: 'admin',
    passwordHash: hashPassword('admin123'),
    nome: 'Administrador Master',
    role: 'MASTER',
    ativo: true,
    congregacao: '',
    createdAt: new Date().toISOString(),
  }
];

// ============ AUTH ============
export function getUsers(): User[] {
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    saveToStorage(STORAGE_KEYS.USERS, defaultUsers);
    return defaultUsers;
  }
  return users;
}

export function saveUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  saveToStorage(STORAGE_KEYS.USERS, users);
}

export function deleteUser(id: string): void {
  saveToStorage(STORAGE_KEYS.USERS, getUsers().filter(u => u.id !== id));
}

export function authenticateUser(username: string, password: string): User | null {
  const users = getUsers();
  const hash = hashPassword(password);
  const user = users.find(u => u.username === username && u.passwordHash === hash && u.ativo);
  if (user) {
    const updated = { ...user, lastLogin: new Date().toISOString() };
    saveUser(updated);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }
  return null;
}

export function getCurrentUser(): User | null {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// ============ MEMBERS ============
export function getMembers(): Member[] {
  return getFromStorage<Member[]>(STORAGE_KEYS.MEMBERS, []);
}

export function saveMember(member: Member): void {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === member.id);
  if (idx >= 0) members[idx] = member;
  else members.push(member);
  saveToStorage(STORAGE_KEYS.MEMBERS, members);
  addAuditLog('MEMBRO', `Membro ${member.nome} salvo`);
}

export function deleteMember(id: string): void {
  saveToStorage(STORAGE_KEYS.MEMBERS, getMembers().filter(m => m.id !== id));
  addAuditLog('MEMBRO', `Membro ${id} removido`);
}

// ============ TRANSACTIONS ============
export function getTransactions(): Transaction[] {
  return getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

export function saveTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  const idx = transactions.findIndex(t => t.id === transaction.id);
  
  // Normalizar categoria antes de salvar
  const normalizedTransaction = {
    ...transaction,
    categoria: normalizeCategoryName(transaction.categoria) as any,
  };
  
  if (idx >= 0) transactions[idx] = normalizedTransaction;
  else transactions.push(normalizedTransaction);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  addAuditLog('LANCAMENTO', `Transação ${transaction.descricao} - R$ ${transaction.valor.toFixed(2)}`);
}

export function deleteTransaction(id: string): void {
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, getTransactions().filter(t => t.id !== id));
  addAuditLog('LANCAMENTO', `Transação ${id} removida`);
}

export function estornarTransaction(id: string, motivo: string): Transaction | null {
  const transactions = getTransactions();
  const idx = transactions.findIndex(t => t.id === id);
  if (idx < 0 || transactions[idx].estornada) return null;

  const original = transactions[idx];
  original.estornada = true;
  original.estornoMotivo = motivo;

  const dateStr = new Date().toISOString().split('T')[0];
  const estorno: Transaction = {
    id: uuidv4(),
    data: dateStr,
    tipo: original.tipo === 'ENTRADA' ? 'SAIDA' : 'ENTRADA',
    categoria: original.categoria,
    valor: original.valor,
    memberId: original.memberId,
    descricao: `ESTORNO: ${original.descricao} | Motivo: ${motivo}`,
    congregacao: original.congregacao,
    estornada: false,
    createdAt: new Date().toISOString(),
  };

  transactions[idx] = original;
  transactions.push(estorno);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  addAuditLog('ESTORNO', `Estorno da transação ${id}. Motivo: ${motivo}`);
  return estorno;
}

// ============ COMMITMENTS ============
export function getCommitments(): Commitment[] {
  return getFromStorage<Commitment[]>(STORAGE_KEYS.COMMITMENTS, []);
}

export function saveCommitment(commitment: Commitment): void {
  const commitments = getCommitments();
  const idx = commitments.findIndex(c => c.id === commitment.id);
  if (idx >= 0) commitments[idx] = commitment;
  else commitments.push(commitment);
  saveToStorage(STORAGE_KEYS.COMMITMENTS, commitments);
  addAuditLog('COMPROMISSO', `Compromisso ${commitment.descricao} salvo`);
}

export function deleteCommitment(id: string): void {
  saveToStorage(STORAGE_KEYS.COMMITMENTS, getCommitments().filter(c => c.id !== id));
}

// ============ AUDIT LOG ============
export function getAuditLog(): AuditLog[] {
  return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOG, []);
}

export function addAuditLog(acao: string, detalhes: string): void {
  const log = getAuditLog();
  const user = getCurrentUser();
  log.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    userId: user?.username || 'sistema',
    acao,
    detalhes,
  });
  if (log.length > 1000) log.splice(0, log.length - 1000);
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, log);
}

// ============ CONFIG ============
export function getConfig(): AppConfig {
  const config = getFromStorage<AppConfig>(STORAGE_KEYS.CONFIG, defaultConfig);
  if (!config.remittanceRules) config.remittanceRules = defaultConfig.remittanceRules;
  if (!config.congregacoes) config.congregacoes = [];
  if (!config.regiao) config.regiao = defaultConfig.regiao;
  if (!config.cidade) config.cidade = '';
  if (!config.setor) config.setor = '';
  return config;
}

export function saveConfig(config: AppConfig): void {
  saveToStorage(STORAGE_KEYS.CONFIG, config);
  addAuditLog('CONFIG', 'Configurações atualizadas');
}

// ============ REMITTANCE RULES ============
export function getRemittanceRules(): RemittanceRule[] {
  const config = getConfig();
  return config.remittanceRules || defaultConfig.remittanceRules;
}

export function getActiveRemittancePercentual(dateStr?: string): number {
  const rules = getRemittanceRules();
  const checkDate = dateStr || new Date().toISOString().split('T')[0];
  
  const applicable = rules
    .filter(r => r.dataInicio <= checkDate && (!r.dataFim || r.dataFim >= checkDate))
    .sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
  
  return applicable.length > 0 ? applicable[0].percentual : 20;
}

export function saveRemittanceRule(rule: RemittanceRule): void {
  const config = getConfig();
  const rules = config.remittanceRules || [];
  const idx = rules.findIndex(r => r.id === rule.id);
  if (idx >= 0) rules[idx] = rule;
  else rules.push(rule);
  config.remittanceRules = rules;
  saveConfig(config);
}

export function deleteRemittanceRule(id: string): void {
  const config = getConfig();
  config.remittanceRules = (config.remittanceRules || []).filter(r => r.id !== id);
  saveConfig(config);
}

// ============ CONGREGATIONS ============
export function getCongregations(): Congregation[] {
  return getConfig().congregacoes || [];
}

export function saveCongregation(cong: Congregation): void {
  const config = getConfig();
  const congs = config.congregacoes || [];
  const idx = congs.findIndex(c => c.id === cong.id);
  if (idx >= 0) congs[idx] = cong;
  else congs.push(cong);
  config.congregacoes = congs;
  saveConfig(config);
}

export function deleteCongregation(id: string): void {
  const config = getConfig();
  config.congregacoes = (config.congregacoes || []).filter(c => c.id !== id);
  saveConfig(config);
}

// ============ BACKUP & RESTORE ============
export function createBackup(): BackupData {
  const backup: BackupData = {
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    integrityKey: '',
    members: getMembers(),
    transactions: getTransactions(),
    commitments: getCommitments(),
    auditLog: getAuditLog(),
    config: getConfig(),
    users: getUsers(),
  };
  const str = JSON.stringify({ ...backup, integrityKey: '' });
  backup.integrityKey = generateIntegrityKey(str);
  return backup;
}

export function restoreBackup(backup: BackupData): boolean {
  const { integrityKey, ...rest } = backup;
  const str = JSON.stringify({ ...rest, integrityKey: '' });
  const expectedKey = generateIntegrityKey(str);
  
  if (integrityKey !== expectedKey) {
    alert('⚠️ Chave de integridade inválida! Os dados podem ter sido corrompidos.');
    return false;
  }

  saveToStorage(STORAGE_KEYS.MEMBERS, backup.members);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, backup.transactions);
  saveToStorage(STORAGE_KEYS.COMMITMENTS, backup.commitments);
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, backup.auditLog);
  saveToStorage(STORAGE_KEYS.CONFIG, backup.config);
  if (backup.users) saveToStorage(STORAGE_KEYS.USERS, backup.users);
  return true;
}

// ============ CSV HELPERS ============
export function exportToCSV(rows: Record<string, any>[], filename: string): void {
  if (rows.length === 0) {
    alert('Nenhum dado para exportar.');
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => headers.map(h => {
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

export function getMemberTemplate(): string {
  return 'nome;cpf;email;telefone;endereco;dataNascimento;dataAdmissao;status;ministerios;congregacao;observacoes\nJoão Silva;123.456.789-00;joao@email.com;(35) 99999-0000;Rua A, 123;01/01/1990;01/01/2020;ATIVO;Louvor;JACUÍ-MG;';
}

export function getTransactionTemplate(): string {
  return 'data;tipo;categoria;valor;descricao;congregacao;memberId\n01/02/2026;ENTRADA;DIZIMO;2673.65;Dízimos congregação;JACUÍ-MG;\n01/02/2026;ENTRADA;OFERTA;360.15;Ofertas congregação;JACUÍ-MG;\n01/02/2026;SAIDA;JUBILADOS;750.00;Jubilados;JACUÍ-MG;';
}

export function getCommitmentTemplate(): string {
  return 'descricao;valorTotal;valorParcela;dataVencimento;frequencia;status;categoria;congregacao;observacoes\nAluguel;12000;1000;05/01/2024;MENSAL;PENDENTE;DESPESA_ALUGUEL;JACUÍ-MG;Aluguel do templo';
}

// ============ THEME ============
const defaultTheme: AppTheme = {
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#f59e0b',
  sidebarGradientFrom: '#312e81',
  sidebarGradientVia: '#3730a3',
  sidebarGradientTo: '#581c87',
  headerBg: 'rgba(255, 255, 255, 0.8)',
  buttonPrimary: '#6366f1',
  buttonPrimaryHover: '#4f46e5',
};

export function getTheme(): AppTheme {
  return getFromStorage<AppTheme>(STORAGE_KEYS.THEME, defaultTheme);
}

export function saveTheme(theme: AppTheme): void {
  saveToStorage(STORAGE_KEYS.THEME, theme);
}

export function resetTheme(): void {
  saveToStorage(STORAGE_KEYS.THEME, defaultTheme);
}

export const themePresets: Record<string, AppTheme> = {
  default: defaultTheme,
  blue: {
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    accentColor: '#06b6d4',
    sidebarGradientFrom: '#1e3a8a',
    sidebarGradientVia: '#1e40af',
    sidebarGradientTo: '#0c4a6e',
    headerBg: 'rgba(255, 255, 255, 0.8)',
    buttonPrimary: '#2563eb',
    buttonPrimaryHover: '#1d4ed8',
  },
  green: {
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    sidebarGradientFrom: '#064e3b',
    sidebarGradientVia: '#065f46',
    sidebarGradientTo: '#065f46',
    headerBg: 'rgba(255, 255, 255, 0.8)',
    buttonPrimary: '#059669',
    buttonPrimaryHover: '#047857',
  },
  red: {
    primaryColor: '#dc2626',
    secondaryColor: '#ef4444',
    accentColor: '#f59e0b',
    sidebarGradientFrom: '#7f1d1d',
    sidebarGradientVia: '#991b1b',
    sidebarGradientTo: '#7f1d1d',
    headerBg: 'rgba(255, 255, 255, 0.8)',
    buttonPrimary: '#dc2626',
    buttonPrimaryHover: '#b91c1c',
  },
  purple: {
    primaryColor: '#7c3aed',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    sidebarGradientFrom: '#4c1d95',
    sidebarGradientVia: '#5b21b6',
    sidebarGradientTo: '#701a75',
    headerBg: 'rgba(255, 255, 255, 0.8)',
    buttonPrimary: '#7c3aed',
    buttonPrimaryHover: '#6d28d9',
  },
  dark: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#f59e0b',
    sidebarGradientFrom: '#0f172a',
    sidebarGradientVia: '#1e293b',
    sidebarGradientTo: '#0f172a',
    headerBg: 'rgba(15, 23, 42, 0.9)',
    buttonPrimary: '#6366f1',
    buttonPrimaryHover: '#4f46e5',
  },
};
