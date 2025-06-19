// ====== CẤU HÌNH ======
const API_URL = "https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec";
const IMGUR_CLIENT_ID = "546f4b9e7e2922e";

let editingIndex = null; // Dùng để xác định sản phẩm đang sửa

// ====== TẢI DANH SÁCH SẢN PHẨM ======
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderProductList(data);
  } catch (err) {
    console.error("🔥 Lỗi khi lấy dữ liệu:", err);
    alert("❌ Không tải được dữ liệu từ Google Sheet. Vui lòng kiểm tra lại URL và quyền Web App.");
  }
}

// ====== HIỂN THỊ DANH SÁCH SẢN PHẨM ======
function renderProductList(products) {
  const container = document.getElementById("productListAdmin");
  container.innerHTML = products.map((p, i) => `
    <div class="product-item">
      <img src="${p.image || ''}" width="100" alt="Ảnh sản phẩm"><br>
      <strong>${p.name}</strong><br>
      Giá: ${p.price}<br>
      Mô tả: ${p.description}<br>
      Loại: ${p.type}<br>
      <button onclick="editProduct(${i})" class="secondary">✏️ Sửa</button>
      <button onclick="deleteProduct(${i})" class="danger">🗑️ Xóa</button>
    </div><hr>
  `).join("");
}

// ====== CHỈNH SỬA SẢN PHẨM ======
async function editProduct(index) {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const p = data[index];
    document.getElementById("name").value = p.name;
    document.getElementById("price").value = p.price;
    document.getElementById("description").value = p.description;
    document.getElementById("type").value = p.type;
    // NOTE: Ảnh cũ vẫn giữ, dùng để submit nếu không chọn ảnh mới
    document.getElementById("previewImg").src = p.image;
    document.getElementById("previewImg").style.display = p.image ? 'block' : 'none';
    editingIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error("⚠️ Lỗi editProduct:", err);
  }
}

// ====== XÓA SẢN PHẨM ======
async function deleteProduct(index) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  try {
    const res = await fetch(`${API_URL}?delete=${index}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    if (result.status === "success") {
      alert("✅ Đã xóa sản phẩm.");
      fetchProducts();
    } else {
      alert("❌ Xóa thất bại.");
    }
  } catch (err) {
    console.error("⚠️ Lỗi deleteProduct:", err);
    alert("❌ Lỗi khi xóa sản phẩm.");
  }
}

// ====== UPLOAD ẢNH & GỬI DỮ LIỆU ======
async function uploadAndSend(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const type = document.getElementById("type").value;
  const imageFile = document.getElementById("imageFile").files[0];
  const description = document.getElementById("description").value.trim();
  const status = document.getElementById("status");

  if (!name || !price || !type || !description) {
    alert("Vui lòng điền đủ thông tin.");
    return;
  }

  status.textContent = "⏳ Đang xử lý...";
  let imageUrl = document.getElementById("previewImg").src || "";

  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` },
        body: formData
      });
      const data = await res.json();
      console.log("Imgur response:", data);
      if (data.success) {
        imageUrl = data.data.link;
      } else {
        alert("❌ Upload ảnh thất bại.");
        status.textContent = "";
        return;
      }
    } catch (err) {
      console.error("⚠️ Lỗi upload ảnh:", err);
      alert("❌ Không thể upload ảnh.");
      status.textContent = "";
      return;
    }
  }

  const payload = { name, price, type, description, image: imageUrl };
  let url = API_URL + (editingIndex !== null ? `?edit=${editingIndex}` : "");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.status === "success") {
      status.textContent = editingIndex !== null ? "✅ Đã cập nhật!" : "✅ Thêm thành công!";
      editingIndex = null;
      document.getElementById("productForm").reset();
      document.getElementById("previewImg").style.display = "none";
      fetchProducts();
    } else {
      alert("❌ Lỗi lưu dữ liệu.");
    }
  } catch (err) {
    console.error("⚠️ Lỗi send data:", err);
    alert("❌ Lỗi gửi dữ liệu.");
  }
}

// ====== EVENT LISTENERS ======
document.addEventListener("DOMContentLoaded", fetchProducts);
document.getElementById("productForm").addEventListener("submit", uploadAndSend);
