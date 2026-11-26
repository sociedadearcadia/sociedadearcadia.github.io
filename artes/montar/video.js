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
/* tema Arcádia (sprint geral): dragãozinho fofo e fadinha voadora, desenhados no canvas */
function dragao(x,t,s){
  const bat=Math.sin(t*8.5),bob=Math.cos(t*8.5)*7,OL='#4b2a86';
  x.save();x.scale(s,s);x.translate(0,bob);x.rotate(-.05+Math.sin(t*1.7)*.05);x.lineJoin='round';x.lineCap='round';
  const grad=(x0,y0,r,c1,c2)=>{const g=x.createRadialGradient(x0-r*.35,y0-r*.45,r*.1,x0,y0,r);g.addColorStop(0,c1);g.addColorStop(1,c2);return g};
  function asa(ox,oy,ang,c1,c2){x.save();x.translate(ox,oy);x.rotate(ang);
    const g=x.createLinearGradient(0,0,-60,-120);g.addColorStop(0,c1);g.addColorStop(1,c2);x.fillStyle=g;x.strokeStyle=OL;x.lineWidth=4.5;
    x.beginPath();x.moveTo(0,0);x.bezierCurveTo(-4,-60,-18,-100,-34,-128);x.quadraticCurveTo(-46,-92,-70,-100);x.quadraticCurveTo(-70,-66,-100,-66);x.quadraticCurveTo(-82,-32,-58,-14);x.quadraticCurveTo(-28,-2,0,0);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(75,42,134,.55)';x.lineWidth=3;x.beginPath();x.moveTo(-4,-8);x.quadraticCurveTo(-40,-50,-70,-100);x.moveTo(-6,-6);x.quadraticCurveTo(-56,-44,-100,-66);x.stroke();
    x.fillStyle='#fff6d8';x.beginPath();x.arc(-34,-128,5,0,6.28);x.fill();x.restore()}
  /* asa de trás */
  asa(-12,-34,-.25+bat*.55,'#b48ae6','#7f56c8');
  /* cauda com ponta de coração */
  const w=Math.sin(t*4.2),P=[];for(let i=0;i<=24;i++){const u=i/24;P.push([-44-u*110,18+Math.sin(u*3.4)*-26+w*u*u*26])}
  for(const [lw,c] of [[0,OL],[1,null]]){for(let i=0;i<24;i++){const u=i/24,r=19*(1-u)+5;x.strokeStyle=c||'#b996ee';x.lineWidth=lw?r*2:r*2+9;x.beginPath();x.moveTo(P[i][0],P[i][1]);x.lineTo(P[i+1][0],P[i+1][1]);x.stroke()}}
  const tp=P[24];x.save();x.translate(tp[0]-4,tp[1]);x.rotate(1.9+w*.25);x.fillStyle='#ff9fcf';x.strokeStyle=OL;x.lineWidth=4;
  x.beginPath();x.moveTo(0,14);x.bezierCurveTo(-22,-2,-12,-22,0,-10);x.bezierCurveTo(12,-22,22,-2,0,14);x.fill();x.stroke();x.restore();
  /* patinha de trás */
  x.fillStyle='#a77fe0';x.strokeStyle=OL;x.lineWidth=4.5;x.beginPath();x.ellipse(-26,40,14,11,.3,0,6.28);x.fill();x.stroke();
  /* corpo gordinho */
  x.fillStyle=grad(0,6,62,'#e9d6ff','#a57ce3');x.beginPath();x.ellipse(0,8,60,46,-.12,0,6.28);x.fill();x.stroke();
  /* espinhos rosados nas costas */
  x.fillStyle='#ff9fcf';for(const [sx,sy,a] of [[-46,-14,-1.1],[-28,-32,-.7],[-6,-40,-.35]]){x.save();x.translate(sx,sy);x.rotate(a);x.beginPath();x.moveTo(-9,4);x.quadraticCurveTo(0,-22,9,4);x.closePath();x.fill();x.stroke();x.restore()}
  /* barriga creme com listrinhas */
  x.fillStyle='#fff1e4';x.beginPath();x.ellipse(16,18,34,30,-.35,0,6.28);x.fill();
  x.strokeStyle='rgba(219,170,140,.7)';x.lineWidth=2.5;for(const k of[-12,0,12]){x.beginPath();x.arc(16+k*.4,18+k,24,.35,1.6);x.stroke()}
  /* livrinho que ela carrega */
  x.save();x.translate(40,30);x.rotate(-.25);x.fillStyle='#fff7e8';x.strokeStyle=OL;x.lineWidth=3.5;x.beginPath();x.roundRect(-17,-14,34,28,4);x.fill();x.stroke();
  x.fillStyle='#7c4fd0';x.beginPath();x.roundRect(-19,-16,38,7,3);x.fill();x.stroke();x.strokeStyle='#e3b866';x.lineWidth=2;x.beginPath();x.moveTo(0,-9);x.lineTo(0,14);x.stroke();x.restore();
  /* bracinhos */
  x.fillStyle='#b996ee';x.strokeStyle=OL;x.lineWidth=4;x.beginPath();x.ellipse(30,26,10,8,.6,0,6.28);x.fill();x.stroke();x.beginPath();x.ellipse(50,40,10,8,-.2,0,6.28);x.fill();x.stroke();
  /* patinha da frente */
  x.fillStyle='#b996ee';x.beginPath();x.ellipse(4,50,15,11,0,0,6.28);x.fill();x.stroke();
  /* asa da frente */
  asa(-4,-30,-.05+bat*.6,'#e7cbff','#a77fe0');
  /* cabeça grande */
  x.save();x.translate(56,-50);x.rotate(.08+Math.sin(t*1.3)*.06);
  /* chifrinhos */
  x.fillStyle='#fff1c9';x.strokeStyle=OL;x.lineWidth=4;
  for(const [hx,a] of [[-22,-.5],[4,-.15]]){x.save();x.translate(hx,-34);x.rotate(a);x.beginPath();x.moveTo(-8,6);x.quadraticCurveTo(-4,-22,6,-26);x.quadraticCurveTo(4,-8,9,6);x.closePath();x.fill();x.stroke();x.restore()}
  /* orelhinha */
  x.fillStyle='#ff9fcf';x.save();x.translate(-36,-14);x.rotate(-.9+Math.sin(t*3)*.1);x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(-10,-30,-28,-22);x.quadraticCurveTo(-16,-8,0,10);x.closePath();x.fill();x.stroke();x.restore();
  x.fillStyle=grad(0,0,48,'#f2e6ff','#aa82e6');x.beginPath();x.ellipse(0,0,46,42,0,0,6.28);x.fill();x.stroke();
  /* focinho */
  x.fillStyle=grad(34,12,30,'#f6ecff','#b48ae6');x.beginPath();x.ellipse(34,12,26,20,.1,0,6.28);x.fill();x.stroke();
  x.fillStyle=OL;x.beginPath();x.ellipse(48,6,3,2.2,.3,0,6.28);x.fill();
  x.strokeStyle=OL;x.lineWidth=3.5;x.beginPath();x.arc(34,16,11,.3,1.5);x.stroke();
  /* bochecha */
  x.fillStyle='rgba(255,140,190,.55)';x.beginPath();x.ellipse(10,18,11,7,0,0,6.28);x.fill();
  /* olhão brilhante que pisca */
  const pis=(t%3.4)<.13?.12:1;x.save();x.translate(10,-8);x.scale(1,pis);
  x.fillStyle='#2b1650';x.beginPath();x.ellipse(0,0,13,16,0,0,6.28);x.fill();
  const gi=x.createLinearGradient(0,-16,0,16);gi.addColorStop(0,'rgba(124,79,208,0)');gi.addColorStop(1,'rgba(190,140,255,.9)');x.fillStyle=gi;x.beginPath();x.ellipse(0,3,10,11,0,0,6.28);x.fill();
  x.fillStyle='#fff';x.beginPath();x.arc(-4,-6,5.5,0,6.28);x.fill();x.beginPath();x.arc(5,6,2.6,0,6.28);x.fill();x.restore();
  if(pis<1){x.strokeStyle=OL;x.lineWidth=3.5;x.beginPath();x.arc(10,-10,12,.3,2.8);x.stroke()}
  x.restore();
  /* bafinho de brilhos saindo do focinho de tempos em tempos */
  const k=(t%2.6)/2.6;if(k<.45){const q=k/.45;for(let i=0;i<4;i++){const d=q*70+i*12;brilho(x,118+d,-36-i*7+Math.sin(i*2+q*6)*8,(9-i*1.5)*(1-q*.6),(1-q)*.95,i%2?'#ffd1ec':'#fff4c4')}}
  x.restore()}
