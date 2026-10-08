import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  // If PORT is 8080, it is used by Nginx proxy in the AI Studio environment,
  // so the Node app must listen on 3000.
  if (process.env.PORT && process.env.PORT !== '8080') {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
}

const app = express();
const PORT = getPort();

app.use(express.json());
app.use(express.static(path.resolve(import.meta.dirname, 'public')));

// Initialize GoogleGenAI client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout de ${ms}ms excedido ao chamar a API`)), ms)
    ),
  ]);
}

// Helper for Radar GERAR 8D rule-based analysis (fallback during 503 upstream spikes)
function analyzeBottleneckRuleBased(
  dorPrincipal: string,
  tempoDor: string,
  tentativasAnteriores: string,
  focoDor: string
) {
  const text = `${dorPrincipal} ${tentativasAnteriores}`.toLowerCase();

  let areaPrincipal = 'Finanças';
  let dimensaoLider = 'Material';
  let justificativa = '';
  let acaoRecomendada = '';

  if (
    text.includes('caixa') ||
    text.includes('lucro') ||
    text.includes('dinheiro') ||
    text.includes('margem') ||
    text.includes('preço') ||
    text.includes('conta') ||
    text.includes('boleto') ||
    text.includes('custo')
  ) {
    areaPrincipal = 'Finanças';
    dimensaoLider = 'Material (Resultados & Fluxo de Caixa)';
    justificativa =
      'A dor descrita aponta para falta de visibilidade do fluxo de caixa e ausência de separação rigorosa entre despesas da Pessoa Física e Pessoa Jurídica. Sem um DRE simplificado e precificação técnica, o negócio sangra financeiramente mesmo vendendo.';
    acaoRecomendada =
      'Defina seu pró-labore fixo nas próximas 72 horas e abra uma conta bancária de recebimento 100% exclusiva para a empresa.';
  } else if (
    text.includes('cliente') ||
    text.includes('venda') ||
    text.includes('atrair') ||
    text.includes('marketing') ||
    text.includes('divulga') ||
    text.includes('lead')
  ) {
    areaPrincipal = 'Marketing';
    dimensaoLider = 'Material (Atração & Posicionamento)';
    justificativa =
      'O gargalo primário está no canal de aquisição de clientes. A empresa não possui um mecanismo previsível de atração, dependendo exclusivamente de indicações esporádicas ou boca a boca.';
    acaoRecomendada =
      'Mapeie seus 3 clientes mais lucrativos e crie uma oferta direta com prova social para enviar a 20 contatos qualificados.';
  } else if (
    text.includes('equipe') ||
    text.includes('funcionário') ||
    text.includes('pessoa') ||
    text.includes('contrata') ||
    text.includes('demite') ||
    text.includes('motiva') ||
    text.includes('delegar')
  ) {
    areaPrincipal = 'Pessoas';
    dimensaoLider = 'Alma (Relacionamentos & Liderança)';
    justificativa =
      'O empresário está centralizando toda a operação por falta de alinhamento, clareza de papéis ou capacitação da equipe. Quando o líder não delega com critério, ele se torna o teto do próprio crescimento.';
    acaoRecomendada =
      'Escreva o manual de uma tarefa crítica diária e delegue-a formalmente com prazo e métrica de conferência para um colaborador.';
  } else if (
    text.includes('processo') ||
    text.includes('entrega') ||
    text.includes('desorganiz') ||
    text.includes('tempo') ||
    text.includes('atraso') ||
    text.includes('retrabalho')
  ) {
    areaPrincipal = 'Operações';
    dimensaoLider = 'Material (Execução & Produtividade)';
    justificativa =
      'Existe atrito no fluxo operacional. A falta de padronização nas entregas gera retrabalho, perda de tempo do líder e insatisfação nos prazos prometidos aos clientes.';
    acaoRecomendada =
      'Desenhe o fluxo do pedido do cliente do início ao fim e elimine as 2 etapas que mais causam atrasos.';
  } else if (
    text.includes('inova') ||
    text.includes('diferenc') ||
    text.includes('antigo') ||
    text.includes('concorrente') ||
    text.includes('tecnologia')
  ) {
    areaPrincipal = 'Inovação';
    dimensaoLider = 'Espírito (Visão & Criatividade)';
    justificativa =
      'O modelo de negócios ou o produto atingiu um platô de comoditização. É urgente renovar a proposta de valor para não disputar apenas por preço baixo.';
    acaoRecomendada =
      'Entreviste 3 clientes fiéis perguntando: "O que nós poderíamos oferecer que você compraria imediatamente de olhos fechados?".';
  } else {
    areaPrincipal = 'Estratégia';
    dimensaoLider = 'Espírito (Direção & Propósito)';
    justificativa =
      'Há falta de clareza quanto ao objetivo dos próximos 90 dias. Muitas iniciativas começadas ao mesmo tempo dispersam a energia do líder e impedem a consolidação de resultados consistentes.';
    acaoRecomendada =
      'Escolha a UMA ÚNICA meta financeira prioritária para este mês e corte temporariamente todas as tarefas secundárias que não contribuem com ela.';
  }

  return {
    areaPrincipal,
    justificativa,
    acaoRecomendada,
    dimensaoLider,
  };
}

