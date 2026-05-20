/**
 * TMBO – Tom le chatbot
 * Image : tom.png (cercle rouge, t-shirt TMBO, laptop)
 * Envoi : Web3Forms · Anti-spam : honeypot + captcha maths
 */
(function () {

const WEB3FORMS_KEY = '367769ef-80ee-4c51-96a0-42d392cd88a1';

/* ══ CSS ══ */
const css = `
  #tw { position:fixed; bottom:20px; right:20px; z-index:9000;
    display:flex; flex-direction:column; align-items:flex-end; gap:10px;
    pointer-events:none; font-family:'Segoe UI',Tahoma,sans-serif; }

  /* Fenêtre chat */
  #tc { width:340px; background:#fff; border-radius:16px;
    box-shadow:0 8px 32px rgba(60,60,59,.22); border:1.5px solid #e5e5e4;
    display:flex; flex-direction:column; overflow:hidden; pointer-events:auto;
    opacity:0; transform:scale(.93) translateY(14px); max-height:520px;
    transform-origin:bottom right;
    transition:opacity .28s ease,transform .28s cubic-bezier(.34,1.4,.64,1); }
  #tc.open { opacity:1; transform:scale(1) translateY(0); }

  /* En-tête */
  #th { background:#3c3c3b; padding:10px 12px; display:flex; align-items:center;
    gap:10px; flex-shrink:0; border-bottom:2px solid #c8102e;
    position:sticky; top:0; z-index:10; }
  #th img.av-head { width:46px; height:46px; border-radius:50%;
    object-fit:cover; flex-shrink:0; }
  #thi { flex:1; }
  #thi strong { display:block; color:#fff; font-size:14px; font-weight:700; }
  #thi span { font-size:11px; color:rgba(255,255,255,.6); }
  #thx { background:rgba(255,255,255,.15); border:none; color:#fff;
    font-size:16px; cursor:pointer; padding:4px 9px; flex-shrink:0;
    border-radius:6px; font-weight:700; }
  #thx:hover { background:rgba(255,255,255,.3); }

  /* Messages */
  #tm { flex:1; overflow-y:auto; padding:10px 12px 4px; min-height:80px;
    display:flex; flex-direction:column; gap:9px;
    background:#f9f9f8; scroll-behavior:smooth; }
  #tm::-webkit-scrollbar { width:4px; }
  #tm::-webkit-scrollbar-thumb { background:#ddd; border-radius:2px; }

  .mb { max-width:86%; padding:8px 12px; border-radius:12px;
    font-size:13.5px; line-height:1.5; animation:mpop .2s ease; }
  .mb.bot { background:#e9ecef; color:#3c3c3b;
    border-radius:4px 12px 12px 12px; align-self:flex-start; }
  .mb.usr { background:#c8102e; color:#fff;
    border-radius:12px 4px 12px 12px; align-self:flex-end; }
  .mb a { color:inherit; text-decoration:underline; }
  @keyframes mpop { from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:none;} }

  /* Indicateur frappe */
  #ttyp { display:none; align-self:flex-start; align-items:center; gap:4px;
    background:#e9ecef; padding:8px 12px; border-radius:4px 12px 12px 12px; }
  #ttyp.on { display:flex; }
  #ttyp span { width:7px; height:7px; border-radius:50%; background:#aaa;
    animation:tblink 1.2s infinite; }
  #ttyp span:nth-child(2){animation-delay:.2s}
  #ttyp span:nth-child(3){animation-delay:.4s}
  @keyframes tblink{0%,80%,100%{opacity:.2}40%{opacity:1}}

  /* Boutons choix rapides */
  #tq { padding:0 11px 7px; display:flex; flex-wrap:wrap; gap:6px; flex-shrink:0; }
  .tqb { background:#fff; border:1.5px solid #c8102e; color:#c8102e;
    border-radius:20px; padding:5px 13px; font-size:12px; font-weight:700;
    cursor:pointer; white-space:nowrap; font-family:inherit;
    transition:background .15s,color .15s; }
  .tqb:hover { background:#c8102e; color:#fff; }

  /* Inventaire */
  #tinv { padding:0 11px 8px; display:none; }
  #tinv.on { display:block; }
  #tinv p { font-size:12px; font-weight:700; color:#3c3c3b; margin:0 0 6px; }
  #tinv-row { display:flex; gap:6px; margin-bottom:4px; }
  #tinv-txt { flex:1; border:1.5px solid #e0e0df; border-radius:8px;
    padding:6px 10px; font-size:12.5px; outline:none; font-family:inherit; }
  #tinv-txt:focus { border-color:#c8102e; }
  #tinv-add { background:#3c3c3b; color:#fff; border:none; border-radius:8px;
    padding:6px 12px; font-size:12px; cursor:pointer; font-family:inherit; }
  #tinv-add:hover { background:#555; }
  #tinv-list { max-height:64px; overflow-y:auto; }
  .tic { display:flex; justify-content:space-between; align-items:center;
    padding:3px 6px; background:#f5f5f4; border-radius:6px;
    margin-bottom:3px; font-size:12px; color:#3c3c3b; }
  .tic button { background:none; border:none; cursor:pointer;
    color:#c8102e; font-size:13px; line-height:1; padding:0; }

  /* Captcha */
  #tcap { padding:8px 12px; background:#fff8f8;
    border-top:1px solid #fde; display:none; flex-shrink:0; }
  #tcap.on { display:block; }
  #tcap label { font-size:12px; color:#3c3c3b; display:block; margin-bottom:5px; }
  #tcap label strong { color:#c8102e; }
  #tcap-row { display:flex; gap:8px; align-items:center; }
  #tcap-in { width:72px; border:1.5px solid #e0e0df; border-radius:8px;
    padding:6px 10px; font-size:13px; outline:none; font-family:inherit; }
  #tcap-in:focus { border-color:#c8102e; }
  #tcap-err { font-size:11px; color:#c8102e; margin-top:3px; display:none; }

  /* Fichiers */
  #tfa { padding:0 11px 6px; flex-shrink:0; }
  #tfl { display:inline-flex; align-items:center; gap:5px;
    font-size:11.5px; color:#7a7a79; cursor:pointer; padding:3px 0; }
  #tfl:hover { color:#c8102e; }
  #tfi { display:none; }
  #tflist { display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; }
  .tfc { display:flex; align-items:center; gap:4px; background:#f0f0ef;
    border:1px solid #e0e0df; border-radius:12px;
    padding:2px 8px; font-size:11px; color:#4f4f4e; }
  .tfc button { background:none; border:none; cursor:pointer;
    color:#aaa; font-size:12px; line-height:1; padding:0 0 0 3px; }
  .tfc button:hover { color:#c8102e; }

  /* Saisie */
  #tia { display:flex; gap:7px; align-items:flex-end;
    padding:9px 11px; background:#fff;
    border-top:1px solid #ebebea; flex-shrink:0; }
  #ti { flex:1; border:1.5px solid #e0e0df; border-radius:20px;
    padding:8px 13px; font-size:13px; resize:none; outline:none;
    line-height:1.4; max-height:80px; font-family:inherit;
    transition:border-color .15s; }
  #ti:focus { border-color:#c8102e; }
  #tsend { width:34px; height:34px; border-radius:50%;
    background:#c8102e; border:none; cursor:pointer; color:#fff;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:background .15s,transform .1s; }
  #tsend:hover { background:#a00c24; transform:scale(1.08); }
  #tsend svg { width:14px; height:14px; }

  /* FAB – image tom.png sans rognage */
  #tfab { position:relative; pointer-events:auto; cursor:pointer;
    width:80px; height:auto; }
  #tfab .av {
    width:80px; height:auto; display:block;
    animation:tflt 3s ease-in-out infinite;
    filter:drop-shadow(0 6px 16px rgba(0,0,0,.4));
    transition:transform .15s, filter .15s;
  }
  #tfab:hover .av {
    transform:scale(1.1);
    animation-play-state:paused;
    filter:drop-shadow(0 8px 20px rgba(200,16,46,.55));
  }

  /* Badge vert "en ligne" */
  #tbadge { position:absolute; bottom:12px; right:2px;
    width:14px; height:14px; background:#2da44e;
    border:2.5px solid #fff; border-radius:50%;
    animation:tpls 2.5s ease infinite; }
  #tbadge.off { display:none; }

  @keyframes tflt { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
  @keyframes tpls { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.6);opacity:.4;} }

  @media(max-width:420px){
    #tw{right:10px;bottom:10px}
    #tc{width:calc(100vw - 20px);max-height:460px;}
    #tfab,#tfab .av{width:66px;}
  }
`;
const st = document.createElement('style');
st.textContent = css;
document.head.appendChild(st);

/* ══ HTML ══ */
const wrap = document.createElement('div');
wrap.id = 'tw';
wrap.innerHTML = `
<div id="tc" role="dialog" aria-label="Chat Tom TMBO" aria-hidden="true">
  <div id="th">
    <img class="av-head" src="tom.png" alt="Tom TMBO" draggable="false"/>
    <div id="thi">
      <strong>Tom — TMBO</strong>
      <span>Assistant déménagement &amp; débarras</span>
    </div>
    <button id="thx" aria-label="Fermer le chat">&#10005;</button>
  </div>
  <div id="tm">
    <div id="ttyp"><span></span><span></span><span></span></div>
  </div>
  <div id="tq"></div>
  <div id="tinv">
    <p>📦 Inventaire garde-meuble :</p>
    <div id="tinv-row">
      <input id="tinv-txt" type="text" placeholder="Ex : canapé 3 places, cartons…"/>
      <button id="tinv-add">+ Ajouter</button>
    </div>
    <div id="tinv-list"></div>
  </div>
  <div id="tcap">
    <label>Vérification : <strong id="tcap-q"></strong> = ?</label>
    <div id="tcap-row">
      <input id="tcap-in" type="number" placeholder="?"/>
      <button class="tqb" id="tcap-ok">Valider &amp; envoyer</button>
    </div>
    <p id="tcap-err">❌ Mauvaise réponse.</p>
  </div>
  <div id="tfa">
    <label id="tfl" for="tfi">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
      </svg>
      Joindre (max 5 · image, PDF, Word, Excel)
    </label>
    <input type="file" id="tfi" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"/>
    <div id="tflist"></div>
    <input type="text" id="thp" aria-hidden="true" tabindex="-1" autocomplete="off"
      style="position:absolute;left:-9999px;opacity:0;pointer-events:none"/>
  </div>
  <div id="tia">
    <textarea id="ti" rows="1" placeholder="Tapez votre message…" aria-label="Message"></textarea>
    <button id="tsend" aria-label="Envoyer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    </button>
  </div>
</div>

<div id="tfab" role="button" tabindex="0" aria-label="Chat avec Tom TMBO">
  <div id="tbadge"></div>
  <img class="av" src="tom.png" alt="Tom TMBO" draggable="false"/>
</div>`;
document.body.appendChild(wrap);

/* ══ REFS ══ */
const chat   = document.getElementById('tc');
const msgs   = document.getElementById('tm');
const qzone  = document.getElementById('tq');
const input  = document.getElementById('ti');
const send   = document.getElementById('tsend');
const closeB = document.getElementById('thx');
const fab    = document.getElementById('tfab');
const badge  = document.getElementById('tbadge');
const typ    = document.getElementById('ttyp');
const fi     = document.getElementById('tfi');
const flist  = document.getElementById('tflist');
const hp     = document.getElementById('thp');
const inv    = document.getElementById('tinv');
const invTxt = document.getElementById('tinv-txt');
const invAdd = document.getElementById('tinv-add');
const invLst = document.getElementById('tinv-list');
const cap    = document.getElementById('tcap');
const capQ   = document.getElementById('tcap-q');
const capIn  = document.getElementById('tcap-in');
const capOk  = document.getElementById('tcap-ok');
const capErr = document.getElementById('tcap-err');

/* ══ ÉTAT ══ */
let isOpen = false, step = 0;
let data = {}, files = [], inventory = [];
let capAnswer = 0, onCapOk = null;

/* ══ OPEN / CLOSE ══ */
function openChat() {
  isOpen = true; chat.classList.add('open');
  chat.setAttribute('aria-hidden','false');
  badge.classList.add('off');
  if (step === 0) startConvo();
}
function closeChat() {
  isOpen = false; chat.classList.remove('open');
  chat.setAttribute('aria-hidden','true');
}

/* FAB : clic = toggle */
fab.addEventListener('click', (e) => {
  e.stopPropagation();
  isOpen ? closeChat() : openChat();
});
fab.addEventListener('keydown', e => {
  if (e.key==='Enter'||e.key===' '){ e.preventDefault(); isOpen?closeChat():openChat(); }
});
closeB.addEventListener('click', closeChat);

/* Hover desktop : ouvre au survol, ferme quand la souris quitte */
let leaveTimer = null;
fab.addEventListener('mouseenter', () => {
  clearTimeout(leaveTimer);
  if (!isOpen) openChat();
});
fab.addEventListener('mouseleave', () => {
  leaveTimer = setTimeout(() => {
    if (!chat.matches(':hover')) closeChat();
  }, 500);
});
chat.addEventListener('mouseenter', () => clearTimeout(leaveTimer));
chat.addEventListener('mouseleave', () => {
  leaveTimer = setTimeout(() => {
    if (!fab.matches(':hover')) closeChat();
  }, 700);
});

/* ══ MESSAGES ══ */
const scrollB = () => { msgs.scrollTop = msgs.scrollHeight; };

function addMsg(html, who='bot') {
  const d = document.createElement('div');
  d.className = `mb ${who}`; d.innerHTML = html;
  msgs.insertBefore(d, typ); scrollB();
}
const showTyp = () => { typ.classList.add('on'); scrollB(); };
const hideTyp = () => typ.classList.remove('on');

function botSay(html, opts=[], delay=700) {
  return new Promise(r => {
    showTyp();
    setTimeout(() => { hideTyp(); addMsg(html,'bot'); setQ(opts); r(); }, delay);
  });
}

function setQ(opts) {
  qzone.innerHTML = '';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'tqb'; b.textContent = o;
    b.addEventListener('click', () => {
      if (step === 20) { routeSend(o); return; }
      handle(o);
    });
    qzone.appendChild(b);
  });
}

