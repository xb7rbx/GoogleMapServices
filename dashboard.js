const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRib2VzZm5kand4cHhra3BkbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkxNDgsImV4cCI6MjA3MjAzNTE0OH0.HdYXGpBy1E3HXieQIIuSXfjdV5q-u9qCe4AG7POKS9E';

const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);
const tableBody = document.getElementById('tableBody');

async function fetchLocations() {
  const { data, error } = await supabase.from('locations').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error('❌ خطأ في جلب البيانات:', error);
    tableBody.innerHTML = `<tr><td colspan="6" class="py-4 text-red-500">حدث خطأ أثناء جلب البيانات</td></tr>`;
    return;
  }

  if (!data.length) {
    tableBody.innerHTML = `<tr><td colspan="6" class="py-4 text-gray-500">لا توجد بيانات متاحة</td></tr>`;
    return;
  }

  data.forEach((row, index) => {
    const tr = `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2 border">${index + 1}</td>
        <td class="px-4 py-2 border">${row.device_name || '-'}</td>
        <td class="px-4 py-2 border">${row.ip || '-'}</td>
        <td class="px-4 py-2 border">
          <a href="https://www.google.com/maps?q=${row.lat},${row.lng}" target="_blank" class="text-blue-600 underline hover:text-blue-800">
            ${row.lat.toFixed(6)}, ${row.lng.toFixed(6)}
          </a>
        </td>
        <td class="px-4 py-2 border">${row.accuracy ?? '-'}</td>
        <td class="px-4 py-2 border">${new Date(row.created_at).toLocaleString()}</td>
      </tr>
    `;
    tableBody.innerHTML += tr;
  });
}

fetchLocations();
