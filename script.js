// === script.js (phiên bản đã đồng bộ ===)

let products = [];

// ====== HIỂN THỊ SẢN PHẨM ======
function renderProducts(filterType) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter(p => p.type === filterType);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color: orange;">⚠️ Không có sản phẩm nào thuộc loại "${filterType}"</p>`;
    return;
  }

  filtered.forEach((p) => {
    const div = document.createElement("div");
    div.className = "product";

    const realIndex = products.findIndex(prod => prod.id === p.id);

    let imageHtml = "";
    if (p.images && p.images.length > 0) {
      imageHtml = `
        <img src="${p.images[0]}" alt="${p.name}" width="200" style="border-radius:8px;margin-bottom:10px;">
        ${p.images.length > 1 ? `<button class="image-btn" onclick="showProductImage(${realIndex})">📷 Xem ${p.images.length} ảnh</button>` : ""}
      `;
    } else {
      imageHtml = `<div style="width:200px;height:120px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">(Chưa có ảnh)</div>`;
    }

    // === MÀU TRẠNG THÁI ===
    const statusRaw = (p.status || "").toLowerCase().trim();
    let statusColor = "red";
    let statusText = "Đã bán";

    if (statusRaw.includes("còn")) {
      statusColor = "green";
      statusText = "Còn hàng";
    }

    // Format thời gian đăng
    let postedTime = p.timestamp || "Không rõ";

    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description || "Không có"}</p>
      <p><strong>Trạng thái:</strong> 
        <span style="
          color: ${statusColor}; 
          font-weight: bold; 
          font-style: italic; 
          font-size: 16px;
          text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.1);
        ">${statusText}</span>
      </p>
      <p><strong>🕒 Thời gian đăng:</strong> ${postedTime}</p>
      <a href="https://zalo.me/0337457055" target="_blank" class="zalo-button">💬 Inbox Zalo</a>
    `;
    grid.appendChild(div);
  });
}

function showProductImage(index) {
  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  const images = products[index].images || [];

  content.innerHTML = images.map(img => `<img src="${img}" style="max-width:100%;border-radius:12px;margin-bottom:10px;">`).join("");
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

// ====== LấY TỬ GOOGLE SHEET ======
async function fetchProductsFromSheet() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec");
    const data = await res.json();

    products = data.map(p => ({
      ...p,
      images: typeof p.images === "string" ? p.images.split("|").map(s => s.trim()).filter(Boolean) : []
    }));

    renderProducts("iphone");
  } catch (error) {
    console.error("❌ Lỗi tải sản phẩm:", error);
  }
}

window.addEventListener("DOMContentLoaded", fetchProductsFromSheet);
