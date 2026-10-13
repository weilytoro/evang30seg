// Datas no fuso local do usuário, no formato YYYY-MM-DD.
// Não use toISOString() para isso: ele devolve a data em UTC e, em UTC-3 depois das 21h, já é o dia seguinte.

const pad = (n: number) => String(n).padStart(2, '0');

export const toISODateLocal = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = (): string => toISODateLocal(new Date());

export const currentMonthISO = (): string => todayISO().slice(0, 7);
