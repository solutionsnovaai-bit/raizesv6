/* ============================================================
   APP — shell, header, nav, routing, mount
   ============================================================ */
import React from 'react'
import RZ_ICONS from './icons'
import RZ_DATA from '../data'
import Login, { LogoMark } from './login'
import Comunicados from './screen-comunicados'
import Historico from './screen-historico'
import IAChat from './screen-ia'
import Dashboard from './screen-dashboard'
import '../styles/styles.css'

function App() {
  const I = RZ_ICONS;
  const D = RZ_DATA;
  // dev/preview boot hook (harmless in production; only active when localStorage key is set)
  const boot = (() => { try { return JSON.parse(localStorage.getItem('rz_boot') || 'null'); } catch (e) { return null; } })();
  const validTabs = ['comunicados', 'historico', 'ia', 'dashboard'];
  const [authed, setAuthed] = React.useState(!!(boot && boot.authed));
  const [tab, setTab] = React.useState(boot && validTabs.includes(boot.tab) ? boot.tab : 'comunicados');
  const [history, setHistory] = React.useState(D.HISTORY);
  const [headerIn, setHeaderIn] = React.useState(!!(boot && boot.authed));

  React.useEffect(() => {
    if (boot && boot.cap) {
      const s = document.createElement('style');
      s.textContent = '.rv,.fade-up,.logo-assemble,.screen,.screen *{opacity:1!important;transform:none!important;filter:none!important;animation:none!important}';
      document.head.appendChild(s);
    }
  }, []);

  React.useEffect(() => {
    if (authed) { const t = setTimeout(() => setHeaderIn(true), 60); return () => clearTimeout(t); }
  }, [authed]);

  const TABS = [
    { k: 'comunicados', label: 'Comunicados', icon: 'IcUpload' },
    { k: 'historico',   label: 'Histórico',   icon: 'IcHistory' },
    { k: 'ia',          label: 'IA',          icon: 'IcSpark' },
    { k: 'dashboard',   label: 'Dashboard',   icon: 'IcChart' },
  ];

  function onGenerated(type, name) {
    const t = D.TYPES[type];
    const now = new Date();
    const titleMap = {
      ata: 'ATA — Documento processado',
      financeiro: 'Comunicado financeiro gerado',
      convocacao: 'Convocação gerada',
      aviso: 'Aviso aos condôminos',
    };
    const item = {
      id: Date.now(), type, title: titleMap[type] || 'Comunicado gerado',
      date: now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      body: 'Comunicado gerado automaticamente pela IA a partir do documento "' + (name || 'documento') + '". Revise o conteúdo, ajuste se necessário e publique para os condôminos do Raízes Vila Matilde.',
    };
    setHistory(h => [item, ...h]);
  }

  if (!authed) return <Login onEnter={() => setAuthed(true)} />;

  return (
    <div className="shell">
      {/* atmosphere */}
      <div className="atmosphere">
        <div className="mesh" />
        <div className="orbs">
          <div className="orb o1" /><div className="orb o2" /><div className="orb o3" /><div className="orb o4" />
        </div>
      </div>

      {/* desktop brand in rail */}
      <div className="nav-brand" style={{ position: 'fixed', zIndex: 51 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -8, background: 'radial-gradient(circle, rgba(212,168,75,.3), transparent 70%)', filter: 'blur(6px)' }} />
          <div style={{ position: 'relative', transform: 'scale(.62)', transformOrigin: 'left center' }}>
            {React.createElement(LogoMark, { size: 1 })}
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="header glass" style={{ transform: headerIn ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform .7s var(--ease)' }}>
        <div className="header-logo">
          <div className="glow" />
          <div style={{ position: 'relative', transform: 'scale(.56)', transformOrigin: 'left center' }}>
            {React.createElement(LogoMark, { size: 1 })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="user-pill">
            <div className="avatar">SR</div>
            <div style={{ lineHeight: 1.15 }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>Síndico</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Raízes</p>
            </div>
          </div>
          <button className="btn-ghost" title="Sair" onClick={() => { setHeaderIn(false); setTimeout(() => { setAuthed(false); setTab('comunicados'); }, 300); }}
                  style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', padding: 0 }}>
            {React.createElement(I.IcLogout, { style: { width: 18, height: 18 } })}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        {tab === 'comunicados' && <Comunicados key="c" onGenerated={onGenerated} />}
        {tab === 'historico'   && <Historico key="h" items={history} />}
        {tab === 'ia'          && <IAChat key="i" />}
        {tab === 'dashboard'   && <Dashboard key="d" />}
      </main>

      {/* NAV */}
      <nav className="nav glass">
        {TABS.map(t => (
          <button key={t.k} className={"nav-item " + (tab === t.k ? 'active' : '')} onClick={() => setTab(t.k)}>
            <span className="ind" />
            {React.createElement(I[t.icon])}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App
