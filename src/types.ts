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
  | 'OUTRAS_RECEITAS' | 'OUTRAS_DESPESAS' | 'MISSOES' | 'PROVISAO';

export type ProvisionStatus = 'PENDENTE' | 'UTILIZADA' | 'CANCELADA';

export interface Provision {
  id: string;
  data: string; // yyyy-MM-dd
  competencia: string; // yyyy-MM - mês de origem da sobra
  competenciaDestino: string; // yyyy-MM - mês onde será utilizada
  valor: number;
  descricao: string;
  categoriaDestino?: string; // categoria da despesa que será paga
  status: ProvisionStatus;
  congregacao: string;
  observacoes?: string;
  createdAt: string;
  valorUtilizado?: number; // Valor já utilizado desta provisão
  saldoDisponivel?: number; // Saldo disponível (valor - valorUtilizado)
}

export type UserRole = 'MASTER' | 'ADMIN' | 'TESOURARIA' | 'CONSELHO' | 'CONTADOR';

export interface Pastor {
  id: string;
  nome: string;
  congregacao: string;
  dataInicio: string; // yyyy-MM-dd
  dataFim?: string;    // yyyy-MM-dd - vazio = ativo
  ativo: boolean;
  observacoes?: string;
}

export interface CategoryPeriod {
  id: string;
  categoria: string;
  dataInicio: string; // yyyy-MM-dd
  dataFim?: string;    // yyyy-MM-dd - vazio = vigente
  ativo: boolean;
}

export interface FixedValue {
  id: string;
  categoria: string;
  valor: number;
  descricao: string;
  dataInicio?: string; // yyyy-MM-dd - quando o valor fixo começou a vigorar
  dataFim?: string;    // yyyy-MM-dd - quando o valor fixo deixou de vigorar (vazio = vigente)
}

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

export interface LocalPastor {
  id: string;
  nome: string;
  dataInicio: string; // yyyy-MM-dd
  dataFim?: string;    // yyyy-MM-dd - vazio = ativo
  ativo: boolean;
  observacoes?: string;
}

export interface Church {
  id: string;
  nome: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  pastorPresidente?: string;
  tesoureiro?: string;
  regiao?: string;
  cidade?: string;
  setor?: string;
  ativo: boolean;
  createdAt: string;
  localPastors?: LocalPastor[]; // Pastores locais com vigência
}

export interface Congregation {
  id: string;
  churchId?: string; // Vínculo com a igreja (opcional por enquanto)
  nome: string;
  cidade: string;
  setor: string;
  pastor: string;
  ativo: boolean;
  dataInicio?: string; // yyyy-MM-dd - quando a congregação foi ativada
  dataFim?: string;    // yyyy-MM-dd - quando foi desativada (vazio = ativa)
  endereco?: string;
  telefone?: string;
  observacoes?: string;
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
  foto?: string; // Base64 da imagem
}

export interface Culto {
  id: string;
  nome: string;
  data: string;
  tipo: 'Culto' | 'EBD' | 'Reunião' | 'Evento';
  observacoes?: string;
  createdAt: string;
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
  cultoId?: string;
  documento?: string;
  estornada: boolean;
  estornoMotivo?: string;
  createdAt: string;
  competencia?: string; // Formato: 'YYYY-MM' - mês de referência contábil
  ehProvisao?: boolean; // Se este lançamento cria uma nova provisão
  usaProvisao?: boolean; // Se este lançamento usa provisão existente
  provisonUtilizadas?: Array<{provisionId: string, valorUtilizado: number}>; // Provisões utilizadas
  afetaCaixa?: boolean; // Se deve afetar o fluxo de caixa (padrão: true para lançamentos normais)
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
  competencia?: string; // Formato: 'YYYY-MM' - mês de referência contábil
  dataPagamento?: string; // Data real do pagamento
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
  cultos: Culto[];
}

export interface AppTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sidebarGradientFrom: string;
  sidebarGradientVia: string;
  sidebarGradientTo: string;
  headerBg: string;
  buttonPrimary: string;
  buttonPrimaryHover: string;
}