/* ══ BASE DE CONNAISSANCES ══ */
const KB = [
  { k:['bonjour','salut','hello','cc','coucou'],
    r:"Bonjour ! 👋 Je suis Tom, l'assistant TMBO. Comment puis-je vous aider ?" },
  { k:['merci','super','parfait','nickel'],
    r:"Avec plaisir ! 😊" },
  { k:['prix','cout','coute','coûte','combien'],
    r:"Le tarif dépend du volume et de la prestation. Je peux vous préparer un devis personnalisé !" },
  { k:['carton','emballage','emballer'],
    r:"Conseil pro : doublez le fond et notez la pièce de destination sur le côté 😉" },
  { k:['piano','lourd','machine','industriel'],
    r:"Pas de problème pour les objets lourds — TMBO dispose du matériel adapté." },
  { k:['assur','responsabilit'],
    r:"TMBO est assuré pour vos biens. Signalez les objets de grande valeur avant l'intervention." },
  { k:['archive','papier','document','dossier','confidentiel'],
    r:"Destruction confidentielle d'archives : frais de traitement <strong>offerts</strong>, certificat inclus ✅" },
  { k:['deee','ordinateur','serveur','electronique','informatique'],
    r:"Matériel électronique traité en filière DEEE agréée. Document de suivi fourni." },
  { k:['mobilier','meuble','bureau','siege','armoire'],
    r:"Mobilier de bureau : on reprend, recycle ou revend. Éco-responsable, rien ne part à la benne." },
  { k:['gravat','gravas','dechet','chantier','toxique','chimique','amiante','huile','pneu','beton'],
    r:"⚠️ TMBO <strong>n'enlève pas</strong> les gravats, déchets de chantier, produits toxiques, amiante, huiles ou pneus.<br>Contactez votre mairie ou une déchetterie agréée." },
  { k:['garde','stockage','stocker','entrepot'],
    r:"Notre entrepôt de <strong>1 500 m² sécurisé</strong> à Bobigny. Voulez-vous créer un inventaire de vos objets ?" },
  { k:['urgent','rapidement','vite'],
    r:"On répond sous 24h et peut intervenir dès le lendemain ! 🚀" },
  { k:['paris','idf','ile-de-france','banlieue'],
    r:"On intervient sur <strong>Paris et toute l'Île-de-France</strong>." },
  { k:['telephone','appeler','numero'],
    r:"📞 <strong>01 48 57 47 44</strong> · Lun–Ven 9h30–18h30" },
  { k:['email','mail'],
    r:"✉️ <strong>contact@tmbo.fr</strong>" },
  { k:['adresse','bobigny'],
    r:"28 Av. de la Division Leclerc, 93000 Bobigny." },
  { k:['recyclage','ecologie','environnement'],
    r:"On valorise 100 % de ce qu'on enlève : réemploi, recyclage, filières agréées 🌱" },
  { k:['horaire','heure','ouvert'],
    r:"Lun–Ven : 9h30–18h30. Fermés le week-end." },
  { k:['demenag','transfert'],
    r:"Déménagement pro ou particulier — transfert administratif, industriel, manutention." },
  { k:['particulier','maison','appartement','succession'],
    r:"On intervient aussi chez les particuliers : déménagement, débarras, succession." },
];

