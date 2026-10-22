/* المدرّج — قوالب الواجهات */

function statusPill(m) {
  const l = getLive(m);
  if (l.status === "live") {
    return `<span class="minute-pill"><i></i><span data-minute-for="${m.id}">${l.minute}'</span></span>`;
  }
  if (l.status === "finished") {
    return `<span class="minute-pill is-done"><span>انتهت</span></span>`;
  }
  return `<span class="badge badge--blue">${icon("clock")} ${m.dateLabel} · ${m.kickoff}</span>`;
}

function heroTeam(m, side) {
  const team = TEAMS[m[side]];
  const goals = scorers(m, side);
  return `
    <div class="hero-team">
      ${crest(team.id, "xl")}
      <div class="hero-team__name">${team.name}</div>
      <div class="hero-team__goals">
        ${goals.length
          ? goals.slice(0, 2).map((g) => `<span>${icon("ball")} ${g.player} ${minuteLabel(g)}</span>`).join("")
          : `<span style="opacity:.45">لم يسجل بعد</span>`}
      </div>
    </div>`;
}

function hero(m) {
  const l = getLive(m);
  const league = LEAGUES[m.league];
  const stats = m.stats || { possession: [50, 50], shots: [0, 0], xg: [0, 0] };
  return `
  <section class="hero fade-up">
    <div class="hero__bg" aria-hidden="true"></div>
    <div class="hero__inner">
      <div class="hero__top">
        ${l.status === "live"
          ? `<span class="badge badge--live"><i></i> مباشر الآن</span>`
          : `<span class="badge">${icon("clock")} ${m.dateLabel} · ${m.kickoff}</span>`}
        <span class="badge">${league.name} · ${m.round}</span>
        <span class="badge badge--gold">${icon("sparkles")} ${m.quality}</span>
        <span class="hero__top-spacer"></span>
        <span class="hero__viewers">${icon("eye")} ${m.viewers} يشاهدون</span>
        <button class="fav-btn ${state.favorites.has(m.id) ? "is-active" : ""}" data-action="favorite" data-match="${m.id}" aria-label="أضف للمفضلة">${icon("star")}</button>
      </div>

      <div class="hero__match">
        ${heroTeam(m, "home")}
        <div class="hero-score">
          <div class="hero-score__num"><span data-score-for="${m.id}">${scoreText(l)}</span></div>
          <div class="hero-score__min"><i></i><span data-minute-for="${m.id}">${shortStatus(l)}</span></div>
          <div class="hero-score__venue">${m.venue} · ${m.city}</div>
        </div>
        ${heroTeam(m, "away")}
      </div>

      <div class="hero__actions">
        <a class="btn btn--primary" href="#/match/${m.id}">${icon("play")} شاهد الآن</a>
        <button class="btn btn--ghost" data-action="pip" data-match="${m.id}">${icon("pip")} شاشة مصغرة</button>
      </div>

      <div class="hero__stats">
        <div class="hero-stat"><strong>${stats.possession[0]}%</strong><span>استحواذ ${TEAMS[m.home].short}</span></div>
        <div class="hero-stat"><strong>${stats.shots[0]} - ${stats.shots[1]}</strong><span>التسديدات</span></div>
        <div class="hero-stat"><strong>${stats.xg ? stats.xg[0].toFixed(2) + " - " + stats.xg[1].toFixed(2) : "—"}</strong><span>الأهداف المتوقعة xG</span></div>
      </div>
    </div>
  </section>`;
}

function matchCard(m) {
  const l = getLive(m);
  const league = LEAGUES[m.league];
  const live = l.status === "live";
  const finished = l.status === "finished";
  return `
  <article class="match-card">
    <div class="match-card__top">
      <div class="match-card__league">${leagueDot(m.league)} ${league.name}</div>
      ${statusPill(m)}
    </div>
    <div class="match-card__teams">
      ${["home", "away"].map((side) => {
        const team = TEAMS[m[side]];
        const score = l.status === "upcoming"
          ? `<span class="match-card__team-score is-dim">—</span>`
          : `<span class="match-card__team-score" data-team-score="${m.id}:${side}">${l.score[side === "home" ? 0 : 1]}</span>`;
        return `<div class="match-card__team">${crest(team.id, "sm")}<span class="match-card__team-name">${team.name}</span>${score}</div>`;
      }).join("")}
    </div>
    <div class="match-card__bar"><i data-progress-for="${m.id}" style="width:${progressOf(l)}%"></i></div>
    <div class="match-card__foot">
      <div class="match-card__meta">
        <b>${live ? `${m.quality} · ${m.channel}` : finished ? "انتهت المباراة" : `${m.dateLabel} · ${m.kickoff}`}</b>
        <span>${live ? `${m.viewers} يشاهدون` : finished ? "الإعادة متاحة الآن" : formatStartIn(m.startIn)}</span>
      </div>
      <button class="fav-btn ${state.favorites.has(m.id) ? "is-active" : ""}" data-action="favorite" data-match="${m.id}" aria-label="أضف للمفضلة">${icon("star")}</button>
      <a class="watch-btn" href="#/match/${m.id}">${icon(live ? "play" : finished ? "refresh" : "info")} ${live ? "شاهد" : finished ? "الإعادة" : "التفاصيل"}</a>
    </div>
  </article>`;
}

