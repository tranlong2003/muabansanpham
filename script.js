// ====== DANH SÁCH SẢN PHẨM MẪU ======
let products = [
  {
    name: "iPhone 11 Pro Max 64GB",
    price: "7.500.000đ",
    description: "Máy đẹp 99%, pin khỏe",
    type: "iphone",
    image: ["https://via.placeholder.com/260x160?text=iPhone+11+Pro"]
  },
  {
    name: "Samsung Galaxy S21",
    price: "6.800.000đ",
    description: "Fullbox chính hãng, BH 6 tháng",
    type: "android",
    image: ["https://via.placeholder.com/260x160?text=Galaxy+S21"]
  },
  {
    name: "Acc Free Fire VIP",
    price: "500.000đ",
    description: "Acc nhiều skin, súng vip",
    type: "acc",
    image: []
  }
];

// ====== HIỂN THỊ SẢN PHẨM ======
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
    if (p.image && p.image.length > 0) {
      imageHtml = `<img src="${p.image[0]}" alt="${p.name}" width="200" style="border-radius:8px;margin-bottom:10px;">
      <button onclick="showProductImage(${index})">📷 Xem ảnh</button>`;
    } else {
      imageHtml = `<div style="width:200px;height:120px;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">(Chưa có ảnh)</div>`;
    }

    div.innerHTML = `
      <h3>${p.name}</h3>
      ${imageHtml}
      <p><strong>Giá:</strong> ${p.price}</p>
      <p><strong>Mô tả:</strong> ${p.description || "Không có"}</p>
      <button onclick="window.open('https://zalo.me/0337457055', '_blank')">Inbox Zalo</button>
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

// ====== ĐÁNH GIÁ SAO ======
document.getElementById("ratingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const rating = document.querySelector('input[name="rating"]:checked');
  const comment = document.getElementById("comment").value.trim();

  if (!rating) {
    alert("Vui lòng chọn số sao."); 
    return;
  }

  const ratings = JSON.parse(localStorage.getItem("ratings") || "[]");
  ratings.push({ rating: parseInt(rating.value), comment });
  localStorage.setItem("ratings", JSON.stringify(ratings));

  alert("✅ Đánh giá đã được ghi nhận. Cảm ơn bạn!");
  this.reset();
  renderAverageRating();
});

// ====== TÍNH SAO TRUNG BÌNH ======
function renderAverageRating() {
  const ratings = JSON.parse(localStorage.getItem("ratings") || "[]");
  if (ratings.length === 0) {
    document.getElementById("avgRating").textContent = "🌟 Trung bình đánh giá: Chưa có";
    return;
  }
  const total = ratings.reduce((sum, r) => sum + r.rating, 0);
  const average = (total / ratings.length).toFixed(1);
  document.getElementById("avgRating").textContent = `🌟 Trung bình đánh giá: ${average} (${ratings.length} lượt)`;
}

function resetRatings() {
  if (confirm("Bạn có chắc muốn xóa toàn bộ đánh giá không?")) {
    localStorage.removeItem("ratings");
    renderAverageRating();
    alert("✅ Đã reset toàn bộ đánh giá.");
  }
}

// ====== TẢI TỪ GOOGLE SHEET ======
async function fetchProductsFromSheet() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec");
    const data = await res.json();

    // Chuyển đổi image thành mảng nếu chưa đúng định dạng
    products = data.map(p => ({
      ...p,
      image: Array.isArray(p.image) ? p.image : (p.image ? p.image.split("|") : [])
    }));

    renderProducts("iphone");
  } catch (error) {
    console.error("❌ Lỗi tải sản phẩm từ Google Sheet:", error);
  }
}

// ====== TẢI TRANG ======
window.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsFromSheet();
  renderAverageRating();
  renderProducts("iphone");
});
