// Generates an SMIL-animated SVG of a shoelace bow untying (and re-tying, for a seamless loop).
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];
const W = 400, CX = 200;
const r = n => Math.round(n * 10) / 10;

// Left half: P0 (aglet end) -> tail -> loop lower edge -> loop upper edge -> knot.
// Each state: [P0, c1,c2,P1, c3,c4,P2, c5,c6,P3]
const S = {
  tied: [[92,212],[120,175],[165,135],[192,108],[140,122],[52,116],[48,72],[44,30],[118,34],[189,91]],
  pull: [[70,205],[105,175],[160,130],[192,108],[155,120],[96,116],[92,86],[88,56],[140,60],[189,91]],
  slip: [[46,186],[90,170],[150,128],[192,108],[175,114],[148,112],[148,100],[148,88],[168,86],[189,91]],
  loose:[[72,206],[22,150],[192,182],[193,106],[194,103],[193,101],[193,99],[193,97],[192,95],[196,94]],
  swing:[[88,212],[44,148],[192,176],[193,106],[194,103],[193,101],[193,99],[193,97],[192,95],[196,94]],
};

const m = ([x, y]) => [W - x, y];
function lacePath(p) {
  const [P0,c1,c2,P1,c3,c4,P2,c5,c6,P3] = p;
  const R3 = m(P3);
  const pts = [
    'M', P0, 'C', c1, c2, P1, 'C', c3, c4, P2, 'C', c5, c6, P3,
    'C', [P3[0] + 8, P3[1] - 2], [R3[0] - 8, R3[1] - 2], R3,
    'C', m(c6), m(c5), m(P2), 'C', m(c4), m(c3), m(P1), 'C', m(c2), m(c1), m(P0),
  ];
  return pts.map(t => typeof t === 'string' ? t : `${r(t[0])} ${r(t[1])}`).join(' ').replace(/ ([MC])/g, '$1').replace(/([MC]) /g, '$1');
}
function agletPath(p, mirror) {
  let P0 = p[0], c1 = p[1];
  if (mirror) { P0 = m(P0); c1 = m(c1); }
  const dx = P0[0] - c1[0], dy = P0[1] - c1[1], L = Math.hypot(dx, dy), k = 24 / L;
  const s = [P0[0] - dx * 2 / L, P0[1] - dy * 2 / L];
  return `M${r(s[0])} ${r(s[1])}L${r(P0[0] + dx * k)} ${r(P0[1] + dy * k)}`;
}

// Timeline: hold tied -> pull -> slip -> loose -> swing -> (re-tie) pull -> tied
const seq = ['tied','tied','pull','slip','loose','swing','pull','tied'];
const keyTimes = '0;.1;.3;.44;.56;.7;.86;1';
const spl = Array(seq.length - 1).fill('.5 0 .3 1').join(';');
const knotOp = '1;1;1;.2;0;0;1;1';
const knotSc = '1;1;.92;.55;.3;.3;.92;1';
const DUR = '3.2s';
const anim = (attr, values) =>
  `<animate attributeName="${attr}" dur="${DUR}" repeatCount="indefinite" calcMode="spline" keyTimes="${keyTimes}" keySplines="${spl}" values="${values}"/>`;

const laceD = seq.map(k => lacePath(S[k])).join(';');
const lace0 = lacePath(S.tied);
const agL = seq.map(k => agletPath(S[k], false)).join(';');
const agR = seq.map(k => agletPath(S[k], true)).join(';');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 360 230" role="img" aria-label="Cargando">
<defs>
<path id="l" d="${lace0}">${anim('d', laceD)}</path>
<path id="a" d="${agletPath(S.tied,false)}">${anim('d', agL)}</path>
<path id="b" d="${agletPath(S.tied,true)}">${anim('d', agR)}</path>
<g id="w"><rect x="-10" y="-25" width="20" height="50" rx="9"/></g>
</defs>
<g fill="none" stroke-linejoin="round">
<use href="#l" stroke="#2b2622" stroke-width="31"/>
<use href="#l" stroke="#efdcae" stroke-width="27"/>
<use href="#l" stroke="#e7e3dd" stroke-width="21"/>
<use href="#l" stroke="#a8a096" stroke-width="17" stroke-dasharray="1.3 3.7" opacity=".4"/>
<g stroke-linecap="round">
<use href="#a" stroke="#2b2622" stroke-width="21"/><use href="#b" stroke="#2b2622" stroke-width="21"/>
<use href="#a" stroke="#cfcac3" stroke-width="16"/><use href="#b" stroke="#cfcac3" stroke-width="16"/>
<use href="#a" stroke="#f4f2ee" stroke-width="4" opacity=".8"/><use href="#b" stroke="#f4f2ee" stroke-width="4" opacity=".8"/>
</g>
</g>
<g transform="translate(200 99)">
<g>${anim('opacity', knotOp).replace('<animate', '<animate')}
<animateTransform attributeName="transform" type="scale" dur="${DUR}" repeatCount="indefinite" calcMode="spline" keyTimes="${keyTimes}" keySplines="${spl}" values="${knotSc}"/>
<g stroke="#2b2622" stroke-width="2.5">
<use href="#w" x="-10" fill="#efdcae"/><use href="#w" x="10" fill="#e7e3dd"/>
</g>
<g fill="none" stroke="#a8a096" stroke-width="15" stroke-dasharray="1.3 3.7" opacity=".4">
<path d="M-10-14v28M10-14v28"/>
</g>
</g>
</g>
</svg>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, svg);
console.log('bytes', Buffer.byteLength(svg));