function matchRow(m) {
  const l = getLive(m);
  const live = l.status === "live";
  const finished = l.status === "finished";
  const reminded = state.reminders.has(m.id);
  return `
  <div class="match-row">
    <div class="match-row__time">
      ${live
        ? `<b style="color:var(--red)">${l.minute}'</b><span>مباشر</span>`
        : finished
          ? `<b>FT</b><span>${m.dateLabel}</span>`
          : `<b>${m.kickoff}</b><span>${m.dateLabel}</span>`}
    </div>
    <div class="match-row__teams">
      ${["home", "away"].map((side) => {
        const team = TEAMS[m[side]];
        const idx = side === "home" ? 0 : 1;
        const winner = finished && l.score[idx] > l.score[side === "home" ? 1 : 0];
        const val = l.status === "upcoming" ? "" : `<b>${l.score[idx]}</b>`;
        return `<div class="match-row__team ${finished && !winner ? "is-loser" : ""}">${crest(team.id, "xs")}<span>${team.name}</span>${val}</div>`;
      }).join("")}
    </div>
    <div class="match-row__actions">
      <span class="badge">${LEAGUES[m.league].abbr}</span>
      ${l.status === "upcoming"
        ? `<button class="remind-btn ${reminded ? "is-active" : ""}" data-action="remind" data-match="${m.id}" aria-label="تذكير">${icon("bell")}<span>${reminded ? "مفعّل" : "تذكير"}</span></button>`
        : ""}
      <a class="watch-btn" href="#/match/${m.id}">${icon(live ? "play" : finished ? "refresh" : "info")} <span>${live ? "شاهد" : finished ? "الإعادة" : "معاينة"}</span></a>
    </div>
  </div>`;
}

function starCard(s) {
  const team = TEAMS[s.team];
  return `
  <button class="star-card" data-action="star" data-star="${s.name}">
    <span class="star-avatar" style="--c1:${team.c1};--c2:${team.c2}" data-rating="${s.rating}">${initials(s.name)}</span>
    <span class="star-info">
      <b>${s.name}</b>
      <span>${team.name} · ${s.tag}</span>
      <span><em>${s.goals}</em> هدف · ${s.assists} صناعة</span>
    </span>
    ${crest(team.id, "sm", "star-team")}
  </button>`;
}

function leagueCard(l) {
  const count = MATCHES.filter((m) => m.league === l.id).length;
  return `
  <a class="league-card" href="#/league/${l.id}" style="--l1:${l.c1};--l2:${l.c2}">
    <span class="league-badge">${l.abbr}</span>
    <span class="league-card__info"><b>${l.name}</b><span>${l.country} · ${count} مباريات</span></span>
    <span class="league-card__arrow">${icon("chevron")}</span>
  </a>`;
}

/* ------------------------------------------------------------ pages */
function homePage() {
  const featured = MATCHES.find((m) => m.featured) || MATCHES[0];
  const liveMatches = MATCHES.filter((m) => getLive(m).status === "live");
  const upcoming = MATCHES.filter((m) => m.status === "upcoming");
  const finished = MATCHES.filter((m) => m.status === "finished");
  return `
    ${hero(featured)}
    <section class="section fade-up-2">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> مباشر الآن
            <span class="badge badge--live"><i></i> ${liveMatches.length}</span>
          </h2>
          <p class="section-sub">بث بجودة عالية، إحصائيات وتشكيلات لحظة بلحظة</p>
        </div>
        <a class="icon-link" href="#/live">كل المباريات ${icon("arrow")}</a>
      </div>
      ${liveMatches.length
        ? `<div class="live-rail">${liveMatches.map(matchCard).join("")}</div>`
        : emptyState("لا توجد مباريات مباشرة الآن", "عد قريباً أو تصفح المباريات القادمة.", "live")}
    </section>

    <section class="section fade-up-3">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> قريباً على المدرّج</h2>
          <p class="section-sub">اضبط تذكيرك ولا تفوّت أي قمة</p>
        </div>
        <a class="icon-link" href="#/matches">جدول المباريات ${icon("arrow")}</a>
      </div>
      <div class="matches-list">${upcoming.map(matchRow).join("")}</div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> أبرز النجوم</h2>
          <p class="section-sub">أرقام وتقييمات أسبوعية محدّثة</p>
        </div>
        <span class="badge badge--gold">${icon("trend")} تحديث مباشر</span>
      </div>
      <div class="stars-grid">${STARS.map(starCard).join("")}</div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> الدوريات</h2>
          <p class="section-sub">تابع الترتيب والنتائج في مكان واحد</p>
        </div>
        <a class="icon-link" href="#/leagues">كل الدوريات ${icon("arrow")}</a>
      </div>
      <div class="leagues-grid">${Object.values(LEAGUES).map(leagueCard).join("")}</div>
    </section>

    ${finished.length ? `
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> آخر النتائج</h2>
          <p class="section-sub">أعد مشاهدة الأهداف والملخصات</p>
        </div>
      </div>
      <div class="matches-list">${finished.map(matchRow).join("")}</div>
    </section>` : ""}`;
}

function livePage() {
  const liveMatches = MATCHES.filter((m) => getLive(m).status === "live");
  const finished = MATCHES.filter((m) => getLive(m).status === "finished");
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> مباشر الآن
            <span class="badge badge--live"><i></i> ${liveMatches.length}</span>
          </h2>
          <p class="section-sub">اختر مباراتك وابدأ المشاهدة</p>
        </div>
        <span class="badge badge--gold">${icon("sparkles")} جودة تصل إلى 4K HDR</span>
      </div>
      ${liveMatches.length
        ? `<div class="live-rail">${liveMatches.map(matchCard).join("")}</div>`
        : emptyState("لا توجد مباريات مباشرة الآن", "ستظهر المباريات هنا فور انطلاقها.", "live")}
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> مباريات انتهت</h2>
          <p class="section-sub">النتائج والإحصائيات كاملة</p>
        </div>
      </div>
      <div class="matches-list">${finished.map(matchRow).join("")}</div>
    </section>`;
}

