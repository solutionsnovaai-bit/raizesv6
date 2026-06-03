import React from 'react'
import RZ_ICONS from './icons'
import RZ_DATA from '../data'
/* ============================================================
   DASHBOARD — KPIs, bar chart, donut, AI insight
   ============================================================ */
function useCountUp(target, { decimals = 0, duration = 1100, run = true } = {}) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!run) { setVal(target); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
    let raf, start;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(target * ease(p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // safety: guarantee the final value lands even if rAF is throttled/paused
    const safety = setTimeout(() => setVal(target), duration + 250);
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [target, run]);
  return decimals ? val.toFixed(decimals) : Math.round(val);
}

function KpiCard({ kpi, delay }) {
  const I = RZ_ICONS;
  const num = useCountUp(kpi.value, { decimals: kpi.decimals || 0 });
  const good = kpi.invert ? kpi.trend < 0 : kpi.trend > 0;
  return (
    <div className="kpi fade-up" style={{ animationDelay: delay + 'ms' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: 'radial-gradient(circle at 100% 0, rgba(212,168,75,.12), transparent 70%)' }} />
      <span className={"trend " + (good ? 'up' : 'down')}>
        {React.createElement(kpi.dir === 'up' ? I.IcArrowUp : I.IcArrowUp, { style: { width: 12, height: 12, transform: kpi.trend < 0 ? 'rotate(180deg)' : 'none' } })}
        {kpi.trend > 0 ? '+' : ''}{kpi.trend}{kpi.id === 'avg' || kpi.id === 'rate' ? (kpi.id === 'rate' ? 'pp' : '%') : '%'}
      </span>
      <div className="num gold-text">{num}{kpi.suffix}</div>
      <div className="lbl">{kpi.label}</div>
    </div>
  );
}

function Donut({ data }) {
  const D = RZ_DATA;
  const total = data.reduce((s, d) => s + d.v, 0);
  const R = 52, C = 2 * Math.PI * R;
  let acc = 0;
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 140, height: 140, flex: '0 0 auto' }}>
        <svg viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="15" />
          {data.map((d, i) => {
            const t = D.TYPES[d.type];
            const len = (d.v / total) * C;
            const dash = mounted ? len : 0;
            const el = (
              <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={t.color} strokeWidth="15"
                      strokeDasharray={`${dash} ${C}`} strokeDashoffset={-acc} strokeLinecap="butt"
                      style={{ transition: 'stroke-dasharray 1s var(--ease)', filter: 'drop-shadow(0 0 6px ' + t.color + '55)' }} />
            );
            acc += mounted ? len : 0;
            return el;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="gold-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-.04em' }}>{total}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '.05em' }}>TOTAL</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1, minWidth: 130 }}>
        {data.map((d, i) => {
          const t = D.TYPES[d.type];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: t.color, flex: '0 0 auto', boxShadow: `0 0 8px ${t.color}66` }} />
              <span style={{ fontSize: 13, color: 'var(--text-2)', flex: 1 }}>{t.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{d.v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.v));
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div className="bars">
      {data.map((d, i) => (
        <div key={i} className="bar-col">
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flex: 1, alignItems: 'flex-end' }}>
            <div className={"bar " + (d.hot ? 'hot' : '')}
                 style={{ height: mounted ? `${(d.v / max) * 100}%` : '0%', transitionDelay: `${i * 80}ms` }}
                 title={`${d.v} comunicados`} />
          </div>
          <span className="bar-lbl" style={{ color: d.hot ? 'var(--gold-hi)' : 'var(--text-3)' }}>{d.m}</span>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const I = RZ_ICONS;
  const D = RZ_DATA;
  return (
    <div className="screen">
      <div className="main-inner">
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <p className="eyebrow">Visão geral</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(30px,7vw,42px)', marginTop: 12 }}>
            <span className="grad-text">Dashboard</span>
          </h1>
        </div>

        {/* KPIs */}
        <div className="kpi-grid">
          {D.KPIS.map((k, i) => <KpiCard key={k.id} kpi={k} delay={60 + i * 70} />)}
        </div>

        {/* charts */}
        <div className="dash-2col" style={{ marginTop: 16 }}>
          <div className="card fade-up" style={{ padding: 22, animationDelay: '180ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-.02em' }}>Comunicados por mês</p>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>2026</span>
            </div>
            <BarChart data={D.MONTHLY} />
          </div>
          <div className="card fade-up" style={{ padding: 22, animationDelay: '240ms' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-.02em', marginBottom: 18 }}>Por tipo de documento</p>
            <Donut data={D.BYTYPE} />
          </div>
        </div>

        {/* insight */}
        <div className="insight fade-up" style={{ marginTop: 16, animationDelay: '300ms', display: 'flex', gap: 15 }}>
          <div className="type-ic" style={{ background: 'rgba(212,168,75,.16)', border: '1px solid rgba(212,168,75,.34)', color: 'var(--gold-hi)', flex: '0 0 auto' }}>
            {React.createElement(I.IcSpark)}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, letterSpacing: '-.01em' }}>
              <span className="gold-text">✨ Insight da IA</span>
            </p>
            <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 7, lineHeight: 1.65 }}>
              Junho concentra <b style={{ color: 'var(--text)' }}>convocações e financeiro</b> por causa da Assembleia Ordinária. O tempo médio de geração caiu <b style={{ color: 'var(--green-light)' }}>15%</b> no mês — considere antecipar o comunicado de prestação de contas para reduzir o pico do dia 15.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard
