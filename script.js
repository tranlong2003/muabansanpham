// ====== DANH SÁCH SẢN PHẨM MẪU ======
const products = [
  {
    name: "iPhone 11 Pro Max 64GB",
    price: "7.500.000đ",
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

function renderProducts(filterType) {
  grid.innerHTML = "";
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  const filtered = products.filter(p => p.type === filterType);
  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>Giá: ${p.price}</p>
      <button onclick="window.open('https://zalo.me/0337457055', '_blank')">Inbox Zalo</button>
    `;
    grid.appendChild(div);
  });
}


// Lọc sản phẩm khi bấm nút
function filter(type) {
  document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderProducts(type);
}

// ====== ĐÁNH GIÁ SAO ======
let selectedRating = 0;

// Gửi đánh giá
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

// Tính trung bình đánh giá
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

// Gọi khi tải trang
renderAverageRating();
function resetRatings() {
  if (confirm("Bạn có chắc muốn xóa toàn bộ đánh giá không?")) {
    localStorage.removeItem("ratings");
    renderAverageRating();
    alert("✅ Đã reset toàn bộ đánh giá.");
  }
}
