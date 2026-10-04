/* ================= CONFIGURAÇÃO ================= */
const STAFF_URL='FUNCIONARIO.HTML';          // página da conta do funcionário
const SHOP={whatsapp:'',endereco:''};        // preencha para mostrar WhatsApp e endereço (ex.: whatsapp:'5511999998888')

/* ================= UTILIDADES ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Armazenamento: usa localStorage e, se o navegador bloquear, guarda em memória (vale enquanto a página estiver aberta). */
const mem={};
let PERSIST=true;
try{localStorage.setItem('bi_t','1');if(localStorage.getItem('bi_t')!=='1')PERSIST=false;localStorage.removeItem('bi_t')}catch(e){PERSIST=false}
const store={
  get(k,d){
    if(k in mem)return mem[k];
    try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}
  },
  set(k,v){
    try{localStorage.setItem(k,JSON.stringify(v));delete mem[k]}catch(e){mem[k]=v}
  },
  del(k){delete mem[k];try{localStorage.removeItem(k)}catch(e){}}
};
const pad=n=>String(n).padStart(2,'0');
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const tkey=m=>`${pad(Math.floor(m/60))}:${pad(m%60)}`;
const fromKey=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const parseStart=s=>{const [d,t]=s.split('T');const [y,mo,da]=d.split('-').map(Number);const [h,mi]=t.split(':').map(Number);return new Date(y,mo-1,da,h,mi)};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const longDate=d=>cap(d.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}));
const brl=n=>'R$ '+n.toFixed(2).replace('.',',');
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const firstOfMonth=d=>new Date(d.getFullYear(),d.getMonth(),1);
async function hash(s){
  try{if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('bi:'+s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}}catch(e){}
  return 'x'+btoa(unescape(encodeURIComponent(s)));
}
function fmtPhone(v){
  const d=v.replace(/\D/g,'').slice(0,11);
  if(!d)return '';
  if(d.length<=2)return `(${d}`;
  if(d.length<=6)return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if(d.length<=10)return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}
function ago(iso){
  const m=Math.floor((Date.now()-new Date(iso).getTime())/60000);
  if(m<1)return 'Agora';if(m<60)return `${m} min`;
  const h=Math.floor(m/60);if(h<24)return `${h} h`;
  return new Date(iso).toLocaleDateString('pt-BR',{day:'numeric',month:'short'}).replace('.','');
}
const P={
  back:'M15 18l-6-6 6-6',check:'M5 12.5l4.5 4.5L19 7.5',
  eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  eyeoff:'M3 3l18 18M10.6 5.1A10 10 0 0112 5c6.4 0 10 7 10 7a17 17 0 01-3.2 4.1M6.6 6.6A17 17 0 002 12s3.6 7 10 7a9.7 9.7 0 004.4-1M9.9 9.9a3 3 0 004.2 4.2',
  home:'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  user:'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-6 8-6s8 2 8 6',chev:'M9 6l6 6-6 6',chevl:'M15 6l-6 6 6 6',
  cam:'M4 8h3l2-3h6l2 3h3v12H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  out:'M10 4H5v16h5M15 8l4 4-4 4M19 12H9',trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  key:'M14 10a4 4 0 11-2.8 6.8L4 20v-3l2-1v-2h2l3.2-3.2A4 4 0 0114 10z',
  scis:'M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM8.5 7.5L20 18M8.5 16.5L20 6',
  bell:'M6 9a6 6 0 1112 0c0 6 2 7 2 7H4s2-1 2-7zM10 20a2 2 0 004 0',
  star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  plus:'M12 5v14M5 12h14',arrow:'M5 12h14M13 6l6 6-6 6',
  spark:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  chat:'M4 5h16v11H9l-5 4z',pin:'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z'
};
const ic=(n,s=20,fill)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill?'currentColor':'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
const starsRow=(n,s=14)=>`<span class="stars" role="img" aria-label="${n} de 5 estrelas">${[1,2,3,4,5].map(i=>`<span style="opacity:${i<=Math.round(n)?1:.25}">${ic('star',s,true)}</span>`).join('')}</span>`;

