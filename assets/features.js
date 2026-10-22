/* المدرّج — البث المباشر، البحث، النوافذ، والمشغّل المصغّر */

function toast(message, type = "info", iconName = "check") {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.innerHTML = `<span class="toast__icon">${icon(iconName)}</span><span>${message}</span>`;
  root.appendChild(el);
  setTimeout(() => {
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

function notifyDot(show) {
  const dot = document.getElementById("notif-dot");
  if (dot) dot.hidden = !show;
}

/* ------------------------------------------------------------ live engine */
function currentMatchId() {
  return state.route.name === "match" ? state.route.id : null;
}

function commentMarkup(c) {
  return `<div class="comment is-new"><span class="comment__min">${c.minute}'</span><p>${c.text}</p></div>`;
}

const LIVE_LINES = [
  (m) => `${TEAMS[m.home].short} يضغط عالياً ويحاول فرض إيقاعه في منتصف الملعب.`,
  (m) => `فرصة! كرة عرضية من ${TEAMS[m.away].short} تمر أمام المرمى دون متابعة.`,
  (m) => `تبادل سريع للكرة بين لاعبي ${TEAMS[m.home].short} وسط تصفيق الجمهور.`,
  (m) => `الحكم يطلب لعباً سريعاً بعد توقف قصير بسبب تدخل في المنتصف.`,
  (m) => `${TEAMS[m.away].short} يعيد تنظيم صفوفه دفاعياً بعد دقائق من الضغط.`,
  (m) => `تسديدة من خارج المنطقة تمر فوق العارضة بقليل.`,
  (m) => `البدلاء يبدأون الإحماء على الخط الجانبي استعداداً لأي تغيير.`,
  (m) => `استحواذ هادئ الآن، والفريقان يحاولان استغلال أي خطأ.`,
  (m) => `كرة ثابتة خطيرة! الحائط البشري يبعد الكرة إلى الركنية.`,
  (m) => `تدخل قوي في منتصف الملعب والحكم يكتفي بالتحذير الشفهي.`
];

function addCommentary() {
  MATCHES.forEach((m) => {
    const l = state.live[m.id];
    if (!l || l.status !== "live") return;
    const line = LIVE_LINES[Math.floor(Math.random() * LIVE_LINES.length)](m);
    const item = { minute: l.minute, text: line };
    l.commentary.unshift(item);
    if (l.commentary.length > 16) l.commentary.pop();
    if (currentMatchId() === m.id && state.matchTab === "flow") {
      const list = document.getElementById("commentary-list");
      if (list) {
        list.insertAdjacentHTML("afterbegin", commentMarkup(item));
        while (list.children.length > 12) list.lastElementChild.remove();
      }
    }
  });
}

function finishMatch(m, l) {
  if (l.status === "finished") return;
  l.status = "finished";
  l.minute = 90;
  l.commentary.unshift({
    minute: 90,
    text: `صافرة النهاية! ${TEAMS[m.home].short} ${l.score[0]} - ${l.score[1]} ${TEAMS[m.away].short} في مباراة مليئة بالإثارة.`
  });
  toast(`انتهت المباراة · ${TEAMS[m.home].short} ${l.score[0]} - ${l.score[1]} ${TEAMS[m.away].short}`, "goal", "whistle");
  notifyDot(true);
  if (currentMatchId() === m.id) render();
  updateMini();
}

function applyLiveEvent(m, l, ev, idx) {
  l.processed.add(idx);
  if (ev.type === "end") {
    finishMatch(m, l);
    return;
  }
  const event = { ...ev };
  l.events.push(event);
  if (ev.score) l.score = [...ev.score];

  let message = "";
  let tone = "info";
  let iconName = "check";
  if (ev.type === "goal") {
    message = `هدف! ${ev.player} · ${TEAMS[m.home].short} ${l.score[0]} - ${l.score[1]} ${TEAMS[m.away].short}`;
    tone = "goal";
    iconName = "ball";
  } else if (ev.type === "red") {
    message = `بطاقة حمراء! ${ev.player} · ${TEAMS[m[ev.team]].short}`;
    tone = "red";
    iconName = "red";
  } else if (ev.type === "yellow") {
    message = `بطاقة صفراء لـ ${ev.player} · ${TEAMS[m[ev.team]].short}`;
    iconName = "yellow";
  } else if (ev.type === "sub") {
    message = `تبديل في ${TEAMS[m[ev.team]].short}: ${ev.player}`;
    iconName = "sub";
  }

  const line = ev.type === "goal"
    ? `هدف! ${ev.player} يهز الشباك${ev.assist ? ` بعد تمريرة من ${ev.assist}` : ""}. النتيجة ${l.score[0]} - ${l.score[1]}.`
    : ev.type === "red"
      ? `بطاقة حمراء مباشرة لـ ${ev.player} بعد ${ev.detail}.`
      : ev.type === "yellow"
        ? `إنذار لـ ${ev.player}: ${ev.detail}.`
        : `تبديل: ${ev.player} يدخل بدلاً من ${ev.detail.replace("بدلاً من ", "")}.`;
  l.commentary.unshift({ minute: l.minute, text: line });

  if (message) toast(message, tone, iconName);
  notifyDot(true);

  if (currentMatchId() === m.id) {
    updateLiveDom();
    renderMatchContent(m);
  } else {
    updateLiveDom();
  }
  updateMini();
}

function tickLive() {
  MATCHES.forEach((m) => {
    if (m.status !== "live") return;
    const l = state.live[m.id];
    if (!l || l.status !== "live") return;

    if (l.minute < 90) l.minute += 1;

    (m.future || []).forEach((ev, idx) => {
      if (!l.processed.has(idx) && l.minute >= ev.minute) applyLiveEvent(m, l, ev, idx);
    });

    if (l.status === "live" && l.minute >= 90) finishMatch(m, l);
  });

  updateLiveDom();
  state.tickCount += 1;
  if (state.tickCount % 3 === 0) addCommentary();

  const liveCount = MATCHES.filter((m) => getLive(m).status === "live").length;
  const liveCountEl = document.getElementById("live-count");
  if (liveCountEl) liveCountEl.textContent = String(liveCount);
}

function updateLiveDom() {
  document.querySelectorAll("[data-minute-for]").forEach((el) => {
    const m = matchById(el.dataset.minuteFor);
    if (!m) return;
    const l = getLive(m);
    el.textContent = shortStatus(l);
    const pill = el.closest(".minute-pill");
    if (pill) pill.classList.toggle("is-done", l.status === "finished");
  });
  document.querySelectorAll("[data-score-for]").forEach((el) => {
    const m = matchById(el.dataset.scoreFor);
    if (!m) return;
    el.textContent = scoreText(getLive(m));
  });
  document.querySelectorAll("[data-team-score]").forEach((el) => {
    const [id, side] = el.dataset.teamScore.split(":");
    const m = matchById(id);
    if (!m) return;
    const l = getLive(m);
    el.textContent = l.score[side === "home" ? 0 : 1];
  });
  document.querySelectorAll("[data-progress-for]").forEach((el) => {
    const m = matchById(el.dataset.progressFor);
    if (!m) return;
    el.style.width = `${progressOf(getLive(m))}%`;
  });
}

/* ------------------------------------------------------------ stage */
function renderStage(m) {
  const wrap = document.getElementById("stage-wrap");
  if (!wrap) return;
  wrap.innerHTML = videoStage(m);
  hydrateIcons(wrap);
  mountCanvas(m);
}

function renderMatchContent(m) {
  const tabs = document.querySelector(".tabs");
  if (tabs) tabs.outerHTML = matchTabs(m);
  const inner = document.getElementById("match-content-inner");
  if (inner) inner.innerHTML = matchTabBody(m);
}

/* ------------------------------------------------------------ search */
function openSearch() {
  state.searchOpen = true;
  const root = document.getElementById("search-root");
  root.innerHTML = `
    <div class="search-backdrop" data-action="close-search">
      <div class="search-panel" role="dialog" aria-label="البحث">
        <div class="search-field">
          ${icon("search")}
          <input id="search-input" type="search" placeholder="ابحث عن فريق، لاعب، أو بطولة…" autocomplete="off" />
          <kbd>Esc</kbd>
        </div>
        <div class="search-results" id="search-results"></div>
      </div>
    </div>`;
  document.body.style.overflow = "hidden";
  renderSearchResults("");
  setTimeout(() => {
    const input = document.getElementById("search-input");
    if (input) input.focus();
  }, 40);
}

function closeSearch() {
  state.searchOpen = false;
  const root = document.getElementById("search-root");
  if (root) root.innerHTML = "";
  if (!state.modalOpen) document.body.style.overflow = "";
}

function renderSearchResults(query) {
  const root = document.getElementById("search-results");
  if (!root) return;
  const term = query.trim().toLowerCase();
  const matchTerm = (m) => {
    const hay = [
      TEAMS[m.home].name, TEAMS[m.away].name, LEAGUES[m.league].name,
      m.round, m.channel, m.venue, m.city
    ].join(" ").toLowerCase();
    return hay.includes(term);
  };

  const matches = MATCHES.filter((m) => !term || matchTerm(m)).slice(0, 6);
  let players = [];
  if (term) {
    const seen = new Set();
    MATCHES.forEach((m) => {
      if (!m.lineups) return;
      ["home", "away"].forEach((side) => {
        m.lineups[side].players.concat(m.lineups[side].bench).forEach((p) => {
          if (seen.has(p.full)) return;
          if (p.full.toLowerCase().includes(term) || p.name.toLowerCase().includes(term)) {
            seen.add(p.full);
            players.push({ full: p.full, name: p.full, team: m[side], pos: p.pos, rating: p.rating, match: m.id, side });
          }
        });
      });
    });
    players = players.slice(0, 8);
  } else {
    players = STARS.slice(0, 4).map((s) => {
      const found = findPlayerByName(s.name);
      return {
        full: s.name, name: s.name, team: s.team, pos: s.tag,
        rating: s.rating, match: found ? found.m.id : "", side: found ? found.side : ""
      };
    });
  }

  if (!matches.length && !players.length) {
    root.innerHTML = `<div class="search-empty">لا توجد نتائج لـ «${query}». جرّب اسم فريق أو لاعب آخر.</div>`;
    return;
  }

  const matchItems = matches.map((m) => {
    const l = getLive(m);
    return `
      <button class="search-item" data-action="search-match" data-match="${m.id}">
        <span style="display:flex;align-items:center;gap:3px">${crest(m.home, "xs")}${crest(m.away, "xs")}</span>
        <span class="search-item__text"><b>${TEAMS[m.home].short} × ${TEAMS[m.away].short}</b><span>${LEAGUES[m.league].name} · ${m.round}</span></span>
        <span class="search-item__meta">${l.status === "live" ? l.minute + "'" : l.status === "finished" ? "انتهت" : m.kickoff}</span>
      </button>`;
  }).join("");

  const playerItems = players.map((p) => `
    <button class="search-item" data-action="player" data-match="${p.match}" data-side="${p.side}" data-name="${p.full}">
      ${crest(p.team, "xs")}
      <span class="search-item__text"><b>${p.full}</b><span>${TEAMS[p.team].name} · ${p.pos}</span></span>
      <span class="search-item__meta">${Number(p.rating).toFixed(1)}</span>
    </button>`).join("");

  root.innerHTML = `
    ${matches.length ? `<p class="search-group__label">${term ? "المباريات" : "مباريات مقترحة"}</p>${matchItems}` : ""}
    ${players.length ? `<p class="search-group__label">${term ? "اللاعبون" : "نجوم للمتابعة"}</p>${playerItems}` : ""}`;
}

/* ------------------------------------------------------------ player modal */
function findPlayerByName(name) {
  for (const m of MATCHES) {
    if (!m.lineups) continue;
    for (const side of ["home", "away"]) {
      const p = m.lineups[side].players.concat(m.lineups[side].bench).find((x) => x.full === name);
      if (p) return { m, side, player: p };
    }
  }
  return null;
}

const POS_LABELS = {
  GK: "حارس مرمى", RB: "ظهير أيمن", LB: "ظهير أيسر", CB: "قلب دفاع",
  DM: "وسط مدافع", CM: "وسط ملعب", AM: "صانع ألعاب", RW: "جناح أيمن",
  LW: "جناح أيسر", RM: "وسط أيمن", LM: "وسط أيسر", ST: "مهاجم",
  DF: "مدافع", MF: "وسط", FW: "مهاجم"
};

function hashName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 100000;
  return h;
}

function statsForPlayer(p) {
  const seed = hashName(p.full);
  return {
    passes: 22 + (seed % 46),
    shots: seed % 6,
    tackles: 1 + (seed % 6),
    duels: 38 + (seed % 48),
    distance: (8.6 + (seed % 26) / 10).toFixed(1),
    keyPasses: seed % 5
  };
}

function openPlayerModal(matchId, side, fullName) {
  let match = matchById(matchId);
  let player = null;
  let playerSide = side;
  if (match && match.lineups && match.lineups[side]) {
    const lineup = match.lineups[side];
    player = lineup.players.concat(lineup.bench).find((p) => p.full === fullName) || null;
  }
  if (!player) {
    const found = findPlayerByName(fullName);
    if (found) {
      match = found.m;
      player = found.player;
      playerSide = found.side;
    }
  }
  if (!match || !player) return;

  const team = TEAMS[match[playerSide]];
  const cards = cardsFor(match, playerSide, player.full);
  const l = getLive(match);
  const goals = (l.events || []).filter((e) => e.team === playerSide && e.player === player.full && e.type === "goal").length;
  const assists = (l.events || []).filter((e) => e.assist === player.full).length;
  const s = statsForPlayer(player);
  const followed = state.followed.has(player.full);

  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="player-modal" role="dialog" aria-modal="true" aria-label="${player.full}">
        <div class="player-modal__hero" style="--c1:${team.c1};--c2:${team.c2}">
          <button class="player-modal__close" data-action="close-modal" aria-label="إغلاق">${icon("close")}</button>
          <div class="player-modal__id">
            <div class="player-modal__num" style="--c1:${team.c1};--c2:${team.c2};--ink:${team.ink}">${player.n}</div>
            <div>
              <h3>${player.full}</h3>
              <p>${team.name} · ${POS_LABELS[player.pos] || player.pos}</p>
            </div>
            <div class="player-modal__rating">
              <div class="rating-ring" style="--r:${Math.round(player.rating * 10)}"><b>${player.rating.toFixed(1)}</b></div>
              <span>التقييم</span>
            </div>
          </div>
        </div>
        <div class="player-modal__body">
          <div class="player-cards-row">
            ${cards.red
              ? `<span class="badge" style="background:var(--red-soft);color:var(--red)">${icon("red")} بطاقة حمراء</span>`
              : cards.yellow
                ? `<span class="badge badge--gold">${icon("yellow")} بطاقة صفراء${cards.yellow > 1 ? " ×" + cards.yellow : ""}</span>`
                : `<span class="badge">${icon("shield")} بدون بطاقات</span>`}
            ${goals ? `<span class="badge badge--accent">${icon("ball")} ${goals} هدف</span>` : ""}
            ${assists ? `<span class="badge badge--accent">${icon("trend")} ${assists} صناعة</span>` : ""}
            <span class="badge">${crest(team.id, "xs")} ${team.short}</span>
          </div>
          <div class="player-stat-grid">
            <div class="player-stat"><b>${s.passes}</b><span>تمريرة</span></div>
            <div class="player-stat"><b>${s.shots}</b><span>تسديدة</span></div>
            <div class="player-stat"><b>${s.tackles}</b><span>تدخل ناجح</span></div>
            <div class="player-stat"><b>${s.duels}%</b><span>صراعات</span></div>
            <div class="player-stat"><b>${s.distance}</b><span>كم جرى</span></div>
            <div class="player-stat"><b>${s.keyPasses}</b><span>تمريرة مفتاحية</span></div>
          </div>
          <div class="player-modal__actions">
            <button class="btn ${followed ? "btn--soft" : "btn--primary"}" data-action="follow" data-name="${player.full}">
              ${icon(followed ? "check" : "plus")} ${followed ? "متابَع" : "متابعة اللاعب"}
            </button>
            <a class="btn btn--soft" href="#/match/${match.id}" data-action="close-modal">${icon("live")} صفحة المباراة</a>
          </div>
        </div>
      </div>
    </div>`;
  state.modalOpen = true;
  document.body.style.overflow = "hidden";
}

function openStarModal(name) {
  const star = STARS.find((s) => s.name === name);
  const found = findPlayerByName(name);
  if (found) {
    openPlayerModal(found.m.id, found.side, name);
    return;
  }
  if (!star) return;
  const team = TEAMS[star.team];
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="player-modal" role="dialog" aria-modal="true">
        <div class="player-modal__hero" style="--c1:${team.c1};--c2:${team.c2}">
          <button class="player-modal__close" data-action="close-modal" aria-label="إغلاق">${icon("close")}</button>
          <div class="player-modal__id">
            <div class="player-modal__num" style="--c1:${team.c1};--c2:${team.c2};--ink:${team.ink}">${initials(star.name)}</div>
            <div><h3>${star.name}</h3><p>${team.name} · ${star.tag}</p></div>
            <div class="player-modal__rating">
              <div class="rating-ring" style="--r:${Math.round(star.rating * 10)}"><b>${star.rating.toFixed(1)}</b></div>
              <span>التقييم</span>
            </div>
          </div>
        </div>
        <div class="player-modal__body">
          <div class="player-stat-grid">
            <div class="player-stat"><b>${star.goals}</b><span>هدف</span></div>
            <div class="player-stat"><b>${star.assists}</b><span>صناعة</span></div>
            <div class="player-stat"><b>${star.rating.toFixed(1)}</b><span>التقييم</span></div>
          </div>
          <div class="player-modal__actions">
            <button class="btn ${state.followed.has(star.name) ? "btn--soft" : "btn--primary"}" data-action="follow" data-name="${star.name}">
              ${icon(state.followed.has(star.name) ? "check" : "plus")} ${state.followed.has(star.name) ? "متابَع" : "متابعة اللاعب"}
            </button>
            <button class="btn btn--soft" data-action="close-modal">إغلاق</button>
          </div>
        </div>
      </div>
    </div>`;
  state.modalOpen = true;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const root = document.getElementById("modal-root");
  if (root) root.innerHTML = "";
  state.modalOpen = false;
  if (!state.searchOpen) document.body.style.overflow = "";
}

function toggleFollow(name) {
  if (state.followed.has(name)) state.followed.delete(name);
  else state.followed.add(name);
  writeStore("madraj-followed", [...state.followed]);
  const followed = state.followed.has(name);
  document.querySelectorAll('[data-action="follow"]').forEach((btn) => {
    if (btn.dataset.name !== name) return;
    btn.className = `btn ${followed ? "btn--soft" : "btn--primary"}`;
    btn.innerHTML = `${icon(followed ? "check" : "plus")} ${followed ? "متابَع" : "متابعة اللاعب"}`;
  });
  toast(followed ? `تتابع الآن ${name}` : `تمت إزالة ${name} من المتابعة`, "info", followed ? "check" : "info");
}

/* ------------------------------------------------------------ mini player */
function updateMini() {
  const root = document.getElementById("mini-player");
  if (!root) return;
  const m = state.miniMatch ? matchById(state.miniMatch) : null;
  if (!m || state.route.name === "match") {
    root.hidden = true;
    root.innerHTML = "";
    return;
  }
  const l = getLive(m);
  root.hidden = false;
  root.innerHTML = `
    <div class="mini-player__canvas">
      <div class="mini-ball"></div>
      <div class="mini-player__top">
        <span class="badge badge--live"><i></i> ${l.status === "live" ? "مباشر" : l.status === "finished" ? "انتهت" : "قريباً"}</span>
        <button class="ctrl-btn" data-action="mini-close" aria-label="إغلاق الشاشة المصغرة">${icon("close")}</button>
      </div>
      <div class="mini-player__score">
        ${crest(m.home, "xs")}
        <span>${l.status === "upcoming" ? "VS" : scoreText(l)}</span>
        ${crest(m.away, "xs")}
      </div>
    </div>
    <div class="mini-player__bar">
      <b>${TEAMS[m.home].short} × ${TEAMS[m.away].short}</b>
      <span>${shortStatus(l)}</span>
      <span class="stage-controls__spacer" style="flex:1"></span>
      <a class="ctrl-btn" href="#/match/${m.id}" aria-label="فتح المباراة">${icon("expand")}</a>
    </div>`;
}

/* ------------------------------------------------------------ polling */
function togglePoll(matchId, index) {
  const m = matchById(matchId);
  if (!m) return;
  if (state.votes[matchId] != null) {
    toast("لقد صوّت مسبقاً في هذه المباراة", "info", "check");
    return;
  }
  state.votes[matchId] = Number(index);
  writeStore("madraj-votes", state.votes);
  const rail = document.getElementById("match-rail");
  if (rail) {
    rail.innerHTML = matchRail(m);
    syncFavoriteButtons();
    syncReminderButtons();
  }
  toast("تم احتساب صوتك · شكراً لمشاركتك", "goal", "check");
}
