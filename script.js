let products = [];

function renderProducts(type) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter(p => p.type?.toLowerCase() === type.toLowerCase());

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:orange;">⚠️ Không có sản phẩm thuộc loại "${type}"</p>`;
    return;
  }

  filtered.forEach((p, index) => {
  const images = typeof p.images === "string" ? p.images.split("|") : [];
  
  const imgHTML = images.length
    ? `
      <img src="${images[0]}" alt="${p.name}" style="width:100%;border-radius:8px;">
      <button class="view-images-btn" onclick="showProductImage(${index})">
        📷 Xem ${images.length} ảnh
      </button>
      `
    : `
      <div style="background:#eee;height:120px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
        (Không có ảnh)
      </div>
    `;


    const status = (p.status || "").toLowerCase().includes("còn") ? `<span style="color:green;font-weight:bold;">Còn hàng</span>` : `<span style="color:red;font-weight:bold;">Đã bán</span>`;

    const time = p.timestamp ? new Date(p.timestamp).toLocaleString("vi-VN") : "Không rõ";

    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imgHTML}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description}</p>
      <p><strong>Trạng thái:</strong> ${status}</p>
      <p><strong>🕒 Thời gian:</strong> ${time}</p>
      <a href="https://zalo.me/0337457055" target="_blank" class="zalo-button">💬 Inbox Zalo</a>
    `;
    grid.appendChild(div);
  });
}

function showProductImage(index) {
  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  const images = products[index].images?.split("|") || [];
  content.innerHTML = images.map(img => `<img src="${img}" style="width:100%;border-radius:12px;margin-bottom:10px;">`).join("");
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

async function fetchProducts() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbyiPIHkw5ve1ogTtrdSBQaUjtOmxfbq88YrBeRRM55Itgq2DLEZg6IK4B4J-cM_WECo/exec");
    const data = await res.json();
    products = data;
    renderProducts("iphone");
  } catch (e) {
    console.error("Lỗi khi tải sản phẩm:", e);
  }
}
document.getElementById("ratingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const rating = document.querySelector('input[name="rating"]:checked');
  const comment = document.getElementById("comment").value.trim();

  if (!rating) {
    alert("Vui lòng chọn số sao để đánh giá.");
    return;
  }

  const newReview = {
    rating: parseInt(rating.value),
    comment,
    time: new Date().toISOString(),
  };

  const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  storedReviews.push(newReview);
  localStorage.setItem("reviews", JSON.stringify(storedReviews));

  document.getElementById("ratingForm").reset();
  updateAverageRating();
  alert("🎉 Cảm ơn bạn đã đánh giá!");
});

function updateAverageRating() {
  const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  if (storedReviews.length === 0) {
    document.getElementById("avgRating").textContent = "🌟 Trung bình đánh giá: Chưa có đánh giá nào";
    return;
  }

  const avg = storedReviews.reduce((acc, r) => acc + r.rating, 0) / storedReviews.length;
  const rounded = avg.toFixed(1);
  document.getElementById("avgRating").textContent = `🌟 Trung bình đánh giá: ${rounded} / 5 (${storedReviews.length} đánh giá)`;
}

window.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateAverageRating();
});

window.addEventListener("DOMContentLoaded", fetchProducts);