/* ================= DADOS ================= */
const SERVICES=[
  {id:'corte',name:'Corte masculino',desc:'Tesoura ou máquina, finalizado com pomada · 30 min',price:45,dur:30},
  {id:'barba',name:'Barba',desc:'Toalha quente, navalha e hidratação · 30 min',price:30,dur:30},
  {id:'combo',name:'Corte + barba',desc:'O pacote completo, com desconto · 1 h',price:65,dur:60},
  {id:'sobrancelha',name:'Sobrancelha',desc:'Design na navalha · 30 min',price:15,dur:30},
  {id:'pigmentacao',name:'Pigmentação',desc:'Cobre falhas na barba e no cabelo · 30 min',price:40,dur:30},
  {id:'hidratacao',name:'Hidratação capilar',desc:'Tratamento com massagem · 30 min',price:35,dur:30}
];
const BARBERS=[
  {id:'lucas',name:'Lucas M.',role:'Degradê e navalhado'},
  {id:'rafael',name:'Rafael S.',role:'Barba e toalha quente'},
  {id:'diego',name:'Diego A.',role:'Clássicos e pigmentação'}
];
const STYLES=[
  {n:'Degradê',d:'Laterais em transição suave e topo na tesoura.',h:'M18 33c0-12 6-18 14-18s14 6 14 18c-2-6-6-9-14-9s-12 3-14 9z'},
  {n:'Social',d:'Clássico, curto e alinhado, com risca definida.',h:'M18 31c0-12 6-17 15-16 8 1 13 6 13 16-3-4-6-8-14-8-6 0-10 4-14 8z'},
  {n:'Navalhado',d:'Acabamento rente, com linhas marcadas na navalha.',h:'M19 30c1-9 6-14 13-14s12 5 13 14c-4-4-8-6-13-6s-9 2-13 6z'},
  {n:'Pompadour',d:'Volume e altura no topo, laterais bem curtas.',h:'M17 32c-2-11 4-20 15-20 6 0 10 2 13 5-3-1-6 0-8 3-4-1-9 0-13 4-3 2-5 4-7 8z'},
  {n:'Texturizado',d:'Topo desfiado, com movimento e pouco volume.',h:'M20 31l-2-6 4 2 1-6 4 3 3-6 3 6 4-3 1 6 4-2-2 6c-3-3-6-5-12-5s-9 2-12 5z'}
];
const DAYS_AHEAD=60, LUNCH=[720,780];
const svcOf=id=>SERVICES.find(s=>s.id===id);
const barOf=id=>BARBERS.find(b=>b.id===id);
const users=()=>store.get('bi_users',[]);
const me=()=>{const id=store.get('bi_session',null);return users().find(u=>u.id===id)||null};
const allAppts=()=>store.get('bi_appts',[]);
const myAppts=()=>{const u=me();return u?allAppts().filter(a=>a.userId===u.id):[]};
const getAppt=id=>allAppts().find(a=>a.id===id);
const inits=n=>{const p=n.trim().split(/\s+/);return ((p[0]||'')[0]||'').toUpperCase()+((p.length>1?p[p.length-1][0]:'')||'').toUpperCase()};
const avatar=(u,cls='')=>`<div class="av ${cls}">${u.photo?`<img src="${u.photo}" alt="">`:esc(inits(u.name))}</div>`;
const greet=()=>{const h=new Date().getHours();return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'};
const ended=a=>parseStart(a.start).getTime()+a.dur*60000<=Date.now();
const upcoming=()=>myAppts().filter(a=>a.status==='ok'&&!ended(a)).sort((x,y)=>x.start.localeCompare(y.start));
const past=()=>myAppts().filter(a=>!(a.status==='ok'&&!ended(a))).sort((x,y)=>y.start.localeCompare(x.start));
const doneList=()=>myAppts().filter(a=>a.status==='ok'&&ended(a));
function barberRating(id){
  const r=allAppts().filter(a=>a.barber===id&&a.rating).map(a=>a.rating.stars);
  return r.length?{avg:r.reduce((x,y)=>x+y,0)/r.length,n:r.length}:null;
}
const notifs=()=>{const u=me();return u?store.get('bi_notifs',[]).filter(n=>n.userId===u.id).sort((a,b)=>b.t.localeCompare(a.t)):[]};
function pushN(userId,title,text){const a=store.get('bi_notifs',[]);a.push({id:uid(),userId,t:new Date().toISOString(),title,text,read:false});store.set('bi_notifs',a)}

function pseudo(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)%100}
function hoursFor(d){const w=d.getDay();if(w===0)return null;return {open:540,close:(w===6?17:19)*60}}
function slotsFor(dateKey,barberId,dur,ignoreId){
  if(barberId==='any'){
    const lists=BARBERS.map(b=>slotsFor(dateKey,b.id,dur,ignoreId));
    return lists[0].map((s,i)=>({m:s.m,ok:lists.some(l=>l[i].ok)}));
  }
  const d=fromKey(dateKey),hr=hoursFor(d);
  if(!hr)return [];
  const appts=allAppts().filter(a=>a.status==='ok'&&a.barber===barberId&&a.start.startsWith(dateKey)&&a.id!==ignoreId);
  const now=new Date(),isToday=dkey(now)===dateKey,nowM=now.getHours()*60+now.getMinutes();
  const out=[];
  for(let m=hr.open;m+dur<=hr.close;m+=30){
    if(m>=LUNCH[0]&&m<LUNCH[1])continue;
    let ok=true;
    if(m<LUNCH[1]&&m+dur>LUNCH[0])ok=false;
    if(isToday&&m<nowM+30)ok=false;
    if(ok)for(let t=m;t<m+dur;t+=30){if(pseudo(barberId+dateKey+t)<26){ok=false;break}}
    if(ok)for(const a of appts){
      const [h,mi]=a.start.split('T')[1].split(':').map(Number),am=h*60+mi;
      if(m<am+a.dur&&am<m+dur){ok=false;break}
    }
    out.push({m,ok});
  }
  return out;
}
function firstFree(dateKey,time,dur,ignoreId){
  const b=BARBERS.find(b=>{const s=slotsFor(dateKey,b.id,dur,ignoreId).find(x=>tkey(x.m)===time);return s&&s.ok});
  return b?b.id:null;
}

}

/* ================= ESTADO E ROTAS ================= */
let route='welcome',ui={},B=null,rateDraft=null;
const TABS=['home','appts','styles','profile'];
function go(r,p){route=r;ui=p||{};render(true)}
function render(anim){
  const s=$('#screen');
  s.innerHTML=VIEWS[route]();
  if(anim){s.scrollTop=0;s.classList.remove('fade');void s.offsetWidth;s.classList.add('fade')}
  const nav=$('#nav');
  nav.hidden=!TABS.includes(route);
  if(!nav.hidden){
    const b=([r,i,l])=>`<button data-a="to" data-r="${r}" ${route===r?'aria-current="page"':''}>${ic(i,22)}<span>${l}</span></button>`;
    nav.innerHTML=[['home','home','Início'],['appts','cal','Cortes']].map(b).join('')+`<button class="fab" data-a="newBook" aria-label="Agendar horário">${ic('plus',26)}</button>`+[['styles','spark','Estilos'],['profile','user','Perfil']].map(b).join('');
  }
}
let toastT;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2800)}
function sheet(html){
  const s=$('#sheet');
  s.innerHTML=`<div class="scrim" data-a="closeSheet"></div><div class="panel" role="dialog" aria-modal="true">${html}</div>`;
  s.hidden=false;
  const f=s.querySelector('input,button');f&&f.focus();
}
function closeSheet(){const s=$('#sheet');s.hidden=true;s.innerHTML=''}
const setErr=(f,m)=>{const e=f.querySelector('.err');if(e)e.textContent=m;return false};

