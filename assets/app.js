/* Kuncung landing page — semua interaksi (tanpa dependensi, tanpa build).
   Data di halaman ini adalah DEMO; tidak ada permintaan jaringan selain font. */
(() => {
  "use strict";

  // ---------------------------------------------------------------- utilitas
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pad = (n) => String(Math.floor(n)).padStart(2, "0");
  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {
        /* abaikan */
      }
    },
  };

  function toast(msg) {
    const box = $("#toasts");
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3100);
  }

  // ---------------------------------------------------------------- ikon
  const P = {
    home: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
    chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
    music: "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
    calendar: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
    timer: "M10 2h4M12 14l3-3M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
    bot: "M12 8V4M8 4h8M5 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM9 13h.01M15 13h.01M9 17h6",
    bolt: "M13 2L3 14h9l-1 8 10-12h-9z",
    bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
    prev: "M19 20L9 12l10-8zM5 4v16",
    next: "M5 4l10 8-10 8zM19 4v16",
    play: "M6 4l14 8-14 8z",
    pause: "M7 4h4v16H7zM13 4h4v16h-4z",
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
    camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    mute: "M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6",
    calc: "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01",
    folder: "M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
    paste: "M9 2h6v4H9zM7 4H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2",
    video: "M23 7l-7 5 7 5zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1z",
    check: "M20 6L9 17l-5-5",
    globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z",
    swap: "M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7",
    cloud: "M18 10h-1.3A7 7 0 1 0 9 19h9a4.5 4.5 0 0 0 0-9z",
    trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0z",
  };
  const FILL = new Set(["play", "pause", "prev", "next"]);
  const ic = (n, s = 18) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${FILL.has(n) ? "currentColor" : "none"}" stroke="currentColor" stroke-width="${FILL.has(n) ? 1.2 : 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;

  // ---------------------------------------------------------------- data demo (market)
  const MK = [
    { s: "BTC", n: "Bitcoin", g: "crypto", v: 64004, c: "$" },
    { s: "ETH", n: "Ethereum", g: "crypto", v: 3120, c: "$" },
    { s: "SOL", n: "Solana", g: "crypto", v: 148, c: "$" },
    { s: "IHSG", n: "Indeks Harga Saham Gabungan", g: "idx", v: 7284, c: "" },
    { s: "BBCA", n: "Bank Central Asia", g: "idx", v: 9150, c: "Rp" },
    { s: "TLKM", n: "Telkom Indonesia", g: "idx", v: 3240, c: "Rp" },
    { s: "S&P 500", n: "S&P 500", g: "us", v: 5412, c: "" },
    { s: "NVDA", n: "NVIDIA", g: "us", v: 128.4, c: "$" },
    { s: "Emas", n: "Emas spot per gram", g: "metal", v: 1340821, c: "Rp" },
    { s: "Perak", n: "Perak spot per gram", g: "metal", v: 16432, c: "Rp" },
    { s: "USD/IDR", n: "Dolar AS ke Rupiah", g: "fx", v: 16320, c: "" },
  ];
  const GROUPS = [
    ["all", "Semua"],
    ["crypto", "Kripto"],
    ["idx", "Saham ID"],
    ["us", "Saham US"],
    ["metal", "Emas & Perak"],
    ["fx", "Kurs"],
  ];
  const mkSubs = new Set();
  let seed = 7;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  MK.forEach((a) => {
    let v = a.v * (1 + (rnd() - 0.5) * 0.02);
    a.series = [];
    for (let i = 0; i < 28; i++) {
      v *= 1 + (rnd() - 0.48) * 0.006;
      a.series.push(v);
    }
    a.v = a.series[27];
    a.open = a.series[0];
  });
  const pct = (a) => ((a.v - a.open) / a.open) * 100;
  const mkBy = (s) => MK.find((a) => a.s === s);
  function fmtPrice(a) {
    if (a.c === "Rp") return a.v >= 1e6 ? `Rp ${(a.v / 1e6).toFixed(2).replace(".", ",")}jt` : `Rp ${Math.round(a.v).toLocaleString("id-ID")}`;
    if (a.c === "$") return `$${a.v >= 1000 ? Math.round(a.v).toLocaleString("en-US") : a.v.toFixed(2)}`;
    return a.v >= 1000 ? Math.round(a.v).toLocaleString("id-ID") : a.v.toFixed(2).replace(".", ",");
  }
  const fmtPct = (p) => `${p > 0.005 ? "+" : p < -0.005 ? "−" : ""}${Math.abs(p).toFixed(2).replace(".", ",")}%`;
  function spark(series, w = 100, h = 22) {
    const mn = Math.min(...series);
    const mx = Math.max(...series);
    const span = mx - mn || 1;
    const pts = series.map((v, i) => `${((i / (series.length - 1)) * w).toFixed(1)},${(2 + (1 - (v - mn) / span) * (h - 4)).toFixed(1)}`).join(" ");
    const up = series[series.length - 1] >= series[0];
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" stroke="var(${up ? "--n-up" : "--n-down"})"/></svg>`;
  }
  setInterval(() => {
    MK.forEach((a) => {
      a.v *= 1 + (rnd() - 0.495) * 0.0035;
      a.series.push(a.v);
      a.series.shift();
    });
    mkSubs.forEach((f) => f());
  }, 2400);

  // ---------------------------------------------------------------- tema
  const THEMES = [
    { id: "parang", name: "Batik Parang", desc: "Cokelat sogan dan emas dengan motif lereng parang yang mengalir.", a: "#e3ae4b", up: "#98d985", down: "#ff8573" },
    { id: "kawung", name: "Batik Kawung", desc: "Biru nila dan krem dengan motif kawung bulat yang tertata.", a: "#f0c75e", up: "#6fe3b3", down: "#ff8c8c" },
    { id: "megamendung", name: "Mega Mendung", desc: "Merah marun khas Cirebon dengan awan biru yang bergulung.", a: "#6ab0ff", up: "#7fe3ad", down: "#ff8780" },
    { id: "signal", name: "Signal Line", desc: "Ink navy dengan garis tepi yang berubah warna mengikuti konteks.", a: "#2de2a7", up: "#2de2a7", down: "#ff6b81" },
    { id: "obsidian", name: "Obsidian", desc: "Hitam pekat klasik ala notch: bersih, netral, tanpa gangguan.", a: "#a3e635", up: "#30d158", down: "#ff453a" },
    { id: "glass", name: "Liquid Glass", desc: "Kaca tembus pandang dengan kilau dan highlight lembut.", a: "#8ab4ff", up: "#5ef0b0", down: "#ff7a8a" },
    { id: "terminal", name: "Terminal", desc: "Monokrom fosfor hijau, sudut tajam, gaya terminal trading.", a: "#39ff88", up: "#39ff88", down: "#ff4d4d" },
    { id: "paper", name: "Paper", desc: "Terang krem hangat dengan huruf serif. Tenang di mata.", a: "#ff7a59", up: "#3fbf7f", down: "#ff6b5e" },
    { id: "aurora", name: "Aurora", desc: "Gradien hidup ungu-tosca yang bergerak pelan.", a: "#a78bfa", up: "#34d399", down: "#fb7185" },
  ];
  let themeId = "parang";
  function setTheme(id, say) {
    const t = THEMES.find((x) => x.id === id) || THEMES[0];
    themeId = t.id;
    const r = document.documentElement;
    r.dataset.theme = t.id;
    r.style.setProperty("--accent", t.a);
    r.style.setProperty("--up", t.up);
    r.style.setProperty("--down", t.down);
    r.style.setProperty("--accent-ink", { glass: "#07142e", aurora: "#12062e", parang: "#2b1a0e", kawung: "#101c44", megamendung: "#08172e" }[t.id] || "#06110c");
    ["#gn", "#ex-frame", "#td-notch"].forEach((s) => ($(s).dataset.nt = t.id));
    $$(".strip").forEach((b) => {
      const on = b.dataset.nt === t.id;
      b.classList.toggle("sel", on);
      b.setAttribute("aria-pressed", String(on));
    });
    store.set("gn-theme", t.id);
    if (say) toast(`Gaya “${t.name}” dipakai`);
  }

  // ---------------------------------------------------------------- tampilan (views)
  const SONG = ["Lampu kota menyala pelan", "Kita berjalan tanpa tujuan", "Di layar kecil di tepi malam", "Garis sinyal menyala biru", "Harga naik, hatiku ikut", "Jam berdetak, waktu lewat", "Biarkan musik tetap menyala", "Sampai fajar menjemput kita"];
  const PRAYER = [
    ["Subuh", 4, 5],
    ["Terbit", 5, 23],
    ["Dzuhur", 11, 39],
    ["Ashar", 15, 0],
    ["Maghrib", 17, 51],
    ["Isya", 19, 4],
  ];
  const ADHAN = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
  function prayerState(now = new Date()) {
    const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const list = PRAYER.map(([n, h, m]) => ({ n, t: h * 60 + m }));
    const adh = list.filter((p) => ADHAN.includes(p.n));
    let next = adh.find((p) => p.t > mins);
    let prevT;
    if (next) {
      const before = adh.filter((p) => p.t <= mins);
      prevT = before.length ? before[before.length - 1].t : adh[adh.length - 1].t - 1440;
    } else {
      next = { n: adh[0].n, t: adh[0].t + 1440 };
      prevT = adh[adh.length - 1].t;
    }
    const left = next.t - mins;
    return { list, next, left, progress: Math.max(0, Math.min(1, (mins - prevT) / (next.t - prevT))), mins };
  }
  const cdown = (m) => {
    const t = Math.max(0, Math.round(m));
    return t >= 60 ? `${Math.floor(t / 60)}j ${t % 60}m` : `${t}m`;
  };
  const hhmm = (t) => `${pad((t / 60) % 24)}:${pad(t % 60)}`;
  const ringSvg = (size, stroke, color, progress, id) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--n-line)" stroke-width="${stroke}"/><circle ${id ? `id="${id}"` : ""} cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - progress)).toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})" style="transition:stroke-dashoffset .6s ease"/></svg>`;
  };

  const marketRow = (a, btn) => {
    const p = pct(a);
    const cls = p > 0.005 ? "u" : p < -0.005 ? "d" : "";
    const inner = `<b>${esc(a.s)}</b>${spark(a.series)}<span class="px num" data-px="${esc(a.s)}">${fmtPrice(a)}</span><span class="pc ${cls}" data-pc="${esc(a.s)}">${fmtPct(p)}</span>`;
    return btn ? `<button class="mrow" data-sym="${esc(a.s)}" title="${esc(a.n)}">${inner}</button>` : `<div class="mrow" title="${esc(a.n)}">${inner}</div>`;
  };
  function tickPrices(root) {
    $$("[data-px]", root).forEach((el) => {
      const a = mkBy(el.dataset.px);
      if (a) el.textContent = fmtPrice(a);
    });
    $$("[data-pc]", root).forEach((el) => {
      const a = mkBy(el.dataset.pc);
      if (!a) return;
      const p = pct(a);
      el.textContent = fmtPct(p);
      el.className = `pc ${p > 0.005 ? "u" : p < -0.005 ? "d" : ""}`;
    });
    $$(".mrow", root).forEach((row) => {
      const s = row.querySelector("[data-px]")?.dataset.px;
      const a = s && mkBy(s);
      const old = row.querySelector(".spark");
      if (a && old) old.outerHTML = spark(a.series);
    });
  }

  const VIEWS = {
    home: {
      title: "Beranda",
      icon: "home",
      mount(el) {
        const d = new Date();
        let hijri = "";
        try {
          hijri = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(d);
        } catch {
          /* tidak didukung */
        }
        el.innerHTML = `<div class="v-home">
          <div class="vcard h-clock"><div class="big-t num" id="h-t"></div><div class="dim" style="font-size:11.5px;margin:7px 0 8px">${esc(hijri)}</div><span class="chip">✓ 3 tugas</span></div>
          <div class="vcard h-market"><span class="vlbl">Market · demo</span>${["BTC", "IHSG", "S&P 500", "Emas"].map((s) => marketRow(mkBy(s))).join("")}</div>
          <div class="vcard h-music"><span class="vlbl">Sedang diputar</span><div style="display:flex;gap:10px;align-items:center"><span class="art-s" style="width:42px;height:42px;border-radius:10px"></span><div><b style="font-size:13px">Midnight Signal</b><div class="dim" style="font-size:11.5px">Grez Demo</div></div></div><div class="bar" style="margin-top:12px"><i style="width:38%"></i></div></div>
          <div class="vcard h-prayer"><div style="display:flex;align-items:center;gap:10px"><div id="h-ring" style="width:54px;height:54px"></div><div><span class="vlbl" style="margin:0">Berikutnya</span><b id="h-pn" style="font-size:16px"></b><div class="num dim" id="h-pt" style="font-size:12px;white-space:nowrap"></div></div></div></div>
          <div class="vcard h-weather"><div style="display:flex;align-items:center;gap:10px">${ic("cloud", 30)}<div><div class="big-t num" style="font-size:26px">31°</div><span class="dim" style="font-size:12px">Gerimis · contoh</span></div></div></div>
        </div>`;
        const clock = () => {
          const n = new Date();
          $("#h-t", el).innerHTML = `${pad(n.getHours())}:${pad(n.getMinutes())}<small>${pad(n.getSeconds())}</small>`;
          const st = prayerState(n);
          $("#h-ring", el).innerHTML = ringSvg(54, 5, "var(--n-gold)", st.progress);
          $("#h-pn", el).textContent = st.next.n;
          $("#h-pt", el).textContent = `${hhmm(st.next.t)} · ${cdown(st.left)}`;
        };
        clock();
        const t = setInterval(clock, 1000);
        const sub = () => tickPrices(el);
        mkSubs.add(sub);
        return () => {
          clearInterval(t);
          mkSubs.delete(sub);
        };
      },
    },

    market: {
      title: "Market",
      icon: "chart",
      mount(el) {
        let group = "all";
        el.innerHTML = `<div class="v-market"><div class="chips" role="group" aria-label="Kelompok aset">${GROUPS.map(([id, l]) => `<button class="chipb" data-g="${id}" aria-pressed="${id === "all"}">${l}</button>`).join("")}</div><div class="v-list" id="mk-list"></div><div class="v-foot" id="mk-foot">Klik baris untuk memasang alert harga (demo) · data demo, bukan harga pasar.</div></div>`;
        const list = $("#mk-list", el);
        const draw = () => {
          list.innerHTML = MK.filter((a) => group === "all" || a.g === group).map((a) => marketRow(a, true)).join("");
        };
        draw();
        el.addEventListener("click", (e) => {
          const g = e.target.closest("[data-g]");
          if (g) {
            group = g.dataset.g;
            $$("[data-g]", el).forEach((b) => b.setAttribute("aria-pressed", String(b === g)));
            draw();
            return;
          }
          const row = e.target.closest("[data-sym]");
          if (row) {
            const a = mkBy(row.dataset.sym);
            const target = a.c === "$" ? `$${Math.round(a.v * 1.03).toLocaleString("en-US")}` : fmtPrice({ ...a, v: a.v * 1.03 });
            $$(".mrow", el).forEach((r) => r.classList.toggle("on", r === row));
            toast(`Alert dipasang: ${a.s} naik ke ≥ ${target}`);
          }
        });
        const sub = () => tickPrices(el);
        mkSubs.add(sub);
        return () => mkSubs.delete(sub);
      },
    },

    sports: {
      title: "Olahraga",
      icon: "trophy",
      mount(el) {
        // Data contoh (bukan hasil resmi). Format: balap = [nama, tim, poin]; liga = [klub, main, selisih gol, poin].
        const TABS = [
          { id: "motogp", l: "MotoGP", race: true },
          { id: "f1", l: "F1", race: true },
          { id: "ucl", l: "Liga Champions Eropa" },
          { id: "epl", l: "Liga Inggris" },
          { id: "laliga", l: "Liga Spanyol" },
          { id: "seriea", l: "Liga Italia" },
          { id: "bundesliga", l: "Liga Jerman" },
          { id: "eredivisie", l: "Liga Belanda" },
          { id: "ligue1", l: "Liga Perancis" },
          { id: "liga1", l: "Liga Indonesia" },
        ];
        const CLS = ["MotoGP", "Moto2", "Moto3"];
        const D = {
          motogp: [["Marc Marquez", "Ducati Lenovo Team", 431], ["Jorge Martin", "Aprilia Racing", 371], ["Marco Bezzecchi", "Aprilia Racing", 357], ["Pedro Acosta", "Red Bull KTM Factory Racing", 309], ["Ai Ogura", "Trackhouse MotoGP Team", 294], ["Fabio Di Giannantonio", "Pertamina Enduro VR46", 282]],
          moto2: [["Manuel Gonzalez", "Liqui Moly Dynavolt Intact GP", 286.5], ["Izan Guevara", "Pramac Yamaha Moto2", 273], ["Ivan Ortola", "QJMOTOR - MSI", 219.5], ["Daniel Holgado", "CFMOTO Aspar Team", 215], ["David Alonso", "CFMOTO Aspar Team", 204], ["Senna Agius", "Liqui Moly Dynavolt Intact GP", 175]],
          moto3: [["Maximo Quiles", "CFMOTO Gaviota Aspar Team", 392], ["David Almansa", "Liqui Moly Dynavolt Intact GP", 253], ["Alvaro Carpe", "Red Bull KTM Ajo", 216], ["Brian Uriarte", "Red Bull KTM Ajo", 207], ["Adrian Fernandez", "Leopard Racing", 177], ["Veda Pratama", "Honda Team Asia", 144]],
          f1: [["Andrea Kimi Antonelli", "Mercedes", 390], ["Max Verstappen", "Red Bull", 279], ["George Russell", "Mercedes", 262], ["Lewis Hamilton", "Ferrari", 261], ["Charles Leclerc", "Ferrari", 249], ["Lando Norris", "McLaren", 246]],
          ucl: [["Paris Saint-Germain", 4, 15, 12], ["Real Madrid", 4, 6, 12], ["Arsenal", 4, 5, 10], ["Como", 4, 13, 9], ["Barcelona", 4, 8, 9], ["Aston Villa", 4, 6, 9]],
          epl: [["Arsenal", 10, 10, 27], ["Brighton & Hove Albion", 10, 19, 22], ["Manchester City", 10, 8, 21], ["Liverpool", 10, 4, 18], ["Chelsea", 10, 3, 16], ["Everton", 10, 2, 16]],
          laliga: [["Barcelona", 12, 35, 33], ["Real Madrid", 12, 21, 30], ["Atlético Madrid", 12, 13, 28], ["Real Betis", 12, 5, 26], ["Real Sociedad", 12, 1, 22], ["Sevilla", 12, -2, 18]],
          seriea: [["Lazio", 11, 16, 29], ["Internazionale", 11, 15, 28], ["AS Roma", 11, 21, 27], ["AC Milan", 11, 10, 24], ["Como", 11, 8, 23], ["Frosinone", 11, 9, 20]],
          bundesliga: [["Bayern Munich", 9, 20, 21], ["Borussia Dortmund", 9, 9, 21], ["SC Freiburg", 9, 10, 19], ["RB Leipzig", 9, 14, 18], ["Bayer Leverkusen", 9, 3, 16], ["Werder Bremen", 9, 2, 15]],
          eredivisie: [["PSV Eindhoven", 12, 25, 26], ["Feyenoord", 12, 19, 25], ["Ajax", 12, 17, 25], ["FC Twente", 12, 18, 24], ["AZ Alkmaar", 12, 8, 23], ["Heerenveen", 12, 8, 21]],
          ligue1: [["Paris Saint-Germain", 10, 12, 23], ["Lille", 10, 7, 21], ["Paris FC", 10, 7, 20], ["Marseille", 10, 8, 18], ["Lyon", 10, 6, 17], ["Nice", 10, 3, 17]],
          liga1: [["Persib Bandung", 34, 37, 79], ["Borneo FC", 34, 43, 79], ["Persija", 34, 36, 71], ["Persebaya Surabaya", 34, 26, 58], ["Bhayangkara Presisi", 34, 8, 53], ["Malut United", 34, 15, 53]],
        };
        // Hasil seri contoh (hasil nyata satu akhir pekan, hanya untuk demo). [posisi, nama, tim, waktu/selisih, poin]
        const RACES = {
          motogp: {
            name: "Grand Prix of Qatar",
            place: "Lusail International Circuit · Doha, Qatar",
            date: "Min, 8 Nov",
            race: [[1, "Marco Bezzecchi", "Aprilia Racing", "41:29.173", 25], [2, "Marc Marquez", "Ducati Lenovo Team", "+3.083", 20], [3, "Raul Fernandez", "SuperFile Trackhouse MotoGP Team", "+3.614", 16], [4, "Ai Ogura", "SuperFile Trackhouse MotoGP Team", "+4.885", 13], [5, "Enea Bastianini", "Red Bull KTM Tech3", "+6.948", 11]],
            sprint: [[1, "Marc Marquez", "Ducati Lenovo Team", "18:46.450", 12], [2, "Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", "+0.862", 9], [3, "Jorge Martin", "Aprilia Racing", "+1.519", 7], [4, "Raul Fernandez", "SuperFile Trackhouse MotoGP Team", "+2.700", 6], [5, "Johann Zarco", "Castrol Honda LCR", "+3.720", 5]],
          },
          f1: {
            name: "Miami Grand Prix",
            place: "Miami International Autodrome · Miami, USA",
            date: "Min, 3 Mei",
            race: [[1, "Andrea Kimi Antonelli", "Mercedes", "1:33:19.273", 25], [2, "Lando Norris", "McLaren", "+3.264", 18], [3, "Oscar Piastri", "McLaren", "+27.092", 15], [4, "George Russell", "Mercedes", "+43.051", 12], [5, "Max Verstappen", "Red Bull", "+48.949", 10]],
            sprint: [[1, "Lando Norris", "McLaren", "29:15.045", 8], [2, "Oscar Piastri", "McLaren", "+3.766", 7], [3, "Charles Leclerc", "Ferrari", "+6.251", 6], [4, "George Russell", "Mercedes", "+12.951", 5], [5, "Max Verstappen", "Red Bull", "+13.639", 4]],
          },
        };
        let tab = "motogp";
        let cls = "motogp";
        let sub = "races"; // balap: "races" (Seri balapan) atau "table" (Klasemen)
        let ses = "race"; // "race" (Race utama, bawaan) atau "sprint"
        el.innerHTML = `<div class="v-sports"><div class="sp-tabs" id="sp-tabs" role="tablist" aria-label="Kejuaraan">${TABS.map((t) => `<button class="chipb" role="tab" data-t="${t.id}" aria-selected="${t.id === tab}" aria-pressed="${t.id === tab}">${esc(t.l)}</button>`).join("")}</div><div class="sp-sub" id="sp-sub"></div><div class="sp-body" id="sp-body" role="tabpanel"></div><div class="v-foot">Data contoh, bukan hasil resmi. Aplikasi menampilkan data terbaru, termasuk hasil Race utama dan Sprint tiap seri, pertandingan terakhir, dan klasemen.</div></div>`;
        const raceDetail = () => {
          if (tab === "motogp" && cls !== "motogp") return `<p class="sp-note">Contoh hasil seri hanya untuk kelas MotoGP. Di aplikasi, Moto2 dan Moto3 juga punya hasil tiap seri (tanpa sprint).</p>`;
          const R = RACES[tab];
          const rows = R[ses];
          return `<div class="sp-det"><b class="sp-gp">${esc(R.name)}</b><small>${esc(R.place)} · ${esc(R.date)}</small><div class="sp-ses" role="group" aria-label="Sesi">${[["race", "Race utama"], ["sprint", "Sprint"]].map(([k, l]) => `<button class="chipb" data-k="${k}" aria-pressed="${k === ses}">${l}</button>`).join("")}</div>${rows.map((r) => `<div class="sp-r rs"><span class="rk">${r[0]}</span><span class="nm"><b>${esc(r[1])}</b><small>${esc(r[2])}</small></span><span class="num t">${esc(r[3])}</span><span class="num pts">${r[4]}</span></div>`).join("")}</div>`;
        };
        const draw = () => {
          const T = TABS.find((x) => x.id === tab);
          const racing = !!T.race;
          $("#sp-sub", el).innerHTML = `${racing ? [["races", "Seri balapan"], ["table", "Klasemen"]].map(([k, l]) => `<button class="chipb" data-s="${k}" aria-pressed="${k === sub}">${l}</button>`).join("") : `<span class="sp-pill" aria-hidden="true">Klasemen</span>`}${T.id === "motogp" ? `<span class="sp-gap" aria-hidden="true"></span>${CLS.map((c) => `<button class="chipb" data-c="${c.toLowerCase()}" aria-pressed="${c.toLowerCase() === cls}">${c}</button>`).join("")}` : ""}`;
          if (racing && sub === "races") {
            $("#sp-body", el).innerHTML = raceDetail();
            return;
          }
          const rows = D[T.id === "motogp" ? cls : T.id];
          $("#sp-body", el).innerHTML = T.race
            ? rows.map((r, i) => `<div class="sp-r"><span class="rk">${i + 1}</span><span class="nm"><b>${esc(r[0])}</b><small>${esc(r[1])}</small></span><span class="num pts">${String(r[2]).replace(".", ",")}</span></div>`).join("")
            : `<div class="sp-r hd"><span class="rk">#</span><span class="nm">Klub</span><span class="num">M</span><span class="num">SG</span><span class="num">Poin</span></div>` +
              rows.map((r, i) => `<div class="sp-r fb"><span class="rk">${i + 1}</span><span class="nm"><b>${esc(r[0])}</b></span><span class="num">${r[1]}</span><span class="num">${r[2] > 0 ? "+" : ""}${r[2]}</span><span class="num pts">${r[3]}</span></div>`).join("");
        };
        draw();
        el.addEventListener("click", (e) => {
          const t = e.target.closest("[data-t]");
          const c = e.target.closest("[data-c]");
          const sb = e.target.closest("[data-s]");
          const k = e.target.closest("[data-k]");
          if (sb) {
            sub = sb.dataset.s;
            draw();
          } else if (k) {
            ses = k.dataset.k;
            draw();
          } else if (t) {
            tab = t.dataset.t;
            $$("[data-t]", el).forEach((b) => {
              b.setAttribute("aria-selected", String(b === t));
              b.setAttribute("aria-pressed", String(b === t));
            });
            draw();
          } else if (c) {
            cls = c.dataset.c;
            draw();
          }
        });
        return () => {};
      },
    },

    music: {
      title: "Musik",
      icon: "music",
      mount(el) {
        el.innerHTML = `<div class="v-music"><div><div class="m-art" role="img" aria-label="Cover album contoh"></div><div class="m-meta"><b>Midnight Signal</b><span>Grez Demo · Lagu contoh</span></div><div class="bar"><i id="mu-bar" style="width:0%"></i></div><div class="m-ctl"><button class="ibtn" aria-label="Sebelumnya" data-a="prev">${ic("prev", 16)}</button><button class="ibtn play" aria-label="Jeda" data-a="toggle">${ic("pause", 18)}</button><button class="ibtn" aria-label="Berikutnya" data-a="next">${ic("next", 16)}</button></div></div><div class="m-ly" id="mu-ly" aria-label="Lirik tersinkron contoh">${SONG.map((l, i) => `<p data-i="${i}">${esc(l)}</p>`).join("")}</div></div>`;
        let i = 0;
        let playing = true;
        let t = 0;
        const lines = $$("#mu-ly p", el);
        const show = () => {
          lines.forEach((p, k) => p.classList.toggle("on", k === i));
          const L = $("#mu-ly", el);
          const cur = lines[i];
          L.scrollTo?.({ top: 0 });
          lines.forEach((p, k) => (p.style.display = Math.abs(k - i) <= 3 ? "" : "none"));
          $("#mu-bar", el).style.width = `${((i + 1) / SONG.length) * 100}%`;
          void cur;
        };
        show();
        const timer = setInterval(() => {
          if (!playing) return;
          t++;
          if (t % 2 === 0) {
            i = (i + 1) % SONG.length;
            show();
          }
        }, 1400);
        el.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]");
          const l = e.target.closest("[data-i]");
          if (l) {
            i = +l.dataset.i;
            show();
          } else if (b) {
            const a = b.dataset.a;
            if (a === "toggle") {
              playing = !playing;
              b.innerHTML = ic(playing ? "pause" : "play", 18);
              b.setAttribute("aria-label", playing ? "Jeda" : "Putar");
            } else {
              i = (i + (a === "next" ? 1 : SONG.length - 1)) % SONG.length;
              show();
            }
          }
        });
        return () => clearInterval(timer);
      },
    },

    prayer: {
      title: "Shalat",
      icon: "moon",
      mount(el) {
        el.innerHTML = `<div class="v-prayer"><div><div class="ring-c"><div id="pr-ring" style="width:100%;height:100%"></div><div class="in"><span class="vlbl" style="margin:0">Menuju</span><b id="pr-n"></b><span class="num" id="pr-l"></span><span class="num dim" id="pr-t" style="font-size:12px"></span></div></div><p class="dim" style="text-align:center;font-size:11.5px;margin:10px 0 0">Contoh jadwal Jakarta · metode Kemenag</p></div><div class="p-list" id="pr-list"></div></div>`;
        const draw = () => {
          const st = prayerState();
          $("#pr-ring", el).innerHTML = ringSvg(150, 9, "var(--n-gold)", st.progress);
          $("#pr-n", el).textContent = st.next.n;
          $("#pr-l", el).textContent = cdown(st.left);
          $("#pr-t", el).textContent = hhmm(st.next.t);
          $("#pr-list", el).innerHTML = st.list.map((p) => `<div class="p-row ${p.n === st.next.n ? "on" : p.t < st.mins ? "past" : ""}"><b style="font-weight:550">${p.n}</b><span class="num">${hhmm(p.t)}</span></div>`).join("");
        };
        draw();
        const t = setInterval(draw, 5000);
        return () => clearInterval(t);
      },
    },

    calendar: {
      title: "Kalender",
      icon: "calendar",
      mount(el) {
        const n = new Date();
        const first = new Date(n.getFullYear(), n.getMonth(), 1);
        const off = (first.getDay() + 6) % 7;
        const days = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"].map((d) => `<span class="w">${d}</span>`).join("");
        const evDays = new Set([n.getDate(), n.getDate() + 1, n.getDate() + 3, n.getDate() - 2]);
        const cells = Array.from({ length: 42 }, (_, i) => {
          const d = new Date(n.getFullYear(), n.getMonth(), 1 - off + i);
          const cur = d.getMonth() === n.getMonth();
          return `<span class="${cur ? "" : "o"} ${cur && d.getDate() === n.getDate() ? "t" : ""} ${cur && evDays.has(d.getDate()) ? "e" : ""}">${d.getDate()}</span>`;
        }).join("");
        el.innerHTML = `<div class="v-cal"><div><b style="font-family:var(--n-head);text-transform:capitalize;display:block;margin-bottom:8px">${n.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</b><div class="cal-grid">${days}${cells}</div></div><div><span class="vlbl">Hari ini · acara contoh</span>
          <div class="ev"><span class="tm num">10:00 – 10:45</span><span class="nm"><b style="font-weight:600">Rapat tim mingguan</b><small>Google Meet</small></span><button class="nbtn" data-join="Rapat tim mingguan">${ic("video", 13)} Join</button></div>
          <div class="ev"><span class="tm num">12:30 – 13:30</span><span class="nm"><b style="font-weight:600">Makan siang dengan klien</b><small>Kafe Tengah</small></span></div>
          <div class="ev"><span class="tm num">15:00 – 16:00</span><span class="nm"><b style="font-weight:600">Review desain</b><small>Zoom</small></span><button class="nbtn" data-join="Review desain">${ic("video", 13)} Join</button></div></div></div>`;
        el.addEventListener("click", (e) => {
          const b = e.target.closest("[data-join]");
          if (b) toast(`Membuka tautan rapat “${b.dataset.join}” (demo)`);
        });
        return null;
      },
    },

    ai: {
      title: "Asisten AI",
      icon: "bot",
      mount(el) {
        el.innerHTML = `<div class="v-ai"><div class="ai-msgs" id="ai-msgs" aria-live="polite"></div><form class="ai-in" id="ai-form"><label class="sr" for="ai-q" style="position:absolute;left:-9999px">Pesan</label><input id="ai-q" autocomplete="off" placeholder="Tulis pesan… (demo, tanpa server)" /><button class="nbtn" type="submit" aria-label="Kirim">${ic("send", 15)}</button></form></div>`;
        const box = $("#ai-msgs", el);
        let busy = false;
        let timer = null;
        const add = (cls, html) => {
          const m = document.createElement("div");
          m.className = `msg ${cls}`;
          m.innerHTML = `<div class="bub">${html}</div>`;
          box.appendChild(m);
          box.scrollTop = box.scrollHeight;
          return m.firstChild;
        };
        const stream = (html) => {
          const b = add("a", "");
          busy = true;
          b.classList.add("caret");
          let k = 0;
          timer = setInterval(() => {
            k += 3;
            b.innerHTML = html.slice(0, k);
            box.scrollTop = box.scrollHeight;
            if (k >= html.length) {
              clearInterval(timer);
              b.classList.remove("caret");
              busy = false;
            }
          }, 22);
        };
        add("u", "Ringkas catatan rapat tadi jadi 3 poin");
        setTimeout(() => stream("Tentu. Ringkasan singkat:<ul><li>Peluncuran v0.2 dimajukan ke minggu depan.</li><li>Desain notch gaya baru disetujui.</li><li>Tugas: siapkan installer dan catatan rilis.</li></ul>"), 500);
        $("#ai-form", el).addEventListener("submit", (e) => {
          e.preventDefault();
          const q = $("#ai-q", el);
          const v = q.value.trim();
          if (!v || busy) return;
          q.value = "";
          add("u", esc(v));
          setTimeout(() => stream(`Ini jawaban <strong>demo</strong> untuk “${esc(v.slice(0, 60))}”. Di aplikasi asli, jawaban mengalir dari penyedia pilihanmu (Claude, OpenAI, Gemini, atau Ollama lokal).`), 350);
        });
        return () => clearInterval(timer);
      },
    },

    deck: {
      title: "Deck",
      icon: "bolt",
      mount(el) {
        const D = [
          ["camera", "Screenshot", "win+shift+s"],
          ["play", "Putar / jeda", "playpause"],
          ["mute", "Senyap", "mute"],
          ["calc", "Kalkulator", "calc"],
          ["folder", "Folder proyek", "D:\\Proyek"],
          ["paste", "Template balasan", "tempel teks"],
        ];
        el.innerHTML = `<p class="dim" style="margin:0 0 10px;font-size:12px">Klik tombol (demo): pintasan, buka app/file/link, perintah, atau tempel teks.</p><div class="v-deck">${D.map(([i, l, v]) => `<button class="dk" data-l="${esc(l)}" data-v="${esc(v)}">${ic(i, 22)}<span>${esc(l)}</span><small>${esc(v)}</small></button>`).join("")}</div>`;
        el.addEventListener("click", (e) => {
          const b = e.target.closest(".dk");
          if (b) toast(`Menjalankan “${b.dataset.l}” → ${b.dataset.v} (demo)`);
        });
        return null;
      },
    },

    focus: {
      title: "Fokus & tugas",
      icon: "timer",
      mount(el) {
        el.innerHTML = `<div class="v-foc"><div class="vcard" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><div class="ring-c" style="width:120px;height:120px"><div id="fo-ring" style="width:100%;height:100%"></div><div class="in"><span class="vlbl" style="margin:0" id="fo-l">Siap fokus</span><span class="num" id="fo-t" style="font-size:22px;font-weight:600">25:00</span></div></div><button class="nbtn" id="fo-b">${ic("play", 12)} Mulai</button></div>
        <div><label for="fo-in" class="vlbl">Tambah tugas (coba: “rapat besok jam 10” atau “kirim laporan 30 menit lagi”)</label><input class="gn-input" id="fo-in" autocomplete="off" placeholder="Ketik tugas dengan bahasa natural…" /><div class="parse" id="fo-parse" aria-live="polite"></div><div id="fo-list"></div></div></div>`;
        const total = 25 * 60;
        let left = total;
        let run = false;
        const ringEl = $("#fo-ring", el);
        const draw = () => {
          ringEl.innerHTML = ringSvg(120, 8, "var(--n-accent)", 1 - left / total);
          $("#fo-t", el).textContent = `${pad(left / 60)}:${pad(left % 60)}`;
          $("#fo-l", el).textContent = run ? "Fokus" : left === total ? "Siap fokus" : "Jeda";
        };
        draw();
        const timer = setInterval(() => {
          if (run && left > 0) {
            left--;
            draw();
          }
        }, 1000);
        $("#fo-b", el).addEventListener("click", (e) => {
          run = !run;
          e.currentTarget.innerHTML = run ? `${ic("pause", 12)} Jeda` : `${ic("play", 12)} Lanjut`;
          draw();
        });
        const tasks = [{ t: "Balas email klien", w: "Hari ini 16:00" }];
        const list = () => {
          $("#fo-list", el).innerHTML = tasks.map((k) => `<div class="todo"><i></i><span>${esc(k.t)}${k.w ? `<small>${esc(k.w)}</small>` : ""}</span></div>`).join("");
        };
        list();
        const inp = $("#fo-in", el);
        inp.addEventListener("input", () => {
          const r = parseTask(inp.value);
          $("#fo-parse", el).innerHTML = inp.value.trim() ? `<span class="dim">Judul:</span> <b>${esc(r.text)}</b>${r.when ? ` <span class="tag">${esc(r.when)}</span>` : ""}` : "";
        });
        inp.addEventListener("keydown", (e) => {
          if (e.key !== "Enter" || !inp.value.trim()) return;
          const r = parseTask(inp.value);
          tasks.unshift({ t: r.text, w: r.when });
          inp.value = "";
          $("#fo-parse", el).innerHTML = "";
          list();
        });
        return () => clearInterval(timer);
      },
    },

    translate: {
      title: "Translate",
      icon: "globe",
      mount(el) {
        // Terjemahan contoh (bukan hasil langsung). Aplikasi menerjemahkan teks apa pun lewat Google Translate dengan cadangan MyMemory.
        const PH = [["Selamat pagi, apa kabar?", {"en": "Good morning, how are you?", "ja": "おはようございます、お元気ですか？", "ar": "صباح الخير، كيف حالك؟", "ko": "좋은 아침이에요, 잘 지내요?", "es": "Buenos días, ¿cómo estás?"}], ["Terima kasih banyak atas bantuannya.", {"en": "Thank you very much for your help.", "ja": "大変お世話になりありがとうございました。", "ar": "شكرا جزيلا لمساعدتكم.", "ko": "도움을 주셔서 대단히 감사합니다.", "es": "Muchas gracias por tu ayuda."}], ["Di mana stasiun terdekat?", {"en": "Where is the nearest station?", "ja": "最寄りの駅はどこですか?", "ar": "أين هي أقرب محطة؟", "ko": "가장 가까운 역은 어디입니까?", "es": "¿Dónde está la estación más cercana?"}], ["Rapatnya dimulai pukul sepuluh.", {"en": "The meeting started at ten o'clock.", "ja": "会議は10時に始まりました。", "ar": "بدأ الاجتماع في الساعة العاشرة صباحا.", "ko": "회의는 10시에 시작되었습니다.", "es": "La reunión comenzó a las diez en punto."}]];
        const LANGS = [["en", "Inggris"], ["ja", "Jepang"], ["ar", "Arab"], ["ko", "Korea"], ["es", "Spanyol"]];
        let pi = 0;
        let to = "en";
        el.innerHTML = `<div class="v-translate"><div class="tr-bar"><span class="chip">Deteksi otomatis</span><span class="tr-sw" aria-hidden="true">${ic("swap", 15)}</span><div class="tr-langs" role="group" aria-label="Bahasa tujuan">${LANGS.map(([k, l]) => `<button class="chipb" data-l="${k}" aria-pressed="${k === to}">${l}</button>`).join("")}</div></div><div class="tr-panes"><div class="tr-pane"><div class="tr-txt" id="tr-in"></div><div class="tr-foot"><span class="chip">terdeteksi: Indonesia</span></div></div><div class="tr-pane"><div class="tr-txt" id="tr-out" lang="en"></div><div class="tr-foot"><span>Google Translate</span></div></div></div><div class="tr-ph" role="group" aria-label="Contoh kalimat">${PH.map((p, i) => `<button class="chipb" data-p="${i}" aria-pressed="${i === pi}">${esc(p[0])}</button>`).join("")}</div><div class="v-foot">Kalimat dan terjemahan contoh. Di aplikasi kamu mengetik atau menempel teks apa pun (sampai 5000 karakter) dan hasilnya muncul otomatis.</div></div>`;
        const draw = () => {
          $("#tr-in", el).textContent = PH[pi][0];
          const out = $("#tr-out", el);
          out.textContent = PH[pi][1][to];
          out.lang = to;
          out.dir = to === "ar" ? "rtl" : "ltr";
          $$("[data-l]", el).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === to)));
          $$("[data-p]", el).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.p === pi)));
        };
        draw();
        el.addEventListener("click", (e) => {
          const l = e.target.closest("[data-l]");
          const q = e.target.closest("[data-p]");
          if (l) to = l.dataset.l;
          else if (q) pi = +q.dataset.p;
          else return;
          draw();
        });
        return () => {};
      },
    },

    notif: {
      title: "Notifikasi",
      icon: "bell",
      mount(el) {
        const SAMPLE = [
          ["Grup Keluarga", "Jadi ketemu jam 7 malam?"],
          ["Server", "Deploy v0.2 selesai tanpa error"],
          ["Tagihan", "Pembayaran listrik jatuh tempo besok"],
          ["Komunitas", "3 balasan baru di utas kamu"],
        ];
        let n = 0;
        el.innerHTML = `<div class="v-nt"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="dim" style="font-size:12px">Contoh notifikasi Windows di notch (fitur opsional, butuh izin Windows).</span><button class="nbtn" id="nt-send">${ic("bell", 13)} Kirim contoh</button></div><div class="nt-list" id="nt-list"><div class="empty">${ic("bell", 24)}<span>Klik “Kirim contoh” untuk melihat notifikasi masuk.</span></div></div></div>`;
        const listEl = $("#nt-list", el);
        $("#nt-send", el).addEventListener("click", () => {
          const [a, b] = SAMPLE[n++ % SAMPLE.length];
          if (listEl.querySelector(".empty")) listEl.innerHTML = "";
          const d = document.createElement("div");
          d.className = "nt-i";
          d.innerHTML = `<b>${esc(a)}</b><small>${esc(b)}</small>`;
          listEl.prepend(d);
          if (GN.state() === "closed") GN.peek("bell", a, b);
        });
        return null;
      },
    },
  };

  // parser tugas bahasa natural (versi ringkas dari aplikasi)
  function parseTask(input) {
    const now = new Date();
    let s = ` ${input.trim()} `;
    let day = null;
    let h = null;
    let mi = 0;
    let rel = null;
    const cut = (re, fn) => {
      const m = s.match(re);
      if (m) {
        fn(m);
        s = s.replace(re, " ");
      }
    };
    const relMs = (n, u) => (/^m/i.test(u) ? n * 60000 : /^(j|h)/i.test(u) ? n * 3600000 : n * 86400000);
    cut(/\s(?:dalam|in)\s+(\d+)\s*(menit|jam|hari|min\w*|hours?|days?)\s/i, (m) => (rel = relMs(+m[1], m[2])));
    if (rel === null) cut(/\s(\d+)\s*(menit|jam|hari)\s+lagi\s/i, (m) => (rel = relMs(+m[1], m[2])));
    cut(/\s(hari ini|today)\s/i, () => (day = 0));
    cut(/\s(besok|tomorrow)\s/i, () => (day = 1));
    cut(/\s(lusa)\s/i, () => (day = 2));
    const mer = (hh, x) => {
      x = (x || "").toLowerCase();
      if ((x === "pm" || x === "sore" || x === "malam") && hh < 12) return hh + 12;
      if (x === "siang" && hh < 11) return hh + 12;
      return hh;
    };
    cut(/\s(?:jam|pukul|at)\s*(\d{1,2})(?:[.:](\d{2}))?\s*(pagi|siang|sore|malam|am|pm)?\s/i, (m) => {
      h = mer(+m[1], m[3]);
      mi = m[2] ? +m[2] : 0;
    });
    if (h === null)
      cut(/\s(\d{1,2})[.:](\d{2})\s*(pagi|siang|sore|malam|am|pm)?\s/i, (m) => {
        h = mer(+m[1], m[3]);
        mi = +m[2];
      });
    let when = "";
    if (rel !== null) {
      const d = new Date(now.getTime() + rel);
      when = `Hari ini ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } else if (day !== null || h !== null) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (day ?? 0), h ?? 9, h !== null ? mi : 0);
      if (day === null && d < now) d.setDate(d.getDate() + 1);
      const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
      when = `${diff === 0 ? "Hari ini" : diff === 1 ? "Besok" : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    return { text: s.replace(/\s+/g, " ").trim() || input.trim(), when };
  }

  function mount(name, el) {
    if (el._off) el._off();
    el._off = null;
    el.innerHTML = "";
    el.classList.remove("gn-view-anim");
    void el.offsetWidth;
    el.classList.add("gn-view-anim");
    const v = VIEWS[name];
    el.onclick = null;
    el._off = v.mount(el) || null;
  }

  // ---------------------------------------------------------------- notch live (fixed)
  const GN = (() => {
    const root = $("#gn");
    const closedEl = $("#gn-closed");
    const peekEl = $("#gn-peek");
    const toggle = $("#gn-toggle");
    const viewEl = $("#gn-view");
    const rail = $("#gn-rail");
    const RAIL = ["home", "market", "sports", "music", "prayer", "calendar", "focus", "ai", "deck"];
    let state = "closed";
    let view = "home";
    let openT;
    let closeT;
    let peekT;
    let slotI = 0;
    let slotLock = 0;
    const SLOTS = ["market", "music", "prayer", "calendar", "clock"];

    rail.innerHTML = RAIL.map((v) => `<button data-v="${v}" aria-label="${VIEWS[v].title}" title="${VIEWS[v].title}" aria-current="${v === view}">${ic(VIEWS[v].icon, 18)}</button>`).join("");

    function setState(s) {
      state = s;
      root.dataset.state = s;
      toggle.setAttribute("aria-expanded", String(s === "open"));
      toggle.setAttribute("aria-label", s === "open" ? "Tutup demo notch" : "Buka demo notch Kuncung");
    }
    function setView(v) {
      view = v;
      $$("button", rail).forEach((b) => b.setAttribute("aria-current", String(b.dataset.v === v)));
      $("#gn-title").textContent = VIEWS[v].title;
      $("#gn-sub").textContent = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
      mount(v, viewEl);
    }
    function open(v) {
      clearTimeout(closeT);
      clearTimeout(peekT);
      if (v) view = v;
      setView(view);
      setState("open");
    }
    function close(returnFocus) {
      clearTimeout(openT);
      if (viewEl._off) {
        viewEl._off();
        viewEl._off = null;
      }
      setState("closed");
      if (returnFocus) toggle.focus();
    }

    // ---- slot notch tertutup
    const slotHtml = {
      market() {
        const items = ["BTC", "IHSG", "S&P 500", "Emas", "USD/IDR"].map(mkBy);
        const row = items.map((a) => `<span class="tk"><b>${esc(a.s)}</b><span class="num" data-px="${esc(a.s)}">${fmtPrice(a)}</span><span class="${pct(a) >= 0 ? "u" : "d"}" data-pc="${esc(a.s)}">${fmtPct(pct(a))}</span></span>`).join("");
        return `${ic("chart", 15)}<div class="mq"><div class="mq-t"><div>${row}</div><div aria-hidden="true">${row}</div></div></div>`;
      },
      music() {
        return `<span class="art-s"></span><span class="lyric" id="slot-ly">${esc(SONG[slotI % SONG.length])}</span><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
      },
      prayer() {
        const st = prayerState();
        return `${ic("moon", 15)}<span><b>${st.next.n}</b> <span class="num">${hhmm(st.next.t)}</span></span><span class="chip ${st.left < 15 ? "gold" : ""}">${cdown(st.left)}</span>`;
      },
      calendar() {
        return `${ic("calendar", 15)}<span><b>Rapat tim</b></span><span class="chip gold">10:00 · 25m</span>`;
      },
      clock() {
        const d = new Date();
        return `<span class="num" style="font-size:15px;font-weight:600">${pad(d.getHours())}:${pad(d.getMinutes())}</span><span class="dim">${d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}</span>`;
      },
    };
    const EDGE = { market: "var(--n-up)", music: "#ff4d8d", prayer: "var(--n-gold)", calendar: "var(--n-accent)", clock: "var(--n-accent)" };
    function showSlot(name) {
      const s = SLOTS.includes(name) ? name : "market";
      closedEl.innerHTML = `<div class="slot" aria-hidden="true">${slotHtml[s]()}</div>`;
      root.style.setProperty("--n-edge", s === "market" && pct(mkBy("BTC")) < 0 ? "var(--n-down)" : EDGE[s]);
    }
    function rotate() {
      if (document.hidden || state !== "closed") return;
      if (Date.now() < slotLock) return;
      slotI++;
      showSlot(SLOTS[slotI % SLOTS.length]);
    }
    setInterval(rotate, 4600);
    setInterval(() => {
      // lirik berjalan saat slot musik tampil
      const ly = $("#slot-ly");
      if (ly && state === "closed") {
        slotI++;
        ly.textContent = SONG[slotI % SONG.length];
      }
      tickPrices(closedEl);
    }, 2400);
    showSlot("market");

    // ---- peek (notifikasi demo)
    function peek(icon, title, text, tone) {
      if (state !== "closed") return;
      peekEl.innerHTML = `<div class="peek" style="--tone:${tone || "var(--n-accent)"}"><span class="peek-ic">${ic(icon, 20)}</span><span class="peek-t"><b>${esc(title)}</b><span>${esc(text)}</span></span></div>`;
      setState("peek");
      clearTimeout(peekT);
      peekT = setTimeout(() => {
        if (state === "peek") setState("closed");
      }, 4200);
    }
    const DEMO_PEEKS = [
      ["bell", "Grup Keluarga", "Jadi ketemu jam 7 malam?", "var(--n-accent)"],
      ["bolt", "BTC naik ke $65,000", "Alert harga tercapai", "var(--n-up)"],
      ["calendar", "Rapat tim", "10 menit lagi · Google Meet", "var(--n-gold)"],
      ["moon", "Waktu Ashar", "15:00 · Jakarta", "var(--n-gold)"],
    ];
    let pi = 0;
    function schedulePeek(delay) {
      setTimeout(() => {
        if (!document.hidden && state === "closed") {
          const p = DEMO_PEEKS[pi++ % DEMO_PEEKS.length];
          peek(...p);
        }
        schedulePeek(30000);
      }, delay);
    }
    schedulePeek(9000);

    // ---- interaksi
    if (canHover) {
      root.addEventListener("pointerenter", () => {
        clearTimeout(closeT);
        if (state !== "open") {
          clearTimeout(openT);
          openT = setTimeout(() => open(), 130);
        }
      });
      root.addEventListener("pointerleave", () => {
        clearTimeout(openT);
        closeT = setTimeout(() => {
          if (state === "open" && !root.contains(document.activeElement && document.activeElement.matches("input") ? document.activeElement : null)) close();
        }, 480);
      });
    }
    toggle.addEventListener("click", () => (state === "open" ? close(true) : open()));
    $("#gn-close").addEventListener("click", () => close(true));
    rail.addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]");
      if (b) setView(b.dataset.v);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state === "open") close(true);
    });
    document.addEventListener("pointerdown", (e) => {
      if (state === "open" && !root.contains(e.target) && !canHover) close();
    });

    return {
      state: () => state,
      peek,
      open,
      close,
      lockSlot(name, ms = 7000) {
        slotLock = Date.now() + ms;
        if (state === "closed") showSlot(name);
      },
    };
  })();

  // ---------------------------------------------------------------- hero: kartu melayang
  (() => {
    const rows = $("#fc-rows");
    const draw = () => {
      rows.innerHTML = ["BTC", "IHSG", "Emas"]
        .map(mkBy)
        .map((a) => `<div class="fr"><b>${esc(a.s)}</b>${spark(a.series, 100, 18).replace("--n-up", "--up").replace("--n-down", "--down")}<span data-fp>${fmtPrice(a)}</span><span class="${pct(a) >= 0 ? "up" : "down"}">${fmtPct(pct(a))}</span></div>`)
        .join("");
    };
    draw();
    mkSubs.add(draw);
    // lirik bergantian
    const a = $("#fc-ly-a");
    const b = $("#fc-ly-b");
    let i = 0;
    setInterval(() => {
      i = (i + 1) % SONG.length;
      a.style.opacity = 0;
      setTimeout(() => {
        a.textContent = SONG[i];
        b.textContent = SONG[(i + 1) % SONG.length];
        a.style.opacity = 1;
      }, 350);
    }, 2800);
    // cincin shalat
    const tick = () => {
      const st = prayerState();
      $("#fc-ring-t").textContent = cdown(st.left);
      $("#fc-ring-c").setAttribute("stroke-dashoffset", String((220 * (1 - st.progress)).toFixed(1)));
      $(".fc-ring small").textContent = `Menuju ${st.next.n}`;
    };
    tick();
    setInterval(tick, 15000);
    // paralaks
    const art = $("#hero-art");
    if (canHover && !reduce) {
      art.parentElement.addEventListener("pointermove", (e) => {
        const r = art.getBoundingClientRect();
        art.style.setProperty("--mx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        art.style.setProperty("--my", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
      art.parentElement.addEventListener("pointerleave", () => {
        art.style.setProperty("--mx", 0);
        art.style.setProperty("--my", 0);
      });
    }
  })();

  // ---------------------------------------------------------------- explorer fitur
  (() => {
    const list = $("#ex-list");
    const view = $("#ex-view");
    const DESC = {
      market: "Ticker berjalan di notch tertutup, sparkline di panel, dan alert harga sekali pakai. Kripto, saham IDX & US, emas, perak, serta kurs. Tambah simbol lewat pencarian.",
      music: "Judul, artis, dan cover dibaca dari Windows (Spotify, YouTube Music, browser, dll.). Lirik tersinkron dari LRCLIB tampil di notch dan panel, dan warna tepi mengikuti cover.",
      sports: "MotoGP (dengan kelas Moto2 dan Moto3) dan F1 lengkap dengan seri balapan, klasemen, serta foto pembalap. Baru: hasil Race utama dan Sprint tiap seri, dengan pilihan di dalam kartu hasil. Juga Liga Champions, Inggris, Spanyol, Italia, Jerman, Belanda, Perancis, dan Liga Indonesia dengan pertandingan terakhir dan klasemen. Tanpa API key.",
      prayer: "Dihitung offline di perangkatmu: Kemenag RI, MWL, ISNA, atau Umm al-Qura. Ada pengingat sebelum waktu, tanggal Hijriah, mode Ramadan, dan musik otomatis jeda saat azan.",
      calendar: "Langganan alamat iCal (Google Calendar, Outlook, Apple), termasuk acara berulang dan zona waktu. Pengingat sebelum acara, dan tombol Join untuk Zoom, Meet, atau Teams.",
      ai: "Chat streaming dengan Claude, OpenAI, Gemini, Ollama lokal, atau server OpenAI-compatible. API key tersimpan di Windows Credential Manager. Aksi cepat untuk ringkas, terjemah, atau perbaiki teks dari clipboard.",
      deck: "Tombol cepat buatanmu sendiri: kirim kombinasi tombol, buka app/file/link, jalankan perintah PowerShell, atau tempel template teks ke aplikasi aktif.",
      focus: "Pomodoro dengan siklus istirahat otomatis, stopwatch, dan to-do yang memahami kalimat seperti “rapat besok jam 10” atau “30 menit lagi”, lengkap dengan pengingat.",
      translate: "Tab Translate di menu Alat: tulis atau tempel teks, bahasa sumber terdeteksi otomatis, lalu pilih bahasa tujuan dari 32 bahasa. Ada tombol tukar bahasa, cara baca untuk aksara non-Latin, dan salin hasil. Memakai Google Translate dengan cadangan MyMemory, tanpa API key; teks yang kamu ketik dikirim ke layanan itu.",
      notif: "Notifikasi toast Windows (WhatsApp, Discord, email) tampil di notch. Opsional, butuh izin dari Windows, dengan filter per aplikasi dan opsi menyembunyikan isi pesan.",
    };
    const SLOT = { market: "market", music: "music", prayer: "prayer", calendar: "calendar" };
    function select(name, focus) {
      $$("button", list).forEach((b) => {
        const on = b.dataset.view === name;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      $("#ex-title").textContent = VIEWS[name].title;
      $("#ex-desc").textContent = DESC[name];
      $("#ex-stage").setAttribute("aria-labelledby", `exb-${name}`);
      mount(name, view);
      if (SLOT[name]) GN.lockSlot(SLOT[name]);
    }
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-view]");
      if (b) select(b.dataset.view);
    });
    list.addEventListener("keydown", (e) => {
      const bs = $$("button", list);
      const i = bs.findIndex((b) => b.getAttribute("aria-selected") === "true");
      let n = -1;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % bs.length;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + bs.length) % bs.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = bs.length - 1;
      if (n >= 0) {
        e.preventDefault();
        select(bs[n].dataset.view, true);
      }
    });
    // pasang demo saat terlihat (hemat sumber daya)
    let started = false;
    new IntersectionObserver(
      (en) => {
        if (en[0].isIntersecting && !started) {
          started = true;
          select("market");
        }
      },
      { rootMargin: "200px" },
    ).observe($("#ex-stage"));
  })();

  // ---------------------------------------------------------------- demo deteksi tab
  (() => {
    const SCREEN = 1920;
    const NOTCH_W = 344 + 16;
    const PLUS = 44;
    const NAMES = ["Dokumen", "Surel", "Peta", "Berita", "Video", "Catatan", "Belanja", "Tiket", "Kerja", "Bacaan", "Musik", "Desain", "Cuaca", "Kalender"];
    const COLORS = ["#5aa9ff", "#ff6b81", "#2de2a7", "#ffcf5c", "#a78bfa", "#ff9f43", "#4dd0e1", "#f06292"];
    const browser = $("#browser");
    const tabsEl = $("#b-tabs");
    const range = $("#td-range");
    const smartBtn = $("#td-smart");
    const notch = $("#td-notch");
    const zone = $("#td-zone");
    let smart = true;
    let hover = false;

    const z0 = 0.5 - NOTCH_W / 2 / SCREEN;
    const z1 = 0.5 + NOTCH_W / 2 / SCREEN;
    zone.style.left = `${z0 * 100}%`;
    zone.style.width = `${(z1 - z0) * 100}%`;

    function render() {
      const n = +range.value;
      $("#td-n").textContent = n;
      const bw = browser.getBoundingClientRect().width || 800;
      const u = bw / SCREEN;
      const tw = Math.min(240, (SCREEN - 300) / n);
      browser.style.setProperty("--u", u);
      tabsEl.innerHTML = Array.from({ length: n }, (_, i) => `<span class="b-tab ${i === 0 ? "cur" : ""}" style="--c:${COLORS[i % COLORS.length]};width:${(tw * u).toFixed(2)}px">${n > 9 && tw < 100 ? "" : NAMES[i % NAMES.length]}</span>`).join("");
      const last = tabsEl.lastElementChild;
      const br = browser.getBoundingClientRect();
      const tabRight = last ? (last.getBoundingClientRect().right - br.left) / br.width : 0;
      const covers = tabRight + PLUS / SCREEN > z0;
      const thin = smart ? covers : true;
      notch.dataset.thin = String(thin && !hover);
      const pctTxt = Math.round(tabRight * 100);
      $("#td-readout").innerHTML = smart
        ? `Ujung tab: <strong>${pctTxt}%</strong> lebar layar · zona notch mulai ${Math.round(z0 * 100)}%.<br>${covers ? "<strong>Tab mencapai notch → notch mengecil jadi garis tipis.</strong>" : "Masih aman → notch tampil normal."}`
        : `Deteksi mati: browser di tepi atas layar → notch <strong>selalu</strong> mengecil, berapa pun jumlah tab.`;
    }
    range.addEventListener("input", render);
    smartBtn.addEventListener("click", () => {
      smart = !smart;
      smartBtn.setAttribute("aria-pressed", String(smart));
      render();
    });
    notch.querySelector(".td-pill").addEventListener("pointerenter", () => {
      hover = true;
      render();
    });
    notch.querySelector(".td-pill").addEventListener("pointerleave", () => {
      hover = false;
      render();
    });
    new ResizeObserver(render).observe(browser);
    render();
  })();

  // ---------------------------------------------------------------- strips gaya
  (() => {
    const box = $("#strips");
    box.innerHTML = THEMES.map(
      (t) => `<button class="strip" data-nt="${t.id}" aria-pressed="false"><span class="gn-fx" aria-hidden="true"><i></i><i></i></span><span class="s-sel">Dipakai</span><span class="s-name">${esc(t.name)}</span><span class="s-body"><span class="mini-pill"><b>BTC</b><span class="u">+1,3%</span><b>IHSG</b><span class="d">−0,3%</span></span><span class="s-desc">${esc(t.desc)}</span><span class="s-use">Pakai gaya ini</span></span></button>`,
    ).join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".strip");
      if (b) setTheme(b.dataset.nt, true);
    });
  })();

  // ---------------------------------------------------------------- marquee market
  (() => {
    const items = ["BTC", "ETH", "IHSG", "BBCA", "S&P 500", "NVDA", "Emas", "Perak", "USD/IDR"].map(mkBy);
    const one = items.map((a) => `<span class="mq-i"><b>${esc(a.s)}</b><span class="v" data-px="${esc(a.s)}">${fmtPrice(a)}</span><span class="p ${pct(a) >= 0 ? "up" : "down"}" data-mp="${esc(a.s)}">${fmtPct(pct(a))}</span></span>`).join("");
    $("#marq-track").innerHTML = `<div>${one}</div><div aria-hidden="true">${one}</div>`;
    mkSubs.add(() => {
      $$("#marq-track [data-px]").forEach((el) => (el.textContent = fmtPrice(mkBy(el.dataset.px))));
      $$("#marq-track [data-mp]").forEach((el) => {
        const p = pct(mkBy(el.dataset.mp));
        el.textContent = fmtPct(p);
        el.className = `p ${p >= 0 ? "up" : "down"}`;
      });
    });
  })();

  // ---------------------------------------------------------------- garis sinyal + reveal + salin
  (() => {
    const line = $("#sline");
    const fill = $("#sline-fill");
    const secs = $$("[data-label]");
    const nodes = secs.map((s) => {
      const n = document.createElement("i");
      n.className = "sline-node";
      n.title = s.dataset.label;
      line.appendChild(n);
      return n;
    });
    let ticking = false;
    function layout() {
      const doc = document.documentElement.scrollHeight - innerHeight;
      secs.forEach((s, i) => {
        const top = s.getBoundingClientRect().top + scrollY;
        nodes[i].style.top = `${Math.min(100, Math.max(0, (top / Math.max(1, doc)) * 100))}%`;
      });
      update();
    }
    function update() {
      ticking = false;
      const doc = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / doc));
      fill.style.setProperty("--p", p.toFixed(4));
      let active = -1;
      secs.forEach((s, i) => {
        if (s.getBoundingClientRect().top < innerHeight * 0.45) active = i;
      });
      nodes.forEach((n, i) => n.classList.toggle("on", i <= active));
    }
    addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    addEventListener("resize", layout);
    addEventListener("load", layout);
    layout();

    // reveal saat masuk viewport
    const els = $$(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (en) =>
          en.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      els.forEach((e) => io.observe(e));
    } else els.forEach((e) => e.classList.add("in"));

    // salin perintah
    $("#copy-btn").addEventListener("click", async (e) => {
      const txt = e.currentTarget.dataset.copy;
      try {
        await navigator.clipboard.writeText(txt);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast("Perintah disalin");
    });
  })();

  // ---------------------------------------------------------------- mulai
  setTheme(store.get("gn-theme") || "parang");
  // pastikan notch ringkas di layar sentuh: tap = buka
  document.documentElement.classList.add("js");
})();
