/* ============================================================
   COMUNICADO POR VOZ — captura de voz nativa do navegador
   (Web Speech API · pt-BR · auto-restart anti-corte)
   Substitui o antigo upload de arquivos. Envia SÓ o texto
   transcrito para /api/send (mesmo fluxo Make + Gmail).
   ============================================================ */
import React, { useState, useRef, useEffect } from 'react'
import RZ_ICONS from './icons'

// CSS auto-contido desta tela (não precisa mexer no styles.css)
const VOICE_CSS = `
.voice-stage{display:flex;flex-direction:column;align-items:center;text-align:center;padding:34px 22px 30px}
.mic-btn{position:relative;width:128px;height:128px;border-radius:50%;border:1px solid rgba(111,168,112,.42);
  background:radial-gradient(circle at 50% 34%,rgba(111,168,112,.22),rgba(111,168,112,.05));
  color:var(--green-light);cursor:pointer;display:grid;place-items:center;
  transition:transform .4s var(--ease),box-shadow .4s var(--ease),border-color .4s,color .4s;
  box-shadow:0 10px 34px rgba(111,168,112,.18)}
.mic-btn:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 16px 44px rgba(111,168,112,.3)}
.mic-btn:active{transform:scale(.97)}
.mic-btn svg{width:46px;height:46px}
.mic-btn.rec{border-color:rgba(224,100,92,.62);color:#E0645C;
  background:radial-gradient(circle at 50% 34%,rgba(224,100,92,.26),rgba(224,100,92,.06));
  animation:micPulse 1.9s var(--ease) infinite}
@keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(224,100,92,.4),0 10px 34px rgba(224,100,92,.24)}
  50%{box-shadow:0 0 0 20px rgba(224,100,92,0),0 10px 34px rgba(224,100,92,.24)}}
.mic-wave{position:absolute;inset:-1px;border-radius:50%;border:1px solid rgba(224,100,92,.45);
  animation:micWave 1.9s var(--ease) infinite;pointer-events:none}
@keyframes micWave{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.65);opacity:0}}
.rec-tag{display:inline-flex;align-items:center;gap:9px;margin-top:22px;font-weight:700;
  font-size:14.5px;color:#E0645C;letter-spacing:.01em}
.live-dot{width:9px;height:9px;border-radius:50%;background:#E0645C;
  box-shadow:0 0 10px 2px rgba(224,100,92,.7);animation:liveBlink 1.2s ease-in-out infinite}
@keyframes liveBlink{0%,100%{opacity:1}50%{opacity:.28}}
.voice-ta{width:100%;background:rgba(255,255,255,.025);border:1px solid var(--bd-1);
  border-radius:16px;padding:18px 18px;color:var(--text);font-size:16px;line-height:1.75;
  font-family:inherit;resize:vertical;min-height:128px;outline:none;transition:border-color .3s}
.voice-ta:focus{border-color:var(--bd-3)}
.voice-ta::placeholder{color:var(--text-3)}
.live-text{width:100%;min-height:120px;background:rgba(255,255,255,.025);
  border:1px solid var(--bd-1);border-radius:16px;padding:18px;text-align:left;
  font-size:16px;line-height:1.75;color:var(--text)}
.live-text .interim{color:var(--text-3)}
`