/* ================= COMPONENTES ================= */
const pw=(name,label,ac,ph='')=>`<div class="field"><label for="${name}">${label}</label><div class="pw"><input id="${name}" name="${name}" type="password" autocomplete="${ac}" placeholder="${ph}" required><button type="button" class="eye" data-a="pw" aria-label="Mostrar senha">${ic('eye')}</button></div></div>`;
const txt=(name,label,o={})=>`<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${o.type||'text'}" autocomplete="${o.ac||'off'}" placeholder="${o.ph||''}" ${o.mask?`data-mask="${o.mask}"`:''} ${o.inputmode?`inputmode="${o.inputmode}"`:''} value="${esc(o.val||'')}" required></div>`;
const topbar=(title,back)=>`<div class="top"><button class="iconbtn" data-a="${back}" aria-label="Voltar">${ic('back')}</button><h2>${title}</h2></div>`;
const sh=(t,right='')=>`<div class="sh"><span class="cap">${t}</span><i></i>${right}</div>`;
const hair=(h)=>`<svg class="hd" width="76" height="76" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 62c0-9 8-13 18-13s18 4 18 13"/><path d="M24 44v5M40 44v5"/><path d="M19 33c0 9 5 15 13 15s13-6 13-15"/><path d="${h}" fill="currentColor" fill-opacity=".25"/></svg>`;
const crest=`<svg class="crest" width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden="true"><circle cx="42" cy="42" r="40" stroke="#B8934A" stroke-width="1"/><circle cx="42" cy="42" r="35" stroke="#B8934A" stroke-width=".6" opacity=".6"/><text x="42" y="52" text-anchor="middle" font-family="'Cormorant Garamond',Georgia,serif" font-size="30" font-weight="600" fill="#D6B772">BI</text></svg>`;

function dayLabel(a){
  const d=parseStart(a.start),t=new Date(),k=dkey(d);
  if(k===dkey(t))return 'Hoje';
  const n=new Date(t);n.setDate(n.getDate()+1);
  return k===dkey(n)?'Amanhã':'';
}
function apptCard(a,gold){
  const d=parseStart(a.start),b=barOf(a.barber);
  const names=a.services.map(id=>svcOf(id)?.name).filter(Boolean).join(' + ');
  const mon=d.toLocaleDateString('pt-BR',{month:'short'}).replace('.','');
  const time=`${pad(d.getHours())}:${pad(d.getMinutes())}`;
  let chip='',acts='';
  if(a.status==='cancelled'){
    chip='<span class="chip no">Cancelado</span>';
    acts=`<div class="acts"><button class="btn sm ghost" data-a="rebook" data-id="${a.id}">Agendar de novo</button></div>`;
  }else if(ended(a)){
    chip='<span class="chip ok">Concluído</span>';
    const rate=a.rating?`<div style="margin-top:10px">${starsRow(a.rating.stars)}${a.rating.text?`<p class="small mute" style="margin-top:2px">${esc(a.rating.text)}</p>`:''}</div>`:'';
    acts=rate+`<div class="acts">${a.rating?'':`<button class="btn sm" data-a="rateAsk" data-id="${a.id}">Avaliar</button>`}<button class="btn sm ghost" data-a="rebook" data-id="${a.id}">Agendar de novo</button></div>`;
  }else{
    const dl=dayLabel(a);
    if(dl)chip=`<span class="chip go">${dl}</span>`;
    acts=`<div class="acts"><button class="btn sm ghost" data-a="resched" data-id="${a.id}">Remarcar</button><button class="btn sm danger" data-a="cancelAsk" data-id="${a.id}">Cancelar</button></div>`;
  }
  return `<article class="appt${gold?' gold':''}"><div class="date"><b>${d.getDate()}</b><span>${esc(mon)}</span></div><div class="info"><b>${esc(names)}</b><span class="mute small">${time} · com ${esc(b?b.name:'')}</span><div class="meta"><span class="p">${brl(a.total)}</span>${chip}</div>${acts}</div></article>`;
}

