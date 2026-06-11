const ADMIN_USER = 'Temuujin1';
const ADMIN_PASS = '11223344';
const STORAGE_KEY = 'cutesy_scoop_orders_v2';
const SESSION_KEY = 'cutesy_admin_logged_in';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const state = {
  current: { type: 'Basic Scoop', price: 10000, count: '10-15' },
  paid: false,
  currentOrderId: null,
};

const statuses = [
  { key: 'preparing', label: 'Бэлтгэж байна', note: 'Захиалга баталгаажсан', class: 'status-preparing' },
  { key: 'packed', label: 'Савлаж байна', note: 'Item-ууд багцлагдаж байна', class: 'status-packed' },
  { key: 'delivery', label: 'Хүргэлтэнд гарсан', note: 'Хаяг руу хүргэж байна', class: 'status-delivery' },
  { key: 'delivered', label: 'Хүргэгдсэн', note: 'Амжилттай дууссан', class: 'status-delivered' },
];

const surprisePool = [
  ['🎀','Hair clip'], ['📝','Memo pad'], ['🔑','Keychain'], ['✨','Sticker'], ['🌸','Charm'],
  ['💗','Bracelet'], ['🧸','Mini plush'], ['💍','Cute ring'], ['🦄','Cute pen'], ['🍓','Eraser'],
  ['🎁','Mini gift'], ['⭐','Star charm'], ['🐰','Bunny clip'], ['💎','Rare item'], ['🌈','Rainbow sticker'],
  ['🍬','Candy charm'], ['🦋','Butterfly clip'], ['☁️','Cloud sticker'], ['🍒','Cherry keyring'], ['🐻','Bear memo']
];

function money(n){ return new Intl.NumberFormat('mn-MN').format(Number(n || 0)) + '₮'; }
function nowText(){ return new Date().toLocaleString('mn-MN', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }); }
function uid(){ return '#CS' + Date.now().toString().slice(-8); }
function getOrders(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function setOrders(orders){ localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); }
function getCurrentOrder(){ return getOrders().find(o => o.id === state.currentOrderId) || getOrders()[0]; }

function updateProgress(stepIndex){
  $$('#flowProgress span').forEach((s, i) => s.classList.toggle('active', i <= stepIndex));
}

function setProduct(productBtn){
  $$('.product').forEach(p => p.classList.remove('active'));
  productBtn.classList.add('active');
  state.current = {
    type: productBtn.dataset.type,
    price: Number(productBtn.dataset.price),
    count: productBtn.dataset.count,
  };
  state.paid = false;
  $('#selectedType').textContent = state.current.type;
  $('#selectedPrice').textContent = money(state.current.price);
  $('#orderTitle').textContent = state.current.type;
  $('#orderAmount').textContent = money(state.current.price);
  $('#paymentStatus').textContent = 'Хүлээгдэж байна';
  $('#scoopState').textContent = 'Locked';
  $('#payBtn').textContent = 'Төлбөр төлөгдсөн гэж шалгах';
  $('#scoopBtn').disabled = true;
  updateProgress(0);
}

function createOrder(source = 'customer'){
  const order = {
    id: uid(),
    customer: source === 'sample' ? sampleName() : 'Demo customer',
    phone: source === 'sample' ? '99' + Math.floor(100000 + Math.random()*899999) : '9999-0000',
    type: state.current.type,
    price: state.current.price,
    count: state.current.count,
    status: 'preparing',
    items: [],
    createdAt: nowText(),
    address: source === 'sample' ? 'Улаанбаатар · Demo хаяг' : 'Sponsor demo · утсан дээр шалгаж байна',
  };
  const orders = [order, ...getOrders()];
  setOrders(orders);
  state.currentOrderId = order.id;
  renderCustomerOrder(order);
  renderAdmin();
  return order;
}

function sampleName(){
  return ['Номин','Ариунзаяа','Солонго','Энэрэл','Баярмаа','Мишээл','Ану','Саруул'][Math.floor(Math.random()*8)];
}

function getStatusIndex(status){
  if(status === 'cancelled') return -1;
  return Math.max(0, statuses.findIndex(s => s.key === status));
}

