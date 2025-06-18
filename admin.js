// ====== CẤU HÌNH ======
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbweL4rf2TY0yco60V4xsmI4NExypm8dMCE83ilbJMUw-VruBkJRK30d3TU9vKr8y6wB/exec";  // <- THAY LINK CỦA BẠN
const IMGUR_CLIENT_ID = "546f4b9e7e2922e";  // Dùng Client ID public của Imgur (hoặc tạo mới nếu muốn)

// ====== XỬ LÝ UPLOAD & GỬI DỮ LIỆU ======
async function uploadAndSend() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const type = document.getElementById("type").value;
  const imageFile = document.getElementById("imageUpload").files[0];
  const description = document.getElementById("description").value.trim();

  if (!name || !price ||!type || !imageFile|| !description) {
    alert("Vui lòng điền đầy đủ thông tin và chọn ảnh.");
    return;
  }

  status.textContent = "⏳ Đang tải ảnh...";

  // Upload ảnh lên Imgur
  const formData = new FormData();
  formData.append("image", imageFile);

  let imageUrl = "";
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

  status.textContent = "⏳ Đang gửi dữ liệu lên Google Sheet...";

  // Gửi dữ liệu lên Google Sheet
  const payload = {
    name,
    price,
    type,
    image: imageUrl,
    description: ""  // Bạn có thể thêm ô mô tả nếu cần
  };

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.status === "success") {
      status.textContent = "✅ Đã thêm sản phẩm thành công!";
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("imageUpload").value = "";
      document.getElementById("imageUpload").value = "";
     } else {
      status.innerText = "❌ Lỗi khi gửi dữ liệu lên Google Sheet.";
    }

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Lỗi không xác định xảy ra.";
  }
}
