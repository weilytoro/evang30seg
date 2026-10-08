import { BeliefItem, EnemyItem, JesusDebtItem, MultiplicationMapItem, QuizQuestion } from '../types/methodology';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Quando surge uma despesa inesperada, qual é sua reação imediata?',
    options: [
      { letter: 'A', text: 'Fico tranquilo, já tenho reserva para isso.', points: 5 },
      { letter: 'B', text: 'Fico incomodado, mas consigo resolver sem grandes impactos.', points: 4 },
      { letter: 'C', text: 'Fico estressado e tenho que cortar algo para conseguir pagar.', points: 3 },
      { letter: 'D', text: 'Preciso pegar dinheiro emprestado ou usar o limite do banco.', points: 2 },
      { letter: 'E', text: 'Entro em desespero e não sei o que fazer.', points: 1 },
    ],
  },
  {
    id: 2,
    question: 'Qual é sua rotina com poupança ou investimentos?',
    options: [
      { letter: 'A', text: 'Possuo um plano de investimento mensal e metas claramente definidas.', points: 5 },
      { letter: 'B', text: 'Economizo com frequência, mesmo que o valor seja pequeno.', points: 4 },
      { letter: 'C', text: 'Só consigo economizar dinheiro quando há sobras, o que é raro.', points: 3 },
      { letter: 'D', text: 'Tento economizar, mas acabo utilizando para cobrir despesas.', points: 2 },
      { letter: 'E', text: 'Não economizo nada, nunca sobra e nem sequer penso nisso.', points: 1 },
    ],
  },
  {
    id: 3,
    question: 'Qual o significado do dinheiro para você?',
    options: [
      { letter: 'A', text: 'Representa liberdade, segurança e possibilidade de crescimento.', points: 5 },
      { letter: 'B', text: 'É um meio necessário para viver com dignidade.', points: 4 },
      { letter: 'C', text: 'É algo útil, mas que também traz estresse.', points: 3 },
      { letter: 'D', text: 'É uma fonte constante de preocupação.', points: 2 },
      { letter: 'E', text: 'É um problema que só atrapalha minha vida.', points: 1 },
    ],
  },
  {
    id: 4,
    question: 'Como você lida com seus gastos mensais?',
    options: [
      { letter: 'A', text: 'Tenho um controle claro de minhas receitas e despesas.', points: 5 },
      { letter: 'B', text: 'Faço anotações de algumas coisas, mas não sigo um planejamento rigoroso.', points: 4 },
      { letter: 'C', text: 'Tento me controlar, mas frequentemente gasto mais do que deveria.', points: 3 },
      { letter: 'D', text: 'Vivo no limite, gastando tudo o que ganho.', points: 2 },
      { letter: 'E', text: 'Não tenho ideia de quanto gasto e estou sempre no vermelho.', points: 1 },
    ],
  },
  {
    id: 5,
    question: 'Como é sua relação com o aprendizado financeiro?',
    options: [
      { letter: 'A', text: 'Estou sempre buscando aprender e aplicar o que aprendo.', points: 5 },
      { letter: 'B', text: 'Leio ou assisto algo relacionado ao tema de vez em quando.', points: 4 },
      { letter: 'C', text: 'Só busco saber mais quando estou em apuros.', points: 3 },
      { letter: 'D', text: 'Tenho resistência, acho difícil ou cansativo.', points: 2 },
      { letter: 'E', text: 'Não me interesso, finanças não são para mim.', points: 1 },
    ],
  },
  {
    id: 6,
    question: 'Quando se trata de dívidas, quais dessas afirmações melhor representa você?',
    options: [
      { letter: 'A', text: 'Raramente me endivido e, quando acontece, resolvo rapidamente.', points: 5 },
      { letter: 'B', text: 'Tenho dívidas, mas consigo controlá-las.', points: 4 },
      { letter: 'C', text: 'Vivo fazendo acordos e pagando parcelas atrasadas.', points: 3 },
      { letter: 'D', text: 'Estou sempre com dívidas acumuladas e mal consigo pagá-las.', points: 2 },
      { letter: 'E', text: 'Estou totalmente endividado e sem perspectiva de sair dessa situação.', points: 1 },
    ],
  },
  {
    id: 7,
    question: 'Ao pensar no seu futuro financeiro, quais são seus sentimentos?',
    options: [
      { letter: 'A', text: 'Otimismo e planejamento claro.', points: 5 },
      { letter: 'B', text: 'Alguma incerteza, mas com esperança de melhora.', points: 4 },
      { letter: 'C', text: 'Preocupação, pois não possuo planos definidos.', points: 3 },
      { letter: 'D', text: 'Medo de nunca alcançar estabilidade.', points: 2 },
      { letter: 'E', text: 'Desânimo total, acredito que nunca vai mudar.', points: 1 },
    ],
  },
  {
    id: 8,
    question: 'Qual é a sua reação ao ver alguém prosperando financeiramente?',
    options: [
      { letter: 'A', text: 'Sinto-me inspirado e busco entender o que a pessoa fez para prosperar.', points: 5 },
      { letter: 'B', text: 'Sinto-me feliz e desejo o mesmo para mim.', points: 4 },
      { letter: 'C', text: 'Comparo-me com a pessoa e sinto-me inferior.', points: 3 },
      { letter: 'D', text: 'Acredito que a pessoa teve sorte ou ajuda que eu não tive.', points: 2 },
      { letter: 'E', text: 'Sinto inveja e me frustro por nunca conseguir o mesmo.', points: 1 },
    ],
  },
  {
    id: 9,
    question: 'Quando surge uma oportunidade de investimento ou negócio, qual é a sua reação?',
    options: [
      { letter: 'A', text: 'Analiso com calma e aproveito se fizer sentido.', points: 5 },
      { letter: 'B', text: 'Avalio, mas só invisto se for algo muito seguro.', points: 4 },
      { letter: 'C', text: 'Sinto vontade, mas o medo me impede.', points: 3 },
      { letter: 'D', text: 'Desacredito e acho que é perigoso demais.', points: 2 },
      { letter: 'E', text: 'Nem considero, acredito que isso não é para mim.', points: 1 },
    ],
  },
  {
    id: 10,
    question: 'Qual dessas frases descreve melhor a sua relação com o risco financeiro?',
    options: [
      { letter: 'A', text: 'Aceito riscos calculados como parte do crescimento.', points: 5 },
      { letter: 'B', text: 'Só arrisco quando tenho garantia ou segurança mínima.', points: 4 },
      { letter: 'C', text: 'Prefiro evitar ao máximo, mesmo que isso atrase meus objetivos.', points: 3 },
      { letter: 'D', text: 'Acredito que risco é sinônimo de perda certa, então evito.', points: 2 },
      { letter: 'E', text: 'Não corro risco nenhum, prefiro continuar como estou, mesmo insatisfeito.', points: 1 },
    ],
  },
];

