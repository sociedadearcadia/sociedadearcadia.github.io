/* Vídeo de stories com brilho e pétalas: grava 6 s a partir de uma imagem pronta (1080x1920) */
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
const tipo=(()=>{if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return '';
  for(const t of['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'])try{if(MediaRecorder.isTypeSupported(t))return t}catch(e){}return ''})();
async function gravar(base,pontos,seg){seg=seg||6;
  const c=document.createElement('canvas');c.width=W;c.height=H;c.style.cssText='position:fixed;left:-9999px;top:0;width:10px;height:10px';document.body.appendChild(c);
  const x=c.getContext('2d');x.drawImage(base,0,0,W,H);
  const st=c.captureStream(30),rec=new MediaRecorder(st,{mimeType:tipo,videoBitsPerSecond:16e6}),partes=[];
  rec.ondataavailable=e=>{if(e.data&&e.data.size)partes.push(e.data)};
  const fim=new Promise(ok=>rec.onstop=ok);const t0=performance.now();let on=true;
  (function f(){if(!on)return;const t=(performance.now()-t0)/1000;x.drawImage(base,0,0,W,H);quadro(x,t,pontos);requestAnimationFrame(f)})();
  rec.start(500);await new Promise(ok=>setTimeout(ok,seg*1000));rec.stop();await fim;on=false;st.getTracks().forEach(t=>t.stop());c.remove();
  const ty=tipo.split(';')[0],blob=new Blob(partes,{type:ty});if(!blob.size)throw new Error('vazio');
  return {blob,type:ty,ext:ty==='video/mp4'?'mp4':'webm'}}
window.ArcVideo={suportado:!!tipo,gravar,quadro};
})();