/* ================= TELAS ================= */
const VIEWS={
welcome(){return `
<section style="padding-top:10px">
  ${crest}
  <div class="brand">Barbearia Ideal</div>
  <p class="tag">Mais que um corte, <em>é confiança.</em></p>
  ${PERSIST?'':`<div class="note" style="margin-bottom:18px">Seu navegador está bloqueando o armazenamento. Contas e agendamentos valem apenas enquanto esta página estiver aberta.</div>`}
  <form data-f="login" class="gap" novalidate>
    ${txt('ident','E-mail ou telefone',{ac:'username',ph:'voce@email.com'})}
    ${pw('pass','Senha','current-password')}
    <div class="err" role="alert"></div>
    <button class="btn" type="submit">Entrar</button>
  </form>
  <div style="display:flex;justify-content:space-between;margin-top:6px">
    <button class="link" data-a="to" data-r="forgot">Esqueci a senha</button>
    <button class="link" data-a="to" data-r="register">Criar conta</button>
  </div>
  <div class="divider"></div>
  <a class="btn ghost" href="${STAFF_URL}">${ic('scis',18)} Sou funcionário</a>
  <p class="mute small" style="text-align:center;margin:14px 0 28px">Barbeiros e recepção entram pela área do funcionário.</p>
</section>`},

register(){return `
${topbar('Criar conta','toWelcome')}
<form data-f="register" class="gap" novalidate>
  ${txt('fname','Nome completo',{ac:'name',ph:'Como devemos te chamar?'})}
  ${txt('phone','Telefone',{ac:'tel',mask:'phone',inputmode:'tel',ph:'(11) 98765-4321'})}
  ${txt('email','E-mail',{type:'email',ac:'email',ph:'voce@email.com'})}
  ${pw('pass','Crie uma senha','new-password','Mínimo de 6 caracteres')}
  <div class="err" role="alert"></div>
  <button class="btn" type="submit">Criar conta</button>
</form>
<p class="mute" style="text-align:center;margin:18px 0 28px">Já tem conta? <button class="link" data-a="to" data-r="welcome">Entrar</button></p>`},

forgot(){
  const s=ui.step||1;
  if(s===1)return `
${topbar('Recuperar senha','toWelcome')}
<p class="mute" style="margin-bottom:22px">Informe o e-mail da sua conta para receber um código de verificação.</p>
<form data-f="forgot1" class="gap" novalidate>
  ${txt('email','E-mail',{type:'email',ac:'email',ph:'voce@email.com'})}
  <div class="err" role="alert"></div>
  <button class="btn" type="submit">Enviar código</button>
</form>`;
  if(s===2)return `
${topbar('Verificação','toWelcome')}
<div class="note" style="margin-bottom:20px">Esta é uma demonstração e nenhum e-mail é enviado. Use o código <b>${esc(ui.code)}</b>.</div>
<form data-f="forgot2" class="gap" novalidate>
  ${txt('code','Código de 6 dígitos',{ac:'one-time-code',inputmode:'numeric',ph:'000000'})}
  ${pw('pass','Nova senha','new-password','Mínimo de 6 caracteres')}
  <div class="err" role="alert"></div>
  <button class="btn" type="submit">Salvar nova senha</button>
</form>`;
  return `
<div class="ok-wrap">
  <svg class="big" width="76" height="76" viewBox="0 0 84 84" fill="none" stroke="#D6B772" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="42" cy="42" r="36"/><path class="tk" d="M27 43l10 10 20-22"/></svg>
  <h2>Senha alterada</h2>
  <p class="mute" style="margin:10px 0 28px">Agora é só entrar com a nova senha.</p>
  <button class="btn" data-a="to" data-r="welcome">Entrar</button>
</div>`},

home(){
  const u=me();if(!u){route='welcome';return VIEWS.welcome()}
  const nx=upcoming()[0],unread=notifs().filter(n=>n.read===false).length;
  const c=doneList().length,s=(c>0&&c%10===0)?10:c%10,left=10-s;
  const hours=`<div class="kv"><span>Segunda a sexta</span><span>9h às 19h</span></div><div class="kv"><span>Sábado</span><span>9h às 17h</span></div><div class="kv"><span>Domingo</span><span>Fechado</span></div><div class="kv"><span>Almoço</span><span>12h às 13h</span></div>`;
  const extra=(SHOP.endereco?`<p class="small" style="margin-top:14px;display:flex;gap:8px;align-items:flex-start">${ic('pin',18)}<span>${esc(SHOP.endereco)}</span></p>`:'')+(SHOP.whatsapp?`<a class="btn sm ghost" style="margin-top:14px;display:inline-flex;width:auto" href="https://wa.me/${esc(SHOP.whatsapp.replace(/\D/g,''))}">${ic('chat',18)} WhatsApp</a>`:'');
  return `
<div class="hdr"><span class="wm">Barbearia <span>Ideal</span></span><div class="hr"><button class="iconbtn" data-a="openNotifs" aria-label="Notificações${unread?`, ${unread} novas`:''}">${ic('bell')}${unread?`<span class="badge">${unread}</span>`:''}</button><button class="avbtn" data-a="to" data-r="profile" aria-label="Meu perfil">${avatar(u)}</button></div></div>
<div class="greet"><p class="mute">${greet()},</p><h1>${esc(u.name.split(' ')[0])}</h1></div>
${nx?`<p class="cap" style="margin-bottom:10px">Próximo horário</p>${apptCard(nx,true)}`:
`<div class="hero" style="padding-top:0"><p class="cap">Seu próximo corte</p><h2>Reserve em menos de um minuto.</h2><button class="btn" data-a="newBook">Agendar horário</button></div>`}

${sh('Fidelidade')}
<div style="padding-top:8px"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:600 26px var(--serif)">${s} <span class="mute" style="font-size:18px">de 10 cortes</span></span></div>
<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${s}"><i style="width:${s*10}%"></i></div>
<p class="small mute">${s===10?'Seu próximo corte é por conta da casa. Avise o barbeiro ao chegar.':`Faltam ${left} ${left>1?'cortes':'corte'} para ganhar um corte grátis.`}</p></div>

<div style="margin-top:30px"><div class="strip"><div><b>Combo corte + barba</b><span class="small mute">${brl(65)} · economize ${brl(10)}</span></div><button class="link" data-a="bookSvc" data-id="combo">Agendar ${ic('arrow',16)}</button></div></div>

${sh('Serviços')}
<div class="menu">${SERVICES.map(x=>`<button data-a="bookSvc" data-id="${x.id}"><b>${esc(x.name)}</b><span class="price">${brl(x.price)}</span><small>${esc(x.desc)}</small></button>`).join('')}</div>

${sh('Barbeiros')}
<div>${BARBERS.map(b=>{const r=barberRating(b.id);return `<button class="person" data-a="bookBarber" data-id="${b.id}"><span class="mono">${esc(inits(b.name))}</span><span class="grow"><b>${esc(b.name)}</b><span class="mute small">${esc(b.role)}</span></span>${r?`<span class="rate">${ic('star',14,true)} ${r.avg.toFixed(1).replace('.',',')}</span>`:`<span class="small mute">Novo</span>`}</button>`}).join('')}</div>

${sh('Funcionamento')}
<div style="padding-bottom:30px">${hours}${extra}</div>`},

appts(){
  const tab=ui.tab||'next',list=tab==='next'?upcoming():past();
  const spent=doneList().reduce((a,x)=>a+x.total,0);
  return `
<div class="top"><h2>Meus cortes</h2></div>
<div class="seg" role="tablist" style="--n:2">
  <button role="tab" data-a="tab" data-t="next" aria-selected="${tab==='next'}">Próximos</button>
  <button role="tab" data-a="tab" data-t="past" aria-selected="${tab==='past'}">Histórico</button>
</div>
${tab==='past'&&doneList().length?`<div class="spent"><span class="mute">Total em cortes concluídos</span><b>${brl(spent)}</b></div>`:''}
${list.length?`<div class="list" style="padding-bottom:26px">${list.map(a=>apptCard(a)).join('')}</div>`:
tab==='next'?`<div class="empty"><h3>Nenhum horário marcado</h3><p class="mute">Escolha o serviço e o horário que preferir.</p><button class="btn" data-a="newBook">Agendar horário</button></div>`:
`<div class="empty"><h3>Histórico vazio</h3><p class="mute">Os cortes concluídos e cancelados aparecem aqui.</p></div>`}`},

styles(){return `
<div class="top"><h2>Estilos de corte</h2></div>
<p class="mute" style="margin:-8px 0 8px">Escolha uma referência e comece o agendamento. O barbeiro recebe o nome do estilo.</p>
<div style="padding-bottom:26px">${STYLES.map((s,i)=>`<article class="style">${hair(s.h)}<div class="grow"><h3>${esc(s.n)}</h3><p class="mute small" style="margin-top:2px">${esc(s.d)}</p><button class="link" data-a="bookStyle" data-i="${i}">Agendar este estilo ${ic('arrow',16)}</button></div></article>`).join('')}</div>`},

notifs(){
  const list=notifs();
  return `${topbar('Notificações','toHome')}
${list.length?`<div style="padding-bottom:26px">${list.map(n=>`<article class="nt${ui.fresh&&ui.fresh.includes(n.id)?' new':''}"><span class="dot"></span><div class="grow"><b>${esc(n.title)}</b><p class="mute small">${esc(n.text)}</p></div><time>${ago(n.t)}</time></article>`).join('')}</div>`:
`<div class="empty"><h3>Nenhuma notificação</h3><p class="mute">Confirmações e cancelamentos aparecem aqui.</p></div>`}`},

profile(){
  const u=me();if(!u){route='welcome';return VIEWS.welcome()}
  return `
<div class="pf">
  <div class="avwrap">${avatar(u,'lg')}<input type="file" id="photo" accept="image/*"><label for="photo" aria-label="Trocar foto">${ic('cam',17)}</label></div>
  <h2>${esc(u.name)}</h2><p class="mute small">${esc(u.email)}</p>
</div>
<div class="stats"><div><b>${doneList().length}</b><span>Cortes feitos</span></div><div><b>${upcoming().length}</b><span>Agendados</span></div><div><b>${myAppts().filter(a=>a.rating).length}</b><span>Avaliações</span></div></div>
<form data-f="profile" class="gap" novalidate>
  ${txt('fname','Nome completo',{ac:'name',val:u.name})}
  ${txt('phone','Telefone',{ac:'tel',mask:'phone',inputmode:'tel',val:fmtPhone(u.phone)})}
  <div class="err" role="alert"></div>
  <button class="btn" type="submit">Salvar alterações</button>
</form>
<div style="margin:26px 0 30px;border-top:1px solid var(--line)">
  <button class="rowlink" data-a="openNotifs">${ic('bell')}<span class="grow">Notificações</span>${ic('chev',18)}</button>
  <button class="rowlink" data-a="passOpen">${ic('key')}<span class="grow">Alterar senha</span>${ic('chev',18)}</button>
  <button class="rowlink" data-a="logout">${ic('out')}<span class="grow">Sair da conta</span>${ic('chev',18)}</button>
  <button class="rowlink red" data-a="delAsk">${ic('trash')}<span class="grow">Excluir conta</span></button>
</div>`},

book(){
  const svc=B.services.map(svcOf);
  const dur=svc.reduce((a,s)=>a+s.dur,0),total=svc.reduce((a,s)=>a+s.price,0);
  const titles=['Serviço','Barbeiro','Data e horário','Confirmação'];
  const head=`<div class="top"><button class="iconbtn" data-a="bookBack" aria-label="Voltar">${ic('back')}</button><h2>${B.editId&&B.step===3?'Remarcar':titles[B.step-1]}</h2><span class="cap">${B.step} / 4</span></div><div class="steps" aria-hidden="true">${[1,2,3,4].map(i=>`<i class="${i<=B.step?'on':''}"></i>`).join('')}</div>`;
  let body='',can=false,cta='Continuar';
  if(B.step===1){
    can=svc.length>0;
    body=`<div class="list">${SERVICES.map(s=>{const on=B.services.includes(s.id);return `<button class="opt${on?' sel':''}" data-a="svc" data-id="${s.id}" aria-pressed="${on}"><span class="chk">${ic('check',14)}</span><div class="grow"><b>${esc(s.name)}</b><span class="mute small">${esc(s.desc)}</span></div><span class="price">${brl(s.price)}</span></button>`}).join('')}</div>`;
  }else if(B.step===2){
    can=!!B.barber;
    const any=`<button class="opt${B.barber==='any'?' sel':''}" data-a="pickBarber" data-id="any" aria-pressed="${B.barber==='any'}"><span class="mono">${ic('user',22)}</span><div class="grow"><b>Sem preferência</b><span class="mute small">O primeiro barbeiro livre no horário</span></div><span class="chk">${ic('check',14)}</span></button>`;
    body=`<div class="list">${any}${BARBERS.map(b=>{const r=barberRating(b.id);return `<button class="opt${B.barber===b.id?' sel':''}" data-a="pickBarber" data-id="${b.id}" aria-pressed="${B.barber===b.id}"><span class="mono">${esc(inits(b.name))}</span><div class="grow"><b>${esc(b.name)}</b><span class="mute small">${esc(b.role)}${r?` · ★ ${r.avg.toFixed(1).replace('.',',')}`:''}</span></div><span class="chk">${ic('check',14)}</span></button>`}).join('')}</div>`;
  }else if(B.step===3){
    can=!!(B.date&&B.time);
    const m=B.month,first=new Date(m.getFullYear(),m.getMonth(),1),start=first.getDay(),nd=new Date(m.getFullYear(),m.getMonth()+1,0).getDate();
    const today=new Date();today.setHours(0,0,0,0);
    const max=new Date(today);max.setDate(max.getDate()+DAYS_AHEAD);
    let cells='';for(let i=0;i<start;i++)cells+='<span></span>';
    for(let d=1;d<=nd;d++){
      const dt=new Date(m.getFullYear(),m.getMonth(),d),k=dkey(dt),dis=dt<today||dt>max||dt.getDay()===0;
      cells+=`<button class="day${B.date===k?' sel':''}${+dt===+today?' today':''}" data-a="pickDate" data-k="${k}" ${dis?'disabled':''} aria-label="${longDate(dt)}" ${B.date===k?'aria-pressed="true"':''}>${d}</button>`;
    }
    const prevDis=m<=firstOfMonth(today),nextDis=firstOfMonth(max)<=m;
    let slotsHtml='';
    if(B.date){
      const sl=slotsFor(B.date,B.barber,dur,B.editId);
      const free=sl.filter(x=>x.ok).length;
      const grp=(t,arr)=>arr.length?`<p class="cap" style="margin:18px 0 10px">${t}</p><div class="slots">${arr.map(x=>`<button class="slot${B.time===tkey(x.m)?' sel':''}" data-a="pickTime" data-t="${tkey(x.m)}" ${x.ok?'':'disabled'} aria-pressed="${B.time===tkey(x.m)}">${tkey(x.m)}</button>`).join('')}</div>`:'';
      slotsHtml=`<div id="slots" style="margin-top:24px"><h3>${longDate(fromKey(B.date))}</h3>${free?grp('Manhã',sl.filter(x=>x.m<720))+grp('Tarde',sl.filter(x=>x.m>=720)):'<p class="mute" style="margin-top:8px">Sem horários livres neste dia. Escolha outra data.</p>'}</div>`;
    }
    body=`<div class="cal"><div class="calhead"><button class="iconbtn" data-a="mon" data-d="-1" ${prevDis?'disabled style="opacity:.3"':''} aria-label="Mês anterior">${ic('chevl',18)}</button><b>${cap(m.toLocaleDateString('pt-BR',{month:'long',year:'numeric'}))}</b><button class="iconbtn" data-a="mon" data-d="1" ${nextDis?'disabled style="opacity:.3"':''} aria-label="Próximo mês">${ic('chev',18)}</button></div><div class="dow">${['D','S','T','Q','Q','S','S'].map(x=>`<span>${x}</span>`).join('')}</div><div class="days">${cells}</div></div>${slotsHtml}`;
  }else{
    can=true;cta='Confirmar';
    const b=B.barber==='any'?null:barOf(B.barber),d=fromKey(B.date);
    const pays=[['pix','PIX'],['cartao','Cartão'],['dinheiro','Dinheiro']];
    body=`<div><div class="kv"><span>Serviços</span><span>${svc.map(s=>esc(s.name)).join('<br>')}</span></div><div class="kv"><span>Barbeiro</span><span>${b?esc(b.name):'Primeiro livre'}</span></div><div class="kv"><span>Data</span><span>${longDate(d)}</span></div><div class="kv"><span>Horário</span><span>${B.time} · ${dur} min</span></div><div class="total"><span class="mute">Total</span><b>${brl(total)}</b></div></div>
<p class="cap" style="margin:28px 0 10px">Pagamento na barbearia</p>
<div class="seg" style="--n:3;margin-bottom:0">${pays.map(([k,l])=>`<button data-a="pay" data-p="${k}" aria-pressed="${B.pay===k}">${l}</button>`).join('')}</div>
<div class="field" style="margin-top:22px"><label for="note">Observação para o barbeiro</label><input id="note" data-bind="note" maxlength="120" placeholder="Opcional" value="${esc(B.note||'')}"></div>`;
  }
  return `${head}${body}<div class="bar"><div class="sum"><b>${brl(total)}</b><span class="mute small">${svc.length?`${svc.length} ${svc.length>1?'serviços':'serviço'} · ${dur} min`:'Nenhum serviço'}</span></div><button class="btn" data-a="bookNext" ${can?'':'disabled'}>${cta}</button></div>`;
},

success(){
  const a=getAppt(ui.id);if(!a){return VIEWS.home()}
  const d=parseStart(a.start),b=barOf(a.barber);
  return `
<div class="ok-wrap">
  <svg class="big" width="76" height="76" viewBox="0 0 84 84" fill="none" stroke="#D6B772" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="42" cy="42" r="36"/><path class="tk" d="M27 43l10 10 20-22"/></svg>
  <h1>${ui.edited?'Horário remarcado':'Horário confirmado'}</h1>
  <div class="tick-card"><b>${esc(a.services.map(id=>svcOf(id).name).join(' + '))}</b><p class="mute" style="margin-top:4px">Com ${esc(b.name)}<br>${longDate(d)}, às ${pad(d.getHours())}:${pad(d.getMinutes())}</p><p style="margin-top:10px;font:600 24px var(--serif);color:var(--gold2)">${brl(a.total)} <span class="small mute" style="font-family:var(--sans);font-weight:500">· pagamento na barbearia</span></p></div>
  <div class="gap"><button class="btn" data-a="successGo" data-r="appts">Ver meus cortes</button><button class="btn ghost" data-a="successGo" data-r="home">Voltar ao início</button></div>
</div>`}
};

