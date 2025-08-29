const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // اختصرته لأمانك
const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);

async function getIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const json = await res.json();
    return json.ip;
  } catch {
    return null;
  }
}

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

async function storeLocation() {
  const status = document.getElementById("status");
  status.innerText = "⏳ جاري تحديد الموقع…";

  try {
    const coords = await getLocation();
    const ip = await getIP();
    const device = navigator.userAgent;
    const { error } = await supabase.from("locations").insert([{
      device_name: device,
      ip: ip,
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy ?? null,
    }]);
    if (error) {
      console.error("📛 فشل في الحفظ:", error.message);
      status.innerText = "حدث خطأ في حفظ الموقع";
    } else {
      console.log("✅ تم الحفظ في قاعدة البيانات");
      status.innerText = "✅ تم تحديد الموقع بنجاح";
    }
  } catch (e) {
    console.warn("⚠️ لم يتم تحديد الموقع:", e.message);
    status.innerText = "⚠️ لم يتم تحديد الموقع، جاري تحديد المدينة حسب IP...";
    await fallbackToIP();
  }
}

async function fallbackToIP() {
  const ip = await getIP();
  const device = navigator.userAgent;
  const { error } = await supabase.from("locations").insert([{
    device_name: device,
    ip: ip,
    lat: null,
    lng: null,
    accuracy: null,
  }]);
  if (error) {
    console.error("📛 فشل في الحفظ عبر IP:", error.message);
    document.getElementById("status").innerText = "فشل الحفظ عبر IP";
  } else {
    console.log("✅ تم الحفظ باستخدام IP فقط");
    document.getElementById("status").innerText = "✅ تم تحديد المدينة بناءً على IP";
  }
}

storeLocation();
