// ====== CẤU HÌNH ======
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbweL4rf2TY0yco60V4xsmI4NExypm8dMCE83ilbJMUw-VruBkJRK30d3TU9vKr8y6wB/exec";
const IMGUR_CLIENT_ID = "546f4b9e7e2922e";

let editingIndex = null;

// ====== TẢI DANH SÁCH SẢN PHẨM ======
async function fetchProducts() {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    renderProductList(data);
  } catch (err) {
    alert("Lỗi tải dữ liệu từ Google Sheet.");
    console.error(err);
  }
}

// ====== HIỂN THỊ DANH SÁCH SẢN PHẨM ======
function renderProductList(products) {
  const container = document.getElementById("productListAdmin");
  container.innerHTML = "";
  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <img src="${p.image}" width="100"><br>
      <strong>${p.name}</strong><br>
      Giá: ${p.price}<br>
      Mô tả: ${p.description}<br>
      Loại: ${p.type}<br>
      <button onclick="editProduct(${i})">✏️ Sửa</button>
      <button onclick="deleteProduct(${i})">🗑️ Xóa</button>
      <hr>
    `;
    container.appendChild(div);
  });
}

// ====== CHỌN SẢN PHẨM ĐỂ SỬA ======
async function editProduct(index) {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    const p = data[index];
    document.getElementById("name").value = p.name;
    document.getElementById("price").value = p.price;
    document.getElementById("description").value = p.description;
    document.getElementById("type").value = p.type;
    editingIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
  }
}

// ====== XÓA SẢN PHẨM ======
async function deleteProduct(index) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  try {
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?delete=${index}`);
    const result = await res.json();
    if (result.status === "success") {
      alert("Đã xóa sản phẩm.");
      fetchProducts();
    }
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
  }
}

// ====== XỬ LÝ UPLOAD & GỬI DỮ LIỆU ======
async function uploadAndSend() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const type = document.getElementById("type").value;
  const imageFile = document.getElementById("imageUpload").files[0];
  const description = document.getElementById("description").value.trim();
  const status = document.getElementById("status");

  if (!name || !price || !type || !description || (!imageFile && editingIndex === null)) {
    alert("Vui lòng điền đầy đủ thông tin và chọn ảnh.");
    return;
  }

  status.textContent = "⏳ Đang xử lý...";

  let imageUrl = "";

  // Nếu thêm mới hoặc sửa nhưng có ảnh mới
  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData
      });
      const data = await res.json();
      imageUrl = data.data.link;
    } catch (err) {
      alert("❌ Lỗi tải ảnh lên Imgur.");
      return;
    }
  }

  const payload = {
    name,
    price,
    type,
    description,
    image: imageUrl
  };

  let url = GOOGLE_SCRIPT_URL;
  if (editingIndex !== null) {
    url += `?edit=${editingIndex}`;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.status === "success") {
      status.textContent = editingIndex !== null ? "✅ Đã cập nhật sản phẩm!" : "✅ Đã thêm sản phẩm!";
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("imageUpload").value = "";
      document.getElementById("description").value = "";
      document.getElementById("type").value = "";
      editingIndex = null;
      fetchProducts();
    } else {
      status.innerText = "❌ Lỗi khi gửi dữ liệu lên Google Sheet.";
    }
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Lỗi không xác định xảy ra.";
  }
}

// ====== KHỞI TẠO ======
document.addEventListener("DOMContentLoaded", fetchProducts);
