const map = L.map('map').setView([24.7136, 46.6753], 5); // مركز السعودية

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// محاولة تحديد الموقع من المتصفح
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 13);
    L.marker([latitude, longitude]).addTo(map)
      .bindPopup('موقعك الحالي').openPopup();
  }, err => {
    console.warn("لم يتم تحديد الموقع:", err.message);
  });
}
