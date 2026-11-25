/* Vídeo de stories com brilho e pétalas (ou tema Hogwarts): grava 6 s (ou o tempo pedido) a partir de uma imagem pronta (1080x1920) */
(function(){
const W=1080,H=1920;
function rnd(seed){return()=>(seed=(seed*9301+49297)%233280)/233280}
const r=rnd(77);
const CEU=Array.from({length:110},()=>({x:r()*W,y:r()*H,r:r()*1.8+.5,a:.3+r()*.6,f:r()*6.28,v:.6+r()*1.6}));
const FL=Array.from({length:14},()=>({x:r()*W,y:r()*H,k:r()*10+8,f:r()*6.28,v:.5+r()*1.1}));
const C=[['#f3d4fa','#c99be8'],['#fbd6e8','#e79ac7'],['#e6c8ff','#a77ad8'],['#ffe9f4','#f0a8d2']];
const PET=Array.from({length:22},()=>{const c=C[Math.floor(r()*C.length)];return{x:r()*W,y:r()*H,s:9+r()*9,vy:28+r()*30,vx:8+r()*18,sw:r()*6.28,sws:.5+r()*.9,swa:14+r()*20,rot:r()*6.28,vr:(r()-.5)*2.4,c1:c[0],c2:c[1],a:.7+r()*.25}});
function brilho(x,X,Y,k,a,cor){x.save();x.globalAlpha=a;x.fillStyle=cor||'#f6e3b0';x.beginPath();x.moveTo(X,Y-k);x.quadraticCurveTo(X,Y,X+k,Y);x.quadraticCurveTo(X,Y,X,Y+k);x.quadraticCurveTo(X,Y,X-k,Y);x.quadraticCurveTo(X,Y,X,Y-k);x.fill();x.restore()}
function quadro(x,t,pontos){
  for(const s of CEU){x.globalAlpha=Math.max(0,s.a*Math.max(0,Math.sin(t*s.v+s.f)));x.fillStyle='#fff4ff';x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()}x.globalAlpha=1;
  for(const b of FL){const p=Math.pow(Math.max(0,Math.sin(t*b.v+b.f)),3);if(p>.02)brilho(x,b.x,b.y,b.k*(.5+.6*p),.9*p)}
  (pontos||[]).forEach((p,i)=>{const q=Math.max(0,Math.sin(t*2.2+i*1.7));if(q>.05)brilho(x,p.x,p.y,p.k*(.4+.8*q),.95*q,'#fffbe8')});
  for(const p of PET){const y=((p.y+p.vy*t)%(H+80))-40,xx=((p.x+p.vx*t+Math.sin(p.sw+t*p.sws)*p.swa)%(W+80)+W+80)%(W+80)-40;
    x.save();x.translate(xx,y);x.rotate(p.rot+p.vr*t);x.scale(1,.55+.45*Math.abs(Math.sin(t*1.7+p.sw)));x.globalAlpha=p.a;
    const g=x.createLinearGradient(-p.s,0,p.s,0);g.addColorStop(0,p.c1);g.addColorStop(1,p.c2);x.fillStyle=g;
    x.beginPath();x.moveTo(0,-p.s);x.bezierCurveTo(p.s*.9,-p.s*.6,p.s*.8,p.s*.6,0,p.s);x.bezierCurveTo(-p.s*.8,p.s*.6,-p.s*.9,-p.s*.6,0,-p.s);x.fill();x.restore()}
  x.globalAlpha=1}
/* tema Hogwarts (Biblioteca): velas flutuando, chaves voadoras batendo as asas e uma vassoura passando */
const r2=rnd(311);
const VELAS=Array.from({length:8},(_,i)=>({x:80+i*130+r2()*40,y:110+r2()*170,h:70+r2()*50,f:r2()*6.28,v:.6+r2()*.5}));
/* as chaves voam por cima e por baixo do texto do story, sem cobrir os números */
const CHAVES=Array.from({length:7},(_,i)=>({y:i%2?330+r2()*170:1400+r2()*200,v:70+r2()*80,x0:r2()*W,amp:20+r2()*30,f:r2()*6.28,s:.9+r2()*.6,dir:r2()<.5?1:-1}));
function vela(x,X,Y,h,t,f){
  const g=x.createRadialGradient(X,Y-h/2-14,2,X,Y-h/2-14,70);g.addColorStop(0,'rgba(255,214,140,.55)');g.addColorStop(1,'rgba(255,214,140,0)');
  x.fillStyle=g;x.beginPath();x.arc(X,Y-h/2-14,70,0,6.28);x.fill();
  const cg=x.createLinearGradient(X-11,0,X+11,0);cg.addColorStop(0,'#e9dcc0');cg.addColorStop(.5,'#fbf3e2');cg.addColorStop(1,'#d8c8a6');
  x.fillStyle=cg;x.beginPath();x.roundRect?x.roundRect(X-11,Y-h/2,22,h,4):x.rect(X-11,Y-h/2,22,h);x.fill();
  const fl=1+.18*Math.sin(t*13+f)+.1*Math.sin(t*21+f*2);
  x.save();x.translate(X,Y-h/2-4);x.scale(1,fl);
  const fg=x.createRadialGradient(0,-12,1,0,-12,16);fg.addColorStop(0,'#fffbe6');fg.addColorStop(.45,'#ffd36b');fg.addColorStop(1,'rgba(255,140,40,0)');
  x.fillStyle=fg;x.beginPath();x.moveTo(0,-30);x.quadraticCurveTo(11,-10,0,0);x.quadraticCurveTo(-11,-10,0,-30);x.fill();x.restore()}
function chave(x,X,Y,s,t,f,dir){x.save();x.translate(X,Y);x.scale(s*dir,s);
  const bat=.35+.65*Math.abs(Math.sin(t*9+f));
  x.fillStyle='rgba(246,240,222,.95)';x.strokeStyle='rgba(201,168,101,.9)';x.lineWidth=1.5;
  for(const lado of[-1,1]){x.save();x.translate(lado*6,-4);x.scale(lado,bat);x.beginPath();x.moveTo(0,0);x.bezierCurveTo(14,-30,40,-30,48,-16);x.bezierCurveTo(36,-14,26,-8,20,0);x.bezierCurveTo(26,2,34,8,40,14);x.bezierCurveTo(24,14,10,8,0,4);x.closePath();x.fill();x.stroke();x.restore()}
  x.strokeStyle='#e6be6e';x.lineWidth=5;x.lineCap='round';x.beginPath();x.arc(0,0,10,0,6.28);x.stroke();
  x.beginPath();x.moveTo(0,10);x.lineTo(0,44);x.moveTo(0,32);x.lineTo(9,32);x.moveTo(0,41);x.lineTo(7,41);x.stroke();x.restore()}
function vassoura(x,X,Y,t){x.save();x.translate(X,Y);x.scale(-1,1);x.rotate(.12+.05*Math.sin(t*3));
  x.strokeStyle='#8a5a24';x.lineWidth=9;x.lineCap='round';x.beginPath();x.moveTo(-150,0);x.lineTo(70,-8);x.stroke();
  x.strokeStyle='#c99a52';x.lineWidth=3;x.beginPath();x.moveTo(-150,-1);x.lineTo(70,-9);x.stroke();
  const bg=x.createLinearGradient(60,0,190,0);bg.addColorStop(0,'#c9a05a');bg.addColorStop(1,'#e8c77e');x.fillStyle=bg;
  x.beginPath();x.moveTo(62,-24);x.bezierCurveTo(110,-34,160,-46,196,-52);x.bezierCurveTo(178,-16,184,20,198,52);x.bezierCurveTo(160,40,110,26,62,14);x.closePath();x.fill();
  x.strokeStyle='rgba(122,84,32,.7)';x.lineWidth=2;for(let i=-3;i<=3;i++){x.beginPath();x.moveTo(70,i*5-4);x.lineTo(194,i*14);x.stroke()}
  x.strokeStyle='#e6be6e';x.lineWidth=8;x.beginPath();x.moveTo(60,-26);x.lineTo(62,16);x.stroke();
  for(let i=0;i<6;i++){const k=(t*3+i*.37)%1;brilho(x,205+i*26+k*70,Math.sin(i*2.1+t*4)*30,11*(1-k),.85*(1-k),'#fff1c2')}
  x.restore()}
function quadroHG(x,t,pontos){
  for(const s of CEU){x.globalAlpha=Math.max(0,s.a*Math.max(0,Math.sin(t*s.v+s.f)));x.fillStyle='#fff8e6';x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()}x.globalAlpha=1;
  for(const b of FL){const p=Math.pow(Math.max(0,Math.sin(t*b.v+b.f)),3);if(p>.02)brilho(x,b.x,b.y,b.k*(.5+.6*p),.9*p,'#f6d98f')}
  (pontos||[]).forEach((p,i)=>{const q=Math.max(0,Math.sin(t*2.2+i*1.7));if(q>.05)brilho(x,p.x,p.y,p.k*(.4+.8*q),.95*q,'#fffbe8')});
  for(const v of VELAS)vela(x,v.x,v.y+Math.sin(t*v.v+v.f)*12,v.h,t,v.f);
  for(const c of CHAVES){const span=W+200;const X=c.dir>0?((c.x0+c.v*t)%span)-100:span-100-((c.x0+c.v*t)%span);chave(x,X,c.y+Math.sin(t*1.6+c.f)*c.amp,c.s,t,c.f,c.dir)}
  /* a vassoura atravessa a tela a cada 5 s, em alturas diferentes */
  const ciclo=5,n=Math.floor(t/ciclo),k=(t%ciclo)/ciclo;if(k<.8){const kk=k/.8;const ys=[470,1540,500,1580];vassoura(x,-260+kk*(W+520),ys[n%ys.length]+Math.sin(kk*6.28)*25,t)}
  x.globalAlpha=1}
const tipo=(()=>{if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return '';
  for(const t of['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'])try{if(MediaRecorder.isTypeSupported(t))return t}catch(e){}return ''})();
async function gravar(base,pontos,seg,tema){seg=seg||6;const desenha=tema==='hogwarts'?quadroHG:quadro;
  const c=document.createElement('canvas');c.width=W;c.height=H;c.style.cssText='position:fixed;left:-9999px;top:0;width:10px;height:10px';document.body.appendChild(c);
  const x=c.getContext('2d');x.drawImage(base,0,0,W,H);
  const st=c.captureStream(30),rec=new MediaRecorder(st,{mimeType:tipo,videoBitsPerSecond:16e6}),partes=[];
  rec.ondataavailable=e=>{if(e.data&&e.data.size)partes.push(e.data)};
  const fim=new Promise(ok=>rec.onstop=ok);const t0=performance.now();let on=true;
  (function f(){if(!on)return;const t=(performance.now()-t0)/1000;x.drawImage(base,0,0,W,H);desenha(x,t,pontos);requestAnimationFrame(f)})();
  rec.start(500);await new Promise(ok=>setTimeout(ok,seg*1000));rec.stop();await fim;on=false;st.getTracks().forEach(t=>t.stop());c.remove();
  const ty=tipo.split(';')[0],blob=new Blob(partes,{type:ty});if(!blob.size)throw new Error('vazio');
  return {blob,type:ty,ext:ty==='video/mp4'?'mp4':'webm'}}
window.ArcVideo={suportado:!!tipo,gravar,quadro,quadroHG};
})();
