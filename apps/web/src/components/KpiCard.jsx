export default function KpiCard({ label, value, sub }) {
  return (
    <div className="card kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub ? <div className="sub">{sub}</div> : null}
    </div>
  );
}
