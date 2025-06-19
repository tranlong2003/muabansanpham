// ====== DANH SÁCH SẢN PHẨM MẪU ======
let products = [
  {
    name: "iPhone 6s 32GB",
    price: "850.000đ",
    image: "https://via.placeholder.com/260x160?text=iPhone+11+Pro",
    type: "iphone",
  },
  {
    name: "Samsung Galaxy S21",
    price: "6.800.000đ",
    image: "https://via.placeholder.com/260x160?text=Galaxy+S21",
    type: "android",
  },
  {
    name: "Acc Free Fire VIP",
    price: "500.000đ",
    image: "https://via.placeholder.com/260x160?text=Acc+Free+Fire",
    type: "acc",
  }
];

const grid = document.getElementById("productGrid");

// ====== HIỂN THỊ DANH SÁCH SẢN PHẨM ======
function renderProducts(filterType) {
  grid.innerHTML = "";
  const filtered = products.filter(p => p.type === filterType);

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <div class="product-box">
        <button onclick="showProductImage('${p.image}')">📷 Xem ảnh</button>
        <p>Giá: ${p.price}</p>
        <p>${p.description || ""}</p>
        <button onclick="window.open('https://zalo.me/0337457055', '_blank')">Inbox Zalo</button>
      </div>
    `;
    grid.appendChild(div);
  });
}

// ====== HIỂN THỊ ẢNH TRONG MODAL ======
function showProductImage(imageUrl) {
  const modal = document.getElementById("imageListModal");
  const content = document.getElementById("imageListContent");
  content.innerHTML = `<img src="${imageUrl}" alt="Ảnh sản phẩm" />`;
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
let selectedRating = 0;

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

// ====== LẤY SẢN PHẨM TỪ GOOGLE SHEET ======
async function fetchProductsFromSheet() {
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec");
    const data = await res.json();
    products = data;
    renderProducts("iphone");
  } catch (error) {
    console.error("❌ Lỗi tải sản phẩm từ Sheet:", error);
  }
}

// ====== KHỞI ĐỘNG TRANG ======
window.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsFromSheet();
  renderAverageRating();
});

function showGallery() {
  document.getElementById("galleryModal").style.display = "block";
}

function closeGallery() {
  document.getElementById("galleryModal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("galleryModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
