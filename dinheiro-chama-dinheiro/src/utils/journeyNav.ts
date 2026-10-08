export function getEntryModuleFromKeyChapter(chapter?: number | null): number {
  if (typeof chapter === 'number' && chapter >= 2 && chapter <= 6) {
    return chapter;
  }
  return 1;
}

export function pickNextModule(
  completedModules: number[] = [],
  entryModule: number = 1
): number | null {
  const isCompleted = (id: number) => completedModules.includes(id);

  // 1. se o Módulo 0 não estiver concluído, o próximo é ele;
  if (!isCompleted(0)) {
    return 0;
  }

  // 2. senão, se o módulo de entrada indicado pelo teste não estiver concluído e não for o 6, vá para ele;
  if (entryModule !== 6 && !isCompleted(entryModule)) {
    return entryModule;
  }

  // 3. senão, vá para o primeiro módulo pendente na ordem (1 a 6);
  for (let mod = 1; mod <= 6; mod++) {
    if (!isCompleted(mod)) {
      return mod;
    }
  }

  // 4. se não houver pendente, retorne null (Trilha 1 concluída).
  return null;
}
