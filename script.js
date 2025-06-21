let products = [];

function renderProducts(filterType) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter(p => p.type === filterType && p.status !== 'Đã bán');

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color: orange;">⚠️ Không có sản phẩm nào thuộc loại "${filterType}"</p>`;
    return;
  }

  filtered.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";

    let imageHtml = "";
    if (p.images && p.images.length > 0) {
      const imgArray = typeof p.images === "string" ? p.images.split("|") : p.images;
      imageHtml = `
        <img src="${imgArray[0]}" alt="${p.name}" width="200" style="border-radius:8px;margin-bottom:10px;">
        ${imgArray.length > 1 ? `<button onclick="showProductImage(${index})">📷 Xem ${imgArray.length} ảnh</button>` : ""}
      `;
    } else {
      imageHtml = `<div style="width:200px;height:120px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">(Chưa có ảnh)</div>`;
    }

    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Trạng thái:</strong> ${p.status}</p>
      <p><strong>Thêm lúc:</strong> ${p.timestamp || "Không rõ"}</p>
      <p><strong>Mô tả:</strong> ${p.description || "Không có"}</p>
      <button onclick="window.open('https://zalo.me/0337457055', '_blank')">Inbox Zalo</button>
    `;
    grid.appendChild(div);
  });
}

function showProductImage(index) {
  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  const imgArr = typeof products[index].images === "string" ? products[index].images.split("|") : products[index].images;

  if (!imgArr || imgArr.length === 0) {
    content.innerHTML = "<p>Không có ảnh nào.</p>";
  } else {
    content.innerHTML = imgArr.map(img => `<img src="${img}" style="max-width:100%;border-radius:12px;margin-bottom:10px;">`).join("");
  }

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
    const res = await fetch("https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec");
    const data = await res.json();
    products = data;
    renderProducts("iphone");
  } catch (error) {
    console.error("❌ Lỗi tải sản phẩm:", error);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsFromSheet();
});
