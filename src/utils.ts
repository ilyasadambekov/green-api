function pluralize(amount: number, cases: string[], show_amount: boolean = true) {
  if (amount === undefined) return '';
  if (cases.length === 1) return `${amount} ${cases[0]}`;
  const indexes = [2, 0, 1, 1, 1, 2];
  const mod100 = amount % 100;
  const mod10 = amount % 10;
  const index = mod100 > 4 && mod100 < 20 ? 2 : indexes[mod10 < 5 ? mod10 : 5];
  return `${show_amount ? amount + ' ' : ''}${cases[index]}`;
}

export { pluralize };
