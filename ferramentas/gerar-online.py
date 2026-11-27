#!/usr/bin/env python3
"""Gera a área online (/online/...) a partir das páginas do presencial.

A área online é uma cópia das páginas das integrantes, com:
  - links internos apontando para /online/...
  - outro projeto do Firebase (online/config.js) e outra lista de integrantes (online/sprint/config.js)
  - chaves do localStorage próprias (para quem usa as duas áreas no mesmo aparelho)
  - Hogwarts sem as datas do presencial (a administração define no painel)

Uso (na raiz do repositório do site, com o repositório do sprint ao lado ou indicado):
    python3 ferramentas/gerar-online.py [caminho-do-repo-sprint]

Não edite nada dentro de online/ à mão, exceto os arquivos em PROPRIOS: o resto é apagado e gerado de novo.
"""
import os, re, shutil, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRINT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(os.path.dirname(RAIZ), 'sprint')
DEST = os.path.join(RAIZ, 'online')

# páginas das integrantes que ganham cópia online (uma pasta nova de integrantes: inclua aqui)
PASTAS = ['integrantes', 'admin', 'leitura', 'agenda', 'livros', 'votacao', 'estante', 'cartas',
          'codigo', 'bingo', 'arcadiana', 'redes', 'artes', 'mensagem', 'guia', 'limpeza', 'hogwarts']
# pastas novas que outras páginas criarem entram sozinhas se estiverem listadas em integrantes/index.html
# pastas que o online NÃO tem (Bia, 2026-11-26: no online não há oficinas; encontros extras entram direto na agenda)
FORA = {'sprint', 'ideias'}
# arquivos de online/ feitos à mão (não são apagados nem gerados)
PROPRIOS = {'config.js', 'sprint/config.js', 'LEIA-ME.md', 'acesso.js', 'admin/acesso/index.html'}
TEXTO = ('.html', '.js', '.css', '.json', '.webmanifest', '.txt', '.md')


def pastas_do_menu():
    """Pastas citadas no menu de integrantes (u:'/pasta/'), para não esquecer páginas novas."""
    try:
        t = open(os.path.join(RAIZ, 'integrantes', 'index.html'), encoding='utf-8').read()
    except OSError:
        return []
    return [p for p in re.findall(r"u:'/([a-z0-9-]+)/", t) if p not in FORA]


def reescrever(t, todas):
    alt = '|'.join(sorted(set(todas) | {'sprint'}, key=len, reverse=True))
    # links e arquivos absolutos das páginas das integrantes -> /online/...
    t = re.sub(r'''(["'`(=,\s])/(%s)(?=[/"'`?#)\s]|$)''' % alt, r'\1/online/\2', t)
    t = re.sub(r'sociedadearcadia\.com\.br/(%s)(?=[/\s"\'`<)]|$)' % alt, r'sociedadearcadia.com.br/online/\1', t)
    t = t.replace('"/config.js"', '"/online/config.js"').replace("'/config.js'", "'/online/config.js'")
    # memória do aparelho separada da do presencial
    t = t.replace("'arcadia:", "'arcadiaOnline:").replace('"arcadia:', '"arcadiaOnline:').replace('`arcadia:', '`arcadiaOnline:')
    t = t.replace("'hogwarts:", "'hogwartsOnline:")
    return t


def projeto_online():
    try:
        m = re.search(r'projectId:\s*"([^"]+)"', open(os.path.join(DEST, 'config.js'), encoding='utf-8').read())
        return m.group(1) if m else ''
    except OSError:
        return ''


def com_acesso(t):
    """Entrada com Google + aprovação (online/acesso.js) logo depois do config."""
    if '/online/acesso.js' in t:
        return t
    for cfg in ('<script src="/online/config.js"></script>', '<script src="/online/sprint/config.js"></script>'):
        if cfg in t:
            return t.replace(cfg, cfg + '\n<script src="/online/acesso.js"></script>', 1)
    return t


def sem_ideias(t):
    """Tira a página de ideias de oficinas/encontros extras (o online não tem)."""
    t = re.sub(r"\n[ \t]*\{ic:'lanterna',n:'Ideias de encontros'[^\n\]]*?\},(?=\n)", '', t)
    t = re.sub(r",\n[ \t]*\{ic:'lanterna',n:'Ideias de encontros'[^\n\]]*?\}(?=\]\})", '', t)
    t = re.sub(r'\n  <section class="panel secao" id="ideias".*?</section>\n', '\n', t, count=1, flags=re.S)
    t = t.replace(' · <a href="/ideias/">Ideias de encontros</a>', '')
    t = t.replace('<a href="/online/livros/">livros</a>, <a href="/ideias/">encontros</a> e <a href="/online/redes/">redes sociais</a>',
                  '<a href="/online/livros/">livros</a> e <a href="/online/redes/">redes sociais</a>')
    t = t.replace('Livros sugeridos, Ideias de encontros e Sugestões para as redes', 'Livros sugeridos e Sugestões para as redes')
    t = t.replace('administra: agenda, ideias, livros sugeridos', 'administra: agenda, livros sugeridos')
    t = t.replace('Encontros extras, oficinas e LCs não contam', 'Encontros extras e LCs não contam')
    t = t.replace('<option>Reunião on-line</option>', '<option>Reunião online</option>')
    return t


