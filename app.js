const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);

// 🟦 جلب عنوان IP من خدمة خارجية
async function getIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (!res.ok) throw new Error("فشل في جلب IP");
    const json = await res.json();
    return json.ip;
  } catch (e) {
    console.warn("⚠️ فشل في جلب IP:", e.message);
    return null;
  }
}

// 🟨 جلب الموقع الجغرافي من المتصفح
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

// 🟩 تخزين بيانات الموقع أو استخدام IP فقط
async function storeLocation() {
  const status = document.getElementById("status");
  if (status) status.innerText = "⏳ جاري تحديد الموقع…";

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
      if (status) status.innerText = "📛 حدث خطأ في حفظ الموقع";
    } else {
      console.log("✅ تم الحفظ في قاعدة البيانات");
      if (status) status.innerText = "✅ تم تحديد الموقع بنجاح";
    }
  } catch (e) {
    console.warn("⚠️ لم يتم تحديد الموقع:", e.message);
    if (status) status.innerText = "⚠️ لم يتم تحديد الموقع، جاري تحديد المدينة حسب IP...";
    await fallbackToIP(status);
  }
}

// 🟥 حفظ IP فقط في حالة تعذر الموقع
async function fallbackToIP(status) {
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
    if (status) status.innerText = "📛 فشل الحفظ عبر IP";
  } else {
    console.log("✅ تم الحفظ باستخدام IP فقط");
    if (status) status.innerText = "✅ تم تحديد المدينة بناءً على IP";
  }
}

storeLocation();
