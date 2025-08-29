const map = L.map('map').setView([24.7136, 46.6753], 13); // الموقع الافتراضي: الرياض

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 15);
      L.marker([latitude, longitude]).addTo(map).bindPopup("📍 هذا موقعك").openPopup();
    },
    err => {
      console.warn("⚠️ لم يتم السماح بالوصول للموقع، عرضنا موقع افتراضي.");
    }
  );
} else {
  console.warn("⚠️ المتصفح لا يدعم تحديد الموقع.");
}
