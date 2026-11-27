// Configurações do Sprint da Arcádia ONLINE (lista e Firebase próprios, separados do presencial)
window.ARCADIA_CONFIG = {
  // Link da playlist oficial do clube no Spotify
  playlist: "https://open.spotify.com/playlist/37i9dQZF1EIUV9hXJzgRu9",

  // Integrantes do online: entram sozinhas quando a administração aprova o acesso
  // (lista guardada no aparelho por /online/acesso.js). Não precisa editar aqui.
  membros: (function(){try{var l=JSON.parse(localStorage.getItem('arcadiaOnline:nomes')||'[]');if(Array.isArray(l)&&l.length)return l}catch(e){}return ["Bia"]})(),

  // Sprint coletivo: minutos de leitura e de pausa (prosa), e quantas rodadas seguidas
  coletivo: { leitura: 40, prosa: 15, rodadas: 4 },

  // Chamada do online: link do Google Meet que a administração cola em /online/admin/acesso/ (sem Daily)
  sala: (function(){try{return localStorage.getItem('arcadiaOnline:meet')||''}catch(e){return ''}})(),

  // Firebase do online (o mesmo de /online/config.js)
  firebase: {
    apiKey: "AIzaSyBn_vw3aKPMwpBep-LCVXw3EiCG7QNbxpQ",
    authDomain: "arcadia-online-61481.firebaseapp.com",
    projectId: "arcadia-online-61481",
    storageBucket: "arcadia-online-61481.firebasestorage.app",
    messagingSenderId: "377443526570",
    appId: "1:377443526570:web:edb7921526013ad6106dd3"
  }
};
window.ARCADIA_MODALIDADE = 'online';
