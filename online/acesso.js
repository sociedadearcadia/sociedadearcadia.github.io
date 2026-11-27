/* Turma online: entrada com a conta Google + aprovação da administração.
   Este arquivo é feito à mão (não é gerado). Vai em todas as páginas de /online/, menos as de administração.
   Enquanto a pessoa não estiver aprovada, a página fica coberta e o Firebase da página não carrega. */
(function(){
  if(/\/admin(\/|$)/.test(location.pathname))return;
  var V='10.12.2',BASE='https://www.gstatic.com/firebasejs/'+V+'/';
  var LSK='arcadiaOnline:';
  var liberar,liberado=new Promise(function(ok){liberar=ok});
  var origAppend=Node.prototype.appendChild;

  /* as páginas carregam o Firebase sozinhas: aqui elas esperam a liberação e não carregam de novo */
  Node.prototype.appendChild=function(el){
    if(el&&el.tagName==='SCRIPT'&&el.src&&el.src.indexOf('gstatic.com/firebasejs/')>=0&&!el.__arcAcesso){
      liberado.then(function(){setTimeout(function(){if(el.onload)el.onload({type:'load',target:el})},0)});
      return el}
    return origAppend.call(this,el)};

  function carregar(src){return new Promise(function(ok,no){var s=document.createElement('script');s.__arcAcesso=1;s.src=src;s.onload=ok;s.onerror=no;origAppend.call(document.head,s)})}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(LSK+k);if(v===null)localStorage.removeItem(LSK+k);else localStorage.setItem(LSK+k,v)}catch(e){}}

  var css='#arcAcesso{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;overflow:auto;'+
    'background:radial-gradient(ellipse at 50% 20%,#3a2366 0%,#170f33 60%,#0d0820 100%);font-family:"Nunito Sans",system-ui,sans-serif;color:#f3eadb}'+
    '#arcAcesso .cx{width:100%;max-width:420px;text-align:center;background:rgba(23,15,51,.72);border:1px solid rgba(214,180,108,.45);border-radius:22px;padding:28px 22px;box-shadow:0 20px 60px rgba(0,0,0,.45)}'+
    '#arcAcesso img{width:76px;height:76px;border-radius:50%}'+
    '#arcAcesso .lb{font:500 12.5px "EB Garamond",Georgia,serif;letter-spacing:.24em;text-transform:uppercase;color:#e7c987;margin:14px 0 4px}'+
    '#arcAcesso h2{font:500 26px Lora,Georgia,serif;margin:0 0 10px}'+
    '#arcAcesso p{font-size:15px;line-height:1.5;color:#cfc3e6;margin:0 0 14px}'+
    '#arcAcesso input{width:100%;font:16px "Nunito Sans",system-ui,sans-serif;color:#f3eadb;background:rgba(23,15,51,.8);border:1px solid rgba(214,180,108,.45);border-radius:12px;padding:12px 14px;margin:0 0 12px;box-sizing:border-box}'+
    '#arcAcesso button{width:100%;font:700 16px "Nunito Sans",system-ui,sans-serif;border:0;border-radius:999px;padding:14px 18px;cursor:pointer;background:linear-gradient(180deg,#e1d2ff,#c9b6f2);color:#170f33}'+
    '#arcAcesso button.sec{background:transparent;color:#c9b6f2;border:1px solid rgba(201,182,242,.5);margin-top:10px;font-weight:600;font-size:14px;padding:10px}'+
    '#arcAcesso a{color:#c9b6f2}#arcAcesso .er{color:#f2a0b8;font-size:14px}';
  var st=document.createElement('style');st.textContent=css;origAppend.call(document.head||document.documentElement,st);
  var box=document.createElement('div');box.id='arcAcesso';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
  function tela(html){box.innerHTML='<div class="cx"><img src="/selo-arcadia.png" alt=""><p class="lb">Turma online</p>'+html+'</div>';
    if(!box.parentNode)(document.body?origAppend.call(document.body,box):document.addEventListener('DOMContentLoaded',function(){origAppend.call(document.body,box)}))}
  tela('<h2>Área das integrantes</h2><p>Carregando…</p>');

  var auth,db;
  function entrarGoogle(){var p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
    auth.signInWithPopup(p).catch(function(e){
      if(e&&(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment'))return auth.signInWithRedirect(p);
      if(e&&e.code!=='auth/popup-closed-by-user'&&e.code!=='auth/cancelled-popup-request')erro('Não foi possível entrar ('+(e.code||'erro')+'). Tente de novo.')})}
  function erro(t){var e=box.querySelector('.er');if(e)e.textContent=t}
  function sair(){ls('membroOk',null);auth.signOut()}

  function pedirLogin(){
    tela('<h2>Área das integrantes</h2><p>Entre com a sua conta Google. No primeiro acesso, a administração do clube aprova a sua entrada.</p>'+
      '<button type="button" id="aaG">Entrar com Google</button><p class="er" style="margin:12px 0 0"></p>'+
      '<p style="margin:16px 0 0;font-size:14px">Ainda não faz parte? <a href="/lista-de-espera/?m=online">Entre na lista de espera</a></p>');
    box.querySelector('#aaG').onclick=entrarGoogle}

  function aguardando(u,ped){
    tela('<h2>Pedido enviado</h2><p>A administração vai aprovar o seu acesso. Depois disso, é só abrir esta página de novo.</p>'+
      '<p style="font-size:14px">Conta: <b>'+esc(u.email)+'</b>'+(ped&&ped.nome?'<br>Nome: <b>'+esc(ped.nome)+'</b>':'')+'</p>'+
      '<button type="button" id="aaR">Já fui aprovada, verificar</button><button type="button" class="sec" id="aaS">Usar outra conta</button>');
    box.querySelector('#aaR').onclick=function(){verificar(u)};box.querySelector('#aaS').onclick=sair}

  function pedir(u,encerrado){
    tela('<h2>'+(encerrado?'Acesso encerrado':'Pedir acesso')+'</h2><p>'+(encerrado?'O acesso desta conta foi encerrado. Se precisar, peça de novo e a administração avalia.':'Você entrou como <b>'+esc(u.email)+'</b>. Escreva seu nome para a administração saber quem é.')+'</p>'+
      '<input id="aaN" maxlength="120" autocomplete="name" placeholder="Seu nome" value="'+esc(u.displayName||'')+'">'+
      '<button type="button" id="aaP">Pedir acesso</button><button type="button" class="sec" id="aaS">Usar outra conta</button><p class="er" style="margin:12px 0 0"></p>');
    box.querySelector('#aaS').onclick=sair;
    box.querySelector('#aaP').onclick=function(){var nome=box.querySelector('#aaN').value.trim().replace(/\s+/g,' ');
      if(nome.length<2)return erro('Escreva seu nome.');this.disabled=true;var b=this;
      db.collection('pedidosAcesso').doc(u.uid).set({email:u.email,nome:nome,em:firebase.firestore.FieldValue.serverTimestamp()})
        .then(function(){aguardando(u,{nome:nome})}).catch(function(e){b.disabled=false;erro('Não deu para enviar ('+(e.code||'erro')+'). Tente de novo.')})}}

  function verificar(u){
    db.collection('membros').doc(u.uid).get().then(function(d){
      if(d.exists){ls('membroOk',u.uid);box.remove();st.remove();liberar();return}
      ls('membroOk',null);
      return db.collection('pedidosAcesso').doc(u.uid).get().then(function(p){p.exists?aguardando(u,p.data()):pedir(u,ls('foiMembro')===u.uid)})
    }).catch(function(e){console.warn(e);tela('<h2>Sem conexão</h2><p>Verifique a internet e recarregue a página.</p><button type="button" onclick="location.reload()">Recarregar</button>')})}

  (async function(){
    try{
      await carregar(BASE+'firebase-app-compat.js');await carregar(BASE+'firebase-auth-compat.js');await carregar(BASE+'firebase-firestore-compat.js');
      var cfg=window.ARCADIA_FIREBASE||(window.ARCADIA_CONFIG&&window.ARCADIA_CONFIG.firebase);
      if(!cfg||!cfg.apiKey){tela('<h2>Em breve</h2><p>A área da turma online está sendo preparada.</p>');return}
      if(!firebase.apps.length)firebase.initializeApp(cfg);
      auth=firebase.auth();db=firebase.firestore();
      try{await auth.getRedirectResult()}catch(e){console.warn(e)}
      auth.onAuthStateChanged(function(u){
        if(!u||u.isAnonymous||!u.email)return pedirLogin();
        verificar(u)})
    }catch(e){console.warn(e);tela('<h2>Sem conexão</h2><p>Verifique a internet e recarregue a página.</p><button type="button" onclick="location.reload()">Recarregar</button>')}
  })();
  /* aprovada uma vez neste aparelho: lembra, para avisar "Acesso encerrado" se for removida */
  liberado.then(function(){try{ls('foiMembro',firebase.auth().currentUser.uid)}catch(e){}});
})();
