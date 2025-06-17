const products = [

];

const grid = document.getElementById("productGrid");

function renderProducts(filterType) {
  grid.innerHTML = "";
  const filtered = products.filter(p => p.type === filterType);
  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>Giá: ${p.price}</p>
      <button onclick="window.open('https://zalo.me/0337457055', '_blank')">Inbox Zalo</button>
    `;
    grid.appendChild(div);
  });
}

function filter(type) {
  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderProducts(type);
}

// Mặc định hiển thị iPhone khi tải trang
renderProducts("iphone");
