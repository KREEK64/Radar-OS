const countrySelect = document.querySelector('#country');
const setupScreen = document.querySelector('#setup-screen');
const radarApp = document.querySelector('#radar-app');
const setupForm = document.querySelector('#setup-form');
const root = document.documentElement;
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
const regionCodes = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
regionCodes.filter(code => /^[A-Z]{2}$/.test(code)).sort((a, b) => countryNames.of(a).localeCompare(countryNames.of(b))).forEach(code => {
  const option = document.createElement('option');
  option.value = code;
  option.textContent = countryNames.of(code);
  countrySelect.append(option);
});

const centers = {
  US: [39, -98], CA: [57, -105], MX: [23, -102], BR: [-10, -52], AR: [-38, -64], CL: [-30, -71], GB: [54, -3], IE: [53, -8], FR: [46, 2], DE: [51, 10], ES: [40, -4], IT: [42, 12], NO: [64, 11], SE: [62, 15], ZA: [-30, 25], NG: [9, 8], EG: [27, 30], KE: [0, 38], IN: [22, 79], JP: [36, 138], CN: [35, 103], KR: [36, 128], AU: [-25, 133], NZ: [-41, 174]
};
const alerts = [
  ['Severe thunderstorm watch', 'Expires in 2h 14m', 'orange'],
  ['Tornado warning', 'Expires in 38m', 'red'],
  ['Large hail advisory', 'Expires in 1h 02m', 'orange'],
  ['Flash flood statement', 'Expires in 3h 20m', 'red']
];
let map;
let stormLayer;
let lightningLayer;

function countryLabel(code) { return countryNames.of(code) || 'Your region'; }
function renderAlerts() {
  document.querySelector('#alert-list').innerHTML = alerts.map(([title, time, tone]) => `<div class="alert-row"><i class="alert-dot ${tone === 'orange' ? 'orange' : ''}"></i><div><strong>${title}</strong><small>${time}</small></div><time>›</time></div>`).join('');
}
function applyTheme(theme) {
  root.classList.toggle('light', theme === 'light');
  document.querySelectorAll('[data-theme-card]').forEach(card => card.classList.toggle('selected', card.dataset.themeCard === theme));
}
function startRadar(code, theme) {
  const label = countryLabel(code);
  localStorage.setItem('stormradar-settings', JSON.stringify({ code, theme }));
  setupScreen.classList.add('hidden');
  radarApp.classList.remove('hidden');
  applyTheme(theme);
  document.querySelector('#selected-country').textContent = label;
  document.querySelector('#area-name').textContent = label;
  document.querySelector('#map-region').textContent = label;
  renderAlerts();
  setTimeout(() => initMap(code), 0);
}
function initMap(code) {
  const center = centers[code] || [20, 0];
  if (!map) {
    map = L.map('map', { zoomControl: false, minZoom: 2 }).setView(center, centers[code] ? 4 : 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    stormLayer = L.layerGroup().addTo(map);
    lightningLayer = L.layerGroup().addTo(map);
    addStorms(center);
    addLightning(center);
    wireMapControls();
  } else {
    map.setView(center, centers[code] ? 4 : 2);
    addStorms(center);
    addLightning(center);
  }
  updateLayers();
}
function addStorms(center) {
  stormLayer.clearLayers();
  const offsets = [[3, 4], [-2, 7], [5, -5], [-4, -4], [1, -9], [7, 1]];
  offsets.forEach((offset, index) => {
    const marker = L.marker([center[0] + offset[0], center[1] + offset[1]], { icon: L.divIcon({ className: 'storm-marker-wrap', html: '<div class="storm-marker"></div>', iconSize: [50, 50], iconAnchor: [25, 25] }) });
    marker.on('click', () => openStorm(index));
    marker.addTo(stormLayer);
  });
}
function addLightning(center) {
  lightningLayer.clearLayers();
  [[2, 3], [4, 5], [-1, 6], [-3, -3], [6, -2], [0, -8], [3, -5]].forEach((offset, index) => {
    L.circleMarker([center[0] + offset[0], center[1] + offset[1]], { radius: index % 2 ? 3 : 4, color: '#d9f36d', fillColor: '#fff29b', fillOpacity: 1, weight: 1 }).addTo(lightningLayer);
  });
}
function openStorm(index) {
  const names = ['Storm cell A-17', 'Storm cell C-04', 'Storm cell B-22', 'Storm cell F-09', 'Storm cell D-31', 'Storm cell E-12'];
  document.querySelector('#storm-name').textContent = names[index];
  document.querySelector('#storm-intensity').textContent = `${54 + index * 3} dBZ`;
  document.querySelector('#storm-hail').textContent = index % 2 ? 'High' : 'Moderate';
  document.querySelector('#detail-drawer').classList.add('open');
}
function updateLayers() {
  if (!map) return;
  const radarOn = document.querySelector('#radar-layer').checked;
  const lightningOn = document.querySelector('#lightning-layer').checked;
  radarOn ? stormLayer.addTo(map) : map.removeLayer(stormLayer);
  lightningOn ? lightningLayer.addTo(map) : map.removeLayer(lightningLayer);
}
function wireMapControls() {
  document.querySelector('#zoom-in').onclick = () => map.zoomIn();
  document.querySelector('#zoom-out').onclick = () => map.zoomOut();
  document.querySelector('#recenter').onclick = () => map.setView(centers[localStorage.getItem('stormradar-settings') ? JSON.parse(localStorage.getItem('stormradar-settings')).code : 'US'] || [20, 0], 4);
  document.querySelector('#drawer-close').onclick = () => document.querySelector('#detail-drawer').classList.remove('open');
  document.querySelector('#radar-layer').onchange = updateLayers;
  document.querySelector('#lightning-layer').onchange = updateLayers;
  document.querySelector('#reset-layers').onclick = () => { document.querySelector('#radar-layer').checked = true; document.querySelector('#lightning-layer').checked = true; document.querySelector('#wind-layer').checked = false; updateLayers(); };
  document.querySelector('#theme-toggle').onclick = () => { const next = root.classList.contains('light') ? 'dark' : 'light'; applyTheme(next); const saved = JSON.parse(localStorage.getItem('stormradar-settings') || '{}'); saved.theme = next; localStorage.setItem('stormradar-settings', JSON.stringify(saved)); };
  document.querySelector('#location-button').onclick = () => { radarApp.classList.add('hidden'); setupScreen.classList.remove('hidden'); countrySelect.value = JSON.parse(localStorage.getItem('stormradar-settings') || '{}').code || ''; };
}
document.querySelectorAll('input[name="theme"]').forEach(input => input.addEventListener('change', event => applyTheme(event.target.value)));
setupForm.addEventListener('submit', event => { event.preventDefault(); startRadar(countrySelect.value, document.querySelector('input[name="theme"]:checked').value); });
const saved = JSON.parse(localStorage.getItem('stormradar-settings') || 'null');
if (saved && saved.code) startRadar(saved.code, saved.theme || 'dark');
