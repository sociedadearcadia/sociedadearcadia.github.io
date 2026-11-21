/* Imagem de stories da leitura do mês (mesmo padrão dos stories do sprint e dos templates) */
(function(){
const W=1080,H=1920,GOLD='#d6b46c',CREAM='#f4e8da',LILAC='#c9b6f2';
const FUNDOS=[['todas','Todas'],['trancas','Tranças'],['ruiva','Ruiva'],['cachos','Sorriso'],['cha','Chá'],['fada','Fada'],['cachos-lua','Cachos'],['mesa','Mesa'],['moldura','Arco']];
const LS={get(k,d){try{const v=localStorage.getItem('arcadia:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('arcadia:'+k,JSON.stringify(v))}catch(e){}}};
const imgs={};
function img(src){if(!imgs[src])imgs[src]=new Promise(ok=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=src});return imgs[src]}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const css=`.ls-dlg{position:fixed;inset:0;z-index:70;background:rgba(8,4,20,.78);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:16px 16px calc(24px + env(safe-area-inset-bottom))}
.ls-dlg[hidden]{display:none}
.ls-dlg .panel{width:100%;max-width:440px;display:flex;flex-direction:column;gap:12px;background:rgba(23,15,51,.97);margin:auto 0}
.ls-dlg canvas,.ls-dlg .res img{width:100%;max-width:320px;aspect-ratio:9/16;height:auto;border-radius:12px;align-self:center;box-shadow:0 10px 30px rgba(0,0,0,.5);display:block;-webkit-touch-callout:default}
.ls-fundos{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;-webkit-overflow-scrolling:touch}
.ls-fundos button{flex:none;width:58px;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:0;padding:0;cursor:pointer;color:var(--cream,#f4e8da);font:600 11.5px var(--body,sans-serif)}
.ls-fundos img{width:58px;height:103px;object-fit:cover;border-radius:8px;border:2px solid rgba(214,180,108,.3);display:block}
.ls-fundos [aria-pressed="true"] img{border-color:#f6d38d;box-shadow:0 0 12px rgba(246,211,141,.55)}
.ls-fundos [aria-pressed="true"] span{color:#f6d38d}
.ls-dlg .btn{text-align:center;text-decoration:none}
.ls-dlg .dica{margin:0;font-size:13px;color:var(--muted);text-align:center}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');
document.body.insertAdjacentHTML('beforeend',`<div class="ls-dlg" id="lsDlg" hidden role="dialog" aria-modal="true" aria-label="Imagem para os stories">
  <div class="panel">
    <p class="lbl" style="margin:0;text-align:center">Para os stories</p>
    <canvas id="lsPrev" width="540" height="960" aria-label="Prévia da imagem"></canvas>
    <p class="lbl" style="margin:4px 0 0">Escolha o fundo</p>
    <div class="ls-fundos" id="lsFundos">${FUNDOS.map((f,i)=>`<button type="button" data-i="${i}"><img src="/artes/montar/fundos/${f[0]}-mini.webp" alt="" loading="lazy"><span>${f[1]}</span></button>`).join('')}</div>
    <div id="lsBtns" style="display:flex;flex-direction:column;gap:8px"><button class="btn wide" type="button" id="lsGerar">Salvar imagem</button></div>
    <p class="dica" id="lsDica" hidden>No iPhone, você também pode tocar e segurar a imagem e escolher “Salvar em Fotos”.</p>
    <button class="btn ghost wide" type="button" id="lsX">Fechar</button>
  </div></div>`);
const $=id=>document.getElementById(id);

let D=null,fundo=Math.max(0,Math.min(FUNDOS.length-1,+LS.get('leituraFundo',0)||0));
function rnd(seed){return()=>(seed=(seed*9301+49297)%233280)/233280}
function arch(x,o=0){x.beginPath();x.moveTo(110+o,1720-o);x.lineTo(110+o,780);x.bezierCurveTo(110+o,440+o*1.4,970-o,440+o*1.4,970-o,780);x.lineTo(970-o,1720-o);x.closePath()}
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function brilho(x,X,Y,k,a,cor){x.save();x.globalAlpha=a;x.fillStyle=cor||'#f6e3b0';x.beginPath();x.moveTo(X,Y-k);x.quadraticCurveTo(X,Y,X+k,Y);x.quadraticCurveTo(X,Y,X,Y+k);x.quadraticCurveTo(X,Y,X-k,Y);x.quadraticCurveTo(X,Y,X,Y-k);x.fill();x.restore()}
function txt(x,s,X,Y,font,cor,esp){x.font=font;x.fillStyle=cor;x.textAlign='center';
  if(esp&&'letterSpacing' in x){x.letterSpacing=esp+'px';x.fillText(s,X+esp/2,Y);x.letterSpacing='0px'}
  else if(esp){const cs=[...s];const tw=cs.reduce((a,c)=>a+x.measureText(c).width+esp,0)-esp;let xx=X-tw/2;x.textAlign='left';for(const c of cs){x.fillText(c,xx,Y);xx+=x.measureText(c).width+esp}x.textAlign='center'}
  else x.fillText(s,X,Y)}
function quebra(x,s,X,Y,max,lh){const ws=String(s).split(/\s+/);let l='',n=0;for(const w of ws){const t=l?l+' '+w:w;if(x.measureText(t).width>max&&l){x.fillText(l,X,Y+n*lh);n++;l=w}else l=t}if(l){x.fillText(l,X,Y+n*lh);n++}return n}
function desfoque(x){const src=x.canvas;let cur=src,w=src.width,h=src.height;const ps=[];
  while(w>W/10){w=Math.round(w/2);h=Math.round(h/2);const c=document.createElement('canvas');c.width=w;c.height=h;const t=c.getContext('2d');t.imageSmoothingQuality='high';t.drawImage(cur,0,0,w,h);cur=c;ps.push(c)}
  for(let i=ps.length-2;i>=0;i--){const c=ps[i],t=c.getContext('2d');t.clearRect(0,0,c.width,c.height);t.imageSmoothingQuality='high';t.drawImage(cur,0,0,c.width,c.height);cur=c}
  x.imageSmoothingQuality='high';x.drawImage(cur,0,0,W,H)}

async function desenhar(c,escala){const f=FUNDOS[fundo];
  const [bg,selo,capa]=await Promise.all([img('/artes/montar/fundos/'+f[0]+'.webp'),img('/selo-arcadia.png'),D.capa?img(D.capa):null]);
  try{await document.fonts.load('600 30px "Nunito Sans"');await document.fonts.load('italic 500 40px Lora');await document.fonts.load('500 40px Lora')}catch(e){}
  c.width=W*escala;c.height=H*escala;const x=c.getContext('2d');x.setTransform(escala,0,0,escala,0,0);
  x.fillStyle='#1a0b2e';x.fillRect(0,0,W,H);
  if(bg){const sc=Math.max(W/bg.naturalWidth,H/bg.naturalHeight),w=bg.naturalWidth*sc,h=bg.naturalHeight*sc;x.drawImage(bg,(W-w)/2,(H-h)/2,w,h)}
  let g=x.createLinearGradient(0,0,0,H);const leve=f[0]==='todas'||f[0]==='moldura';
  g.addColorStop(0,`rgba(42,20,72,${leve?.4:.5})`);g.addColorStop(.45,`rgba(30,14,54,${leve?.28:.4})`);g.addColorStop(1,`rgba(18,8,34,${leve?.62:.75})`);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.save();arch(x);x.clip();desfoque(x);x.fillStyle='rgba(26,11,46,.58)';x.fillRect(0,0,W,H);x.restore();
  const r=rnd(7);x.fillStyle='#fff4ff';for(let i=0;i<150;i++){x.globalAlpha=.25+r()*.6;x.beginPath();x.arc(r()*W,r()*H,r()*2+.5,0,6.28);x.fill()}x.globalAlpha=1;
  const r2=rnd(31);for(let i=0;i<16;i++)brilho(x,r2()*W,r2()*H,r2()*8+6,.4+r2()*.5);
  x.lineWidth=4;x.strokeStyle='rgba(214,180,108,.8)';arch(x);x.stroke();x.lineWidth=1.5;x.strokeStyle='rgba(214,180,108,.35)';arch(x,20);x.stroke();
  x.shadowColor='rgba(10,4,20,.7)';x.shadowBlur=14;
  txt(x,'LEITURA DO MÊS',540,664,'600 30px "Nunito Sans",sans-serif',GOLD,8);
  x.shadowBlur=0;
  // capa
  const cw=420,ch=630,cx=540-cw/2,cy=715;
  x.save();x.shadowColor='rgba(8,3,18,.6)';x.shadowBlur=26;x.shadowOffsetY=10;rr(x,cx,cy,cw,ch,10);x.fillStyle='rgba(20,8,38,.7)';x.fill();x.restore();
  if(capa){x.save();rr(x,cx,cy,cw,ch,10);x.clip();const sc=Math.max(cw/capa.naturalWidth,ch/capa.naturalHeight),w=capa.naturalWidth*sc,h=capa.naturalHeight*sc;x.drawImage(capa,cx+(cw-w)/2,cy+(ch-h)/2,w,h);x.restore()}
  else{x.font='italic 500 40px Lora,Georgia,serif';x.fillStyle=CREAM;x.textAlign='center';const n=Math.min(6,Math.ceil(x.measureText(D.titulo||'').width/(cw-60)));quebra(x,D.titulo||'',540,cy+ch/2-(n-1)*25,cw-60,50)}
  rr(x,cx,cy,cw,ch,10);x.lineWidth=2.5;x.strokeStyle='rgba(214,180,108,.85)';x.stroke();
  // porcentagem
  const p=Math.max(0,Math.min(100,Math.round(+D.pct||0)));
  x.shadowColor='rgba(10,4,20,.7)';x.shadowBlur=14;
  txt(x,p+'%',540,1500,'500 120px Lora,Georgia,serif',CREAM);
  txt(x,p>=100?'leitura concluída':'lido até agora',540,1552,'italic 500 40px Lora,Georgia,serif',LILAC);x.shadowBlur=0;
  const bx=200,by=1592,bw=680,bh=26;
  rr(x,bx,by,bw,bh,bh/2);x.fillStyle='rgba(20,8,38,.6)';x.fill();
  if(p>0){const fw=Math.max(bh,bw*p/100);g=x.createLinearGradient(bx,0,bx+fw,0);g.addColorStop(0,'#b58ae6');g.addColorStop(.6,'#e9a8d8');g.addColorStop(1,'#f6d38d');
    x.save();x.shadowColor='rgba(246,211,141,.7)';x.shadowBlur=18;rr(x,bx,by,fw,bh,bh/2);x.fillStyle=g;x.fill();x.restore();
    brilho(x,bx+fw-6,by+bh/2,22,.95,'#fffbe8');brilho(x,bx+fw*.45,by-4,10,.7,'#fffbe8')}
  rr(x,bx,by,bw,bh,bh/2);x.lineWidth=2;x.strokeStyle='rgba(214,180,108,.8)';x.stroke();
  x.shadowColor='rgba(10,4,20,.7)';x.shadowBlur=14;  txt(x,'✦ SOCIEDADE ARCÁDIA ✦',540,1818,'600 28px "Nunito Sans",sans-serif',GOLD,8);x.shadowBlur=0;
  if(selo){const SEL=selo;x.save();x.shadowColor='rgba(10,4,20,.65)';x.shadowBlur=16;x.beginPath();x.arc(540,1720,46,0,6.28);x.fillStyle='#f4e8da';x.fill();x.restore();x.save();x.beginPath();x.arc(540,1720,46,0,6.28);x.clip();x.drawImage(SEL,494,1674,92,92);x.restore();x.strokeStyle='#d6b46c';x.lineWidth=2.5;x.beginPath();x.arc(540,1720,47.5,0,6.28);x.stroke()}
}
function marcar(){$('lsFundos').querySelectorAll('[data-i]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===fundo))}
function botaoGerar(){const v=window.ArcVideo&&ArcVideo.suportado;
  $('lsBtns').innerHTML='<button class="btn wide" type="button" id="lsGerar">Salvar imagem</button>'+(v?'<button class="btn ghost wide" type="button" id="lsVideo">Salvar com brilho (vídeo)</button>':'');
  $('lsGerar').onclick=gerar;if(v)$('lsVideo').onclick=video;$('lsDica').hidden=true;$('lsPrev').style.display='';const vv=$('lsVid');if(vv)vv.remove()}
function entregar(blob,nome,tipo,ehVideo){if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);
  const file=new File([blob],nome,{type:tipo}),pode=!!(navigator.canShare&&navigator.canShare({files:[file]}));
  if(ehVideo){$('lsPrev').style.display='none';$('lsPrev').insertAdjacentHTML('afterend',`<video id="lsVid" src="${url}" autoplay loop muted playsinline style="width:100%;max-width:320px;aspect-ratio:9/16;border-radius:12px;align-self:center"></video>`)}
  $('lsBtns').innerHTML=(pode?'<button class="btn wide" type="button" id="lsShare">Salvar no celular</button>':'')+`<a class="btn wide${pode?' ghost':''}" href="${url}" download="${nome}">Baixar ${ehVideo?'vídeo':'imagem'}</a>`;
  $('lsDica').hidden=ehVideo||!/iP(hone|ad|od)/.test(navigator.userAgent);
  if(pode)$('lsShare').onclick=async()=>{try{await navigator.share({files:[file]})}catch(e){}}}
async function video(){const b=$('lsVideo');b.disabled=true;$('lsGerar').disabled=true;b.textContent='Gravando… (6 segundos)';
  try{const c=document.createElement('canvas');await desenhar(c,1);const p=Math.max(0,Math.min(100,+D.pct||0));
    const pts=p>0?[{x:200+Math.max(26,680*p/100)-6,y:1605,k:24}]:[];
    const r=await ArcVideo.gravar(c,pts);entregar(r.blob,'arcadia-leitura-'+new Date().toISOString().slice(0,10)+'.'+r.ext,r.type,true)}
  catch(e){console.warn(e);botaoGerar()}}
let url='';
async function gerar(){const b=$('lsGerar');b.disabled=true;b.textContent='Preparando…';
  try{const c=document.createElement('canvas');await desenhar(c,2);const blob=await new Promise(ok=>c.toBlob(ok,'image/jpeg',.94));c.width=c.height=1;
    entregar(blob,'arcadia-leitura-'+new Date().toISOString().slice(0,10)+'.jpg','image/jpeg',false)}
  catch(e){console.warn(e);botaoGerar()}}
$('lsFundos').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;fundo=+b.dataset.i;LS.set('leituraFundo',fundo);marcar();botaoGerar();desenhar($('lsPrev'),.5)};
$('lsX').onclick=()=>{$('lsDlg').hidden=true;document.body.style.overflow=''};
window.LeituraStories={abrir(dados){D=dados;marcar();botaoGerar();$('lsDlg').hidden=false;document.body.style.overflow='hidden';desenhar($('lsPrev'),.5)}};
})();
