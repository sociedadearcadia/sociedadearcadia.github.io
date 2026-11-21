/* Sugestões para as redes sociais: partes usadas pela página das integrantes e pela administração */
window.REDES=(function(){
  const TIPOS={post:'Ideia de post',trend:'Trend',resenha:'Resenha',foto:'Foto/registro',outro:'Outro'};
  const ST={recebida:'Recebida',aprovada:'Aprovada',publicada:'Publicada'};
  const MAX={descricao:2000,link:500,nota:600,imagem:900000};
  const tipo=t=>TIPOS[t]?t:'outro';
  const cls=t=>'t-'+tipo(t);
  const tag=t=>'<span class="tag '+cls(t)+'">'+TIPOS[tipo(t)]+'</span>';
  const seg=x=>(x.criadoEm&&x.criadoEm.seconds)||9e9;
  const recentes=(a,b)=>seg(b)-seg(a);
  const antigas=(a,b)=>seg(a)-seg(b);
  const linkOk=s=>/^https?:\/\/\S+$/i.test(s);
  /* foto: diminui no próprio aparelho e guarda como texto (não precisa de armazenamento pago) */
  async function reduzir(file){
    const url=URL.createObjectURL(file);
    try{
      const img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=url});
      for(const lado of [1600,1280,1080,900,720]){
        const k=Math.min(1,lado/Math.max(img.naturalWidth,img.naturalHeight));
        const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*k);c.height=Math.round(img.naturalHeight*k);
        const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);
        for(const q of [.82,.72,.62]){const d=c.toDataURL('image/jpeg',q);if(d.length<=MAX.imagem)return d}
      }
      throw new Error('grande');
    }finally{URL.revokeObjectURL(url)}
  }
  return {TIPOS,ST,MAX,tipo,cls,tag,recentes,antigas,linkOk,reduzir};
})();
