// ===== SAMPLE DATA =====
const services = [
  { icon: '⚡', name: 'Electrician', desc: 'Wiring, repairs & installations' },
  { icon: '🔧', name: 'Plumber', desc: 'Pipe fitting & leak repairs' },
  { icon: '🪚', name: 'Carpenter', desc: 'Furniture & woodwork' },
  { icon: '🧹', name: 'Cleaner', desc: 'Home & office cleaning' },
  { icon: '🎨', name: 'Painter', desc: 'Interior & exterior painting' },
  { icon: '🌱', name: 'Gardener', desc: 'Lawn & garden maintenance' }
];

const workers = [
  { name: 'Ramesh Kumar', skill: 'Electrician', rating: '⭐ 4.8 (120 jobs)' },
  { name: 'Suresh Yadav', skill: 'Plumber', rating: '⭐ 4.6 (95 jobs)' },
  { name: 'Anita Devi', skill: 'Cleaner', rating: '⭐ 4.9 (210 jobs)' },
  { name: 'Manoj Singh', skill: 'Carpenter', rating: '⭐ 4.7 (80 jobs)' }
];

// ===== RENDER SERVICES =====
function renderServices() {
  const container = document.getElementById('servicesContainer');
  if (!container) return;
  container.innerHTML = services.map(s => `
    <div class="service-card" style="cursor:pointer;" onclick="goToWorkers('${s.name.toLowerCase()}')">
      <div class="icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

// Service card click — agar search box se location already set hai to wahi use karo, warna GPS
function goToWorkers(skill) {
  const lat = document.getElementById('searchLatInput')?.value;
  const lng = document.getElementById('searchLngInput')?.value;

  if (lat && lng) {
    window.location.href = `/workers/${skill}?lat=${lat}&lng=${lng}&radius=50`;
    return;
  }

  if (navigator.geolocation) {
    showToast('Using your current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.location.href = `/workers/${skill}?lat=${position.coords.latitude}&lng=${position.coords.longitude}&radius=50`;
      },
      () => {
        window.location.href = '/workers/' + skill;
      }
    );
  } else {
    window.location.href = '/workers/' + skill;
  }
}

// ===== RENDER WORKERS (home page preview) =====
function renderWorkers() {
  const container = document.getElementById('workersContainer');
  if (!container) return;
  container.innerHTML = workers.map(w => `
    <div class="worker-card">
      <div class="worker-avatar">${w.name.charAt(0)}</div>
      <h3>${w.name}</h3>
      <div class="worker-skill">${w.skill}</div>
      <div class="worker-rating">${w.rating}</div>
    </div>
  `).join('');
}

// ===== MOBILE MENU =====
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// ===== SEARCH BAR "Search" button =====
function searchService() {
  const service = document.getElementById('service').value;

  if (!service) {
    showToast('Pehle service select karo');
    return;
  }

  goToWorkers(service);
}

function showAllServices() {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function showForecast() {
  showToast('AI Forecast: Electrician demand 20% up next week');
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== MAP MODAL (Leaflet) — generalized for signup/profile/search =====
let modalMap, modalMarker, currentMapTarget;

const mapTargets = {
  signup:  { latId: 'latitudeInput', lngId: 'longitudeInput', addressId: 'addressInput', pincodeId: 'pincodeInput' },
  profile: { latId: 'latitudeInput', lngId: 'longitudeInput', addressId: 'addressInput', pincodeId: 'pincodeInput' },
  search:  { latId: 'searchLatInput', lngId: 'searchLngInput', addressId: 'searchLocationDisplay', pincodeId: null }
};

function openMapModal(target) {
  currentMapTarget = target;
  document.getElementById('mapModal').style.display = 'block';

  if (!modalMap) {
    const defaultLat = 25.5941; // Patna, default center — chaho to apne shehar ke hisaab se badal do
    const defaultLng = 85.1376;

    modalMap = L.map('modalMap').setView([defaultLat, defaultLng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(modalMap);

    modalMarker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(modalMap);

    modalMarker.on('dragend', function () {
      const pos = modalMarker.getLatLng();
      previewLocation(pos.lat, pos.lng);
    });

    modalMap.on('click', function (e) {
      modalMarker.setLatLng(e.latlng);
      previewLocation(e.latlng.lat, e.latlng.lng);
    });

    const searchInput = document.getElementById('modalSearchInput');
    let searchTimeout;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      const query = searchInput.value;
      if (query.length < 3) return;

      searchTimeout = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
          .then(res => res.json())
          .then(data => {
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              modalMap.setView([lat, lng], 15);
              modalMarker.setLatLng([lat, lng]);
              previewLocation(lat, lng);
            } else {
              showToast('Location not found');
            }
          })
          .catch(() => {});
      }, 600);
    });
  }

  // Map ka size sahi calculate ho, isliye multiple baar invalidate karo (Leaflet ka common fix)
  setTimeout(() => modalMap.invalidateSize(), 150);
  setTimeout(() => modalMap.invalidateSize(), 400);
}

function useMyLocationInModal() {
  if (!navigator.geolocation) {
    showToast('Geolocation supported nahi hai');
    return;
  }
  showToast('Detecting current location...');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      modalMap.setView([lat, lng], 15);
      modalMarker.setLatLng([lat, lng]);
      previewLocation(lat, lng);
    },
    () => showToast('Location access denied')
  );
}

function closeMapModal() {
  document.getElementById('mapModal').style.display = 'none';
}

function previewLocation(lat, lng) {
  modalMarker.selectedLat = lat;
  modalMarker.selectedLng = lng;

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
    .then(res => res.json())
    .then(data => {
      const preview = document.getElementById('modalAddressPreview');
      if (data && data.display_name) {
        preview.textContent = data.display_name;
        modalMarker.selectedAddress = data.display_name;
        modalMarker.selectedPincode = (data.address && data.address.postcode) ? data.address.postcode : '';
      }
    })
    .catch(() => {});
}

function confirmMapLocation() {
  if (!modalMarker.selectedLat) {
    alert('Pehle map pe click karke ya search karke location select karo');
    return;
  }

  const target = mapTargets[currentMapTarget];
  if (!target) return;

  document.getElementById(target.latId).value = modalMarker.selectedLat;
  document.getElementById(target.lngId).value = modalMarker.selectedLng;
  document.getElementById(target.addressId).value = modalMarker.selectedAddress || '';

  if (target.pincodeId) {
    const pincodeField = document.getElementById(target.pincodeId);
    if (pincodeField) pincodeField.value = modalMarker.selectedPincode || '';
  }

  closeMapModal();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderWorkers();

  const roleSelect = document.getElementById('roleSelect');
  const workerFields = document.getElementById('workerFields');
  if (roleSelect && workerFields) {
    roleSelect.addEventListener('change', () => {
      const isWorker = roleSelect.value === 'worker';
      workerFields.style.display = isWorker ? 'block' : 'none';

      const addressField = document.getElementById('addressInput');
      if (addressField) addressField.required = isWorker;
    });
  }
});