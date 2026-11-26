/* Artes do clube: partes usadas pela galeria das integrantes e pela administração */
window.ARTES=(function(){
  /* categorias sugeridas, nesta ordem; a administração pode criar outras */
  const CATS=['Livro do Mês','Stories do sprint','Avaliação de livro','Lidos do ano'];
  const PARTE=900000; /* bytes por parte (o Firestore aceita até 1 MB por documento) */
  const MAX=20*1024*1024; /* tamanho máximo de um arquivo */
  const tam=b=>b>=1048576?(b/1048576).toFixed(1).replace('.',',')+' MB':Math.max(1,Math.round(b/1024))+' KB';
  const seg=x=>(x.criadoEm&&x.criadoEm.seconds)||9e9;
  const ordCat=(a,b)=>{const i=CATS.indexOf(a),j=CATS.indexOf(b);
    return (i<0?99:i)-(j<0?99:j)||String(a).localeCompare(String(b),'pt-BR',{sensitivity:'base'})};
  /* [[categoria,[artes mais novas primeiro]],…] */
  const grupos=lista=>{const m={};lista.forEach(x=>{(m[x.categoria]=m[x.categoria]||[]).push(x)});
    return Object.keys(m).sort(ordCat).map(c=>[c,m[c].sort((a,b)=>seg(b)-seg(a))])};
  const ehImagem=t=>/^image\//.test(t||'');
  const rotulo=t=>t==='application/pdf'?'PDF':(String(t||'').split('/')[1]||'arquivo').toUpperCase().replace('JPEG','JPG');
  /* junta as partes guardadas no Firestore e devolve o arquivo */
  async function arquivo(db,x){
    const s=await db.collection('artes').doc(x._id).collection('partes').get();
    const ps=s.docs.map(d=>[Number(d.id),d.data().d]).sort((a,b)=>a[0]-b[0]);
    if(ps.length!==x.partes)throw new Error('incompleto');
    return new Blob(ps.map(p=>p[1].toUint8Array()),{type:x.tipo})}
  return {CATS,PARTE,MAX,tam,grupos,ehImagem,rotulo,arquivo,ordCat};
})();
