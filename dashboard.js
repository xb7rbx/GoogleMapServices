const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRib2VzZm5kand4cHhra3BkbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkxNDgsImV4cCI6MjA3MjAzNTE0OH0.HdYXGpBy1E3HXieQIIuSXfjdV5q-u9qCe4AG7POKS9E';
const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);

async function loadLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    alert('حدث خطأ أثناء تحميل البيانات');
    console.error(error);
    return;
  }

  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  data.forEach((row, index) => {
    const tr = `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2 border">${index + 1}</td>
        <td class="px-4 py-2 border">${row.device_name || '-'}</td>
        <td class="px-4 py-2 border">${row.ip || '-'}</td>
        <td class="px-4 py-2 border">${row.lat}</td>
        <td class="px-4 py-2 border">${row.lng}</td>
        <td class="px-4 py-2 border">${row.accuracy ?? '-'}</td>
        <td class="px-4 py-2 border">${new Date(row.created_at).toLocaleString()}</td>
      </tr>
    `;
    tbody.innerHTML += tr;
  });
}

loadLocations();
