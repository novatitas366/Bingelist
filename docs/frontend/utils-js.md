# public/js/utils.js — Shared utilities

**Source file:** `public/js/utils.js`  
**Depends on:** nothing  
**Used by:** [[search-js]], [[watchlist-js]], [[episodes-js]], [[modal-js]]

---

## What this file does

Holds two things that were previously copy-pasted across multiple files:
- `stripHtml` — removes HTML tags from TVMaze summaries
- `STATUS_LABELS` — human-readable names for the four watchlist statuses

---

## Exports

### `stripHtml(html)`
TVMaze returns show/episode descriptions with HTML tags (`<p>`, `<b>`, etc.). Before displaying them as plain text, the tags must be stripped.

```js
stripHtml('<p>A <b>chemistry teacher</b> breaks bad.</p>')
// → "A chemistry teacher breaks bad."
```

Used in: [[search-js]], [[episodes-js]], [[modal-js]]

### `STATUS_LABELS`
Maps database status values to Lithuanian-friendly display strings.

```js
{
  plan_to_watch: 'Plan to watch',
  watching:      'Watching',
  watched:       'Watched',
  dropped:       'Dropped',
}
```

Used in: [[watchlist-js]], [[episodes-js]]

---

## Related docs

[[search-js]] · [[watchlist-js]] · [[episodes-js]] · [[modal-js]] · [[index]]
