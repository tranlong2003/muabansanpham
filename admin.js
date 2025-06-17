// admin.js
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const type = document.getElementById("type").value;
  const imageFile = document.getElementById("image").files[0];

  const reader = new FileReader();
  reader.onload = function () {
    const newProduct = {
      name,
      price,
      image: reader.result, // base64 ảnh
      type
    };

    let products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    alert("✅ Đã thêm sản phẩm!");
    document.getElementById("productForm").reset();
  };
  reader.readAsDataURL(imageFile);
});
