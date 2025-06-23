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
    if (p.image && p.image.length > 0) {
      imageHtml = `
        <img src="${p.image[0]}" alt="${p.name}" width="200" style="border-radius:8px;margin-bottom:10px;">
        ${p.image.length > 1 ? `<button class="image-btn" onclick="showProductImage(${realIndex})">📷 Xem ${p.image.length} ảnh</button>` : ""}
      `;
    } else {
      imageHtml = `<div style="width:200px;height:120px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">(Chưa có ảnh)</div>`;
    }

    const statusRaw = (p.status || "").toLowerCase().trim();
    let statusColor = "red";
    let statusText = "Hết hàng";

    if (statusRaw.includes("còn")) {
      statusColor = "green";
      statusText = "Còn hàng";
    }

    let postedTime = "";
    if (p.timestamp && !isNaN(new Date(p.timestamp))) {
      const date = new Date(p.timestamp);
      postedTime = date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else {
      const now = new Date();
      postedTime = now.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description || "Không có"}</p>
      <p><strong>Trạng thái:</strong> 
        <span style="color: ${statusColor}; font-weight: bold; font-style: italic; font-size: 16px; text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.1);">
          ${statusText}
        </span>
      </p>
      <p><strong>🕒 Thời gian đăng:</strong> ${postedTime}</p>
      <a href="https://zalo.me/0337457055" target="_blank" class="zalo-button">💬 Inbox Zalo</a>
      <p><button onclick="deleteProduct(${realIndex})" style="background:red;color:white;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;margin-top:10px;">🗑 Xóa</button></p>
    `;
    grid.appendChild(div);
  });
}

// ====== XÓA SẢN PHẨM ======
async function deleteProduct(index) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;

  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec?delete=${index}`, {
      method: 'POST'
    });
    const result = await res.json();
    if (result.status === 'success') {
      alert("✅ Đã xóa sản phẩm.");
      products.splice(index, 1);
      renderProducts("iphone");
    } else {
      alert("❌ Xóa thất bại.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Có lỗi xảy ra khi xóa.");
  }
}

// ====== CÁC HÀM KHÁC GIỮ NGUYÊN ======
// ... giữ nguyên từ phần showProductImage, closeImageListModal, filter, đánh giá, fetch sheet, render rating, window load