function matchesPage() {
  const filters = [
    { id: "all", label: "الكل" },
    { id: "live", label: "مباشر" },
    { id: "upcoming", label: "قادمة" },
    { id: "finished", label: "منتهية" }
  ];
  const list = MATCHES.filter((m) => state.filter === "all" || getLive(m).status === state.filter);
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> جدول المباريات</h2>
          <p class="section-sub">${MATCHES.length} مباريات في 4 دوريات</p>
        </div>
        <div class="filter-chips">
          ${filters.map((f) => `<button class="chip ${state.filter === f.id ? "is-active" : ""}" data-action="filter" data-filter="${f.id}">${f.label}</button>`).join("")}
        </div>
      </div>
      ${list.length ? `<div class="matches-list">${list.map(matchRow).join("")}</div>` : emptyState("لا توجد مباريات", "جرّب اختيار تصنيف آخر.", "calendar")}
    </section>
    <section class="section">
      <div class="section-head">
        <div><h2 class="section-title"><span class="section-title__bar"></span> الدوريات</h2></div>
      </div>
      <div class="leagues-grid">${Object.values(LEAGUES).map(leagueCard).join("")}</div>
    </section>`;
}

function leaguesPage() {
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> الدوريات</h2>
          <p class="section-sub">الترتيب، النتائج، والمباريات القادمة</p>
        </div>
      </div>
      <div class="leagues-grid">${Object.values(LEAGUES).map(leagueCard).join("")}</div>
    </section>
    ${Object.values(LEAGUES).map((l) => `
      <section class="section">
        <div class="section-head">
          <div class="section-head__right">
            <span class="league-badge" style="--l1:${l.c1};--l2:${l.c2};width:38px;height:38px;border-radius:11px;font-size:9px">${l.abbr}</span>
            <div>
              <h2 class="section-title" style="font-size:16px">${l.name}</h2>
              <p class="section-sub">${l.country}</p>
            </div>
          </div>
          <a class="icon-link" href="#/league/${l.id}">التفاصيل ${icon("arrow")}</a>
        </div>
        <div class="panel"><div class="table-wrap">${standingsTable(l.id)}</div></div>
      </section>`).join("")}`;
}

function leaguePage(id) {
  const l = LEAGUES[id];
  if (!l) return emptyState("الدوري غير موجود", "عد إلى قائمة الدوريات.", "trophy");
  const matches = MATCHES.filter((m) => m.league === id);
  const liveCount = matches.filter((m) => getLive(m).status === "live").length;
  return `
    <div class="league-hero" style="--l1:${l.c1};--l2:${l.c2}">
      <span class="league-badge">${l.abbr}</span>
      <div class="league-hero__text">
        <h1>${l.name}</h1>
        <p>${l.country} · موسم 2025/26</p>
      </div>
      <div class="league-hero__stats">
        <div class="league-hero__stat"><b>${matches.length}</b><span>مباريات</span></div>
        <div class="league-hero__stat"><b>${liveCount}</b><span>مباشرة</span></div>
        <div class="league-hero__stat"><b>${matches.length}</b><span>في الجولة</span></div>
      </div>
      <a class="btn btn--soft btn--sm" href="#/leagues">${icon("arrow")} كل الدوريات</a>
    </div>
    <div class="league-layout">
      <div class="section" style="margin-top:0">
        <div class="section-head">
          <div>
            <h2 class="section-title"><span class="section-title__bar"></span> المباريات</h2>
            <p class="section-sub">الجدول الكامل للدوري</p>
          </div>
        </div>
        <div class="matches-list">${matches.map(matchRow).join("")}</div>
      </div>
      <div class="section" style="margin-top:0">
        <div class="panel">
          <div class="panel__head">
            <h3 class="panel__title">${icon("trophy")} جدول الترتيب</h3>
            <span class="badge">${l.abbr}</span>
          </div>
          <div class="table-wrap">${standingsTable(id)}</div>
        </div>
      </div>
    </div>`;
}

