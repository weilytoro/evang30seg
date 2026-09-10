# Quiz — Mentalidade Financeira

Quiz (nome, e-mail, telefone + 9 perguntas de múltipla escolha) que diagnostica o nível de
mentalidade financeira de quem responde e grava a resposta imediatamente
como uma nova linha numa planilha Google, via Google Apps Script — sem
precisar de servidor ou banco de dados próprios. As perguntas e os 5
resultados (Bloqueada, Estagnada, Em Transição, Em Construção, Evoluída)
são baseados no texto real do capítulo 1 do livro *Dinheiro Chama Dinheiro?
Só se você mudar sua mentalidade* (Weily Toro Machado) — 8 perguntas da
seção 1.1 e 1 pergunta bônus sobre mentalidade de abundância x escassez
(seções 1.1/1.2). Tema visual: branco e dourado.

## Estrutura

```
quiz/
  index.html              → o quiz (frontend, sem build step)
  apps-script/Code.gs      → Web App que grava cada resposta na planilha
```

## Configurar a planilha (uma vez)

1. Crie uma nova planilha Google (ex: "Respostas — Mentalidade Financeira").
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o código padrão (`function myFunction() {}`) e cole o conteúdo de
   `quiz/apps-script/Code.gs`.
4. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**.
   - Executar como: **Eu** (sua conta).
   - Quem tem acesso: **Qualquer pessoa** (necessário para o quiz salvar
     sem exigir login de quem responde).
5. Autorize as permissões pedidas e copie a **URL do app da Web** (termina
   em `/exec`).
6. Em `quiz/index.html`, troque `COLE_AQUI_A_URL_DO_APPS_SCRIPT` (dentro de
   `const SAVE_URL = ...`) por essa URL.
7. Publique/suba o `quiz/index.html`. Cada resposta enviada cria
   automaticamente uma aba "Respostas" na planilha com data/hora, nome,
   e-mail, telefone, perfil, a descrição completa do resultado e o
   detalhe de cada resposta.

Se você editar `Code.gs` depois (inclusive ao atualizar para uma versão
mais nova deste repositório), é preciso ir em **Implantar → Gerenciar
implantações → editar (ícone de lápis) → Nova versão** para as mudanças
valerem na URL já publicada — só colar o código novo e salvar não é
suficiente.

## Editar perguntas ou resultados

O array `QUESTIONS` e o objeto `PERFIS` estão no topo do `<script>` de
`quiz/index.html`. Cada opção de resposta tem um `trait` (`nivel1` a
`nivel5`); ao final, o nível com mais ocorrências entre as respostas é o
exibido.

## Segurança

- A planilha só é gravada via `doPost`, que valida nome, perfil e formato
  das respostas antes de gravar.
- `LockService` evita gravações concorrentes corromperem a planilha quando
  várias pessoas respondem ao mesmo tempo.
- A URL do Web App não é secreta por natureza (fica visível no código-fonte
  do `index.html`), mas só aceita `POST` para gravar uma resposta — não dá
  acesso de leitura à planilha.
