const MONTH_THEMES = [null,'dong','xuan','xuan','xuan','ha','ha','ha','thu','thu','thu','dong','dong'];
const LEAVE_LABELS = {
  paid:'Nghỉ lễ theo quy định', compensatory:'Nghỉ bù',
  'swap-off':'Nghỉ do hoán đổi', 'swap-work':'Làm bù do hoán đổi'
};
const todayThemes = new Map();

function matchesDate(date, day, month, lunarDay) {
  const [d,m,,leap] = date.lunar ? lunarDay : [day, month];
  return !leap && m === date.month && (date.days ? date.days.includes(d) : d === date.day);
}

function insideWindow(window, day, month, lunarDay, lunarRule) {
  if (!window) return false;
  const [d,m,,leap] = lunarRule ? lunarDay : [day, month];
  if (leap) return false;
  if (window.tet) return (m === 12 && d >= 23) || (m === 1 && d <= 15);
  const value = m * 100 + d;
  const start = window.from[0] * 100 + window.from[1];
  const end = window.to[0] * 100 + window.to[1];
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
}

function solarTermOn(day, month, year) {
  const jd = jdF(day, month, year);
  const sector = instant => INT(SLo(instant) / PI * 12) % 24;
  const midnight = jd - 0.5 - TZ / 24;
  const end = sector(midnight + 1);
  return end === sector(midnight) ? null : SOLAR_TERMS[end];
}

function compareEvents(a, b) {
  return Number(b.leave === 'paid') - Number(a.leave === 'paid') || b.theme.priority - a.theme.priority;
}

function visualsOn(day, month, year) {
  const dateKey = jdF(day, month, year);
  if (todayThemes.has(dateKey)) return todayThemes.get(dateKey);
  const lunarDay = lunar(day, month, year);
  const active = EVENT_THEMES.filter(theme => !theme.fromYear || year >= theme.fromYear);
  const events = active
    .filter(theme => matchesDate(theme.rule, day, month, lunarDay)
      || (theme.period && insideWindow(theme.window, day, month, lunarDay, false)))
    .map(theme => ({theme, name:theme.name, leave:theme.paid ? 'paid' : null}));
  if (!lunarDay[3]) {
    const [ld, lm] = lunarDay;
    const next = jdD(dateKey + 1);
    const lunarTomorrow = lunar(...next);
    if (lm === 1 && ld >= 2 && ld <= 4) {
      events.push({theme:THEME_REGISTRY.tet, name:'Mùng ' + ld + ' Tết Nguyên đán', leave:null});
    } else if (lm === 12 && lunarTomorrow[0] === 1 && lunarTomorrow[1] === 1 && !lunarTomorrow[3]) {
      events.push({theme:THEME_REGISTRY.tet, name:'Giao thừa (ngày cuối năm âm)', leave:null});
    }
  }
  const datedLeave = ANNUAL_LEAVE[year]?.[day + '-' + month];
  if (datedLeave) {
    const [id, leave] = datedLeave;
    const existing = events.find(event => event.theme.id === id);
    if (existing) existing.leave = leave;
    else events.push({theme:THEME_REGISTRY[id], name:THEME_REGISTRY[id].name, leave});
  }
  events.sort(compareEvents);

  const exact = events.find(event => event.leave === 'paid') || events.find(event => event.leave !== 'swap-work');
  const extended = active.filter(theme => insideWindow(theme.window, day, month, lunarDay, theme.rule.lunar))
    .sort((a,b) => b.priority - a.priority)[0];
  const season = THEME_REGISTRY[MONTH_THEMES[month]];
  const solarTerm = solarTermOn(day, month, year);
  const theme = exact?.theme || extended || season;
  const lunarNewYear = lunarDay[2] + Number(lunarDay[1] === 12);
  const result = {theme, season, lunarDay, solarTerm, events, exact, lunarNewYear};
  if (todayThemes.size >= 512) todayThemes.delete(todayThemes.keys().next().value);
  todayThemes.set(dateKey, result);
  return result;
}

function hol(day, month, year) {
  return visualsOn(day, month, year).events
    .filter(event => event.theme.kind !== 'yt' && event.leave !== 'swap-work')
    .map(event => [event.name, ['paid','compensatory','swap-off'].includes(event.leave), event.leave]);
}
