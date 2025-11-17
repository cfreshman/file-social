// css.js @ https://freshman.dev/lib/2/css/script.js

if (!window['css.js']) {
  window['css.js'] = Date.now()
  window.css = {
    mixin: {
      get relative() {return`
      position: relative;`},
      get absolute() {return`
      position: absolute;`},
    
      get wide() {return`
      width: -moz-available;
      width: -webkit-fill-available;`},
      get tall() {return`
      height: -moz-available;
      height: -webkit-fill-available;`},
      get full() {return`
      margin: 0; height: 100%; width: 100%;`},
      get cover() {return`
      ${css.mixin.full}
      position: absolute; top: 0; left: 0;`},
      get fill() {return`
      ${css.mixin.full}
      position: absolute; top: 0; left: 0;`},
    
      get flex() {return`
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;`},
      get row() {return`
      ${css.mixin.flex}
      flex-direction: row;`},
      get column() {return`
      ${css.mixin.flex}
      flex-direction: column;`},
    
      get center() {return`
      ${css.mixin.flex}
      justify-content: center !important;
      align-items: center !important;`},
      get center_row() {return`
      ${css.mixin.row}
      align-items: center !important;`},
      get center_column() {return`
      ${css.mixin.column}
      align-items: center !important;`},
    
      get middle() {return`
      ${css.mixin.center}
      justify-content: center;
      text-align: center;`},
      get middle_row() {return`
      ${css.mixin.row}
      ${css.mixin.middle}`},
      get middle_column() {return`
      ${css.mixin.column}
      ${css.mixin.middle}`},
    
      get inline() {return`
      display: inline-flex;`},
      get gap() {return`
      gap: .25em;`},
      get spaced() {return`
      gap: 1em;`},
      get wrap() {return`
      flex-wrap: wrap;`},
      get start() {return`
      text-align: left;
      justify-content: flex-start;`},
      get end() {return`
      text-align: right;
      justify-content: flex-end;`},
      get between() {return`
      justify-content: space-between !important;`},
      get stretch() {return`
      align-items: stretch;`},
      get grow() {return`
      flex-grow: 1;`},
      get shrink() {return`
      flex-shrink: 1;`},
      get row_reverse() {return`
      flex-direction: row-reverse;`},
      get column_reverse() {return`
      flex-direction: column-reverse;`},

      get pre() {return`
      white-space: pre;`},
      get pre_wrap() {return`
      white-space: pre-wrap;`},
      get pre_warp() {return this.pre_wrap},
      get pre_line() {return`
      white-space: pre-line;`},
    
      get monospace() {return`
      font-family: 'DM Mono', monospace;`},
      get uppercase() {return`
      text-transform: uppercase;`},
      get lowercase() {return`
      text-transform: lowercase;`},
      get capitalize() {return`
      text-transform: capitalize;`},

      get half() {return`
      font-size:.5em;`},
      get double() {return`
      font-size:2em;`},

      get h100() {return`
      height:100%;`},
      get w100() {return`
      width:100%;`},

      get solarize() {return`
      --filter-b: 1.1;
      --filter-c: .775;
      --filter-s: .975;
      --filter-b: 1.2;
      --filter-c: .6;
      --filter-s: .95;
      --filter-b: 1.1;
      --filter-c: .75;
      --filter-s: .95;
      --filter: brightness(var(--filter-b)) contrast(var(--filter-c)) saturate(var(--filter-s));
      --filter-invert: brightness(calc(1/var(--filter-b))) contrast(calc(1/var(--filter-c))) saturate(calc(1/var(--filter-s)));
      filter: var(--filter);`}
    },
    common: {
      get reset() {return`
      * {
        box-sizing: border-box;
        margin: 0;
      }`},
    
      get base() {return`
      ${css.common.reset}
      :root {
        --filter-b: 1;
        --filter-c: 1;
        --filter-s: 1;
        --filter: brightness(var(--filter-b)) contrast(var(--filter-c)) saturate(var(--filter-s));
        --filter-invert: brightness(calc(1/var(--filter-b))) contrast(calc(1/var(--filter-c))) saturate(calc(1/var(--filter-s)));
        filter: var(--filter);
      }
      @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

      html, body {
        ${css.mixin.full}
      }
      body {
        ${css.mixin.monospace}
      }
      iframe {
        filter: var(--filter-invert);
      }
      button {
        -webkit-appearance: none;
        color: var(--color, #101010);
      }
      ${Object.keys(css.mixin).map(k => `.${k.replace(/_/g, '-')}{${css.mixin[k]}}`).join('')}
      .spacer {
        flex-grow: 1;
      }
      .description {
        font-size: .7em;
      }
      `},
    },
    postprocess: (pairs, { flags='g' }={}) => pairs.map(([match, replace]) => [typeof match === 'string' ? new RegExp(match, flags) : match, replace])
  }
  document.head.append(window.css_base = (l => (l.innerHTML = css.common.base)&&l)(document.createElement('style')))
}

