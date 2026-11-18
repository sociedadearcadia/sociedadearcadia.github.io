/* ---------- cena: arte de fundo com elementos animados ---------- */
(function(){
  const SCENES={
    largo:{src:'/fundo-home-largo.webp',w:2560,h:1440,
      dragon:[1747,62,185,122],outR:1100,inL:-2300,
      moon:[1894,77,200],
      lamps:[[151,214,75],[518,208,62],[1437,1085,95],[1559,1052,42,1],[1636,1120,36,1],[1690,1120,30,1]],
      steam:[1776,700],wings:[2470,520,230],wbox:[2390,330,2560,760],falls:[2066,425,44,150],
      sparks:[[2400,420],[2520,380],[2440,640],[2530,600],[2380,520],[1712,1120,1],[1480,980,1],[180,330,1],[2120,300]]},
    alto:{src:'/fundo-home-alto.webp',w:1440,h:2560,
      dragon:[916,119,277,183],outR:800,inL:-1400,
      moon:[1120,179,200],
      lamps:[[211,445,75],[343,338,60],[662,2032,95],[771,2122,42,1],[845,2180,36,1]],
      steam:[872,1722],wings:[1357,1434,210],wbox:[1300,1287,1437,1773],falls:[1284,515,40,130],
      sparks:[[1300,1300],[1410,1360],[1330,1560],[1420,1520],[1260,1440],[1180,1240],[700,2180,1],[230,560,1],[1000,300]]},
    banner:{src:'/fundo-banner.webp',w:2560,h:1440,
      moon:[1246,90,115],
      lamps:[[510,170,70],[140,264,55],[836,1064,95],[734,1180,30,1],[790,1210,28,1]],
      wings:[1280,560,150],wbox:[1160,400,1400,720],falls:[880,370,36,120],
      sparks:[[940,280,1],[1010,300,1],[860,330,1],[1200,430],[1350,500],[1300,660],[300,1180,1],[2300,1300],[1700,1340]]},
    frame:{src:'/fundo-moldura.webp',w:1440,h:2560,
      moon:[1061,261,100],
      lamps:[[213,459,70],[331,331,52]],
      falls:[1205,490,30,110],
      sparks:[[1150,420,1],[1250,400,1],[140,2120],[1320,2120],[650,2200,1],[60,900],[1380,1200],[40,1600],[1390,700]]}};
  const SET=window.ARC_SET||{largo:'largo',alto:'alto'};
  const scene=document.getElementById('scene'),art=document.getElementById('art');let cur=null;
  function populate(A,S){
    const el=(cls,x,y,w,h,html)=>{const d=document.createElement('div');d.className=cls;d.style.left=x+'px';d.style.top=y+'px';if(w!=null){d.style.width=w+'px';d.style.height=h+'px'}if(html)d.innerHTML=html;A.appendChild(d);return d};
    A.innerHTML='';A.style.width=S.w+'px';A.style.height=S.h+'px';A.style.backgroundImage='url("'+S.src+'")';
    const[mx,my,mr]=S.moon;el('rays',mx-mr*2.6,my-mr*2.6,mr*5.2,mr*5.2);el('moon',mx-mr,my-mr,mr*2,mr*2);
    if(S.wbox){const[a0,b0,a1,b1]=S.wbox;for(let i=0;i<26;i++){const s=el('spark',a0+Math.random()*(a1-a0),b0+Math.random()*(b1-b0));s.style.width=s.style.height='14px';s.style.margin='-7px 0 0 -7px';
      s.style.animationDelay=(Math.random()*3)+'s';s.style.animationDuration=(1.6+Math.random()*2)+'s'}
    for(let i=0;i<18;i++){const s=el('drift',a0+Math.random()*(a1-a0),b0+Math.random()*(b1-b0));s.style.animationDelay=(Math.random()*6)+'s';s.style.animationDuration=(4+Math.random()*4)+'s'}}
    if(S.falls){const[fx,fy,fw,fh]=S.falls;el('falls',fx-fw/2,fy,fw,fh)}
    S.lamps.forEach(([x,y,r,sm],i)=>{const g=el('glow'+(sm?' small':''),x-r,y-r,r*2,r*2);g.style.animationDelay=(-i*0.7)+'s'});
    if(S.wings){const[wx,wy,wr]=S.wings;el('wings',wx-wr,wy-wr,wr*2,wr*2)}
    S.sparks.forEach(([x,y,g],i)=>{const s=el('spark'+(g?' gold':''),x,y);s.style.animationDelay=(i*0.45)+'s';s.style.animationDuration=(2.4+(i%4)*.6)+'s'});
    if(S.steam)el('steam',S.steam[0],S.steam[1],null,null,'<i></i><i></i><i></i>');
    if(S.dragon){const[dx,dy,dw,dh]=S.dragon;const d=el('dragon',dx,dy,dw,dh,'<img src="/dragao.webp" alt="">');d.style.setProperty('--outR',S.outR+'px');d.style.setProperty('--inL',S.inL+'px')}}
  function place(box,A,S,c){const W=box.clientWidth,H=box.clientHeight,s=Math.max(W/S.w,H/S.h)*c.zoom;
    let ty=H/2-c.cy*S.h*s;ty=Math.min(0,Math.max(H-S.h*s,ty));
    let tx=W/2-c.cx*S.w*s;tx=Math.min(0,Math.max(W-S.w*s,tx));
    A.style.transform='translate('+tx+'px,'+ty+'px) scale('+s+')'}
  /* câmera: zoom e centro vertical (fração da altura da ilustração) */
  const cam={zoom:1.07,cy:.5,cx:.5};
  const orient=()=>innerHeight>innerWidth?'alto':'largo';
  function fit(){const k=orient();if(k!==cur){cur=k;populate(art,SCENES[SET[k]]);scene.classList.add('ready')}place(scene,art,SCENES[SET[k]],cam);fitAlt()}
  window.ARC_CAM=(z,cy,cx)=>{cam.zoom=z;cam.cy=cy;cam.cx=cx==null?.5:cx;fit()};
  window.ARC_ORIENT=()=>cur;
  /* artes alternativas que entram por cima da principal (troca suave por seção) */
  const alts={};let altOn=null;
  function altLayer(name){if(alts[name])return alts[name];const box=document.createElement('div');box.className='scene alt'+(name==='estampa'?' pattern':'');box.setAttribute('aria-hidden','true');
    let A=null;if(name!=='estampa'){A=document.createElement('div');A.className='art';box.appendChild(A);populate(A,SCENES[name])}
    let last=scene;Object.values(alts).forEach(a=>last=a.box);last.after(box);return alts[name]={box,A,S:SCENES[name]}}
  const altCam={zoom:1.04,cy:.5,cx:.5};
  function fitAlt(){Object.values(alts).forEach(a=>{if(a.A&&a.box.classList.contains('show'))place(a.box,a.A,a.S,altCam)})}
  window.ARC_ALT=(name,cx,cy)=>{if(name===altOn&&cx==null)return;altOn=name;altCam.cx=cx==null?.5:cx;altCam.cy=cy==null?.5:cy;
    if(name){const a=altLayer(name);clearTimeout(a.hide);a.box.classList.add('show');if(a.A)place(a.box,a.A,a.S,altCam);requestAnimationFrame(()=>requestAnimationFrame(()=>a.box.classList.add('on')))}
    /* a arte que sai some de vez depois do esmaecer, para não pesar na memória do celular */
    Object.entries(alts).forEach(([n,a])=>{if(n!==name&&a.box.classList.contains('show')){a.box.classList.remove('on');clearTimeout(a.hide);a.hide=setTimeout(()=>a.box.classList.remove('show'),1500)}})};
  /* tom da seção: cor translúcida por cima da arte, no lugar de filtro (filtro na arte inteira derrubava o Safari/Chrome do iPhone) */
  const tint=document.createElement('div');tint.className='tint';scene.appendChild(tint);let lastTint='';
  window.ARC_TINT=(h,sat,br)=>{const w=Math.min(1,Math.abs(h)/18),c=h>=0?[255,120,205]:[120,140,255];
    const dark=Math.max(0,1-br)*2.2,light=Math.max(0,br-1)*1.4+Math.max(0,sat-1)*.5;
    let r=c[0]*w,g=c[1]*w,b=c[2]*w,a=.13*w;
    if(light>0){r=r+(250-r)*Math.min(1,light/(a+light));g=g+(220-g)*Math.min(1,light/(a+light));b=b+(255-b)*Math.min(1,light/(a+light));a+=light*.5}
    if(dark>0){r*=1-dark;g*=1-dark;b*=1-dark;a+=dark*.6}
    const v='rgb('+(r|0)+','+(g|0)+','+(b|0)+')',o=Math.min(.3,a).toFixed(3);if(v+o===lastTint)return;lastTint=v+o;
    tint.style.background=v;tint.style.opacity=o};
  addEventListener('resize',fit);fit();
})();

