/* Provas do bingo: partes usadas pela página das integrantes e pela administração */
window.BINGO=(function(){
  const ST={pendente:'Aguardando',aprovada:'Aprovada',recusada:'Não aprovada'};
  const MAX={obs:300,nota:600,desafio:200,desafios:60,fotos:3,titulo:60};
  const TITULO='Bingo dos Reinos';
  /* cada print vira uma imagem JPEG menor, para caber no banco de dados gratuito */
  const LIMITE=280000; // caracteres por imagem (cerca de 200 KB)
  function abrir(file){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();
    im.onload=()=>{ok(im);setTimeout(()=>URL.revokeObjectURL(u),1000)};im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('imagem'))};im.src=u})}
  async function comprimir(file){
    const im=await abrir(file);let lado=1600,q=.72,out='';
    for(let i=0;i<12;i++){
      const k=Math.min(1,lado/Math.max(im.naturalWidth,im.naturalHeight));
      const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*k));c.height=Math.max(1,Math.round(im.naturalHeight*k));
      const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
      out=c.toDataURL('image/jpeg',q);if(out.length<=LIMITE)return out;
      if(q>.5)q-=.1;else lado=Math.round(lado*.8)}
    if(out.length>LIMITE)throw new Error('grande');return out}
  /* situação de um desafio para uma integrante: aprovada vale mais que aguardando, que vale mais que não aprovada */
  const PESO={aprovada:3,pendente:2,recusada:1};
  function cartela(provas){const m={};provas.forEach(p=>{const a=m[p.desafio];if(!a||(PESO[p.status]||0)>(PESO[a.status]||0))m[p.desafio]=p});return m}
  const seg=x=>(x.criadoEm&&x.criadoEm.seconds)||9e9;
  const recentes=(a,b)=>seg(b)-seg(a),antigas=(a,b)=>seg(a)-seg(b);
  const novoId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  return {ST,MAX,TITULO,comprimir,cartela,recentes,antigas,novoId};
})();
