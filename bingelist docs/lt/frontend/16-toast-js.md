# public/js/toast.js — Pranešimai

**Šaltinio failas:** `public/js/toast.js`  
**Priklauso nuo:** niekas  
**Naudoja:** [[19-search-js]], [[20-watchlist-js]], [[21-episodes-js]]

---

## Ką šis failas daro

Rodo trumpą teksto pranešimą ekrano apačioje. Automatiškai paslepiamas po 2.5 sekundės. Bet kuris programos modulis gali kviesti `toast()` neimportuodamas nieko kito.

---

## Naudojimas

```js
import { toast } from './toast.js';

toast('Pridėta "Breaking Bad"');          // numatytasis info stilius
toast('Jau watchlist\'e', 'error');       // raudona kraštinė
toast('Statusas atnaujintas!', 'success'); // žalia kraštinė
```

---

## Pagrindinės sąvokos

- **Modulio lygio būsena** — `el` ir `timer` deklaruojami vieną kartą kai modulis įkraunamas. Kiekvienas `toast()` kvietimas pakartotinai naudoja tą patį DOM elementą vietoje naujo kūrimo.
- **`clearTimeout(timer)`** — jei toast jau rodomas ir iškviečiamas naujas, automatinio slėpimo laikmatis atšaukiamas ir paleidžiamas iš naujo. Tai neleidžia pirmam laikmaičiui paslėpti antro toast'o per anksti.
- **CSS klasės perjungimas** — `classList.toggle('error', sąlyga)` prideda klasę jei sąlyga teisinga, pašalina jei klaidinga. Tai reiškia tipas gali teisingai keistis tarp kvietimų.

---

## Vizuali išvaizda

Apibrėžta `styles.css` po `.toast`:
- Fiksuota pozicija ekrano apačioje centre
- Slysta aukštyn su CSS animacija atsiradimo metu
- `.toast.error` → raudonas tekstas/kraštinė
- `.toast.success` → žalias tekstas/kraštinė
- Numatytoji (info) → neutrali skydelio spalva

---

## Susiję dokumentai

[[12-styles-css]] · [[01-index]]