def ajustes(rel, t):
    """Ajustes que só valem para o online."""
    t = sem_ideias(t)
    if rel.endswith('.html') and '/admin/' not in '/' + rel:
        t = com_acesso(t)
    if rel == 'hogwarts/hg.js':
        # sem datas do presencial: tudo começa fechado ("Em breve") até a administração salvar as datas
        t = re.sub(r'const DATAS_PADRAO=\{.*?\};', lambda m: re.sub(r'T\([^)]*\)', '0', m.group(0)), t, count=1, flags=re.S)
        t = t.replace("if(!a&&ini==='coruja')return{antes:true,txt:'Em breve',aberta:false};",
                      "if(!a)return{antes:true,txt:'Em breve',aberta:false};")
    # turma online: nada presencial e nada copiado do presencial (lista de livros e agenda começam vazias)
    if rel == 'hogwarts/hg.js':
        # a casa escolhida no pedido de acesso (membros/{uid}.casa) já vale no Salão: não pergunta de novo
        a = "return{db,uid,pid,nome:pessoa.nome,casa:perf&&perf.exists?perf.data().casa:null,datas,geral}"
        assert a in t, 'hg.js mudou: ajuste a casa do online'
        t = t.replace(a, "let casa=perf&&perf.exists?perf.data().casa:null;\n  if(!casa){try{const m=await db.collection('membros').doc(uid).get(),c=m.exists?m.data().casa:'';if(c&&CASAS[c]){await db.collection('hgPerfis').doc(pid).set({nome:pessoa.nome,casa:c,em:Date.now()});casa=c}}catch(e){console.warn('casa',e)}}\n  return{db,uid,pid,nome:pessoa.nome,casa,datas,geral}")
    if rel == 'livros/lista-inicial.js':
        t = '/* Turma online: a lista começa vazia e cresce com as indicações das integrantes. */\nwindow.LISTA_INICIAL = [];\n'
    if rel == 'agenda/admin/index.html':
        t = re.sub(r'const DEZEMBRO=\[.*?\];\n', 'const DEZEMBRO=[];\n', t, count=1, flags=re.S)
        t = t.replace('<label>Local<input type="text" id="local" maxlength="80" placeholder="Salão particular"></label>',
                      '<label>Local<input type="text" id="local" maxlength="80" placeholder="Chamada de vídeo"></label>')
        t = t.replace('<label>Endereço <small>Vazio = a confirmar</small>', '<label>Link da chamada <small>Vazio = a confirmar</small>')
        t = t.replace("' · endereço a confirmar'", "' · link a confirmar'")
    if rel == 'agenda/index.html':
        t = t.replace("'https://maps.google.com/?q='+encodeURIComponent(e.endereco)", "(/^https?:/i.test(e.endereco)?e.endereco:'https://'+e.endereco)")
        t = t.replace('Endereço a confirmar', 'Link a confirmar')
    if rel == 'agenda/comum.js':
        t = t.replace("'Endereço a confirmar.'", "'Link a confirmar.'")
    if rel == 'votacao/admin/index.html':
        t = t.replace('<small>Dia do encontro presencial.</small>', '<small>Dia do encontro online.</small>')
        t = t.replace('</head>', '<style>.presencial{display:none!important}</style>\n</head>', 1)
    if rel == 'hogwarts/admin/index.html':
        t = re.sub(r"\n  if\(!\(await lista\('hgEncontros'\)\)\.length\)\{[^\n]*", '', t, count=1)
    if rel == 'admin/index.html':
        t = t.replace("{ic:'bussola',n:'Administração online',d:'Painel da turma online: acesso das integrantes, agenda, leitura e tudo mais',u:'/online/admin/'}",
                      "{ic:'bussola',n:'Administração presencial',d:'Painel da turma presencial (dados separados do online)',u:'/admin/'}")
        t = t.replace("  const GRUPOS=[\n", "  const GRUPOS=[\n    {t:'Turma online',itens:[\n      {ic:'conselho',n:'Acesso das integrantes',d:'Aprovar pedidos de entrada e remover acessos',u:'/online/admin/acesso/'}]},\n", 1)
        pid = projeto_online()
        if pid:
            t = t.replace('console.firebase.google.com/project/sprint-arcadia/', 'console.firebase.google.com/project/%s/' % pid)
        t = re.sub(r'(<h1[^>]*>)(.*?)(</h1>)', r'\1\2 · online\3', t, count=1)
    if rel == 'integrantes/index.html':
        t = t.replace('<h1>Área das integrantes</h1>', '<h1>Área das integrantes</h1><p class="lbl" style="margin-top:6px">Online</p>')
        t = t.replace('<h2 style="margin-top:6px">Senha do clube</h2>', '<h2 style="margin-top:6px">Senha do clube online</h2>')
        t = t.replace('É a mesma senha do sprint.', 'É a senha das integrantes online, a mesma do sprint online.')
    if rel.endswith('.html'):
        t = t.replace('href="/lista-de-espera/"', 'href="/lista-de-espera/?m=online"')
        t = t.replace('<title>', '<title>Online · ', 1)
    return t


