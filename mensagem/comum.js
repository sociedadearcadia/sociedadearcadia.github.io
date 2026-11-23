/* Fale com a administração: partes usadas pela página das integrantes e pela administração */
window.MENSAGEM=(function(){
  const TIPOS={elogio:'Elogio',reclamacao:'Reclamação',problema:'Problema',outro:'Outro'};
  const MAX={texto:3000,resposta:1500};
  const tipo=t=>TIPOS[t]?t:'outro';
  const cls=t=>'m-'+tipo(t);
  const tag=t=>'<span class="tag '+cls(t)+'">'+TIPOS[tipo(t)]+'</span>';
  const seg=x=>(x.criadoEm&&x.criadoEm.seconds)||9e9;
  const recentes=(a,b)=>seg(b)-seg(a);
  return {TIPOS,MAX,tipo,cls,tag,recentes};
})();
