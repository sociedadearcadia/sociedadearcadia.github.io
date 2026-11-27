/* Lista de desejos e Mural de aniversário: partes em comum.
   Cada integrante tem um documento pelo nome (desejos/{nome}) protegido por um código de 4 números que ela mesma cria.
   O código nunca é guardado: só a versão embaralhada (SHA-256). Cada aparelho que digita o código certo
   ganha desejosAcesso/{uid}, e com isso abre a lista e edita o próprio cartão no mural. */
(function(){
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const LS={get(k,d){try{const v=localStorage.getItem('arcadia:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('arcadia:'+k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem('arcadia:'+k)}catch(e){}}};
  const CFG=window.ARCADIA_CONFIG||{};
  const MEMBROS=(CFG.membros||[]).map(String);
  async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
  const prova=(nome,pin)=>sha('arcadia-desejos|'+slug(nome)+'|'+pin);
  /* link seguro: só http(s); sem "https://" na frente, completa */
  function link(u){u=String(u||'').trim();if(!u)return'';if(!/^https?:\/\//i.test(u)){if(/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u))u='https://'+u;else return''}
    try{const x=new URL(u);return(x.protocol==='https:'||x.protocol==='http:')?x.href:''}catch(e){return''}}
  const site=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return''}};

  const load=src=>new Promise((ok,no)=>{const sc=document.createElement('script');sc.src=src;sc.onload=ok;sc.onerror=no;document.head.appendChild(sc)});
  const $=id=>document.getElementById(id);

  /* Firebase + senha do clube (a mesma do sprint). Usa os elementos #gate, #gateForm, #gateInput, #gateErr, #gateBtn da página. */
  async function conectar(){
    const V='10.12.2';
    await load(`https://www.gstatic.com/firebasejs/${V}/firebase-app-compat.js`);
    await load(`https://www.gstatic.com/firebasejs/${V}/firebase-auth-compat.js`);
    await load(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore-compat.js`);
    if(!firebase.apps.length)firebase.initializeApp(window.ARCADIA_FIREBASE||CFG.firebase);
    const auth=firebase.auth();
    let u=await new Promise(ok=>{const off=auth.onAuthStateChanged(x=>{off();ok(x)})});
    if(!u)u=(await auth.signInAnonymously()).user;
    const uid=u.uid,db=firebase.firestore();
    if(LS.get('membroOk','')!==uid){
      let ok=false;try{ok=(await db.collection('membros').doc(uid).get()).exists}catch(e){}
      if(!ok){try{const k=JSON.parse(localStorage.getItem('arcadia:chave')||'""');if(k){await db.collection('membros').doc(uid).set({chave:k,em:Date.now()});ok=true}}catch(e){}}
      if(!ok)await new Promise(done=>{$('gate').hidden=false;setTimeout(()=>$('gateInput').focus(),80);
        $('gateForm').onsubmit=async ev=>{ev.preventDefault();const chave=$('gateInput').value.trim().toLowerCase();if(!chave)return;
          $('gateBtn').disabled=true;$('gateErr').hidden=true;
          try{await db.collection('membros').doc(uid).set({chave,em:Date.now()});try{localStorage.setItem('arcadia:chave',JSON.stringify(chave))}catch(e){}$('gate').hidden=true;done()}
          catch(e){$('gateErr').textContent='Senha incorreta. Confira com a administração do clube.';$('gateErr').hidden=false}
          $('gateBtn').disabled=false}});
      LS.set('membroOk',uid)}
    return {db,uid};
  }

  /* Situação da lista de um nome neste aparelho: 'minha' (abre), 'nova' (ninguém criou ainda) ou 'trancada' (precisa do código) */
  async function situacao(db,nome){
    try{const s=await db.collection('desejos').doc(slug(nome)).get();return s.exists?{st:'minha',dados:s.data()}:{st:'nova'}}
    catch(e){if(e.code==='permission-denied')return{st:'trancada'};throw e}
  }

  /* Caixa "Quem é você": escolhe o nome e cria ou digita o código. Chama pronto(nome, dados) quando a lista abre. */
  function acesso(box,db,uid,pronto){
    const FV=firebase.firestore.FieldValue;
    let nome='';
    const pinInput=(id,rot)=>'<label>'+rot+'<input type="password" id="'+id+'" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" class="pin" placeholder="••••"></label>';
    const lembrete=LS.get('desejosNome','')||LS.get('estanteNome','')||LS.get('leituraNome','')||LS.get('agendaNome','')||((LS.get('me',null)||{}).name||'');
    function escolher(msg){
      box.innerHTML=(msg?'<p class="aviso-ok">'+esc(msg)+'</p>':'')+
        '<form class="form" id="aNome"><label>Seu nome<select id="aSel" required><option value="">Escolha seu nome</option>'+MEMBROS.map(n=>'<option>'+esc(n)+'</option>').join('')+'</select></label>'+
        '<button class="btn wide" type="submit">Continuar</button></form>';
      const sel=$('aSel');sel.value=MEMBROS.find(n=>slug(n)===slug(lembrete))||'';
      $('aNome').onsubmit=async ev=>{ev.preventDefault();if(!sel.value)return;nome=sel.value;await verificar()}}
    async function verificar(){
      box.innerHTML='<p class="muted" style="text-align:center">Abrindo…</p>';
      let r;try{r=await situacao(db,nome)}catch(e){console.warn(e);box.innerHTML='<p class="muted">Não foi possível abrir agora. Recarregue a página.</p>';return}
      if(r.st==='minha'){LS.set('desejosNome',nome);pronto(nome,r.dados);return}
      if(r.st==='nova')return criar();
      digitar()}
    function voltar(){const b=$('aVoltar');if(b)b.onclick=()=>escolher()}
    function criar(){
      box.innerHTML='<p class="passo"><b>'+esc(nome)+'</b>, é a sua primeira vez aqui.</p>'+
        '<p class="muted small" style="margin:0 0 12px">Crie um código de 4 números. Ele protege a sua lista e serve para abrir em outro celular. Guarde bem.</p>'+
        '<form class="form" id="aCriar">'+pinInput('p1','Código de 4 números')+pinInput('p2','Repita o código')+
        '<p class="err" id="aErr" hidden></p><button class="btn wide" type="submit" id="aBtn">Criar minha lista</button>'+
        '<button class="btn ghost wide" type="button" id="aVoltar">Não sou '+esc(nome)+'</button></form>';
      voltar();setTimeout(()=>$('p1').focus(),60);
      $('aCriar').onsubmit=async ev=>{ev.preventDefault();const a=$('p1').value.trim(),b=$('p2').value.trim(),err=$('aErr');
        err.hidden=true;
        if(!/^\d{4}$/.test(a)){err.textContent='O código precisa ter 4 números.';err.hidden=false;return}
        if(a!==b){err.textContent='Os dois códigos não são iguais.';err.hidden=false;return}
        $('aBtn').disabled=true;
        try{const p=await prova(nome,a),k=slug(nome),bt=db.batch();
          bt.set(db.collection('desejos').doc(k),{nome,pin:p,livros:[],especiais:[],recado:'',em:FV.serverTimestamp()});
          bt.set(db.collection('desejosAcesso').doc(uid),{nome:k,prova:p,em:FV.serverTimestamp()});
          await bt.commit();await verificar()}
        catch(e){console.warn(e);
          if(e.code==='permission-denied'){const r=await situacao(db,nome).catch(()=>null);if(r&&r.st==='trancada')return digitar('Alguém já criou a lista com o nome '+nome+'. Digite o código.')}
          err.textContent='Não foi possível criar agora. Tente de novo.';err.hidden=false;$('aBtn').disabled=false}}}
    function digitar(msg){
      box.innerHTML='<p class="passo">Olá, <b>'+esc(nome)+'</b>!</p>'+
        '<p class="muted small" style="margin:0 0 12px">'+esc(msg||'Digite o seu código de 4 números para abrir a sua lista neste aparelho.')+'</p>'+
        '<form class="form" id="aEntrar">'+pinInput('p1','Seu código')+
        '<p class="err" id="aErr" hidden></p><button class="btn wide" type="submit" id="aBtn">Abrir</button>'+
        '<button class="btn ghost wide" type="button" id="aVoltar">Não sou '+esc(nome)+'</button></form>'+
        '<p class="muted small" style="margin:12px 0 0;text-align:center">Esqueceu o código? Peça um novo para a Bia.</p>';
      voltar();setTimeout(()=>$('p1').focus(),60);
      $('aEntrar').onsubmit=async ev=>{ev.preventDefault();const a=$('p1').value.trim(),err=$('aErr');err.hidden=true;
        if(!/^\d{4}$/.test(a)){err.textContent='O código tem 4 números.';err.hidden=false;return}
        $('aBtn').disabled=true;
        try{await db.collection('desejosAcesso').doc(uid).set({nome:slug(nome),prova:await prova(nome,a),em:FV.serverTimestamp()});await verificar()}
        catch(e){console.warn(e);err.textContent=e.code==='permission-denied'?'Código errado. Confira e tente de novo.':'Não foi possível abrir agora. Tente de novo.';err.hidden=false;$('aBtn').disabled=false;$('p1').select()}}}
    /* este aparelho já abriu antes? abre direto */
    (async()=>{const n=MEMBROS.find(x=>slug(x)===slug(LS.get('desejosNome','')));
      if(n){nome=n;let r=null;try{r=await situacao(db,n)}catch(e){}if(r&&r.st==='minha')return pronto(n,r.dados)}
      escolher()})();
    return {
      sair:async()=>{try{await db.collection('desejosAcesso').doc(uid).delete()}catch(e){}LS.del('desejosNome');escolher('Pronto, este aparelho saiu da sua lista.')},
      trocar:async(novo)=>{const p=await prova(nome,novo),k=slug(nome),bt=db.batch();
        bt.update(db.collection('desejos').doc(k),{pin:p,em:FV.serverTimestamp()});
        bt.set(db.collection('desejosAcesso').doc(uid),{nome:k,prova:p,em:FV.serverTimestamp()});
        await bt.commit()}
    };
  }

  window.DESEJOS={esc,slug,LS,MEMBROS,sha,prova,link,site,conectar,situacao,acesso,
    EDICAO:{qualquer:'Qualquer edição',comum:'Capa comum',dura:'Capa dura'},
    TIPO:{colecionador:'Edição de colecionador',luxo:'Edição de luxo',box:'Box'}};
})();
