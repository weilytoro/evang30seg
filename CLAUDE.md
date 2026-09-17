# Evangelho em 30s

App estático de página única (`index.html`) para apresentar o evangelho em formato de passos rápidos, em português.

## Fluxo de desenvolvimento: Spec-Driven Development (SDD)

Toda funcionalidade nova ou mudança relevante passa por três documentos, nessa ordem, antes de qualquer código:

1. **Spec** (`specs/NNN-nome-da-feature/spec.md`) — o quê e por quê. Sem detalhes de implementação.
2. **Plan** (`specs/NNN-nome-da-feature/plan.md`) — como. Decisões técnicas, estrutura de arquivos, riscos.
3. **Tasks** (`specs/NNN-nome-da-feature/tasks.md`) — lista de tarefas pequenas e verificáveis, derivadas do plan.

Regras:

- `NNN` é sequencial e zero-padded (`001`, `002`, ...). Veja `specs/` para o próximo número livre.
- Não pule etapas: sem spec aprovada não se escreve plan; sem plan não se escreve tasks; sem tasks não se implementa.
- Cada tarefa em `tasks.md` deve ser pequena o bastante para virar um commit único.
- Ao concluir uma tarefa, marque `[x]` em `tasks.md` no mesmo commit que a implementa.
- Specs antigas não são reescritas — se o comportamento mudar, cria-se uma nova spec que referencia a anterior.

Modelos prontos em `specs/_templates/`.