// Clean: todas as crenças começam desmarcadas (hasBelief: false)
export const DEFAULT_BELIEFS: BeliefItem[] = [
  {
    id: 'b-1',
    belief: 'Eu não mereço ser próspero.',
    hasBelief: false,
    origin: 'Baixa autoestima ou comparações constantes com os outros.',
    empoweringBelief: 'Eu mereço prosperar e criar uma vida abundante sob a graça de Deus.',
    trigger: 'Comparação com os outros nas redes ou sensação de incapacidade.',
    newRoutine: 'Praticar afirmações diárias de identidade e dignidade.',
    reward: 'Confiança renovada e autoestima elevada.',
    supervisor: 'Cônjuge ou mentor de confiança',
  },
  {
    id: 'b-2',
    belief: 'Dinheiro é a raiz de todos os males.',
    hasBelief: false,
    origin: 'Interpretação distorcida de 1 Timóteo 6,10 (o amor desordenado ao dinheiro, não o recurso em si).',
    empoweringBelief: 'O dinheiro é uma ferramenta neutra que amplifica quem eu sou e abençoa o próximo.',
    trigger: 'Discussões negativas sobre riqueza ou julgamento de pessoas prósperas.',
    newRoutine: 'Listar 3 benefícios concretos que o dinheiro pode trazer para minha família e igreja/comunidade.',
    reward: 'Paz de espírito e motivação para produzir mais valor.',
    supervisor: 'Líder de grupo ou amigo íntimo',
  },
  {
    id: 'b-3',
    belief: 'Dinheiro traz problemas e conflitos.',
    hasBelief: false,
    origin: 'Presenciar discussões familiares na infância por escassez ou desorganização de recursos.',
    empoweringBelief: 'O dinheiro bem administrado é instrumento de paz, solução e segurança.',
    trigger: 'Chegada simultânea de contas ou boletos a vencer.',
    newRoutine: 'Sentar para planejar com antecedência e manter o orçamento transparente.',
    reward: 'Alívio real e sensação de governo sobre a casa.',
    supervisor: 'Cônjuge ou parceiro de confiança',
  },
  {
    id: 'b-4',
    belief: 'Quem nasce pobre, morre pobre.',
    hasBelief: false,
    origin: 'Frases repetidas como "a vida é assim, para nós nada é fácil".',
    empoweringBelief: 'Minha origem não define meu futuro; a sabedoria e a bênção divina transformam minha história.',
    trigger: 'Conversas de desânimo ou notícias sobre crise.',
    newRoutine: 'Ler testemunhos e biografias de superação financeira com base em valores.',
    reward: 'Inspiração e ampliação da visão de futuro.',
    supervisor: 'Professor ou Mentor',
  },
  {
    id: 'b-5',
    belief: 'Investir é arriscado e só para ricos.',
    hasBelief: false,
    origin: 'Falta de educação financeira e medo do desconhecido.',
    empoweringBelief: 'Investir é acessível a todos e pode ser seguro com conhecimento e disciplina do pouco a pouco.',
    trigger: 'Recebimento de renda ou sobra de dinheiro.',
    newRoutine: 'Destinar um valor fixo mensal no Tesouro Selic ou CDB antes de qualquer gasto supérfluo.',
    reward: 'Segurança financeira e orgulho de ver o dinheiro trabalhando.',
    supervisor: 'Planejador financeiro ou mentor',
  },
  {
    id: 'b-6',
    belief: 'Dinheiro na mão é vendaval (vai embora rápido).',
    hasBelief: false,
    origin: 'Falta de método de contenção e compras impulsivas.',
    empoweringBelief: 'Posso planejar, governar e direcionar cada centavo com autoridade e calma.',
    trigger: 'Entrada de renda caindo na conta bancária.',
    newRoutine: 'Aplicar a regra: primeiro a reserva e investimentos, depois os compromissos fixos.',
    reward: 'Tranquilidade nas noites de sono.',
    supervisor: 'Parceiro de oração/finanças',
  },
];

