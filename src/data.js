/* ============================================================
   MOCK DATA — Raízes Vila Matilde
   ============================================================ */
const RZ_DATA = (function () {
  // document type registry: color, icon name, label, emoji
  const TYPES = {
    ata:        { key: 'ata',        label: 'ATA',         emoji: '📋', icon: 'IcDoc',      color: '#A8C8E8', soft: 'rgba(168,200,232,.14)', bd: 'rgba(168,200,232,.32)' },
    financeiro: { key: 'financeiro', label: 'Financeiro',  emoji: '💰', icon: 'IcMoney',    color: '#E8C97A', soft: 'rgba(232,201,122,.14)', bd: 'rgba(232,201,122,.32)' },
    convocacao: { key: 'convocacao', label: 'Convocação',  emoji: '📅', icon: 'IcCalendar', color: '#6FA870', soft: 'rgba(111,168,112,.14)', bd: 'rgba(111,168,112,.32)' },
    aviso:      { key: 'aviso',      label: 'Aviso',       emoji: '🔔', icon: 'IcBell',     color: '#D9A0C8', soft: 'rgba(217,160,200,.14)', bd: 'rgba(217,160,200,.32)' },
  };

  const HISTORY = [
    { id: 9, type: 'aviso',      title: 'Manutenção dos elevadores — Torre B', date: '02 jun 2026', time: '09:14',
      body: 'Prezados condôminos,\n\nInformamos que nos dias 05 e 06 de junho será realizada a manutenção preventiva dos elevadores da Torre B, das 8h às 17h. Durante o período, o elevador social ficará indisponível. Solicitamos a compreensão de todos.\n\nAtenciosamente,\nAdministração Raízes Vila Matilde.' },
    { id: 8, type: 'financeiro', title: 'Prestação de contas — Maio/2026', date: '01 jun 2026', time: '18:42',
      body: 'Prezados condôminos,\n\nSegue resumo da prestação de contas referente ao mês de maio de 2026. Receita total: R$ 142.380,00. Despesas: R$ 128.910,00. Saldo em conta: R$ 86.540,00. O relatório completo encontra-se disponível na administração.\n\nConselho Fiscal — Raízes Vila Matilde.' },
    { id: 7, type: 'convocacao', title: 'Assembleia Geral Ordinária 2026', date: '28 mai 2026', time: '11:05',
      body: 'EDITAL DE CONVOCAÇÃO\n\nFicam os senhores condôminos convocados para a Assembleia Geral Ordinária, a realizar-se em 15/06/2026, às 19h30 em primeira convocação e 20h em segunda, no salão de festas, para deliberar sobre: 1) Aprovação de contas; 2) Previsão orçamentária; 3) Eleição do conselho.\n\nO Síndico.' },
    { id: 6, type: 'ata',        title: 'ATA — Reunião de Conselho 05/2026', date: '22 mai 2026', time: '20:30',
      body: 'Aos vinte e dois dias do mês de maio de 2026, reuniu-se o conselho consultivo do condomínio Raízes Vila Matilde. Pauta: análise de orçamentos para reforma da fachada. Após deliberação, aprovou-se por unanimidade a contratação da proposta nº 3. Nada mais havendo, encerrou-se a reunião.' },
    { id: 5, type: 'aviso',      title: 'Nova regra para uso da churrasqueira', date: '19 mai 2026', time: '15:20',
      body: 'Comunicamos que a reserva da área da churrasqueira deverá ser feita com antecedência mínima de 48h junto à portaria. O limite é de um evento por unidade a cada quinze dias.' },
    { id: 4, type: 'financeiro', title: 'Reajuste da taxa condominial', date: '12 mai 2026', time: '10:00',
      body: 'Informamos que, a partir de julho/2026, a taxa condominial sofrerá reajuste de 6,2%, conforme aprovado em assembleia. O novo valor passa a ser de R$ 720,00 para as unidades padrão.' },
    { id: 3, type: 'convocacao', title: 'Convocação — Assembleia Extraordinária', date: '04 mai 2026', time: '09:30',
      body: 'Ficam convocados os condôminos para Assembleia Geral Extraordinária em 18/05/2026, às 19h, para deliberar sobre a instalação de sistema de energia solar nas áreas comuns.' },
    { id: 2, type: 'ata',        title: 'ATA — Assembleia Ordinária 04/2026', date: '28 abr 2026', time: '21:10',
      body: 'Ata da Assembleia Geral Ordinária realizada em 28 de abril de 2026. Presentes condôminos representando 64% das frações ideais. Deliberou-se sobre a aprovação das contas do exercício anterior e a recomposição do fundo de reserva.' },
  ];

  const KPIS = [
    { id: 'total', label: 'Comunicados gerados', value: 248, suffix: '', trend: +12, dir: 'up' },
    { id: 'month', label: 'Mês atual',           value: 24,  suffix: '', trend: +8,  dir: 'up' },
    { id: 'avg',   label: 'Tempo médio',          value: 38,  suffix: 's', trend: -15, dir: 'up', invert: true },
    { id: 'rate',  label: 'Taxa de entrega',      value: 99.2, suffix: '%', trend: +0.4, dir: 'up', decimals: 1 },
  ];

  const MONTHLY = [
    { m: 'Jan', v: 14 }, { m: 'Fev', v: 19 }, { m: 'Mar', v: 22 }, { m: 'Abr', v: 17 },
    { m: 'Mai', v: 28 }, { m: 'Jun', v: 24, hot: true },
  ];

  const BYTYPE = [
    { type: 'ata',        v: 86 },
    { type: 'financeiro', v: 64 },
    { type: 'convocacao', v: 52 },
    { type: 'aviso',      v: 46 },
  ];

  const SUGGESTIONS = [
    'Posso proibir Airbnb no condomínio?',
    'Como cobrar inadimplente?',
    'Quórum para alterar convenção?',
    'Multa por barulho à noite?',
    'Posso vetar animais de grande porte?',
  ];

  const LEGAL = [
    { code: 'CC 10.406/02',  name: 'Código Civil — condomínio edilício (arts. 1.331+)' },
    { code: 'Lei 4.591/64',  name: 'Condomínios e incorporações' },
    { code: 'Lei 8.245/91',  name: 'Lei do Inquilinato' },
    { code: 'ABNT NBR 5674', name: 'Manutenção de edificações' },
  ];

  // scripted assistant replies (keyword → answer)
  const REPLIES = [
    { k: ['airbnb', 'temporada', 'aluguel de curta'],
      a: 'A locação por temporada (Airbnb) é tema sensível. O STJ entende que a convenção pode restringir ou proibir a hospedagem de curta duração com rotatividade, por configurar uso comercial/hoteleiro incompatível com a destinação **residencial** do edifício.\n\nPara vedar validamente, recomenda-se deliberação em assembleia com **quórum qualificado de 2/3** das frações ideais e inclusão de cláusula expressa na convenção (CC, art. 1.336 e 1.351).' },
    { k: ['inadimpl', 'cobrar', 'devedor', 'atraso'],
      a: 'O condômino inadimplente está sujeito a **juros de mora de 1% ao mês** e **multa de até 2%** sobre o débito (CC, art. 1.336, §1º).\n\nPassos recomendados:\n1. Notificação extrajudicial amigável;\n2. Acordo com parcelamento, se cabível;\n3. Ação de cobrança — o crédito condominial é título que admite execução, e o imóvel pode responder pela dívida (CPC, art. 784, X).' },
    { k: ['quórum', 'quorum', 'convenção', 'convencao', 'alterar'],
      a: 'A alteração da **convenção** exige aprovação de condôminos que representem, no mínimo, **2/3 das frações ideais** (CC, art. 1.351).\n\nJá a alteração do **regimento interno** costuma exigir maioria simples dos presentes, salvo disposição diversa na própria convenção. Mudanças na destinação do edifício exigem **unanimidade**.' },
    { k: ['barulho', 'ruído', 'ruido', 'silêncio', 'perturbação'],
      a: 'O condômino tem o dever de não perturbar o sossego dos demais (CC, art. 1.336, IV). O descumprimento reiterado permite a aplicação de **multa de até 5x o valor da taxa** condominial, mediante deliberação de **3/4 dos condôminos** (art. 1.337).\n\nRecomenda-se registrar as ocorrências e a Lei do Silêncio municipal como base para a notificação.' },
    { k: ['animais', 'pet', 'cachorro', 'cão', 'gato'],
      a: 'A jurisprudência (STJ) firmou que a convenção **não pode proibir genericamente** a posse de animais que não causem incômodo, risco à saúde ou à segurança.\n\nÉ possível, contudo, estabelecer **regras de circulação** (uso de coleira, elevador de serviço, áreas restritas) no regimento interno. A vedação só se sustenta diante de risco concreto comprovado.' },
  ];
  const DEFAULT_REPLY = 'Boa pergunta. Como assistente jurídico condominial, baseio-me principalmente no **Código Civil (Lei 10.406/02)**, na **Lei 4.591/64** e na convenção do condomínio.\n\nPara orientá-lo com precisão, poderia detalhar um pouco mais a situação? Por exemplo: o que diz a convenção do Raízes Vila Matilde sobre o tema, e qual o resultado pretendido?';

  function replyFor(text) {
    const t = (text || '').toLowerCase();
    for (const r of REPLIES) if (r.k.some(k => t.includes(k))) return r.a;
    return DEFAULT_REPLY;
  }

  return { TYPES, HISTORY, KPIS, MONTHLY, BYTYPE, SUGGESTIONS, LEGAL, replyFor };
})();

export default RZ_DATA;
