import React from 'react'
import RZ_ICONS from './icons'
import RZ_DATA from '../data'
/* ============================================================
   IA — assistente jurídico condominial (scripted streaming)
   ============================================================ */
function IAChat() {
  const I = RZ_ICONS;
  const D = RZ_DATA;
  const [msgs, setMsgs] = React.useState([
    { who: 'ai', text: 'Olá, Síndico! Sou o assistente jurídico do Raízes Vila Matilde. Posso ajudar com dúvidas sobre convenção, inadimplência, assembleias, multas e legislação condominial. Como posso ajudar?' },
  ]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [streamId, setStreamId] = React.useState(null);
  const streamRef = React.useRef('');
  const scrollRef = React.useRef(null);
  const taRef = React.useRef(null);
  const reduce = React.useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing, streamId]);

  function grow() {
    const ta = taRef.current; if (!ta) return;
    ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  // monta histórico no formato do proxy /api/chat (role: user | assistant)
  function buildHistory(list) {
    return list.map(m => ({
      role: m.who === 'me' ? 'user' : 'assistant',
      content: m.text,
    }));
  }

  async function send(textArg) {
    const text = (textArg != null ? textArg : input).trim();
    if (!text || typing || streamId) return;

    // histórico ANTES de adicionar a nova msg (contexto)
    const history = [...buildHistory(msgs), { role: 'user', content: text }];

    setMsgs(m => [...m, { who: 'me', text }]);
    setInput(''); if (taRef.current) taRef.current.style.height = 'auto';
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error('chat ' + res.status);

      // começa a bolha de streaming
      const id = Date.now();
      streamRef.current = '';
      setTyping(false);
      setMsgs(m => [...m, { who: 'ai', text: '', streaming: true, id }]);
      setStreamId(id);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamRef.current += decoder.decode(value, { stream: true });
        const cur = streamRef.current;
        setMsgs(m => m.map(x => x.id === id ? { ...x, text: cur } : x));
      }
      setMsgs(m => m.map(x => x.id === id ? { ...x, text: streamRef.current || '…', streaming: false } : x));
      setStreamId(null);
    } catch (err) {
      setTyping(false);
      setStreamId(null);
      setMsgs(m => [...m, { who: 'ai', text: 'Não foi possível conectar ao assistente agora. Tente novamente em instantes.' }]);
    }
  }

  // render bold **text**
  function fmt(t) {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--gold-hi)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>);
  }

  const ChatMain = (
    <div className="chat-wrap" style={{ minWidth: 0 }}>
      {/* assistant header */}
      <div className="card lume-border fade-up" style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="msg-av ai" style={{ width: 42, height: 42, borderRadius: 13 }}>{React.createElement(I.IcScale, { style: { width: 22, height: 22 } })}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-.02em' }}>Assistente Jurídico</p>
            <span className="pill" style={{ background: 'rgba(212,168,75,.14)', color: 'var(--gold-hi)', border: '1px solid rgba(212,168,75,.3)', padding: '2px 8px', fontSize: 10 }}>IA</span>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green-light)', fontSize: 12.5, marginTop: 3, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green-light)', boxShadow: '0 0 8px 1px rgba(111,168,112,.8)' }} /> Online
          </p>
        </div>
      </div>

      {/* stream */}
      <div ref={scrollRef} className="chat-stream" style={{ maxHeight: 'min(52vh, 460px)', overflowY: 'auto', paddingRight: 4 }}>
        {msgs.map((m, i) => (
          <div key={i} className={"msg " + (m.who === 'ai' ? 'ai' : 'me')}>
            {m.who === 'ai' && <div className="msg-av ai">{React.createElement(I.IcScale, { style: { width: 18, height: 18 } })}</div>}
            <div className={"bubble " + (m.who === 'ai' ? 'ai' : 'me')} style={{ whiteSpace: 'pre-wrap' }}>
              {fmt(m.text)}
              {m.streaming && <span className="stream-cursor" />}
            </div>
          </div>
        ))}
        {typing && (
          <div className="msg ai">
            <div className="msg-av ai">{React.createElement(I.IcScale, { style: { width: 18, height: 18 } })}</div>
            <div className="bubble ai"><span className="typing"><i /><i /><i /></span></div>
          </div>
        )}
      </div>

      {/* suggestions */}
      <div className="suggest-row">
        {D.SUGGESTIONS.map((s, i) => (
          <button key={i} className="chip" style={{ flex: '0 0 auto' }} onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      {/* input */}
      <div className="chat-input">
        <textarea ref={taRef} rows={1} value={input} placeholder="Pergunte sobre legislação condominial…"
                  onChange={e => { setInput(e.target.value); grow(); }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="send-btn" disabled={!input.trim() || typing || !!streamId} onClick={() => send()}>
          {React.createElement(I.IcSend, { style: { width: 19, height: 19 } })}
        </button>
      </div>
    </div>
  );

  const Sidebar = (
    <div className="chat-side" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="card fade-up" style={{ padding: 18 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          {React.createElement(I.IcBolt, { style: { width: 17, height: 17, color: 'var(--gold-hi)' } })} Perguntas rápidas
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {D.SUGGESTIONS.slice(0, 4).map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ textAlign: 'left', fontSize: 13.5, color: 'var(--text-2)', padding: '9px 12px', borderRadius: 11, border: '1px solid var(--bd-1)', background: 'rgba(255,255,255,.02)', transition: 'all .35s var(--ease)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--bd-3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--bd-1)'; }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="card fade-up" style={{ padding: 18, animationDelay: '80ms' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          {React.createElement(I.IcScale, { style: { width: 17, height: 17, color: 'var(--ice-hi)' } })} Base legal
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {D.LEGAL.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ice)', marginTop: 6, flex: '0 0 auto', boxShadow: '0 0 6px rgba(122,170,200,.6)' }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ice-hi)' }}>{l.code}</p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, lineHeight: 1.45 }}>{l.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="main-inner">
        <div className="fade-up" style={{ marginBottom: 18 }}>
          <p className="eyebrow">Consultoria</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(30px,7vw,42px)', marginTop: 12 }}>
            <span className="grad-text">Assistente IA</span>
          </h1>
        </div>
        <div className="chat-2col">
          {ChatMain}
          {Sidebar}
        </div>
      </div>
    </div>
  );
}

export default IAChat
