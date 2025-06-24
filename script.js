// === script.js HOÀN CHỈNH VỚI PHẢN HỒI ===
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
        ${images.length > 1 ? `<button class="view-images-btn" onclick="showProductImage(${index})">📷 Xem ${images.length} ảnh</button>` : ""}`
      : `<div style="background:#eee;height:120px;border-radius:8px;display:flex;align-items:center;justify-content:center;">(Không có ảnh)</div>`;

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

function saveFeedback(rating, comment) {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
  feedbacks.push({ rating, comment, date: new Date().toLocaleString("vi-VN") });
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}

function updateAverageRating() {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
  const avg = feedbacks.length ? (feedbacks.reduce((t, f) => t + Number(f.rating), 0) / feedbacks.length).toFixed(1) : "Chưa có";
  document.getElementById("avgRating").textContent = `🌟 Trung bình đánh giá: ${avg}/5`;
}

function renderFeedbackList() {
  const list = document.getElementById("feedbackItems");
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
  if (feedbacks.length === 0) {
    list.innerHTML = "<li>Chưa có phản hồi nào từ khách hàng.</li>";
    return;
  }
  list.innerHTML = feedbacks.map(f => `
    <li style="margin-bottom: 10px; background: #f1f1f1; padding: 10px; border-radius: 8px;">
      ⭐ <strong>${f.rating}/5</strong> – ${f.comment}<br>
      <small>🕒 ${f.date}</small>
    </li>
  `).join("");
}

window.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateAverageRating();
  renderFeedbackList();
  const form = document.getElementById("ratingForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const rating = form.rating.value;
    const comment = document.getElementById("comment").value.trim();
    if (!rating || !comment) {
      alert("⚠️ Vui lòng chọn số sao và nhập nhận xét.");
      return;
    }
    saveFeedback(rating, comment);
    updateAverageRating();
    renderFeedbackList();
    alert("🎉 Cảm ơn bạn đã đánh giá!");
    form.reset();
  });
});


window.addEventListener("DOMContentLoaded", fetchProducts);
