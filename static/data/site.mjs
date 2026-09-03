/* Knee Battle — site config, chrome, i18n shared strings */

export const BASE = 'https://kneebattle.com';
export const LANGS = ['en', 'pt', 'es'];
export const LANG_PATH = { en: '/', pt: '/pt/', es: '/es/' };
export const HTML_LANG = { en: 'en', pt: 'pt-BR', es: 'es' };
export const OG_LOCALE = { en: 'en_US', pt: 'pt_BR', es: 'es_ES' };

export const BRAND = {
  name: 'Knee Battle',
  sub: { en: '', pt: 'Batalha de Joelhos', es: 'Batalla de Rodillas' },
  tagline: {
    en: 'Every battle is won on your knees.',
    pt: 'Toda batalha se vence de joelhos.',
    es: 'Toda batalla se gana de rodillas.',
  },
};

export const ANCHOR_VERSE = {
  en: { t: 'But when you pray, go into your room and shut the door and pray to your Father who is in secret. And your Father who sees in secret will reward you.', r: 'Matthew 6:6 (WEB)' },
  pt: { t: 'Mas você, quando orar, entre no seu quarto, feche a porta e ore a seu Pai, que está em secreto; e seu Pai, que vê em secreto, o recompensará.', r: 'Mateus 6:6' },
  es: { t: 'Mas tú, cuando ores, entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en secreto; y tu Padre que ve en lo secreto te recompensará.', r: 'Mateo 6:6 (RVR1909)' },
};

/* ---------- family bar: 10 doors, CBA canonical order, CURRENT=knee rendered as span ----------
   Order fixed across all family sites: CBA first (the house), then the doors.
   Labels match CBA _build/site.mjs FAMILY link labels exactly. */
export const FAMILY = [
  { id: 'cba', url: 'https://cbaorlando.org', dot: '#1FA15B', en: 'CBA Orlando', pt: 'CBA Orlando', es: 'CBA Orlando' },
  { id: 'praythenact', url: 'https://praythenact.com', dot: '#F2624C', en: 'Daily Devotional', pt: 'Devocional diário', es: 'Devocional diario' },
  { id: 'godscall', url: 'https://bygodscall.com', dot: '#F4A72C', en: 'Daily Audio', pt: 'Áudio diário', es: 'Audio diario' },
  { id: 'discoveringjesus', url: 'https://www.discoveringjesustogether.com', dot: '#7A5AF0', en: 'Bible Study', pt: 'Estudo bíblico', es: 'Estudio bíblico' },
  { id: 'tothewaters', url: 'https://tothewaters.com', dot: '#16B5C4', en: 'Baptism', pt: 'Batismo', es: 'Bautismo' },
  { id: 'pride', url: 'https://pridedestroy.com', dot: '#8b0000', en: 'Pride Destroy', pt: 'Pride Destroy', es: 'Pride Destroy' },
  { id: 'sabbath', url: 'https://sabbathschool.us', dot: '#2f6bd7', en: 'Sabbath School', pt: 'Escola Sabatina', es: 'Escuela Sabática' },
  { id: 'committed', url: 'https://committedinchrist.com', dot: '#c2255c', en: 'Marriage Program', pt: 'Programa para Casais', es: 'Programa para Matrimonios' },
  { id: 'knee', url: 'https://kneebattle.com', dot: '#2E1F6B', en: 'Prayer Strategy', pt: 'Batalha de Joelhos', es: 'Batalla de Rodillas' },
  { id: 'legado', url: 'https://legacyofaman.com', dot: '#8C5A2B', en: 'Legacy', pt: 'Legado', es: 'Legado' },
];
export const FAMILY_CURRENT = 'knee';

export const FAMILY_INTRO = {
  en: 'One house, many doors. Every ministry below is part of the same family — walk through whichever one you need today.',
  pt: 'Uma casa, muitas portas. Cada ministério abaixo faz parte da mesma família — entre por aquela que você precisa hoje.',
  es: 'Una casa, muchas puertas. Cada ministerio abajo es parte de la misma familia — entra por la que necesites hoy.',
};

export const CBA_MARK = '<svg class="cba-mark" width="22" height="22" viewBox="0 0 32 32" role="img" aria-label="CBA Orlando"><rect width="32" height="32" rx="8" fill="#1FA15B"/><path d="M16 6v9M11.5 10.5h9" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/><path d="M7 23q3 -3 6 0t6 0" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg>';

/* Knee Battle mark: open door, light spilling out, kneeling figure in the light */
export const KB_MARK = '<svg viewBox="0 0 40 40" width="40" height="40" role="img" aria-label="Knee Battle" focusable="false"><rect width="40" height="40" rx="11" fill="#2E1F6B"/><path d="M13 9h11a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H13z" fill="#221650"/><path d="M26 11.5 33 8v24l-7-3.5z" fill="#F0B429" opacity=".92"/><circle cx="23.2" cy="20" r="1.2" fill="#F0B429"/><path d="M9 31h6" stroke="#F0B429" stroke-width="2" stroke-linecap="round"/></svg>';

