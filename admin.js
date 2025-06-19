// ====== CẤU HÌNH ======
const API_URL = "https://script.google.com/macros/s/AKfycbwERNk5suUjA5KpJnrGieSUoTE5T6DG9wl4swHqHZ6OAakmqEiLn29NJKSZZuIkN3Mr/exec";
const IMGUR_CLIENT_ID = "546f4b9e7e2922e";

let editingIndex = null;

// ====== TẢI DANH SÁCH SẢN PHẨM ======
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderProductList(data);
  } catch (err) {
    console.error("🔥 Lỗi khi lấy dữ liệu:", err);
    alert("❌ Không tải được dữ liệu từ Google Sheet.");
  }
}

// ====== HIỂN THỊ DANH SÁCH SẢN PHẨM ======
function renderProductList(products) {
  const container = document.getElementById("productListAdmin");
  container.innerHTML = products.map((p, i) => {
    const images = Array.isArray(p.image)
      ? p.image
      : (typeof p.image === "string" ? p.image.split("|").map(x => x.trim()) : []);

    return `
      <div class="product-item">
        ${images[0] ? `<img src="${images[0]}" width="100" alt="Ảnh sản phẩm">` : ""}
        <br><strong>${p.name}</strong><br>
        Giá: ${p.price}<br>
        Mô tả: ${p.description}<br>
        Loại: ${p.type}<br>
        <button onclick="editProduct(${i})" class="secondary">✏️ Sửa</button>
        <button onclick="deleteProduct(${i})" class="danger">🗑️ Xóa</button>
      </div><hr>
    `;
  }).join("");
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

    const images = Array.isArray(p.image)
      ? p.image
      : (typeof p.image === "string" ? p.image.split("|").map(x => x.trim()) : []);

    document.getElementById("previewImg").src = images[0] || "";
    document.getElementById("previewImg").style.display = images.length ? 'block' : 'none';

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

// ====== UPLOAD NHIỀU ẢNH & GỬI DỮ LIỆU ======
async function uploadAndSend(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const type = document.getElementById("type").value;
  const files = Array.from(document.getElementById("imageFile").files);
  const description = document.getElementById("description").value.trim();
  const status = document.getElementById("status");

  if (!name || !price || !type || !description) {
    alert("Vui lòng điền đủ thông tin.");
    return;
  }

  status.textContent = "⏳ Đang xử lý...";
  let imageUrls = [];

  if (files.length > 0) {
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("https://api.imgur.com/3/image", {
          method: "POST",
          headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` },
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          imageUrls.push(data.data.link);
        }
      } catch (err) {
        console.error("❌ Lỗi upload ảnh:", err);
        alert("❌ Không thể upload ảnh. Dừng lại.");
        status.textContent = "";
        return;
      }
    }
  } else if (editingIndex !== null) {
    // Lấy ảnh cũ
    const res = await fetch(API_URL);
    const data = await res.json();
    const oldProduct = data[editingIndex];
    imageUrls = Array.isArray(oldProduct.image)
      ? oldProduct.image
      : (typeof oldProduct.image === "string" ? oldProduct.image.split("|").map(x => x.trim()) : []);
  }

  // ✅ Gửi dữ liệu
  const payload = {
    name,
    price,
    type,
    description,
    image: imageUrls.join("|") // gửi dạng chuỗi, client sẽ parse
  };

  const url = editingIndex !== null ? `${API_URL}?edit=${editingIndex}` : API_URL;

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
    console.error("⚠️ Lỗi gửi dữ liệu:", err);
    alert("❌ Gửi dữ liệu thất bại.");
  }
}

// ====== EVENT ======
document.addEventListener("DOMContentLoaded", fetchProducts);
document.getElementById("productForm").addEventListener("submit", uploadAndSend);