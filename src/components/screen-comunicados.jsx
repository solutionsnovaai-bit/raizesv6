/* ============================================================
   COMUNICADOS — hero upload zone + state machine
   ============================================================ */
import React, { useState as useStateC, useRef as useRefC, useEffect as useEffectC } from 'react'
import RZ_ICONS from './icons'
import RZ_DATA from '../data'

function Comunicados({ onGenerated }) {
  const I = RZ_ICONS;
  const D = RZ_DATA;
  const [state, setState] = useStateC('idle');   // idle | uploading | processing | success | error
  const [progress, setProgress] = useStateC(0);
  const [drag, setDrag] = useStateC(false);
  const [fileName, setFileName] = useStateC('');
  const [pickedType, setPickedType] = useStateC('ata');
  const fileRef = useRefC(null);

  const TYPES = D.TYPES;
  const MAX_BYTES = 4.5 * 1024 * 1024; // limite do Vercel Serverless

  // envia o arquivo de verdade pro /api/send (Make + Gmail)
  async function runFlow(file) {
    const name = file?.name || 'documento.pdf';
    setFileName(name);

    // valida tamanho antes
    if (file && file.size > MAX_BYTES) {
      setState('error');
      return;
    }

    setState('uploading'); setProgress(0);

    // barra de progresso animada (visual) enquanto sobe de verdade
    let p = 0;
    const up = setInterval(() => {
      p += Math.random() * 14 + 5;
      setProgress(Math.min(p, 90));
      if (p >= 90) clearInterval(up);
    }, 220);

    try {
      const fd = new FormData();
      fd.append('arquivo', file, name);
      const res = await fetch('/api/send', { method: 'POST', body: fd });
      clearInterval(up);
      if (!res.ok) throw new Error('send ' + res.status);

      setProgress(100);
      setState('processing');
      // dá um respiro visual e marca sucesso
      setTimeout(() => {
        setState('success');
        onGenerated && onGenerated(pickedType, name);
      }, 1800);
    } catch (err) {
      clearInterval(up);
      setState('error');
    }
  }

  function pick() { fileRef.current && fileRef.current.click(); }
  function onFile(e) { const f = e.target.files && e.target.files[0]; if (f) runFlow(f); }
  function onDrop(e) { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) runFlow(f); }
  function reset() { setState('idle'); setProgress(0); setFileName(''); }

  const chips = Object.values(TYPES);

  return (
    <div className="screen">
      <div className="main-inner">
        <div className="fade-up" style={{ animationDelay: '40ms' }}>
          <p className="eyebrow">Automação de documentos</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(32px,8vw,46px)', marginTop: 12 }}>
            <span className="grad-text">Gerar comunicado</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15.5, marginTop: 12, maxWidth: 440, lineHeight: 1.6 }}>
            Envie uma ATA, planilha financeira ou convocação. A IA transforma em um comunicado pronto para os condôminos.
          </p>
        </div>

        {/* type chips */}
        {state === 'idle' && (
          <div className="fade-up" style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 26, animationDelay: '120ms' }}>
            {chips.map(t => (
              <button key={t.key} className={"chip " + (pickedType === t.key ? 'active' : '')}
                      onClick={() => setPickedType(t.key)}>
                <span style={{ fontSize: 15 }}>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        )}

        {/* HERO / STATE CARD */}
        <div className="fade-up" style={{ marginTop: 20, animationDelay: '180ms' }}>
          {state === 'idle' && (
            <div className={"upload-zone lume-border " + (drag ? 'drag' : '')}
                 onClick={pick}
                 onDragOver={e => { e.preventDefault(); setDrag(true); }}
                 onDragLeave={() => setDrag(false)} onDrop={onDrop}>
              <div className="upload-ic"><I.IcUpload /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, letterSpacing: '-.02em' }}>
                Arraste o documento aqui
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14.5, marginTop: 7 }}>ou toque para selecionar</p>
              <button className="btn btn-green" style={{ marginTop: 22 }} onClick={(e) => { e.stopPropagation(); pick(); }}>
                <span className="shine" />
                <I.IcUpload style={{ width: 18, height: 18 }} /> Selecionar arquivo
              </button>
              <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 18, letterSpacing: '.02em' }}>
                PDF · DOC · DOCX · até 4,5 MB
              </p>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={onFile} />
            </div>
          )}

          {state === 'uploading' && (
            <div className="card" style={{ padding: 30 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20 }}>
                <div className="type-ic" style={{ background: TYPES[pickedType].soft, border: `1px solid ${TYPES[pickedType].bd}`, color: TYPES[pickedType].color }}>
                  {React.createElement(I[TYPES[pickedType].icon])}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</p>
                  <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 3 }}>Enviando…</p>
                </div>
                <span className="gold-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19 }}>{Math.round(progress)}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{ width: progress + '%' }} /></div>
            </div>
          )}

          {state === 'processing' && (
            <div className="card" style={{ padding: '46px 30px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 54, height: 54, margin: '0 auto 22px' }}>
                <div className="spinner" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19 }}>
                <span className="gold-text">IA gerando comunicado</span>
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 8 }}>
                Lendo o documento e redigindo o texto oficial…
              </p>
            </div>
          )}

          {state === 'success' && (
            <div className="card" style={{ padding: '40px 30px', textAlign: 'center' }}>
              <div className="state-ic ok"><I.IcCheck /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, marginTop: 20 }}>Comunicado gerado</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14.5, marginTop: 8, maxWidth: 320, marginInline: 'auto', lineHeight: 1.6 }}>
                Pronto para revisão e envio. Você encontra o documento na aba Histórico.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <button className="btn btn-gold"><I.IcDownload style={{ width: 18, height: 18 }} /> Baixar</button>
                <button className="btn btn-ghost" onClick={reset}>Gerar outro</button>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="card" style={{ padding: '40px 30px', textAlign: 'center' }}>
              <div className="state-ic err"><I.IcAlert /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, marginTop: 20 }}>Não foi possível processar</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14.5, marginTop: 8, maxWidth: 340, marginInline: 'auto', lineHeight: 1.6 }}>
                O arquivo pode estar corrompido ou acima de 4,5 MB. Verifique e tente novamente.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
                <button className="btn btn-green" onClick={reset}><span className="shine" /> Tentar de novo</button>
              </div>
            </div>
          )}
        </div>

        {/* tip card */}
        {state === 'idle' && (
          <div className="fade-up card lume-border" style={{ marginTop: 18, padding: 18, display: 'flex', gap: 14, animationDelay: '240ms' }}>
            <div className="type-ic" style={{ background: 'rgba(212,168,75,.12)', border: '1px solid rgba(212,168,75,.3)', color: 'var(--gold-hi)' }}>
              <I.IcSpark />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14.5 }}>Como funciona a automação</p>
              <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginTop: 5, lineHeight: 1.6 }}>
                Documento → leitura por IA → redação no padrão do condomínio → revisão do síndico → envio aos moradores. Tudo em segundos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comunicados
