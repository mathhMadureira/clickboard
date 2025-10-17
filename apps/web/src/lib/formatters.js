export const fmt = (n) =>
  (n || n === 0)
    ? new Intl.NumberFormat('pt-BR').format(Number(n))
    : '—';

export const fmtCurrency = (n) =>
  (n || n === 0)
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n))
    : '—';

export const fmtPct = (r) =>
  (typeof r === 'number' && Number.isFinite(r))
    ? new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(r)
    : '—';

export const toISODate = (d) => {
  const dt = (d instanceof Date) ? d : new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const dd = String(dt.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
};
