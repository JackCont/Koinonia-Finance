// Types for Church Treasury Management System

export type MemberStatus = 'ATIVO' | 'INATIVO' | 'TRANSFERIDO';
export type TransactionType = 'ENTRADA' | 'SAIDA';
export type CommitmentStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO';

export type TransactionCategory = 
  | 'DIZIMO' | 'OFERTA' | 'DOACAO'
  | 'DESPESA_AGUA' | 'DESPESA_LUZ' | 'DESPESA_ALUGUEL' | 'DESPESA_IPTU'
  | 'DESPESA_JUBILADOS' | 'DESPESA_CEIA' | 'DESPESA_SECRETARIA' 
  | 'DESPESA_LIMPEZA' | 'DESPESA_VIAGEM' | 'DESPESA_DIVERSAS'
  | 'DESPESA_PESSOAL' | 'DESPESA_MANUTENCAO' | 'DESPESA_MISSIONARIA'
  | 'REPASSE_DENOMINACIONAL' | 'PATRIMONIO'
  | 'OUTRAS_RECEITAS' | 'OUTRAS_DESPESAS' | 'MISSOES';

export type UserRole = 'MASTER' | 'ADMIN' | 'TESOURARIA' | 'CONSELHO' | 'CONTADOR';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  nome: string;
  role: UserRole;
  ativo: boolean;
  congregacao: string;
  createdAt: string;
  lastLogin?: string;
}

export interface RemittanceRule {
  id: string;
  percentual: number;
  dataInicio: string; // yyyy-MM-dd
  dataFim: string;    // yyyy-MM-dd ou vazio = vigente
  descricao: string;
  createdAt: string;
}

export interface Congregation {
  id: string;
  nome: string;
  cidade: string;
  setor: string;
  pastor: string;
  ativo: boolean;
}

export interface Member {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  dataAdmissao: string;
  status: MemberStatus;
  ministerios: string[];
  congregacao: string;
  observacoes: string;
}

export interface Transaction {
  id: string;
  data: string;
  tipo: TransactionType;
  categoria: TransactionCategory;
  valor: number;
  memberId?: string;
  descricao: string;
  congregacao: string;
  documento?: string;
  estornada: boolean;
  estornoMotivo?: string;
  createdAt: string;
}

export interface Commitment {
  id: string;
  descricao: string;
  valorTotal: number;
  valorParcela: number;
  dataVencimento: string;
  frequencia: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL' | 'UNICO';
  status: CommitmentStatus;
  categoria: TransactionCategory;
  congregacao: string;
  observacoes: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  acao: string;
  detalhes: string;
}

export interface CategoryConfig {
  id: string;
  nome: string;
  tipo: TransactionType;
  percentualRepasse?: number;
  valorFixo?: number;
  cor: string;
}

export interface AppConfig {
  nomeIgreja: string;
  cnpj: string;
  endereco: string;
  pastorPresidente: string;
  tesoureiro: string;
  regiao: string;
  cidade: string;
  setor: string;
  percentualRepasse: number;
  taxaDenominacional: number;
  categories: CategoryConfig[];
  ministerios: string[];
  congregacoes: Congregation[];
  remittanceRules: RemittanceRule[];
}

export interface BackupData {
  version: string;
  timestamp: string;
  integrityKey: string;
  members: Member[];
  transactions: Transaction[];
  commitments: Commitment[];
  auditLog: AuditLog[];
  config: AppConfig;
  users: User[];
}