function findKB(txt) {
  const t = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  for (const e of KB) {
    if (e.k.some(k => t.includes(k))) return e.r;
  }
  return null;
}

/* ══ SCÉNARIO ══ */
async function startConvo() {
  step = 1;
  await botSay(
    "Bonjour ! 👋 Je suis <strong>Tom</strong>, l'assistant TMBO.<br>Que puis-je faire pour vous ?",
    ['📋 Demander un devis','❓ Poser une question','📞 Nous appeler'], 600
  );
}

async function handle(txt) {
  if (!txt.trim()) return;
  qzone.innerHTML = '';
  addMsg(txt, 'usr');
  input.value = ''; input.style.height = 'auto';

  if (/appel|01 48/i.test(txt)) {
    await botSay('📞 <strong>01 48 57 47 44</strong><br>Lun–Ven · 9h30–18h30'); return;
  }

  /* Mode KB libre */
  if (step === 99) {
    if (/inventaire|activer/i.test(txt)) {
      inv.classList.add('on');
      await botSay("📦 Ajoutez vos objets ci-dessus. Quand c'est bon, je prépare votre devis."); return;
    }
    if (/oui|devis|commencer/i.test(txt)) { step=2; await askPrestation(); return; }
    const kb = findKB(txt);
    if (kb) {
      await botSay(kb);
      if (/devis|tarif|archive|demenag|garde/i.test(txt))
        setTimeout(() => setQ(['📋 Demander un devis','Non merci']), 200);
    } else {
      await botSay("Désolé, je n'ai pas bien compris 😅 Reformulez ou :", ['📋 Demander un devis','📞 Nous appeler']);
    }
    return;
  }

  /* Menu accueil */
  if (step === 1) {
    if (/question|renseign|info/i.test(txt)) {
      step = 99; await botSay('Posez votre question 👂'); return;
    }
    step = 2; await askPrestation(); return;
  }

  /* Parcours devis */
  if (step===2)  { data.type=txt;    step=3;  await botSay('Votre <strong>prénom</strong> ?'); return; }
  if (step===3)  { data.prenom=txt;  step=4;  await botSay('Votre <strong>nom</strong> ?'); return; }
  if (step===4)  { data.nom=txt;     step=5;  await botSay('Votre <strong>email</strong> ?'); return; }
  if (step===5)  { data.email=txt;   step=6;  await botSay('Votre <strong>téléphone</strong> ?'); return; }
  if (step===6)  { data.tel=txt;     step=7;  await botSay("Adresse d'intervention ? <em>(rue)</em>"); return; }
  if (step===7)  { data.adresse=txt; step=8;  await botSay('Code postal ?'); return; }
  if (step===8)  { data.cp=txt;      step=9;  await botSay('Décrivez votre besoin<br><em>(volume, accès, étage…)</em>'); return; }
  if (step===9)  {
    data.detail=txt; step=10;
    if (/garde|stock/i.test(data.type+' '+txt)) {
      await botSay("Souhaitez-vous un <strong>inventaire</strong> de vos objets à stocker ?",
        ['✅ Oui','➡️ Non, continuer']);
    } else { step=11; await askDelai(); }
    return;
  }
  if (step===10) {
    if (/oui/i.test(txt)) { inv.classList.add('on'); }
    step=11; await askDelai(); return;
  }
  if (step===11) { data.delai=txt; step=20; await buildSummary(); return; }
  if (step>=20)  {
    if (/nouvelle|recommencer/i.test(txt)) resetChat();
    else await botSay('Pour toute question : <strong>01 48 57 47 44</strong> 😊');
  }
}

