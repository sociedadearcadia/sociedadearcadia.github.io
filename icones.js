/* Ícones da Sociedade Arcádia: traço dourado fino, no estilo das artes do clube.
   Uso: ARC_ICONE('livro') devolve o <svg>. Para um ícone novo, desenhe numa grade de 24x24. */
(function(){
  const P={
    livro:'<path d="M3 6.5c3-1.2 6-1.1 9 .8 3-1.9 6-2 9-.8V19c-3-1.2-6-1.1-9 .8-3-1.9-6-2-9-.8z"/><path d="M12 7.3v12.5"/><path d="M17.6 2.6a1.9 1.9 0 1 0 1.8 2.6 1.5 1.5 0 0 1-1.8-2.6z" class="f"/>',
    pergunta:'<path d="M6 3.5h10.5a2 2 0 0 1 2 2V19a1.5 1.5 0 0 1-3 0v-1.5H4.5V19a2 2 0 0 0 2 2h10.5"/><path d="M6 3.5a2 2 0 0 0-2 2v1.5h2"/><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4"/><circle cx="12" cy="15.2" r=".4" class="f"/>',
    carta:'<rect x="3" y="5.5" width="18" height="13" rx="1.6"/><path d="M3.4 6.3l8.6 6.4 8.6-6.4"/><circle cx="12" cy="13.6" r="2.6" class="f"/><path d="M12 12.4l.4.8.9.1-.6.6.1.9-.8-.4-.8.4.1-.9-.6-.6.9-.1z" class="e"/>',
    estante:'<path d="M4 20.5h16"/><rect x="4.5" y="6" width="3.2" height="14.5" rx=".5"/><rect x="8.3" y="4" width="3.2" height="16.5" rx=".5"/><path d="M13.2 8.2l3-.8 3.6 13-3 .8z"/><path d="M4.5 9h3.2M8.3 7h3.2M8.3 17.5h3.2"/>',
    vassoura:'<path d="M19.5 3.5l-6.3 8.6"/><path d="M10.2 10.6l5 3.6-2.6 6.3c-3.3-.9-6.2-3-7.6-6.2z"/><path d="M8.6 15.9l3.4-3M10.3 18.1l3-3.3"/><path d="M5 5.5l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" class="f"/>',
    calendario:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M13.6 12.2a3.2 3.2 0 1 0 2.8 4.8 2.6 2.6 0 0 1-2.8-4.8z" class="f"/>',
    ampulheta:'<path d="M6 3h12M6 21h12"/><path d="M7.2 3c0 4.4 4.8 6 4.8 9s-4.8 4.6-4.8 9M16.8 3c0 4.4-4.8 6-4.8 9s4.8 4.6 4.8 9"/><path d="M9.3 19.5c.6-1.6 1.6-2.5 2.7-2.5s2.1.9 2.7 2.5z" class="f"/>',
    lanterna:'<path d="M12 2v2.2"/><path d="M8.5 6.5L12 4.2l3.5 2.3"/><path d="M7.8 6.5h8.4l-.8 11.5H8.6z"/><path d="M7 18h10M9.5 21h5M10 18v3M14 18v3"/><path d="M12 9.8c1 1.2 1.4 2.1 1.4 2.9a1.4 1.4 0 0 1-2.8 0c0-.8.4-1.7 1.4-2.9z" class="f"/>',
    cartela:'<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/><path d="M12 10.3l.5 1.1 1.2.1-.9.8.3 1.2-1.1-.6-1.1.6.3-1.2-.9-.8 1.2-.1z" class="f"/>',
    coroa:'<path d="M3.5 8l4 3.6L12 5l4.5 6.6 4-3.6-1.7 10H5.2z"/><path d="M5.2 20.5h13.6"/><circle cx="12" cy="14.2" r="1.1" class="f"/>',
    brilho:'<path d="M10 3.5l1.6 5 5 1.6-5 1.6-1.6 5-1.6-5-5-1.6 5-1.6z"/><path d="M18 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" class="f"/><path d="M18.5 3.5l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" class="f"/>',
    moldura:'<rect x="3.5" y="4.5" width="17" height="15" rx="1.6"/><path d="M3.5 17l5-5.2 3.6 3.6 2.4-2.4 6 5.4"/><path d="M15.6 7.5a1.8 1.8 0 1 0 1.6 2.7 1.4 1.4 0 0 1-1.6-2.7z" class="f"/>',
    bussola:'<circle cx="12" cy="12" r="8.5"/><path d="M15.3 8.7l-1.8 4.8-4.8 1.8 1.8-4.8z"/><circle cx="12" cy="12" r=".9" class="f"/><path d="M12 2v1.5M12 20.5V22M2 12h1.5M20.5 12H22"/>',
    envelope:'<path d="M3.5 10l8.5-6 8.5 6v10H3.5z"/><path d="M6.5 11.5V6.8h11v4.7"/><path d="M3.8 10.3l8.2 5.6 8.2-5.6"/><path d="M9.5 9h5M9.5 11h3"/>',
    chama:'<path d="M12 21c-3.6 0-6-2.4-6-5.7 0-3.8 3.4-5.5 3.8-10.3 2.4 1.8 3.5 4 3.4 6.3 1-.6 1.7-1.6 1.9-2.8 1.8 1.8 2.9 4.1 2.9 6.8C18 18.6 15.6 21 12 21z"/><path d="M12 21c-1.5 0-2.6-1.1-2.6-2.6 0-1.7 1.6-2.6 2.2-4.5 1.6 1.2 3 2.6 3 4.5 0 1.5-1.1 2.6-2.6 2.6z" class="f"/>',
    codigo:'<path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14"/>',
    chave:'<circle cx="7.5" cy="14.5" r="4"/><circle cx="7.5" cy="14.5" r="1.3" class="f"/><path d="M10.4 11.6l8.1-8.1M15.6 6.4l2.2 2.2M13.4 8.6l1.8 1.8"/><path d="M18.5 13.5l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" class="f"/>',
    conselho:'<circle cx="12" cy="8" r="3"/><path d="M6.5 20c.5-3.3 2.7-5.5 5.5-5.5s5 2.2 5.5 5.5"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M2 18.5c.3-2.1 1.4-3.5 3-3.8M22 18.5c-.3-2.1-1.4-3.5-3-3.8"/>'
  };
  window.ARC_ICONE=k=>'<svg class="arc-ic" viewBox="0 0 24 24" aria-hidden="true">'+(P[k]||P.brilho)+'</svg>';
})();
