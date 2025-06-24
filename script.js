let products = [];
const API_URL = "https://script.google.com/macros/s/AKfycbyiPIHkw5ve1ogTtrdSBQaUjtOmxfbq88YrBeRRM55Itgq2DLEZg6IK4B4J-cM_WECo/exec"; // thay nếu cần

function renderProducts(filterType) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter(p => p.type === filterType);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color: orange;">⚠️ Không có sản phẩm nào thuộc loại "${filterType}"</p>`;
    return;
  }

  filtered.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";

    let imageHtml = "";
    const imgs = (typeof p.images === "string" ? p.images.split("|") : []).filter(Boolean);

    if (imgs.length > 0) {
      imageHtml = `
        <img src="${imgs[0]}" alt="${p.name}">
        ${imgs.length > 1 ? `<button class="image-btn" onclick="showProductImage(${index})">📷 Xem ${imgs.length} ảnh</button>` : ""}
      `;
    } else {
      imageHtml = `<div style="height: 120px; background: #eee; display:flex; justify-content:center; align-items:center;">(Không có ảnh)</div>`;
    }

    const status = (p.status || "").toLowerCase();
    const statusColor = status.includes("còn") ? "green" : "red";
    const statusText = status.includes("còn") ? "Còn hàng" : "Đã bán";

    const time = formatTime(p.timestamp);

    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description}</p>
      <p><strong>Trạng thái:</strong> <span style="color:${statusColor}; font-weight:bold;">${statusText}</span></p>
      <p><strong>🕒 Thời gian:</strong> ${time}</p>
      <a href="https://zalo.me/0337457055" target="_blank" class="zalo-button">💬 Inbox Zalo</a>
    `;
    grid.appendChild(div);
  });
}

function formatTime(isoString) {
  if (!isoString) return "Không rõ";
  const d = new Date(isoString);
  if (isNaN(d)) return "Không rõ";
  return d.toLocaleString("vi-VN", {
    hour: "2-digit", minute: "2-digit",
    day: "2-digit", month: "2-digit", year: "numeric"
  });
}

function showProductImage(index) {
  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  const imgs = (products[index].images || "").split("|").filter(Boolean);
  content.innerHTML = imgs.map(src => `<img src="${src}" style="max-width:100%; margin-bottom:10px; border-radius:10px;">`).join("");
  modal.style.display = "flex";
}

function closeImageListModal() {
  document.getElementById("imageListModal").style.display = "none";
}

function filter(type) {
  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderProducts(type);
}

async function fetchProductsFromSheet() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    products = data;
    renderProducts("iphone");
  } catch (e) {
    console.error("Lỗi tải dữ liệu:", e);
  }
}

window.addEventListener("DOMContentLoaded", fetchProductsFromSheet);
