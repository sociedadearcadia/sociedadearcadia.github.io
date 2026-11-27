// Configurações do Sprint da Arcádia ONLINE (lista e Firebase próprios, separados do presencial)
window.ARCADIA_CONFIG = {
  // Link da playlist oficial do clube no Spotify
  playlist: "https://open.spotify.com/playlist/37i9dQZF1EIUV9hXJzgRu9",

  // Integrantes do online: cada nome vira uma opção na tela de boas-vindas.
  // Para incluir alguém, coloque o nome entre aspas, seguido de vírgula.
  membros: [
    "Bia"
  ],

  // Sprint coletivo: minutos de leitura e de pausa (prosa), e quantas rodadas seguidas
  coletivo: { leitura: 40, prosa: 15, rodadas: 4 },

  // Sala de vídeo do online no Daily.co (separada da sala do presencial)
  sala: "",

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
