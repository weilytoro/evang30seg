import React, { useRef, useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileCode,
  Sparkles,
  ArrowRight,
  Database,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { ParsedRawTransaction } from '../../types/finance';
import {
  exportToCSV,
  exportToJSON,
  parseBankFile,
  SAMPLE_ITAU_CSV,
  SAMPLE_NUBANK_CSV,
} from '../../utils/fileParser';
import {
  formatCurrency,
  formatDate,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from '../../utils/formatters';

export const ImportExportView: React.FC = () => {
  const {
    accounts,
    importTransactions,
    transactions,
    budgets,
    goals,
    resetToDemoData,
    clearAllData,
  } = useFinance();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonBackupInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedRawTransaction[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || ''
  );
  const [importSuccessMsg, setImportSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const allCategoryOptions = [
    ...(DEFAULT_INCOME_CATEGORIES || [])?.map((c) => c?.name),
    ...(DEFAULT_EXPENSE_CATEGORIES || [])?.map((c) => c?.name),
  ];

  // Process text or file content
  const processContent = (name: string, content: string) => {
    try {
      setErrorMsg('');
      setImportSuccessMsg('');
      const results = parseBankFile(name, content);
      if (results.length === 0) {
        setErrorMsg('Nenhuma movimentação válida foi detectada no arquivo. Verifique o formato.');
        setParsedData([]);
      } else {
        setFileName(name);
        setParsedData(results);
      }
    } catch (err: any) {
      setErrorMsg(`Erro ao processar o arquivo: ${err.message || 'Formato incompatível'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processContent(file.name, content);
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        processContent(file.name, content);
      };
      reader.readAsText(file);
    }
  };

  // Load sample template for instant testing
  const handleLoadSample = (sampleType: 'nubank' | 'itau') => {
    if (sampleType === 'nubank') {
      processContent('extrato_nubank_modelo.csv', SAMPLE_NUBANK_CSV);
    } else {
      processContent('extrato_itau_modelo.csv', SAMPLE_ITAU_CSV);
    }
  };

  // Toggle item selection
  const toggleSelect = (index: number) => {
    setParsedData((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setParsedData((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const updateItemCategory = (index: number, newCat: string) => {
    setParsedData((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, suggestedCategory: newCat } : item))
    );
  };

  // Confirm import into finance store
  const handleConfirmImport = () => {
    try {
      if (!selectedAccountId) {
        setErrorMsg('Selecione uma conta bancária de destino.');
        return;
      }

      const count = importTransactions(parsedData || [], selectedAccountId);
      setImportSuccessMsg(
        `Sucesso! ${count} lançamentos foram importados e contabilizados no seu saldo.`
      );
      setParsedData([]);
      setFileName('');
    } catch (err) {
      setErrorMsg('Falha ao importar movimentações.');
    }
  };

  // Backup restore
  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data && (data.transactions || data.accounts)) {
            if (data.transactions) localStorage.setItem('finansmart_transactions_v3', JSON.stringify(data.transactions));
            if (data.accounts) localStorage.setItem('finansmart_accounts_v3', JSON.stringify(data.accounts));
            if (data.budgets) localStorage.setItem('finansmart_budgets_v3', JSON.stringify(data.budgets));
            if (data.goals) localStorage.setItem('finansmart_goals_v3', JSON.stringify(data.goals));
            setImportSuccessMsg('Backup restaurado com sucesso! Atualizando aplicação...');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setErrorMsg('Arquivo de backup inválido ou incompatível.');
          }
        } catch {
          setErrorMsg('Erro ao ler conteúdo do arquivo de backup.');
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setErrorMsg('Erro ao processar arquivo de backup.');
    }
  };

  const selectedCount = (parsedData || [])?.filter((i) => i?.selected !== false).length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Importador Inteligente de Extratos</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Importação & Exportação de Arquivos
            </h2>
            <p className="text-xs text-slate-700 mt-1">
              Envie extratos em <strong>CSV</strong>, <strong>OFX</strong> ou <strong>JSON</strong> de bancos como Nubank, Itaú, Bradesco, Inter, Santander, C6 e Caixa.
            </p>
          </div>

          {/* Instant Test Sample Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-700 font-semibold">Testar com modelo:</span>
            <button
              onClick={() => handleLoadSample('nubank')}
              className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold border border-purple-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Extrato Nubank
            </button>
            <button
              onClick={() => handleLoadSample('itau')}
              className="px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold border border-orange-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Extrato Itaú
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {importSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{importSuccessMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs sm:text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {parsedData.length === 0 && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-10 sm:p-14 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.ofx,.txt,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Upload className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Arraste seu arquivo de extrato aqui ou clique para selecionar
          </h3>
          <p className="text-xs text-slate-700 mt-2 max-w-md mx-auto">
            Compatível com arquivos exportados do seu Internet Banking ou aplicativo (.CSV, .OFX, .TXT, .JSON).
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-600">
              CSV (Vírgula ou Ponto e Vírgula)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-600">
              OFX Bancário Universal
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-600">
              JSON Backup
            </span>
          </div>
        </div>
      )}

      {/* Preview Table & Confirmation Section */}
      {parsedData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Arquivo Analisado:
                </span>
                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {fileName}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Conferência & Classificação Automática
              </h3>
              <p className="text-xs text-slate-700">
                Ajuste as categorias sugeridas ou desmarque itens que não deseja importar
              </p>
            </div>

            {/* Target Account Selector & Confirm Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs">
                <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                  Conta de Destino:
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 font-semibold text-slate-800 focus:outline-none"
                >
                  {(accounts || [])?.map((a) => (
                    <option key={a?.id} value={a?.id}>
                      {a?.name} ({a?.institution})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 md:pt-0">
                <button
                  onClick={handleConfirmImport}
                  disabled={selectedCount === 0}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Importar {selectedCount} Lançamento(s)</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setParsedData([]);
                  setFileName('');
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Cancelar importação"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Select all toggle buttons */}
          <div className="flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSelectAll(true)}
                className="text-emerald-700 hover:underline font-bold"
              >
                Selecionar Todos
              </button>
              <span>•</span>
              <button
                onClick={() => toggleSelectAll(false)}
                className="text-slate-700 hover:underline font-bold"
              >
                Desmarcar Todos
              </button>
            </div>
            <span className="font-semibold text-slate-700">
              Total extraído: <strong>{(parsedData || []).length}</strong> itens
            </span>
          </div>

          {/* Preview Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-sm border-b border-slate-200 text-[11px] font-bold uppercase text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">Sel.</th>
                    <th className="py-2.5 px-3 w-28">Data</th>
                    <th className="py-2.5 px-3">Histórico / Descrição</th>
                    <th className="py-2.5 px-3 w-48">Categoria Sugerida</th>
                    <th className="py-2.5 px-3 w-28 text-right">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(parsedData || [])?.map((item, idx) => {
                    const isIncome = item?.type === 'income';
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          item?.selected !== false ? 'hover:bg-slate-50' : 'opacity-40 bg-slate-50/50'
                        }`}
                      >
                        <td className="py-2 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={item?.selected !== false}
                            onChange={() => toggleSelect(idx)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-medium">
                          {formatDate(item?.date || '')}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          {item?.description}
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={item?.suggestedCategory}
                            onChange={(e) => updateItemCategory(idx, e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-xs font-medium text-slate-700 focus:outline-none"
                          >
                            {(allCategoryOptions || [])?.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3 text-right font-black">
                          <span
                            className={isIncome ? 'text-emerald-700' : 'text-slate-900'}
                          >
                            {isIncome ? '+' : '-'}
                            {formatCurrency(item.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Export & Data Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exportar Dados */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Exportar Extrato & Relatórios
              </h3>
              <p className="text-xs text-slate-700">
                Baixe seus lançamentos para abrir no Excel, Google Sheets ou PowerBI
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => exportToCSV(transactions, 'extrato_completo_finansmart.csv')}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between transition-colors"
            >
              <span>Exportar Todos os Lançamentos (.CSV)</span>
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={() =>
                exportToJSON(
                  { transactions, accounts, budgets, goals, exportedAt: new Date().toISOString() },
                  'backup_completo_finansmart.json'
                )
              }
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between transition-colors"
            >
              <span>Fazer Backup Completo do Sistema (.JSON)</span>
              <FileCode className="w-4 h-4 text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Restaurar Backup & Limpeza */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Restaurar Backup & Reiniciar
              </h3>
              <p className="text-xs text-slate-700">
                Restaure um backup previamente salvo ou reinicie os dados financeiros
              </p>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <input
              ref={jsonBackupInputRef}
              type="file"
              accept=".json"
              onChange={handleRestoreBackup}
              className="hidden"
            />
            <button
              onClick={() => jsonBackupInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
            >
              <span>Restaurar de Arquivo JSON de Backup</span>
              <Upload className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (confirm('Reiniciar todos os dados financeiros?')) {
                  resetToDemoData();
                  setImportSuccessMsg('Dados financeiros reiniciados do zero com sucesso!');
                }
              }}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
            >
              <span>Reiniciar Dados Financeiros</span>
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
