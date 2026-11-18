/* Agenda do clube: partes usadas pela página das integrantes e pela administração */
window.AGENDA=(function(){
  const ICON={
    livro:'<path d="M3 6c3-1 6-1 9 1 3-2 6-2 9-1v12c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 7v12"/>',
    csi:'<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 20.5 20.5"/><path d="M7.6 9.2a2.6 2.6 0 0 1 4.8 0M7.4 11.6a3 3 0 0 0 5.2 0"/>',
    natal:'<rect x="4" y="10" width="16" height="10" rx="1.2"/><rect x="3" y="7" width="18" height="3" rx="1"/><path d="M12 7v13"/><path d="M12 7C10.5 4 7 3.6 7 5.4S10 7 12 7zm0 0c1.5-3 5-3.4 5-1.6S14 7 12 7z"/>',
    especial:'<path d="M12 3l2.2 5.6L20 9.3l-4.4 3.9 1.3 5.8L12 16l-4.9 3 1.3-5.8L4 9.3l5.8-.7z"/>',
    data:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    hora:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    local:'<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'};
  const TEMAS={livro:'Encontro do livro do mês',csi:'Investigação (CSI)',natal:'Natal',especial:'Especial'};
  const icon=(k,cls)=>'<svg class="ico'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICON[k]||ICON.especial)+'</svg>';
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const slug=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const dia=iso=>{const p=String(iso||'').split('-').map(Number);return new Date(p[0],(p[1]||1)-1,p[2]||1)};
  const hojeISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const faltam=iso=>Math.round((dia(iso)-dia(hojeISO()))/864e5);
  const contagem=iso=>{const n=faltam(iso);return n<0?'Já aconteceu':n===0?'É hoje!':n===1?'É amanhã!':'Faltam '+n+' dias'};
  const dataLonga=iso=>{const s=dia(iso).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});return s.charAt(0).toUpperCase()+s.slice(1)};
  const semana=iso=>dia(iso).toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','');
  const hora=h=>{if(!h)return'';const m=String(h).match(/^(\d{1,2}):(\d{2})$/);if(!m)return h;return +m[1]+'h'+(m[2]!=='00'?m[2]:'')};
  function ics(ev){
    const d=String(ev.data).replace(/-/g,''),m=String(ev.hora||'').match(/^(\d{1,2}):(\d{2})$/);
    const t=s=>String(s||'').replace(/\\/g,'\\\\').replace(/[,;]/g,c=>'\\'+c).replace(/\n/g,'\\n');
    let ini,fim;
    if(m){const h=+m[1],f=Math.min(23,h+3);ini='DTSTART:'+d+'T'+String(h).padStart(2,'0')+m[2]+'00';fim='DTEND:'+d+'T'+String(f).padStart(2,'0')+m[2]+'00'}
    else{const x=dia(ev.data);x.setDate(x.getDate()+1);ini='DTSTART;VALUE=DATE:'+d;fim='DTEND;VALUE=DATE:'+x.getFullYear()+String(x.getMonth()+1).padStart(2,'0')+String(x.getDate()).padStart(2,'0')}
    const local=[ev.local,ev.endereco].filter(Boolean).join(' · ');
    const desc=[ev.descricao,m?'':'Horário a confirmar.',ev.endereco?'':'Endereço a confirmar.','sociedadearcadia.com.br/agenda'].filter(Boolean).join('\n');
    return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sociedade Arcadia//Agenda//PT','CALSCALE:GREGORIAN','BEGIN:VEVENT',
      'UID:'+slug(ev._id||ev.titulo)+'@sociedadearcadia.com.br','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,''),
      ini,fim,'SUMMARY:'+t((ev.titulo||'Encontro')+' · Sociedade Arcádia'),local?'LOCATION:'+t(local):'','DESCRIPTION:'+t(desc),'END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\r\n')}
  const RESP={vou:'Vou',talvez:'Talvez',nao:'Não vou'};
  return {icon,TEMAS,esc,slug,dia,hojeISO,faltam,contagem,dataLonga,semana,hora,ics,RESP};
})();
