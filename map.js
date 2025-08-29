const map = L.map('map').setView([24.7136, 46.6753], 13); // موقع افتراضي: الرياض

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// تحديد موقع المستخدم
navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  map.setView([lat, lng], 15);
  L.marker([lat, lng]).addTo(map).bindPopup("موقعك الحالي").openPopup();
}, err => {
  console.warn("لم يتم السماح بالوصول للموقع.");
});
