import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Download, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { getMembers, saveMember, getCongregations } from '../store';
import { Member, MemberStatus } from '../types';

export default function BatchMembers() {
  const [members, setMembers] = useState(getMembers());
  const [batchData, setBatchData] = useState<Partial<Member>[]>([]);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const congregations = getCongregations();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setImportStatus({ type: 'error', message: 'Arquivo vazio ou sem dados' });
          return;
        }

        const headers = lines[0].split(';').map(h => h.trim());
        const data: Partial<Member>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(';').map(v => v.trim());
          const member: Partial<Member> = {};

          headers.forEach((header, index) => {
            const value = values[index] || '';
            
            switch (header.toLowerCase()) {
              case 'nome':
                member.nome = value;
                break;
              case 'cpf':
                member.cpf = value;
                break;
              case 'email':
                member.email = value;
                break;
              case 'telefone':
                member.telefone = value;
                break;
              case 'endereco':
                member.endereco = value;
                break;
              case 'congregacao':
                member.congregacao = value;
                break;
              case 'status':
                member.status = (value.toUpperCase() as MemberStatus) || 'ATIVO';
                break;
              case 'ministerios':
                member.ministerios = value.split(',').map(m => m.trim());
                break;
              case 'datanascimento':
                member.dataNascimento = value;
                break;
              case 'dataadmissao':
                member.dataAdmissao = value;
                break;
            }
          });

          if (member.nome) {
            data.push(member);
          }
        }

        setBatchData(data);
        setImportStatus({ 
          type: 'success', 
          message: `${data.length} membros carregados para revisão` 
        });
      } catch (error) {
        setImportStatus({ type: 'error', message: 'Erro ao processar arquivo' });
      }
    };

    reader.readAsText(file);
  };

  const handleSaveBatch = () => {
    let savedCount = 0;
    
    batchData.forEach(memberData => {
      if (!memberData.nome) return;

      const member: Member = {
        id: uuidv4(),
        nome: memberData.nome,
        cpf: memberData.cpf || '',
        email: memberData.email || '',
        telefone: memberData.telefone || '',
        endereco: memberData.endereco || '',
        dataNascimento: memberData.dataNascimento || '',
        dataAdmissao: memberData.dataAdmissao || new Date().toISOString().split('T')[0],
        status: memberData.status || 'ATIVO',
        ministerios: memberData.ministerios || [],
        congregacao: memberData.congregacao || '',
        observacoes: '',
      };

      saveMember(member);
      savedCount++;
    });

    setMembers(getMembers());
    setBatchData([]);
    setImportStatus({ 
      type: 'success', 
      message: `${savedCount} membros salvos com sucesso!` 
    });
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'nome', 'cpf', 'email', 'telefone', 'endereco', 
      'congregacao', 'status', 'ministerios', 'datanascimento', 'dataadmissao'
    ];
    
    const example = [
      'João Silva', '123.456.789-00', 'joao@email.com', '(11) 99999-0000', 
      'Rua A, 123', 'Congregação Central', 'ATIVO', 'Louvor,Ensino', 
      '1990-01-15', '2024-01-01'
    ];

    const csv = [
      headers.join(';'),
      example.join(';')
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_membros_lote.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users size={28} />
          Gestão de Membros em Lote
        </h1>
        <p className="text-indigo-100 mt-1">Importe e cadastre múltiplos membros de uma vez</p>
      </div>

      {/* Status */}
      {importStatus && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          importStatus.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {importStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{importStatus.message}</span>
          <button onClick={() => setImportStatus(null)} className="ml-auto text-sm hover:opacity-70">×</button>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Ações</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Download size={16} /> Baixar Modelo CSV
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload size={16} /> Importar CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {batchData.length > 0 && (
            <button
              onClick={handleSaveBatch}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <CheckCircle size={16} /> Salvar {batchData.length} Membros
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {batchData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Pré-visualização ({batchData.length} membros)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-slate-600">Nome</th>
                  <th className="text-left px-4 py-2 font-medium text-slate-600">CPF</th>
                  <th className="text-left px-4 py-2 font-medium text-slate-600">Telefone</th>
                  <th className="text-left px-4 py-2 font-medium text-slate-600">Congregação</th>
                  <th className="text-left px-4 py-2 font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchData.slice(0, 10).map((member, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-700">{member.nome}</td>
                    <td className="px-4 py-2 text-slate-600">{member.cpf || '---'}</td>
                    <td className="px-4 py-2 text-slate-600">{member.telefone || '---'}</td>
                    <td className="px-4 py-2 text-slate-600">{member.congregacao || '---'}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        member.status === 'ATIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.status || 'ATIVO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {batchData.length > 10 && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                ... e mais {batchData.length - 10} membros
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Total de Membros</p>
          <p className="text-2xl font-bold text-slate-800">{members.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Membros Ativos</p>
          <p className="text-2xl font-bold text-emerald-600">
            {members.filter(m => m.status === 'ATIVO').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Congregações</p>
          <p className="text-2xl font-bold text-indigo-600">{congregations.length}</p>
        </div>
      </div>
    </div>
  );
}
