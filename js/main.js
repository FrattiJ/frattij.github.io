/* Builds the volume from js/content.js and runs its few moving parts:
   the cover's opening, the chapter reader, the four-panel strip, the top bar,
   and the day and night pages. */
(function () {
  "use strict";

  /* global SITE */
  const S = typeof SITE !== "undefined" ? SITE : window.SITE;
  const ART = window.ART || {};
  const root = document.documentElement;
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const esc = (value) =>
    String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const art = (id) => (typeof ART[id] === "function" ? ART[id]() : "");
  const STATUS = { shipped: "In use", active: "In progress", planned: "Planned" };
  const links = (S.links || []).filter((l) => l && l.url);

  /* ---------- Focus lines: seeded wedges running in toward the centre ---------- */
  function focusLines(svg, { count = 150, seed = 7, inner = [330, 470], cy = 500 } = {}) {
    if (!svg) return;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const pt = (a, r) => `${(500 + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
    let d = "";
    for (let i = 0; i < count; i++) {
      const a = ((i + rnd() * 0.9) / count) * Math.PI * 2;
      const half = 0.003 + rnd() * 0.013;
      const reach = inner[0] + rnd() * (inner[1] - inner[0]);
      d += `M${pt(a - half, 1500)}L${pt(a + half, 1500)}L${pt(a, reach)}Z`;
    }
    svg.innerHTML = `<path fill="currentColor" d="${d}"/>`;
  }

  /* ---------- Cover ---------- */
  function renderCover() {
    const words = String(S.name || "").trim().split(/\s+/);
    const first = words.shift() || "";
    $("#coverName").innerHTML = `<span>${esc(first)}</span> <span>${esc(words.join(" "))}</span>`;
    $("#coverKana").textContent = S.nameKana || "";
    if (!S.nameKana) $("#coverKana").hidden = true;
    $("#coverTitle").textContent = S.title || "";
    $("#coverPlace").textContent = S.location || "";
    $("#coverTagline").textContent = S.tagline || "";
    $("#coverIntro").textContent = S.intro || "";
    $("#coverLinks").insertAdjacentHTML(
      "beforeend",
      links.map((l) => `<a class="btn" href="${esc(l.url)}">${esc(l.label)}</a>`).join("")
    );
    $("#coverStats").innerHTML = (S.highlights || [])
      .map((h, n) =>
        h.was
          ? `<div class="sticker sticker-mark" style="--n:${n}"><dt>${esc(h.label)}</dt>` +
            `<dd><s><span class="vh">was </span>${esc(h.was)}</s><span class="vh">now </span>${esc(h.value)}</dd></div>`
          : `<div class="sticker" style="--n:${n}"><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`
      )
      .join("");
    focusLines($("#focus"), { count: 170, seed: 11, inner: [360, 480] });
  }

  /* ---------- Section headings ---------- */
  function renderHeads() {
    const sec = S.sections || {};
    const set = (h, p, d) => {
      if (!d) return;
      if (d.heading) $(h).textContent = d.heading;
      $(p).textContent = d.note || "";
    };
    set("#h-work", "#workNote", sec.work);
    set("#h-story", "#storyNote", sec.story);
    set("#h-profile", "#profileNote", sec.profile);
    set("#h-extras", "#extrasNote", S.offClock && { heading: S.offClock.heading, note: S.offClock.note });
    set("#h-contact", "#contactNote", sec.contact);
    // keep the phone contents page in step with the headings
    const names = ["#h-work", "#h-story", "#h-profile", "#h-extras", "#h-contact"].map((h) => $(h).textContent);
    $$(".contents a span").forEach((s, i) => (s.textContent = names[i]));
  }

  /* ---------- Shared layout: pairs of 7 and 5 columns that alternate, a lone one runs full width ---------- */
  function pairSizes(count, start) {
    const out = [];
    let flip = start;
    for (let i = 0; i < count; i += 2) {
      if (i + 1 < count) {
        out.push(flip ? ["w5", "cut-r"] : ["w7", "cut-r"], flip ? ["w7", "cut-l"] : ["w5", "cut-l"]);
        flip = !flip;
      } else out.push(["w12", ""]);
    }
    return { sizes: out, next: flip };
  }

  /* ---------- The work ---------- */
  const projects = (S.projects || []).filter((p) => p && p.id);
  const indexOf = (id) => projects.findIndex((p) => p.id === id);

  function chapterArt(p, withSfx) {
    const pic = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || "")}" loading="lazy" decoding="async" />`
      : art(p.id);
    const sfx =
      withSfx && p.sfx && p.sfx.kana
        ? `<p class="sfx card-sfx" aria-hidden="true"><span lang="ja">${esc(p.sfx.kana)}</span><small>${esc(p.sfx.say || "")}</small></p>`
        : "";
    return `<span class="card-tone" aria-hidden="true"></span><span class="card-lines" aria-hidden="true"></span>${sfx}${pic}`;
  }

  function renderChapters() {
    const groups = S.projectGroups && S.projectGroups.length ? S.projectGroups : [{ id: null, title: "", note: "" }];
    let flip = false;
    const html = groups
      .map((g) => {
        const list = projects.filter((p) => !g.id || p.group === g.id);
        if (!list.length) return "";
        const { sizes, next } = pairSizes(list.length, flip);
        flip = next;
        const cards = list
          .map((p, k) => {
            const n = indexOf(p.id) + 1;
            const [w, cut] = sizes[k];
            const status = STATUS[p.status] ? `<span class="status">${STATUS[p.status]}</span>` : "";
            return (
              `<li class="panel card ${w} ${cut}" data-reveal style="--i:${k % 2}">` +
              `<div class="card-art">${chapterArt(p, true)}</div>` +
              `<div class="card-body">` +
              `<p class="card-num"><span>Chapter ${n}</span>${status}${p.year ? `<span>${esc(p.year)}</span>` : ""}</p>` +
              `<h4 class="card-title"><a href="#chapter/${esc(p.id)}" data-chapter="${esc(p.id)}">${esc(p.title)}</a></h4>` +
              (p.hook ? `<p class="card-hook">${esc(p.hook)}</p>` : "") +
              `<p class="card-sum">${esc(p.summary)}</p>` +
              (p.tags && p.tags.length ? `<ul class="tags" aria-label="Built with">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "") +
              `</div>` +
              `<span class="card-big" aria-hidden="true">${n}</span>` +
              `</li>`
            );
          })
          .join("");
        const head = g.title
          ? `<header class="group-head"><h3>${esc(g.title)}</h3>${g.note ? `<p>${esc(g.note)}</p>` : ""}</header>`
          : "";
        return `<div class="chapter-group">${head}<ol class="chapters">${cards}</ol></div>`;
      })
      .join("");
    $("#chapters").innerHTML = html;
  }

  /* ---------- The story so far ---------- */
  function figure(f) {
    if (!f || !f.value) return "";
    const val = f.was
      ? `<s><span class="vh">was </span>${esc(f.was)}</s><span class="vh">now </span><mark>${esc(f.value)}</mark>`
      : esc(f.value);
    return `<p class="yk-fig"><span class="yk-val">${val}</span>${f.label ? `<span class="yk-label">${esc(f.label)}</span>` : ""}</p>`;
  }
  function when(e) {
    if (e.start && e.end && e.start !== e.end) return `${e.start} to ${e.end}`;
    return e.end || e.start || "";
  }
  function renderStory() {
    const r = S.resume || {};
    const beats = (r.experience || []).slice().reverse();
    if (r.education && r.education[0]) beats.push(Object.assign({ isSchool: true }, r.education[0]));
    const kanji = ["起", "承", "転", "結"];
    $("#yonkoma").innerHTML = beats
      .map((e, i) => {
        const pts = e.points || [];
        const more = pts.length
          ? pts.length === 1 && !e.isSchool
            ? `<p>${esc(pts[0])}</p>`
            : `<details class="more"><summary>${e.isSchool ? "Coursework" : "What I did"}</summary><ul>${pts
                .map((t) => `<li>${esc(t.replace(/^Coursework:\s*/, ""))}</li>`)
                .join("")}</ul></details>`
          : "";
        return (
          `<li class="panel yk${i === 2 ? " turn invert" : ""}" data-reveal style="--i:${i}">` +
          (i === 2 ? `<span class="card-lines" aria-hidden="true"></span>` : "") +
          (kanji[i] ? `<span class="yk-kanji" lang="ja" aria-hidden="true">${kanji[i]}</span>` : "") +
          `<p class="caption">${esc(when(e))}</p>` +
          figure(e.figure) +
          `<h3>${esc(e.role)}</h3><p class="yk-org">${esc(e.org)}</p>` +
          more +
          `</li>`
        );
      })
      .join("");
  }

  /* ---------- Character file ---------- */
  function renderFile() {
    const r = S.resume || {};
    const job = (r.experience || [])[0];
    const school = (r.education || [])[0];
    const first = (s) => String(s || "").split(",")[0].trim();
    const years = (S.highlights || [])[0];
    const rows = [
      ["Based in", S.location],
      job && ["Works as", `${first(job.role)}, ${first(job.org)}`],
      years && ["Field", `${years.label}, ${years.value}`],
      school && ["Studying", `${school.role}, ${school.org}, ${String(school.end || "").replace(/^Expected\s*/i, "finishing ")}`],
    ].filter((x) => x && x[1]);

    const about = (S.about && S.about.paragraphs) || [];
    const goals = S.goals || {};
    const skills = S.skills || {};
    const edu = r.education || [];

    $("#file").innerHTML =
      `<div class="panel file-id">` +
      `<h3 class="file-name" translate="no">${esc(S.name)}</h3>` +
      art("about") +
      `<dl class="profile">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` +
      `</div>` +
      `<div class="panel file-about">${about.map((t, i) => `<p${i === 0 ? ' class="file-lead"' : ""}>${esc(t)}</p>`).join("")}</div>` +
      `<div class="panel file-goals"><h3>${esc(goals.heading || "Where I am headed")}</h3>` +
      (goals.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join("") +
      (goals.points && goals.points.length ? `<ul class="points">${goals.points.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "") +
      `</div>` +
      `<div class="panel file-skills"><h3>Skills</h3><div class="kit">` +
      Object.keys(skills)
        .map((k) => `<div><h4>${esc(k)}</h4><ul class="tags">${skills[k].map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`)
        .join("") +
      `</div></div>` +
      `<div class="panel file-school invert"><h3>Education</h3><ol class="school">` +
      edu
        .map(
          (e) =>
            `<li><span class="caption caption-spot when">${esc(when(e))}</span><h4>${esc(e.role)}</h4><p class="org">${esc(e.org)}</p>` +
            (e.points || []).map((t) => `<p class="note">${esc(t)}</p>`).join("") +
            `</li>`
        )
        .join("") +
      `</ol></div>`;
  }

  /* ---------- Off the clock ---------- */
  function renderExtras() {
    const books = (S.offClock && S.offClock.books) || [];
    if (!books.length) {
      $("#extras").hidden = true;
      $$('a[href="#extras"]').forEach((a) => a.closest("li") ? a.closest("li").remove() : a.remove());
      return;
    }
    const tone = { accent: "spot", ink: "invert", grey: "toned", paper: "" };
    const { sizes } = pairSizes(books.length, false);
    $("#omake").innerHTML = books
      .map((b, i) => {
        const [w, cut] = sizes[i];
        const list = (b.list || [])
          .map((x) => (typeof x === "string" ? { title: x } : x))
          .map((x) => `<li><strong>${esc(x.title)}</strong>${x.note ? `<span>${esc(x.note)}</span>` : ""}</li>`)
          .join("");
        const link = b.link && b.link.url ? `<a class="btn btn-spot" href="${esc(b.link.url)}">${esc(b.link.label)}</a>` : "";
        return (
          `<article class="panel bonus ${w} ${cut} ${tone[b.color] || ""}" aria-labelledby="bonus-${esc(b.id)}">` +
          `<p class="bonus-word" aria-hidden="true">${esc(b.spine)}</p>` +
          `<div class="bonus-body">${art(b.id)}` +
          `<h3 id="bonus-${esc(b.id)}">${esc(b.heading)}</h3>` +
          (b.text ? `<p>${esc(b.text)}</p>` : "") +
          (list ? `<ul class="reads">${list}</ul>` : "") +
          link +
          `</div></article>`
        );
      })
      .join("");
  }

  /* ---------- To be continued, and the footer ---------- */
  function renderEnd() {
    $("#contactLinks").innerHTML = links
      .map((l, i) => `<a class="btn ${i === 0 ? "btn-spot" : ""}" href="${esc(l.url)}">${esc(l.label)}</a>`)
      .join("");
    focusLines($("#focusEnd"), { count: 130, seed: 23, inner: [300, 440] });
    $("#footerText").textContent = `© ${new Date().getFullYear()} ${S.name}. Drawn in plain HTML, CSS and JavaScript.`;
  }

  /* ---------- The reader ---------- */
  const reader = $("#reader");
  const readerBody = $("#readerBody");
  let current = -1;
  let pushedEntry = false;
  let returnTo = null;

  function stepSpans(n) {
    const pattern = [4, 2, 2, 4, 3, 3];
    const out = [];
    let used = 0;
    for (let i = 0; i < n; i++) {
      let s = i === n - 1 ? 6 - used : pattern[i % pattern.length];
      if (s > 6 - used) s = 6 - used;
      out.push(s);
      used = (used + s) % 6;
    }
    return out;
  }

  function renderChapter(i) {
    const p = projects[i];
    const n = i + 1;
    const total = projects.length;
    const steps = p.process || [];
    const spans = stepSpans(steps.length);
    let col = 0;
    const panels = steps
      .map((st, k) => {
        const s = spans[k];
        const startsRow = col === 0;
        col = (col + s) % 6;
        const endsRow = col === 0;
        const cut = `${startsRow ? "" : "cut-l"} ${endsRow ? "" : "cut-r"}`;
        const tone = k === steps.length - 1 ? "invert" : "";
        return `<li class="panel step ${cut} ${tone}" style="--span:${s};--i:${k}"><h3 class="caption">${esc(st.title)}</h3><p>${esc(st.text)}</p></li>`;
      })
      .join("");
    const status = STATUS[p.status] ? `<span class="status">${STATUS[p.status]}</span>` : "";
    const plinks = (p.links || []).filter((l) => l && l.url);
    const next = projects[i + 1];

    $("#readerWhere").textContent = `Chapter ${n} of ${total}`;
    $("#readerPrev").disabled = i === 0;
    $("#readerNext").disabled = i === total - 1;

    readerBody.innerHTML =
      `<header class="rd-head" style="--i:0">` +
      `<div class="panel rd-art">${chapterArt(p, false)}` +
      (p.sfx && p.sfx.kana ? `<p class="sfx rd-sfx" aria-hidden="true"><span lang="ja">${esc(p.sfx.kana)}</span><small>${esc(p.sfx.say || "")}</small></p>` : "") +
      `</div>` +
      `<div class="panel rd-title">` +
      `<p class="rd-num"><span>Chapter ${n}</span>${status}${p.year ? `<span>${esc(p.year)}</span>` : ""}</p>` +
      `<h2 id="readerTitle" tabindex="-1">${esc(p.title)}</h2>` +
      (p.hook ? `<p class="rd-hook">${esc(p.hook)}</p>` : "") +
      `<p class="rd-sum">${esc(p.summary)}</p>` +
      (p.tags && p.tags.length ? `<ul class="tags" aria-label="Built with">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "") +
      (plinks.length ? `<div class="cta">${plinks.map((l, k) => `<a class="btn ${k === 0 ? "btn-spot" : ""}" href="${esc(l.url)}">${esc(l.label)}</a>`).join("")}</div>` : "") +
      `</div></header>` +
      (panels ? `<ol class="rd-panels" aria-label="The chapter, panel by panel">${panels}</ol>` : "") +
      `<nav class="rd-end" aria-label="More chapters" style="--i:2">` +
      (next
        ? `<button class="panel rd-next" type="button" data-go="next"><span class="caption">Next chapter</span><strong>${esc(next.title)}</strong>${next.hook ? `<span class="hint">${esc(next.hook)}</span>` : ""}</button>`
        : "") +
      `<button class="panel rd-back" type="button" data-close>Back to all chapters</button>` +
      `</nav>`;
  }

  function openChapter(i, { turn = false } = {}) {
    if (i < 0 || i >= projects.length) return;
    current = i;
    renderChapter(i);
    if (!reader.open) {
      reader.classList.remove("is-closing");
      reader.showModal();
    }
    reader.scrollTop = 0;
    if (turn && !reduceMotion.matches) {
      readerBody.classList.remove("is-turning");
      void readerBody.offsetWidth;
      readerBody.classList.add("is-turning");
    }
    const title = $("#readerTitle");
    if (title) title.focus({ preventScroll: true });
    document.title = `${projects[i].title} | ${S.name}`;
  }

  function finishClose() {
    if (reader.open) reader.close();
    reader.classList.remove("is-closing");
    current = -1;
    document.title = `${S.name} | ${S.title}`;
    const target = returnTo || $(`a[data-chapter]`);
    returnTo = null;
    if (target) target.focus({ preventScroll: true });
  }

  function animateClose() {
    if (!reader.open) return;
    if (reduceMotion.matches) return finishClose();
    reader.classList.add("is-closing");
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      finishClose();
    };
    reader.addEventListener("animationend", end, { once: true });
    setTimeout(end, 400);
  }

  // Closing goes back through history when the reader added an entry, so the back button and the close button agree.
  function requestClose() {
    if (pushedEntry) {
      pushedEntry = false;
      history.back();
    } else {
      history.replaceState(null, "", "#work");
      animateClose();
    }
  }

  function goTo(i) {
    if (i < 0 || i >= projects.length) return;
    history.replaceState(null, "", `#chapter/${projects[i].id}`);
    openChapter(i, { turn: true });
  }

  function route() {
    const m = location.hash.match(/^#(?:chapter|project)\/([\w-]+)$/);
    const i = m ? indexOf(m[1]) : -1;
    if (i >= 0) {
      if (m[0].startsWith("#project/")) history.replaceState(null, "", `#chapter/${projects[i].id}`);
      if (i !== current) openChapter(i);
    } else if (reader.open) {
      animateClose();
    }
  }

  function bindReader() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href^='#chapter/'], a[href^='#project/']");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const id = a.getAttribute("href").split("/")[1];
      const i = indexOf(id);
      if (i < 0) return;
      e.preventDefault();
      if (reader.open) return goTo(i);
      returnTo = a;
      history.pushState({ chapter: id }, "", `#chapter/${id}`);
      pushedEntry = true;
      openChapter(i);
    });
    reader.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) requestClose();
      else if (e.target.closest("[data-go='next']")) goTo(current + 1);
    });
    $("#readerClose").addEventListener("click", requestClose);
    $("#readerPrev").addEventListener("click", () => goTo(current - 1));
    $("#readerNext").addEventListener("click", () => goTo(current + 1));
    reader.addEventListener("cancel", (e) => {
      e.preventDefault();
      requestClose();
    });
    reader.addEventListener("close", () => {
      if (/^#(chapter|project)\//.test(location.hash)) {
        pushedEntry = false;
        history.replaceState(null, "", "#work");
      }
      current = -1;
    });
    reader.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight") goTo(current + 1);
      else if (e.key === "ArrowLeft") goTo(current - 1);
    });
    window.addEventListener("hashchange", route);
  }

  /* ---------- Top bar: progress, hide on the way down, the section you are in ---------- */
  function bindBar() {
    const bar = $("#bar");
    const progress = $("#progress");
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      if (down && y > 240 && !root.classList.contains("menu-open") && !bar.contains(document.activeElement)) bar.classList.add("is-hidden");
      else if (up || y < 240) bar.classList.remove("is-hidden");
      if (down || up) lastY = y;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    bar.addEventListener("focusin", () => bar.classList.remove("is-hidden"));
    update();

    const navLinks = $$(".bar-nav a");
    if ("IntersectionObserver" in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            navLinks.forEach((a) => {
              if (a.getAttribute("href") === `#${en.target.id}`) a.setAttribute("aria-current", "true");
              else a.removeAttribute("aria-current");
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      $$("main > section").forEach((s) => spy.observe(s));
    }
  }

  /* ---------- Contents page on a phone ---------- */
  function bindMenu() {
    const btn = $("#menuToggle");
    const menu = $("#contents");
    const outside = [$("main"), $(".colophon")];
    const set = (open) => {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      root.classList.toggle("menu-open", open);
      outside.forEach((el) => (el.inert = open));
      if (open) $("a", menu).focus();
    };
    btn.addEventListener("click", () => set(menu.hidden));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) set(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        set(false);
        btn.focus();
      }
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => {
      if (e.matches && !menu.hidden) set(false);
    });
  }

  /* ---------- Day and night pages ---------- */
  function bindTheme() {
    const btn = $("#themeToggle");
    const label = $("#themeLabel");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const isNight = () => (root.dataset.theme ? root.dataset.theme === "night" : dark.matches);
    const sync = () => {
      const night = isNight();
      btn.setAttribute("aria-pressed", String(night));
      label.textContent = "Night page";
      btn.title = night ? "Switch to the day page" : "Switch to the night page";
      const meta = $$('meta[name="theme-color"]');
      meta.forEach((m) => m.setAttribute("content", night ? "#000000" : "#ffffff"));
      meta.forEach((m) => m.removeAttribute("media"));
    };
    btn.addEventListener("click", () => {
      const next = isNight() ? "day" : "night";
      const apply = () => {
        root.dataset.theme = next;
        try {
          localStorage.setItem("page", next);
        } catch (e) {}
        sync();
      };
      const r = btn.getBoundingClientRect();
      root.style.setProperty("--fx", `${r.left + r.width / 2}px`);
      root.style.setProperty("--fy", `${r.top + r.height / 2}px`);
      if (document.startViewTransition && !reduceMotion.matches) document.startViewTransition(apply);
      else apply();
    });
    dark.addEventListener("change", sync);
    sync();
  }

  /* ---------- Panels are inked in the first time they are read ---------- */
  function bindReveal() {
    const items = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
    // anything already above the fold when the page loads deep is shown at once
    requestAnimationFrame(() => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) el.classList.add("is-in");
      });
    });
  }

  /* ---------- Start ---------- */
  function start() {
    renderCover();
    renderHeads();
    renderChapters();
    renderStory();
    renderFile();
    renderExtras();
    renderEnd();
    bindReader();
    bindBar();
    bindMenu();
    bindTheme();
    bindReveal();

    // The page was built after the browser looked for the anchor, so look again.
    const target = location.hash && !/^#(chapter|project)\//.test(location.hash) ? document.getElementById(location.hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    route();
  }

  try {
    start();
  } finally {
    const ready = () => root.classList.add("ready");
    if (document.fonts && document.fonts.ready) {
      Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(ready);
    } else ready();
  }
})();
