/* Montar minha arte: desenha os templates de stories da Sociedade Arcádia (1080x1920 lógico, salva em 4K) */
(function(){
const $=id=>document.getElementById(id);
const W=1080,H=1920,ARCH_TOP=440;
const GOLD='#d6b46c',CREAM='#f4e8da',LILAC='#c9b6f2';

const MODELOS=[
  {id:'atual',nome:'Leitura atual',lbl:'LEITURA ATUAL',est:false,ini:1},
  {id:'lidos',nome:'Lidos no mês',lbl:'LIDOS NO MÊS',est:true,ini:4},
  {id:'ranking',nome:'Ranking do mês',lbl:'MEU RANKING DO MÊS',est:true,num:true,ini:3},
  {id:'adapt',nome:'Adaptações do mês',lbl:'ADAPTAÇÕES DO MÊS',sub:'que eu assisti',est:true,ini:2},
  {id:'proximas',nome:'Próximas leituras',lbl:'PRÓXIMAS LEITURAS',est:false,ini:3},
  {id:'favano',nome:'Favoritos do ano',lbl:'FAVORITOS DO ANO',est:true,num:true,ini:5},
  {id:'meta',nome:'Meta do ano',lbl:'META DE LEITURA',meta:true}
];
const FUNDOS=[
  {id:'todas',nome:'Todas'},{id:'trancas',nome:'Tranças'},{id:'ruiva',nome:'Ruiva'},{id:'cachos',nome:'Sorriso'},
  {id:'cha',nome:'Chá'},{id:'fada',nome:'Fada'},{id:'cachos-lua',nome:'Cachos'},{id:'mesa',nome:'Mesa'},
  {id:'moldura',nome:'Arco'},{id:'estampa',nome:'Estampa',tile:true}
];
const MAX=14;

const LS={get(k,d){try{const v=localStorage.getItem('arcadia:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('arcadia:'+k,JSON.stringify(v))}catch(e){}}};
const ano=new Date().getFullYear();
const S={modelo:LS.get('montarModelo','lidos'),fundo:LS.get('montarFundo','todas'),qtd:{},livros:[],
  meta:LS.get('montarMeta',30),lidosMeta:0,ano:new Date().getMonth()>=10?ano+1:ano};
MODELOS.forEach(m=>S.qtd[m.id]=m.ini||1);
if(!MODELOS.some(m=>m.id===S.modelo))S.modelo='lidos';
if(!FUNDOS.some(f=>f.id===S.fundo))S.fundo='todas';
for(let i=0;i<MAX;i++)S.livros.push({img:null,nota:0});
const modelo=()=>MODELOS.find(m=>m.id===S.modelo);

/* ---------- imagens ---------- */
const imgs={};
function carregar(src){if(imgs[src])return imgs[src];
  imgs[src]=new Promise(ok=>{const i=new Image();i.decoding='async';i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=src});return imgs[src]}
const selo=carregar('/selo-arcadia.png');

/* ---------- desenho ---------- */
function rnd(seed){return()=>(seed=(seed*9301+49297)%233280)/233280}
const CEU=(()=>{const r=rnd(7),a=[];for(let i=0;i<150;i++)a.push({x:r()*W,y:r()*H,r:r()*2+.5,a:.25+r()*.6,f:r()*6.28,v:.6+r()*1.6});return a})();
const BRILHOS=(()=>{const r=rnd(31),a=[];for(let i=0;i<16;i++)a.push({x:r()*W,y:r()*H,k:r()*8+6,a:.4+r()*.5,f:r()*6.28,v:.5+r()*1.2});return a})();
function archPath(x,o=0){x.beginPath();x.moveTo(110+o,1720-o);x.lineTo(110+o,780);x.bezierCurveTo(110+o,ARCH_TOP+o*1.4,970-o,ARCH_TOP+o*1.4,970-o,780);x.lineTo(970-o,1720-o);x.closePath()}
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function brilho(x,X,Y,k,a,cor){x.save();x.globalAlpha=a;x.fillStyle=cor||'#f6e3b0';x.beginPath();x.moveTo(X,Y-k);x.quadraticCurveTo(X,Y,X+k,Y);x.quadraticCurveTo(X,Y,X,Y+k);x.quadraticCurveTo(X,Y,X-k,Y);x.quadraticCurveTo(X,Y,X,Y-k);x.fill();x.restore()}
function estrelaPath(x,cx,cy,R){x.beginPath();for(let i=0;i<10;i++){const r=i%2?R*.45:R,an=-Math.PI/2+i*Math.PI/5;x[i?'lineTo':'moveTo'](cx+r*Math.cos(an),cy+r*Math.sin(an))}x.closePath()}
function estrela(x,cx,cy,R,cheio){ // cheio: 0, .5 ou 1
  estrelaPath(x,cx,cy,R);x.fillStyle='rgba(20,8,38,.45)';x.fill();
  if(cheio>0){x.save();if(cheio<1){x.beginPath();x.rect(cx-R-2,cy-R-2,R+2,2*R+4);x.clip()}
    const g=x.createLinearGradient(cx,cy-R,cx,cy+R);g.addColorStop(0,'#fff1c4');g.addColorStop(.45,'#f2cd7a');g.addColorStop(1,'#b8893a');
    estrelaPath(x,cx,cy,R);x.fillStyle=g;x.shadowColor='rgba(246,211,141,.85)';x.shadowBlur=R*.9;x.fill();x.restore()}
  estrelaPath(x,cx,cy,R);x.lineJoin='round';x.lineWidth=Math.max(1.6,R/7);x.strokeStyle='rgba(230,196,120,.95)';x.stroke()}

function linhas(n,cols){const r=Math.ceil(n/cols),base=Math.floor(n/r),extra=n%r,a=[];
  for(let i=0;i<r;i++)a.push(base+(i<extra?1:0));return a}
function layout(n,est,num){const top=num?735:715,bottom=1700,maxw=num?740:760,gap=30;let melhor=null;
  const opcoes=[];for(let c=1;c<=5;c++)opcoes.push(linhas(n,Math.min(c,n)));
  if(num&&n>=2&&n<=5)opcoes.length=0,opcoes.push({2:[1,1],3:[1,2],4:[1,3],5:[1,2,2]}[n]);
  for(const rows of opcoes){const cols=Math.max(...rows);
    const eh=w=>(est?w/6.2*1.5:0);
    let w=Math.min(520,(maxw-(cols-1)*gap)/cols);
    while(rows.length*(w*1.5+eh(w)+gap)-gap>bottom-top)w-=2;
    if(!melhor||w>melhor.w+.5)melhor={w,rows}}
  const {w,rows}=melhor,h=w*1.5,ehs=est?w/6.2*1.5:0,rh=h+ehs+gap;
  let y=top+((bottom-top)-(rh*rows.length-gap))/2;const slots=[];
  for(const k of rows){const x0=540-(k*w+(k-1)*gap)/2;for(let c=0;c<k;c++)slots.push({x:x0+c*(w+gap),y,w,h});y+=rh}
  return slots}

function fundo(x,im,f){
  x.fillStyle='#1a0b2e';x.fillRect(0,0,W,H);
  if(im){if(f.tile){const t=540;for(let yy=0;yy<H;yy+=t)for(let xx=0;xx<W;xx+=t)x.drawImage(im,xx,yy,t,t)}
    else{const sc=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*sc,h=im.naturalHeight*sc;x.drawImage(im,(W-w)/2,(H-h)/2,w,h)}}
  const g=x.createLinearGradient(0,0,0,H);
  if(f.id==='todas'||f.id==='moldura'){g.addColorStop(0,'rgba(42,20,72,.40)');g.addColorStop(.45,'rgba(30,14,54,.28)');g.addColorStop(1,'rgba(18,8,34,.62)')}
  else if(f.tile){g.addColorStop(0,'rgba(30,12,52,.55)');g.addColorStop(1,'rgba(18,8,34,.65)')}
  else{g.addColorStop(0,'rgba(42,20,72,.50)');g.addColorStop(.45,'rgba(30,14,54,.40)');g.addColorStop(1,'rgba(18,8,34,.75)')}
  x.fillStyle=g;x.fillRect(0,0,W,H)}

function desfocado(x){const src=x.canvas;
  if('filter' in x&&typeof x.filter==='string'){const c=document.createElement('canvas');c.width=W/2;c.height=H/2;const t=c.getContext('2d');
    t.filter='blur(6px)';t.drawImage(src,-20,-20,c.width+40,c.height+40);if(t.filter==='blur(6px)'){x.drawImage(c,0,0,W,H);return}}
  // sem filtro: reduz e amplia em etapas (desfoque suave)
  let cur=src,w=src.width,h=src.height;const passos=[];
  while(w>W/10){w=Math.round(w/2);h=Math.round(h/2);const c=document.createElement('canvas');c.width=w;c.height=h;const t=c.getContext('2d');t.imageSmoothingQuality='high';t.drawImage(cur,0,0,w,h);cur=c;passos.push(c)}
  for(let i=passos.length-2;i>=0;i--){const c=passos[i],t=c.getContext('2d');t.imageSmoothingQuality='high';t.clearRect(0,0,c.width,c.height);t.drawImage(cur,0,0,c.width,c.height);cur=c}
  x.imageSmoothingQuality='high';x.drawImage(cur,0,0,W,H)}
/* camada fixa: tudo menos os brilhos animados */
function cena(x,im,sel,f,anim){
  fundo(x,im,f);
  // painel com fundo desfocado
  x.save();archPath(x);x.clip();desfocado(x);x.fillStyle='rgba(26,11,46,.58)';x.fillRect(0,0,W,H);x.restore();
  if(!anim){for(const s of CEU){x.globalAlpha=s.a;x.fillStyle='#fff4ff';x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()}x.globalAlpha=1;
    for(const b of BRILHOS)brilho(x,b.x,b.y,b.k,b.a)}
  x.lineWidth=4;x.strokeStyle='rgba(214,180,108,.8)';archPath(x);x.stroke();
  x.lineWidth=1.5;x.strokeStyle='rgba(214,180,108,.35)';archPath(x,20);x.stroke();
  if(sel){x.save();x.beginPath();x.arc(540,470,130,0,6.28);x.clip();x.drawImage(sel,410,340,260,260);x.restore();
    x.save();x.shadowColor='rgba(10,4,20,.6)';x.shadowBlur=30;x.strokeStyle=GOLD;x.lineWidth=3;x.beginPath();x.arc(540,470,131.5,0,6.28);x.stroke();x.restore()}
  const m=modelo();
  x.textAlign='center';x.textBaseline='alphabetic';x.shadowColor='rgba(10,4,20,.7)';x.shadowBlur=14;
  txt(x,m.lbl,540,664,'600 30px "Nunito Sans",sans-serif',GOLD,8);
  if(m.sub)txt(x,m.sub,540,712,'italic 500 34px Lora,Georgia,serif',LILAC);
  x.shadowBlur=0;
  if(m.meta)meta(x);else capas(x,m);
  x.shadowColor='rgba(10,4,20,.7)';x.shadowBlur=14;
  txt(x,'✦ SOCIEDADE ARCÁDIA ✦',540,1818,'600 28px "Nunito Sans",sans-serif',GOLD,8);x.shadowBlur=0}
function txt(x,s,X,Y,font,cor,esp){x.font=font;x.fillStyle=cor;
  if(esp&&'letterSpacing' in x){x.letterSpacing=esp+'px';x.fillText(s,X+esp/2,Y);x.letterSpacing='0px'}
  else if(esp){const cs=[...s];let tw=cs.reduce((a,c)=>a+x.measureText(c).width+esp,0)-esp,xx=X-tw/2;x.textAlign='left';for(const c of cs){x.fillText(c,xx,Y);xx+=x.measureText(c).width+esp}x.textAlign='center'}
  else x.fillText(s,X,Y)}

let SLOTS=[];
function capas(x,m){const n=S.qtd[m.id];SLOTS=layout(n,m.est,m.num);
  SLOTS.forEach((s,i)=>{const L=S.livros[i];
    x.save();x.shadowColor='rgba(8,3,18,.55)';x.shadowBlur=22;x.shadowOffsetY=8;rr(x,s.x,s.y,s.w,s.h,10);x.fillStyle='rgba(20,8,38,.6)';x.fill();x.restore();
    if(L.img){x.save();rr(x,s.x,s.y,s.w,s.h,10);x.clip();const im=L.img,sc=Math.max(s.w/im.width,s.h/im.height),w=im.width*sc,h=im.height*sc;
      x.drawImage(im,s.x+(s.w-w)/2,s.y+(s.h-h)/2,w,h);x.restore()}
    rr(x,s.x,s.y,s.w,s.h,10);x.lineWidth=2.5;x.strokeStyle='rgba(214,180,108,.85)';x.stroke();
    if(m.num){const d=Math.max(46,s.w*.2),cx=s.x+d*.15,cy=s.y+d*.15;
      x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=12;x.beginPath();x.arc(cx,cy,d/2,0,6.28);x.fillStyle='#3a1a5e';x.fill();x.restore();
      x.beginPath();x.arc(cx,cy,d/2,0,6.28);x.lineWidth=3;x.strokeStyle=GOLD;x.stroke();
      x.font=`600 ${Math.round(d*.48)}px Lora,Georgia,serif`;x.fillStyle=CREAM;x.textBaseline='middle';x.fillText((i+1)+'º',cx,cy+1);x.textBaseline='alphabetic'}
    if(m.est){const R=Math.min(23,s.w/12.4),gap=R*.24,tot=5*2*R+4*gap,y=s.y+s.h+R*.35+R;
      for(let k=0;k<5;k++){const v=Math.max(0,Math.min(1,L.nota-k));estrela(x,s.x+s.w/2-tot/2+R+k*(2*R+gap),y,R,v>=1?1:v>=.5?.5:0)}}
  })}
function metaGrid(){const N=Math.max(1,Math.min(300,S.meta|0));const top=1000,bottom=1690,maxw=760;let best=null;
  for(let c=5;c<=20;c++){const r=Math.ceil(N/c);const s=Math.min((maxw)/(c*1.22),(bottom-top)/(r*1.22),70);if(!best||s>best.s)best={s,c,r}}
  const {s,c,r}=best,g=s*.22,x0=540-(c*s+(c-1)*g)/2,y0=top+((bottom-top)-(r*s+(r-1)*g))/2,a=[];
  for(let i=0;i<N;i++)a.push({x:x0+(i%c)*(s+g)+s/2,y:y0+Math.floor(i/c)*(s+g)+s/2,r:s/2});return a}
function meta(x){
  x.shadowColor='rgba(10,4,20,.7)';x.shadowBlur=14;
  txt(x,String(S.ano),540,850,'500 150px Lora,Georgia,serif',CREAM);
  const N=Math.max(1,S.meta|0),M=Math.max(0,Math.min(N,S.lidosMeta|0));
  txt(x,`${M} de ${N} livros`,540,935,'italic 500 46px Lora,Georgia,serif',LILAC);x.shadowBlur=0;
  SLOTS=[];metaGrid().forEach((c,i)=>{x.beginPath();x.arc(c.x,c.y,c.r,0,6.28);
    if(i<M){const g=x.createRadialGradient(c.x-c.r*.3,c.y-c.r*.3,c.r*.1,c.x,c.y,c.r);g.addColorStop(0,'#fff1c4');g.addColorStop(.6,'#f2cd7a');g.addColorStop(1,'#b8893a');
      x.save();x.shadowColor='rgba(246,211,141,.8)';x.shadowBlur=c.r*.8;x.fillStyle=g;x.fill();x.restore()}
    else{x.fillStyle='rgba(20,8,38,.5)';x.fill()}
    x.lineWidth=Math.max(1.5,c.r/14);x.strokeStyle='rgba(214,180,108,.8)';x.stroke();
    if(c.r>=16){x.font=`500 ${Math.round(c.r*.75)}px Lora,Georgia,serif`;x.fillStyle=i<M?'#4a2a10':'rgba(201,182,242,.6)';x.textBaseline='middle';x.fillText(String(i+1),c.x,c.y+1);x.textBaseline='alphabetic'}})}

/* brilhos animados (céu + estrelinhas pintadas) */
function pontosDourados(){const m=modelo(),a=[];
  if(m.meta){const M=Math.min(S.meta,S.lidosMeta);metaGrid().slice(0,M).forEach(c=>a.push({x:c.x+c.r*.5,y:c.y-c.r*.5,k:c.r*.55}));return a}
  if(!m.est)return a;
  SLOTS.forEach((s,i)=>{const n=S.livros[i].nota;if(!n)return;const R=Math.min(23,s.w/12.4),gap=R*.24,tot=5*2*R+4*gap,y=s.y+s.h+R*.35+R;
    for(let k=0;k<Math.ceil(n);k++)a.push({x:s.x+s.w/2-tot/2+R+k*(2*R+gap)+R*.55,y:y-R*.6,k:R*.7})});return a}
function animar(x,t){
  for(const s of CEU){x.globalAlpha=Math.max(0,s.a*(.55+.45*Math.sin(t*s.v+s.f)));x.fillStyle='#fff4ff';x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()}x.globalAlpha=1;
  for(const b of BRILHOS){const p=.5+.5*Math.sin(t*b.v+b.f);brilho(x,b.x,b.y,b.k*(.6+.5*p),b.a*p)}
  pontosDourados().forEach((p,i)=>{const q=Math.max(0,Math.sin(t*2.2+i*1.7));if(q>.05)brilho(x,p.x,p.y,p.k*(.4+.8*q),.95*q,'#fffbe8')})}

/* ---------- prévia ---------- */
const prev=$('prev'),px=prev.getContext('2d');
let base=null,baseOk=false,versao=0;
async function montarBase(){const v=++versao;const f=FUNDOS.find(f=>f.id===S.fundo);
  const [im,sel]=await Promise.all([carregar('fundos/'+f.id+'.webp'),selo]);if(v!==versao)return;
  try{await document.fonts.load('600 30px "Nunito Sans"');await document.fonts.load('italic 500 40px Lora');await document.fonts.load('500 40px Lora')}catch(e){}
  if(!base){base=document.createElement('canvas');base.width=W;base.height=H}
  const b=base.getContext('2d');b.setTransform(1,0,0,1,0,0);cena(b,im,sel,f,true);baseOk=true}
const reduzir=matchMedia('(prefers-reduced-motion: reduce)').matches;
function quadro(t){if(baseOk){px.setTransform(prev.width/W,0,0,prev.height/H,0,0);px.drawImage(base,0,0);animar(px,reduzir?1:t/1000)}
  requestAnimationFrame(quadro)}
function ajustarPrev(){const r=prev.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);prev.width=Math.round(r.width*d);prev.height=Math.round(r.width*d*H/W)}
ajustarPrev();addEventListener('resize',ajustarPrev);requestAnimationFrame(quadro);

/* ---------- controles ---------- */
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function tudo(){montarBase();ui()}
$('modelos').innerHTML=MODELOS.map(m=>`<button class="chip" type="button" data-m="${m.id}">${esc(m.nome)}</button>`).join('');
$('modelos').onclick=e=>{const b=e.target.closest('[data-m]');if(!b)return;S.modelo=b.dataset.m;LS.set('montarModelo',S.modelo);tudo()};
$('fundos').innerHTML=FUNDOS.map(f=>`<button type="button" class="fundo" data-f="${f.id}"><img src="fundos/${f.id}-mini.webp" alt="" loading="lazy"><span>${esc(f.nome)}</span></button>`).join('');
$('fundos').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;S.fundo=b.dataset.f;LS.set('montarFundo',S.fundo);tudo()};
$('menos').onclick=()=>{const m=modelo();S.qtd[m.id]=Math.max(1,S.qtd[m.id]-1);tudo()};
$('mais').onclick=()=>{const m=modelo();S.qtd[m.id]=Math.min(MAX,S.qtd[m.id]+1);tudo()};
$('metaN').oninput=()=>{S.meta=Math.max(1,Math.min(300,+$('metaN').value||1));LS.set('montarMeta',S.meta);montarBase()};
$('metaM').oninput=()=>{S.lidosMeta=Math.max(0,Math.min(300,+$('metaM').value||0));montarBase()};
$('anos').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;S.ano=+b.dataset.a;tudo()};
$('anos').innerHTML=[ano,ano+1].map(a=>`<button class="chip" type="button" data-a="${a}">${a}</button>`).join('');

const STAR='<svg viewBox="-2 -2 28 28" aria-hidden="true"><defs><linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset=".45" stop-color="#f2cd7a"/><stop offset="1" stop-color="#b8893a"/></linearGradient><clipPath id="meia"><rect x="-2" y="-2" width="14" height="28"/></clipPath></defs><path class="v" d="M12 0l3.1 7.6 8.3.6-6.4 5.3 2 8.1L12 17.2 5 21.6l2-8.1L.6 8.2l8.3-.6z"/><path class="c" d="M12 0l3.1 7.6 8.3.6-6.4 5.3 2 8.1L12 17.2 5 21.6l2-8.1L.6 8.2l8.3-.6z"/></svg>';
function ui(){const m=modelo();
  document.querySelectorAll('#modelos [data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m.id));
  document.querySelectorAll('#fundos [data-f]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===S.fundo));
  document.querySelectorAll('#anos [data-a]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.a===S.ano));
  $('qtdBox').hidden=!!m.meta;$('metaBox').hidden=!m.meta;$('livrosBox').hidden=!!m.meta;
  $('metaN').value=S.meta;$('metaM').value=S.lidosMeta;
  if(m.meta)return;
  const n=S.qtd[m.id];$('qtd').textContent=n;$('menos').disabled=n<=1;$('mais').disabled=n>=MAX;
  const pal=m.id==='adapt'?'pôster':'capa';
  $('livrosT').textContent=m.est?(m.id==='adapt'?'Pôsteres e notas':'Capas e notas'):'Capas';
  $('livros').innerHTML=Array.from({length:n},(_,i)=>{const L=S.livros[i];
    return `<li data-i="${i}"><button type="button" class="capa" data-pick aria-label="Escolher ${pal} ${i+1}">${L.img?`<img src="${L.url}" alt="">`:`<span>+ ${pal}</span>`}</button>
      <div class="info"><b>${m.num?(i+1)+'º lugar':(m.id==='adapt'?'Adaptação ':'Livro ')+(i+1)}</b>
      ${m.est?`<div class="estrelas" role="group" aria-label="Nota">${[1,2,3,4,5].map(k=>{const v=L.nota-(k-1);return `<button type="button" data-k="${k}" class="${v>=1?'on':v>=.5?'meia':''}" aria-label="${k} estrela${k>1?'s':''}">${STAR}</button>`}).join('')}</div>
      <small class="muted">${L.nota?(String(L.nota).replace('.',',')+' estrela'+(L.nota>1?'s':'')):'Toque nas estrelas. Toque de novo para meia.'}</small>`:''}
      ${L.img?'<button type="button" class="tirar" data-tirar>Remover capa</button>':''}</div></li>`}).join('')}
let alvo=0;
$('livros').onclick=e=>{const li=e.target.closest('[data-i]');if(!li)return;const i=+li.dataset.i,L=S.livros[i];
  if(e.target.closest('[data-pick]')){alvo=i;$('arquivo').value='';$('arquivo').click();return}
  if(e.target.closest('[data-tirar]')){if(L.url)URL.revokeObjectURL(L.url);L.img=null;L.url='';tudo();return}
  const s=e.target.closest('[data-k]');if(s){const k=+s.dataset.k;L.nota=L.nota===k?k-.5:L.nota===k-.5?(k===1?0:k):k;ui();montarBase()}};
prev.onclick=e=>{const m=modelo();if(m.meta)return;const r=prev.getBoundingClientRect(),X=(e.clientX-r.left)*W/r.width,Y=(e.clientY-r.top)*H/r.height;
  const i=SLOTS.findIndex(s=>X>=s.x&&X<=s.x+s.w&&Y>=s.y&&Y<=s.y+s.h);if(i<0)return;alvo=i;$('arquivo').value='';$('arquivo').click()};
$('arquivo').onchange=async()=>{const f=$('arquivo').files[0];if(!f)return;
  const url=URL.createObjectURL(f),im=await carregar(url);delete imgs[url];
  if(!im){toast('Não consegui abrir essa imagem. Tente outra.');URL.revokeObjectURL(url);return}
  // reduz para economizar memória
  const sc=Math.min(1,1100/im.naturalHeight,800/im.naturalWidth),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*sc);c.height=Math.round(im.naturalHeight*sc);
  c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(url);
  const L=S.livros[alvo];if(L.url)URL.revokeObjectURL(L.url);L.img=c;
  L.url=await new Promise(ok=>c.toBlob(b=>ok(URL.createObjectURL(b)),'image/jpeg',.8));tudo()};

let tt;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2800)}

/* ---------- salvar ---------- */
const nomeArq=ext=>`arcadia-${S.modelo}-${new Date().toISOString().slice(0,10)}.${ext}`;
async function imagem4k(){await montarBase();const f=FUNDOS.find(f=>f.id===S.fundo);const [im,sel]=await Promise.all([carregar('fundos/'+f.id+'.webp'),selo]);
  const c=document.createElement('canvas');c.width=W*2;c.height=H*2;const x=c.getContext('2d');x.scale(2,2);x.imageSmoothingQuality='high';
  cena(x,im,sel,f,false);animar(x,1.3);
  const b=await new Promise(ok=>c.toBlob(ok,'image/jpeg',.94));c.width=c.height=1;return b}
let urlS='';
function folha(blob,nome,tipo,video){if(urlS)URL.revokeObjectURL(urlS);urlS=URL.createObjectURL(blob);
  $('shPrev').innerHTML=video?`<video src="${urlS}" autoplay loop muted playsinline></video>`:`<img src="${urlS}" alt="Sua arte">`;
  const file=new File([blob],nome,{type:tipo});const pode=!!(navigator.canShare&&navigator.canShare({files:[file]}));
  $('shBtns').innerHTML=(pode?'<button class="btn wide" type="button" id="shShare">Salvar no celular</button>':'')+`<a class="btn wide${pode?' ghost':''}" href="${urlS}" download="${nome}">Baixar arquivo</a>`;
  $('shDica').hidden=!(!video&&/iP(hone|ad|od)/.test(navigator.userAgent));
  if(pode)$('shShare').onclick=async()=>{try{await navigator.share({files:[file]})}catch(e){if(e.name!=='AbortError')toast('Use o botão “Baixar arquivo”')}};
  $('sheet').hidden=false;document.body.style.overflow='hidden'}
$('shX').onclick=()=>{$('sheet').hidden=true;$('shPrev').innerHTML='';document.body.style.overflow=''};
$('salvar').onclick=async()=>{const b=$('salvar');b.disabled=true;b.textContent='Preparando…';
  try{const blob=await imagem4k();folha(blob,nomeArq('jpg'),'image/jpeg',false)}catch(e){console.warn(e);toast('Não deu para gerar agora. Tente de novo.')}
  b.disabled=false;b.textContent='Salvar imagem'};

const tipoVideo=(()=>{if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return '';
  for(const t of['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'])try{if(MediaRecorder.isTypeSupported(t))return t}catch(e){}return ''})();
$('salvarVideo').hidden=!tipoVideo;
$('salvarVideo').onclick=async()=>{const b=$('salvarVideo');b.disabled=true;b.textContent='Gravando… (6 segundos)';
  try{await montarBase();const c=$('gravador');c.width=W;c.height=H;const x=c.getContext('2d');
    const st=c.captureStream(30),rec=new MediaRecorder(st,{mimeType:tipoVideo,videoBitsPerSecond:9e6}),partes=[];
    rec.ondataavailable=e=>{if(e.data&&e.data.size)partes.push(e.data)};
    const fim=new Promise(ok=>rec.onstop=ok);const t0=performance.now();let rodando=true;
    (function f(){if(!rodando)return;const t=(performance.now()-t0)/1000;x.drawImage(base,0,0);animar(x,t);requestAnimationFrame(f)})();
    rec.start(500);await new Promise(ok=>setTimeout(ok,6000));rec.stop();await fim;rodando=false;st.getTracks().forEach(t=>t.stop());
    const tipo=tipoVideo.split(';')[0],blob=new Blob(partes,{type:tipo});
    if(!blob.size)throw new Error('vazio');folha(blob,nomeArq(tipo==='video/mp4'?'mp4':'webm'),tipo,true)}
  catch(e){console.warn(e);toast('Não deu para gravar o vídeo neste aparelho. Use “Salvar imagem”.')}
  b.disabled=false;b.textContent='Salvar com brilho (vídeo)'};

tudo();
})();