function Comunicados({ onGenerated }) {
  const I = RZ_ICONS
  // idle | recording | review | sending | success | error
  const [state, setState] = useState('idle')
  const [text, setText] = useState('')      // texto final + interim, mostrado ao vivo
  const [supported, setSupported] = useState(true)
  const [errMsg, setErrMsg] = useState('')

  const recRef = useRef(null)
  const recordingRef = useRef(false)        // flag mestra do auto-restart
  const finalRef = useRef('')               // só o que já foi finalizado
  const restartTimer = useRef(null)

  // detecta suporte + limpa ao desmontar
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setSupported(false)
    return () => stopEverything()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function buildRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'pt-BR'
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalRef.current += t + ' '
        else interim += t
      }
      const full = (finalRef.current + interim).replace(/\s{2,}/g, ' ').trimStart()
      setText(full)
    }

    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        recordingRef.current = false
        setErrMsg('O microfone está bloqueado. Toque no cadeado 🔒 ao lado do endereço do site, libere o microfone e tente de novo.')
        setState('error')
      } else if (e.error === 'audio-capture') {
        recordingRef.current = false
        setErrMsg('Nenhum microfone foi encontrado. Conecte ou ative um microfone e tente de novo.')
        setState('error')
      }
      // no-speech / network / aborted → não faz nada: o onend reinicia sozinho
    }

    // CHAVE DO ANTI-CORTE: o Chrome encerra sozinho após silêncio/~60s.
    // Se ainda devíamos estar gravando, reiniciamos.
    rec.onend = () => {
      if (recordingRef.current) {
        clearTimeout(restartTimer.current)
        restartTimer.current = setTimeout(() => {
          try { rec.start() } catch (_) { /* já reiniciou */ }
        }, 220)
      }
    }

    return rec
  }

  function startRecording() {
    if (!supported) return
    finalRef.current = text.trim() ? text.trim() + ' ' : ''  // permite "gravar mais"
    setErrMsg('')
    const rec = buildRecognition()
    recRef.current = rec
    recordingRef.current = true
    try {
      rec.start()
      setState('recording')
    } catch (_) {
      try { rec.stop() } catch (_) {}
    }
  }

  function stopRecording() {
    recordingRef.current = false
    clearTimeout(restartTimer.current)
    try { recRef.current && recRef.current.stop() } catch (_) {}
    setState(text.trim() ? 'review' : 'idle')
  }

  function stopEverything() {
    recordingRef.current = false
    clearTimeout(restartTimer.current)
    try { recRef.current && recRef.current.abort() } catch (_) {}
  }

  async function generate() {
    const texto = text.trim()
    if (!texto) return
    setState('sending')
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      })
      if (!res.ok) throw new Error('send ' + res.status)
      setTimeout(() => {
        setState('success')
        onGenerated && onGenerated('aviso', texto)
      }, 1400)
    } catch (_) {
      setErrMsg('Não foi possível enviar agora. Verifique sua internet e tente de novo — seu texto não foi perdido.')
      setState('error')
    }
  }

  function reset() {
    stopEverything()
    setText('')
    finalRef.current = ''
    setErrMsg('')
    setState('idle')
  }

  return (
    <div className="screen">
      <style>{VOICE_CSS}</style>
      <div className="main-inner">

        {/* CABEÇALHO */}
        <div className="fade-up" style={{ animationDelay: '40ms' }}>
          <p className="eyebrow">Comunicado por voz</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(32px,8vw,46px)', marginTop: 12 }}>
            <span className="grad-text">Crie um comunicado por voz</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 16, marginTop: 12, maxWidth: 460, lineHeight: 1.6 }}>
            Toque no microfone e fale naturalmente o que precisa avisar.
            A IA transforma sua fala em um comunicado pronto para os moradores.
          </p>
        </div>

        {/* NAVEGADOR SEM SUPORTE → digitação manual */}
        {!supported && state !== 'success' && (
          <div className="fade-up card lume-border" style={{ marginTop: 22, padding: 24, animationDelay: '120ms' }}>
            <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start', marginBottom: 16 }}>
              <div className="type-ic" style={{ background: 'rgba(212,168,75,.12)', border: '1px solid rgba(212,168,75,.3)', color: 'var(--gold-hi)', flex: '0 0 auto' }}>
                <I.IcAlert />
              </div>
              <p style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.6 }}>
                Este navegador não reconhece voz. Para gravar, use o <b style={{ color: 'var(--text)' }}>Google Chrome</b> ou o <b style={{ color: 'var(--text)' }}>Microsoft Edge</b>.
                Se preferir, digite o comunicado abaixo:
              </p>
            </div>
            <textarea className="voice-ta" value={text} onChange={e => setText(e.target.value)}
                      placeholder="Digite aqui o que precisa comunicar aos moradores…" />
            <button className="btn btn-green" style={{ width: '100%', padding: 16, marginTop: 14 }}
                    disabled={!text.trim()} onClick={generate}>
              <span className="shine" /> Gerar comunicado
            </button>
          </div>
        )}

        {/* IDLE — botão de microfone herói */}
        {supported && state === 'idle' && (
          <div className="fade-up card lume-border" style={{ marginTop: 22, animationDelay: '160ms' }}>
            <div className="voice-stage">
              <button className="mic-btn" onClick={startRecording} aria-label="Iniciar gravação">
                <I.IcMic />
              </button>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-.02em', marginTop: 26 }}>
                Toque para falar
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14.5, marginTop: 8, maxWidth: 320, lineHeight: 1.6 }}>
                Exemplo: “Amanhã haverá manutenção dos elevadores entre oito e meio-dia.”
              </p>
            </div>
          </div>
        )}

        {/* RECORDING — gravando ao vivo */}
        {supported && state === 'recording' && (
          <div className="fade-up" style={{ marginTop: 22 }}>
            <div className="card lume-border">
              <div className="voice-stage" style={{ paddingBottom: 22 }}>
                <button className="mic-btn rec" onClick={stopRecording} aria-label="Parar gravação">
                  <span className="mic-wave" />
                  <I.IcMic />
                </button>
                <span className="rec-tag"><span className="live-dot" /> Gravando… toque para parar</span>
              </div>
              <div style={{ padding: '0 18px 20px' }}>
                <div className="live-text">
                  {text
                    ? text
                    : <span className="interim">Pode falar — o texto aparece aqui…</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW — revisar/editar + gerar */}
        {state === 'review' && (
          <div className="fade-up" style={{ marginTop: 22 }}>
            <div className="card lume-border" style={{ padding: 22 }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-.02em', marginBottom: 6 }}>
                {React.createElement(I.IcCheck, { style: { width: 18, height: 18, color: 'var(--green-light)' } })}
                Texto reconhecido
              </p>
              <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 14, lineHeight: 1.6 }}>
                Leia rapidinho e ajuste se algo saiu errado. Depois é só gerar.
              </p>
              <textarea className="voice-ta" value={text} onChange={e => setText(e.target.value)}
                        placeholder="Seu texto aparece aqui…" />
              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                <button className="btn btn-green" style={{ flex: 1, minWidth: 180, padding: 16 }}
                        disabled={!text.trim()} onClick={generate}>
                  <span className="shine" /> Gerar comunicado
                </button>
                <button className="btn btn-ghost" onClick={startRecording}>
                  <I.IcMic style={{ width: 18, height: 18 }} /> Gravar mais
                </button>
              </div>
              <button onClick={reset}
                      style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 13, cursor: 'pointer', padding: '4px 2px' }}>
                Limpar e começar de novo
              </button>
            </div>
          </div>
        )}

        {/* SENDING */}
        {state === 'sending' && (
          <div className="fade-up card" style={{ marginTop: 22, padding: '46px 30px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 54, height: 54, margin: '0 auto 22px' }}>
              <div className="spinner" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19 }}>
              <span className="gold-text">IA gerando comunicado</span>
            </h3>
            <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 8 }}>
              Redigindo o texto oficial a partir da sua fala…
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {state === 'success' && (
          <div className="fade-up card" style={{ marginTop: 22, padding: '40px 30px', textAlign: 'center' }}>
            <div className="state-ic ok"><I.IcCheck /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, marginTop: 20 }}>Comunicado enviado</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 14.5, marginTop: 8, maxWidth: 340, marginInline: 'auto', lineHeight: 1.6 }}>
              Sua fala foi enviada e o comunicado está sendo gerado. Você o encontra na aba Histórico.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
              <button className="btn btn-green" onClick={reset}><span className="shine" /> Gravar outro</button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {state === 'error' && (
          <div className="fade-up card" style={{ marginTop: 22, padding: '40px 30px', textAlign: 'center' }}>
            <div className="state-ic err"><I.IcAlert /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, marginTop: 20 }}>Ops, algo travou</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 14.5, marginTop: 8, maxWidth: 360, marginInline: 'auto', lineHeight: 1.6 }}>
              {errMsg || 'Não foi possível concluir. Tente novamente.'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
              {text.trim() && (
                <button className="btn btn-gold" onClick={() => setState('review')}>Voltar ao texto</button>
              )}
              <button className="btn btn-green" onClick={reset}><span className="shine" /> Recomeçar</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Comunicados
