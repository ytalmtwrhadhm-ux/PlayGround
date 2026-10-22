/* المدرّج — منطق التطبيق والتنقل */

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) { /* ignore */ }
  }

  const state = {
    route: { name: "home", id: null },
    favorites: new Set(readStore("madraj-favorites", [])),
    reminders: new Set(readStore("madraj-reminders", [])),
    followed: new Set(readStore("madraj-followed", [])),
    votes: readStore("madraj-votes", {}),
    theme: document.documentElement.dataset.theme || "dark",
    filter: "all",
    matchTab: "flow",
    quality: "4K",
    qualityMenu: false,
    playing: true,
    muted: true,
    miniMatch: null,
    live: {},
    canvasStop: null,
    tickCount: 0,
    modalOpen: false,
    searchOpen: false
  };

  MATCHES.forEach((m) => {
    if (m.status === "live") {
      state.live[m.id] = {
        minute: m.minute,
        score: m.score.slice(),
        status: "live",
        events: (m.events || []).map((e) => ({ ...e })),
        commentary: (m.commentary || []).map((c) => ({ ...c })),
        processed: new Set()
      };
    }
  });

  function matchById(id) {
    return MATCHES.find((m) => m.id === id);
  }

  function getLive(m) {
    return state.live[m.id] || {
      minute: m.minute,
      score: m.score,
      status: m.status,
      events: m.events || [],
      commentary: m.commentary || []
    };
  }

  function cardsFor(m, side, fullName) {
    const l = getLive(m);
    let yellow = 0;
    let red = 0;
    (l.events || []).forEach((e) => {
      if (e.team !== side || e.player !== fullName) return;
      if (e.type === "yellow") yellow += 1;
      if (e.type === "red") red += 1;
    });
    return { yellow, red };
  }

  function cardsTotals(m) {
    const l = getLive(m);
    const out = { home: { yellow: 0, red: 0 }, away: { yellow: 0, red: 0 } };
    (l.events || []).forEach((e) => {
      if (out[e.team] && (e.type === "yellow" || e.type === "red")) out[e.team][e.type] += 1;
    });
    return out;
  }

  function scorers(m, side) {
    return (getLive(m).events || []).filter((e) => e.type === "goal" && e.team === side);
  }

  function pollData(m) {
    const base = m.poll || [33, 34, 33];
    const vote = state.votes[m.id];
    const counts = base.slice();
    if (vote != null && counts[vote] != null) counts[vote] += 1;
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    return { pcts: counts.map((v) => Math.round((v / total) * 100)), voted: vote };
  }

  function topPlayers(m) {
    if (!m.lineups) return [];
    const list = [];
    ["home", "away"].forEach((side) => {
      m.lineups[side].players.forEach((p) => list.push({ ...p, side, team: m[side] }));
    });
    return list.sort((a, b) => b.rating - a.rating).slice(0, 4);
  }

  /* ---------------------------------------------------------- routing */
  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return { name: "home", id: null };
    return { name: parts[0], id: parts[1] || null };
  }

  function currentMatch() {
    return state.route.name === "match" ? matchById(state.route.id) : null;
  }

  const TITLES = {
    home: ["الرئيسية", "كل المباريات، في مكان واحد"],
    live: ["مباشر الآن", "تابع المباريات لحظة بلحظة"],
    matches: ["المباريات", "الجدول الكامل والنتائج"],
    leagues: ["الدوريات", "الترتيب والنتائج"],
    favorites: ["مفضلاتي", "مبارياتك المحفوظة"],
    profile: ["الملف الشخصي", "إعداداتك وتفضيلاتك"],
    league: ["الدوري", "الترتيب والمباريات"]
  };

  function render(opts = {}) {
    const route = parseRoute();
    state.route = route;
    let m = null;

    if (route.name === "match") {
      m = matchById(route.id);
      if (!m) {
        location.hash = "#/home";
        return;
      }
    }

    if (state.canvasStop) {
      state.canvasStop();
      state.canvasStop = null;
    }

    let html = "";
    if (route.name === "home") html = homePage();
    else if (route.name === "live") html = livePage();
    else if (route.name === "matches") html = matchesPage();
    else if (route.name === "leagues") html = leaguesPage();
    else if (route.name === "league") html = leaguePage(route.id);
    else if (route.name === "favorites") html = favoritesPage();
    else if (route.name === "profile") html = profilePage();
    else if (route.name === "match") html = matchPage(m);
    else html = homePage();

    const view = document.getElementById("view");
    view.innerHTML = html;
    hydrateIcons(view);

    updateHeading(route, m);
    updateNav(route, m);
    renderSidePromo();
    updateMini();

    if (m) mountCanvas(m);

    if (!opts.keepScroll) {
      window.scrollTo(0, 0);
    }
  }

  function updateHeading(route, m) {
    const title = document.getElementById("page-title");
    const subtitle = document.getElementById("page-subtitle");
    if (!title || !subtitle) return;

    if (route.name === "match" && m) {
      title.textContent = `${TEAMS[m.home].short} × ${TEAMS[m.away].short}`;
      subtitle.textContent = `${LEAGUES[m.league].name} · ${m.round}`;
    } else if (route.name === "league") {
      const l = LEAGUES[route.id];
      title.textContent = l ? l.name : "الدوري";
      subtitle.textContent = l ? `${l.country} · موسم 2025/26` : "";
    } else {
      const t = TITLES[route.name] || TITLES.home;
      title.textContent = t[0];
      subtitle.textContent = t[1];
    }
    document.title = `${title.textContent} · المدرّج`;
  }

  function updateNav(route, m) {
    let active = route.name;
    if (route.name === "league") active = "leagues";
    if (route.name === "match") active = m && getLive(m).status === "live" ? "live" : "matches";

    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.nav === active);
    });

    const liveCount = MATCHES.filter((x) => getLive(x).status === "live").length;
    const badge = document.getElementById("live-count");
    if (badge) badge.textContent = String(liveCount);
  }

  function renderSidePromo() {
    const el = document.getElementById("side-promo");
    if (!el) return;
    const m = MATCHES.find((x) => x.featured) || MATCHES[0];
    const l = getLive(m);
    el.innerHTML = `
      <span class="side-promo__tag"><i></i> ${l.status === "live" ? "مباشر الآن" : l.status === "finished" ? "انتهت" : "قريباً"}</span>
      <h4>${TEAMS[m.home].short} × ${TEAMS[m.away].short}</h4>
      <p>${LEAGUES[m.league].name} · ${m.round}</p>
      <div class="side-promo__teams">
        ${crest(m.home, "xs")}${crest(m.away, "xs")}
        <span class="side-promo__score">${l.status === "upcoming" ? m.kickoff : scoreText(l)}</span>
      </div>
      <a class="btn btn--primary" href="#/match/${m.id}">${icon("play")} ${l.status === "finished" ? "الإعادة" : "شاهد الآن"}</a>`;
  }

  function go(path) {
    const hash = `#/${String(path).replace(/^\/+/, "")}`;
    closeMenu();
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  /* ---------------------------------------------------------- theme */
  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    try { localStorage.setItem("madraj-theme", state.theme); } catch (err) { /* ignore */ }
    const iconEl = document.querySelector(".theme-toggle__icon");
    if (iconEl) {
      iconEl.innerHTML = icon(state.theme === "dark" ? "moon" : "sun");
      iconEl.dataset.iconDone = "1";
    }
    const textEl = document.querySelector(".theme-toggle__text");
    if (textEl) textEl.textContent = state.theme === "dark" ? "الوضع الليلي" : "الوضع النهاري";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "dark" ? "#070b10" : "#eef2f6");
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    if (state.route.name === "profile") render({ keepScroll: true });
  }

  /* ---------------------------------------------------------- favorites / reminders */
  function syncFavoriteButtons() {
    document.querySelectorAll('[data-action="favorite"]').forEach((btn) => {
      const active = state.favorites.has(btn.dataset.match);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      if (btn.classList.contains("fav-btn")) {
        btn.innerHTML = icon("star");
      } else {
        btn.innerHTML = `${icon("star")} <span>${active ? "محفوظة" : "حفظ"}</span>`;
      }
    });
  }

  function syncReminderButtons() {
    document.querySelectorAll('[data-action="remind"]').forEach((btn) => {
      const active = state.reminders.has(btn.dataset.match);
      btn.classList.toggle("is-active", active);
      const span = btn.querySelector("span");
      if (span) span.textContent = active ? "مفعّل" : "تذكير";
      else btn.innerHTML = `${icon("bell")} ${active ? "مفعّل" : "تذكير"}`;
    });
  }

  function toggleFavorite(id) {
    if (!id) return;
    const m = matchById(id);
    const added = !state.favorites.has(id);
    if (added) state.favorites.add(id);
    else state.favorites.delete(id);
    writeStore("madraj-favorites", [...state.favorites]);
    syncFavoriteButtons();
    if (state.route.name === "favorites") render({ keepScroll: true });
    if (m) {
      toast(
        added ? `أُضيفت ${TEAMS[m.home].short} × ${TEAMS[m.away].short} إلى المفضلة` : `أُزيلت ${TEAMS[m.home].short} × ${TEAMS[m.away].short} من المفضلة`,
        "info",
        "star"
      );
    }
  }

  function toggleReminder(id) {
    if (!id) return;
    const m = matchById(id);
    if (m && getLive(m).status !== "upcoming") {
      toast("المباراة مباشرة الآن — شاهدها من صفحة المباراة", "info", "live");
      return;
    }
    const added = !state.reminders.has(id);
    if (added) state.reminders.add(id);
    else state.reminders.delete(id);
    writeStore("madraj-reminders", [...state.reminders]);
    syncReminderButtons();
    if (state.route.name === "favorites") render({ keepScroll: true });
    toast(added ? "تم تفعيل التذكير · سننبهك قبل انطلاق المباراة" : "تم إلغاء التذكير", "info", "bell");
  }

  /* ---------------------------------------------------------- drawer */
  function openMenu() {
    const sidebar = document.getElementById("sidebar");
    const scrim = document.getElementById("drawer-scrim");
    if (sidebar) sidebar.classList.add("is-open");
    if (scrim) scrim.hidden = false;
  }

  function closeMenu() {
    const sidebar = document.getElementById("sidebar");
    const scrim = document.getElementById("drawer-scrim");
    if (sidebar) sidebar.classList.remove("is-open");
    if (scrim) scrim.hidden = true;
  }

  /* ---------------------------------------------------------- share */
  function sharePage() {
    const url = location.href;
    if (navigator.share) {
      navigator.share({ title: document.title, url }).catch(() => {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => toast("تم نسخ رابط المباراة", "info", "share"))
        .catch(() => toast("انسخ الرابط من شريط العنوان للمشاركة", "info", "share"));
      return;
    }
    toast("انسخ الرابط من شريط العنوان للمشاركة", "info", "share");
  }

  /* ---------------------------------------------------------- actions */
  function handleClick(e) {
    const routeEl = e.target.closest("[data-route]");
    if (routeEl) {
      go(routeEl.dataset.route);
      return;
    }

    const el = e.target.closest("[data-action]");
    if (!el) {
      if (e.target.closest("[data-nav]")) closeMenu();
      return;
    }

    const action = el.dataset.action;

    if (action === "close-modal") {
      if (el.classList.contains("modal-backdrop") && e.target.closest(".player-modal")) return;
      closeModal();
      return;
    }
    if (action === "close-search") {
      if (el.classList.contains("search-backdrop") && e.target.closest(".search-panel")) return;
      closeSearch();
      return;
    }

    if (state.qualityMenu && !e.target.closest(".quality-wrap")) {
      state.qualityMenu = false;
      const cm = currentMatch();
      if (cm) renderStage(cm);
    }

    switch (action) {
      case "theme":
        toggleTheme();
        break;
      case "menu":
        openMenu();
        break;
      case "close-menu":
        closeMenu();
        break;
      case "search":
        openSearch();
        break;
      case "notifications":
        notifyDot(false);
        toast("تم تفعيل تنبيهات الأهداف والبطاقات", "info", "bell");
        break;
      case "favorite":
        toggleFavorite(el.dataset.match);
        break;
      case "remind":
        toggleReminder(el.dataset.match);
        break;
      case "filter":
        state.filter = el.dataset.filter;
        render({ keepScroll: true });
        break;
      case "tab": {
        state.matchTab = el.dataset.tab;
        const cm = currentMatch();
        if (cm) renderMatchContent(cm);
        break;
      }
      case "play": {
        state.playing = !state.playing;
        const cm = currentMatch();
        if (cm) renderStage(cm);
        break;
      }
      case "mute":
        state.muted = !state.muted;
        toast(state.muted ? "الصوت مكتوم" : "تم تشغيل الصوت", "info", state.muted ? "mute" : "volume");
        {
          const cm = currentMatch();
          if (cm) renderStage(cm);
        }
        break;
      case "quality-menu":
        state.qualityMenu = !state.qualityMenu;
        {
          const cm = currentMatch();
          if (cm) renderStage(cm);
        }
        break;
      case "quality-set":
        state.quality = el.dataset.quality;
        state.qualityMenu = false;
        {
          const cm = currentMatch();
          if (cm) renderStage(cm);
        }
        toast(`جودة البث: ${state.quality}${state.quality === "4K" ? " HDR" : ""}`, "info", "sparkles");
        break;
      case "cycle-quality": {
        const qs = ["4K", "1080p", "720p", "480p"];
        const next = qs[(qs.indexOf(state.quality) + 1) % qs.length];
        state.quality = next;
        if (state.route.name === "match") {
          const cm = currentMatch();
          if (cm) renderStage(cm);
        }
        if (state.route.name === "profile") render({ keepScroll: true });
        toast(`الجودة الافتراضية أصبحت ${next}`, "info", "sparkles");
        break;
      }
      case "fullscreen": {
        const stage = document.getElementById("video-stage");
        if (!stage) break;
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else if (stage.requestFullscreen) {
          stage.requestFullscreen().catch(() => toast("ملء الشاشة غير مدعوم في هذا المتصفح", "info", "expand"));
        }
        break;
      }
      case "pip": {
        const id = el.dataset.match || state.route.id;
        if (state.miniMatch === id) state.miniMatch = null;
        else state.miniMatch = id;
        updateMini();
        if (state.miniMatch && state.route.name === "match") {
          toast("ستظهر الشاشة المصغرة عند مغادرة صفحة المباراة", "info", "pip");
        } else if (state.miniMatch) {
          toast("تم تفعيل شاشة المشاهدة المصغرة", "info", "pip");
        }
        break;
      }
      case "mini-close":
        state.miniMatch = null;
        updateMini();
        break;
      case "share":
        sharePage();
        break;
      case "player":
        openPlayerModal(el.dataset.match, el.dataset.side, el.dataset.name);
        if (state.searchOpen) closeSearch();
        break;
      case "star":
        openStarModal(el.dataset.star);
        break;
      case "follow":
        toggleFollow(el.dataset.name);
        break;
      case "poll":
        togglePoll(el.dataset.match, el.dataset.index);
        break;
      case "search-match":
        go(`match/${el.dataset.match}`);
        closeSearch();
        break;
      case "clear-favorites":
        state.favorites.clear();
        writeStore("madraj-favorites", []);
        syncFavoriteButtons();
        render({ keepScroll: true });
        toast("تم مسح قائمة المفضلة", "info", "star");
        break;
      default:
        break;
    }
  }

  function handleInput(e) {
    if (e.target && e.target.id === "search-input") {
      renderSearchResults(e.target.value);
    }
  }

  function handleKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (!state.searchOpen) openSearch();
      return;
    }
    if (e.key === "Escape") {
      if (state.modalOpen) closeModal();
      else if (state.searchOpen) closeSearch();
      else closeMenu();
    }
  }

  /* ---------------------------------------------------------- init */
  function init() {
    applyTheme();
    hydrateIcons(document);
    render();
    window.setInterval(tickLive, 4000);

    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("hashchange", () => {
      closeMenu();
      render();
    });

    const scrim = document.getElementById("drawer-scrim");
    if (scrim) {
      scrim.addEventListener("click", () => closeMenu());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
