const products = document.querySelectorAll('.product');
const selectedType = document.getElementById('selectedType');
const selectedPrice = document.getElementById('selectedPrice');
const paymentStatus = document.getElementById('paymentStatus');
const payBtn = document.getElementById('payBtn');
const scoopBtn = document.getElementById('scoopBtn');
const bigSpoon = document.getElementById('bigSpoon');
const itemsGrid = document.getElementById('itemsGrid');
const itemCount = document.getElementById('itemCount');
const orderTitle = document.getElementById('orderTitle');
const orderAmount = document.getElementById('orderAmount');
const orderNumber = document.getElementById('orderNumber');

let current = { type: 'Basic Scoop', price: 10000 };
let paid = false;

const surprisePool = [
  ['🎀','Hair clip'], ['📝','Memo'], ['🔑','Keychain'], ['✨','Sticker'], ['🌸','Charm'],
  ['💗','Bracelet'], ['🧸','Mini plush'], ['💍','Ring'], ['🦄','Cute pen'], ['🍓','Eraser'],
  ['🎁','Mini gift'], ['⭐','Star charm'], ['🐰','Bunny clip'], ['💎','Rare item'], ['🌈','Rainbow sticker']
];

function money(n){ return new Intl.NumberFormat('mn-MN').format(n) + '₮'; }

products.forEach(btn => {
  btn.addEventListener('click', () => {
    products.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    current = { type: btn.dataset.type, price: Number(btn.dataset.price) };
    selectedType.textContent = current.type;
    selectedPrice.textContent = money(current.price);
    orderTitle.textContent = current.type;
    orderAmount.textContent = money(current.price);
    paid = false;
    paymentStatus.textContent = 'Төлбөр хүлээгдэж байна';
    scoopBtn.disabled = true;
  });
});

payBtn.addEventListener('click', () => {
  paid = true;
  paymentStatus.textContent = 'Төлбөр төлөгдсөн ✓';
  scoopBtn.disabled = false;
  orderNumber.textContent = '#CS' + new Date().getTime().toString().slice(-8);
  payBtn.textContent = 'Төлбөр амжилттай ✓';
  setTimeout(()=> payBtn.textContent = 'Төлбөр төлөх demo', 1600);
});

scoopBtn.addEventListener('click', () => {
  if(!paid) return;
  scoopBtn.disabled = true;
  bigSpoon.classList.add('scooping');
  itemsGrid.innerHTML = '';
  itemCount.textContent = 'Scoop хийж байна...';

  const count = Math.floor(Math.random() * 6) + 10; // 10-15
  const chosen = [...surprisePool].sort(() => Math.random() - .5).slice(0, count);

  setTimeout(() => {
    bigSpoon.classList.remove('scooping');
    chosen.forEach(([emoji, name], index) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span>${emoji}</span>${name}`;
        itemsGrid.appendChild(div);
        itemCount.textContent = `${itemsGrid.children.length} зүйл`;
        if(itemsGrid.children.length === chosen.length) scoopBtn.disabled = false;
      }, index * 90);
    });
  }, 700);
});

document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => document.querySelector(btn.dataset.scroll).scrollIntoView({behavior:'smooth'}));
});