// Clean: todos os 7 inimigos começam desligados (active: false, actionTaken: false)
export const SEVEN_ENEMIES: EnemyItem[] = [
  {
    id: 1,
    name: 'Parcelar tudo no cartão sem poder pagar',
    description: 'Usar o crédito como se fosse renda extra, gerando uma bola de neve de juros.',
    active: false,
    actionTaken: false,
    actionText: 'Definir teto máximo de parcelas ativas (no máx 2)',
    customLimitOrValue: '',
  },
  {
    id: 2,
    name: 'Não ter reserva de emergência',
    description: 'Qualquer imprevisto vira dívida, empurrando direto para o rotativo ou cheque especial.',
    active: false,
    actionTaken: false,
    actionText: 'Automatizar depósito semanal/mensal de reserva',
    customLimitOrValue: '',
  },
  {
    id: 3,
    name: 'Comprar por impulso (promoções e gatilhos)',
    description: 'Gastar com o que não estava no plano atraído por "urgência artificial" ou para compensar cansaço.',
    active: false,
    actionTaken: false,
    actionText: 'Desinstalar apps de compras do celular por 30 dias e esperar 48h antes de compras não essenciais',
    customLimitOrValue: '',
  },
  {
    id: 4,
    name: 'Não ter um orçamento mensal prévio',
    description: 'O dinheiro vai embora sem saber para onde foi. Falta de planejamento antes do mês começar.',
    active: false,
    actionTaken: false,
    actionText: 'Revisar orçamento mensal toda semana e planejar o mês antes de ele começar',
    customLimitOrValue: '',
  },
  {
    id: 5,
    name: 'Usar o cheque especial como renda',
    description: 'Uma das taxas mais abusivas do mercado. Paga caro para antecipar dinheiro que ainda não tem.',
    active: false,
    actionTaken: false,
    actionText: 'Ligar para o banco e solicitar cancelamento ou redução a zero do limite de cheque especial',
    customLimitOrValue: '',
  },
  {
    id: 6,
    name: 'Não investir (deixar parado na poupança)',
    description: 'A inflação corrói o poder de compra. O dinheiro precisa cumprir a Parábola dos Talentos e frutificar.',
    active: false,
    actionTaken: false,
    actionText: 'Manter aportes mensais diversificados (Princípio de Eclesiastes 11,2)',
    customLimitOrValue: '',
  },
  {
    id: 7,
    name: 'Comparar-se com os outros e viver acima do padrão',
    description: 'Gastar para sustentar aparências ou impressionar quem pouco se importa. Drenagem invisível.',
    active: false,
    actionTaken: false,
    actionText: 'Listar gastos de ostentação e cortar ou trocar por opções sustentáveis',
    customLimitOrValue: '',
  },
];