async function askPrestation() {
  await botSay('Quelle prestation vous intéresse ?', [
    '📄 Destruction archives','💻 Déchets électroniques',
    '🏢 Débarras locaux pro','🏠 Débarras particulier',
    '🚛 Déménagement','🔒 Garde meubles','❓ Autre'
  ]);
}
async function askDelai() {
  await botSay('Quel délai souhaitez-vous ?',
    ['⚡ Urgent (48h)','📅 Cette semaine','🗓 Ce mois-ci','📌 À planifier']);
}

/* ══ RÉCAP + ENVOI ══ */
async function buildSummary() {
  const invStr = inventory.length ? '<br>• <b>Inventaire</b> : '+inventory.join(' / ') : '';
  const fjStr  = files.length ? '<br>• <b>Fichiers</b> : '+files.map(f=>f.name).join(', ') : '';
  await botSay(`✅ <strong>Récapitulatif :</strong><br>
• <b>Prestation</b> : ${data.type}<br>
• <b>Contact</b> : ${data.prenom} ${data.nom}<br>
• <b>Email</b> : ${data.email}<br>
• <b>Tél</b> : ${data.tel}<br>
• <b>Adresse</b> : ${data.adresse}, ${data.cp}<br>
• <b>Délai</b> : ${data.delai}<br>
• <b>Besoin</b> : ${data.detail}${invStr}${fjStr}`, [], 500);

  await botSay('Comment souhaitez-vous envoyer ?',
    ['📨 Envoyer directement à TMBO','📧 Par email (mon client mail)'], 400);
}

