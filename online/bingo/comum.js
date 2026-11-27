/* Bingo: partes usadas pela página das integrantes e pela administração */
window.BINGO=(function(){
  const ST={pendente:'Aguardando',aprovada:'Aprovada',recusada:'Não aprovada'};
  const MAX={obs:400,nota:600,desafio:120,desc:600,desafios:60,fotos:3,titulo:60,regras:9000};
  const TITULO='Bingo Literário 2027';

  /* Tabela e regras aprovadas pelo conselho (21/11/2026). A administração carrega com um toque. */
  const TABELA_2027=`DESAFIOS — LEITURA CONCLUÍDA

01. FORA DA ZONA DE CONFORTO
Concluir um livro de um gênero literário que você nunca experimentou ou que normalmente evita.

02. LITERATURA BRASILEIRA
Concluir um livro escrito por uma autora ou autor brasileiro, independentemente do gênero da obra.

03. UM TÍTULO DE RESPEITO
Concluir um livro que tenha no título uma posição de nobreza ou realeza, como rei, rainha, príncipe, princesa, duque, duquesa, lorde ou imperatriz.

04. CRIATURAS EXTRAORDINÁRIAS
Concluir um livro em que criaturas fantásticas, como dragões, vampiros, feéricos ou seres mitológicos, tenham importância na história.

05. MAIS DE UMA PERSPECTIVA
Concluir um livro narrado pelo ponto de vista de pelo menos dois personagens diferentes.

06. HISTÓRIA INDEPENDENTE
Concluir um livro único, com história independente, que não seja um volume de uma série principal.

07. AUTORIA INÉDITA
Concluir um livro de uma autora ou autor que você nunca tenha lido anteriormente.

08. MORALMENTE QUESTIONÁVEL
Concluir um livro cujo protagonista seja um anti-herói ou uma anti-heroína, com atitudes moralmente ambíguas ou controversas.

DESAFIOS — DURANTE A LEITURA

09. MINHA TEORIA É...
Antes de chegar à metade de um livro, registrar uma previsão sobre algum acontecimento importante da história. Não é necessário acertar.

10. A PRIMEIRA IMPRESSÃO
Registrar uma opinião inicial sobre um personagem e, após avançar na leitura, contar se essa percepção mudou e por quê.

11. E SE FOSSE EU?
Escolher uma decisão importante tomada por um personagem e explicar brevemente o que você faria naquela situação.

12. DETETIVE LITERÁRIA
Identificar uma pista ou detalhe aparentemente importante na história e registrar o que acredita que ele significa.

13. UMA DESCOBERTA NO TEXTO
Encontrar uma palavra, expressão ou referência desconhecida durante a leitura, pesquisar seu significado e registrar a descoberta.

14. ENTRE FICÇÃO E REALIDADE
Pesquisar um elemento histórico, científico, cultural ou mitológico mencionado no livro e compartilhar uma curiosidade verdadeira sobre ele.

15. MERECIA MAIS DESTAQUE
Escolher um personagem secundário de uma leitura em andamento e explicar por que ele mereceria maior participação na história.

DESAFIOS — EXPERIÊNCIAS LITERÁRIAS

16. SPRINT COM OBJETIVO
Participar de um sprint coletivo no site da Arcádia, estabelecer uma meta pessoal antes do início e cumpri-la durante a sessão.

17. TRÊS DIAS DE CONSTÂNCIA
Registrar sessões de leitura no timer do site durante três dias consecutivos. Audiolivros não serão aceitos para este desafio.

18. RESENHA SEM ROSTO
Produzir uma resenha autoral sobre um livro concluído durante o Bingo. Poderá ser publicada no Instagram ou registrada em um espaço privado autorizado pelo clube. Não será necessário aparecer.

19. TÍTULO SEM FRONTEIRAS
Escolher um livro traduzido, descobrir seu título original e explicar qual das versões você prefere e por quê.

20. UM LIVRO SOB MEDIDA
Recomendar um livro para um perfil específico de leitora, considerando suas preferências literárias, e explicar o motivo da indicação. Não vale apenas sugerir títulos para a lista oficial do clube.

21. ADIVINHE O LIVRO
Criar três pistas sobre um livro para que outras integrantes possam tentar descobrir o título. Não será necessário que alguém acerte.

22. POR TRÁS DAS PÁGINAS
Pesquisar e registrar uma curiosidade verificável sobre uma autora ou autor e a criação de uma de suas obras.

23. DEGUSTAÇÃO LITERÁRIA
Ler o primeiro capítulo ou uma amostra gratuita de um livro de um gênero diferente dos seus habituais e registrar se continuaria a leitura e por quê. Não será necessário concluir a obra.

24. JULGUE PELA CAPA
Escolher um livro desconhecido, registrar uma hipótese sobre a história apenas observando a capa e depois comparar sua impressão com a sinopse.

25. DEBATE LITERÁRIO
Criar uma pergunta que provoque reflexão sobre livros, personagens, gêneros ou hábitos de leitura e apresentar sua própria opinião. A participação de outras integrantes não será necessária para validar o desafio.`;


  /* explicação simples, sempre à mostra (mesmo com a tabela escondida) */
  const COMO=[
    {t:'O que é',itens:['É uma brincadeira de leitura.','Tem uma cartela com 25 desafios.','Cumpriu um desafio? Marca a casa.']},
    {t:'Como funciona',itens:['Vale de 1º de janeiro a 30 de abril de 2027.','Você escolhe a ordem. Não precisa ir do 1 ao 25.','Não precisa completar tudo. Cada desafio aprovado já vale ponto.','Cumpriu? Mande um print aqui. A administração confere.','Cada desafio aprovado vale 1 ponto na Arcadiana do Ano.','Completou as 25 casas? É BINGO!','Não precisa comprar nada, aparecer nem gravar vídeo.']},
    {t:'Sua cartela é só sua',itens:['Você entra com seu nome e um código de 4 números que você cria.','Só você e a administração veem a sua cartela.','No ranking, todas veem só a porcentagem de cada uma.']}];

  /* texto em maiúsculas vira "Só a primeira letra maiúscula" */
  const frase=s=>{s=String(s).trim();if(s&&s===s.toUpperCase()&&/[A-ZÀ-Ú]/.test(s)){s=s.toLowerCase();return s.charAt(0).toUpperCase()+s.slice(1)}return s};
  /* Lê a tabela colada na administração.
     Com números ("01. TÍTULO" e a descrição nas linhas de baixo) ou um desafio por linha, sem número.
     Linhas que começam com "DESAFIOS" (ou com "#") viram a categoria dos desafios de baixo. */
  function ler(texto){
    const ls=String(texto||'').split('\n').map(x=>x.trim());
    const numerado=ls.some(l=>/^\d{1,2}[\.\)\-]\s+\S/.test(l));
    let cat='',out=[],cur=null;
    for(const l of ls){
      if(!l){continue}
      if(/^(desafios\b|#)/i.test(l)){cat=frase(l.replace(/^#+\s*/,'').replace(/^desafios\s*[—–\-:]\s*/i,'').replace(/\s*\(\d+\)\s*$/,''));cur=null;continue}
      const m=l.match(/^\d{1,2}[\.\)\-]\s+(.+)$/);
      if(m){cur={t:frase(m[1]),d:'',c:cat};out.push(cur);continue}
      if(numerado){if(cur)cur.d=(cur.d?cur.d+' ':'')+l;continue}
      out.push({t:frase(l),d:'',c:cat})}
    return out}
  /* volta a lista para o formato de texto da administração */
  function texto(ds){let cat=null,s=[];
    (ds||[]).forEach((d,i)=>{if((d.c||'')!==cat){cat=d.c||'';if(cat)s.push((s.length?'\n':'')+'DESAFIOS — '+cat.toUpperCase())}
      s.push((s.length?'\n':'')+String(i+1).padStart(2,'0')+'. '+String(d.t).toUpperCase()+(d.d?'\n'+d.d:''))});
    return s.join('\n')}
  /* bingo = cartela inteira aprovada */
  function bingo(ds,okIds){return !!(ds&&ds.length&&ds.every(d=>okIds.has(d.id)))}

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
  const num=i=>String(i+1).padStart(2,'0');
  return {ST,MAX,TITULO,TABELA_2027,COMO,ler,texto,bingo,comprimir,cartela,recentes,antigas,novoId,num};
})();
