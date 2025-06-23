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

    // === ẢNH SẢN PHẨM ===
    let imageHtml = "";
    if (p.image && p.image.length > 0) {
      imageHtml = `
        <img src="${p.image[0]}" alt="${p.name}" width="200" style="border-radius:8px;margin-bottom:10px;">
        ${p.image.length > 1 ? `<button class="image-btn" onclick="showProductImage(${realIndex})">📷 Xem ${p.image.length} ảnh</button>` : ""}
      `;
    } else {
      imageHtml = `<div style="width:200px;height:120px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">(Chưa có ảnh)</div>`;
    }

    // === MÀU TRẠNG THÁI ===
    const statusRaw = (p.status || "").toLowerCase().trim();
    let statusColor = "red";
    let statusText = "Hết hàng";

    if (statusRaw.includes("còn")) {
      statusColor = "green";
      statusText = "Còn hàng";
    }

    // === FORMAT THỜI GIAN ĐĂNG ===
    let postedTime = "Không rõ";
    if (p.timestamp && !isNaN(new Date(p.timestamp))) {
      const date = new Date(p.timestamp);
      postedTime = date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }

    // === HTML SẢN PHẨM ===
    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description || "Không có"}</p>
      <p><strong>Trạng thái:</strong> <span style="color:${statusColor}; font-weight:bold;">${statusText}</span></p>
      <p><strong>🕒 Thời gian đăng:</strong> ${postedTime}</p>
      <a href="https://zalo.me/0337457055" target="_blank" class="zalo-button">💬 Inbox Zalo</a>
    `;
    grid.appendChild(div);
  });
}

// ====== XEM ẢNH SẢN PHẨM ======
function showProductImage(index) {
  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  const images = products[index].image || [];

  if (images.length === 0) {
    content.innerHTML = "<p>Không có ảnh nào.</p>";
  } else {
    content.innerHTML = images.map(img => `<img src="${img}" style="max-width:100%;border-radius:12px;margin-bottom:10px;">`).join("");
  }

  modal.style.display = "flex";
}

function closeImageListModal() {
  document.getElementById("imageListModal").style.display = "none";
}

// ====== LỌC THEO LOẠI ======
function filter(type) {
  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderProducts(type);
}

// ====== TẢI TỪ GOOGLE SHEET ======
async function fetchProductsFromSheet() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec");
    const data = await res.json();

    products = data.map(p => ({
      ...p,
      image: Array.isArray(p.images)
        ? p.images
        : typeof p.images === "string"
        ? p.images.split("|").map(s => s.trim()).filter(Boolean)
        : [],
      status: p.status || "",
      timestamp: p.timestamp || ""
    }));

    renderProducts("iphone");
  } catch (error) {
    console.error("❌ Lỗi tải sản phẩm từ Google Sheet:", error);
  }
}

// ====== TẢI TRANG ======
window.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsFromSheet();
});
