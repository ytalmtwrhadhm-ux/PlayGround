/* المدرّج — محاكاة البث التكتيكي على Canvas */

function canvasPlayers(m) {
  if (m.lineups) {
    const out = [];
    ["home", "away"].forEach((side) => {
      const team = TEAMS[m[side]];
      m.lineups[side].players.forEach((p) => {
        out.push({
          x: p.x, y: p.y, n: p.n, full: p.full, side,
          c1: team.c1, c2: team.c2, ink: team.ink
        });
      });
    });
    return out;
  }
  const home = [[50, 93], [84, 75], [63, 78], [37, 78], [16, 75], [72, 55], [50, 59], [28, 55], [80, 33], [50, 26], [20, 33]];
  const away = [[50, 7], [84, 26], [63, 22], [37, 22], [16, 26], [70, 48], [50, 52], [30, 48], [80, 70], [50, 78], [20, 70]];
  const out = [];
  home.forEach((p, i) => {
    const t = TEAMS[m.home];
    out.push({ x: p[0], y: p[1], n: i + 1, full: "", side: "home", c1: t.c1, c2: t.c2, ink: t.ink });
  });
  away.forEach((p, i) => {
    const t = TEAMS[m.away];
    out.push({ x: p[0], y: p[1], n: i + 1, full: "", side: "away", c1: t.c1, c2: t.c2, ink: t.ink });
  });
  return out;
}

function drawScene(ctx, W, H, players, now, start, m) {
  if (!W || !H) return;
  const time = (now - start) / 1000;
  const t = state.playing ? time : 0;
  const px = W * 0.06;
  const py = H * 0.09;
  const pw = W * 0.88;
  const ph = H * 0.82;
  const cx = px + pw / 2;
  const cy = py + ph / 2;

  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#04120a");
  bg.addColorStop(0.55, "#061b10");
  bg.addColorStop(1, "#030d08");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(cx, py - H * 0.15, 0, cx, py - H * 0.15, W * 0.7);
  glow.addColorStop(0, "rgba(100, 255, 178, 0.16)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#0a5a32";
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();

  for (let i = 0; i < 10; i += 1) {
    ctx.fillStyle = i % 2 ? "rgba(255, 255, 255, 0.035)" : "rgba(0, 0, 0, 0.045)";
    ctx.fillRect(px + (i * pw) / 10, py, pw / 10, ph);
  }

  const pitchShade = ctx.createLinearGradient(0, py, 0, py + ph);
  pitchShade.addColorStop(0, "rgba(255, 255, 255, 0.07)");
  pitchShade.addColorStop(0.55, "rgba(255, 255, 255, 0.01)");
  pitchShade.addColorStop(1, "rgba(0, 0, 0, 0.2)");
  ctx.fillStyle = pitchShade;
  ctx.fillRect(px, py, pw, ph);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = Math.max(1, H * 0.0022);
  ctx.strokeRect(px, py, pw, ph);
  ctx.beginPath();
  ctx.moveTo(cx, py);
  ctx.lineTo(cx, py + ph);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, ph * 0.15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(1.5, H * 0.004), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fill();

  const boxW = pw * 0.16;
  const boxH = ph * 0.56;
  ctx.strokeRect(px, py + (ph - boxH) / 2, boxW, boxH);
  ctx.strokeRect(px + pw - boxW, py + (ph - boxH) / 2, boxW, boxH);

  const sixW = pw * 0.055;
  const sixH = ph * 0.28;
  ctx.strokeRect(px, py + (ph - sixH) / 2, sixW, sixH);
  ctx.strokeRect(px + pw - sixW, py + (ph - sixH) / 2, sixW, sixH);

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  [px + pw * 0.105, px + pw - pw * 0.105].forEach((sx) => {
    ctx.beginPath();
    ctx.arc(sx, cy, Math.max(1.5, H * 0.004), 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.strokeRect(px - pw * 0.016, py + ph * 0.4, pw * 0.016, ph * 0.2);
  ctx.strokeRect(px + pw, py + ph * 0.4, pw * 0.016, ph * 0.2);

  const light = ctx.createRadialGradient(cx, cy, 0, cx, cy, pw * 0.55);
  light.addColorStop(0, "rgba(255, 255, 255, 0.07)");
  light.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = light;
  ctx.fillRect(px, py, pw, ph);

  const radius = Math.max(6.5, Math.min(13, H * 0.021));

  players.forEach((p, i) => {
    const driftX = Math.sin(t * 0.55 + i * 1.7) * pw * 0.008;
    const driftY = Math.cos(t * 0.62 + i * 1.3) * ph * 0.008;
    const x = px + (p.y / 100) * pw + driftX;
    const y = py + (p.x / 100) * ph + driftY;

    ctx.beginPath();
    ctx.ellipse(x, y + radius * 0.72, radius * 0.95, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
    ctx.fill();

    const grad = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
    grad.addColorStop(0, p.c1);
    grad.addColorStop(1, p.c2);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = Math.max(1.2, radius * 0.16);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = `800 ${Math.max(7, radius * 0.95)}px Cairo, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(p.n), x, y + 0.5);

    if (p.full) {
      const cards = typeof cardsFor === "function" ? cardsFor(m, p.side, p.full) : { yellow: 0, red: 0 };
      if (cards.yellow || cards.red) {
        const cardW = Math.max(3, radius * 0.36);
        const cardH = Math.max(4, radius * 0.52);
        ctx.fillStyle = cards.red ? "#ff4b5f" : "#ffd44f";
        ctx.fillRect(x + radius * 0.62, y - radius * 1.18, cardW, cardH);
      }
    }
  });

  const ballX = px + pw * (0.5 + 0.27 * Math.sin(t * 0.33) + 0.05 * Math.sin(t * 0.9 + 1));
  const ballY = py + ph * (0.5 + 0.23 * Math.cos(t * 0.27 + 0.7));
  const br = Math.max(3.2, H * 0.011);

  for (let k = 3; k >= 1; k -= 1) {
    const tt = Math.max(0, t - k * 0.055);
    const tx = px + pw * (0.5 + 0.27 * Math.sin(tt * 0.33) + 0.05 * Math.sin(tt * 0.9 + 1));
    const ty = py + ph * (0.5 + 0.23 * Math.cos(tt * 0.27 + 0.7));
    ctx.beginPath();
    ctx.arc(tx, ty, br * (1 - k * 0.16), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.24 - k * 0.06})`;
    ctx.fill();
  }

  ctx.save();
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(ballX, ballY, br, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

function mountCanvas(m) {
  const canvas = document.getElementById("match-canvas");
  if (!canvas) return;
  if (state.canvasStop) {
    state.canvasStop();
    state.canvasStop = null;
  }
  const stage = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const scales = { "4K": 2.2, "1080p": 1.6, "720p": 1.2, "480p": 0.9 };
  const scale = Math.min(window.devicePixelRatio || 1, scales[state.quality] || 1.6);
  let W = 0;
  let H = 0;

  function resize() {
    const r = stage.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawScene(ctx, W, H, players, performance.now(), start, m);
  }

  const players = canvasPlayers(m);
  const start = performance.now();
  resize();

  let ro = null;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(resize);
    ro.observe(stage);
  }

  let raf = 0;
  const frame = (now) => {
    drawScene(ctx, W, H, players, now, start, m);
    if (state.playing) raf = requestAnimationFrame(frame);
  };
  if (state.playing) raf = requestAnimationFrame(frame);

  state.canvasStop = () => {
    cancelAnimationFrame(raf);
    if (ro) ro.disconnect();
  };
}