/* ---------- navigation ---------- */
export const NAV = [
  { href: 'start-here', en: 'Start Here', pt: 'Comece Aqui', es: 'Empieza Aquí' },
  { href: 'prayer-room', en: 'Prayer Room', pt: 'Sala de Oração', es: 'Sala de Oración' },
  { href: 'battle-plan', en: 'Ten Fronts', pt: 'Dez Frentes', es: 'Diez Frentes' },
  { href: '31-days', en: '31 Days', pt: '31 Dias', es: '31 Días' },
  { href: 'resources', en: 'Resources', pt: 'Recursos', es: 'Recursos' },
  { href: 'about', en: 'About', pt: 'Sobre', es: 'Acerca' },
];

export const UI = {
  navCta: { en: 'Meet Jesus', pt: 'Conheça Jesus', es: 'Conoce a Jesús' },
  topbarLeft: { en: 'A free prayer resource from CBA Orlando', pt: 'Um recurso gratuito de oração da CBA Orlando', es: 'Un recurso gratuito de oración de CBA Orlando' },
  topbarCrisis: { en: 'Need help right now?', pt: 'Precisa de ajuda agora?', es: '¿Necesitas ayuda ahora?' },
  menu: { en: 'Menu', pt: 'Menu', es: 'Menú' },
  skip: { en: 'Skip to content', pt: 'Ir para o conteúdo', es: 'Ir al contenido' },
  familyEyebrow: { en: 'Explore the family', pt: 'Conheça o ministério', es: 'Conoce el ministerio' },
  home: { en: 'Home', pt: 'Início', es: 'Inicio' },
  langLabel: { en: 'Language', pt: 'Idioma', es: 'Idioma' },
  colophon: { en: 'A ministry of', pt: 'Um ministério da', es: 'Un ministerio de' },
  readMore: { en: 'Read more', pt: 'Leia mais', es: 'Leer más' },
  print: { en: 'Print', pt: 'Imprimir', es: 'Imprimir' },
  verseToday: { en: 'Verse for today', pt: 'Versículo de hoje', es: 'Versículo de hoy' },
};

export const FOOT_COLS = {
  en: [
    { h: 'Begin', l: [['start-here', 'Start Here'], ['prayer-room', 'Build Your Prayer Room'], ['how-to-pray', "When You Don't Know How"], ['gospel', 'Meet Jesus']] },
    { h: 'Fight', l: [['battle-plan', 'The Ten Fronts'], ['31-days', '31-Day Knee Battle'], ['cards', 'Prayer Card Builder'], ['fasting', 'Fasting & Prayer']] },
    { h: 'For someone you love', l: [['marriage', 'Marriage'], ['children', 'Children'], ['fear', 'Fear'], ['provision', 'Money & Work']] },
    { h: 'Ministry', l: [['about', 'About & Safety'], ['testimonies', 'Testimonies'], ['mentor', "Be Someone's Miss Clara"], ['inspired-by', 'Where the idea came from']] },
  ],
  pt: [
    { h: 'Comece', l: [['start-here', 'Comece Aqui'], ['prayer-room', 'Monte sua Sala de Oração'], ['how-to-pray', 'Quando você não sabe orar'], ['gospel', 'Conheça Jesus']] },
    { h: 'Lute', l: [['battle-plan', 'As Dez Frentes'], ['31-days', 'Batalha de 31 Dias'], ['cards', 'Cartões de Oração'], ['fasting', 'Jejum e Oração']] },
    { h: 'Por quem você ama', l: [['marriage', 'Casamento'], ['children', 'Filhos'], ['fear', 'Medo'], ['provision', 'Dinheiro e Trabalho']] },
    { h: 'Ministério', l: [['about', 'Sobre e Segurança'], ['testimonies', 'Testemunhos'], ['mentor', 'Seja a Miss Clara de alguém'], ['inspired-by', 'De onde veio a ideia']] },
  ],
  es: [
    { h: 'Comienza', l: [['start-here', 'Empieza Aquí'], ['prayer-room', 'Arma tu Sala de Oración'], ['how-to-pray', 'Cuando no sabes orar'], ['gospel', 'Conoce a Jesús']] },
    { h: 'Pelea', l: [['battle-plan', 'Los Diez Frentes'], ['31-days', 'Batalla de 31 Días'], ['cards', 'Tarjetas de Oración'], ['fasting', 'Ayuno y Oración']] },
    { h: 'Por quien amas', l: [['marriage', 'Matrimonio'], ['children', 'Hijos'], ['fear', 'Miedo'], ['provision', 'Dinero y Trabajo']] },
    { h: 'Ministerio', l: [['about', 'Acerca y Seguridad'], ['testimonies', 'Testimonios'], ['mentor', 'Sé la Miss Clara de alguien'], ['inspired-by', 'De dónde vino la idea']] },
  ],
};

export const FOOT_LEDE = {
  en: 'A free, practical guide to praying for the people and the fights that matter most — with a place to pray, a plan to follow, and words for the nights you have none.',
  pt: 'Um guia gratuito e prático para orar pelas pessoas e pelas lutas que mais importam — com um lugar para orar, um plano a seguir e palavras para as noites em que você não tem nenhuma.',
  es: 'Una guía gratuita y práctica para orar por las personas y las batallas que más importan — con un lugar para orar, un plan que seguir y palabras para las noches en que no tienes ninguna.',
};

