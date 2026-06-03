import React from 'react'
import RZ_ICONS from './icons'
import RZ_DATA from '../data'
/* ============================================================
   HISTÓRICO — list, chip filters, detail bottom-sheet
   ============================================================ */
function Historico({ items }) {
  const I = RZ_ICONS;
  const D = RZ_DATA;
  const TYPES = D.TYPES;
  const [filter, setFilter] = React.useState('todos');
  const [open, setOpen] = React.useState(null);

  const filters = [
    { k: 'todos', label: 'Todos' },
    { k: 'ata', label: 'ATAs' },
    { k: 'financeiro', label: 'Financeiro' },
    { k: 'convocacao', label: 'Convocações' },
    { k: 'aviso', label: 'Avisos' },
  ];

  const list = items.filter(it => filter === 'todos' || it.type === filter);

  React.useEffect(() => {
    function esc(e) { if (e.key === 'Escape') setOpen(null); }
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  return (
    <div className="screen">
      <div className="main-inner">
        <div className="fade-up" style={{ animationDelay: '40ms' }}>
          <p className="eyebrow">Arquivo</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(30px,7vw,42px)', marginTop: 12 }}>
            <span className="grad-text">Histórico</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15, marginTop: 10 }}>
            {items.length} comunicados gerados pela administração.
          </p>
        </div>

        {/* filters */}
        <div className="fade-up no-bar" style={{ display: 'flex', gap: 9, overflowX: 'auto', marginTop: 22, paddingBottom: 4, animationDelay: '110ms' }}>
          {filters.map(f => (
            <button key={f.k} className={"chip " + (filter === f.k ? 'active' : '')} onClick={() => setFilter(f.k)}>
              {f.label}
            </button>
          ))}
        </div>

        {/* list */}
        {list.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 18 }}>
            {list.map((it, i) => {
              const t = TYPES[it.type];
              return (
                <div key={it.id} className="hist-item fade-up" style={{ animationDelay: `${140 + i * 55}ms` }}
                     onClick={() => setOpen(it)}>
                  <div className="type-ic" style={{ background: t.soft, border: `1px solid ${t.bd}`, color: t.color }}>
                    {React.createElement(I[t.icon])}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {it.title}
                    </p>
                    <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 4 }}>{it.date} · {it.time}</p>
                  </div>
                  <span className="pill" style={{ background: t.soft, color: t.color, border: `1px solid ${t.bd}`, flex: '0 0 auto' }}>
                    {t.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card fade-up" style={{ marginTop: 18, padding: '54px 28px', textAlign: 'center' }}>
            <div className="state-ic" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid var(--bd-2)', color: 'var(--text-3)' }}>
              {React.createElement(I.IcHistory)}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, marginTop: 18 }}>Nada por aqui ainda</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 8 }}>Nenhum comunicado deste tipo foi gerado.</p>
          </div>
        )}
      </div>

      {/* DETAIL SHEET */}
      {open && (() => {
        const t = TYPES[open.type];
        return (
          <React.Fragment>
            <div className="scrim" onClick={() => setOpen(null)} />
            <div className="sheet glass" style={{ maxWidth: 640, margin: '0 auto' }}>
              <div className="sheet-grab" />
              <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'flex-start', gap: 13 }}>
                <div className="type-ic" style={{ background: t.soft, border: `1px solid ${t.bd}`, color: t.color }}>
                  {React.createElement(I[t.icon])}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="pill" style={{ background: t.soft, color: t.color, border: `1px solid ${t.bd}`, marginBottom: 8 }}>{t.label}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, lineHeight: 1.25, letterSpacing: '-.02em' }}>{open.title}</h3>
                  <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 6 }}>{open.date} · {open.time}</p>
                </div>
                <button className="btn-ghost" style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', padding: 0 }}
                        onClick={() => setOpen(null)}>
                  {React.createElement(I.IcClose, { style: { width: 18, height: 18 } })}
                </button>
              </div>
              <div style={{ padding: '18px 24px 6px', overflowY: 'auto' }}>
                <div style={{ background: 'rgba(255,255,255,.025)', border: '1px solid var(--bd-1)', borderRadius: 16, padding: 20 }}>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text)', fontSize: 14.5, lineHeight: 1.75 }}>{open.body}</p>
                </div>
              </div>
              <div style={{ padding: '16px 24px calc(20px + env(safe-area-inset-bottom,0px))', display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setOpen(null)}>Fechar</button>
                <button className="btn btn-gold" style={{ flex: 1 }}>
                  {React.createElement(I.IcDownload, { style: { width: 18, height: 18 } })} Baixar
                </button>
              </div>
            </div>
          </React.Fragment>
        );
      })()}
    </div>
  );
}

export default Historico