async function routeSend(choice) {
  addMsg(choice,'usr'); qzone.innerHTML='';
  if (hp.value) return;
  if (/email|client|mail/i.test(choice)) {
    showCaptcha(() => {
      const mailto = `mailto:contact@tmbo.fr?subject=${
        encodeURIComponent('Devis '+data.type+' - '+data.prenom+' '+data.nom)
      }&body=${encodeURIComponent(buildBody())}`;
      window.location.href = mailto;
      addMsg("📧 Votre client email s'ouvre avec le message pré-rempli.",'bot');
      showNewBtn();
    });
  } else {
    showCaptcha(async () => { await sendW3F(); });
  }
}

function buildBody() {
  return `Prestation : ${data.type}
Prénom / Nom : ${data.prenom} ${data.nom}
Email : ${data.email}
Téléphone : ${data.tel}
Adresse : ${data.adresse}, ${data.cp}
Délai : ${data.delai}

Besoin :
${data.detail}
${inventory.length ? '\nInventaire :\n'+inventory.join('\n') : ''}
${files.length ? '\nFichiers joints : '+files.map(f=>f.name).join(', ') : ''}`;
}

async function sendW3F() {
  addMsg('⏳ Envoi en cours…','bot');
  const fd = new FormData();
  fd.append('access_key', WEB3FORMS_KEY);
  fd.append('subject', `Devis ${data.type} — ${data.prenom} ${data.nom}`);
  fd.append('from_name', 'Tom TMBO Chatbot');
  fd.append('message', buildBody());
  fd.append('email', data.email);
  fd.append('botcheck','');
  files.forEach(f => fd.append('fichier', f));
  try {
    const res = await fetch('https://api.web3forms.com/submit', { method:'POST', body:fd });
    const j = await res.json();
    if (j.success) {
      addMsg('✅ <strong>Demande envoyée !</strong><br>Tom vous recontactera sous 24h 🚛','bot');
    } else throw new Error(j.message);
  } catch(e) {
    addMsg(`⚠️ Erreur : ${e.message}<br>Appelez le <strong>01 48 57 47 44</strong>`,'bot');
  }
  showNewBtn();
}

