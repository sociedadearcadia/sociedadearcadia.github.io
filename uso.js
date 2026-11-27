/* Monitoramento de participação (só a administração vê, em /admin/participacao/).
   Vai nas páginas das integrantes (presencial e /online/). Depois que a página já entrou no Firebase
   e a integrante passou pela senha/aprovação, anota em uso/{uid}: o dia em que abriu esta página.
   No máximo uma gravação por página por dia em cada aparelho, e só alguns segundos depois de abrir
   (não atrasa nada na página). A página "Fale com a administração" não é anotada, para não identificar mensagens sem nome. */
(function(){
  var online=/^\/online(\/|$)/.test(location.pathname);
  var P=online?'arcadiaOnline:':'arcadia:';
  var cam=location.pathname.replace(/^\/online/,'').replace(/index\.html$/,'').split('/').filter(Boolean);
  if(!cam.length||/admin|respostas/.test(cam.join('/'))||['mensagem','lista-de-espera','ingresso','visita-k7q3lua','previa'].indexOf(cam[0])>=0)return;
  var pg=cam.slice(0,2).join('-').replace(/[^a-z0-9-]/gi,'').slice(0,40);if(!pg)return;
  function ler(k){try{var v=localStorage.getItem(P+k);if(v==null)return null;try{return JSON.parse(v)}catch(e){return v}}catch(e){return null}}
  function gravar(k,v){try{localStorage.setItem(P+k,JSON.stringify(v))}catch(e){}}
  var d=new Date(),z=function(n){return(n<10?'0':'')+n};
  var mes=d.getFullYear()+'-'+z(d.getMonth()+1),dia=mes+'-'+z(d.getDate());
  if(ler('uso:'+pg)===dia)return;
  function nome(){
    var me=ler('me');if(me&&me.name)return String(me.name);
    var ks=['nome','leituraNome','agendaNome','livrosNome','votacaoNome','estanteNome','cartasNome','ideiasNome','redesNome','desejosNome','limpezaNome','bingoNome','arcadianaNome'];
    for(var i=0;i<ks.length;i++){var v=ler(ks[i]);if(v&&typeof v==='string')return v}
    return''}
  var tentativas=0,erros=0;
  function tentar(){
    tentativas++;if(tentativas>60)return;
    var fb=window.firebase;
    if(!fb||!fb.apps||!fb.apps.length||!fb.auth||!fb.firestore)return setTimeout(tentar,2000);
    var u=fb.auth().currentUser,ok=ler('membroOk');
    if(!u||!ok||ok!==u.uid)return setTimeout(tentar,2000);
    var F=fb.firestore.FieldValue,dados={nome:nome().slice(0,40),ult:F.serverTimestamp(),p:{},pu:{}};
    dados.p[pg]=F.increment(1);dados.pu[pg]=Date.now();
    if(ler('usoDia')!==dia){dados.m={};dados.m[mes]=F.increment(1)}
    fb.firestore().collection('uso').doc(u.uid).set(dados,{merge:true}).then(function(){gravar('uso:'+pg,dia);gravar('usoDia',dia)})
      .catch(function(e){erros++;if(erros<3)setTimeout(tentar,30000)})}
  setTimeout(tentar,4000);
})();
