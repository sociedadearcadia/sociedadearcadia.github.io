/* Votação do livro do mês: partes usadas pela página das integrantes e pela administração */
window.VOTACAO=(function(){
  const p=iso=>String(iso||'').split('-').map(Number);
  /* começo e fim do dia no horário deste aparelho */
  const inicioDia=iso=>{const d=p(iso);return new Date(d[0],d[1]-1,d[2],0,0,0)};
  const fimDia=iso=>{const d=p(iso);return new Date(d[0],d[1]-1,d[2],23,59,59)};
  const somaDias=(iso,n)=>{const d=inicioDia(iso);d.setDate(d.getDate()+n);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const ms=t=>t&&t.toMillis?t.toMillis():(t instanceof Date?t.getTime():0);
  /* situação de uma votação agora: 'antes', 'aberta' ou 'encerrada' */
  const situacao=(v,agora)=>{agora=agora||Date.now();return agora<ms(v.abreEm)?'antes':agora<=ms(v.fechaEm)?'aberta':'encerrada'};
  const dataLonga=iso=>{if(!iso)return'';const s=inicioDia(iso).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});return s.charAt(0).toUpperCase()+s.slice(1)};
  const dataCurta=iso=>iso?inicioDia(iso).toLocaleDateString('pt-BR',{day:'numeric',month:'long'}):'';
  const mesDe=iso=>iso?inicioDia(iso).toLocaleDateString('pt-BR',{month:'long'}):'';
  return {inicioDia,fimDia,somaDias,ms,situacao,dataLonga,dataCurta,mesDe};
})();
