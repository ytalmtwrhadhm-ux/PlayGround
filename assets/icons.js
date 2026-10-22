/* المدرّج — أيقونات ومساعدات العرض */
const ICONS = {
  home: '<path d="M3 10.2 12 3l9 7.2"/><path d="M5.5 9.4V21h13V9.4"/><path d="M9.5 21v-6h5v6"/>',
  live: '<rect x="2.5" y="6" width="19" height="12.5" rx="2.5"/><path d="M8 21h8"/><path d="M10 10.2l4.5 2.3L10 14.8z" fill="currentColor" stroke="none"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M8 3v3M16 3v3M3 9.5h18"/>',
  trophy: '<path d="M8 4h8v4.5a4 4 0 0 1-8 0V4z"/><path d="M8 5H5v1.5a3 3 0 0 0 3 3M16 5h3v1.5a3 3 0 0 1-3 3"/><path d="M12 12.5V17M8.5 20.5h7M10 17h4"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c.8-4 3.9-6.2 7.5-6.2s6.7 2.2 7.5 6.2"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M18 8.5a6 6 0 0 0-12 0c0 6-2.5 7-2.5 7h17s-2.5-1-2.5-7z"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  play: '<path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none"/>',
  volume: '<path d="M11 5 6.5 9H3v6h3.5L11 19V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M11 5 6.5 9H3v6h3.5L11 19V5z"/><path d="m16 9 5 6M21 9l-5 6"/>',
  expand: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
  pip: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><rect x="12" y="11" width="6" height="5" rx="1" fill="currentColor" stroke="none"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4"/>',
  arrow: '<path d="m15 18-6-6 6-6"/>',
  chevron: '<path d="m15 18-6-6 6-6"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10l4-3z"/>',
  yellow: '<rect x="8" y="3" width="8" height="18" rx="2" fill="currentColor" stroke="none"/>',
  red: '<rect x="8" y="3" width="8" height="18" rx="2" fill="currentColor" stroke="none"/>',
  sub: '<path d="M7 4v13M7 4 4 7M7 4l3 3"/><path d="M17 20V7M17 20l-3-3M17 20l3-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.7-3.6 3.3-5.5 6.5-5.5s5.8 1.9 6.5 5.5"/><path d="M16 5.5a3 3 0 0 1 0 6M17.5 14.8c2 .6 3.6 2.2 4 5.2"/>',
  sparkles: '<path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"/><path d="M18.5 15.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z"/>',
  trend: '<path d="m3 16 5.5-5.5 3.5 3.5L21 5"/><path d="M15 5h6v6"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.5"/><path d="M20 4v7h-7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>',
  whistle: '<path d="M14 7h7l-2.2 3.2A6.5 6.5 0 1 1 14 7z"/><circle cx="9" cy="14" r="2.2"/><path d="M15 9.5h4"/>',
  tv: '<rect x="3" y="5" width="18" height="13" rx="2.5"/><path d="M8 21h8M12 18v3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.4.4.7.8.84H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/>'
};

function icon(name, cls) {
  const body = ICONS[name] || "";
  return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    if (el.dataset.iconDone) return;
    el.innerHTML = icon(el.dataset.icon);
    el.dataset.iconDone = "1";
  });
}

function crest(teamId, size = "md", extra = "") {
  const t = TEAMS[teamId];
  if (!t) return "";
  return `<span class="crest crest--${size} ${extra}" style="--c1:${t.c1};--c2:${t.c2};--ink:${t.ink}" title="${t.name}" aria-label="${t.name}"><span>${t.abbr}</span></span>`;
}

function leagueDot(leagueId) {
  const l = LEAGUES[leagueId];
  if (!l) return "";
  return `<span class="league-dot" style="--l1:${l.c1};--l2:${l.c2}">${l.abbr}</span>`;
}

function minuteLabel(e) {
  return `${e.minute}${e.added ? "+" + e.added : ""}'`;
}

function shortStatus(l) {
  if (l.status === "finished") return "انتهت";
  if (l.status === "upcoming") return "لم تبدأ";
  return `${l.minute}'`;
}

function progressOf(l) {
  if (l.status === "finished") return 100;
  if (l.status !== "live") return 0;
  return Math.min(100, (l.minute / 90) * 100);
}

function scoreText(l) { return `${l.score[0]} - ${l.score[1]}`; }

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatStartIn(minutes) {
  if (!minutes || minutes < 0) return "قريباً";
  const h = Math.floor(minutes / 60);
  const d = Math.floor(h / 24);
  const rh = h % 24;
  const mm = minutes % 60;
  if (d > 0) return `بعد ${d} يوم${rh ? " و" + rh + " ساعة" : ""}`;
  if (h > 0) return `بعد ${h} ساعة${mm ? " و" + mm + " دقيقة" : ""}`;
  return `بعد ${mm} دقيقة`;
}

function emptyState(title, text, iconName = "info", action = "") {
  return `
    <div class="empty">
      <span class="empty__icon">${icon(iconName)}</span>
      <h3>${title}</h3>
      <p>${text}</p>
      ${action}
    </div>`;
}

function standingsTable(leagueId, highlight = []) {
  const rows = STANDINGS[leagueId] || [];
  return `<table class="standings">
    <thead><tr><th>#</th><th>الفريق</th><th>لعب</th><th>فاز</th><th>تعادل</th><th>خسر</th><th>نقاط</th></tr></thead>
    <tbody>
      ${rows.map((r, i) => `
        <tr class="${i < 4 ? "is-top" : ""} ${highlight.includes(r.team) ? "is-me" : ""}">
          <td><span class="rank">${i + 1}</span></td>
          <td><span class="team-cell">${crest(r.team, "xs")} ${TEAMS[r.team] ? TEAMS[r.team].name : r.team}</span></td>
          <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td class="pts">${r.pts}</td>
        </tr>`).join("")}
    </tbody>
  </table>`;
}