// Helper for Método JESUS debt analysis (fallback during 503 upstream spikes)
function analyzeDebtsRuleBased(
  debts: Array<{ name: string; value: number; interestRate: number }>,
  monthlyIncome?: number,
  monthlyExpenses?: number
) {
  const surplus = (monthlyIncome || 8500) - (monthlyExpenses || 5400);

  // Bola de Neve: menor valor primeiro
  const sortedBolaDeNeve = [...debts]
    .sort((a, b) => a.value - b.value)
    .map((d, idx) => ({
      ordem: idx + 1,
      nome: d.name,
      valor: d.value,
      juros: d.interestRate,
      motivoPsicologico:
        idx === 0
          ? 'Primeiro alvo de ataque: menor saldo para quitação rápida, gerando vitória imediata e desbloqueio emocional.'
          : `Alvo #${idx + 1}: ao quitar as anteriores, o valor economizado é somado como bola de neve contra esta dívida.`,
    }));

  // Avalanche: maior taxa de juros primeiro
  const sortedAvalanche = [...debts]
    .sort((a, b) => b.interestRate - a.interestRate)
    .map((d, idx) => ({
      ordem: idx + 1,
      nome: d.name,
      valor: d.value,
      juros: d.interestRate,
      economiaJuros:
        idx === 0
          ? `Alvo prioritário matemático: juros de ${d.interestRate}% a.m. geram sangria exponencial. Quitar primeiro estanca o maior custo financeiro.`
          : `Alvo #${idx + 1}: juros moderados atacados em sequência assim que a principal sangria for eliminada.`,
    }));

  const hasHighInterestDebt = debts.some((d) => d.interestRate >= 8);

  const comparativo =
    'A estratégia "Bola de Neve" foca no comportamento e na vitória psicológica rápida eliminando credores menores, enquanto a "Avalanche" ataca os maiores juros para economizar o máximo de dinheiro.';

  const recomendacaoEstrategica = hasHighInterestDebt
    ? 'Recomendamos a estratégia Combinada ou Avalanche: elimine primeiro qualquer cartão ou cheque especial com juros acima de 8% a.m., e depois aplique a Bola de Neve para as dívidas restantes.'
    : 'Recomendamos a estratégia Bola de Neve: seus juros são administráveis, portanto a motivação de ver credores sendo riscados da lista criará a disciplina emocional necessária.';

  const orientacaoEspiritual =
    'O Método JESUS nos ensina que o devedor é servo do credor (Pv 22,7). Não negocie com a vergonha; negocie com a verdade. Junte as informações, estabeleça sua capacidade real e honre cada compromisso com fidelidade no pouco.';

  return {
    bolaDeNeve: sortedBolaDeNeve,
    avalanche: sortedAvalanche,
    comparativo,
    recomendacaoEstrategica,
    orientacaoEspiritual,
  };
}

