export const fmt = (n:number|string|null|undefined) =>
  (n || n === 0)
    ? new Intl.NumberFormat('pt-BR').format(Number(n))
    : "—";

export const fmtPct = (r:number|null|undefined) =>
  Number.isFinite(r as number)
    ? new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(r as number)
    : "—";

export const roasRatio = (faturamento:number, gastosAds:number) =>
  gastosAds > 0 ? (faturamento / gastosAds) : null;
