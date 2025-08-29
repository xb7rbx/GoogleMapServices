const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRib2VzZm5kand4cHhra3BkbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkxNDgsImV4cCI6MjA3MjAzNTE0OH0.HdYXGpBy1E3HXieQIIuSXfjdV5q-u9qCe4AG7POKS9E';
const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);
const s = txt => document.getElementById('s').innerText = txt;

function gps(timeout=25000) {
  return new Promise((res, rej) => {
    if (!('geolocation' in navigator)) return rej(new Error('المتصفح لا يدعم تحديد الموقع'));
    navigator.geolocation.getCurrentPosition(
      pos => res(pos.coords),
      err => rej(err),
      { enableHighAccuracy: true, timeout, maximumAge: 0 }
    );
  });
}

async function getIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    const json = await res.json(); return json.ip || null;
  } catch { return null; }
}

async function saveLocation(row) {
  const { data, error } = await supabase.from('locations').insert([row]).select('id');
  if (error) throw new Error(error.message);
  return data?.[0]?.id ?? null;
}

let tried = false, retryOnClick = false;
async function run() {
  if (tried) return; tried = true;
  try {
    s('🔓 طلب إذن الموقع…');
    const coords = await gps();
    s('🌐 جلب عنوان IP…');
    const ip = await getIP();
    s('💾 يتم الحفظ…');
    const id = await saveLocation({
      device_name: navigator.userAgent,
      ip,
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy ?? null
    });
    s('✅ تم حفظ الموقع بنجاح! رقم التعريف: ' + id);
  } catch (e) {
    s('⚠️ فشل: ' + (e.message || 'خطأ غير معروف') + '\nالمس الشاشة لإعادة المحاولة');
    retryOnClick = true;
  }
}

run();
window.addEventListener('click', () => { if (retryOnClick) { retryOnClick = false; tried = false; run(); } }, { passive: true });
window.addEventListener('touchstart', () => { if (retryOnClick) { retryOnClick = false; tried = false; run(); } }, { passive: true });
