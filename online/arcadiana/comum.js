/* Arcadiana do Ano: partes usadas pela página das integrantes e pela administração */
window.ARCADIANA=(function(){
  const TIPOS={livro:'Livro do Mês',presenca:'Encontro oficial',extra:'Pontos extras'};
  const PTS={livro:10,presenca:5};
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const slug=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const hojeISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const dataCurta=iso=>{const p=String(iso||'').split('-');return p.length===3?p[2]+'/'+p[1]:''};
  const pontos=n=>n===1?'1 ponto':n+' pontos';
  /* conta os pontos de cada integrante e ordena:
     1) mais pontos  2) mais Livros do Mês concluídos  3) mais encontros oficiais  4) sorteio */
  function ranking(lista,membros,sorteio){
    const by={};
    const novo=n=>({nome:n,total:0,livros:0,presencas:0,extras:0,itens:[]});
    (membros||[]).forEach(n=>by[slug(n)]=novo(n));
    (lista||[]).forEach(p=>{
      if(p.anulado||!(p.pts>0))return;
      const k=slug(p.nome);const r=by[k]||(by[k]=Object.assign(novo(p.nome),{fora:true}));
      r.total+=p.pts;
      if(p.tipo==='livro')r.livros++;else if(p.tipo==='presenca')r.presencas++;else r.extras+=p.pts;
      r.itens.push(p)});
    const sor=(sorteio||[]).map(slug);
    const si=n=>{const i=sor.indexOf(slug(n));return i<0?1e9:i};
    const chave=r=>r.total+'|'+r.livros+'|'+r.presencas;
    const arr=Object.values(by).sort((a,b)=>b.total-a.total||b.livros-a.livros||b.presencas-a.presencas||(a.total>0?si(a.nome)-si(b.nome):0)||a.nome.localeCompare(b.nome,'pt'));
    arr.forEach((r,i)=>{
      r.itens.sort((a,b)=>String(b.data).localeCompare(String(a.data)));
      const ant=arr[i-1];
      const empata=x=>x&&x.total>0&&chave(x)===chave(r);
      // sem sorteio, quem empata em tudo fica na mesma posição
      if(ant&&empata(ant)&&(si(ant.nome)===1e9||si(r.nome)===1e9)){r.pos=ant.pos;r.empate=true;ant.empate=true}
      else r.pos=i+1;
    });
    /* por que ficou à frente (ou atrás) de quem tem os mesmos pontos */
    const motivo=(x,y)=>x.livros!==y.livros?'livros':x.presencas!==y.presencas?'presencas':(si(x.nome)<1e9&&si(y.nome)<1e9?'sorteio':'');
    arr.forEach((r,i)=>{if(!(r.total>0)||r.empate)return;
      const prox=arr[i+1],ant=arr[i-1];
      if(prox&&prox.total===r.total)r.porque=motivo(r,prox);
      else if(ant&&ant.total===r.total)r.porque=motivo(ant,r)});
    return arr;
  }
  /* grupos ainda empatados em tudo (com pontos), para o sorteio */
  function empates(arr){
    const g={};arr.forEach(r=>{if(r.total>0){const k=r.total+'|'+r.livros+'|'+r.presencas;(g[k]=g[k]||[]).push(r)}});
    return Object.values(g).filter(x=>x.length>1);
  }
  const DESEMPATE={livros:'desempate: mais Livros do Mês',presencas:'desempate: mais encontros oficiais',sorteio:'desempate: sorteio'};
  return {TIPOS,PTS,esc,slug,hojeISO,dataCurta,pontos,ranking,empates,DESEMPATE};
})();
