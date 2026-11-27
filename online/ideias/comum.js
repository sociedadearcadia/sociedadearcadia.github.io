/* Ideias de atividades: partes usadas pela página das integrantes e pela administração */
window.IDEIAS=(function(){
  const TIPOS={oficina:'Atividade online',extra:'Encontro extra'};
  const ST={pendente:'Aguardando',aprovada:'Aprovada',recusada:'Não aprovada'};
  const MAX={titulo:100,explicacao:2000,organizacao:3000,nota:600};
  const tipo=t=>TIPOS[t]?t:'extra';
  const cls=t=>'t-'+tipo(t);
  const tag=t=>'<span class="tag '+cls(t)+'">'+TIPOS[tipo(t)]+'</span>';
  const seg=x=>(x.criadoEm&&x.criadoEm.seconds)||9e9;
  const recentes=(a,b)=>seg(b)-seg(a);
  const antigas=(a,b)=>seg(a)-seg(b);
  return {TIPOS,ST,MAX,tipo,cls,tag,recentes,antigas};
})();
