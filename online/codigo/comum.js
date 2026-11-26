/* Código da Sociedade Arcádia: transforma o texto colado pela administração em seções.
   Formato: "## Título" abre uma seção numerada · "### Subtítulo" · "• " ou "- " item de lista ·
   "Coluna | Coluna" linhas de tabela (a primeira é o cabeçalho) · "> " destaque · "*frase*" fecho em itálico. */
window.CODIGO=(function(){
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'secao';
  const num=i=>String(i).padStart(2,'0');
  /* blocos de uma parte do texto */
  function blocos(linhas){
    let h='',lista=[],tab=[];
    const fecha=()=>{if(lista.length){h+='<ul class="cl">'+lista.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';lista=[]}
      if(tab.length){const [c,...r]=tab;h+='<div class="tb"><table><thead><tr>'+c.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+
        r.map(l=>'<tr>'+l.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';tab=[]}};
    linhas.forEach(l=>{const t=l.trim();
      if(!t){fecha();return}
      if(/^[•\-–]\s+/.test(t)){if(tab.length)fecha();lista.push(t.replace(/^[•\-–]\s+/,''));return}
      if(t.includes(' | ')){if(lista.length)fecha();tab.push(t.split('|').map(x=>x.trim()));return}
      fecha();
      if(t.startsWith('### '))h+='<h3>'+esc(t.slice(4))+'</h3>';
      else if(t.startsWith('> '))h+='<p class="dest">'+esc(t.slice(2))+'</p>';
      else if(/^\*.+\*$/.test(t))h+='<p class="fecho">'+esc(t.slice(1,-1))+'</p>';
      else h+='<p>'+esc(t)+'</p>'});
    fecha();return h}
  /* texto inteiro -> {intro, secoes:[{id,n,titulo,html,busca}]} */
  function ler(texto){
    const partes=String(texto||'').replace(/\r/g,'').split('\n');
    const intro=[],secoes=[];let atual=null;
    partes.forEach(l=>{const t=l.trim();
      if(t.startsWith('## ')){atual={titulo:t.slice(3).trim(),linhas:[]};secoes.push(atual)}
      else (atual?atual.linhas:intro).push(l)});
    const usados={};
    return {intro:blocos(intro),introTxt:intro.join(' '),secoes:secoes.map((s,i)=>{let id=slug(s.titulo);if(usados[id])id+='-'+(i+1);usados[id]=1;
      return {id,n:num(i+1),titulo:s.titulo,html:blocos(s.linhas),busca:(s.titulo+' '+s.linhas.join(' ')).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}})}}
  return {ler,esc,slug};
})();
