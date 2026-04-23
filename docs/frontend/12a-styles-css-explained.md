# styles.css — Detalus paaiškinimas

**Šaltinio failas:** `public/css/styles.css`

Visas programėlės vizualinis stilius viename faile. Failas suskirstytas į sekcijas komentarais `/* === ... === */`.

---

## 1. Design Tokens — `:root` blokas (1–31 eilutės)

```css
:root {
  --bg:      #0f1115;
  --primary: #8b6fff;
  --radius:  10px;
}
```

`:root` — pseudoelementas reiškiantis patį `<html>` elementą (aukščiausias lygis). CSS kintamieji (`--pavadinimas`) apibrėžiami čia vieną kartą ir naudojami visame faile per `var(--pavadinimas)`.

**Kodėl tai svarbu:** Jei norima pakeisti spalvą ar dydį — pakeiti reikia tik čia, ne šimtuose vietų.

### Spalvų sistema

| Kintamasis | Spalva | Kur naudojama |
|---|---|---|
| `--bg` | `#0f1115` — labai tamsiai mėlyna | Puslapio fonas |
| `--panel` | `#171a21` | Kortelės, viršutinė juosta |
| `--panel-2` | `#1f232d` | Įvesties laukai, įdėti elementai |
| `--border` | `#2a2f3a` | Kraštinės, skiriamosios linijos |
| `--text` | `#e7eaf0` | Pagrindinis tekstas |
| `--muted` | `#8a93a5` | Antrinis tekstas, placeholder |
| `--primary` | `#8b6fff` — violetinė | Mygtukai, aktyvios būsenos |
| `--danger` | `#ef4a5b` — raudona | Ištrinti, klaidos |
| `--success` | `#3fcf8e` — žalia | Pažiūrėta, baigta |
| `--warn` | `#f0b341` — geltona | Žiūriu dabar |

---

## 2. Baziniai stiliai — `*`, `body` (33–53 eilutės)

```css
* {
  box-sizing: border-box;
}
```

`box-sizing: border-box` — nurodo, kad `width` ir `height` **apima** `padding` ir `border`. Numatytasis elgesys be šio: `width` neapima padding, kas daro skaičiavimus sudėtingus.

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", ...;
}
```

Šriftų sąrašas — naršyklė paima pirmą rastą. `Inter` → jei nėra, `system-ui` → jei nėra, `Arial`.

---

## 3. Slinkimo juosta (55–58 eilutės)

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: var(--border); }
```

`::` — pseudo-elementas (stilizuoja dalį elemento, ne patį elementą). `::-webkit-scrollbar` stilizuoja slinkimo juostą Chromium naršyklėse.

---

## 4. Viršutinė juosta — `.topbar` (79–151 eilutės)

```css
.topbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
```

`display: flex` — įjungia Flexbox. Vaikų elementai išdėstomi vienoje eilutėje.
`flex-wrap: wrap` — leidžia elementams pereiti į kitą eilutę (kai ekranas per siauras).

```css
.tabs {
  flex: 1 1 100%;
  order: 3;
}
```

- `flex: 1 1 100%` — tabs užima visą eilutės plotį (100%), todėl jie pereina į naują eilutę telefone
- `order: 3` — CSS Flexbox leidžia keisti vizualinę tvarką nepriklausomai nuo HTML tvarkos. Tabs rodomos po brand ir auth-area

```css
@media (min-width: 720px) {
  .tabs {
    order: 0;
    flex: 1;
  }
}
```

Nuo 720px tabs grįžta į vidurinę vietą (order: 0) ir nebepereina į naują eilutę.

### Gradientinis tekstas `.brand-mark`

