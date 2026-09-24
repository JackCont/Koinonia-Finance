// Types for Church Treasury Management System

export type MemberStatus = 'ATIVO' | 'INATIVO' | 'TRANSFERIDO';

export type TransactionType = 'ENTRADA' | 'SAIDA';

export type TransactionCategory = 
  | 'DIZIMO' 
  | 'OFERTA' 
  | 'DOACAO'
  | 'DESPESA_OPERACIONAL' 
  | 'DESPESA_MANUTENCAO'
  | 'DESPESA_PESSOAL'
  | 'DESPESA_MISSIONARIA'
  | 'REPASSE_DENOMINACIONAL'
  | 'PATRIMONIO'
  | 'OUTRAS_RECEITAS'
  | 'OUTRAS_DESPESAS';

export type CommitmentStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO';

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
  percentualRepasse: number;
  taxaDenominacional: number;
  categories: CategoryConfig[];
  ministerios: string[];
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
}
