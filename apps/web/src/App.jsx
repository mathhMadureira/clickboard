import React, { useMemo, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let _token = null;
async function loginDev() {
  if (_token) return _token;
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dev@example.com', password: 'dev123456' }),
  });
  if (!res.ok) throw new Error('Falha no login dev');
  const data = await res.json();
  _token = data.access_token;
  return _token;
}

async function apiFetch(path, init = {}) {
  const token = await loginDev();
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API}${path}`, { ...init, headers });
  if (!res.ok) {
    const txt = await res.text().catch(()=> '');
    throw new Error(`${res.status} ${res.statusText} ${txt}`.trim());
  }
  return res.json();
}

function toISODate(d = new Date()) {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return tz.toISOString().slice(0, 10);
}

const fmt = (n)=> (n||n===0) ? new Intl.NumberFormat('pt-BR').format(Number(n)) : '—';
const fmtPct = (r)=> (typeof r==='number' && isFinite(r))
  ? `${r.toFixed(1).replace('.', ',')}%`
  : '—';

function Kpi({ label, value }) {
  return (
    <div style={{
      padding: 12, border:'1px solid #e5e7eb', borderRadius:12,
      background:'#f9fafb', color:'#111827'
    }}>
      <div style={{fontSize:12, color:'#6b7280'}}>{label}</div>
      <div style={{fontSize:20, fontWeight:700}}>{value}</div>
    </div>
  );
}

/** ErrorBoundary para mostrar qualquer erro de runtime na própria página */
class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = {hasError:false, error:null}; }
  static getDerivedStateFromError(error){ return {hasError:true, error}; }
  componentDidCatch(error, info){ console.error('💥 ErrorBoundary', error, info); }
  render(){
    if(this.state.hasError){
      return (
        <div style={{padding:24, fontFamily:'system-ui', color:'#111827'}}>
          <h1>⚠️ Ocorreu um erro no App</h1>
          <pre style={preBox}>{String(this.state.error?.stack || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [date, setDate] = useState(toISODate());
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  async function carregarResumo() {
    try {
      setError('');
      setLoading(true);
      const qs = new URLSearchParams({ date });
      if (accountId) qs.set('accountId', accountId);
      const data = await apiFetch(`/dashboard/summary?${qs.toString()}`);
      setSummary(data);
    } catch (e) {
      console.error(e);
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // ROI em %, usa (lucro / gastosAds) * 100
  const roi = useMemo(() => {
    if (!summary) return null;
    const g = Number(summary.gastosAds || 0);
    const l = Number(summary.lucro || 0);
    return g > 0 ? (l / g) * 100 : null;
  }, [summary]);

  // ROAS em “x”, usa (faturamento / gastosAds)
  const roas = useMemo(() => {
    if (!summary) return null;
    const g = Number(summary.gastosAds || 0);
    const f = Number(summary.faturamento || 0);
    return g > 0 ? (f / g) : null;
  }, [summary]);

  return (
    <ErrorBoundary>
      <div style={{padding:24, fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', color:'#111827'}}>
        <h1 style={{marginTop:0}}>ClickBoard • Painel Dev</h1>

        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:12}}>
          <input
            style={inp}
            placeholder="accountId (ex.: acct-demo)"
            value={accountId}
            onChange={e=>setAccountId(e.target.value)}
          />
          <input
            style={inp}
            type="date"
            value={date}
            onChange={e=>setDate(e.target.value)}
          />
          <button style={btn} onClick={carregarResumo} disabled={loading}>
            {loading ? 'Carregando…' : 'Carregar resumo'}
          </button>
        </div>

        {error && <div style={errBox}>⚠️ {error}</div>}

        {summary ? (
          <>
            <div style={{display:'grid', gridTemplateColumns:'repeat(8, minmax(160px,1fr))', gap:12}}>
              <Kpi label="Período"      value={summary.period || date} />
              <Kpi label="Faturamento"  value={fmt(summary.faturamento)} />
              <Kpi label="Gastos Ads"   value={fmt(summary.gastosAds)} />
              <Kpi label="Despesas"     value={fmt(summary.despesas)} />
              <Kpi label="Lucro"        value={fmt(summary.lucro)} />
              <Kpi label="ROI"          value={roi == null ? '—' : fmtPct(roi)} />
              <Kpi label="ROAS"         value={roas == null ? '—' : `${roas.toFixed(2).replace('.', ',')}x`} />
              <Kpi label="Pend./Reemb." value={`${fmt(summary.pendentes)} / ${fmt(summary.reembolsadas)}`} />
            </div>

            <pre style={preBox}>{JSON.stringify(summary, null, 2)}</pre>
          </>
        ) : (
          <div style={{opacity:.6}}>Clique em “Carregar resumo”.</div>
        )}
      </div>
    </ErrorBoundary>
  );
}

const inp = {
  padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:10, outline:'none'
};
const btn = {
  padding:'10px 14px', border:'1px solid #3b82f6', background:'#3b82f6', color:'#fff',
  borderRadius:10, cursor:'pointer'
};
const errBox = {
  background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b',
  padding:'10px 12px', borderRadius:10, marginBottom:12
};
const preBox = {
  marginTop:12, background:'#0b1220', color:'#e5e7eb', padding:12, borderRadius:10,
  overflow:'auto'
};