```css
.brand-mark {
  background: linear-gradient(135deg, var(--primary), #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Triukas: `background-clip: text` apkarpys foną pagal teksto formą. `text-fill-color: transparent` padaro tekstą skaidrų, kad fonas matytųsi per tekstą → gradientinis tekstas.

---

## 5. Perėjimai ir animacijos

```css
.tab {
  transition: background 0.12s, color 0.12s, border-color 0.12s;
}
```

`transition` — CSS automatiškai animuoja nurodytas savybes kai jos pasikeičia (pvz., :hover).
`0.12s` — trukmė sekundėmis. Greitesni nei 0.1s yra nematomi, lėtesni nei 0.3s — pastebimi.

```css
@keyframes fade {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.view {
  animation: fade 0.18s ease;
}
```

`@keyframes` apibrėžia animacijos kadrus. `from` → `to` reiškia pradžią → pabaigą. `.view` naudoja šią animaciją — rodinio perjungimas sklandžiai atsipalaiduoja į vietą.

---

## 6. Kortelių tinklelis — `.grid` ir Responsive (289–356 eilutės)

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;   /* 1 stulpelis — mobilūs */
  gap: 14px;
}

@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }  /* 2 stulpeliai */
}

@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }  /* 3 stulpeliai */
}
```

**Mobile-first** principas: baziniai stiliai taikomi visiems ekranams (1 stulpelis). `@media (min-width: ...)` prideda stulpelių didėjant ekranui.

`repeat(2, 1fr)` = `1fr 1fr` — du vienodo pločio stulpeliai. `1fr` = viena frakcija laisvos vietos.

### Kortelės pakėlimas hover metu

```css
.card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}
```

`translateY(-3px)` — pakelia 3 pikselius aukštyn (minusinė y ašis = aukštyn). Kartu su didesniu šešėliu sukuria "pakėlimo" efektą.

### Paveikslėlio proporcijos

```css
.card-img {
  aspect-ratio: 210 / 295;
}
```

`aspect-ratio` — automatiškai apskaičiuoja aukštį pagal plotį. `210/295` = TV serialų plakato proporcija (kaip filmų plakatai).

### Teksto apkarpymas

```css
.card-summary {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

Rodo tik 3 teksto eilutes, po jų `...`. Tai senas, bet plačiausiai palaikomas būdas apkirpti daugiaeiles tekstą CSS.

---

## 7. Statusų žetonai `.status-badge` (360–373 eilutės)

```css
.status-badge {
  border-radius: 999px;     /* visiškai apvalūs kampai = "pill" forma */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.watching { color: var(--warn); background: rgba(240, 179, 65, 0.1); }
```

`.status-badge.watching` — abu klasės turi būti tam pačiame elemente (be tarpo tarp selektorių). `rgba(240, 179, 65, 0.1)` — ta pati spalva kaip `--warn`, bet 10% permatomumo, sukuria subtilų foną.

---

## 8. Filtravimo žetonai `.chip` (379–404 eilutės)

```css
.chip.on {
  background: var(--primary);
  color: white;
}
```

Aktyvus filtras pažymimas `.on` klase, kurią prideda JavaScript. CSS tik apibrėžia kaip `.on` atrodo — JS nusprendžia kada ją pridėti.

---

## 9. Sezonų sekimas — eiga ir animacijos (717–757 eilutės)

### Progreso juosta

```css
.progress-track {
  background: var(--panel-2);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  background: var(--primary);
  transition: width 0.3s ease, background 0.3s ease;
}

.progress-fill.complete { background: var(--success); }
```

`overflow: hidden` ant `.progress-track` užtikrina, kad `.progress-fill` nesimato už juostos ribų net kai `border-radius` sudaro tarpą.

`transition: width 0.3s` — progreso juosta sklandžiai plečiasi kai JavaScript pakeičia `style.width`.

### Chevron (rodyklė) pasukimas

```css
.chevron {
  transition: transform 0.18s ease;
}
.season.open .chevron {
  transform: rotate(90deg);
}
```

Kai sezonui pridedama `.open` klasė (JS), rodyklė pasisuka 90°. Pats simbolis `›` lieka tas pats — tik CSS `transform: rotate()` pasuka jį.

### Mark All mygtukas — matomas tik hover

```css
.mark-all-btn {
  opacity: 0;
  pointer-events: none;
}
.season-header:hover .mark-all-btn {
  opacity: 1;
  pointer-events: auto;
}
```

`pointer-events: none` — elementas nematomas ir pelė jo "nejaučia" (negali spausti). Hover ant tėvo elemento parodo mygtuką. Šis būdas geriau nei `display: none` nes leidžia CSS transition animuoti pasirodymo efektą.

---

## 10. Modal — iššokantis langas (490–638 eilutės)

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  z-index: 200;
}
```

- `position: fixed` — fiksuotas ekrane, nejuda slenkant
- `inset: 0` — tai pat kaip `top: 0; right: 0; bottom: 0; left: 0` — užpildo visą ekraną
- `background: rgba(0,0,0,0.72)` — 72% permatomumo juodas fonas (tamsina foną)
- `z-index: 200` — virš visko kito

```css
.modal-backdrop:not([hidden]) {
  display: flex;
}
```

Kai `hidden` atributas pašalinamas (JS: `el.hidden = false`), backdrop tampa `flex` konteineriu — centruoja modal viduje.

### Modal animacija

```css
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
```

Modal atsiranda šiek tiek mažesnis ir žemiau nei galutinė pozicija, tada sklandžiai auga į pilną dydį. `scale(0.95)` = 95% dydžio.

### Mobilusis modal

```css
@media (max-width: 500px) {
  .modal-inner { flex-direction: column; }
  .modal-poster { width: 100%; height: 220px; }
}
```

Iki 500px paveikslėlis pereina virš teksto (column), o ne šone. `min-width: unset` — panaikina anksčiau nustatytą fiksuotą plotį.

---

## 11. Toast pranešimai (644–664 eilutės)

```css
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
}
```

`left: 50%` pastūmia kairį kraštą į ekrano vidurį. Bet tai reiškia — elementas prasideda viduryje, ne centruojasi viduryje. `translateX(-50%)` pastumia jį atgal per pusę savo pločio → tikras centravimas.

```css
@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

`translateX(-50%)` turi būti abiejuose kadruose — jei praleistum, animacijos metu toast šokteltų į šoną.

---

## Responsive breakpoint suvestinė

| Breakpoint | CSS | Kas pasikeičia |
|---|---|---|
| Numatyta (mobilūs) | be @media | 1 stulpelis, tabs apačioje |
| `≥500px` | `max-width: 500px` | Modal: paveikslėlis šone |
| `≥640px` | `min-width: 640px` | 2 stulpeliai |
| `≥720px` | `min-width: 720px` | Tabs viename lygyje su brand |
| `≥1024px` | `min-width: 1024px` | 3 stulpeliai |

---

## Susijęs dokumentas

[[12-styles-css]] — trumpas aprašymas  
[[00-syntax-reference]] — bendroji CSS sintaksė