// ==========================================
// 1. API: Analisar Gargalo - Radar GERAR 8D
// ==========================================
app.post('/api/gerar/analyze-bottleneck', async (req: Request, res: Response) => {
  const { dorPrincipal, tempoDor, tentativasAnteriores, focoDor } = req.body;

  if (!dorPrincipal && !tentativasAnteriores) {
    return res.status(400).json({
      error: 'É necessário preencher pelo menos a dor principal da empresa.',
    });
  }

  // 1. Try Gemini API first
  try {
    const promptText = `
Dados da Triagem do Empresário:
- Dor Principal: ${dorPrincipal || 'Não informado'}
- Tempo da Dor: ${tempoDor || 'Não informado'}
- O que já tentou fazer: ${tentativasAnteriores || 'Não informado'}
- Foco percebido pelo empresário: ${focoDor || 'ambos'}

Analise a situação acima segundo a metodologia do Radar GERAR 8D do Prof. Weily Toro.
Identifique qual é o gargalo primário estritamente entre: Finanças, Estratégia, Marketing, Operações, Pessoas ou Inovação.
Forneça a área principal, uma breve justificativa explicativa, e uma recomendação de ação imediata (Compromisso de 3 Dias).
`.trim();

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction:
            'És o Radar GERAR 8D do Prof. Weily Toro. Analisa a dor do empresário e identifica qual é o gargalo primário (Finanças, Estratégia, Marketing, Operações, Pessoas ou Inovação). Indica apenas a área principal e uma breve justificação.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              areaPrincipal: {
                type: Type.STRING,
                description:
                  'A área principal do gargalo: Finanças, Estratégia, Marketing, Operações, Pessoas ou Inovação',
              },
              justificativa: {
                type: Type.STRING,
                description: 'Breve justificativa do motivo de ser esse o gargalo primário',
              },
              acaoRecomendada: {
                type: Type.STRING,
                description: 'Uma ação recomendada imediata (Compromisso dos 3 Dias)',
              },
              dimensaoLider: {
                type: Type.STRING,
                description: 'Dimensão do líder mais impactada: Espírito, Alma ou Material',
              },
            },
            required: ['areaPrincipal', 'justificativa', 'acaoRecomendada'],
          },
        },
      }),
      5000
    );

    const text = response.text;
    if (text) {
      const parsedData = JSON.parse(text);
      return res.json({
        success: true,
        analysis: parsedData,
        source: 'gemini-ai',
      });
    }
  } catch (apiError: any) {
    console.warn('Gemini API indisponível temporariamente, aplicando Radar GERAR 8D:', apiError.message);
  }

  // 2. High-fidelity methodological fallback if API is experiencing temporary 503
  const ruleAnalysis = analyzeBottleneckRuleBased(
    dorPrincipal || '',
    tempoDor || '',
    tentativasAnteriores || '',
    focoDor || 'ambos'
  );

  return res.json({
    success: true,
    analysis: ruleAnalysis,
    source: 'gerar-radar-engine',
  });
});

