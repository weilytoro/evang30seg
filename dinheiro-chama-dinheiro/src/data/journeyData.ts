import { GargaloFrontMeta, JourneyModuleMeta } from '../types/journey';

export const TRILHA1_MODULES: JourneyModuleMeta[] = [
  {
    id: 0,
    tab: 'quiz',
    title: 'Diagnóstico de Entrada',
    shortTitle: 'Diagnóstico',
    stepCategory: 'Módulo 0 · Diagnóstico',
    summary: 'Identifique com precisão qual das 5 mentalidades financeiras rege sua vida financeira atual.',
  },
  {
    id: 1,
    tab: 'levels',
    title: 'Mentalidade Financeira',
    shortTitle: 'Mentalidade',
    stepCategory: 'Módulo 1 · Consciência',
    summary: 'Compreenda o dinheiro como espelho da sua mente e assuma a frase-marco da sua transformação.',
  },
  {
    id: 2,
    tab: 'beliefs',
    title: 'Quebra de Correntes',
    shortTitle: 'Crenças',
    stepCategory: 'Módulo 2 · Crenças',
    summary: 'Cancele crenças hereditárias de escassez e reprograme sua mente com hábitos fortalecedores.',
  },
  {
    id: 3,
    tab: 'enemies',
    title: 'A Força dos Hábitos',
    shortTitle: 'Hábitos',
    stepCategory: 'Módulo 3 · Hábitos',
    summary: 'Neutralize os 7 inimigos financeiros ocultos que drenam seus recursos no dia a dia.',
  },
  {
    id: 4,
    tab: 'jesus_method',
    title: 'Libertação: Método JESUS',
    shortTitle: 'Dívidas',
    stepCategory: 'Módulo 4 · Dívidas',
    summary: 'Organize suas pendências financeiras e execute a ordem de ataque com estratégia e disciplina.',
  },
  {
    id: 5,
    tab: 'multiplication',
    title: 'Multiplique seus Talentos',
    shortTitle: 'Multiplicação',
    stepCategory: 'Módulo 5 · Multiplicação',
    summary: 'Mapeie dons e recursos adormecidos e responda às 3 perguntas antes de movimentar qualquer valor.',
  },
  {
    id: 6,
    tab: 'purpose',
    title: 'Dor com Propósito',
    shortTitle: 'Propósito',
    stepCategory: 'Módulo 6 · Propósito',
    summary: 'Transforme cicatrizes em sabedoria, escreva sua carta de legado e realize o rito de passagem para o CNPJ.',
  },
];

export interface MentalLevelDetail {
  id: string;
  name: string;
  scoreRange: string;
  minScore: number;
  maxScore: number;
  imageMetaphor: string;
  summary: string;
  milestonePhrase: string;
}

export const MENTAL_LEVELS_DETAILS: MentalLevelDetail[] = [
  {
    id: 'bloqueada',
    name: 'Bloqueada',
    scoreRange: '10 a 19 pontos',
    minScore: 10,
    maxScore: 19,
    imageMetaphor: 'Uma prisão invisível',
    summary: 'O dinheiro é um peso constante; a pessoa evita extratos e sente vergonha, medo ou culpa.',
    milestonePhrase: 'Eu olho para os meus números sem fugir, mesmo quando eles doem.',
  },
  {
    id: 'estagnada',
    name: 'Estagnada',
    scoreRange: '20 a 27 pontos',
    minScore: 20,
    maxScore: 27,
    imageMetaphor: 'O carro ligado com o freio de mão puxado',
    summary: 'Começa planilhas e cursos, mas não mantém o ritmo; vive no "quase".',
    milestonePhrase: 'Eu mantenho um hábito financeiro simples toda semana, mesmo sem vontade.',
  },
  {
    id: 'transicao',
    name: 'Em Transição',
    scoreRange: '28 a 35 pontos',
    minScore: 28,
    maxScore: 35,
    imageMetaphor: 'Atravessar uma ponte',
    summary: 'Já registra gastos e renegocia, mas oscila; cada escorregão vira aprendizado.',
    milestonePhrase: 'Eu já não sou mais o mesmo de antes: quando escorrego, levanto mais rápido.',
  },
  {
    id: 'construcao',
    name: 'Em Construção',
    scoreRange: '36 a 43 pontos',
    minScore: 36,
    maxScore: 43,
    imageMetaphor: 'Os alicerces de uma casa',
    summary: 'Sabe quanto ganha e para onde vai o dinheiro; planeja o mês antes de ele começar.',
    milestonePhrase: 'Eu planejo o mês antes de ele começar e cumpro o que planejei.',
  },
  {
    id: 'evoluida',
    name: 'Evoluída',
    scoreRange: '44 a 50 pontos',
    minScore: 44,
    maxScore: 50,
    imageMetaphor: 'O dinheiro no lugar de ferramenta',
    summary: 'Pensa antes de agir, investe com consciência e doa com generosidade.',
    milestonePhrase: 'Eu uso o dinheiro como ferramenta a serviço do meu propósito e de outras pessoas.',
  },
];

export const GARGALOS_FRONTS: GargaloFrontMeta[] = [
  {
    id: 'vendas',
    title: 'Mercado & Vendas',
    subtitle: 'Atração, posicionamento e canais de receita',
    whenToAttack: 'Faltam clientes ou o negócio depende exclusivamente de indicações esporádicas.',
    tools: ['Posicionamento', 'Funil de Vendas', 'Script Consultivo', 'Parábola do Semeador'],
    firstStep: 'Liste seus 3 clientes mais lucrativos e identifique o que eles têm em comum.',
  },
  {
    id: 'direcao',
    title: 'Direção & Estratégia',
    subtitle: 'Alinhamento de prioridades e plano de 90 dias',
    whenToAttack: 'Falta rumo claro ou existem muitas iniciativas simultâneas sem foco.',
    tools: ['Análise SWOT', 'Business Model Canvas', 'Plano de Ação de 90 Dias'],
    firstStep: 'Escolha UMA meta para os próximos 90 dias e corte temporariamente o que não contribui para ela.',
  },
  {
    id: 'operacao',
    title: 'Operações & Processos',
    subtitle: 'Rotinas, fluxos de entrega e eliminação de gargalos',
    whenToAttack: 'Retrabalho recorrente, atrasos na entrega ou quando tudo depende do dono da empresa.',
    tools: ['Mapeamento de Processos', 'Checklist de Rotinas Operacionais', 'Matriz de Delegação'],
    firstStep: 'Desenhe o caminho completo do pedido (da entrada à entrega) e marque exatamente onde ele trava.',
  },
  {
    id: 'pessoas',
    title: 'Pessoas & Cultura',
    subtitle: 'Liderança, engajamento e contratação por valores',
    whenToAttack: 'A equipe não flui, há conflitos frequentes ou alta rotatividade de colaboradores.',
    tools: ['Contratação por Valores', 'Alinhamento Cultural', 'Rituais de Feedback Contínuo'],
    firstStep: 'Escreva 3 valores inegociáveis do negócio e utilize-os na sua próxima conversa com a equipe.',
  },
];
