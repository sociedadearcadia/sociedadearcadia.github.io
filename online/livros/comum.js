/* Livros sugeridos: partes usadas pela página das integrantes e pela administração */
window.LIVROS=(function(){
  const GEN={romantasia:'Romantasia',fantasia:'Fantasia'};
  const ICON={
    busca:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    cadeado:'<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    livro:'<path d="M3 6c3-1 6-1 9 1 3-2 6-2 9-1v12c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 7v12"/>'};
  const icon=k=>'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">'+(ICON[k]||'')+'</svg>';
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const slug=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  /* para achar livro repetido: sem acento, sem artigo no começo, só letras e números */
  const chave=s=>slug(s).replace(/^(o|a|os|as|the|um|uma)-/,'').replace(/-/g,'');
  const genero=g=>GEN[g]?g:'fantasia';
  const tag=g=>'<span class="tag g-'+genero(g)+'">'+GEN[genero(g)]+'</span>';
  const hojeISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const dataBR=iso=>{const p=String(iso||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:''};
  const dataLonga=iso=>{const p=String(iso||'').split('-').map(Number);if(p.length!==3)return'';
    return new Date(p[0],p[1]-1,p[2]).toLocaleDateString('pt-BR',{day:'numeric',month:'long'})};
  /* sugestões abertas agora? (a chave liga/desliga e a data final, se houver) */
  const aberto=cfg=>!!(cfg&&cfg.aberto)&&(!cfg.ate||hojeISO()<=cfg.ate);
  /* listas: a da leitura oficial e uma para cada LC extra */
  const listaDe=l=>(l&&l.lista)||'oficial';
  const LCS_INICIAIS={'thriller':{nome:'Thriller e suspense',aberto:true,ativa:true,ordem:1},'true-crime':{nome:'True crime',aberto:true,ativa:true,ordem:2}};
  /* LCs em ordem; ativas=true deixa só as que aparecem para as integrantes */
  const lcs=(cfg,ativas)=>Object.entries((cfg&&cfg.itens)||{}).map(([id,v])=>Object.assign({id},v))
    .filter(l=>!ativas||l.ativa!==false).sort((a,b)=>(a.ordem||99)-(b.ordem||99)||String(a.nome).localeCompare(String(b.nome)));
  const ordem=(a,b)=>String(a.titulo||'').localeCompare(String(b.titulo||''),'pt-BR',{sensitivity:'base'});
  return {listaDe,LCS_INICIAIS,lcs,GEN,icon,esc,slug,chave,genero,tag,hojeISO,dataBR,dataLonga,aberto,ordem};
})();