// ==========================================
// 2. API: Método JESUS - Análise de Dívidas
// ==========================================
app.post('/api/jesus-method/analyze-debts', async (req: Request, res: Response) => {
  const { debts, monthlyLiquidIncome, monthlyEssentialExpenses } = req.body;

  if (!Array.isArray(debts) || debts.length === 0) {
    return res.status(400).json({
      error: 'Nenhuma dívida enviada para estruturação do plano.',
    });
  }

  // 1. Try Gemini API first
  try {
    const surplus = (monthlyLiquidIncome || 0) - (monthlyEssentialExpenses || 0);

    const promptText = `
Lista de Dívidas do Utilizador para aplicação do Método JESUS (Justificar, Eliminar, Substituir, Unificar, Sustentar):
${JSON.stringify(debts, null, 2)}

Contexto Financeiro:
- Renda Líquida Mensal: R$ ${monthlyLiquidIncome || 'Não informada'}
- Despesas Essenciais: R$ ${monthlyEssentialExpenses || 'Não informadas'}
- Sobra Mensal Estimada para Ataque: R$ ${surplus > 0 ? surplus : 'Ajustar orçamento'}

Com base nos ensinamentos do livro "Dinheiro Chama Dinheiro" de Weily Toro Machado:
1. Monte a ordem de quitação pela estratégia "Bola de Neve" (menor valor primeiro para gerar motivação rápida e vitória psicológica).
2. Monte a ordem de quitação pela estratégia "Avalanche" (maior taxa de juros primeiro para conter o sangramento financeiro).
3. Apresente um comparativo claro entre as duas abordagens, orientando qual escolher de acordo com a saúde emocional do devedor.
4. Forneça uma orientação de sabedoria prática e espiritual baseada no Método JESUS.
`.trim();

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction:
            'És o especialista financeiro do Método JESUS de Weily Toro Machado. Estrutura o plano de ataque às dívidas comparando Bola de Neve (menor valor primeiro para motivação) e Avalanche (maior juro primeiro). Sê encorajador, estratégico e prático.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bolaDeNeve: {
                type: Type.ARRAY,
                description: 'Dívidas ordenadas pelo método Bola de Neve (menor saldo primeiro)',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ordem: { type: Type.INTEGER },
                    nome: { type: Type.STRING },
                    valor: { type: Type.NUMBER },
                    juros: { type: Type.NUMBER },
                    motivoPsicologico: { type: Type.STRING },
                  },
                  required: ['ordem', 'nome', 'valor', 'juros'],
                },
              },
              avalanche: {
                type: Type.ARRAY,
                description: 'Dívidas ordenadas pelo método Avalanche (maior taxa de juros primeiro)',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ordem: { type: Type.INTEGER },
                    nome: { type: Type.STRING },
                    valor: { type: Type.NUMBER },
                    juros: { type: Type.NUMBER },
                    economiaJuros: { type: Type.STRING },
                  },
                  required: ['ordem', 'nome', 'valor', 'juros'],
                },
              },
              comparativo: {
                type: Type.STRING,
                description: 'Comparativo objetivo entre Bola de Neve e Avalanche para este caso',
              },
              recomendacaoEstrategica: {
                type: Type.STRING,
                description: 'Qual estratégia iniciar primeiro e porquê',
              },
              orientacaoEspiritual: {
                type: Type.STRING,
                description: 'Reflexão de sabedoria e fidelidade baseada no Método JESUS',
              },
            },
            required: [
              'bolaDeNeve',
              'avalanche',
              'comparativo',
              'recomendacaoEstrategica',
              'orientacaoEspiritual',
            ],
          },
        },
      }),
      5000
    );

    const text = response.text;
    if (text) {
      const plan = JSON.parse(text);
      return res.json({
        success: true,
        plan,
        source: 'gemini-ai',
      });
    }
  } catch (apiError: any) {
    console.warn('Gemini API indisponível temporariamente, aplicando Método JESUS:', apiError.message);
  }

  // 2. High-fidelity methodological fallback if API is experiencing temporary 503
  const rulePlan = analyzeDebtsRuleBased(debts, monthlyLiquidIncome, monthlyEssentialExpenses);

  return res.json({
    success: true,
    plan: rulePlan,
    source: 'jesus-method-engine',
  });
});

// Download do código-fonte completo em formato ZIP
app.get(['/api/download-zip', '/dinheiro-chama-dinheiro.zip'], (_req: Request, res: Response) => {
  const zipPath = path.resolve(import.meta.dirname, 'public/dinheiro-chama-dinheiro.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="dinheiro-chama-dinheiro.zip"');
    res.sendFile(zipPath);
  } else {
    res.status(404).json({ error: 'Arquivo ZIP não encontrado.' });
  }
});

// ==========================================
// Vite / Static Files Middleware
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode: Vite middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