/* ══ CAPTCHA ══ */
function showCaptcha(cb) {
  const a = Math.floor(Math.random()*12)+2, b = Math.floor(Math.random()*10)+1;
  capAnswer = a+b; capQ.textContent = `${a} + ${b}`;
  capIn.value=''; capErr.style.display='none';
  cap.classList.add('on'); onCapOk=cb;
  setTimeout(()=>capIn.focus(),80); scrollB();
}
capOk.addEventListener('click',()=>{
  if (parseInt(capIn.value,10)===capAnswer) {
    cap.classList.remove('on'); capErr.style.display='none';
    if (onCapOk){onCapOk();onCapOk=null;}
  } else { capErr.style.display='block'; capIn.value=''; capIn.focus(); }
});
capIn.addEventListener('keydown',e=>{ if(e.key==='Enter') capOk.click(); });

/* ══ INVENTAIRE ══ */
invAdd.addEventListener('click',()=>{
  const v=invTxt.value.trim(); if(!v){invTxt.focus();return;}
  inventory.push(v); invTxt.value=''; renderInv(); invTxt.focus();
});
invTxt.addEventListener('keydown',e=>{ if(e.key==='Enter'){e.preventDefault();invAdd.click();} });
function renderInv(){
  invLst.innerHTML='';
  inventory.forEach((o,i)=>{
    const d=document.createElement('div'); d.className='tic';
    d.innerHTML=`<span>📦 ${o}</span><button title="Supprimer">✕</button>`;
    d.querySelector('button').addEventListener('click',()=>{inventory.splice(i,1);renderInv();});
    invLst.appendChild(d);
  });
}

