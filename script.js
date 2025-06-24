let products = [];

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

    let imageHtml = "";
    if (p.images && p.images.length > 0) {
      const imgs = typeof p.images === "string" ? p.images.split("|") : p.images;
      imageHtml = `
        <img src="${imgs[0]}" alt="${p.name}" width="200" style="border-radius:8px;margin-bottom:10px;">
        ${imgs.length > 1 ? `<button onclick="showProductImage(${p.id})">📷 Xem ${imgs.length} ảnh</button>` : ""}
      `;
    } else {
      imageHtml = `<div style="width:200px;height:120px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;">(Không có ảnh)</div>`;
    }

    const status = (p.status || "").toLowerCase();
    const statusColor = status.includes("còn") ? "green" : "red";
    const statusText = status.includes("còn") ? "Còn hàng" : "Đã bán";

    function formatCreatedAt(isoString) {
      const d = new Date(isoString);
      return isNaN(d) ? isoString : d.toLocaleString("vi-VN");
    }

    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description || "Không có"}</p>
      <p><strong>Trạng thái:</strong> <span style="color:${statusColor}">${statusText}</span></p>
      <p><strong>🕒 Thời gian:</strong> ${formatCreatedAt(p.timestamp)}</p>
      <a href="https://zalo.me/0337457055" target="_blank">💬 Inbox Zalo</a>
    `;
    grid.appendChild(div);
  });
}

function showProductImage(productId) {
  const product = products.find(p => p.id == productId);
  if (!product || !product.images) return;

  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  const imgs = typeof product.images === "string" ? product.images.split("|") : product.images;

  content.innerHTML = imgs.map(img => `<img src="${img}" style="max-width:100%;margin:10px 0;">`).join("");
  modal.style.display = "flex";
}

function closeImageListModal() {
  document.getElementById("imageListModal").style.display = "none";
}

async function fetchProductsFromSheet() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec");
    const data = await res.json();
    products = data.map(p => ({
      ...p,
      images: typeof p.images === "string" ? p.images.split("|").filter(Boolean) : []
    }));
    renderProducts("iphone");
  } catch (err) {
    console.error("❌ Lỗi tải sản phẩm:", err);
  }
}

window.addEventListener("DOMContentLoaded", fetchProductsFromSheet);
