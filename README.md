# Portal Raízes Vila Matilde — v2 (design cinematográfico)

Portal de gestão condominial: upload de documentos, assistente de IA
jurídico, histórico e dashboard. Visual premium dark/cinematográfico.

## Stack
- React 18 + Vite (build real, sem Babel no navegador)
- Vercel Serverless Functions (`/api`)
- Gemini 2.0 Flash (chat) com fallback Groq
- Nodemailer (envio de e-mail / integração Make)

---

## ⚠️ Variáveis de ambiente (OBRIGATÓRIO no Vercel)

Configure em **Vercel → Settings → Environment Variables**:

| Variável     | Para que serve                          |
|--------------|------------------------------------------|
| `GEMINI_KEY` | Chave Google AI (chat IA)                |
| `GROQ_KEY`   | Chave Groq (fallback do chat)            |
| `EMAIL_FROM` | Gmail remetente                          |
| `EMAIL_PASS` | **App Password** do Gmail (não a senha!) |
| `EMAIL_TO`   | E-mail que recebe os documentos          |

> Depois de adicionar/alterar variáveis, é preciso **Redeploy** —
> variáveis só passam a valer num deploy novo.

Veja `.env.example` como referência.

---

## Rodar local
```bash
npm install
npm run dev
```
> As rotas `/api/*` só respondem no Vercel (ou com `vercel dev`).
> No `npm run dev` puro, IA e envio de e-mail falham — é esperado.

## Build / Deploy
```bash
npm run build
```
Push no GitHub → Vercel builda sozinho. Configure as env vars antes do 1º deploy.

---

## Notas
- Login: ambiente demonstrativo, qualquer credencial entra (validação só visual).
- Histórico e Dashboard usam dados de exemplo (mock) em `src/data.js`.
- A aba IA conversa de verdade via `/api/chat` (Gemini + fallback Groq).
- A aba Comunicados envia o arquivo de verdade via `/api/send`.
