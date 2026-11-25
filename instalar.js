/* Instalar o app da Sociedade Arcádia (Área das integrantes).
   - Android, Chrome e Edge: abre o pedido de instalação do próprio navegador.
   - iPhone e iPad: mostra o passo a passo (Compartilhar > Adicionar à Tela de Início).
   - Já aberto como app: o cartão some.
   O service worker (/sw.js) não guarda as páginas: o que for publicado aparece na hora. */
(function(){
  if('serviceWorker' in navigator){
    addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).catch(()=>{}));
  }
  let pedido=null;
  addEventListener('beforeinstallprompt',e=>{e.preventDefault();pedido=e});
  addEventListener('appinstalled',()=>{pedido=null;pronto()});

  const ua=navigator.userAgent||'';
  const app=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const dentroDeApp=/Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|musical_ly/i.test(ua);
  const iosOutro=ios&&/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  const android=/Android/i.test(ua);
  const macSafari=!ios&&/Macintosh/.test(ua)&&/Safari/.test(ua)&&!/Chrome|Chromium|Edg|Firefox/.test(ua);
  const I=n=>window.ARC_ICONE?ARC_ICONE(n):'';

  const css=`
.inst{display:flex;align-items:center;gap:14px}
.inst .ic{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;
  background:radial-gradient(circle at 35% 30%,rgba(120,72,190,.55),rgba(23,15,51,.92) 70%);box-shadow:0 0 0 1px rgba(214,180,108,.55),inset 0 0 8px rgba(214,180,108,.18)}
.inst .tx{flex:1;min-width:0}
.inst b{display:block;font:600 17px var(--display)}
.inst small{display:block;color:var(--muted);font-size:13px;line-height:1.35}
.inst .btn{flex:none;padding:10px 16px;font-size:14px}
.inst-ok{color:#bff0d2;font-weight:700;font-size:14px}
@media (max-width:380px){.inst{flex-wrap:wrap}.inst .btn{width:100%}}
.passos{position:fixed;inset:0;z-index:40;display:flex;align-items:flex-end;justify-content:center;background:rgba(10,5,24,.72)}
@media (min-width:700px){.passos{align-items:center}}
.passos .panel{background:linear-gradient(180deg,#2b1748,#1c0d32);width:100%;max-width:440px;border-radius:22px 22px 0 0;padding:22px 18px calc(22px + env(safe-area-inset-bottom,0px));animation:sobe .28s ease-out;max-height:92vh;overflow:auto}
@media (min-width:700px){.passos .panel{border-radius:22px}}
@keyframes sobe{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
.passos h2{text-align:center;margin:6px 0 4px}
.passos .intro{text-align:center;margin:0 0 14px}
.passos ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;counter-reset:p}
.passos li{counter-increment:p;display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:14px;background:rgba(23,15,51,.55);border:1px solid var(--line);line-height:1.4}
.passos li::before{content:counter(p);flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:700 13px var(--body);color:var(--night);background:linear-gradient(180deg,#f3dca6,#d6b46c)}
.passos .k{display:inline-flex;align-items:center;gap:4px;vertical-align:middle;padding:1px 8px 1px 4px;border-radius:8px;border:1px solid rgba(214,180,108,.45);background:rgba(43,23,72,.8);font-weight:700;white-space:nowrap}
.passos .k .arc-ic{width:20px;height:20px}
.passos .obs{margin:14px 0 0;text-align:center}
.passos .btn{margin-top:14px}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  const k=(ic,t)=>'<span class="k">'+I(ic)+t+'</span>';
  function passos(){
    if(dentroDeApp)return{t:'Abra no navegador primeiro',i:'Este link está aberto dentro de outro app (como o Instagram), que não deixa instalar.',p:[
      'Toque nos três pontinhos '+k('pontos','')+' no canto da tela.',
      'Escolha <b>Abrir no navegador</b> (ou <b>Abrir no Safari</b>).',
      'Lá, entre de novo na Área das integrantes e toque em <b>Instalar app</b>.']};
    if(ios)return{t:'Instalar no iPhone',i:'Leva menos de um minuto.',p:[
      iosOutro?'Toque em '+k('compartilhar','Compartilhar')+', ao lado do endereço do site, lá em cima.'
              :'Toque em '+k('compartilhar','Compartilhar')+' na barra do Safari. Se não aparecer, toque antes nos três pontinhos '+k('pontos','')+'.',
      'Role a lista para baixo e toque em '+k('adicionar','Adicionar à Tela de Início')+'.',
      'Se aparecer <b>Abrir como App Web</b>, deixe ligado. Toque em <b>Adicionar</b>.']};
    if(android)return{t:'Instalar no Android',i:'Leva menos de um minuto.',p:[
      'Toque nos três pontinhos <b>⋮</b> do navegador, no canto de cima.',
      'Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.',
      'Confirme em <b>Instalar</b>.']};
    if(macSafari)return{t:'Instalar no Mac',i:'No Safari:',p:[
      'Clique em <b>Arquivo</b>, na barra de cima.',
      'Clique em <b>Adicionar ao Dock</b>.',
      'Confirme em <b>Adicionar</b>.']};
    return{t:'Instalar no computador',i:'Funciona no Chrome e no Edge.',p:[
      'Abra este site no <b>Chrome</b> ou no <b>Edge</b>.',
      'Clique no ícone de instalar, no fim da barra de endereço (ou no menu <b>⋮</b> e em <b>Instalar</b>).',
      'Confirme em <b>Instalar</b>.']};
  }
  function abrirPassos(){
    const x=passos();const d=document.createElement('div');d.className='passos';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
    d.innerHTML='<div class="panel"><div style="text-align:center"><img class="seal" src="/app-icone-192.png" alt="" width="64" height="64" style="width:64px;height:64px;border-radius:16px"></div>'+
      '<h2>'+x.t+'</h2><p class="muted small intro">'+x.i+'</p><ol>'+x.p.map(p=>'<li><span>'+p+'</span></li>').join('')+'</ol>'+
      '<p class="muted small obs">O selo da Arcádia fica na sua tela, junto com os outros apps. Na primeira vez que abrir, digite a senha do clube.</p>'+
      '<button class="btn wide" type="button">Entendi</button></div>';
    const fechar=()=>d.remove();
    d.addEventListener('click',e=>{if(e.target===d)fechar()});
    d.querySelector('button').onclick=fechar;
    document.body.appendChild(d);d.querySelector('button').focus({preventScroll:true});
  }
  let caixa=null;
  function pronto(){if(caixa)caixa.querySelector('.acao').innerHTML='<span class="inst-ok">Instalado ✓</span>'}
  async function instalar(){
    if(pedido){const p=pedido;pedido=null;p.prompt();try{const r=await p.userChoice;if(r&&r.outcome==='accepted')pronto()}catch(e){}return}
    abrirPassos();
  }
  /* chamado pela Área das integrantes depois da senha */
  window.ARC_INSTALAR=function(onde){
    if(app||!onde||caixa)return;
    caixa=document.createElement('section');caixa.className='panel';
    caixa.innerHTML='<div class="inst"><span class="ic" aria-hidden="true">'+I('celular')+'</span><span class="tx"><b>Arcádia no celular</b>'+
      '<small>Instale o app e abra direto da tela inicial, sem barra do navegador.</small></span>'+
      '<span class="acao"><button class="btn" type="button">Instalar app</button></span></div>';
    caixa.querySelector('button').onclick=instalar;
    onde.parentNode.insertBefore(caixa,onde);
  };
})();