function fada(x,t,s){
  const fl=Math.abs(Math.sin(t*26)),bob=Math.sin(t*3.2)*6;
  x.save();x.scale(s,s);x.translate(0,bob);x.rotate(.28+Math.sin(t*1.6)*.06);x.lineJoin='round';x.lineCap='round';
  /* luz em volta */
  const g=x.createRadialGradient(0,-6,4,0,-6,95);g.addColorStop(0,'rgba(255,236,250,.55)');g.addColorStop(.5,'rgba(232,200,255,.22)');g.addColorStop(1,'rgba(232,200,255,0)');x.fillStyle=g;x.beginPath();x.arc(0,-6,95,0,6.28);x.fill();
  /* asas batendo rapidinho, transparentes e furta-cor */
  function asa(rx,ry,a,ox,oy){x.save();x.translate(ox,oy);x.rotate(a);x.scale(.25+.75*fl,1);
    const gg=x.createLinearGradient(-rx,-ry,rx,ry);gg.addColorStop(0,'rgba(190,235,255,.75)');gg.addColorStop(.5,'rgba(246,214,255,.6)');gg.addColorStop(1,'rgba(255,200,230,.75)');
    x.fillStyle=gg;x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=2;x.beginPath();x.ellipse(0,-ry,rx,ry,0,0,6.28);x.fill();x.stroke();
    x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=1.2;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(rx*.3,-ry,0,-ry*1.8);x.stroke();x.restore()}
  asa(16,34,-.75,-6,-14);asa(11,22,-1.9,-6,-8);
  /* pernas para trás */
  x.strokeStyle='#ffd9c7';x.lineWidth=5;x.beginPath();x.moveTo(-6,22);x.quadraticCurveTo(-20,34,-30,36);x.moveTo(-2,24);x.quadraticCurveTo(-12,40,-24,46);x.stroke();
  x.fillStyle='#c79be8';x.beginPath();x.ellipse(-31,36,5,3.5,0,0,6.28);x.fill();x.beginPath();x.ellipse(-25,46,5,3.5,0,0,6.28);x.fill();
  /* vestido de pétalas */
  const vd=x.createLinearGradient(0,-14,0,28);vd.addColorStop(0,'#f6c9ef');vd.addColorStop(1,'#b884e8');x.fillStyle=vd;x.strokeStyle='#8d5cc9';x.lineWidth=2.5;
  x.beginPath();x.moveTo(-5,-16);x.quadraticCurveTo(-24,6,-20,26);x.quadraticCurveTo(-13,20,-8,28);x.quadraticCurveTo(-2,20,4,28);x.quadraticCurveTo(8,20,14,24);x.quadraticCurveTo(14,4,6,-16);x.closePath();x.fill();x.stroke();
  /* braço com varinha */
  x.strokeStyle='#ffd9c7';x.lineWidth=4.5;x.beginPath();x.moveTo(4,-10);x.quadraticCurveTo(20,-6,28,-16);x.stroke();
  x.strokeStyle='#e9c46a';x.lineWidth=3;x.beginPath();x.moveTo(27,-15);x.lineTo(44,-36);x.stroke();
  const sg=x.createRadialGradient(46,-39,1,46,-39,22);sg.addColorStop(0,'rgba(255,246,200,.95)');sg.addColorStop(1,'rgba(255,246,200,0)');x.fillStyle=sg;x.beginPath();x.arc(46,-39,22,0,6.28);x.fill();
  brilho(x,46,-39,11+3*Math.sin(t*9),1,'#fff7cf');
  /* cabeça, cabelo com coque e coroinha de flores */
  x.fillStyle='#c88bd9';x.beginPath();x.ellipse(-8,-36,15,17,-.4,0,6.28);x.fill();x.beginPath();x.arc(-16,-50,8,0,6.28);x.fill();
  x.beginPath();x.moveTo(-14,-30);x.quadraticCurveTo(-30,-14,-26,0);x.quadraticCurveTo(-20,-14,-8,-24);x.fill();
  x.fillStyle='#ffe3d6';x.beginPath();x.arc(0,-32,13,0,6.28);x.fill();
  x.fillStyle='#c88bd9';x.beginPath();x.ellipse(-4,-42,14,7,-.3,0,6.28);x.fill();
  for(const [fx,fy,c] of [[-14,-44,'#ffb3d9'],[-6,-47,'#fff0b3'],[2,-46,'#ffb3d9']]){x.fillStyle=c;x.beginPath();x.arc(fx,fy,3.2,0,6.28);x.fill()}
  x.fillStyle='#4b2a86';x.beginPath();x.ellipse(5,-32,1.8,2.6,0,0,6.28);x.fill();
  x.strokeStyle='#4b2a86';x.lineWidth=1.6;x.beginPath();x.arc(6,-26,3,.2,1.5);x.stroke();
  x.fillStyle='rgba(255,140,190,.55)';x.beginPath();x.ellipse(2,-27,4,2.4,0,0,6.28);x.fill();
  x.restore()}
