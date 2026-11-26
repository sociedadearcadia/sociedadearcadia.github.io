# Área online

Tudo aqui dentro é gerado por `ferramentas/gerar-online.py` a partir das páginas do presencial
(exceto `config.js`, `sprint/config.js` e este arquivo, feitos à mão).

Depois de mudar qualquer página das integrantes (ou o sprint), rode na raiz do repositório:

    python3 ferramentas/gerar-online.py ../sprint

- `config.js`: Firebase do projeto online (separado do presencial).
- `sprint/config.js`: lista de integrantes do online, sala de vídeo e o mesmo Firebase online.
- As regras do Firestore são as mesmas do presencial (`sociedadearcadia/sprint/firestore.rules`), coladas no projeto online.