function renderCustomerOrder(order = getCurrentOrder()){
  if(!order){
    $('#customerTimeline').innerHTML = statuses.map((s,i) => timelineStep(s, i, -1)).join('');
    return;
  }
  $('#orderNumber').textContent = order.id;
  $('#orderTitle').textContent = order.type;
  $('#orderAmount').textContent = money(order.price);
  const active = getStatusIndex(order.status);
  $('#customerTimeline').innerHTML = statuses.map((s,i) => timelineStep(s, i, active)).join('');
}

function timelineStep(s, i, active){
  const cls = i < active ? 'done' : i === active ? 'active' : '';
  const mark = i < active ? '✓' : i + 1;
  return `<div class="timeline-step ${cls}"><b>${mark}</b><span>${s.label}</span><small>${s.note}</small></div>`;
}

function payDemo(){
  state.paid = true;
  const order = createOrder('customer');
  $('#paymentStatus').textContent = 'Төлөгдсөн ✓';
  $('#scoopState').textContent = 'Ready';
  $('#scoopBtn').disabled = false;
  $('#payBtn').textContent = 'Төлбөр баталгаажсан ✓';
  updateProgress(1);
  document.querySelector('#shop').scrollIntoView({behavior:'smooth', block:'start'});
  return order;
}

function makeConfetti(){
  const box = $('#confetti');
  box.innerHTML = '';
  const emojis = ['✨','🎀','💗','⭐','🌸','💎'];
  for(let i=0;i<26;i++){
    const el = document.createElement('i');
    el.textContent = emojis[i % emojis.length];
    el.style.left = '50%';
    el.style.top = '48%';
    el.style.setProperty('--x', `${Math.random()*260 - 130}px`);
    el.style.setProperty('--y', `${Math.random()*-220 - 20}px`);
    box.appendChild(el);
  }
  setTimeout(()=> box.innerHTML = '', 1000);
}