/* ---------- céu estrelado ---------- */
(function(){const c=document.getElementById('sky'),x=c.getContext('2d');let st=[],W,H;const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){const d=Math.min(devicePixelRatio||1,2);W=c.width=innerWidth*d;H=c.height=innerHeight*d;
    st=Array.from({length:Math.round(innerWidth*innerHeight/7000)},()=>({x:Math.random()*W,y:Math.random()*H*.8,r:(Math.random()*1.2+.3)*d,p:Math.random()*6.28,s:.4+Math.random()*1.2,sp:Math.random()<.08}))}
  function draw(t){x.clearRect(0,0,W,H);for(const s of st){const a=calm?.7:.3+.7*Math.abs(Math.sin(s.p+t/1000*s.s));
    x.globalAlpha=a;x.fillStyle=s.sp?'#f6d8ff':'#efe6ff';
    if(s.sp){const r=s.r*3;x.beginPath();x.moveTo(s.x,s.y-r);x.lineTo(s.x+r*.25,s.y-r*.25);x.lineTo(s.x+r,s.y);x.lineTo(s.x+r*.25,s.y+r*.25);x.lineTo(s.x,s.y+r);x.lineTo(s.x-r*.25,s.y+r*.25);x.lineTo(s.x-r,s.y);x.lineTo(s.x-r*.25,s.y-r*.25);x.fill()}
    else{x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()}}
    if(!calm)requestAnimationFrame(draw)}
  size();addEventListener('resize',size);requestAnimationFrame(draw)})();