function favoritesPage() {
  const favs = MATCHES.filter((m) => state.favorites.has(m.id));
  const reminders = MATCHES.filter((m) => state.reminders.has(m.id));
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> مفضلاتي <span class="badge badge--gold">${favs.length}</span></h2>
          <p class="section-sub">كل ما حفظته لمتابعته لاحقاً</p>
        </div>
        ${favs.length ? `<a class="icon-link" href="#/matches">أضف المزيد ${icon("plus")}</a>` : ""}
      </div>
      ${favs.length
        ? `<div class="live-rail">${favs.map(matchCard).join("")}</div>`
        : emptyState("لا توجد مباريات في المفضلة", "اضغط على النجمة بجانب أي مباراة لحفظها هنا.", "star", `<a class="btn btn--primary btn--sm" href="#/matches">تصفح المباريات</a>`)}
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2 class="section-title"><span class="section-title__bar"></span> التذكيرات <span class="badge">${reminders.length}</span></h2>
          <p class="section-sub">سننبهك قبل انطلاق المباراة</p>
        </div>
      </div>
      ${reminders.length
        ? `<div class="matches-list">${reminders.map(matchRow).join("")}</div>`
        : emptyState("لا توجد تذكيرات", "فعّل التذكير من المباريات القادمة.", "bell")}
    </section>`;
}

function profilePage() {
  const favCount = state.favorites.size;
  const remindCount = state.reminders.size;
  const followCount = state.followed.size;
  return `
    <div class="profile-grid">
      <div class="panel profile-card">
        <div class="profile-avatar">م</div>
        <h2>مشجّع المدرّج</h2>
        <p>عضو منذ 2024 · خطة 4K</p>
        <span class="badge badge--gold">${icon("sparkles")} عضوية مميزة</span>
        <div class="profile-stats">
          <div class="profile-stat"><b>${favCount}</b><span>مفضلة</span></div>
          <div class="profile-stat"><b>${remindCount}</b><span>تذكير</span></div>
          <div class="profile-stat"><b>${followCount}</b><span>لاعب متابَع</span></div>
        </div>
      </div>
      <div>
        <div class="panel" style="margin-bottom:16px">
          <div class="panel__head"><h3 class="panel__title">${icon("settings")} إعدادات التطبيق</h3></div>
          <div class="panel__body">
            <div class="settings-list">
              <div class="setting-row">
                <span class="setting-row__icon">${icon(state.theme === "dark" ? "moon" : "sun")}</span>
                <span class="setting-row__text"><b>المظهر</b><span>وضع ${state.theme === "dark" ? "ليلي" : "نهاري"} مريح للعين</span></span>
                <button class="btn btn--soft btn--sm" data-action="theme">تبديل</button>
              </div>
              <div class="setting-row">
                <span class="setting-row__icon">${icon("sparkles")}</span>
                <span class="setting-row__text"><b>جودة البث الافتراضية</b><span>حالياً ${state.quality} · يمكن تغييرها من المشغّل</span></span>
                <button class="btn btn--soft btn--sm" data-action="cycle-quality">${state.quality}</button>
              </div>
              <div class="setting-row">
                <span class="setting-row__icon">${icon("bell")}</span>
                <span class="setting-row__text"><b>الإشعارات</b><span>الأهداف، البطاقات، وبداية المباريات</span></span>
                <button class="btn btn--soft btn--sm" data-action="notifications">إدارة</button>
              </div>
              <div class="setting-row">
                <span class="setting-row__icon">${icon("star")}</span>
                <span class="setting-row__text"><b>المفضلة</b><span>${favCount} مباريات محفوظة</span></span>
                <button class="btn btn--soft btn--sm" data-action="clear-favorites" ${favCount ? "" : "disabled"}>مسح</button>
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel__head"><h3 class="panel__title">${icon("info")} عن المدرّج</h3></div>
          <div class="panel__body">
            <p style="margin:0 0 10px;font-size:12px;color:var(--muted);line-height:1.8">
              المدرّج تطبيق تجريبي لمشاهدة المباريات بجودة عالية، مع تشكيلات تفاعلية، بطاقات صفراء وحمراء،
              إحصائيات متقدمة، تعليق مباشر، وتوقعات الجمهور. جميع البيانات والبث المعروض هنا لأغراض العرض فقط.
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span class="badge badge--gold">${icon("sparkles")} 4K HDR</span>
              <span class="badge badge--accent">${icon("users")} تشكيلات تفاعلية</span>
              <span class="badge">${icon("chart")} إحصائيات لحظية</span>
              <span class="badge">${icon("bell")} تنبيهات ذكية</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ------------------------------------------------------------ match page */
function videoStage(m) {
  const l = getLive(m);
  const league = LEAGUES[m.league];
  const live = l.status === "live";
  const finished = l.status === "finished";
  const qualities = [
    { q: "4K", note: "HDR · 60fps" },
    { q: "1080p", note: "FHD" },
    { q: "720p", note: "HD" },
    { q: "480p", note: "SD" }
  ];
  return `
  <div class="video-stage" id="video-stage">
    <canvas class="stage-canvas" id="match-canvas" aria-label="بث المباراة"></canvas>
    <div class="stage-grad"></div>
    <div class="stage-grain"></div>

    <div class="stage-top">
      <div class="stage-badges">
        ${live
          ? `<span class="badge badge--live"><i></i> مباشر</span>`
          : finished
            ? `<span class="badge">${icon("clock")} انتهت</span>`
            : `<span class="badge badge--blue">${icon("clock")} تبدأ ${m.kickoff}</span>`}
        <span class="badge">${league.abbr} · ${m.round}</span>
        <span class="badge badge--gold">${icon("sparkles")} ${state.quality}${state.quality === "4K" ? " HDR" : ""}</span>
        <span class="badge">${icon(live ? "eye" : "tv")} ${live ? m.viewers : finished ? "إعادة" : "معاينة"}</span>
      </div>
      <span class="stage-viewers">${icon("users")} ${live ? "1.8M" : "—"} ${live ? "يشاهدون" : ""}</span>
    </div>

    <div class="scoreboard">
      <div class="sb-team">${crest(m.home, "sm")}<b>${TEAMS[m.home].short}</b></div>
      <div class="sb-center">
        <div class="sb-score"><span data-score-for="${m.id}">${scoreText(l)}</span></div>
        <div class="sb-minute" data-minute-for="${m.id}">${shortStatus(l)}</div>
      </div>
      <div class="sb-team sb-team--away">${crest(m.away, "sm")}<b>${TEAMS[m.away].short}</b></div>
    </div>

    <div class="stage-note">${icon("info")} بث تجريبي تفاعلي · تحليل تكتيكي مباشر</div>

    <div class="stage-controls">
      <div class="stage-progress">
        <span class="stage-progress__time">${l.status === "upcoming" ? "00:00" : `${l.minute}:00`}</span>
        <div class="progress-rail"><div class="progress-rail__fill" data-progress-for="${m.id}" style="width:${progressOf(l)}%"></div></div>
        <span class="stage-progress__time">90:00</span>
      </div>
      <div class="stage-controls__row">
        <button class="ctrl-btn ctrl-btn--main" data-action="play" aria-label="${state.playing ? "إيقاف" : "تشغيل"}">${icon(state.playing ? "pause" : "play")}</button>
        <button class="ctrl-btn" data-action="mute" aria-label="الصوت">${icon(state.muted ? "mute" : "volume")}</button>
        <button class="ctrl-btn" data-action="pip" data-match="${m.id}" aria-label="شاشة مصغرة">${icon("pip")}</button>
        <span class="stage-controls__spacer"></span>
        <div class="quality-wrap">
          <button class="quality-btn" data-action="quality-menu">${icon("sparkles")} ${state.quality} ${icon("arrow")}</button>
          ${state.qualityMenu ? `<div class="quality-menu">
            ${qualities.map((q) => `<button data-action="quality-set" data-quality="${q.q}" class="${state.quality === q.q ? "is-active" : ""}">${q.q === "4K" ? "4K HDR" : q.q}<small>${q.note}</small></button>`).join("")}
          </div>` : ""}
        </div>
        <button class="ctrl-btn" data-action="share" aria-label="مشاركة">${icon("share")}</button>
        <button class="ctrl-btn" data-action="fullscreen" aria-label="ملء الشاشة">${icon("expand")}</button>
      </div>
    </div>

    ${state.playing ? "" : `<div class="stage-paused"><span>${icon("pause")} تم إيقاف البث مؤقتاً</span></div>`}
  </div>`;
}

function eventItem(m, e) {
  const team = TEAMS[m[e.team]];
  const symbol = e.type === "goal" ? "ball" : e.type === "yellow" ? "yellow" : e.type === "red" ? "red" : "sub";
  const label = e.type === "goal" ? "هدف" : e.type === "yellow" ? "بطاقة صفراء" : e.type === "red" ? "بطاقة حمراء" : "تبديل";
  return `
    <div class="event event--${e.type}">
      <div class="event__min">${minuteLabel(e)}</div>
      <div class="event__icon">
        <span class="event__symbol">${icon(symbol)}</span>
        <div class="event__body">
          <b>
            ${e.player}
            ${e.type === "goal" && e.score ? `<span class="event__score">${e.score[0]} - ${e.score[1]}</span>` : ""}
            <span class="event__tag">${label}</span>
          </b>
          <p>${e.detail}${e.assist ? ` · صناعة: ${e.assist}` : ""}</p>
          <span class="event__team">${team.name}</span>
        </div>
      </div>
    </div>`;
}

function commentaryList(m) {
  const l = getLive(m);
  const list = l.commentary || [];
  if (!list.length) return `<div class="search-empty">لا يوجد تعليق مباشر حتى الآن.</div>`;
  return list.slice(0, 12).map((c) => `
    <div class="comment">
      <span class="comment__min">${c.minute}'</span>
      <p>${c.text}</p>
    </div>`).join("");
}

function flowTab(m) {
  const l = getLive(m);
  if (!l.events.length) {
    return emptyState(
      l.status === "upcoming" ? "المباراة لم تبدأ بعد" : "لا توجد أحداث بعد",
      l.status === "upcoming"
        ? `ستبدأ المباراة ${m.dateLabel} الساعة ${m.kickoff}. ستتوفر التشكيلات والإحصائيات فور الانطلاق.`
        : "ستظهر الأحداث هنا فور حدوثها.",
      "clock"
    );
  }
  return `
    <div class="flow-grid">
      <div class="panel">
        <div class="panel__head">
          <h3 class="panel__title">${icon("list")} مجريات المباراة</h3>
          <span class="badge ${l.status === "live" ? "badge--live" : ""}">${l.status === "live" ? `<i></i> مباشر` : "الأحداث"}</span>
        </div>
        <div class="panel__body panel__body--flush">
          <div class="events">${[...l.events]
            .sort((a, b) => (b.minute + (b.added || 0) / 10) - (a.minute + (a.added || 0) / 10))
            .map((e) => eventItem(m, e)).join("")}</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel__head">
          <h3 class="panel__title">${icon("whistle")} التعليق المباشر</h3>
          ${l.status === "live" ? `<span class="badge badge--live"><i></i> مباشر</span>` : `<span class="badge">${l.status === "upcoming" ? "قبل المباراة" : "ملخص"}</span>`}
        </div>
        <div class="commentary" id="commentary-list">${commentaryList(m)}</div>
      </div>
    </div>`;
}

function pitchMarkings() {
  return `
    <div class="pitch__line pitch__line--half"></div>
    <div class="pitch__circle"></div>
    <div class="pitch__box pitch__box--top"></div>
    <div class="pitch__box pitch__box--bottom"></div>
    <div class="pitch__box6 pitch__box6--top"></div>
    <div class="pitch__box6 pitch__box6--bottom"></div>
    <div class="pitch__goal pitch__goal--top"></div>
    <div class="pitch__goal pitch__goal--bottom"></div>
    <div class="pitch__arc pitch__arc--top"></div>
    <div class="pitch__arc pitch__arc--bottom"></div>`;
}

function playerChip(m, side, p) {
  const team = TEAMS[m[side]];
  const cards = cardsFor(m, side, p.full);
  const cardMarkup = cards.red
    ? `<span class="pchip__card pchip__card--r"></span>`
    : cards.yellow
      ? `<span class="pchip__card pchip__card--y"></span>`
      : "";
  return `
    <button class="pchip ${side === "away" ? "pchip--away" : ""}" style="--x:${p.x}%;--y:${p.y}%;--c1:${team.c1};--c2:${team.c2};--ink:${team.ink}" data-action="player" data-match="${m.id}" data-side="${side}" data-name="${p.full}" aria-label="${p.full}">
      <span class="pchip__num">${p.n}${cardMarkup}<span class="pchip__rating">${p.rating.toFixed(1)}</span></span>
      <span class="pchip__name">${p.name}</span>
    </button>`;
}

function benchList(m, side) {
  const team = TEAMS[m[side]];
  const lineup = m.lineups[side];
  return `
    <div class="bench">
      <h4 class="bench__title">${crest(team.id, "xs")} دكة البدلاء · ${team.short}</h4>
      <div class="bench-grid">
        ${lineup.bench.map((p) => `<button class="bench-player" data-action="player" data-match="${m.id}" data-side="${side}" data-name="${p.full}"><b>${p.n}</b><span>${p.name}</span><em>${p.rating.toFixed(1)}</em></button>`).join("")}
      </div>
    </div>`;
}

function lineupTab(m) {
  if (!m.lineups) {
    return emptyState(
      "التشكيلات لم تُعلن بعد",
      "تُعلن التشكيلات الرسمية عادةً قبل انطلاق المباراة بساعة. يمكنك العودة قريباً.",
      "users"
    );
  }
  const home = m.lineups.home;
  const away = m.lineups.away;
  return `
    <div class="panel pitch-panel">
      <div class="pitch-head">
        <div class="formation-chip">${crest(m.home, "xs")} ${TEAMS[m.home].short} <b>${home.formation}</b></div>
        <div class="lineup-legend">
          <span class="legend-item"><i class="legend-card" style="background:#ffd44f"></i> إنذار</span>
          <span class="legend-item"><i class="legend-card" style="background:#ff4b5f"></i> طرد</span>
          <span class="legend-item">${icon("info")} اضغط على اللاعب للتفاصيل</span>
        </div>
        <div class="formation-chip">${crest(m.away, "xs")} ${TEAMS[m.away].short} <b>${away.formation}</b></div>
      </div>
      <div class="pitch-wrap">
        <div class="pitch">
          ${pitchMarkings()}
          ${home.players.map((p) => playerChip(m, "home", p)).join("")}
          ${away.players.map((p) => playerChip(m, "away", p)).join("")}
        </div>
      </div>
      <div class="bench-wrap">
        ${benchList(m, "home")}
        ${benchList(m, "away")}
      </div>
    </div>`;
}

const STAT_ROWS = [
  { key: "possession", label: "الاستحواذ", suffix: "%" },
  { key: "shots", label: "التسديدات" },
  { key: "onTarget", label: "على المرمى" },
  { key: "xg", label: "الأهداف المتوقعة xG", decimals: 2 },
  { key: "corners", label: "الركنيات" },
  { key: "fouls", label: "الأخطاء" },
  { key: "passes", label: "التمريرات" },
  { key: "passAcc", label: "دقة التمرير", suffix: "%" },
  { key: "offsides", label: "التسلل" },
  { key: "saves", label: "التصديات" }
];

function statsRows(stats) {
  return STAT_ROWS.map((row) => {
    const v = stats[row.key];
    if (!v) return "";
    const fmt = (x) => row.decimals ? Number(x).toFixed(row.decimals) : x;
    const total = v[0] + v[1] || 1;
    const hp = Math.round((v[0] / total) * 100);
    const ap = 100 - hp;
    return `
      <div class="stat-row">
        <div class="stat-row__top">
          <b>${fmt(v[0])}${row.suffix || ""}</b>
          <span>${row.label}</span>
          <b>${fmt(v[1])}${row.suffix || ""}</b>
        </div>
        <div class="stat-bars">
          <div class="stat-bars__home"><i style="width:${hp}%"></i></div>
          <div class="stat-bars__away"><i style="width:${ap}%"></i></div>
        </div>
      </div>`;
  }).join("");
}

function statsTab(m) {
  if (!m.stats) {
    return emptyState("الإحصائيات غير متاحة", "ستظهر الإحصائيات فور انطلاق المباراة.", "chart");
  }
  const cards = cardsTotals(m);
  const shots = m.shotsMap || [];
  const best = topPlayers(m);
  return `
    <div class="stats-grid">
      <div>
        <div class="panel">
          <div class="panel__head">
            <h3 class="panel__title">${icon("chart")} إحصائيات المباراة</h3>
            <div style="display:flex;gap:10px">
              <span class="legend-item">${crest(m.home, "xs")} ${TEAMS[m.home].short}</span>
              <span class="legend-item">${crest(m.away, "xs")} ${TEAMS[m.away].short}</span>
            </div>
          </div>
          <div class="panel__body">
            <div class="stat-rows">${statsRows(m.stats)}</div>
          </div>
        </div>
        ${best.length ? `
        <div class="panel" style="margin-top:16px">
          <div class="panel__head"><h3 class="panel__title">${icon("star")} أفضل تقييمات المباراة</h3></div>
          <div class="panel__body" style="display:flex;flex-direction:column;gap:6px">
            ${best.map((p) => `
              <button class="bench-player" data-action="player" data-match="${m.id}" data-side="${p.side}" data-name="${p.full}" style="font-size:11px;padding:9px 11px">
                <b>${p.n}</b><span>${p.full}</span><em>${p.rating.toFixed(1)} · ${TEAMS[p.team].short}</em>
              </button>`).join("")}
          </div>
        </div>` : ""}
      </div>
      <div>
        <div class="panel">
          <div class="panel__head">
            <h3 class="panel__title">${icon("shield")} البطاقات</h3>
          </div>
          <div class="panel__body">
            <div class="card-counters" style="justify-content:space-around">
              <div class="mini-stat" style="flex:1">
                <div class="card-counters"><span class="card-count"><i class="card-shape card-shape--y"></i>${cards.home.yellow}</span><span class="card-count"><i class="card-shape card-shape--r"></i>${cards.home.red}</span></div>
                <span>${TEAMS[m.home].short}</span>
              </div>
              <div class="mini-stat" style="flex:1">
                <div class="card-counters"><span class="card-count"><i class="card-shape card-shape--y"></i>${cards.away.yellow}</span><span class="card-count"><i class="card-shape card-shape--r"></i>${cards.away.red}</span></div>
                <span>${TEAMS[m.away].short}</span>
              </div>
            </div>
            <div class="stat-extra" style="margin-top:12px">
              <div class="mini-stat"><b>${m.stats.saves[0] + m.stats.saves[1]}</b><span>تصديات</span></div>
              <div class="mini-stat"><b>${m.stats.corners[0] + m.stats.corners[1]}</b><span>ركنيات</span></div>
            </div>
          </div>
        </div>
        ${shots.length ? `
        <div class="panel" style="margin-top:16px">
          <div class="panel__head"><h3 class="panel__title">${icon("map")} خريطة التسديدات</h3></div>
          <div class="panel__body">
            <div class="shots-wrap">
              <div class="shots-pitch">
                ${shots.map((s) => `<span class="shot-dot shot-dot--${s.team} ${s.goal ? "shot-dot--goal" : ""}" style="left:${s.x}%;top:${(s.y / 64) * 100}%"></span>`).join("")}
              </div>
            </div>
            <div class="shots-legend">
              <span class="legend-item"><i class="shot-dot shot-dot--home" style="position:static;transform:none"></i> ${TEAMS[m.home].short}</span>
              <span class="legend-item"><i class="shot-dot shot-dot--away" style="position:static;transform:none"></i> ${TEAMS[m.away].short}</span>
              <span class="legend-item"><i class="shot-dot shot-dot--goal" style="position:static;transform:none"></i> هدف</span>
            </div>
          </div>
        </div>` : ""}
      </div>
    </div>`;
}

function tableTab(m) {
  return `
    <div class="panel">
      <div class="panel__head">
        <h3 class="panel__title">${icon("trophy")} ترتيب ${LEAGUES[m.league].name}</h3>
        <span class="badge">${LEAGUES[m.league].abbr}</span>
      </div>
      <div class="table-wrap">${standingsTable(m.league, [m.home, m.away])}</div>
    </div>`;
}

function matchTabs(m) {
  const l = getLive(m);
  const items = [
    { id: "flow", label: "المجريات", icon: "live", count: (l.events || []).length },
    { id: "lineup", label: "التشكيلات", icon: "users", count: m.lineups ? 22 : 0 },
    { id: "stats", label: "الإحصائيات", icon: "chart", count: 0 },
    { id: "table", label: "الترتيب", icon: "trophy", count: 0 }
  ];
  return `<div class="tabs">${items.map((t) => `
    <button class="tab ${state.matchTab === t.id ? "is-active" : ""}" data-action="tab" data-tab="${t.id}">
      ${icon(t.icon)} ${t.label} ${t.count ? `<span class="tab__count">${t.count}</span>` : ""}
    </button>`).join("")}</div>`;
}

function matchTabBody(m) {
  if (state.matchTab === "flow") return flowTab(m);
  if (state.matchTab === "lineup") return lineupTab(m);
  if (state.matchTab === "stats") return statsTab(m);
  return tableTab(m);
}

function matchContent(m) {
  return `<div id="match-content-inner">${matchTabBody(m)}</div>`;
}

function pollCard(m) {
  const data = pollData(m);
  const labels = [`فوز ${TEAMS[m.home].short}`, "تعادل", `فوز ${TEAMS[m.away].short}`];
  return `
    <div class="rail-card">
      <h3 class="rail-card__title">${icon("users")} توقعات الجمهور</h3>
      <div class="poll-options">
        ${labels.map((label, i) => `
          <button class="poll-opt ${data.voted === i ? "is-voted" : ""}" data-action="poll" data-match="${m.id}" data-index="${i}" style="--pct:${data.pcts[i]}%">
            <span>${label}</span><b>${data.pcts[i]}%</b>
          </button>`).join("")}
      </div>
      <p class="small-muted">${data.voted == null ? "صوّت لترى توقع الجمهور" : "شكراً لمشاركتك · " + "تم احتساب صوتك"}</p>
    </div>`;
}

function matchRail(m) {
  const l = getLive(m);
  const home = TEAMS[m.home];
  const away = TEAMS[m.away];
  const prob = m.winProb || [50, 50];
  const h2h = m.h2h || { home: 1, draw: 1, away: 1 };
  const total = h2h.home + h2h.draw + h2h.away || 1;
  const liveMatches = MATCHES.filter((x) => x.id !== m.id && getLive(x).status === "live");
  return `
    <div class="rail-card">
      <h3 class="rail-card__title">${icon("info")} معلومات المباراة</h3>
      <div class="info-list">
        <div class="info-row"><span>البطولة</span><b>${LEAGUES[m.league].name}</b></div>
        <div class="info-row"><span>الدور</span><b>${m.round}</b></div>
        <div class="info-row"><span>الملعب</span><b>${m.venue}</b></div>
        <div class="info-row"><span>المدينة</span><b>${m.city}</b></div>
        <div class="info-row"><span>الحكم</span><b>${m.referee}</b></div>
        <div class="info-row"><span>الجمهور</span><b>${m.attendance}</b></div>
        <div class="info-row"><span>الطقس</span><b>${m.weather}</b></div>
        <div class="info-row"><span>القناة</span><b>${m.channel}</b></div>
        <div class="info-row"><span>الجودة</span><b>${m.quality}</b></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn btn--soft btn--sm btn--block" data-action="share">${icon("share")} مشاركة</button>
        ${l.status === "upcoming" ? `<button class="btn btn--soft btn--sm btn--block" data-action="remind" data-match="${m.id}">${icon("bell")} ${state.reminders.has(m.id) ? "مفعّل" : "تذكير"}</button>` : ""}
      </div>
    </div>

    <div class="rail-card">
      <h3 class="rail-card__title">${icon("trend")} احتمالية الفوز</h3>
      <div class="prob">
        <div class="prob__home" style="width:${prob[0]}%"></div>
        <div class="prob__away" style="width:${prob[1]}%"></div>
      </div>
      <div class="prob-labels">
        <span class="p-home"><i></i> ${home.short} ${prob[0]}%</span>
        <span class="p-away"><i></i> ${away.short} ${prob[1]}%</span>
      </div>
    </div>

    <div class="rail-card">
      <h3 class="rail-card__title">${icon("chart")} آخر المواجهات</h3>
      <div class="h2h-bar">
        <i class="h" style="width:${(h2h.home / total) * 100}%"></i>
        <i class="d" style="width:${(h2h.draw / total) * 100}%"></i>
        <i class="a" style="width:${(h2h.away / total) * 100}%"></i>
      </div>
      <div class="h2h-labels">
        <span><b>${h2h.home}</b> ${home.short}</span>
        <span><b>${h2h.draw}</b> تعادل</span>
        <span><b>${h2h.away}</b> ${away.short}</span>
      </div>
    </div>

    <div class="rail-card">
      <h3 class="rail-card__title">${icon("trend")} الحالة الأخيرة</h3>
      <div style="display:flex;flex-direction:column;gap:9px">
        ${[["home", home], ["away", away]].map(([side, team]) => `
          <div class="info-row" style="align-items:center">
            <span style="display:flex;align-items:center;gap:7px">${crest(team.id, "xs")} ${team.short}</span>
            <span class="form-chips">${(m.form ? m.form[side] : []).map((r) => `<i class="form-chip form-chip--${r.toLowerCase()}">${r === "W" ? "ف" : r === "D" ? "ت" : "خ"}</i>`).join("")}</span>
          </div>`).join("")}
      </div>
    </div>

    ${pollCard(m)}

    ${liveMatches.length ? `
    <div class="rail-card">
      <h3 class="rail-card__title">${icon("live")} مباريات مباشرة أخرى</h3>
      ${liveMatches.map((x) => {
        const xl = getLive(x);
        return `<a class="mini-match" href="#/match/${x.id}" style="text-decoration:none;color:inherit">
          ${crest(x.home, "xs")}
          <div class="mini-match__names"><span>${TEAMS[x.home].short} × ${TEAMS[x.away].short}</span><span class="mini-match__min">${xl.minute}'</span></div>
          <span class="mini-match__score">${xl.score[0]} - ${xl.score[1]}</span>
        </a>`;
      }).join("")}
    </div>` : ""}`;
}

function matchPage(m) {
  const l = getLive(m);
  return `
    <div class="match-head">
      <div class="breadcrumb">
        <a href="#/home">الرئيسية</a>${icon("chevron")}
        <a href="#/league/${m.league}">${LEAGUES[m.league].name}</a>${icon("chevron")}
        <span>${TEAMS[m.home].short} × ${TEAMS[m.away].short}</span>
      </div>
      <div class="match-actions">
        <span class="badge ${l.status === "live" ? "badge--live" : l.status === "finished" ? "" : "badge--blue"}">
          ${l.status === "live" ? `<i></i> مباشر · ${l.minute}'` : l.status === "finished" ? "انتهت" : `${m.dateLabel} · ${m.kickoff}`}
        </span>
        <button class="btn btn--soft" data-action="remind" data-match="${m.id}" ${l.status !== "upcoming" ? "style=\"display:none\"" : ""}>${icon("bell")} <span>${state.reminders.has(m.id) ? "مفعّل" : "تذكير"}</span></button>
        <button class="btn btn--soft" data-action="favorite" data-match="${m.id}">${icon("star")} <span>${state.favorites.has(m.id) ? "محفوظة" : "حفظ"}</span></button>
        <button class="btn btn--soft" data-action="share">${icon("share")} <span>مشاركة</span></button>
      </div>
    </div>
    <div class="match-layout">
      <div class="match-main">
        <div id="stage-wrap">${videoStage(m)}</div>
        ${matchTabs(m)}
        ${matchContent(m)}
      </div>
      <aside class="match-rail" id="match-rail">${matchRail(m)}</aside>
    </div>`;
}