/* ══ FICHIERS ══ */
const ALLOWED=['image/jpeg','image/png','image/gif','image/webp',
  'application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
fi.addEventListener('change',()=>{
  Array.from(fi.files).forEach(f=>{
    if(files.length>=5){alert('Maximum 5 fichiers.');return;}
    if(!ALLOWED.includes(f.type)){alert(`Non autorisé : ${f.name}`);return;}
    if(!files.find(x=>x.name===f.name)){files.push(f);renderFiles();}
  }); fi.value='';
});
function renderFiles(){
  flist.innerHTML='';
  files.forEach((f,i)=>{
    const ic=f.type.startsWith('image')?'🖼':f.type==='application/pdf'?'📄':f.type.includes('word')?'📝':'📊';
    const d=document.createElement('div'); d.className='tfc';
    const nm=f.name.length>18?f.name.slice(0,16)+'…':f.name;
    d.innerHTML=`${ic} ${nm}<button>&#10005;</button>`;
    d.querySelector('button').addEventListener('click',()=>{files.splice(i,1);renderFiles();});
    flist.appendChild(d);
  });
}

/* ══ SAISIE ══ */
send.addEventListener('click',()=>{
  const txt=input.value.trim(); if(!txt) return;
  if(step===20){routeSend(txt);return;}
  handle(txt);
});
input.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send.click();}
});
input.addEventListener('input',()=>{
  input.style.height='auto';
  input.style.height=Math.min(input.scrollHeight,80)+'px';
});

/* ══ NOUVELLE DEMANDE ══ */
function showNewBtn(){
  setTimeout(()=>{
    const b=document.createElement('button');
    b.className='tqb'; b.style.margin='4px 11px 8px';
    b.textContent='↩ Nouvelle demande';
    b.addEventListener('click',resetChat);
    msgs.insertBefore(b,typ); scrollB();
  },500);
}
function resetChat(){
  step=0; data={}; inventory=[]; files=[];
  renderFiles(); renderInv();
  msgs.innerHTML=''; msgs.appendChild(typ);
  inv.classList.remove('on'); cap.classList.remove('on');
  startConvo();
}

})();