/* ================= AGENDAMENTO ================= */
function startBook(o={}){
  B={services:o.services||[],barber:o.barber||null,date:null,time:null,step:o.step||1,month:firstOfMonth(new Date()),editId:o.editId||null,from:route,pay:'pix',note:o.note||''};
  go('book');
}
function confirmBook(){
  const u=me(),svc=B.services.map(svcOf);
  const dur=svc.reduce((a,s)=>a+s.dur,0),total=svc.reduce((a,s)=>a+s.price,0);
  let barber=B.barber;
  if(barber==='any')barber=firstFree(B.date,B.time,dur,B.editId);
  const slot=barber&&slotsFor(B.date,barber,dur,B.editId).find(s=>tkey(s.m)===B.time);
  if(!slot||!slot.ok){toast('Esse horário acabou de ser ocupado. Escolha outro.');B.time=null;B.step=3;render();return}
  const st=parseStart(`${B.date}T${B.time}`),en=new Date(st.getTime()+dur*60000);
  const clash=myAppts().find(a=>a.status==='ok'&&a.id!==B.editId&&parseStart(a.start)<en&&new Date(parseStart(a.start).getTime()+a.dur*60000)>st);
  if(clash){toast('Você já tem outro horário marcado nesse período.');B.step=3;B.time=null;render();return}
  const appts=allAppts();let id=B.editId;
  if(id){const a=appts.find(x=>x.id===id);a.start=`${B.date}T${B.time}`;a.barber=barber;a.pay=B.pay;a.note=B.note}
  else{id=uid();appts.push({id,userId:u.id,name:u.name,phone:u.phone,services:[...B.services],barber,start:`${B.date}T${B.time}`,dur,total,status:'ok',pay:B.pay,note:B.note||'',rating:null,created:new Date().toISOString()})}
  store.set('bi_appts',appts);
  const when=`${longDate(fromKey(B.date))}, às ${B.time}`;
  pushN(u.id,B.editId?'Horário remarcado':'Horário confirmado',`${svc.map(s=>s.name).join(' + ')} com ${barOf(barber).name}. ${when}.`);
  const edited=!!B.editId;B=null;
  go('success',{id,edited});
}

