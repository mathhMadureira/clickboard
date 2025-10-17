export const fmt = (n:number|string|null|undefined) =>
  (n || n === 0)
    ? new Intl.NumberFormat('pt-BR').format(Number(n))
    : '—';

export const fmtPct = (r:number|null|undefined) =>
  (typeof r === 'number' && Number.isFinite(r))
    ? new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(r)
    : '—';