export const CRISIS_STRIP = {
  en: { lbl: 'If you or someone you love is in danger:', txt: '<strong>Call 911</strong> now &nbsp;·&nbsp; <strong>Call or text 988</strong> for suicide or mental-health crisis &nbsp;·&nbsp; Prayer is not the only step, and asking for help is not a lack of faith.' },
  pt: { lbl: 'Se você ou alguém que você ama está em perigo:', txt: '<strong>Ligue 190</strong> (emergência) &nbsp;·&nbsp; <strong>CVV 188</strong> para crise emocional &nbsp;·&nbsp; A oração não é o único passo, e pedir ajuda não é falta de fé.' },
  es: { lbl: 'Si tú o alguien que amas está en peligro:', txt: '<strong>Llama al 911</strong> ahora &nbsp;·&nbsp; <strong>Llama o envía un mensaje al 988</strong> en crisis de salud mental &nbsp;·&nbsp; La oración no es el único paso, y pedir ayuda no es falta de fe.' },
};

export const FAMILY_LEGAL = {
  en: 'Part of the CBA Orlando family · Comunidade Brasileira Inc · Orlando, FL · info@cbaorlando.org',
  pt: 'Parte da família CBA Orlando · Comunidade Brasileira Inc · Orlando, FL · info@cbaorlando.org',
  es: 'Parte de la familia CBA Orlando · Comunidade Brasileira Inc · Orlando, FL · info@cbaorlando.org',
};

export const INDEPENDENCE = {
  en: "This independent educational website is a ministry of CBA Orlando. It is not an official website of the Seventh-day Adventist Church's General Conference, a union, conference, or local congregation, and it is not endorsed by those organizations.",
  pt: 'Este site educacional independente é um ministério da CBA Orlando. Não é um site oficial da Conferência Geral, união, associação ou congregação local da Igreja Adventista do Sétimo Dia, nem é endossado por essas organizações.',
  es: 'Este sitio educativo independiente es un ministerio de CBA Orlando. No es un sitio oficial de la Asociación General, una unión, asociación o congregación local de la Iglesia Adventista del Séptimo Día, ni está respaldado por esas organizaciones.',
};

export const NON_AFFILIATION = {
  en: 'Knee Battle is not affiliated with, endorsed by, or connected to Kendrick Brothers Productions, Provident Films, Affirm Films, TriStar Pictures, or Sony Pictures Releasing.',
  pt: 'Knee Battle não é afiliado, endossado ou conectado à Kendrick Brothers Productions, Provident Films, Affirm Films, TriStar Pictures ou Sony Pictures Releasing.',
  es: 'Knee Battle no está afiliado, respaldado ni conectado con Kendrick Brothers Productions, Provident Films, Affirm Films, TriStar Pictures o Sony Pictures Releasing.',
};

export const LEGAL_LINKS = {
  en: [['privacy', 'Privacy'], ['terms', 'Terms'], ['sitemap', 'Sitemap']],
  pt: [['privacy', 'Privacidade'], ['terms', 'Termos'], ['sitemap', 'Mapa do site']],
  es: [['privacy', 'Privacidad'], ['terms', 'Términos'], ['sitemap', 'Mapa del sitio']],
};

export const SAFETY_LINE = {
  en: 'Knee Battle is an educational and spiritual-formation ministry — not therapy, not medical or legal advice, and not emergency care. If there is violence, fear, or coercive control in your home, or if you are thinking of harming yourself, prayer is not the only step. Call 911 in an emergency, or call or text 988 for mental-health crisis support in the US.',
  pt: 'Knee Battle é um ministério educacional e de formação espiritual — não é terapia, nem aconselhamento médico ou jurídico, nem atendimento de emergência. Se há violência, medo ou controle coercitivo na sua casa, ou se você pensa em se machucar, a oração não é o único passo. Ligue 190 em emergências, ou 188 (CVV) para apoio em crise emocional.',
  es: 'Knee Battle es un ministerio educativo y de formación espiritual — no es terapia, ni consejo médico o legal, ni atención de emergencia. Si hay violencia, miedo o control coercitivo en tu hogar, o si piensas en hacerte daño, la oración no es el único paso. Llama al 911 en una emergencia, o llama o envía un mensaje al 988 para apoyo en crisis de salud mental en EE. UU.',
};

export const NO_PROMISE = {
  en: 'We do not promise outcomes. We believe God hears, and we believe obedience is ours while results are His. We will never tell you that your prayer failed because you did not have enough faith.',
  pt: 'Não prometemos resultados. Cremos que Deus ouve, e cremos que a obediência é nossa enquanto os resultados são d\u2019Ele. Nunca diremos que sua oração falhou porque você não teve fé suficiente.',
  es: 'No prometemos resultados. Creemos que Dios escucha, y creemos que la obediencia es nuestra mientras los resultados son suyos. Nunca te diremos que tu oración falló porque no tuviste suficiente fe.',
};
