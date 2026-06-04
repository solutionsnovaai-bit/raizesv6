// api/send.js — Vercel Serverless Function (ESM)
// Agora recebe APENAS texto (transcrição de voz), sem upload de arquivos.
// O texto vai no CORPO do e-mail → o Make lê em "Text content".
// EMAIL_FROM, EMAIL_TO, EMAIL_PASS → variáveis no Vercel

import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  try {
    // o Vercel já faz o parse do JSON automaticamente
    const texto = String(req.body?.texto || '').trim()
    if (!texto) return res.status(400).json({ error: 'Texto vazio' })
    if (texto.length > 8000) return res.status(413).json({ error: 'Texto muito longo' })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_FROM, pass: process.env.EMAIL_PASS },
    })

    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

    await transporter.sendMail({
      from: `"Portal Raízes VM" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: `[Raízes VM] Comunicado por voz — ${dataHora}`,
      // ↓↓↓ É ISTO que o Make deve ler: "Text content" (texto puro = só a transcrição)
      text: texto,
      // versão bonita só para quem abrir o e-mail no Gmail (o Make ignora)
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
          <div style="background:#3D4F3C;padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:#fff;margin:0;font-size:18px">🎤 Raízes Vila Matilde</h2>
            <p style="color:rgba(255,255,255,.6);margin:6px 0 0;font-size:13px">Portal do Síndico · Comunicado por voz</p>
          </div>
          <div style="background:#f9f7f3;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e0d8cc">
            <p style="color:#666;font-size:12px;margin:0 0 6px;font-weight:700;letter-spacing:.04em;text-transform:uppercase">Texto ditado pelo síndico</p>
            <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;white-space:pre-wrap">${escapeHtml(texto)}</p>
            <p style="color:#999;font-size:12px;margin:0;border-top:1px solid #e0d8cc;padding-top:12px">Enviado em ${dataHora}</p>
          </div>
        </div>`,
    })

    console.log(`✅ Comunicado por voz enviado → ${process.env.EMAIL_TO}`)
    return res.status(200).json({ ok: true })

  } catch (err) {
    console.error('❌ Erro:', err.message)
    return res.status(500).json({ error: 'Falha ao enviar', detail: err.message })
  }
}

// evita quebrar o HTML do e-mail se o síndico ditar algo com < > &
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
