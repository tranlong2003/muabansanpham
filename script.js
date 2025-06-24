let products = [];

function renderProducts(filterType) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter(p => p.type.toLowerCase() === filterType.toLowerCase());

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color: orange;">⚠️ Không có sản phẩm nào thuộc loại "${filterType}"</p>`;
    return;
  }

  filtered.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";

    const imageHtml = (p.images && p.images.length > 0)
      ? `<img src="${p.images[0]}" alt="${p.name}" width="200" style="border-radius:8px;margin-bottom:10px;">
        ${p.images.length > 1 ? `<button onclick="showProductImage(${index})">📷 Xem ${p.images.length} ảnh</button>` : ""}`
      : `<div style="width:200px;height:120px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;">(Không có ảnh)</div>`;

    const status = (p.status || "").toLowerCase().includes("còn")
      ? `<span style="color:green;font-weight:bold;">Còn hàng</span>`
      : `<span style="color:red;font-weight:bold;">Đã bán</span>`;

    const date = p.timestamp ? new Date(p.timestamp) : null;
    const timeDisplay = (date && !isNaN(date)) ? date.toLocaleString('vi-VN') : "Không rõ";

    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description || "Không có"}</p>
      <p><strong>Trạng thái:</strong> ${status}</p>
      <p><strong>🕒 Thời gian:</strong> ${timeDisplay}</p>
      <a href="https://zalo.me/0337457055" target="_blank" style="color:white;background:#0084ff;padding:8px 12px;border-radius:6px;display:inline-block;text-decoration:none;">💬 Inbox Zalo</a>
    `;
    grid.appendChild(div);
  });
}

function showProductImage(index) {
  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  const images = products[index].images || [];
  content.innerHTML = images.map(src => `<img src="${src}" style="max-width:100%;margin-bottom:10px;border-radius:10px;">`).join("");
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
    const res = await fetch("https://script.google.com/macros/s/AKfycbyiPIHkw5ve1ogTtrdSBQaUjtOmxfbq88YrBeRRM55Itgq2DLEZg6IK4B4J-cM_WECo/exec); // Đổi thành URL script mới
    const data = await res.json();
    products = data.map(p => ({
      ...p,
      images: typeof p.images === "string" ? p.images.split("|").map(i => i.trim()) : []
    }));
    renderProducts("iphone");
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
  }
}

window.addEventListener("DOMContentLoaded", fetchProductsFromSheet);