/* ================= AÇÕES ================= */
const ACTIONS={
  to:t=>go(t.dataset.r),
  toWelcome:()=>go('welcome'),
  toHome:()=>go('home'),
  successGo:t=>go(t.dataset.r),
  pw:t=>{const i=t.parentElement.querySelector('input');const show=i.type==='password';i.type=show?'text':'password';t.innerHTML=ic(show?'eyeoff':'eye');t.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha')},
  newBook:()=>startBook(),
  bookSvc:t=>startBook({services:[t.dataset.id]}),
  bookBarber:t=>startBook({barber:t.dataset.id}),
  bookStyle:t=>startBook({services:['corte'],note:'Estilo: '+STYLES[+t.dataset.i].n}),
  svc:t=>{const i=B.services.indexOf(t.dataset.id);i>=0?B.services.splice(i,1):B.services.push(t.dataset.id);B.date=null;B.time=null;render()},
  pickBarber:t=>{B.barber=t.dataset.id;B.time=null;render()},
  pickDate:t=>{B.date=t.dataset.k;B.time=null;render();const s=$('#slots');s&&s.scrollIntoView({block:'nearest',behavior:'smooth'})},
  pickTime:t=>{B.time=t.dataset.t;render()},
  pay:t=>{B.pay=t.dataset.p;render()},
  mon:t=>{B.month=new Date(B.month.getFullYear(),B.month.getMonth()+Number(t.dataset.d),1);render()},
  bookBack:()=>{
    const min=B.editId?3:1;
    if(B.step>min){B.step--;render(true)}else{const f=B.from;B=null;go(TABS.includes(f)?f:'home')}
  },
  bookNext:()=>{
    if(B.step===4){confirmBook();return}
    if(B.step===1&&!B.services.length)return;
    if(B.step===2&&!B.barber)return;
    if(B.step===3&&!(B.date&&B.time))return;
    B.step++;render(true);
  },
  tab:t=>{ui.tab=t.dataset.t;render()},
  resched:t=>{const a=getAppt(t.dataset.id);if(!a)return;startBook({services:[...a.services],barber:a.barber,step:3,editId:a.id,note:a.note})},
  rebook:t=>{const a=getAppt(t.dataset.id);if(!a)return;startBook({services:[...a.services],barber:a.barber,step:3})},
  openNotifs:()=>{
    const all=store.get('bi_notifs',[]),u=me(),fresh=all.filter(n=>n.userId===u.id&&!n.read).map(n=>n.id);
    all.forEach(n=>{if(n.userId===u.id)n.read=true});store.set('bi_notifs',all);
    go('notifs',{fresh});
  },
  cancelAsk:t=>{
    const a=getAppt(t.dataset.id);if(!a)return;
    const d=parseStart(a.start);
    sheet(`<h2>Cancelar este horário?</h2><p class="mute">${esc(a.services.map(id=>svcOf(id).name).join(' + '))}<br>${longDate(d)}, às ${pad(d.getHours())}:${pad(d.getMinutes())}</p><div class="acts"><button class="btn ghost" data-a="closeSheet">Manter</button><button class="btn danger" data-a="cancelDo" data-id="${a.id}">Cancelar horário</button></div>`);
  },
  cancelDo:t=>{
    const all=allAppts(),a=all.find(x=>x.id===t.dataset.id);
    if(a){a.status='cancelled';pushN(a.userId,'Horário cancelado',`${longDate(parseStart(a.start))}, às ${a.start.split('T')[1]}.`)}
    store.set('bi_appts',all);closeSheet();render();toast('Horário cancelado');
  },
  rateAsk:t=>{
    rateDraft={id:t.dataset.id,stars:0};
    sheet(`<h2>Como foi seu corte?</h2><p class="mute">Sua nota ajuda o barbeiro e outros clientes.</p><div class="bigstars" id="rstars">${[1,2,3,4,5].map(n=>`<button class="starbtn" data-a="star" data-n="${n}" aria-label="${n} ${n>1?'estrelas':'estrela'}">${ic('star',36)}</button>`).join('')}</div><form data-f="rate" class="gap" novalidate><div class="field"><label for="rtxt">Comentário (opcional)</label><input id="rtxt" name="rtxt" maxlength="140" placeholder="Conte como foi o atendimento"></div><div class="err" role="alert"></div><div class="acts"><button type="button" class="btn ghost" data-a="closeSheet">Agora não</button><button class="btn" type="submit">Enviar</button></div></form>`);
  },
  star:t=>{rateDraft.stars=+t.dataset.n;document.querySelectorAll('#rstars .starbtn').forEach((b,i)=>b.classList.toggle('on',i<rateDraft.stars))},
  closeSheet:()=>closeSheet(),
  logout:()=>{store.del('bi_session');go('welcome');toast('Você saiu da conta')},
  passOpen:()=>sheet(`<h2>Alterar senha</h2><form data-f="pass" class="gap" novalidate>${pw('cur','Senha atual','current-password')}${pw('nw','Nova senha','new-password','Mínimo de 6 caracteres')}<div class="err" role="alert"></div><div class="acts"><button type="button" class="btn ghost" data-a="closeSheet">Voltar</button><button class="btn" type="submit">Salvar</button></div></form>`),
  delAsk:()=>sheet(`<h2>Excluir sua conta?</h2><p class="mute">Seus dados e todos os seus agendamentos serão apagados. Não é possível desfazer.</p><div class="acts"><button class="btn ghost" data-a="closeSheet">Manter conta</button><button class="btn danger" data-a="delDo">Excluir conta</button></div>`),
  delDo:()=>{
    const u=me();if(!u)return;
    store.set('bi_users',users().filter(x=>x.id!==u.id));
    store.set('bi_appts',allAppts().filter(a=>a.userId!==u.id));
    store.set('bi_notifs',store.get('bi_notifs',[]).filter(n=>n.userId!==u.id));
    store.del('bi_session');closeSheet();go('welcome');toast('Conta excluída');
  }
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(t&&ACTIONS[t.dataset.a])ACTIONS[t.dataset.a](t,e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#sheet').hidden)closeSheet()});
document.addEventListener('input',e=>{
  if(e.target.dataset.mask==='phone')e.target.value=fmtPhone(e.target.value);
  if(e.target.dataset.bind==='note'&&B)B.note=e.target.value;
});
document.addEvent

/* ================= FORMULÁRIOS ================= */
const FORMS={
  async login(f){
    const fd=new FormData(f),id=fd.get('ident').trim().toLowerCase(),p=fd.get('pass');
    if(!id||!p)return setErr(f,'Preencha e-mail ou telefone e a senha.');
    const digits=id.replace(/\D/g,'');
    const h=await hash(p);
    const u=users().find(x=>x.email===id||(digits.length>=10&&x.phone===digits));
    if(!u)return setErr(f,'Não encontramos essa conta neste aparelho. Toque em Criar conta para se cadastrar.');
    if(u.pass!==h)return setErr(f,'Senha incorreta.');
    store.set('bi_session',u.id);go('home');
  },
  async register(f){
    const fd=new FormData(f),name=fd.get('fname').trim(),phone=fd.get('phone').replace(/\D/g,''),email=fd.get('email').trim().toLowerCase(),p=fd.get('pass');
    if(name.length<3)return setErr(f,'Informe seu nome completo.');
    if(phone.length<10)return setErr(f,'Informe um telefone com DDD.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setErr(f,'Informe um e-mail válido.');
    if(p.length<6)return setErr(f,'A senha precisa ter ao menos 6 caracteres.');
    const all=users();
    if(all.some(x=>x.email===email))return setErr(f,'Já existe uma conta com esse e-mail. Volte e toque em Entrar.');
    if(all.some(x=>x.phone===phone))return setErr(f,'Já existe uma conta com esse telefone. Volte e toque em Entrar.');
    const u={id:uid(),name,phone,email,pass:await hash(p),photo:'',created:new Date().toISOString()};
    all.push(u);store.set('bi_users',all);store.set('bi_session',u.id);
    pushN(u.id,'Bem-vindo à Barbearia Ideal','Sua conta está pronta. Toque no botão dourado para agendar seu primeiro horário.');
    go('home');toast('Conta criada. Bem-vindo!');
  },
  forgot1(f){
    const email=new FormData(f).get('email').trim().toLowerCase();
    const u=users().find(x=>x.email===email);
    if(!u)return setErr(f,'Não encontramos uma conta com esse e-mail.');
    go('forgot',{step:2,email,code:String(Math.floor(100000+Math.random()*900000))});
  },
  async forgot2(f){
    const fd=new FormData(f);
    if(fd.get('code').trim()!==ui.code)return setErr(f,'Código incorreto. Confira e tente de novo.');
    const p=fd.get('pass');
    if(p.length<6)return setErr(f,'A senha precisa ter ao menos 6 caracteres.');
    const all=users(),u=all.find(x=>x.email===ui.email);
    u.pass=await hash(p);store.set('bi_users',all);go('forgot',{step:3});
  },
  profile(f){
    const fd=new FormData(f),name=fd.get('fname').trim(),phone=fd.get('phone').replace(/\D/g,'');
    if(name.length<3)return setErr(f,'Informe seu nome completo.');
    if(phone.length<10)return setErr(f,'Informe um telefone com DDD.');
    const all=users(),u=all.find(x=>x.id===me().id);
    if(all.some(x=>x.id!==u.id&&x.phone===phone))return setErr(f,'Esse telefone já está em outra conta.');
    u.name=name;u.phone=phone;store.set('bi_users',all);render();toast('Alterações salvas');
  },
  async pass(f){
    const fd=new FormData(f),all=users(),u=all.find(x=>x.id===me().id);
    if(u.pass!==await hash(fd.get('cur')))return setErr(f,'A senha atual está incorreta.');
    if(fd.get('nw').length<6)return setErr(f,'A nova senha precisa ter ao menos 6 caracteres.');
    u.pass=await hash(fd.get('nw'));store.set('bi_users',all);closeSheet();toast('Senha alterada');
  },
  rate(f){
    if(!rateDraft||!rateDraft.stars)return setErr(f,'Escolha de 1 a 5 estrelas.');
    const all=allAppts(),a=all.find(x=>x.id===rateDraft.id);
    if(a)a.rating={stars:rateDraft.stars,text:new FormData(f).get('rtxt').trim()};
    store.set('bi_appts',all);rateDraft=null;closeSheet();render();toast('Obrigado pela avaliação');
  }
};
document.addEventListener('submit',async e=>{
  const f=e.target.closest('form[data-f]');if(!f)return;
  e.preventDefault();
  const h=FORMS[f.dataset.f];if(!h)return;
  const btn=f.querySelector('button[type=submit]');if(btn)btn.disabled=true;
  try{await h(f)}catch(err){setErr(f,'Algo deu errado. Tente novamente.');console.error(err)}
  finally{if(btn&&btn.isConnected)btn.disabled=false}
});

/* ================= INÍCIO ================= */
route=me()?'home':'welcome';
render(true);