def copiar_pasta(p, todas):
    origem = os.path.join(RAIZ, p)
    for dirpath, _, arquivos in os.walk(origem):
        for a in arquivos:
            src = os.path.join(dirpath, a)
            rel = os.path.relpath(src, RAIZ)
            dst = os.path.join(DEST, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if a.endswith(TEXTO):
                t = open(src, encoding='utf-8').read()
                t = ajustes(rel.replace(os.sep, '/'), reescrever(t, todas))
                open(dst, 'w', encoding='utf-8').write(t)
            else:
                shutil.copyfile(src, dst)


def gerar_sprint(todas):
    """O sprint online usa as imagens e sons do /sprint/ (base href) e a lista/Firebase do online."""
    t = open(os.path.join(SPRINT, 'index.html'), encoding='utf-8').read()
    t = re.sub(r'<head>', '<head>\n<base href="/sprint/">', t, count=1)
    t = re.sub(r'src="config\.js[^"]*"', 'src="/online/sprint/config.js"', t)
    t = reescrever(t, todas)
    t = t.replace('<title>', '<title>Online · ', 1)
    t = com_acesso(t)
    # no online a conta é Google (aprovada pela administração): não troca por uma anônima
    t = t.replace("    firebase.initializeApp(fb);\n    const cred=await firebase.auth().signInAnonymously();",
                  "    if(!firebase.apps.length)firebase.initializeApp(fb);\n    const cred={user:firebase.auth().currentUser||(await firebase.auth().signInAnonymously()).user};")
    t = t.replace('<h3>Sprint das integrantes</h3>', '<h3>Sprint das integrantes online</h3>')
    # chamada pelo Google Meet (link salvo em /online/admin/acesso/), sem Daily
    a = "if(SALA_MEET||/^https:\\/\\/[a-z0-9-]+\\.daily\\.co\\/[\\w-]+$/i.test(SALA)){$('salaRow').hidden=false}"
    assert a in t, 'sprint mudou: ajuste o botão do Meet'
    t = t.replace(a, "if(SALA_MEET){$('salaRow').hidden=false;$('salaBtn').textContent='Abrir a chamada no Google Meet'}")
    t = t.replace("else if(!b&&$('salaBox').hidden)$('salaBtn').textContent='Entrar na sala de vídeo';", "else if(!b&&$('salaBox').hidden&&!SALA_MEET)$('salaBtn').textContent='Entrar na sala de vídeo';")
    t = sem_ideias(t)
    t = t.replace('Senha do clube<input id="gateInput"', 'Senha do clube online<input id="gateInput"')
    os.makedirs(os.path.join(DEST, 'sprint'), exist_ok=True)
    open(os.path.join(DEST, 'sprint', 'index.html'), 'w', encoding='utf-8').write(t)


def limpar():
    if not os.path.isdir(DEST):
        return
    for dirpath, dirs, arquivos in os.walk(DEST, topdown=False):
        for a in arquivos:
            rel = os.path.relpath(os.path.join(dirpath, a), DEST).replace(os.sep, '/')
            if rel not in PROPRIOS:
                os.remove(os.path.join(dirpath, a))
        if dirpath != DEST and not os.listdir(dirpath):
            os.rmdir(dirpath)


def main():
    todas = list(dict.fromkeys(PASTAS + [p for p in pastas_do_menu() if os.path.isdir(os.path.join(RAIZ, p))]))
    limpar()
    for p in todas:
        copiar_pasta(p, todas)
    gerar_sprint(todas)
    print('online/ gerado:', ', '.join(todas + ['sprint']))


if __name__ == '__main__':
    main()
