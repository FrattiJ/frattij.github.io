/* Placeholder illustrations, drawn as vector ink so they take on whichever palette is active.
   Each entry returns a fresh <svg> string. Replace one by giving its project an `image` in content.js,
   or by changing the drawing here. Keys are section ids, project ids and shelf book ids.

   Classes: k = ink, w = paper, r = spot colour, o = ink outline, o3 / o2 = thinner outlines,
   n = no fill. Screentone is a pattern fill: T (dots), F (fine dots), H (hatching). */
(function () {
  "use strict";

  let count = 0;

  // Seeded wedges running in toward a point, like the focus lines on the cover.
  function burst(cx, cy, inner, outer, lines, seed, from = 0, to = Math.PI * 2) {
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    let d = "";
    for (let i = 0; i < lines; i++) {
      const a = from + ((i + rnd() * 0.8) / lines) * (to - from);
      const half = 0.006 + rnd() * 0.02;
      const reach = inner * (0.85 + rnd() * 0.6);
      const p = (ang, r) => `${(cx + Math.cos(ang) * r).toFixed(1)} ${(cy + Math.sin(ang) * r).toFixed(1)}`;
      d += `M${p(a - half, outer)}L${p(a + half, outer)}L${p(a, reach)}Z`;
    }
    return `<path class="k" d="${d}"/>`;
  }

  function svg(viewBox, draw) {
    const id = `art${++count}`;
    const u = { T: `url(#${id}t)`, F: `url(#${id}f)`, H: `url(#${id}h)`, clip: (n) => `${id}c${n}` };
    return (
      `<svg class="art" viewBox="${viewBox}" aria-hidden="true" focusable="false"><defs>` +
      `<pattern id="${id}t" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="w" width="8" height="8"/><circle class="k" cx="4" cy="4" r="1.9"/></pattern>` +
      `<pattern id="${id}f" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="w" width="5" height="5"/><circle class="k" cx="2.5" cy="2.5" r="1"/></pattern>` +
      `<pattern id="${id}h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect class="w" width="7" height="7"/><path class="o2 n" d="M0 3.5H7"/></pattern>` +
      `</defs>${draw(u)}</svg>`
    );
  }

  // A bottle standing on `base`, its cap at base - h.
  function bottle(cx, base, h, fill, label) {
    const top = base - h;
    const sh = top + 74;
    return (
      `<path class="o" fill="${fill}" d="M${cx - 17} ${base}V${sh}Q${cx - 17} ${sh - 22} ${cx - 7} ${sh - 32}V${top + 10}H${cx + 7}V${sh - 32}Q${cx + 17} ${sh - 22} ${cx + 17} ${sh}V${base}Z"/>` +
      `<rect class="k" x="${cx - 9}" y="${top}" width="18" height="12" rx="2"/>` +
      (label ? `<rect class="${label} o3" x="${cx - 17}" y="${sh + 8}" width="34" height="26"/>` : "")
    );
  }

  // Barcode: bars of uneven width
  function barcode(x, y, w, h, seed) {
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    let d = "";
    for (let at = x; at < x + w - 2; ) {
      const bw = 1 + Math.floor(rnd() * 3);
      d += `M${at} ${y}h${bw}v${h}h-${bw}Z`;
      at += bw + 1 + Math.floor(rnd() * 3);
    }
    return `<path class="k" d="${d}"/>`;
  }

  // A d20 seen face on: the outer hexagon, an upright centre face, and the edges between them.
  function d20(cx, cy, R, faceClass, label) {
    const v = [...Array(6)].map((_, k) => {
      const a = -Math.PI / 2 + (k * Math.PI) / 3;
      return [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
    });
    const p1 = [cx, cy - R * 0.5];
    const p2 = [cx + R * 0.47, cy + R * 0.33];
    const p3 = [cx - R * 0.47, cy + R * 0.33];
    const pt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const line = (a, b) => `M${pt(a)}L${pt(b)}`;
    return (
      `<path class="w o" d="M${v.map(pt).join("L")}Z"/>` +
      `<path class="${faceClass} o" d="M${pt(p1)}L${pt(p2)}L${pt(p3)}Z"/>` +
      `<path class="o n" d="${[
        line(p1, v[5]), line(p1, v[0]), line(p1, v[1]),
        line(p2, v[1]), line(p2, v[2]), line(p2, v[3]),
        line(p3, v[3]), line(p3, v[4]), line(p3, v[5]),
      ].join("")}"/>` +
      (label ? `<text class="lt" x="${cx}" y="${cy + R * 0.2}" text-anchor="middle" font-size="${R * 0.42}" fill="currentColor">${label}</text>` : "")
    );
  }

  const ART = {
    /* ---------- Margin art for the chapters ---------- */

    // A price gun, firing stickers
    about: () =>
      svg("0 0 360 330", (u) =>
        // hard shadows
        `<g class="k" transform="translate(8 8)"><circle cx="232" cy="92" r="58"/>` +
        `<path d="M58 146L292 128Q306 127 308 141L314 204Q315 216 302 218L96 236Q84 237 80 226Z"/>` +
        `<path d="M212 224L256 219L304 300Q308 312 296 314L262 318Q252 319 248 310Z"/></g>` +
        // label roll
        `<circle class="w o" cx="232" cy="92" r="58"/>` +
        `<circle class="o" fill="${u.T}" cx="232" cy="92" r="40"/>` +
        `<circle class="k" cx="232" cy="92" r="17"/><circle class="w" cx="232" cy="92" r="6"/>` +
        // handle and trigger
        `<path class="w o" d="M212 224L256 219L304 300Q308 312 296 314L262 318Q252 319 248 310Z"/>` +
        `<path class="o" fill="${u.H}" d="M238 221L256 219L304 300Q308 312 296 314L282 316Z"/>` +
        `<path class="o3 n" d="M232 252l26-3M242 272l26-3M252 292l26-3"/>` +
        `<path class="k" d="M150 232L188 228L206 290Q208 298 200 300L190 302Q182 302 180 294Z"/>` +
        // body, with the label strip running from the roll to the nozzle
        `<path class="w o" d="M58 146L292 128Q306 127 308 141L314 204Q315 216 302 218L96 236Q84 237 80 226Z"/>` +
        `<path class="o" fill="${u.T}" d="M82 206L312 188L314 204Q315 216 302 218L96 236Q84 237 80 226Z"/>` +
        `<path class="w o" d="M182 102L186 117L66 149L62 137Z"/>` +
        `<g transform="rotate(-4.4 178 172)"><rect class="k" x="116" y="152" width="124" height="40" rx="4"/>` +
        `<text class="lt r" x="178" y="183" text-anchor="middle" font-size="30">1 MIN</text></g>` +
        // nozzle
        `<path class="w o" d="M58 146L30 160Q22 164 26 172L44 214Q48 222 58 224L80 226Z"/>` +
        `<path class="k" d="M26 172L44 214Q48 222 58 224L52 196Z"/>` +
        // stickers in flight
        `<g transform="rotate(-16 40 262)"><rect class="r o" x="6" y="242" width="68" height="40" rx="5"/>` +
        `<path class="o3 n" d="M18 256h30M18 268h44" style="stroke:var(--on-accent)"/></g>` +
        `<g transform="rotate(12 118 300)"><rect class="w o" x="84" y="282" width="68" height="38" rx="5"/>` +
        barcode(94, 292, 46, 18, 5) +
        `</g>` +
        // motion marks by the trigger
        `<path class="o n" d="M152 256l-14 8M158 272l-16 4M166 288l-12 10"/>`
      ),

    // A crate of bottles, with a price tag on a string
    experience: () =>
      svg("0 0 360 330", (u) =>
        `<circle class="r" cx="212" cy="112" r="96"/>` +
        // rim and the dark inside of the crate
        `<path class="w o" d="M50 202L86 176H326L290 202Z"/>` +
        `<path class="k" d="M64 198L90 181H314L288 198Z"/>` +
        // back row, then front row
        bottle(118, 190, 168, "var(--panel)", "r") +
        bottle(172, 190, 150, u.T) +
        bottle(226, 190, 176, "var(--line)", "w") +
        bottle(280, 190, 140, "var(--panel)", "k") +
        bottle(96, 204, 132, u.T) +
        bottle(150, 204, 160, "var(--panel)", "k") +
        bottle(204, 204, 128, "var(--accent)", "w") +
        bottle(258, 204, 150, u.H) +
        // the crate
        `<path class="k" d="M58 210H298L334 186V290L298 314H58Z" transform="translate(7 7)"/>` +
        `<path class="w o" d="M50 202H290V306H50Z"/>` +
        `<path class="o" fill="${u.T}" d="M290 202L326 176V282L290 306Z"/>` +
        `<path class="o n" d="M50 240H290M50 274H290M290 240L326 214M290 274L326 248"/>` +
        `<rect class="k" x="138" y="212" width="64" height="16" rx="8"/>` +
        // price tag
        `<path class="o n" d="M52 206Q28 206 22 230"/>` +
        `<g transform="rotate(14 30 262)"><path class="w o" d="M6 236H52L66 256L52 276H6Z"/>` +
        `<circle class="k" cx="16" cy="256" r="4"/>` +
        barcode(24, 246, 24, 20, 9) +
        `</g>`
      ),

    // A ledger sheet with a chart, a brush tick and a pencil
    skills: () =>
      svg("0 0 360 330", (u) =>
        `<g transform="rotate(-6 175 170)">` +
        `<rect class="k" x="68" y="48" width="230" height="262"/>` +
        `<rect class="w o" x="60" y="40" width="230" height="262"/>` +
        `<path class="o2 n" style="opacity:.45" d="${[...Array(9)].map((_, i) => `M60 ${66 + i * 26}H290`).join("")}${[...Array(8)].map((_, i) => `M${86 + i * 26} 40V302`).join("")}"/>` +
        `<rect class="k" x="60" y="40" width="230" height="26"/>` +
        `<path class="o3 n" style="stroke:var(--panel)" d="M72 53h40M124 53h22M158 53h52"/>` +
        `<rect class="o" fill="${u.T}" x="82" y="214" width="26" height="76"/>` +
        `<rect class="k" x="122" y="186" width="26" height="104"/>` +
        `<rect class="o" fill="${u.H}" x="162" y="198" width="26" height="92"/>` +
        `<rect class="r o" x="202" y="128" width="26" height="162"/>` +
        `<rect class="w o" x="242" y="160" width="26" height="130"/>` +
        `<path class="o n" style="stroke-width:4" d="M95 168L135 142L175 156L215 92L255 110"/>` +
        `<g class="k"><circle cx="95" cy="168" r="6"/><circle cx="135" cy="142" r="6"/><circle cx="175" cy="156" r="6"/><circle cx="215" cy="92" r="7"/><circle cx="255" cy="110" r="6"/></g>` +
        `</g>` +
        // pencil
        `<g transform="rotate(-38 250 270)">` +
        `<path class="k" d="M150 268H330V292H150Z" transform="translate(6 6)"/>` +
        `<path class="w o" d="M174 266H316V294H174Z"/>` +
        `<path class="o" fill="${u.H}" d="M174 280H316V294H174Z"/>` +
        `<path class="w o" d="M174 266L140 280L174 294Z"/><path class="k" d="M150 276L140 280L150 284Z"/>` +
        `<rect class="o" fill="${u.T}" x="300" y="264" width="20" height="32"/>` +
        `<path class="r o" d="M320 264H338Q344 264 344 270V290Q344 296 338 296H320Z"/>` +
        `</g>` +
        // brush tick
        `<path class="n" filter="url(#rough)" style="stroke:var(--accent);stroke-width:26;stroke-linecap:round;stroke-linejoin:round" d="M200 70L234 104L320 22"/>`
      ),

    /* ---------- Projects (16:9) ---------- */

    // A desktop app pulling from the warehouse and handing off finished sheets
    "pricing-tool": () =>
      svg("0 0 480 270", (u) =>
        burst(240, 136, 170, 420, 34, 31) +
        // the warehouse
        `<circle class="k" cx="62" cy="98" r="40" transform="translate(6 6)"/>` +
        `<circle class="w o" cx="62" cy="98" r="40"/>` +
        `<g class="o n" style="stroke-width:6">${[0, 60, 120].map((a) => `<path transform="rotate(${a} 62 98)" d="M62 70V126M54 76l8 8l8-8M54 120l8-8l8 8"/>`).join("")}</g>` +
        `<path class="k" d="M104 118l26 10l-26 10Z M92 124h16v8h-16Z"/>` +
        // the app window
        `<rect class="k" x="138" y="40" width="232" height="186" transform="translate(9 9)"/>` +
        `<rect class="w o" x="138" y="40" width="232" height="186"/>` +
        `<rect class="k" x="138" y="40" width="232" height="28"/>` +
        `<g class="w"><rect x="300" y="48" width="12" height="12"/><rect x="318" y="48" width="12" height="12"/><rect x="336" y="48" width="12" height="12" class="r"/></g>` +
        `<rect class="o" fill="${u.T}" x="154" y="82" width="200" height="22"/>` +
        `<rect class="r o" x="154" y="148" width="200" height="22"/>` +
        `<path class="o n" d="M154 104V214M220 82V214M290 82V214M354 82V214M154 126H354M154 148H354M154 170H354M154 192H354M154 214H354"/>` +
        `<path class="o n" style="stroke-width:4" d="M304 113l8 8l14-16M304 135l8 8l14-16M304 179l8 8l14-16M304 201l8 8l14-16"/>` +
        `<path class="n" style="stroke:var(--on-accent);stroke-width:4;stroke-linecap:round;stroke-linejoin:round" d="M304 157l8 8l14-16"/>` +
        // finished sheets
        `<path class="k" d="M378 126l26 10l-26 10Z M370 132h12v8h-12Z"/>` +
        `<g transform="rotate(8 446 150)"><rect class="w o" x="410" y="96" width="76" height="98"/></g>` +
        `<g transform="rotate(-4 440 150)"><rect class="w o" x="404" y="100" width="76" height="98"/>` +
        `<path class="o2 n" d="M404 120H480M404 140H480M404 160H480M404 180H480M430 100V198M456 100V198"/>` +
        `<path class="r" d="M456 100H480V120H456Z"/></g>`
      ),

    // A workflow of nodes, and a stopwatch that used to read six hours
    "alteryx-workflows": () =>
      svg("0 0 480 270", (u) =>
        `<path class="o n" style="stroke-width:7" d="M84 120H384M266 120V60"/>` +
        `<g class="k"><circle cx="128" cy="120" r="6"/><circle cx="214" cy="120" r="6"/><circle cx="316" cy="120" r="6"/><circle cx="266" cy="80" r="6"/></g>` +
        // input: a database
        `<path class="w o" d="M30 86V154Q30 168 60 168Q90 168 90 154V86"/>` +
        `<ellipse class="o" fill="${u.T}" cx="60" cy="86" rx="30" ry="12"/>` +
        `<path class="o n" d="M30 108Q30 120 60 120Q90 120 90 108M30 130Q30 142 60 142Q90 142 90 130"/>` +
        // a filter
        `<path class="k" d="M170 84L206 120L170 156L134 120Z" transform="translate(6 6)"/>` +
        `<path class="w o" d="M170 84L206 120L170 156L134 120Z"/>` +
        `<path class="o n" d="M156 110h28l-10 12v12l-8 4v-16Z"/>` +
        // second input: a price book
        `<rect class="w o" x="238" y="18" width="56" height="44"/><path class="o" fill="${u.H}" d="M238 18H294V30H238Z"/>` +
        // a join
        `<circle class="k" cx="266" cy="120" r="34" transform="translate(6 6)"/>` +
        `<circle class="r o" cx="266" cy="120" r="34"/>` +
        `<circle class="w o" cx="254" cy="120" r="16"/><circle class="w o" cx="278" cy="120" r="16" style="fill-opacity:.4"/>` +
        // output: a corrected file
        `<path class="k" d="M360 82H408L428 102V164H360Z" transform="translate(6 6)"/>` +
        `<path class="w o" d="M360 82H408L428 102V164H360Z"/><path class="o" fill="${u.T}" d="M408 82V102H428Z"/>` +
        `<path class="o2 n" d="M372 116h40M372 130h40M372 144h28"/>` +
        // the clock
        `<circle class="k" cx="206" cy="214" r="40" transform="translate(6 6)"/>` +
        `<rect class="k" x="198" y="160" width="16" height="16" rx="2"/>` +
        `<circle class="w o" cx="206" cy="214" r="40"/>` +
        `<path class="o" fill="${u.T}" d="M206 214L206 174A40 40 0 0 1 246 214Z" style="opacity:.6"/>` +
        `<path class="n" style="stroke:var(--accent);stroke-width:6;stroke-linecap:round" d="M206 214L206 182"/>` +
        `<circle class="k" cx="206" cy="214" r="5"/>` +
        `<g transform="rotate(-4 300 206)"><rect class="k" x="262" y="188" width="88" height="30"/>` +
        `<text class="lt w" x="306" y="211" text-anchor="middle" font-size="22">6 HRS</text>` +
        `<path class="n" style="stroke:var(--accent);stroke-width:5" d="M258 206L354 198"/></g>` +
        `<g transform="rotate(3 310 244)"><rect class="r o" x="264" y="226" width="96" height="34"/>` +
        `<text class="lt" x="312" y="252" text-anchor="middle" font-size="26" style="fill:var(--on-accent)">1 MIN</text></g>`
      ),

    // A backlog card with what is on it scattered around
    hobbylog: () =>
      svg("0 0 480 270", (u) =>
        `<g transform="rotate(-3 240 136)">` +
        `<rect class="k" x="150" y="24" width="180" height="228" transform="translate(9 9)"/>` +
        `<rect class="w o" x="150" y="24" width="180" height="228"/>` +
        `<rect class="k" x="150" y="24" width="180" height="32"/>` +
        `<text class="lt w" x="166" y="49" font-size="22">BACKLOG</text>` +
        [0, 1, 2, 3, 4]
          .map((i) => {
            const y = 72 + i * 36;
            const done = i < 2;
            return (
              `<rect class="${done ? "k" : "w"} o" x="166" y="${y}" width="20" height="20"/>` +
              (done ? `<path class="n" style="stroke:var(--panel);stroke-width:4" d="M170 ${y + 10}l5 5l8-10"/>` : "") +
              `<path class="o3 n" d="M198 ${y + 10}H${270 + ((i * 37) % 44)}"/>` +
              (i === 2 ? `<path class="r" d="M196 ${y}H316V${y + 20}H196Z" style="opacity:.9"/><path class="o3 n" style="stroke:var(--on-accent)" d="M204 ${y + 10}H300"/>` : "")
            );
          })
          .join("") +
        `</g>` +
        // a controller
        `<g transform="rotate(-14 84 86)"><path class="k" d="M34 66Q34 50 52 50H116Q134 50 134 66L142 112Q144 126 130 126Q118 126 110 108H58Q50 126 38 126Q24 126 26 112Z" transform="translate(6 6)"/>` +
        `<path class="w o" d="M34 66Q34 50 52 50H116Q134 50 134 66L142 112Q144 126 130 126Q118 126 110 108H58Q50 126 38 126Q24 126 26 112Z"/>` +
        `<path class="k" d="M52 74h10v-10h8v10h10v8h-10v10h-8v-10h-10Z"/>` +
        `<circle class="r o3" cx="106" cy="74" r="6"/><circle class="k" cx="120" cy="86" r="6"/></g>` +
        // a book
        `<g transform="rotate(10 82 206)"><rect class="k" x="36" y="168" width="96" height="74" transform="translate(6 6)"/>` +
        `<rect class="r o" x="36" y="168" width="96" height="74"/><rect class="k" x="36" y="168" width="16" height="74"/>` +
        `<path class="o3 n" style="stroke:var(--on-accent)" d="M66 192h48M66 204h32"/></g>` +
        // a clapperboard
        `<g transform="rotate(8 404 82)"><rect class="k" x="354" y="64" width="104" height="64" transform="translate(6 6)"/>` +
        `<rect class="o" fill="${u.T}" x="354" y="64" width="104" height="64"/>` +
        `<g transform="rotate(-14 354 62)"><rect class="w o" x="354" y="40" width="104" height="22"/>` +
        `<path class="k" d="M366 40h14l-12 22h-14ZM394 40h14l-12 22h-14ZM422 40h14l-12 22h-14Z"/></g></g>` +
        // a dumbbell
        `<g transform="rotate(-20 412 210)"><rect class="o" fill="${u.H}" x="370" y="203" width="84" height="12"/>` +
        `<rect class="k" x="350" y="180" width="24" height="58" rx="4"/><rect class="k" x="450" y="180" width="24" height="58" rx="4"/>` +
        `<rect class="w o" x="340" y="188" width="14" height="42" rx="3"/><rect class="w o" x="470" y="188" width="14" height="42" rx="3"/></g>`
      ),

    // A folded newspaper, and the email copy flying off
    "family-newsletter": () =>
      svg("0 0 480 270", (u) =>
        burst(400, 70, 46, 220, 34, 12, Math.PI * 0.55, Math.PI * 1.25) +
        `<g transform="rotate(-5 200 150)">` +
        `<rect class="k" x="62" y="34" width="250" height="216" transform="translate(9 9)"/>` +
        `<rect class="w o" x="62" y="34" width="250" height="216"/>` +
        `<text class="lt k" x="187" y="78" text-anchor="middle" font-size="34">FAMILY NEWS</text>` +
        `<path class="o n" d="M78 88H296M78 94H296"/>` +
        `<rect class="o" fill="${u.T}" x="78" y="106" width="118" height="80"/>` +
        `<circle class="w o" cx="122" cy="146" r="18"/><circle class="w o" cx="156" cy="152" r="14"/><path class="w o" d="M96 186Q122 160 146 186ZM136 186Q156 166 178 186Z"/>` +
        `<path class="k" d="M208 106H296V118H208Z"/>` +
        `<path class="o2 n" d="${[...Array(6)].map((_, i) => `M208 ${132 + i * 10}H${i === 5 ? 262 : 296}`).join("")}${[...Array(4)].map((_, i) => `M78 ${200 + i * 12}H${i === 3 ? 160 : 296}`).join("")}"/>` +
        `</g>` +
        // the envelope
        `<g transform="rotate(14 392 74)"><rect class="k" x="338" y="40" width="112" height="70" transform="translate(7 7)"/>` +
        `<rect class="w o" x="338" y="40" width="112" height="70"/>` +
        `<path class="o n" d="M338 40L394 82L450 40M338 110L380 74M450 110L408 74"/>` +
        `<circle class="r o" cx="394" cy="82" r="13"/></g>`
      ),

    // A derelict ship adrift, and the character sheet that goes with it
    "dead-in-the-water": () =>
      svg("0 0 480 270", (u) =>
        `<rect class="k" x="0" y="0" width="480" height="270" style="opacity:.08"/>` +
        `<g class="k">${[[40, 30], [120, 20], [210, 44], [452, 30], [430, 120], [24, 150], [96, 236], [470, 236], [300, 18]].map(([x, y]) => `<path d="M${x} ${y - 7}L${x + 2} ${y - 2}L${x + 7} ${y}L${x + 2} ${y + 2}L${x} ${y + 7}L${x - 2} ${y + 2}L${x - 7} ${y}L${x - 2} ${y - 2}Z"/>`).join("")}</g>` +
        // the sheet behind
        `<g transform="rotate(8 386 150)"><rect class="k" x="320" y="54" width="132" height="176" transform="translate(7 7)"/>` +
        `<rect class="w o" x="320" y="54" width="132" height="176"/>` +
        `<rect class="k" x="320" y="54" width="132" height="24"/>` +
        `<g class="o3 n">${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect x="${332 + c * 56}" y="${88 + r * 38}" width="48" height="30"/>`).join("")).join("")}</g>` +
        `<text class="lt r" x="356" y="112" text-anchor="middle" font-size="20">16</text>` +
        `<text class="lt k" x="412" y="150" text-anchor="middle" font-size="20">12</text>` +
        `<path class="o2 n" d="M332 206H440M332 216H404"/></g>` +
        // the ship
        `<g transform="rotate(-12 190 140)">` +
        `<path class="k" d="M58 120L250 104L326 132L250 160L58 152Z" transform="translate(8 8)"/>` +
        `<path class="w o" d="M58 120L250 104L326 132L250 160L58 152Z"/>` +
        `<path class="o" fill="${u.T}" d="M58 138L326 132L250 160L58 152Z"/>` +
        `<path class="k" d="M262 122L294 128L268 134Z"/>` +
        `<rect class="k" x="28" y="112" width="34" height="48"/>` +
        `<rect class="w o" x="110" y="84" width="70" height="26"/><path class="o" fill="${u.H}" d="M120 84h50v-16h-50Z"/>` +
        `<path class="o n" d="M152 68L160 40L174 52"/>` +
        `<path class="r o" d="M196 112L214 108L222 126L204 140L194 128Z"/>` +
        `<path class="o n" d="M140 126h24M140 140h40"/>` +
        `</g>` +
        // smoke from the dead engine
        `<g class="w o"><circle cx="20" cy="164" r="14"/><circle cx="8" cy="190" r="10"/><circle cx="26" cy="208" r="7"/></g>`
      ),

    /* ---------- Shelf books (portrait pages) ---------- */

    // A manga page: a shout, an eye, a beat
    manga: () =>
      svg("0 0 300 380", (u) =>
        `<clipPath id="${u.clip(1)}"><rect x="24" y="24" width="252" height="132"/></clipPath>` +
        `<rect class="k" x="24" y="24" width="252" height="332" transform="translate(8 8)"/>` +
        `<rect class="w o" x="24" y="24" width="252" height="332"/>` +
        `<g clip-path="url(#${u.clip(1)})">${burst(150, 92, 34, 260, 70, 21)}</g>` +
        `<path class="w o" d="M150 44L166 66L194 54L190 80L220 88L194 104L206 128L176 120L162 144L148 120L118 132L124 106L94 96L122 84L112 58L140 66Z"/>` +
        `<text class="jp k" x="158" y="104" text-anchor="middle" font-size="30" lang="ja">ドン!</text>` +
        `<rect class="o n" x="24" y="24" width="252" height="132"/>` +
        `<rect class="o" fill="${u.T}" x="24" y="168" width="128" height="188"/>` +
        `<path class="w o" d="M36 262Q88 214 140 262Q88 300 36 262Z"/>` +
        `<circle class="k" cx="88" cy="260" r="24"/><circle class="w" cx="96" cy="250" r="7"/>` +
        `<path class="o n" style="stroke-width:7" d="M34 236Q86 196 146 228"/>` +
        `<rect class="o" fill="${u.H}" x="164" y="168" width="112" height="188"/>` +
        `<circle class="r o" cx="220" cy="248" r="40"/>` +
        `<text class="lt k" x="220" y="330" text-anchor="middle" font-size="48">!?</text>`
      ),

    // Construction drawing: a box in perspective, an ellipse, ink and a nib
    art: () =>
      svg("0 0 300 380", (u) =>
        `<path class="o2 n" style="opacity:.55" d="M20 120L280 96M20 120L150 200M280 96L150 200M150 30V300M60 300L250 300"/>` +
        `<path class="o" fill="${u.T}" d="M150 140L238 112V206L150 240Z"/>` +
        `<path class="w o" d="M62 112L150 140V240L62 206Z"/>` +
        `<path class="w o" d="M62 112L150 86L238 112L150 140Z"/>` +
        `<path class="o2 n" style="stroke-dasharray:6 6" d="M62 206L150 178L238 206M150 86V178"/>` +
        `<ellipse class="r o" cx="150" cy="113" rx="54" ry="16" transform="rotate(-2 150 113)" style="fill-opacity:.9"/>` +
        // ink bottle
        `<path class="k" d="M44 284H124V352H44Z" transform="translate(6 6)"/>` +
        `<path class="k" d="M44 284Q44 272 60 272H108Q124 272 124 284V352H44Z"/>` +
        `<rect class="w o" x="66" y="252" width="36" height="22"/>` +
        `<rect class="w o" x="54" y="300" width="60" height="30"/>` +
        `<text class="lt k" x="84" y="324" text-anchor="middle" font-size="20">INK</text>` +
        // pen
        `<g transform="rotate(34 220 300)"><rect class="k" x="200" y="196" width="24" height="120"/>` +
        `<path class="w o" d="M200 316H224L218 344L212 362L206 344Z"/><path class="o2 n" d="M212 330V352"/></g>` +
        `<circle class="r" cx="182" cy="356" r="9"/><circle class="r" cx="160" cy="364" r="5"/><circle class="r" cx="200" cy="372" r="4"/>`
      ),

    // Headphones around a book, sound coming off them
    audiobooks: () =>
      svg("0 0 300 380", (u) =>
        `<path class="n" style="stroke:var(--line);stroke-width:30;stroke-linecap:round" d="M56 210V170Q56 60 150 60Q244 60 244 170V210"/>` +
        `<path class="n" style="stroke:var(--panel);stroke-width:14;stroke-linecap:round" d="M56 206V170Q56 68 150 68Q244 68 244 170V206"/>` +
        // the book between
        `<path class="k" d="M100 180H200V300H100Z" transform="translate(7 7)"/>` +
        `<path class="w o" d="M100 180Q125 170 150 186Q175 170 200 180V300Q175 290 150 306Q125 290 100 300Z"/>` +
        `<path class="o n" d="M150 186V306"/><path class="o2 n" d="M112 204q18-6 30 2M112 220q18-6 30 2M112 236q18-6 30 2M158 206q14-8 30-2M158 222q14-8 30-2"/>` +
        // ear cups
        `<rect class="k" x="26" y="190" width="56" height="104" rx="22" transform="translate(7 7)"/>` +
        `<rect class="k" x="218" y="190" width="56" height="104" rx="22" transform="translate(7 7)"/>` +
        `<rect class="w o" x="26" y="190" width="56" height="104" rx="22"/>` +
        `<rect class="w o" x="218" y="190" width="56" height="104" rx="22"/>` +
        `<rect class="r o" x="40" y="206" width="28" height="72" rx="12"/>` +
        `<rect class="o" fill="${u.T}" x="232" y="206" width="28" height="72" rx="12"/>` +
        // sound
        `<path class="n" style="stroke:var(--accent);stroke-width:6;stroke-linecap:round" d="M22 330q-16-16 0-32M8 344q-28-30 0-60M278 330q16-16 0-32M292 344q28-30 0-60"/>`
      ),

    // A table: the map, a ship token, a d20 and a d6
    tabletop: () =>
      svg("0 0 300 380", (u) =>
        `<g transform="rotate(-4 150 170)">` +
        `<rect class="k" x="24" y="40" width="252" height="220" transform="translate(8 8)"/>` +
        `<rect class="o" fill="${u.F}" x="24" y="40" width="252" height="220"/>` +
        `<path class="o2 n" style="opacity:.7" d="${[...Array(8)].map((_, i) => `M${24 + (i + 1) * 28} 40V260`).join("")}${[...Array(7)].map((_, i) => `M24 ${40 + (i + 1) * 28}H276`).join("")}"/>` +
        `<rect class="o n" x="24" y="40" width="252" height="220"/>` +
        `<path class="w o" d="M88 104L136 96L156 110L136 124L88 118Z"/><rect class="k" x="78" y="100" width="12" height="20"/>` +
        `<path class="o n" style="stroke-dasharray:8 7;stroke:var(--accent);stroke-width:5" d="M162 112Q210 120 216 176"/>` +
        `<path class="k" d="M202 176l14 12l14-12l-14-12Z"/>` +
        `</g>` +
        `<g transform="translate(8 8)" class="k"><path d="M150 230L209 264V332L150 366L91 332V264Z"/></g>` +
        d20(150, 298, 68, "r", "") +
        `<text class="lt" x="150" y="316" text-anchor="middle" font-size="34" style="fill:var(--on-accent)">20</text>` +
        `<g transform="rotate(14 250 320)"><rect class="k" x="222" y="292" width="54" height="54" rx="6" transform="translate(6 6)"/>` +
        `<rect class="w o" x="222" y="292" width="54" height="54" rx="6"/>` +
        `<g class="k"><circle cx="236" cy="306" r="5"/><circle cx="249" cy="319" r="5"/><circle cx="262" cy="332" r="5"/></g></g>`
      ),
  };

  window.ART = ART;
})();
