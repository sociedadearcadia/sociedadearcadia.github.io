/* Salão Principal de Hogwarts: funções compartilhadas por todas as páginas do Salão.
   Entrada: senha do clube (a mesma do sprint) + senha do Salão + código pessoal de cada participante.
   A senha do Salão e os códigos ficam embaralhados (SHA-256) no Firestore; as regras conferem no servidor. */
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS={get(k,d){try{const v=localStorage.getItem('hogwarts:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('hogwarts:'+k,JSON.stringify(v))}catch(e){}}};
const FUSO='America/Campo_Grande';
/* horário de Campo Grande (UTC-4, sem horário de verão) */
const T=(y,m,d,h=0,mi=0)=>Date.UTC(y,m-1,d,h+4,mi);
const DATAS_PADRAO={
  chapeu:T(2026,11,25),biblioteca:T(2026,11,25),
  r1:T(2026,11,30),r2:T(2026,12,5),r3:T(2026,12,11),r4:T(2026,12,18),misteriosFim:T(2026,12,27,23,59),
  protecoes:T(2026,12,19,8),protecoesFim:T(2026,12,27,23,59),
  espelho:T(2026,12,11),espelhoFim:T(2026,12,18,23,59),
  correio:T(2026,12,19),correioFim:T(2026,12,24,23,59),
  coruja:0,corujaFim:T(2027,1,31,23,59),
  questionarioFim:T(2026,12,18,23,59)};
const DATAS_NOMES={chapeu:'Chapéu Seletor',biblioteca:'Biblioteca de Hogwarts',r1:'Rodada 1 (caps. 1 a 4)',r2:'Rodada 2 (caps. 5 a 7)',r3:'Rodada 3 (caps. 8 a 12)',r4:'Rodada 4 (caps. 13 a 17)',
  misteriosFim:'Fim dos Mistérios',protecoes:'Sete Proteções (abre)',protecoesFim:'Sete Proteções (fecha)',espelho:'Espelho de Ojesed (abre)',espelhoFim:'Espelho de Ojesed (prazo)',
  correio:'Correio-Coruja: carta (abre)',correioFim:'Correio-Coruja: carta (prazo)',coruja:'A Coruja Voltou (abre após a estreia)',corujaFim:'A Coruja Voltou (fecha)',questionarioFim:'Lembrete do questionário oficial (some depois)'};
const CASAS={grifinoria:{n:'Grifinória',a:'leão'},sonserina:{n:'Sonserina',a:'serpente'},corvinal:{n:'Corvinal',a:'águia'},lufalufa:{n:'Lufa-Lufa',a:'texugo'}};
const PERSONAGENS={harry:'Harry Potter',hermione:'Hermione Granger',rony:'Rony Weasley',draco:'Draco Malfoy',neville:'Neville Longbottom',hagrid:'Rúbeo Hagrid',snape:'Severo Snape',dumbledore:'Alvo Dumbledore'};
const GERAL_PADRAO={questionario:'/leitura/questionario/',sala:'',org:11,leitura:31,pausa:17,prosa:11};

/* ---------- ícones (traço dourado fino, grade 32x32) ---------- */
const juba=(()=>{let d='';const n=22;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2-Math.PI/2,r=i%2?11.6:13.6,x=16+r*Math.cos(a),y=16.5+r*Math.sin(a);d+=(i?(i%2?' Q':' '):'M')+x.toFixed(1)+' '+y.toFixed(1)}return d})();
const IC={
  leao:'<path d="'+juba+'"/><path d="M11.2 14c0-2.9 2.1-4.8 4.8-4.8s4.8 1.9 4.8 4.8v2.6c0 3.4-2.1 5.9-4.8 5.9s-4.8-2.5-4.8-5.9z"/><circle cx="13.9" cy="14.6" r=".9" class="f"/><circle cx="18.1" cy="14.6" r=".9" class="f"/><path d="M14.7 17.6h2.6L16 19z" class="f"/><path d="M16 19v1.2M14.2 20.8c.6.6 1.2.7 1.8.2.6.5 1.2.4 1.8-.2"/><path d="M11.4 10.4l-1.4-1.6M20.6 10.4l1.4-1.6"/>',
  serpente:'<path d="M20.5 7.2c-3.6-1.4-8.6-.6-8.6 3.2 0 4.2 9.8 3.8 9.8 8.8 0 4.4-5.6 6.6-10.4 5.4-2.6-.7-3.7-2.3-3.3-4"/><path d="M17.6 9.8c-1.2-.3-2.6 0-2.6.8 0 1.5 7 2.4 7 7.8"/><path d="M20 5.4c1.8-1.5 5-1.3 5.8.6.8 1.9-1 3.6-3.4 3.4-1.2-.1-2.2-.8-2.7-1.8"/><circle cx="23.6" cy="6.6" r=".8" class="f"/><path d="M25.8 7.6l2.2.6M28 8.2l1-1M28 8.2l.8 1.2"/>',
  aguia:'<path d="M23 27c.4-4.2-.6-7.5-2.6-9.6 1.6-1.8 2.3-4.2 1.7-6.6C21.3 7.3 18.2 5.2 14.4 5.6 10.6 6 8 8.4 6.6 11.6l-2.4 1.6 2.6.7c-.1 1.6.8 2.7 2.1 2.8 1.6.1 2.5-1 2.6-2.4 2.2.3 3.6 1.5 4 3.4-1.4 3.2-3.4 5.8-5.8 9.3"/><circle cx="12.6" cy="10.4" r="1" class="f"/><path d="M15.2 9.6c1.4-.6 2.8-.5 4 .3"/><path d="M17 20.5c1.4.6 2.6 1.7 3.4 3.1M14.6 23.5c1.3.4 2.5 1.2 3.3 2.4"/>',
  texugo:'<path d="M16 5.2c-5.4 0-9.4 4.3-9.4 10.2 0 6.2 4.2 11.4 9.4 11.4s9.4-5.2 9.4-11.4c0-5.9-4-10.2-9.4-10.2z"/><path d="M13.6 5.6c-.6 5.3.1 10.4 1.6 14.6M18.4 5.6c.6 5.3-.1 10.4-1.6 14.6"/><path d="M8.6 10.6l4.4 5.2M23.4 10.6l-4.4 5.2"/><circle cx="12" cy="15.6" r=".9" class="f"/><circle cx="20" cy="15.6" r=".9" class="f"/><ellipse cx="16" cy="23" rx="1.8" ry="1.2" class="f"/><path d="M7.8 7.6c-1-1-1-2.6.2-3.2 1.1-.5 2.2.3 2.4 1.4M24.2 7.6c1-1 1-2.6-.2-3.2-1.1-.5-2.2.3-2.4 1.4"/>',
  chapeu:'<path d="M3.5 25.2c4 2.4 21 2.4 25 0"/><path d="M6.8 24.6c2.2-1.4 3.4-4.2 4.2-8 .9-4.4 2.6-9.6 9.6-12.6-1.9 2.8-1.6 5.2-.1 7.3 1.6 2.3 2.4 5.4 1.8 8.6 2.3 1 4.3 2.6 4.6 4.5"/><path d="M12.3 18.4c2.1 1.2 4.4 1.3 6.6 0M13 21.6c1.8.7 3.6.7 5.2 0"/><path d="M13.4 13.2c.8.6 1.7.8 2.6.6"/><path d="M24.5 6.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" class="f"/>',
  livro:'<path d="M3.5 8.5c4-1.6 8.3-1.4 12.5 1 4.2-2.4 8.5-2.6 12.5-1V25c-4-1.6-8.3-1.4-12.5 1-4.2-2.4-8.5-2.6-12.5-1z"/><path d="M16 9.5V26"/><path d="M6.6 12.4c2.4-.6 4.7-.4 6.9.6M6.6 16c2.4-.6 4.7-.4 6.9.6M19 13c2.2-1 4.5-1.2 6.9-.6M19 16.6c2.2-1 4.5-1.2 6.9-.6"/><path d="M24 2.8c.9 1.1 1.3 2 1.3 2.8a1.3 1.3 0 0 1-2.6 0c0-.8.4-1.7 1.3-2.8z" class="f"/>',
  chave:'<circle cx="9.5" cy="19" r="4"/><circle cx="9.5" cy="19" r="1.6"/><path d="M13.5 19h14M23.5 19v4M27 19v3"/><path d="M8.2 14.6C6.4 11.2 3.6 9.6 1.8 9.9c1.6 1.2 2.1 2.8 2.4 4.6M7 13.6c-.6-1.6-1.8-2.6-3.2-3"/><path d="M11 14.6c1.8-3.4 4.6-5 6.4-4.7-1.6 1.2-2.1 2.8-2.4 4.6M12.2 13.6c.6-1.6 1.8-2.6 3.2-3"/>',
  espelho:'<ellipse cx="16" cy="12.6" rx="7.4" ry="9.6"/><ellipse cx="16" cy="12.6" rx="5" ry="7.2"/><path d="M12.3 21.4L10 28.5M19.7 21.4l2.3 7.1M7.6 28.5h16.8"/><path d="M16 1.6v1.4"/><path d="M14.6 8.6l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" class="f"/>',
  coruja:'<path d="M8.6 9.6C8.6 6.4 11.8 4.4 16 4.4s7.4 2 7.4 5.2v8.6c0 5.4-3.2 9.4-7.4 9.4s-7.4-4-7.4-9.4z"/><path d="M8.6 7.4L7.4 3.8l3.4 1.6M23.4 7.4l1.2-3.6-3.4 1.6"/><circle cx="12.8" cy="11.6" r="2.4"/><circle cx="19.2" cy="11.6" r="2.4"/><circle cx="12.8" cy="11.6" r=".8" class="f"/><circle cx="19.2" cy="11.6" r=".8" class="f"/><path d="M15.2 14.6h1.6L16 16z" class="f"/><rect x="11.6" y="19.4" width="8.8" height="6" rx=".8"/><path d="M11.8 19.8l4.2 3 4.2-3"/>',
  pedra:'<path d="M10 5h12l5 7-11 15L5 12z"/><path d="M5 12h22M10 5l3 7 3 15 3-15 3-7M13 12l3-7 3 7"/>',
  pergaminho:'<path d="M9 4.5h13.5a2.6 2.6 0 0 1 2.6 2.6v17.4a2.6 2.6 0 0 1-2.6 2.6H9"/><path d="M9 4.5a2.6 2.6 0 0 0-2.6 2.6V9h5.2V7.1A2.6 2.6 0 0 0 9 4.5zM9 27.1a2.6 2.6 0 0 1-2.6-2.6v-1.9h5.2v1.9A2.6 2.6 0 0 1 9 27.1z"/><path d="M14.4 10.6h6.6M14.4 14.4h6.6M14.4 18.2h4"/><circle cx="20.2" cy="22.4" r="1.9" class="f"/>',
  relogio:'<path d="M8 4h16M8 28h16"/><path d="M9.6 4c0 5.8 6.4 8 6.4 12s-6.4 6.1-6.4 12M22.4 4c0 5.8-6.4 8-6.4 12s6.4 6.1 6.4 12"/><path d="M12.4 26c.8-2.1 2.1-3.3 3.6-3.3s2.8 1.2 3.6 3.3z" class="f"/>',
  balao:'<path d="M5 7h22a2 2 0 0 1 2 2v11.4a2 2 0 0 1-2 2H15l-6 4.6v-4.6H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><path d="M9 12.4h14M9 16.8h8.6"/>',
  calendario:'<rect x="4.5" y="6.5" width="23" height="21" rx="2.6"/><path d="M4.5 12.5h23M10.5 4v5M21.5 4v5"/><path d="M18.2 16.2a4.2 4.2 0 1 0 3.7 6.4 3.4 3.4 0 0 1-3.7-6.4z" class="f"/>',
  camera:'<rect x="3.5" y="9" width="18" height="14" rx="2.4"/><path d="M21.5 14l7-4v12l-7-4"/>',
  trem:'<path d="M6 22V12a4 4 0 0 1 4-4h9v14z"/><path d="M19 12h4.5l2.5 4v6h-7"/><circle cx="10" cy="24" r="2.4"/><circle cx="21.5" cy="24" r="2.4"/><path d="M9 8V5h3v3M9 14h6"/><path d="M4 26.5h24"/>',
  brilho:'<path d="M13.4 4.6l2.2 6.6 6.6 2.2-6.6 2.2-2.2 6.6-2.2-6.6-6.6-2.2 6.6-2.2z"/><path d="M24 18.6l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1z" class="f"/>',
  cadeado:'<rect x="7" y="14" width="18" height="13" rx="2.4"/><path d="M11 14v-3.6a5 5 0 0 1 10 0V14"/><circle cx="16" cy="19.6" r="1.6" class="f"/><path d="M16 21v2.6"/>'
};
const ICASA={grifinoria:'leao',sonserina:'serpente',corvinal:'aguia',lufalufa:'texugo'};
function icone(k,cls){return '<svg class="hg-ic'+(cls?' '+cls:'')+'" viewBox="0 0 32 32" aria-hidden="true">'+(IC[k]||IC.brilho)+'</svg>'}
function casaIc(c){return CASAS[c]?'<svg class="hg-ic c-'+c+'" viewBox="0 0 32 32" role="img" aria-label="'+CASAS[c].n+' ('+CASAS[c].a+')"><title>'+CASAS[c].n+'</title>'+IC[ICASA[c]]+'</svg>':''}
function nomeCasa(nome,casa){return '<span class="hg-nome">'+casaIc(casa)+'<span>'+esc(nome)+'</span></span>'}

/* ---------- datas ---------- */
const fmtD=ms=>new Date(ms).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',timeZone:FUSO});
const fmtDH=ms=>{const d=new Date(ms),h=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:FUSO});return fmtD(ms)+(h==='00:00'?'':' às '+h)};
const fmtH=ms=>new Date(ms).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:FUSO});
/* estado de uma atividade: antes, aberta, encerrada */
function janela(datas,ini,fim){const agora=Date.now(),a=+datas[ini]||0,f=fim?(+datas[fim]||0):0;
  if(!a&&ini==='coruja')return{antes:true,txt:'Em breve',aberta:false};
  if(agora<a)return{antes:true,aberta:false,txt:'Disponível em '+fmtD(a)};
  if(f&&agora>f)return{fim:true,aberta:false,txt:'Encerrado'};
  return{aberta:true,txt:''}}

