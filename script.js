// script.js
const sheetUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec';

document.getElementById('ratingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;

  const res = await fetch(sheetUrl, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await res.json();
  alert(result.message);
  document.getElementById('ratingForm').reset();
  loadAvgRating();
});

async function loadAvgRating() {
  const res = await fetch(sheetUrl);
  const result = await res.json();
  document.getElementById('avgRating').innerText = result.avg.toFixed(1);
}

loadAvgRating();
