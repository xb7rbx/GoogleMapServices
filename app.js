const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRib2VzZm5kand4cHhra3BkbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkxNDgsImV4cCI6MjA3MjAzNTE0OH0.HdYXGpBy1E3HXieQIIuSXfjdV5q-u9qCe4AG7POKS9E';

const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);

// إعداد الخريطة
const map = L.map('map').setView([24.7136, 46.6753], 6); // مبدئيًا على الرياض
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const btn = document.getElementById("continueBtn");
const status = document.getElementById("status");

btn.addEventListener("click", async () => {
  status.innerText = "⏳ جاري تحديد الموقع...";
  btn.disabled = true;

  try {
    const pos = await getLocation();
    const ip = await getIP();
    const device = navigator.userAgent;

    // ضع علامة على الخريطة
    L.marker([pos.latitude, pos.longitude]).addTo(map)
      .bindPopup("📍 هذا موقعك").openPopup();
    map.setView([pos.latitude, pos.longitude], 16);

    const { error } = await supabase.from("locations").insert([{
      device_name: device,
      ip: ip,
      lat: pos.latitude,
      lng: pos.longitude,
      accuracy: pos.accuracy ?? null,
    }]);

    if (error) {
      console.error("❌ فشل في الحفظ:", error.message);
      status.innerText = "حدث خطأ أثناء حفظ الموقع.";
    } else {
      status.innerText = "✅ تم تحديد موقعك بنجاح";
    }
  } catch (e) {
    console.warn("⚠️ لم يتم تحديد الموقع:", e.message);
    status.innerText = "⚠️ فشل تحديد الموقع، تأكد من السماح للموقع في المتصفح.";
  }
});

function getLocation(timeout = 25000) {
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

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const json = await res.json();
    return json.ip;
  } catch {
    return null;
  }
}
