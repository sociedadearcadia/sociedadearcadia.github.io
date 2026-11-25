/* Cartas e Teorias Seladas: partes usadas pela página das integrantes e pela administração */
window.CARTAS=(function(){
  const p=iso=>String(iso||'').split('-').map(Number);
  const ms=t=>t&&t.toMillis?t.toMillis():(t instanceof Date?t.getTime():0);
  /* fim do dia e um horário, no fuso deste aparelho */
  const fimDia=iso=>{const d=p(iso);return new Date(d[0],d[1]-1,d[2],23,59,59)};
  const noHorario=(iso,hora)=>{const d=p(iso),h=String(hora||'00:00').split(':').map(Number);return new Date(d[0],d[1]-1,d[2],h[0]||0,h[1]||0,0)};
  const somaDias=(iso,n)=>{const d=p(iso),x=new Date(d[0],d[1]-1,d[2]);x.setDate(x.getDate()+n);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
  /* situação de uma rodada: 'escrita' (dá para lacrar), 'lacrada' (esperando abrir) ou 'aberta' */
  const situacao=(r,agora)=>{agora=agora||Date.now();if(agora>=ms(r.abreEm))return'aberta';return agora<=ms(r.ateEm)?'escrita':'lacrada'};
  const quando=t=>{const d=new Date(ms(t));if(!ms(t))return'';
    const s=d.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
    const h=d.getHours()||d.getMinutes()?' às '+String(d.getHours()).padStart(2,'0')+'h'+(d.getMinutes()?String(d.getMinutes()).padStart(2,'0'):''):'';
    return s.charAt(0).toUpperCase()+s.slice(1)+h};
  const curto=t=>ms(t)?new Date(ms(t)).toLocaleDateString('pt-BR',{day:'numeric',month:'long'}):'';
  /* a rodada da vez: a que ainda não abriu (a mais próxima), senão a última aberta */
  const atual=rs=>{const agora=Date.now();
    const vem=rs.filter(r=>situacao(r,agora)!=='aberta').sort((a,b)=>ms(a.abreEm)-ms(b.abreEm))[0];
    return vem||rs.slice().sort((a,b)=>ms(b.abreEm)-ms(a.abreEm))[0]||null};
  const MAX=2000;
  return {ms,fimDia,noHorario,somaDias,situacao,quando,curto,atual,MAX};
})();
