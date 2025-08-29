const SUPA_URL = 'https://tboesfndjwxpxkkpdllf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRib2VzZm5kand4cHhra3BkbGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTkxNDgsImV4cCI6MjA3MjAzNTE0OH0.HdYXGpBy1E3HXieQIIuSXfjdV5q-u9qCe4AG7POKS9E';

const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);

async function loadLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    alert('❌ حدث خطأ أثناء جلب البيانات');
    console.error(error);
    return;
  }

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  data.forEach((loc, index) => {
    const row = `
      <tr class="border-b hover:bg-gray-50">
        <td class="px-4 py-2 border">${index + 1}</td>
        <td class="px-4 py-2 border">${loc.latitude}</td>
        <td class="px-4 py-2 border">${loc.longitude}</td>
        <td class="px-4 py-2 border">${new Date(loc.created_at).toLocaleString()}</td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

loadLocations();
