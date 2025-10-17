export default function Sparkline({points=[]}) {
  if (!points.length) return <div className="spark"/>;
  const w=260,h=36,p=2;
  const xs = points.map((_,i)=> i*(w/(points.length-1)));
  const min = Math.min(...points), max = Math.max(...points);
  const ys = points.map(v => h - ((v-min)/(max-min||1))*h);
  const d = xs.map((x,i)=> `${i?'L':'M'}${Math.round(x+p)},${Math.round(ys[i]+p)}`).join(' ');
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w+p*2} ${h+p*2}`}>
      <path d={d} fill="none" stroke="url(#g)" strokeWidth="2"/>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
