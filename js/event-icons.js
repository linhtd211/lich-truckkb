/* Tất cả ảnh là tài nguyên cùng gốc với ứng dụng, kể cả ảnh thay thế. */
const EVENT_ICON_ROOT = ART_ROOT + 'decor/';
const FALLBACK_EVENT_ICON = EVENT_ICON_ROOT + 'memo.webp';
const CUSTOM_THEME_ICONS = [
  'aids','antoan','chuthapdo','daidoanket','daithaoduong','danso','dichbenh',
  'dieuduong','doanngo','dotquy','giadinh','giangsinh','hienmau','huyetap',
  'lao','laodong','ngaysach','nhagiao','ongtao','phunuqt','phunuvn',
  'ramgieng','sotret','suame','suckhoe','tamthan','tet','tetduong',
  'thanhlapdoan','thieunhi','thuocla','timmach','trihan','ungthu','valentine',
  'vesinhtay','viemgan','vulan',
];
const EventIconRegistry = {
  ...Object.fromEntries(CUSTOM_THEME_ICONS.map(id => ['theme-'+id, ART_ROOT+'event-icons/theme-'+id+'.webp'])),
  'heritage-drum':ART_ROOT+'heritage/ngoc-lu-icon.webp',
  'heritage-tower':ART_ROOT+'heritage/thap-rua-icon.webp',
  'party-flag':ART_ROOT+'heritage/co-dang.webp',
  'vietnam-flag':ART_ROOT+'heritage/vietnam-flag.webp',
  'star-lantern':ART_ROOT+'event-icons/star-lantern.webp',
  'aid-hands':ART_ROOT+'event-icons/aid-hands.webp',
  'shield':ART_ROOT+'event-icons/shield.webp',
  'pressure-monitor':ART_ROOT+'event-icons/pressure-monitor.webp',
  'liver':ART_ROOT+'event-icons/liver.webp',
  'nursing':ART_ROOT+'event-icons/nursing.webp',
  'glucose-monitor':ART_ROOT+'event-icons/glucose-monitor.webp',
  ...Object.fromEntries(SOLAR_TERMS.map(([,id]) => ['solar-'+id, ART_ROOT+'event-icons/solar/'+id+'.webp']))
};
const LEGACY_EVENT_ICONS = new Set([
  'anatomical-heart','books','bouquet','brain','bell','candle','crescent-moon','dove',
  'drop-of-blood','fireworks','full-moon','hammer-and-wrench','handshake','health-worker',
  'herb','kite','lotus','love-letter','lungs','memo','mosquito','no-smoking','open-book',
  'red-envelope','red-heart','reminder-ribbon','rose','sheaf-of-rice','soap','stethoscope',
  'syringe','tangerine','wrapped-gift','national-park','rat','ox','tiger','cat','dragon',
  'snake','horse','goat','monkey','rooster','dog','pig'
]);
const ZODIAC_ASSETS = ['rat','ox','tiger','cat','dragon','snake','horse','goat','monkey','rooster','dog','pig'];

function iconForTheme(theme) {
  const key = 'theme-' + theme.id;
  return EventIconRegistry[key] ? key : theme.icon;
}

function EventIcon(id) {
  const url = EventIconRegistry[id]
    || (LEGACY_EVENT_ICONS.has(id) ? EVENT_ICON_ROOT + id + '.webp' : FALLBACK_EVENT_ICON);
  return `<img class="event-icon" src="${url}" data-fallback="${FALLBACK_EVENT_ICON}" width="28" height="28" alt="" aria-hidden="true" decoding="async">`;
}

document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.dataset.fallback) return;
  const fallback = image.dataset.fallback;
  delete image.dataset.fallback;
  if (image.getAttribute('src') !== fallback) {
    image.src = fallback;
    if (image.classList.contains('theme-art')) image.classList.add('theme-art-fallback');
  } else {
    image.hidden = true;
  }
}, true);
