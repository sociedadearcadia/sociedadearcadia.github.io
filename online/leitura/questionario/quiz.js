/* Questionário de confirmação de leitura: partes usadas pela página das integrantes e pela administração */
window.QUIZ=(function(){
  const LETRAS='abcdefgh';
  /* Texto colado pela administração -> perguntas + gabarito.
     Formato:
       1. Pergunta
       a) opção
       b) opção certa *
       c) opção
       (pergunta sem opções = resposta escrita, não conta na nota) */
  function ler(txt){
    const perguntas=[],certas=[],erros=[];let cur=null;
    const fecha=()=>{if(!cur)return;const n=perguntas.length+1;
      if(!cur.p)erros.push('Pergunta '+n+' está sem texto.');
      if(cur.o.length===1)erros.push('Pergunta '+n+' tem só uma opção.');
      if(cur.o.length>1&&cur.c.length!==1)erros.push('Pergunta '+n+': marque exatamente uma opção certa com * no fim.');
      perguntas.push({p:cur.p,o:cur.o});certas.push(cur.o.length?(cur.c[0]==null?-1:cur.c[0]):-1);cur=null};
    String(txt||'').replace(/\r/g,'').split('\n').forEach(l=>{
      const s=l.trim();if(!s)return;
      let m=s.match(/^(\d{1,2})\s*[.)\-–]\s*(.*)$/);
      if(m){fecha();cur={p:m[2].trim(),o:[],c:[]};return}
      m=s.match(/^([a-hA-H])\s*[)\.]\s+(.*)$/);
      if(m&&cur){let t=m[2].trim();if(/\*\s*$/.test(t)){t=t.replace(/\s*\*\s*$/,'');cur.c.push(cur.o.length)}cur.o.push(t);return}
      if(cur){if(cur.o.length)cur.o[cur.o.length-1]+=' '+s;else cur.p+=(cur.p?' ':'')+s}
    });
    fecha();
    if(!perguntas.length)erros.push('Nenhuma pergunta encontrada. Cada pergunta começa com o número, por exemplo "1. ".');
    if(perguntas.length>30)erros.push('No máximo 30 perguntas.');
    perguntas.forEach((q,i)=>{if(q.p.length>400)erros.push('Pergunta '+(i+1)+' está muito longa.');if(q.o.length>8)erros.push('Pergunta '+(i+1)+' tem opções demais (máximo 8).');q.o.forEach(o=>{if(o.length>200)erros.push('Uma opção da pergunta '+(i+1)+' está muito longa.')})});
    return {perguntas,certas,erros};
  }
  /* perguntas + gabarito -> texto (para corrigir) */
  function texto(perguntas,certas){
    return (perguntas||[]).map((q,i)=>(i+1)+'. '+q.p+(q.o||[]).map((o,j)=>'\n'+LETRAS[j]+') '+o+((certas||[])[i]===j?' *':'')).join('')).join('\n\n');
  }
  /* Ordem das opções embaralhada, sempre a mesma para cada aparelho */
  function ordem(n,semente){
    let h=2166136261;for(const ch of String(semente)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
    const r=()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return (h>>>0)/4294967296};
    const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
  }
  /* Nota: acertos entre as perguntas de múltipla escolha */
  function nota(perguntas,certas,resp){
    let total=0,acertos=0;(perguntas||[]).forEach((q,i)=>{if(!(q.o||[]).length)return;total++;if(resp&&resp[i]===certas[i])acertos++});
    return {acertos,total,pct:total?Math.round(acertos*100/total):0};
  }
  return {ler,texto,ordem,nota,LETRAS};
})();
