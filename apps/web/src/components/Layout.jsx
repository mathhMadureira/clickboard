export default function Layout({children, logged, section='dashboard', onSectionChange}){
  return (
    <div className="app">
      <aside className="aside">
        <div className="brand"><span className="dot"/>&nbsp;ClickBoard</div>
        <nav className="menu">
          <div className={`m ${section==='dashboard'?'active':''}`} onClick={()=>onSectionChange?.('dashboard')}>📊 Dashboard</div>
          <div className={`m ${section==='orders'?'active':''}`} onClick={()=>onSectionChange?.('orders')}>🧾 Pedidos</div>
          <div className={`m ${section==='spend'?'active':''}`} onClick={()=>onSectionChange?.('spend')}>💸 Ads / Gastos</div>
          <div className={`m ${section==='settings'?'active':''}`} onClick={()=>onSectionChange?.('settings')}>⚙️ Configurações</div>
        </nav>
      </aside>
      <main className="main">
        <div className="heading">Dashboard (dev) {logged ? <span style={{fontSize:12,color:'var(--muted)'}}>• Logado</span> : null}</div>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
