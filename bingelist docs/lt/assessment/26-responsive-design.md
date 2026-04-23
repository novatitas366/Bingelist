# Vertinimas: Responsive Dizainas

**Reikalavimas:** Pritaikytas bent 3 prietaisų tipams: PC, planšetė, išmanusis telefonas  
**Statusas: ✅ 4 lūžio taškai apimantys visas tris prietaisų kategorijas**

---

## Kaip responsive dizainas veikia šioje programoje

CSS `public/css/styles.css` naudoja **CSS media užklausas** (`@media (min-width: Xpx) { ... }`) išdėstymui keisti pagal ekrano plotį. Dizainas yra **mobile-first** — numatytasis CSS skirtas mažiems ekranams, o taisyklės laipsniškai pridedamos didesniems ekranams.

---

## Lūžio taškai

### Numatyta — Mobilusis (< 640px) — Išmanusis telefonas

- Kortelių tinklelis: **1 stulpelis**
- Viršutinė juosta: ženklas ir skirtukai **perkeliami į atskiras eilutes** (skirtukai eina po ženklu)
- Modalas: vertikalus plakatas **sukraunamas virš** serialo detalių (flex-direction: column)

```css
/* Numatyta (media užklausos nereikia — tai yra bazė) */
.grid { grid-template-columns: 1fr; }
.tabs { order: 3; width: 100%; }
```

---

### 640px — Planšetė (maža)

```css
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
```

Kortelių tinklelis keičiasi į **2 stulpelius**.

---

### 720px — Planšetė (didesnė) / Mažas stalinis

```css
@media (min-width: 720px) {
  .tabs { order: 0; width: auto; flex: 1; }
}
```

Skirtukai grįžta **eilutėje** su ženklu toje pačioje eilutėje (viršutinė juosta lieka viena eilute).

---

### 1024px — Stalinis / PC

```css
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

Kortelių tinklelis keičiasi į **3 stulpelius**.

---

### ≤ 500px — Mažas telefonas (modalas)

```css
@media (max-width: 500px) {
  .modal-inner { flex-direction: column; }
  .modal-poster { width: 100%; height: 220px; min-width: unset; }
}
```

Serialo detalių modalas: plakatas tampa **viso pločio juosta** virš teksto vietoje šoninio skydelio.

---

## Vizuali suvestinė

| Ekrano plotis | Tinklelis | Viršutinės juostos skirtukai | Modalas |
|---|---|---|---|
| < 500px | 1 stulp. | Po ženklu | Plakatas sukrautas |
| 500–640px | 1 stulp. | Po ženklu | Šalia |
| 640–720px | 2 stulp. | Po ženklu | Šalia |
| 720–1024px | 2 stulp. | Eilutėje | Šalia |
| ≥ 1024px | 3 stulp. | Eilutėje | Šalia |

---

## Papildomi responsive elementai

- Visi mygtukai, įvestys ir kortelės naudoja `width: 100%` ir procentais grįstus dydžius kad natūraliai keistų dydį
- `flex-wrap: wrap` ant `.card-actions` neleidžia mygtukams išeiti už ribų mažuose ekranuose
- `max-width: 1100px` ant `.container` centruoja turinį labai plačiuose ekranuose
- `max-width: 380px` ant `.auth-card` neleidžia prisijungimo formai išsitempti per visą puslapį

---

## Dokumentai

[[12-styles-css]] · [[11-index-html]] · [[01-index]]