function scoopDemo(){
  if(!state.paid) return;
  const btn = $('#scoopBtn');
  btn.disabled = true;
  $('#scoopState').textContent = 'Scooping...';
  $('#bigSpoon').classList.add('scooping');
  $('#itemsGrid').innerHTML = '';
  $('#itemCount').textContent = 'Scoop хийж байна...';
  updateProgress(2);

  const [min,max] = state.current.count.split('-').map(Number);
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const chosen = Array.from({length: count}, () => surprisePool[Math.floor(Math.random()*surprisePool.length)]);

  setTimeout(() => {
    $('#bigSpoon').classList.remove('scooping');
    makeConfetti();
    chosen.forEach(([emoji, name], index) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span>${emoji}</span>${name}`;
        $('#itemsGrid').appendChild(div);
        $('#itemCount').textContent = `${$('#itemsGrid').children.length} item`;
        if($('#itemsGrid').children.length === chosen.length){
          btn.disabled = false;
          $('#scoopState').textContent = 'Done ✓';
          updateProgress(3);
          saveItemsToOrder(chosen);
        }
      }, index * 55);
    });
  }, 680);
}

function saveItemsToOrder(chosen){
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === state.currentOrderId);
  if(idx >= 0){
    orders[idx].items = chosen.map(x => ({ emoji:x[0], name:x[1] }));
    setOrders(orders);
    renderAdmin();
  }
}

function statusMeta(status){
  if(status === 'cancelled') return { label:'Цуцалсан', class:'status-cancelled' };
  return statuses.find(s => s.key === status) || statuses[0];
}

function updateOrderStatus(id, status){
  const orders = getOrders().map(o => o.id === id ? { ...o, status } : o);
  setOrders(orders);
  if(id === state.currentOrderId) renderCustomerOrder(orders.find(o => o.id === id));
  renderAdmin();
}

function renderAdmin(){
  const orders = getOrders();
  const total = orders.reduce((sum,o) => o.status !== 'cancelled' ? sum + Number(o.price) : sum, 0);
  const pending = orders.filter(o => !['delivered','cancelled'].includes(o.status)).length;
  $('#stats').innerHTML = `
    <div class="stat"><span>Нийт захиалга</span><b>${orders.length}</b></div>
    <div class="stat"><span>Идэвхтэй</span><b>${pending}</b></div>
    <div class="stat"><span>Орлого demo</span><b>${money(total)}</b></div>
    <div class="stat"><span>Хүргэгдсэн</span><b>${orders.filter(o=>o.status==='delivered').length}</b></div>
  `;
  if(!orders.length){
    $('#adminOrders').innerHTML = `<div class="empty-state">Одоогоор order алга. Customer flow-оор захиалга үүсгээд энд хараарай.</div>`;
    return;
  }
  $('#adminOrders').innerHTML = orders.map(order => {
    const meta = statusMeta(order.status);
    const items = order.items?.length ? order.items.map(i => i.emoji).join(' ') : 'Scoop хийгдээгүй';
    return `<article class="admin-order">
      <div class="admin-order-top">
        <div>
          <h3>${order.id} · ${order.type}</h3>
          <p>${order.customer} · ${order.phone}</p>
          <p>${order.address}</p>
          <p>Items: ${items}</p>
        </div>
        <span class="badge ${meta.class}">${meta.label}</span>
      </div>
      <p><b>${money(order.price)}</b> · ${order.createdAt}</p>
      <div class="status-buttons">
        <button data-status="preparing" data-id="${order.id}">Бэлтгэж</button>
        <button data-status="packed" data-id="${order.id}">Савлаж</button>
        <button data-status="delivery" data-id="${order.id}">Хүргэлтэнд</button>
        <button data-status="delivered" data-id="${order.id}">Хүргэгдсэн</button>
        <button data-status="cancelled" data-id="${order.id}">Цуцлах</button>
      </div>
    </article>`;
  }).join('');
  $$('#adminOrders [data-status]').forEach(btn => btn.onclick = () => updateOrderStatus(btn.dataset.id, btn.dataset.status));
}

function openAdmin(){
  $('#adminModal').classList.add('open');
  $('#adminModal').setAttribute('aria-hidden','false');
  if(sessionStorage.getItem(SESSION_KEY) === '1') showDashboard();
  else showLogin();
}
function closeAdmin(){ $('#adminModal').classList.remove('open'); $('#adminModal').setAttribute('aria-hidden','true'); }
function showDashboard(){ $('#loginView').hidden = true; $('#dashboardView').hidden = false; renderAdmin(); }
function showLogin(){ $('#loginView').hidden = false; $('#dashboardView').hidden = true; $('#loginError').textContent = ''; }

function login(){
  const name = $('#adminName').value.trim();
  const pass = $('#adminPass').value;
  if(name === ADMIN_USER && pass === ADMIN_PASS){
    sessionStorage.setItem(SESSION_KEY, '1');
    showDashboard();
  } else {
    $('#loginError').textContent = 'Нэр эсвэл нууц үг буруу байна.';
  }
}

function seedOrders(count = 3){
  for(let i=0;i<count;i++){
    const product = [
      { type:'Basic Scoop', price:10000, count:'10-15' },
      { type:'Premium Scoop', price:20000, count:'18-25' },
      { type:'Mega Scoop', price:50000, count:'45-60' },
    ][Math.floor(Math.random()*3)];
    state.current = product;
    const order = createOrder('sample');
    const randomStatus = statuses[Math.floor(Math.random()*statuses.length)].key;
    updateOrderStatus(order.id, randomStatus);
  }
  renderAdmin();
}

$$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => $(btn.dataset.scroll).scrollIntoView({behavior:'smooth'})));
$$('.product').forEach(btn => btn.addEventListener('click', () => setProduct(btn)));
$('#payBtn').addEventListener('click', payDemo);
$('#scoopBtn').addEventListener('click', scoopDemo);
$('#openAdminBtn').addEventListener('click', openAdmin);
$('#bottomAdminBtn').addEventListener('click', openAdmin);
$('#closeAdminBtn').addEventListener('click', closeAdmin);
$('#loginBtn').addEventListener('click', login);
$('#logoutBtn').addEventListener('click', () => { sessionStorage.removeItem(SESSION_KEY); showLogin(); });
$('#seedBtn').addEventListener('click', () => seedOrders(3));
$('#clearBtn').addEventListener('click', () => { if(confirm('Бүх local demo order устгах уу?')){ setOrders([]); state.currentOrderId = null; renderCustomerOrder(null); renderAdmin(); }});
$('#demoOrderBtn').addEventListener('click', () => { seedOrders(1); openAdmin(); });
$('#adminModal').addEventListener('click', (e) => { if(e.target.id === 'adminModal') closeAdmin(); });
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeAdmin(); });

if(!getOrders().length) seedOrders(2);
const first = getOrders()[0];
if(first) state.currentOrderId = first.id;
renderCustomerOrder(first);
renderAdmin();
