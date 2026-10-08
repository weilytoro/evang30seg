export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

export const formatDateLong = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[monthIndex] || '';
};

export const getShortMonthName = (monthIndex: number): string => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months[monthIndex] || '';
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1).replace('.', ',')}%`;
};

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Alimentação & Mercado', color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { name: 'Moradia & Contas', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { name: 'Transporte & Combustível', color: '#8b5cf6', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { name: 'Lazer & Restaurantes', color: '#ec4899', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  { name: 'Saúde & Cuidados', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { name: 'Educação & Cursos', color: '#06b6d4', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  { name: 'Compras & Vestuário', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { name: 'Serviços & Assinaturas', color: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { name: 'Impostos & Taxas', color: '#ef4444', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { name: 'Outras Despesas', color: '#64748b', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salário & Pró-labore', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { name: 'Freelance & Serviços', color: '#059669', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  { name: 'Rendimentos & Dividendos', color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { name: 'Vendas & Comissões', color: '#8b5cf6', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { name: 'Reembolsos', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { name: 'Outras Receitas', color: '#64748b', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
];

export const getCategoryMeta = (categoryName: string, type: 'income' | 'expense' | 'transfer' = 'expense') => {
  if (type === 'transfer') {
    return {
      name: 'Transferência',
      color: '#6366f1',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
    };
  }

  const list = type === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;
  const match = list.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());

  if (match) return match;

  // Partial match
  const partial = list.find((c) =>
    categoryName.toLowerCase().includes(c.name.toLowerCase().split(' ')[0]) ||
    c.name.toLowerCase().includes(categoryName.toLowerCase())
  );
  if (partial) return partial;

  return {
    name: categoryName || (type === 'income' ? 'Outras Receitas' : 'Outras Despesas'),
    color: '#64748b',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };
};
