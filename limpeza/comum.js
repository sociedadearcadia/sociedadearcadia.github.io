/* Limpeza da lista de livros: partes usadas pela página das integrantes e pela administração */
window.LIMPEZA=(function(){
  const ms=t=>t&&t.toMillis?t.toMillis():(t instanceof Date?t.getTime():0);
  const p=iso=>String(iso||'').split('-').map(Number);
  /* fim do dia no horário deste aparelho */
  const fimDia=iso=>{const d=p(iso);return new Date(d[0],d[1]-1,d[2],23,59,59)};
  const somaDias=(iso,n)=>{const d=p(iso),x=new Date(d[0],d[1]-1,d[2]);x.setDate(x.getDate()+n);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
  /* aberta agora? (não encerrada e antes do fim do último dia) */
  const aberta=(l,agora)=>!!l&&!l.encerrada&&(agora||Date.now())<=ms(l.fechaEm);
  /* a limpeza que vale agora: a aberta mais nova; se não tiver, a mais nova de todas */
  const atual=ls=>{const o=ls.slice().sort((a,b)=>ms(b.criadoEm||b.fechaEm)-ms(a.criadoEm||a.fechaEm));return o.find(l=>aberta(l))||o[0]||null};
  /* embaralhar sempre do mesmo jeito para a mesma pessoa (cada uma vê numa ordem diferente) */
  function embaralhar(arr,semente){let h=1779033703^semente.length;
    for(let i=0;i<semente.length;i++){h=Math.imul(h^semente.charCodeAt(i),3432918353);h=h<<13|h>>>19}
    let a=h>>>0;const rnd=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
    const r=arr.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
  return {ms,fimDia,somaDias,aberta,atual,embaralhar};
})();