/* ---------- firebase ---------- */
const load=src=>new Promise((ok,no)=>{const sc=document.createElement('script');sc.src=src;sc.onload=ok;sc.onerror=no;document.head.appendChild(sc)});
let fbP=null;
function firebaseCarrega(){if(!fbP)fbP=(async()=>{const V='10.12.2';
  if(!window.ARCADIA_FIREBASE)await load('/config.js');
  if(!window.firebase||!firebase.firestore){await load(`https://www.gstatic.com/firebasejs/${V}/firebase-app-compat.js`);
    await load(`https://www.gstatic.com/firebasejs/${V}/firebase-auth-compat.js`);await load(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore-compat.js`)}
  if(!firebase.apps.length)firebase.initializeApp(window.ARCADIA_FIREBASE);
  if(window.HG_EMULADOR){try{firebase.auth().useEmulator('http://127.0.0.1:9099');firebase.firestore().useEmulator('127.0.0.1',8080)}catch(e){}}
  return firebase})();return fbP}
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('hogwarts|'+s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const normSenha=s=>String(s||'').trim().toLowerCase();
/* código pessoal: NOME-1ABC. O nome antes do traço diz de quem é. */
function normCodigo(s){s=String(s||'').toUpperCase().replace(/\s+/g,'').replace(/[–—_]/g,'-');
  if(!s.includes('-')){const m=s.match(/^([A-Z]+)(\d[A-Z0-9]*)$/);if(m)s=m[1]+'-'+m[2]}return s}
const pidDoCodigo=c=>{const i=c.lastIndexOf('-');return i>0?c.slice(0,i).toLowerCase():''};

/* ---------- avisos ---------- */
let tt;function toast(m){let t=$('hgToast');if(!t){t=document.createElement('div');t.id='hgToast';t.className='hg-toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,3800)}
function dialogo(html,{perg=true}={}){const d=document.createElement('div');d.className='hg-dlg';d.innerHTML='<div class="'+(perg?'hg-perg':'hg-painel')+'">'+html+'</div>';document.body.appendChild(d);
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-fecha]'))d.remove()});return d}

/* ---------- neve (leve: poucos flocos, para quando a aba some) ---------- */
function neve(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let c=$('hgNeve');if(!c){c=document.createElement('canvas');c.id='hgNeve';c.setAttribute('aria-hidden','true');document.body.prepend(c)}
  const x=c.getContext('2d');let W,H,d,fl=[],raf=0,ult=0;
  function tam(){d=Math.min(devicePixelRatio||1,2);W=c.width=innerWidth*d;H=c.height=innerHeight*d;const n=Math.round(Math.min(70,innerWidth*innerHeight/14000));
    fl=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*1.8+.6)*d,v:(Math.random()*18+12)*d,o:Math.random()*6.28,a:Math.random()*.5+.35}))}
  function desenha(t){const dt=Math.min(.05,(t-(ult||t))/1000);ult=t;x.clearRect(0,0,W,H);x.fillStyle='#fff';
    for(const f of fl){f.y+=f.v*dt;f.x+=Math.sin(f.o+t/1600)*6*d*dt;if(f.y>H+5){f.y=-5;f.x=Math.random()*W}x.globalAlpha=f.a;x.beginPath();x.arc(f.x,f.y,f.r,0,6.283);x.fill()}
    raf=requestAnimationFrame(desenha)}
  tam();addEventListener('resize',tam);raf=requestAnimationFrame(desenha);
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);ult=0;if(document.visibilityState==='visible')raf=requestAnimationFrame(desenha)});
  return{parar(){cancelAnimationFrame(raf);c.hidden=true},voltar(){c.hidden=false;cancelAnimationFrame(raf);ult=0;raf=requestAnimationFrame(desenha)}}}

/* ---------- entrada no Salão ---------- */
function telaClube(db,uid){return new Promise(done=>{const g=document.createElement('div');g.className='hg-gate';
  g.innerHTML=`<form class="hg-perg hg-form hg-centro"><div class="hg-topo"><span class="hg-ouro" style="color:#7a4a12">${icone('cadeado','hg-ic-grande')}</span><p class="hg-lbl" style="color:#7a4a12">Só para integrantes</p><h2>Senha do clube</h2></div>
  <p class="hg-muted hg-small">Primeiro, a senha da Sociedade Arcádia (a mesma do sprint). Você só digita uma vez neste aparelho.</p>
  <label class="hg-campo"><span>Senha do clube</span><input class="hg-in" type="password" autocomplete="current-password" required></label>
  <p class="hg-erro" hidden></p><button class="hg-btn">Continuar</button></form>`;document.body.appendChild(g);
  const f=g.querySelector('form'),inp=f.querySelector('input'),er=f.querySelector('.hg-erro'),bt=f.querySelector('button');setTimeout(()=>inp.focus(),80);
  f.onsubmit=async ev=>{ev.preventDefault();const chave=inp.value.trim().toLowerCase();if(!chave)return;bt.disabled=true;er.hidden=true;
    try{await db.collection('membros').doc(uid).set({chave,em:Date.now()});try{localStorage.setItem('arcadia:membroOk',JSON.stringify(uid))}catch(e){}g.remove();done()}
    catch(e){er.textContent='Senha incorreta. Confira com a administração do clube.';er.hidden=false}bt.disabled=false}})}
function telaSalao(db,uid){return new Promise(done=>{const g=document.createElement('div');g.className='hg-gate';
  g.innerHTML=`<form class="hg-perg hg-form"><div class="hg-topo"><span style="color:#7a4a12">${icone('chapeu','hg-ic-grande')}</span><h2>Acesso ao Salão Principal</h2></div>
  <p class="hg-centro">Esta área é reservada às integrantes da LC Especial de Natal. Informe a senha para continuar.</p>
  <label class="hg-campo"><span>Senha de acesso</span><input class="hg-in" name="s" type="password" autocomplete="off" required></label>
  <label class="hg-campo"><span>Seu código pessoal</span><input class="hg-in" name="c" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Ex.: NOME-1ABC" required>
  <small class="hg-muted" style="font-size:14px">É o código que a administração mandou só para você. Ele mostra ao site quem está entrando.</small></label>
  <p class="hg-erro" hidden></p><button class="hg-btn">Entrar no Salão Principal</button>
  <p class="hg-centro hg-small"><a href="/integrantes/">Voltar à Área das integrantes</a></p></form>`;document.body.appendChild(g);
  const f=g.querySelector('form'),er=f.querySelector('.hg-erro'),bt=f.querySelector('button');setTimeout(()=>f.s.focus(),80);
  f.onsubmit=async ev=>{ev.preventDefault();er.hidden=true;const s=normSenha(f.s.value),c=normCodigo(f.c.value),pid=pidDoCodigo(c);
    if(!s||!pid){er.textContent='Confira a senha e o código (ele tem um traço, como NOME-1ABC).';er.hidden=false;return}
    bt.disabled=true;bt.textContent='Conferindo…';
    try{await db.collection('hgSessoes').doc(uid).set({senha:await sha(s),cod:await sha(c),pid,em:Date.now()});
      g.querySelector('form').innerHTML=`<div class="hg-topo"><span style="color:#7a4a12">${icone('pergaminho','hg-ic-grande')}</span><h2>Anote seu código</h2></div>
        <p class="hg-centro">Seu código pessoal é</p><p class="hg-centro" style="font:800 26px var(--ui);letter-spacing:.12em;color:#4a2f0f">${esc(c)}</p>
        <p class="hg-centro hg-muted">Guarde-o: você vai precisar dele para entrar por outro celular ou navegador. Não passe para ninguém, porque ele mostra ao site que é você.</p>
        <button class="hg-btn" type="button">Já anotei</button>`;
      g.querySelector('button').onclick=()=>{g.remove();done()}}
    catch(e){console.warn(e);er.textContent='Senha ou código incorretos. Confira com a administração.';er.hidden=false;bt.disabled=false;bt.textContent='Entrar no Salão Principal'}}})}

let ctxP=null;
/* devolve {db,uid,pid,nome,casa,datas,geral} depois de passar pelas duas senhas */
function entrar(){if(!ctxP)ctxP=(async()=>{
  try{await firebaseCarrega()}catch(e){throw new Error('sem-conexao')}
  const auth=firebase.auth(),db=firebase.firestore();
  let u=await new Promise(ok=>{const off=auth.onAuthStateChanged(x=>{off();ok(x)})});if(!u)u=(await auth.signInAnonymously()).user;const uid=u.uid;
  /* 1) senha do clube */
  let membro=false;try{membro=JSON.parse(localStorage.getItem('arcadia:membroOk')||'""')===uid}catch(e){}
  if(!membro){try{membro=(await db.collection('membros').doc(uid).get()).exists}catch(e){}if(!membro)await telaClube(db,uid);try{localStorage.setItem('arcadia:membroOk',JSON.stringify(uid))}catch(e){}}
  /* 2) senha do Salão + código pessoal (vale para este aparelho até a senha ou o código mudarem) */
  let pessoa=null,ses=null;
  for(let i=0;i<5&&!pessoa;i++){
    try{const d=await db.collection('hgSessoes').doc(uid).get();ses=d.exists?d.data():null}catch(e){ses=null}
    if(ses){try{const p=await db.collection('hgPessoas').doc(ses.pid).get();if(p.exists)pessoa=p.data()}catch(e){}}
    if(!pessoa)await telaSalao(db,uid)}
  if(!pessoa)throw new Error('sem-acesso');
  const pid=ses.pid;LS.set('pid',pid);
  const [perf,dt,ge]=await Promise.all([db.collection('hgPerfis').doc(pid).get().catch(()=>null),db.collection('hgConfig').doc('datas').get().catch(()=>null),db.collection('hgConfig').doc('geral').get().catch(()=>null)]);
  const datas=Object.assign({},DATAS_PADRAO,(dt&&dt.exists)?dt.data():{}),geral=Object.assign({},GERAL_PADRAO,(ge&&ge.exists)?ge.data():{});
  return{db,uid,pid,nome:pessoa.nome,casa:perf&&perf.exists?perf.data().casa:null,datas,geral}})();return ctxP}
async function sair(){try{localStorage.removeItem('hogwarts:pid')}catch(e){}try{const c=await ctxP;await c.db.collection('hgSessoes').doc(c.uid).delete()}catch(e){}location.href='/integrantes/'}

/* ---------- casa de Hogwarts (informada pela participante, uma vez) ---------- */
function pedirCasa(ctx,{titulo='Qual é a sua casa de Hogwarts?',texto=''}={}){return new Promise(done=>{
  const d=dialogo(`<div class="hg-form"><div class="hg-topo"><span style="color:#7a4a12">${icone('chapeu','hg-ic-grande')}</span><h2>${esc(titulo)}</h2></div>
    ${texto?'<p class="hg-centro">'+esc(texto)+'</p>':''}
    <p class="hg-centro hg-small">Você é <b>${esc(ctx.nome)}</b>.</p>
    <div class="hg-casas">${Object.entries(CASAS).map(([k,c])=>`<button type="button" class="hg-casa" data-c="${k}" aria-pressed="false">${casaIc(k)}${c.n}<small>${c.a}</small></button>`).join('')}</div>
    <button type="button" class="hg-btn sec" data-nao>Ainda não sei minha casa</button>
    <div data-teste hidden class="hg-instr">Ainda não passou pelo Chapéu Seletor? Faça o teste oficial, descubra sua casa e volte para receber sua missão!<div class="hg-btns" style="margin-top:10px;justify-content:flex-start"><a class="hg-btn peq" href="https://www.harrypotter.com/sorting-hat" target="_blank" rel="noopener">Descobrir minha casa</a></div></div>
    <p class="hg-erro" hidden></p>
    <button type="button" class="hg-btn" data-ok disabled>Confirmar minha casa</button></div>`);
  let esc_=null;d.addEventListener('click',e=>{if(e.target===d)e.stopImmediatePropagation()},true);
  d.querySelectorAll('.hg-casa').forEach(b=>b.onclick=()=>{esc_=b.dataset.c;d.querySelectorAll('.hg-casa').forEach(o=>o.setAttribute('aria-pressed',o===b));d.querySelector('[data-ok]').disabled=false});
  d.querySelector('[data-nao]').onclick=()=>{d.querySelector('[data-teste]').hidden=false};
  d.querySelector('[data-ok]').onclick=async()=>{if(!esc_)return;const bt=d.querySelector('[data-ok]');bt.disabled=true;
    try{await ctx.db.collection('hgPerfis').doc(ctx.pid).set({nome:ctx.nome,casa:esc_,em:Date.now()});ctx.casa=esc_;d.remove();done(esc_)}
    catch(e){console.warn(e);const er=d.querySelector('.hg-erro');er.textContent='Não deu para salvar agora. Confira a internet e tente de novo.';er.hidden=false;bt.disabled=false}}})}

/* mapa nome/pid -> casa (para mostrar o animal ao lado do nome) */
function casasAoVivo(ctx,cb){return ctx.db.collection('hgPerfis').onSnapshot(q=>{const m={};q.docs.forEach(d=>{const v=d.data();m[d.id]=v.casa;if(v.nome)m['n:'+norm(v.nome)]=v.casa});cb(m)},e=>console.warn('perfis',e))}
const norm=n=>String(n||'').normalize('NFD').replace(/[̀-ͯ]/g,'').trim().toLowerCase();

window.HG={$,esc,LS,T,DATAS_PADRAO,DATAS_NOMES,GERAL_PADRAO,CASAS,PERSONAGENS,IC,icone,casaIc,nomeCasa,fmtD,fmtDH,fmtH,janela,firebaseCarrega,sha,normSenha,normCodigo,pidDoCodigo,
  toast,dialogo,neve,entrar,sair,pedirCasa,casasAoVivo,norm,FUSO};
})();