// Clean: Começa do zero, sem dívidas de demonstração
export const INITIAL_JESUS_DEBTS: JesusDebtItem[] = [];

// Clean: Começa do zero, sem talentos pré-preenchidos
export const INITIAL_MULTIPLICATION_MAP: MultiplicationMapItem[] = [];

export interface KingdomArea {
  id: number;
  name: string;
  biblicalRoot: string;
  description: string;
  examples: string[];
}

export const EIGHT_KINGDOM_AREAS: KingdomArea[] = [
  {
    id: 1,
    name: 'Gestão da Casa & Família',
    biblicalRoot: '1 Timóteo 5,8',
    description: 'Administração de recursos domésticos, alimentação, cuidados com o lar e educação.',
    examples: ['Marmitas saudáveis', 'Organização residencial (personal organizer)', 'Aulas de reforço'],
  },
  {
    id: 2,
    name: 'Artesanato & Criação Manual',
    biblicalRoot: 'Êxodo 35,35',
    description: 'Trabalho manual, produção física, marcenaria, costura e arte.',
    examples: ['Doces e bolos sob encomenda', 'Artesanato em madeira/tecido', 'Consertos e costura'],
  },
  {
    id: 3,
    name: 'Ensino & Mentoria',
    biblicalRoot: 'Provérbios 9,9',
    description: 'Transmissão de sabedoria, capacitação profissional e tutoria.',
    examples: ['Aulas de idiomas', 'Treinamento de informática básica', 'Mentoria para iniciantes'],
  },
  {
    id: 4,
    name: 'Empreendedorismo & Comércio',
    biblicalRoot: 'Provérbios 31,16',
    description: 'Venda de produtos, intermediação comercial e representação.',
    examples: ['Revenda de produtos de qualidade', 'Comércio eletrônico local', 'Prestação de serviços'],
  },
  {
    id: 5,
    name: 'Tecnologia & Informação',
    biblicalRoot: 'Daniel 12,4',
    description: 'Serviços digitais, automação, suporte técnico e criação de conteúdo.',
    examples: ['Manutenção de computadores', 'Gestão de redes sociais para lojas do bairro', 'Edição de vídeo'],
  },
  {
    id: 6,
    name: 'Saúde & Cuidado Pessoal',
    biblicalRoot: '1 Coríntios 6,19',
    description: 'Bem-estar físico, condicionamento, nutrição e cuidados com pessoas.',
    examples: ['Treinamento funcional em praças', 'Acompanhamento de idosos', 'Consultoria de rotina saudável'],
  },
  {
    id: 7,
    name: 'Agricultura Urbana & Sustento',
    biblicalRoot: 'Gênesis 2,15',
    description: 'Cultivo de plantas, hortas caseiras, adubação e sustentabilidade.',
    examples: ['Hortas em pequenos espaços', 'Venda de mudas e plantas medicinais', 'Compostagem caseira'],
  },
  {
    id: 8,
    name: 'Mediação & Apoio Comunitário',
    biblicalRoot: 'Mateus 5,9',
    description: 'Resolução de conflitos, facilitação de acordos e eventos.',
    examples: ['Organização de eventos comunitários', 'Assessoria em acordos amigáveis', 'Cerimonial'],
  },
];

