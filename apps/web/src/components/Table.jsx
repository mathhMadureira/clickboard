export default function Table({ columns = [], rows = [], loading = false, error = '', emptyText = 'Sem dados' }) {
  if (loading) return <div className="state">Carregando…</div>;
  if (error)   return <div className="state">Erro: {String(error)}</div>;
  if (!rows || rows.length === 0) return <div className="state">{emptyText}</div>;

  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key || c.header}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}>
              {columns.map(c => (
                <td key={c.key || c.header}>
                  {typeof c.render === 'function' ? c.render(r[c.key], r) : (r[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
