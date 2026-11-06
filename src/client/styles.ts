/**
 * Stylesheet injected once per plugin activation. The dynamic Client bundle
 * carries no CSS Modules, so every class is prefixed `dsh-task-tree-` and only
 * theme tokens supply color, radius, elevation, and motion.
 */
export const styles = `
/* ---------- shared row glyphs ---------- */
.dsh-task-tree-glyph { position:relative; flex:none; display:grid; place-items:center; width:16px; height:20px; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-glyph > * { grid-area:1 / 1; }
.dsh-task-tree-check { overflow:visible; }
.dsh-task-tree-check-ring { fill:none; stroke:var(--dsw-alias-state-business-primary); stroke-width:1.2; opacity:.4; }
.dsh-task-tree-check-path { fill:none; stroke:var(--dsw-alias-state-business-primary); stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round;
  stroke-dasharray:1; stroke-dashoffset:0; animation:dsh-task-tree-draw var(--ds-transition-duration-slow, 320ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-active-dot { width:8px; height:8px; border-radius:50%; background:var(--dsw-alias-label-secondary); }
.dsh-task-tree-step-dot { box-sizing:border-box; width:9px; height:9px; border-radius:50%; border:1.5px solid var(--dsw-alias-label-tertiary); }
.dsh-task-tree-pending-dot { box-sizing:border-box; width:10px; height:10px; border-radius:50%; border:1.2px dashed var(--dsw-alias-label-caption); }
.dsh-task-tree-glyph-status, .dsh-task-tree-glyph-chevron { display:grid; place-items:center;
  transition:opacity var(--ds-transition-duration-fast, 150ms) var(--ds-ease-in-out, ease), transform var(--ds-transition-duration-fast, 150ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-glyph-chevron { opacity:0; transform:scale(.8); color:var(--dsw-alias-label-secondary); }
.dsh-task-tree-item[data-expanded] .dsh-task-tree-glyph-status,
.dsh-task-tree-item[data-partial] .dsh-task-tree-glyph-status { opacity:0; transform:scale(.8); }
.dsh-task-tree-item[data-expanded] .dsh-task-tree-glyph-chevron,
.dsh-task-tree-item[data-partial] .dsh-task-tree-glyph-chevron { opacity:1; transform:none; }
@keyframes dsh-task-tree-draw { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }

/* ---------- tree rows ---------- */
.dsh-task-tree-rows-frame { position:relative; }
.dsh-task-tree-rows { display:flex; flex-direction:column; gap:2px; }
.dsh-task-tree-row { --dsh-task-tree-indent:calc(var(--dsh-task-tree-depth, 0) * 16px); min-width:0; padding-inline-start:var(--dsh-task-tree-indent); }
.dsh-task-tree-line { display:flex; align-items:center; gap:4px; min-width:0; }
.dsh-task-tree-item { display:flex; flex:1 1 auto; align-items:center; gap:8px; min-width:0; padding:2px 6px; border:0; border-radius:var(--dsw-radius-sm);
  background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:13px; line-height:20px; text-align:left; cursor:pointer;
  transition:background-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-item:focus-visible, .dsh-task-tree-badge:focus-visible, .dsh-task-tree-decision:focus-visible {
  outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:-2px; }
.dsh-task-tree-row[data-status="done"] .dsh-task-tree-title { color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-row[data-status="pending"] .dsh-task-tree-title { color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-row[data-status="active"] .dsh-task-tree-title { color:var(--dsw-alias-label-primary); font-weight:500; }
.dsh-task-tree-title { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-badge { flex:none; min-width:20px; height:18px; padding:0 6px; border:0; border-radius:9px; background:var(--dsw-alias-bg-layer-2);
  color:var(--dsw-alias-label-secondary); font:inherit; font-size:11px; line-height:18px; cursor:pointer; }
.dsh-task-tree-badge[aria-expanded="true"] { background:var(--dsw-alias-interactive-bg-active); color:var(--dsw-alias-label-primary); }
.dsh-task-tree-detail { margin:0; padding:0 6px 2px 30px; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:18px; overflow-wrap:anywhere;
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-row-decisions { padding:2px 6px 4px 30px; }
@keyframes dsh-task-tree-fade { from { opacity:0; } to { opacity:1; } }
@keyframes dsh-task-tree-slide { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }
@media (hover: hover) {
  .dsh-task-tree-item:hover, .dsh-task-tree-badge:hover { background:var(--dsw-alias-interactive-bg-hover); }
  .dsh-task-tree-item[data-expandable]:hover .dsh-task-tree-glyph-status { opacity:0; transform:scale(.8); }
  .dsh-task-tree-item[data-expandable]:hover .dsh-task-tree-glyph-chevron { opacity:1; transform:none; }
}

/* ---------- latest-level scroll viewport ---------- */
/* Bottom-anchored: a taller group reveals older rows at its top while the newest rows stay put. */
/* No overscroll-behavior here: while the group is only a clipped window (its scroll range is zero)
   a contained group drops the wheel instead of chaining it to the card body, and a group grown to
   the whole card height would leave the card unscrollable. The card body keeps the containment, so
   the wheel still stops there instead of scrolling the transcript. */
.dsh-task-tree-scroll-group { --dsh-task-tree-fade:22px; position:relative; display:flex; flex-direction:column; justify-content:flex-end;
  overflow:hidden; }
.dsh-task-tree-scroll-group[data-scrollable] { display:block; overflow-y:auto; scrollbar-width:thin; --dsh-scrollbar-width:6px;
  --dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2); --dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2); }
.dsh-task-tree-scroll-group[data-faded] {
  -webkit-mask-image:linear-gradient(to bottom, transparent, black var(--dsh-task-tree-fade));
  mask-image:linear-gradient(to bottom, transparent, black var(--dsh-task-tree-fade)); }
.dsh-task-tree-scroll-group-content { position:relative; flex:none; display:flex; flex-direction:column; gap:2px; }

/* ---------- decision block ---------- */
.dsh-task-tree-decision-block { display:flex; flex-direction:column; gap:2px; padding:4px 0 4px 10px; border-left:2px solid var(--dsw-alias-border-l2);
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-decision-label { padding:0 6px; color:var(--dsw-alias-label-caption); font-size:11px; line-height:16px; }
.dsh-task-tree-decision-list { display:flex; flex-direction:column; gap:1px; margin:0; padding:0; list-style:none; }
.dsh-task-tree-decision { display:block; width:100%; padding:3px 6px; border:0; border-radius:var(--dsw-radius-sm); background:transparent;
  color:var(--dsw-alias-label-secondary); font:inherit; font-size:12px; line-height:18px; text-align:left; overflow-wrap:anywhere; cursor:pointer;
  transition:background-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-decision:disabled { cursor:default; color:var(--dsw-alias-label-tertiary); }
@media (hover: hover) {
  .dsh-task-tree-decision:not(:disabled):hover { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
}

/* ---------- card chrome shared by dock and float ---------- */
.dsh-task-tree-card-header { display:flex; align-items:center; gap:8px; min-width:0; }
.dsh-task-tree-card-toggle { display:flex; flex:1 1 auto; align-items:center; gap:10px; min-width:0; padding:0; border:0; background:transparent;
  font:inherit; text-align:left; cursor:pointer; }
.dsh-task-tree-card-lead { display:grid; flex:none; place-items:center; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-card-title { flex:0 1 auto; min-width:0; overflow:hidden; color:var(--dsw-alias-label-primary); font-size:13px; line-height:24px;
  font-weight:500; white-space:nowrap; text-overflow:ellipsis; }
.dsh-task-tree-icon-button { display:grid; flex:none; place-items:center; width:24px; height:24px; padding:0; border:0; border-radius:var(--dsw-radius-sm);
  background:transparent; color:var(--dsw-alias-label-tertiary); cursor:pointer; }
.dsh-task-tree-icon-button:focus-visible, .dsh-task-tree-header-toggle:focus-visible { color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-interactive-bg-hover); outline:none; }
.dsh-task-tree-pill { display:inline-flex; flex:none; align-items:center; gap:6px; height:22px; padding:0 10px; border:0; border-radius:11px;
  background:var(--dsw-alias-state-business-tertiary); color:var(--dsw-alias-state-business-primary); font:inherit; font-size:12px; line-height:18px;
  white-space:nowrap; cursor:pointer; animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-pill-dot { width:3px; height:3px; border-radius:50%; background:currentColor; opacity:.6; }
.dsh-task-tree-pill-action { font-weight:500; }
.dsh-task-tree-pill-row { display:flex; padding:0 12px 6px; }
.dsh-task-tree-scroll { overflow-y:auto; overscroll-behavior:contain; --dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2); --dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2); }
@media (hover: hover) {
  .dsh-task-tree-icon-button:hover, .dsh-task-tree-header-toggle:hover { color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-interactive-bg-hover); }
  .dsh-task-tree-pill:hover { filter:brightness(0.97); }
}

/* ---------- dock ---------- */
.dsh-task-tree-dock { box-sizing:border-box; flex:none; overflow:hidden; margin:0 auto;
  width:calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));
  max-width:calc(var(--dsh-composer-card-max-width) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset) - var(--dsh-composer-dock-inset));
  padding:6px 12px; border:0; --dsw-elevation-stroke-color:var(--dsw-alias-border-l1); border-radius:var(--dsw-radius-lg);
  background:var(--dsw-specific-menu); backdrop-filter:var(--dsw-menu-backdrop-filter); box-shadow:var(--dsw-elevation-panel);
  animation:dsh-task-tree-slide var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-collapse { display:grid; grid-template-rows:0fr; transition:grid-template-rows var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-collapse[data-open] { grid-template-rows:1fr; }
.dsh-task-tree-collapse-inner { min-height:0; overflow:hidden; }
.dsh-task-tree-dock .dsh-task-tree-scroll { max-height:min(60vh, 560px); margin-top:6px; padding-bottom:2px; }

/* ---------- floating ---------- */
.dsh-task-tree-header-toggle { display:inline-flex; flex:none; align-items:center; justify-content:center; width:28px; height:28px; padding:0;
  border:0; border-radius:28px; background:transparent; color:var(--dsw-alias-label-tertiary); cursor:pointer; }
.dsh-task-tree-header-toggle[aria-pressed="true"] { color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-interactive-bg-hover); }
.dsh-task-tree-float { position:fixed; z-index:50; box-sizing:border-box; display:flex; flex-direction:column; min-height:0; overflow:hidden;
  --dsw-elevation-stroke-color:var(--dsw-alias-border-l1); border-radius:var(--dsw-radius-lg); background:var(--dsw-specific-menu);
  backdrop-filter:var(--dsw-menu-backdrop-filter); box-shadow:var(--dsw-elevation-prominent); color:var(--dsw-alias-label-primary);
  transform-origin:top right; opacity:0; transform:scale(.96) translateY(-4px); visibility:hidden; pointer-events:none;
  transition:opacity var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease), transform var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease),
    visibility 0s linear var(--ds-transition-duration, 200ms); }
.dsh-task-tree-float[data-open] { opacity:1; transform:none; visibility:visible; pointer-events:auto; transition-delay:0s; }
.dsh-task-tree-float > .dsh-task-tree-card-header { flex:none; padding:8px 8px 6px 12px; }
.dsh-task-tree-float > .dsh-task-tree-card-header > .dsh-task-tree-card-title { flex:1 1 auto; }
.dsh-task-tree-card-toggle + .dsh-task-tree-pill, .dsh-task-tree-card-toggle + .dsh-task-tree-icon-button { margin-left:auto; }
.dsh-task-tree-float-scroll { flex:1 1 auto; min-height:0; padding:0 6px 8px; }

/* ---------- chat change row ---------- */
.dsh-task-tree-change { display:flex; flex-direction:column; border-radius:var(--dsw-radius-sm);
  animation:dsh-task-tree-slide var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-change-title { font-weight:400; }
.dsh-task-tree-change-separator { flex:none; width:2px; height:2px; margin:0 8px; border-radius:1px; background:var(--dsw-alias-label-caption); }
.dsh-task-tree-change-summary { min-width:0; overflow:hidden; flex:1 1 auto; font-size:var(--dsh-content-font-size-secondary, 13px);
  line-height:calc(20px + var(--dsh-content-font-delta-secondary, 0px)); white-space:nowrap; text-overflow:ellipsis; }
.dsh-task-tree-change-summary[data-changed] { color:var(--dsw-alias-label-secondary); }
.dsh-task-tree-change-body { display:flex; flex-direction:column; gap:4px; padding:4px 0 6px calc(22px + var(--dsh-content-font-delta, 0px)); min-width:0;
  font-size:var(--dsh-content-font-size-secondary, 13px); line-height:calc(20px + var(--dsh-content-font-delta-secondary, 0px));
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-crumbs { display:flex; flex-wrap:wrap; align-items:center; gap:2px 0; margin:0; padding:0; list-style:none; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-crumbs li { min-width:0; overflow-wrap:anywhere; }
.dsh-task-tree-crumbs li + li::before { content:'›'; padding:0 6px; color:var(--dsw-alias-label-caption); }
.dsh-task-tree-crumbs li[data-changed] { color:var(--dsw-alias-label-primary); }
.dsh-task-tree-crumbs li[data-changed]:first-of-type, .dsh-task-tree-crumbs li:not([data-changed]) + li[data-changed] { font-weight:500; }
.dsh-task-tree-change-detail { margin:0; color:var(--dsw-alias-label-secondary); overflow-wrap:anywhere; }
.dsh-task-tree-flash { animation:dsh-task-tree-flash 600ms var(--ds-ease-in-out, ease) both; }
@keyframes dsh-task-tree-flash { 0%, 40% { background:var(--dsw-alias-state-business-tertiary); } 100% { background:transparent; } }

/* ---------- tasks page ---------- */
.dsh-task-tree-page { display:flex; width:100%; height:100%; min-width:0; min-height:0; overflow:hidden; color:var(--dsw-alias-label-primary);
  background:var(--dsw-alias-bg-base); font-size:14px; line-height:1.6; }
.dsh-task-tree-page-scroll { flex:1; min-height:0; overflow:auto; scrollbar-gutter:stable; --dsh-scrollbar-width:9px; --dsh-scrollbar-thumb-border:2px; }
.dsh-task-tree-page-content { max-width:960px; margin:0 auto; padding:0 clamp(24px, 4vw, 48px) 48px; }
@media (max-width: 767px) { .dsh-task-tree-page-content { padding-inline:20px; } }
.dsh-task-tree-page-heading { display:flex; align-items:center; gap:16px; padding-top:28px; margin-bottom:24px; }
[data-platform='darwin'] .dsh-task-tree-page-heading { padding-top:calc(28px + var(--dsh-frame-top-clearance, 0px)); }
.dsh-task-tree-page-heading h1 { margin:0; font-size:20px; line-height:28px; font-weight:500; }
.dsh-task-tree-filters { display:flex; flex-wrap:wrap; align-items:center; gap:8px 12px; margin-bottom:14px; }
.dsh-task-tree-filter { display:inline-flex; align-items:center; height:28px; padding:0 10px; border:0; border-radius:14px; background:transparent;
  color:var(--dsw-alias-label-tertiary); font:inherit; font-size:14px; line-height:22px; white-space:nowrap; cursor:pointer; }
.dsh-task-tree-filter[aria-pressed="true"] { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }
.dsh-task-tree-page-rows { display:flex; flex-direction:column; gap:2px; margin:0; padding:0; list-style:none; }
.dsh-task-tree-page-row { display:flex; align-items:flex-start; gap:12px; width:100%; padding:8px; border:0; border-radius:12px; background:transparent;
  color:inherit; font:inherit; text-align:left; cursor:pointer; animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-page-row:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:-2px; }
.dsh-task-tree-page-glyph { display:grid; flex:none; place-items:center; width:16px; height:23px; }
.dsh-task-tree-page-content-col { display:flex; flex:1; flex-direction:column; min-width:0; }
.dsh-task-tree-page-title { overflow:hidden; font-weight:500; line-height:23px; text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-page-summary { display:block; margin-top:2px; overflow:hidden; color:var(--dsw-alias-label-tertiary); font-size:13px; line-height:21px;
  text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-page-meta { display:flex; flex:none; flex-direction:column; align-items:flex-end; color:var(--dsw-alias-label-tertiary); font-size:13px;
  line-height:23px; white-space:nowrap; font-variant-numeric:tabular-nums; }
.dsh-task-tree-page-meta time { color:var(--dsw-alias-label-caption); font-size:12px; line-height:21px; }
.dsh-task-tree-page-unread { display:grid; flex:none; place-items:center; width:8px; height:23px; }
.dsh-task-tree-page-empty { display:flex; flex-direction:column; align-items:center; padding:48px 20px; text-align:center; color:var(--dsw-alias-label-tertiary); font-size:14px; }
.dsh-task-tree-page-empty p { margin:0; }
.dsh-task-tree-page-empty-glyph { margin-bottom:12px; color:var(--dsw-alias-label-caption); }
.dsh-task-tree-page-empty-action { margin-top:16px; }
.dsh-task-tree-notice { display:flex; align-items:flex-start; flex-wrap:wrap; gap:9px; margin:0 0 20px; padding:12px 14px; border-radius:10px;
  background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-secondary); font-size:12px; line-height:20px; }
.dsh-task-tree-notice p { flex:1; margin:0; }
@media (hover: hover) {
  .dsh-task-tree-filter:hover, .dsh-task-tree-page-row:hover { background:var(--dsw-alias-interactive-bg-hover); }
}

/* ---------- unread mark ---------- */
.dsh-task-tree-panel-icon { position:relative; display:inline-grid; place-items:center; }
.dsh-task-tree-unread-dot { display:block; width:6px; height:6px; border-radius:50%; background:var(--dsw-alias-state-error-primary);
  animation:dsh-task-tree-pop var(--ds-transition-duration-slow, 320ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-unread-dot[data-placement="icon"] { position:absolute; top:-1px; right:-2px; box-shadow:0 0 0 1.5px var(--dsw-alias-bg-base); }
@keyframes dsh-task-tree-pop { 0% { transform:scale(0); } 60% { transform:scale(1.3); } 100% { transform:scale(1); } }


/* ---------- configuration page ---------- */
.dsh-task-tree-config { display:flex; flex-direction:column; gap:28px; }
.dsh-task-tree-config-section { display:flex; flex-direction:column; }
.dsh-task-tree-config-heading { margin:0; color:var(--dsw-alias-label-primary); font-size:14px; line-height:20px; font-weight:500; }
.dsh-task-tree-config-section-description { margin:4px 0 0; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:18px; }
.dsh-task-tree-config-lines { display:flex; flex-direction:column; margin-top:8px; }
.dsh-task-tree-config-line { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:14px 0;
  border-bottom:0.5px solid var(--dsw-alias-border-l2); }
.dsh-task-tree-config-line:last-child { border-bottom:0; }
.dsh-task-tree-config-line[data-stacked] { flex-wrap:wrap; gap:10px 24px; }
.dsh-task-tree-config-text { min-width:0; flex:1 1 220px; }
.dsh-task-tree-config-title { color:var(--dsw-alias-label-primary); font-size:14px; line-height:20px; }
.dsh-task-tree-config-description { margin-top:4px; color:var(--dsw-alias-label-secondary); font-size:12px; line-height:18px; }
.dsh-task-tree-config-control { flex:none; display:flex; align-items:center; }
.dsh-task-tree-config-status { color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:18px;
  animation:dsh-task-tree-fade var(--ds-transition-duration, 200ms) var(--ds-ease-in-out, ease) both; }
.dsh-task-tree-config-status[data-tone="error"] { color:var(--dsw-alias-state-error-primary); }
.dsh-task-tree-config-picker { display:flex; flex-direction:column; align-items:flex-end; gap:6px; min-width:0; }
.dsh-task-tree-config-picker-row { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; }
.dsh-task-tree-select { display:inline-flex; align-items:center; gap:6px; max-width:320px; height:32px; padding:0 10px 0 12px; border:0.5px solid var(--dsw-alias-border-l3);
  border-radius:var(--dsw-radius-md); background:transparent; color:var(--dsw-alias-label-primary); font:inherit; font-size:13px; line-height:20px; cursor:pointer;
  transition:border-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease), background-color var(--ds-transition-duration-fast, 120ms) var(--ds-ease-in-out, ease); }
.dsh-task-tree-select[data-empty] { color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-select[aria-expanded="true"] { background:var(--dsw-alias-interactive-bg-hover); }
.dsh-task-tree-select:disabled { cursor:default; opacity:.6; }
.dsh-task-tree-select:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:1px; }
.dsh-task-tree-select > svg { flex:none; color:var(--dsw-alias-label-tertiary); }
.dsh-task-tree-select-label { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dsh-task-tree-config-status { display:flex; align-items:center; gap:8px; margin:0; }
@media (hover: hover) {
  .dsh-task-tree-select:not(:disabled):hover { border-color:var(--dsw-alias-border-l2); background:var(--dsw-alias-interactive-bg-hover); }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-task-tree-check-path, .dsh-task-tree-detail, .dsh-task-tree-decisions, .dsh-task-tree-pill,
  .dsh-task-tree-dock, .dsh-task-tree-change, .dsh-task-tree-change-body, .dsh-task-tree-flash, .dsh-task-tree-page-row,
  .dsh-task-tree-unread-dot, .dsh-task-tree-decision-block, .dsh-task-tree-config-status { animation:none; }
  .dsh-task-tree-collapse, .dsh-task-tree-float, .dsh-task-tree-item, .dsh-task-tree-glyph-status, .dsh-task-tree-glyph-chevron,
  .dsh-task-tree-decision, .dsh-task-tree-select { transition:none; }
}
`