/* ---------- pétalas, chuva de estrelas e brilhos ---------- */
(function(){const c=document.getElementById('petals'),x=c.getContext('2d');const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS=[['#f3d4fa','#c99be8'],['#fbd6e8','#e79ac7'],['#e6c8ff','#a77ad8'],['#ffe9f4','#f0a8d2'],['#efdcff','#b98ad8']];
  let W,H,d,ps=[],fall=[],gl=[],shoot=[],last=0,nextShoot=0;
  const R=(a,b)=>a+Math.random()*(b-a);
  function sprite(sz,fn){const o=document.createElement('canvas');o.width=o.height=sz;fn(o.getContext('2d'),sz);return o}
  const glow=(col)=>sprite(64,(g,z)=>{const r=g.createRadialGradient(z/2,z/2,0,z/2,z/2,z/2);r.addColorStop(0,col);r.addColorStop(.25,col.replace(/[\d.]+\)$/,'.45)'));r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,z,z)});
  const GW=glow('rgba(255,248,255,1)'),GG=glow('rgba(255,224,150,1)'),GP=glow('rgba(240,170,255,1)');
  const flare=sprite(96,(g,z)=>{const m=z/2;g.translate(m,m);for(const [w,l] of [[1.6,m],[1.1,m*.55]]){for(let k=0;k<4;k++){g.save();g.rotate(k*Math.PI/2+(l<m?Math.PI/4:0));
      const lg=g.createLinearGradient(0,0,l,0);lg.addColorStop(0,'rgba(255,250,240,1)');lg.addColorStop(1,'rgba(255,250,240,0)');g.fillStyle=lg;g.beginPath();g.moveTo(0,-w);g.lineTo(l,0);g.lineTo(0,w);g.fill();g.restore()}}
    const r=g.createRadialGradient(0,0,0,0,0,m*.35);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(1,'rgba(255,220,255,0)');g.fillStyle=r;g.beginPath();g.arc(0,0,m*.35,0,7);g.fill()});
  const petal=top=>{const[c1,c2]=COLORS[Math.random()*COLORS.length|0];return{x:R(-.1,1)*W,y:top?R(-.25,-.02)*H:R(0,1)*H,s:R(5,10)*d,vy:R(22,48)*d,vx:R(8,26)*d,
    sw:R(0,6.28),sws:R(.5,1.4),swa:R(12,30)*d,r:R(0,6.28),vr:R(-1.8,1.8),fl:R(0,6.28),fls:R(1,2.6),c1,c2,a:R(.7,.95)}};
  const faller=top=>({x:R(0,1)*W,y:top?R(1,1.1)*H:R(0,1)*H,vy:-R(8,20)*d,vx:R(-4,4)*d,r:R(2,5)*d,p:R(0,6.28),ps:R(2,4),k:Math.random()<.7?GG:Math.random()<.5?GP:GW});
  const glint=()=>({x:R(0,1)*W,y:R(0,1)*H,s:R(10,26)*d,p:R(0,6.28),ps:R(.5,1.3),rot:R(0,.6)});
  function size(){d=Math.min(devicePixelRatio||1,2);W=c.width=innerWidth*d;H=c.height=innerHeight*d;const A=innerWidth*innerHeight;
    ps=Array.from({length:Math.round(Math.min(60,Math.max(26,A/17000)))},()=>petal(false));
    fall=Array.from({length:Math.round(Math.min(70,Math.max(30,A/14000)))},()=>faller(false));
    gl=Array.from({length:Math.round(Math.min(18,Math.max(8,A/60000)))},glint);shoot=[]}
  function launch(){const fromLeft=Math.random()<.35;const ang=fromLeft?R(.35,.6):Math.PI-R(.35,.6);
    shoot.push({x:fromLeft?R(-.05,.4)*W:R(.6,1.05)*W,y:R(-.05,.35)*H,vx:Math.cos(ang)*R(650,950)*d,vy:Math.sin(ang)*R(650,950)*d,life:0,max:R(.9,1.5),len:R(90,170)*d})}
  function draw(t){const dt=Math.min(.05,(t-(last||t))/1000);last=t;const ts=t/1000;x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';
    for(const f of fall){if(!calm){f.y+=f.vy*dt;f.x+=(f.vx+Math.sin(ts*.8+f.p)*6*d)*dt;if(f.y<-10)Object.assign(f,faller(true))}
      const a=.45+.55*Math.abs(Math.sin(f.p+ts*f.ps));const z=f.r*4.5*(.8+.4*a);x.globalAlpha=a;x.drawImage(f.k,f.x-z/2,f.y-z/2,z,z)}
    for(const g of gl){const a=calm?.5:Math.pow(Math.max(0,Math.sin(g.p+ts*g.ps)),6);if(!calm&&a<.002&&Math.random()<.02){Object.assign(g,glint())}
      if(a>.01){const z=g.s*(.6+.6*a);x.globalAlpha=a;x.save();x.translate(g.x,g.y);x.rotate(g.rot);x.drawImage(flare,-z,-z,z*2,z*2);x.restore()}}
    if(!calm){if(ts>nextShoot){launch();if(Math.random()<.35)launch();nextShoot=ts+R(1.6,4)}
      for(let i=shoot.length-1;i>=0;i--){const s=shoot[i];s.life+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;const k=s.life/s.max;if(k>=1){shoot.splice(i,1);continue}
        const a=Math.sin(Math.PI*k);const sp=Math.hypot(s.vx,s.vy);const tx=s.x-s.vx/sp*s.len,ty=s.y-s.vy/sp*s.len;
        const lg=x.createLinearGradient(s.x,s.y,tx,ty);lg.addColorStop(0,'rgba(255,250,235,.95)');lg.addColorStop(.3,'rgba(236,190,255,.5)');lg.addColorStop(1,'rgba(200,150,255,0)');
        x.globalAlpha=a;x.strokeStyle=lg;x.lineWidth=2*d;x.lineCap='round';x.beginPath();x.moveTo(s.x,s.y);x.lineTo(tx,ty);x.stroke();const z=16*d;x.drawImage(GW,s.x-z/2,s.y-z/2,z,z)}}
    x.globalCompositeOperation='source-over';
    for(const p of ps){if(!calm){p.y+=p.vy*dt;p.x+=(p.vx+Math.sin(p.sw+ts*p.sws)*p.swa)*dt;p.r+=p.vr*dt;
        if(p.y>H+20*d||p.x>W+30*d)Object.assign(p,petal(true))}
      const fl=Math.cos(p.fl+ts*p.fls);x.save();x.translate(p.x,p.y);x.rotate(p.r);x.scale(1,.25+.75*Math.abs(fl));x.globalAlpha=p.a;
      const gr=x.createLinearGradient(0,-p.s,0,p.s);gr.addColorStop(0,fl>0?p.c1:p.c2);gr.addColorStop(1,fl>0?p.c2:p.c1);x.fillStyle=gr;
      x.beginPath();x.moveTo(0,-p.s);x.bezierCurveTo(p.s*.95,-p.s*.55,p.s*.75,p.s*.75,0,p.s);x.bezierCurveTo(-p.s*.75,p.s*.75,-p.s*.95,-p.s*.55,0,-p.s);x.fill();
      x.globalAlpha=p.a*.35;x.strokeStyle='#fff';x.lineWidth=.6*d;x.beginPath();x.moveTo(0,-p.s*.7);x.quadraticCurveTo(p.s*.12,0,0,p.s*.7);x.stroke();x.restore()}
    x.globalAlpha=1;if(!calm)requestAnimationFrame(draw)}
  size();addEventListener('resize',size);requestAnimationFrame(draw)})();

