export default function Pills({options=[], value, onChange}) {
  return (
    <div className="pills">
      {options.map(o=>(
        <button
          key={o.value}
          className={`pill ${value===o.value?'active':''}`}
          onClick={()=>onChange?.(o.value)}
          type="button"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
