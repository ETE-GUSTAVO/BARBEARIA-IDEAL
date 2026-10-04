const $=s=>document.querySelector(s)
,$$=s=>[...document.querySelectorAll(s)];

let service='Corte Masculino',
step=1,
barber='Lucas',
time='13:00';
const services=[
  ['Corte Masculino','Corte tradicional e degradê','R$ 25,00'],
  ['Barba','Modelagem e alinhamento','R$ 15,00'],
  ['Combo','Corte + Barba','R$ 35,00'],
  ['Sobrancelha','Definição do olhar','R$ 10,00'],
  ['Combo Especial','Corte + Barba + Sobrancelha','R$ 45,00']
];

function toast(t) {
  let x=$('#toast');
  x.textContent=t;
  x.classList.add('show');
  setTimeout(()=>x.classList.remove('show'),2000)
}

function go(p){
  $$('.page').forEach(x=>x.classList.remove('active'));
  $('#'+p)?.classList.add('active');

  $$('nav button').forEach(x=>
    x.classList.toggle('active',x.dataset.page===p)
  );
  
  scrollTo(0,0)
}

function renderServices(f=''){
  let l=$('#serviceList');

  l.innerHTML=services
  .filter(x=>x[0].toLowerCase().includes(f.toLowerCase()))
  .map(x=>`
    <article class="service">
    <div class="ico">✂</div>

    <div>
      <b>${x[0]}</b>
      <p>${x[1]}</p>
      <strong>${x[2]}</strong>
    </div>
    
    <button data-s="${x[0]}">+</button>
  </article>
  `)
  .join('');
  
  $$('[data-s]').forEach(b=>
    b.onclick=()=>openBook(b.dataset.s)
  );
}

function openBook(s){
  service=s;
  step=1;
  renderBook();
  go('booking')
}

function renderBook(){
  let p=$$('.progress i');
  
  p.forEach((x,i)=>
    x.classList.toggle('on',i<step)
);

let box=$('#bookingBox');

if(step===1){
  $('#stepTitle').textContent='Passo 1 de 3';
}  
  box.innerHTML='
  <div class="booking">
    <h3>Escolha o serviço</h3>
  
  ${services.map(x=>`<button class="choice ${service===x[0]?'active':''}" data-c="${x[0]}"><b>${x[0]}</b><small>${x[1]} • ${x[2]}</small></button>`).join('')+'<button class="gold" id="next">Próximo →</button></div>'}else if(step===2){$('#stepTitle').textContent='Passo 2 de 3';box.innerHTML='<div class="booking"><h3>Escolha o barbeiro</h3>'+['Lucas','Matheus','Rafael','Diego'].map(x=>`<button class="choice ${barber===x?'active':''}" data-b="${x}"><b>${x}</b><small>Especialista • ★ 4.9</small></button>`).join('')+'<button class="gold" id="next">Próximo →</button></div>'}else if(step===3){$('#stepTitle').textContent='Passo 3 de 3';box.innerHTML='<div class="booking"><h3>Escolha o horário</h3><p style="color:#888;font-size:10px">Outubro de 2026 • Sábado, dia 10</p><div class="times">'+['08:00','09:00','10:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(x=>`<button class="time ${time===x?'active':''}" data-t="${x}">${x}</button>`).join('')+'</div><p style="font-size:10px;color:#888;margin-top:15px">Resumo: <b style="color:white">${service}</b> • ${barber} • ${time}</p><button class="gold" id="next">Confirmar agendamento →</button></div>'}else{box.innerHTML='<div class="booking confirm"><div class="checkbig">✓</div><h2>Agendamento confirmado!</h2><p style="color:#999;font-size:11px">Seu horário foi reservado com sucesso.</p><p><b>'+service+'</b><br>com '+barber+'<br>10/10/2026 • '+time+'</p><button class="gold" id="next">Ver meus agendamentos</button></div>'}
$$('[data-c]').forEach(b=>b.onclick=()=>{service=b.dataset.c;renderBook()});$$('[data-b]').forEach(b=>b.onclick=()=>{barber=b.dataset.b;renderBook()});$$('[data-t]').forEach(b=>b.onclick=()=>{time=b.dataset.t;renderBook()});$('#next').onclick=()=>{if(step<4){step++;renderBook()}else go('appointments')}}
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#loginForm').classList.toggle('hide',b.dataset.auth!=='login');$('#registerForm').classList.toggle('hide',b.dataset.auth!=='register')});
$('#loginForm').onsubmit=e=>{e.preventDefault();$('#auth').classList.add('hide');$('#app').classList.remove('hide');toast('Bem-vindo à BARBEARIA-IDEAL')};
$('#registerForm').onsubmit=e=>{e.preventDefault();toast('Conta criada! Agora entre no sistema.');$$('.tabs button')[0].click()};
$('#searchService').oninput=e=>renderServices(e.target.value);
$$('nav button').forEach(b=>b.onclick=()=>go(b.dataset.page));$$('[data-page]').filter(b=>!b.closest('nav')).forEach(b=>b.onclick=()=>go(b.dataset.page));$$('[data-service]').forEach(b=>b.onclick=()=>openBook(b.dataset.service));
$('#logout').onclick=()=>{location.reload()};$('#bell').onclick=()=>toast('Você não possui novas notificações.');
renderServices();
