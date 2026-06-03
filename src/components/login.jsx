/* ============================================================
   LOGIN — cinematic reveal entrance
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react'

function LogoMark({ size = 1, light = true }) {
  // recreated Raízes wordmark
  const pad = 22 * size, wf = 46 * size, sf = 11 * size;
  return (
    <div className="logo-mark" style={{ padding: `${18*size}px ${pad}px ${15*size}px` }}>
      <span className="word" style={{ fontSize: wf }}>raízes</span>
      <span className="sub" style={{ fontSize: sf, marginTop: 6*size }}>
        VILA<b>MATILDE</b>
      </span>
    </div>
  );
}

function Login({ onEnter }) {
  const [user, setUser] = useState('sindico@raizes.com.br');
  const [pass, setPass] = useState('••••••••');
  const [leaving, setLeaving] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduce = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // parallax on mouse (desktop)
  function onMove(e) {
    if (reduce.current) return;
    const x = (e.clientX / window.innerWidth - .5);
    const y = (e.clientY / window.innerHeight - .5);
    setTilt({ x, y });
  }

  function submit(e) {
    e.preventDefault();
    setLeaving(true);
    setTimeout(onEnter, 620);
  }

  // CSS-driven staggered reveal: each piece animates in on load with a delay
  const rv = () => 'rv go';
  const delay = (ms) => ({ animationDelay: `${ms}ms` });

  return (
    <div className="login" onMouseMove={onMove}
         style={{ transition: 'opacity .6s var(--ease), transform .6s var(--ease)',
                  opacity: leaving ? 0 : 1, transform: leaving ? 'scale(1.04)' : 'scale(1)' }}>
      {/* depth atmosphere local to login (brighter than app) */}
      <div className="atmosphere" style={{ zIndex: 0 }}>
        <div className="mesh" style={{ transform: `translate(${tilt.x * -18}px, ${tilt.y * -18}px) scale(1.05)` }} />
        <div className="orbs" style={{ transform: `translate(${tilt.x * 26}px, ${tilt.y * 26}px)` }}>
          <div className="orb o1" /><div className="orb o2" /><div className="orb o3" /><div className="orb o4" />
        </div>
      </div>

      <div className="login-card" style={{ transform: `translate(${tilt.x * 10}px, ${tilt.y * 10}px)` }}>
        {/* logo assembles */}
        <div className="login-logo-wrap logo-assemble" style={delay(120)}>
          <div className="halo" />
          <div style={{ position: 'relative' }}>
            <LogoMark size={1.05} />
          </div>
        </div>

        <div className={rv()} style={delay(440)}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>Portal do Síndico</p>
        </div>
        <h1 className={"page-title " + rv()} style={{ fontSize: 30, marginBottom: 8, ...delay(540) }}>
          <span className="grad-text">Bem-vindo de volta</span>
        </h1>
        <p className={rv()} style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 30, ...delay(620) }}>
          Acesse a gestão do condomínio Raízes Vila Matilde.
        </p>

        <form onSubmit={submit}>
          <div className={"field " + rv()} style={delay(720)}>
            <label>E-mail</label>
            <input className="inp" type="text" value={user} onChange={e => setUser(e.target.value)} autoComplete="off" />
          </div>
          <div className={"field " + rv()} style={delay(820)}>
            <label>Senha</label>
            <input className="inp" type="password" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <div className={rv()} style={{ marginTop: 22, ...delay(920) }}>
            <button type="submit" className="btn btn-green" style={{ width: '100%', padding: '16px' }}>
              <span className="shine" />
              Entrar no portal
            </button>
          </div>
        </form>

        <p className={rv()} style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 22, lineHeight: 1.6, ...delay(1040) }}>
          Ambiente demonstrativo · qualquer credencial acessa
        </p>
      </div>
    </div>
  );
}

export { LogoMark }
export default Login