/* rastro de brilho atrás de quem passa voando (calculado pelo caminho, então não depende de memória) */
function rastro(x,pos,t,cores,n,queda){for(let i=1;i<=n;i++){const tt=t-i*.045,p=pos(tt);if(!p)continue;const j=Math.sin(i*12.9898)*43758.5453%1;
  const a=(1-i/n)*.9,k=(1-i/n)*9+2;brilho(x,p.x-p.dir*(i%3)*4+j*18,p.y+j*16+queda*i*i*.02,k,a,cores[i%cores.length])}}
const CADENTES=[{t0:1.2,x:860,y:260},{t0:4.4,x:980,y:560},{t0:8.1,x:760,y:180},{t0:11.6,x:1010,y:420},{t0:13.9,x:640,y:300}];
function cadente(x,t){for(const c of CADENTES){const k=(t-c.t0)/1.1;if(k<0||k>1)continue;const X=c.x-k*520,Y=c.y+k*300;
  const g=x.createLinearGradient(X,Y,X+170,Y-98);g.addColorStop(0,'rgba(255,246,220,'+(1-k)+')');g.addColorStop(1,'rgba(255,246,220,0)');
  x.strokeStyle=g;x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(X,Y);x.lineTo(X+170,Y-98);x.stroke();brilho(x,X,Y,14*(1-k*.5),1-k,'#fffbe8')}}
/* a cada 15 s: dragão (em cima), fadinha (embaixo), dragão de volta (embaixo), sem cobrir os números do story */
const VOOS=[{ini:.2,dur:5.4,dir:1,y:450,q:'d'},{ini:5.2,dur:5,dir:-1,y:1545,q:'f'},{ini:9.9,dur:5,dir:-1,y:440,q:'d'}];
function posVoo(v,t){const k=(t-v.ini)/v.dur;if(k<0||k>1)return null;const X=v.dir>0?-240+k*(W+480):W+240-k*(W+480);
  return{x:X,y:v.y+Math.sin(k*6.28*(v.q==='f'?2:1.3))*(v.q==='f'?55:40),dir:v.dir}}
function quadroArc(x,t,pontos){quadro(x,t,pontos);cadente(x,t);const tc=t%15;
  for(const v of VOOS){const p=posVoo(v,tc);if(!p)continue;
    if(v.q==='d')rastro(x,tt=>posVoo(v,tt),tc,['#fff4c4','#ffd1ec','#e6c8ff'],16,0);else rastro(x,tt=>posVoo(v,tt),tc,['#fff7cf','#ffe08a','#ffd1ec','#ffffff'],26,1);
    x.save();x.translate(p.x,p.y);x.scale(p.dir,1);if(v.q==='d')dragao(x,t,1.25);else fada(x,t,1.7);x.restore()}
  x.globalAlpha=1}
const tipo=(()=>{if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return '';
  for(const t of['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'])try{if(MediaRecorder.isTypeSupported(t))return t}catch(e){}return ''})();
async function gravar(base,pontos,seg,tema){seg=seg||6;const desenha=tema==='hogwarts'?quadroHG:tema==='arcadia'?quadroArc:quadro;
  const c=document.createElement('canvas');c.width=W;c.height=H;c.style.cssText='position:fixed;left:-9999px;top:0;width:10px;height:10px';document.body.appendChild(c);
  const x=c.getContext('2d');x.drawImage(base,0,0,W,H);
  const st=c.captureStream(30),rec=new MediaRecorder(st,{mimeType:tipo,videoBitsPerSecond:16e6}),partes=[];
  rec.ondataavailable=e=>{if(e.data&&e.data.size)partes.push(e.data)};
  const fim=new Promise(ok=>rec.onstop=ok);const t0=performance.now();let on=true;
  (function f(){if(!on)return;const t=(performance.now()-t0)/1000;x.drawImage(base,0,0,W,H);desenha(x,t,pontos);requestAnimationFrame(f)})();
  rec.start(500);await new Promise(ok=>setTimeout(ok,seg*1000));rec.stop();await fim;on=false;st.getTracks().forEach(t=>t.stop());c.remove();
  const ty=tipo.split(';')[0],blob=new Blob(partes,{type:ty});if(!blob.size)throw new Error('vazio');
  return {blob,type:ty,ext:ty==='video/mp4'?'mp4':'webm'}}
window.ArcVideo={suportado:!!tipo,gravar,quadro,quadroHG,quadroArc};
})();
