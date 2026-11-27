// KolGücü Pro Anatomical & Biomechanical Animated SVG Diagrams
// Features: Spline easing (concentric -> peak squeeze -> slow eccentric),
// contoured muscle silhouettes, active muscle glow, ghost range-of-motion, and 3D dumbbells.

function getExerciseSVG(key) {
  const wrap = (inner, label = '') => `
    <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="dbPlate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F1F5F9"/>
          <stop offset="50%" stop-color="#94A3B8"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
        <linearGradient id="bodySkin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#64748B"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
        <linearGradient id="muscleHot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FF7A59"/>
          <stop offset="100%" stop-color="#E11D48"/>
        </linearGradient>
        <filter id="muscleGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.8" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.6" opacity="0.45"/>
        </pattern>
        <marker id="arrowPro" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981"/>
        </marker>
      </defs>
      <rect width="240" height="160" rx="12" fill="#050824"/>
      <rect width="240" height="160" rx="12" fill="url(#grid)"/>
      <line x1="16" y1="142" x2="224" y2="142" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
      ${inner}
    </svg>`;

  const db = (x, y, rot = 0) => `
    <g transform="translate(${x},${y}) rotate(${rot})">
      <rect x="-12" y="-2.2" width="24" height="4.4" rx="2" fill="#CBD5E1"/>
      <rect x="-16" y="-7.5" width="5.5" height="15" rx="2" fill="url(#dbPlate)" stroke="#1E293B" stroke-width="0.6"/>
      <rect x="10.5" y="-7.5" width="5.5" height="15" rx="2" fill="url(#dbPlate)" stroke="#1E293B" stroke-width="0.6"/>
    </g>`;

  // Athletic spline tempo: 0 -> 0.35 (lift), 0.35 -> 0.48 (peak squeeze), 0.48 -> 1 (slow eccentric)
  const S4 = 'calcMode="spline" keyTimes="0;0.35;0.48;1" keySplines="0.25 0.1 0.25 1; 0 0 1 1; 0.4 0 0.2 1"';
  const S3 = 'calcMode="spline" keyTimes="0;0.42;1" keySplines="0.3 0 0.2 1; 0.4 0 0.2 1"';
  const pulse = `<animate attributeName="opacity" values="0.72;1;1;0.72" ${S4} dur="2.6s" repeatCount="indefinite"/>`;
  const tag = (txt, x = 152, y = 26) => `
    <rect x="${x - 6}" y="${y - 11}" width="${txt.length * 6.2 + 12}" height="16" rx="8" fill="#141923" stroke="#FF5A36" stroke-opacity="0.45" stroke-width="0.8"/>
    <text x="${x}" y="${y}" fill="#FF7A59" font-size="8.5" font-weight="800" letter-spacing="0.4">${txt}</text>`;

  const diagrams = {
    dumbbell_curl: wrap(`
      <!-- Head & Torso silhouette -->
      <circle cx="96" cy="28" r="10" fill="url(#bodySkin)"/>
      <path d="M88 40 Q96 38 104 40 L108 84 Q96 88 86 84 Z" fill="url(#bodySkin)"/>
      <path d="M90 84 L84 140 M103 84 L109 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <!-- Ghost start line -->
      <line x1="98" y1="78" x2="100" y2="112" stroke="#334155" stroke-width="5" stroke-dasharray="3 3" stroke-linecap="round"/>
      <!-- Active Bicep belly -->
      <ellipse cx="99" cy="60" rx="6.5" ry="14" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <!-- Moving Forearm + Dumbbell -->
      <g>
        <path d="M98 76 L101 110" stroke="#94A3B8" stroke-width="7.5" stroke-linecap="round"/>
        ${db(101, 114, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 98 76; -118 98 76; -118 98 76; 0 98 76" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      <path d="M116 104 Q138 82 128 58" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrowPro)"/>
      ${tag('BICEPS')}
    `, 'Ayakta Dambıl Curl'),

    hammer_curl: wrap(`
      <circle cx="96" cy="28" r="10" fill="url(#bodySkin)"/>
      <path d="M88 40 Q96 38 104 40 L108 84 Q96 88 86 84 Z" fill="url(#bodySkin)"/>
      <path d="M90 84 L84 140 M103 84 L109 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="99" cy="60" rx="6.5" ry="14" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <g>
        <path d="M98 76 L101 110" stroke="url(#muscleHot)" stroke-width="7" stroke-linecap="round"/>
        ${db(101, 114, 90)}
        <animateTransform attributeName="transform" type="rotate" values="0 98 76; -114 98 76; -114 98 76; 0 98 76" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      <path d="M116 104 Q136 82 128 58" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrowPro)"/>
      ${tag('BRACHIALIS', 142)}
    `, 'Hammer Curl'),

    concentration_curl: wrap(`
      <path d="M52 96 L98 96 L98 140 M60 96 L60 140" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="96" cy="36" r="10" fill="url(#bodySkin)"/>
      <path d="M88 46 L76 94 L116 96 L120 140" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <ellipse cx="99" cy="68" rx="6" ry="13" transform="rotate(-22 99 68)" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <g>
        <line x1="108" y1="84" x2="112" y2="116" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(112, 120, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 108 84; -112 108 84; -112 108 84; 0 108 84" ${S4} dur="2.5s" repeatCount="indefinite"/>
      </g>
      ${tag('BICEPS ZİRVESİ', 132)}
    `, 'Konsantrasyon Curl'),

    wrist_curl: wrap(`
      <path d="M44 100 L90 100 L90 140 M52 100 L52 140" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="72" cy="40" r="9.5" fill="url(#bodySkin)"/>
      <path d="M72 50 L68 98 L108 98 L110 140" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <line x1="74" y1="58" x2="114" y2="94" stroke="url(#muscleHot)" stroke-width="8" stroke-linecap="round" filter="url(#muscleGlow)">${pulse}</line>
      <g>
        <line x1="114" y1="94" x2="138" y2="96" stroke="#94A3B8" stroke-width="5.5" stroke-linecap="round"/>
        ${db(140, 96, 15)}
        <animateTransform attributeName="transform" type="rotate" values="20 114 94; -36 114 94; -36 114 94; 20 114 94" ${S4} dur="2.1s" repeatCount="indefinite"/>
      </g>
      ${tag('ÖN KOL', 152)}
    `, 'Ön Kol Bilek Curl'),

    bent_over_row: wrap(`
      <circle cx="144" cy="44" r="10" fill="url(#bodySkin)"/>
      <path d="M136 52 L82 78" stroke="url(#muscleHot)" stroke-width="12" stroke-linecap="round" filter="url(#muscleGlow)">${pulse}</path>
      <path d="M82 78 L76 110 L84 140" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <!-- Articulated 2-joint arm: shoulder fixed at (126,58) -->
      <g>
        <line x1="126" y1="58" x2="124" y2="86" stroke="#94A3B8" stroke-width="7.5" stroke-linecap="round"/>
        <g>
          <line x1="124" y1="86" x2="122" y2="114" stroke="#CBD5E1" stroke-width="6.5" stroke-linecap="round"/>
          ${db(122, 118, 0)}
          <animateTransform attributeName="transform" type="rotate" values="0 124 86; -52 124 86; -52 124 86; 0 124 86" ${S4} dur="2.6s" repeatCount="indefinite"/>
        </g>
        <animateTransform attributeName="transform" type="rotate" values="0 126 58; 52 126 58; 52 126 58; 0 126 58" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      <path d="M138 114 L122 88" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrowPro)"/>
      ${tag('SIRT & BICEPS', 28, 30)}
    `, 'Bent Over Row'),

    single_arm_row: wrap(`
      <path d="M134 80 L178 80 L178 140 M140 80 L140 140" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="140" cy="44" r="9.5" fill="url(#bodySkin)"/>
      <path d="M132 52 L82 76" stroke="url(#muscleHot)" stroke-width="12" stroke-linecap="round" filter="url(#muscleGlow)">${pulse}</path>
      <path d="M82 76 L76 110 L84 140" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <!-- Support arm fixed on bench -->
      <line x1="130" y1="54" x2="146" y2="80" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
      <!-- Working arm: shoulder fixed at (120,58), elbow at (118,86) -->
      <g>
        <line x1="120" y1="58" x2="118" y2="86" stroke="#94A3B8" stroke-width="7" stroke-linecap="round"/>
        <g>
          <line x1="118" y1="86" x2="116" y2="114" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
          ${db(116, 118, 0)}
          <animateTransform attributeName="transform" type="rotate" values="0 118 86; -55 118 86; -55 118 86; 0 118 86" ${S4} dur="2.5s" repeatCount="indefinite"/>
        </g>
        <animateTransform attributeName="transform" type="rotate" values="0 120 58; 55 120 58; 55 120 58; 0 120 58" ${S4} dur="2.5s" repeatCount="indefinite"/>
      </g>
      ${tag('TEK KOL SIRT', 26, 30)}
    `, 'Tek Kol Row'),

    floor_press: wrap(`
      <rect x="34" y="132" width="172" height="6" rx="3" fill="#1E293B"/>
      <circle cx="64" cy="118" r="9.5" fill="url(#bodySkin)"/>
      <ellipse cx="102" cy="120" rx="22" ry="8" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <path d="M124 122 L152 96 L174 130" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <!-- Articulated press: shoulder fixed at (94,118), elbow at (94,88) -->
      <g>
        <line x1="94" y1="118" x2="94" y2="88" stroke="#94A3B8" stroke-width="7.5" stroke-linecap="round"/>
        <g>
          <line x1="94" y1="88" x2="94" y2="58" stroke="#CBD5E1" stroke-width="6.5" stroke-linecap="round"/>
          ${db(94, 54, 0)}
          <animateTransform attributeName="transform" type="rotate" values="75 94 88; 0 94 88; 0 94 88; 75 94 88" ${S4} dur="2.6s" repeatCount="indefinite"/>
        </g>
        <animateTransform attributeName="transform" type="rotate" values="-75 94 118; 0 94 118; 0 94 118; -75 94 118" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      <path d="M114 96 L114 64" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrowPro)"/>
      ${tag('GÖĞÜS & TRICEPS', 124, 34)}
    `, 'Zeminde Göğüs Press'),

    close_grip_floor_press: wrap(`
      <rect x="34" y="132" width="172" height="6" rx="3" fill="#1E293B"/>
      <circle cx="64" cy="118" r="9.5" fill="url(#bodySkin)"/>
      <line x1="74" y1="122" x2="126" y2="122" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
      <path d="M126 122 L152 96 L174 130" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <g>
        <line x1="94" y1="118" x2="94" y2="88" stroke="url(#muscleHot)" stroke-width="8" stroke-linecap="round" filter="url(#muscleGlow)">${pulse}</line>
        <g>
          <line x1="94" y1="88" x2="94" y2="58" stroke="#CBD5E1" stroke-width="6.5" stroke-linecap="round"/>
          ${db(94, 54, 90)}
          <animateTransform attributeName="transform" type="rotate" values="75 94 88; 0 94 88; 0 94 88; 75 94 88" ${S4} dur="2.5s" repeatCount="indefinite"/>
        </g>
        <animateTransform attributeName="transform" type="rotate" values="-75 94 118; 0 94 118; 0 94 118; -75 94 118" ${S4} dur="2.5s" repeatCount="indefinite"/>
      </g>
      ${tag('DAR TUTUŞ TRICEPS', 114, 34)}
    `, 'Dar Tutuş Zemin Press'),

    floor_fly: wrap(`
      <rect x="34" y="132" width="172" height="6" rx="3" fill="#1E293B"/>
      <circle cx="120" cy="40" r="9.5" fill="url(#bodySkin)"/>
      <ellipse cx="120" cy="66" rx="24" ry="13" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <g>
        <path d="M98 62 L58 76" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(54, 78, 90)}
        <animateTransform attributeName="transform" type="rotate" values="0 98 62; 50 98 62; 50 98 62; 0 98 62" ${S4} dur="2.7s" repeatCount="indefinite"/>
      </g>
      <g>
        <path d="M142 62 L182 76" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(186, 78, 90)}
        <animateTransform attributeName="transform" type="rotate" values="0 142 62; -50 142 62; -50 142 62; 0 142 62" ${S4} dur="2.7s" repeatCount="indefinite"/>
      </g>
      ${tag('GÖĞÜS AÇIŞ', 150, 26)}
    `, 'Zeminde Göğüs Açış'),

    lateral_raise: wrap(`
      <circle cx="120" cy="28" r="10" fill="url(#bodySkin)"/>
      <path d="M104 42 Q120 38 136 42 L130 88 L110 88 Z" fill="url(#bodySkin)"/>
      <path d="M113 88 L104 140 M127 88 L136 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <circle cx="102" cy="46" r="8" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</circle>
      <circle cx="138" cy="46" r="8" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</circle>
      <g>
        <line x1="102" y1="46" x2="54" y2="50" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(50, 50, 0)}
        <animateTransform attributeName="transform" type="rotate" values="-74 102 46; 0 102 46; 0 102 46; -74 102 46" ${S4} dur="2.7s" repeatCount="indefinite"/>
      </g>
      <g>
        <line x1="138" y1="46" x2="186" y2="50" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(190, 50, 0)}
        <animateTransform attributeName="transform" type="rotate" values="74 138 46; 0 138 46; 0 138 46; 74 138 46" ${S4} dur="2.7s" repeatCount="indefinite"/>
      </g>
      ${tag('YAN OMUZ', 162, 24)}
    `, 'Yana Omuz Açış'),

    overhead_triceps: wrap(`
      <circle cx="112" cy="40" r="10" fill="url(#bodySkin)"/>
      <path d="M104 52 Q112 50 120 52 L122 94 L102 94 Z" fill="url(#bodySkin)"/>
      <path d="M106 94 L100 140 M118 94 L124 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="106" cy="36" rx="5.5" ry="14" transform="rotate(-10 106 36)" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <g>
        <line x1="104" y1="20" x2="132" y2="16" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(136, 16, 90)}
        <animateTransform attributeName="transform" type="rotate" values="-118 104 20; -68 104 20; -68 104 20; -118 104 20" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      ${tag('TRICEPS HACİM', 140, 42)}
    `, 'Baş Üstü Triceps Extension'),

    triceps_kickback: wrap(`
      <circle cx="144" cy="48" r="10" fill="url(#bodySkin)"/>
      <line x1="136" y1="56" x2="88" y2="80" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
      <path d="M88 80 L82 112 L90 140" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <ellipse cx="114" cy="64" rx="13" ry="5.5" transform="rotate(-14 114 64)" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <g>
        <line x1="102" y1="68" x2="68" y2="66" stroke="url(#muscleHot)" stroke-width="6.5" stroke-linecap="round"/>
        ${db(64, 66, 90)}
        <animateTransform attributeName="transform" type="rotate" values="-82 102 68; 0 102 68; 0 102 68; -82 102 68" ${S4} dur="2.5s" repeatCount="indefinite"/>
      </g>
      ${tag('TRICEPS ARKA', 26, 30)}
    `, 'Triceps Kickback'),

    floor_skull_crusher: wrap(`
      <rect x="34" y="132" width="172" height="6" rx="3" fill="#1E293B"/>
      <circle cx="66" cy="118" r="9.5" fill="url(#bodySkin)"/>
      <line x1="76" y1="122" x2="128" y2="122" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
      <path d="M128 122 L152 96 L174 130" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <ellipse cx="92" cy="100" rx="5.5" ry="15" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <g>
        <line x1="92" y1="80" x2="92" y2="46" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(92, 42, 0)}
        <animateTransform attributeName="transform" type="rotate" values="-98 92 80; 0 92 80; 0 92 80; -98 92 80" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      ${tag('SKULL CRUSHER', 132, 34)}
    `, 'Zeminde Skull Crusher'),

    goblet_squat: wrap(`
      <g>
        <circle cx="116" cy="38" r="10" fill="url(#bodySkin)"/>
        <path d="M116 48 L106 88 L134 102 L118 138" stroke="url(#muscleHot)" stroke-width="10" stroke-linecap="round" fill="none" filter="url(#muscleGlow)">${pulse}</path>
        <line x1="112" y1="56" x2="136" y2="64" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(140, 64, 90)}
        <animateTransform attributeName="transform" type="translate" values="0 -16; 0 6; 0 6; 0 -16" ${S4} dur="2.7s" repeatCount="indefinite"/>
      </g>
      ${tag('BACAK & CORE', 152, 28)}
    `, 'Goblet Squat'),

    dumbbell_rdl: wrap(`
      <path d="M90 78 L94 140" stroke="url(#muscleHot)" stroke-width="10" stroke-linecap="round" filter="url(#muscleGlow)">${pulse}</path>
      <g>
        <circle cx="144" cy="50" r="10" fill="url(#bodySkin)"/>
        <line x1="136" y1="58" x2="90" y2="78" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
        <line x1="130" y1="62" x2="118" y2="108" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(118, 112, 0)}
        <animateTransform attributeName="transform" type="rotate" values="-50 90 78; 0 90 78; 0 90 78; -50 90 78" ${S4} dur="2.9s" repeatCount="indefinite"/>
      </g>
      ${tag('ARKA BACAK', 26, 30)}
    `, 'Dambıl RDL'),

    reverse_lunge: wrap(`
      <g>
        <circle cx="118" cy="32" r="10" fill="url(#bodySkin)"/>
        <line x1="118" y1="42" x2="118" y2="86" stroke="#475569" stroke-width="10" stroke-linecap="round"/>
        <path d="M118 86 L148 98 L148 138" stroke="url(#muscleHot)" stroke-width="9" stroke-linecap="round" fill="none" filter="url(#muscleGlow)">${pulse}</path>
        <path d="M118 86 L86 118 L66 134" stroke="url(#muscleHot)" stroke-width="9" stroke-linecap="round" fill="none" filter="url(#muscleGlow)">${pulse}</path>
        <line x1="118" y1="52" x2="118" y2="92" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(118, 96, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 -12; 0 6; 0 6; 0 -12" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      ${tag('LUNGE', 168, 26)}
    `, 'Geriye Adım Lunge'),

    plank: wrap(`
      <rect x="26" y="132" width="188" height="6" rx="3" fill="#1E293B"/>
      <circle cx="62" cy="90" r="9.5" fill="url(#bodySkin)"/>
      <line x1="72" y1="96" x2="178" y2="122" stroke="url(#muscleHot)" stroke-width="10" stroke-linecap="round" filter="url(#muscleGlow)">${pulse}</line>
      <path d="M72 98 L70 130 L88 130" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round" fill="none"/>
      ${tag('CORE STABİLİTE', 110, 68)}
    `, 'Plank'),

    superman_hold: wrap(`
      <rect x="26" y="132" width="188" height="6" rx="3" fill="#1E293B"/>
      <circle cx="72" cy="102" r="8.5" fill="url(#bodySkin)"/>
      <g>
        <path d="M40 94 L78 114 L142 118 L186 100" stroke="url(#muscleHot)" stroke-width="9" stroke-linecap="round" fill="none" filter="url(#muscleGlow)">${pulse}</path>
        <animateTransform attributeName="transform" type="translate" values="0 5; 0 -7; 0 -7; 0 5" ${S4} dur="2.5s" repeatCount="indefinite"/>
      </g>
      ${tag('POSTÜR & SIRT', 100, 58)}
    `, 'Superman Postür'),

    arnold_press: wrap(`
      <circle cx="120" cy="38" r="10" fill="url(#bodySkin)"/>
      <path d="M104 50 Q120 46 136 50 L132 94 L108 94 Z" fill="url(#bodySkin)"/>
      <path d="M113 94 L104 140 M127 94 L136 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <circle cx="102" cy="54" r="8" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</circle>
      <circle cx="138" cy="54" r="8" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</circle>
      <!-- Left articulated press -->
      <g>
        <line x1="102" y1="54" x2="100" y2="34" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        <g>
          <line x1="100" y1="34" x2="98" y2="14" stroke="#CBD5E1" stroke-width="5.5" stroke-linecap="round"/>
          ${db(98, 12, 0)}
          <animateTransform attributeName="transform" type="rotate" values="75 100 34; 0 100 34; 0 100 34; 75 100 34" ${S4} dur="2.6s" repeatCount="indefinite"/>
        </g>
        <animateTransform attributeName="transform" type="rotate" values="-82 102 54; -10 102 54; -10 102 54; -82 102 54" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      <!-- Right articulated press -->
      <g>
        <line x1="138" y1="54" x2="140" y2="34" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        <g>
          <line x1="140" y1="34" x2="142" y2="14" stroke="#CBD5E1" stroke-width="5.5" stroke-linecap="round"/>
          ${db(142, 12, 0)}
          <animateTransform attributeName="transform" type="rotate" values="-75 140 34; 0 140 34; 0 140 34; -75 140 34" ${S4} dur="2.6s" repeatCount="indefinite"/>
        </g>
        <animateTransform attributeName="transform" type="rotate" values="82 138 54; 10 138 54; 10 138 54; 82 138 54" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      ${tag('TÜM OMUZ', 164, 24)}
    `, 'Arnold Press'),

    rear_delt_fly: wrap(`
      <circle cx="144" cy="50" r="10" fill="url(#bodySkin)"/>
      <line x1="136" y1="58" x2="88" y2="80" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
      <path d="M88 80 L82 112 L90 140" stroke="#475569" stroke-width="9" stroke-linecap="round" fill="none"/>
      <circle cx="126" cy="62" r="8" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</circle>
      <g>
        <line x1="126" y1="62" x2="158" y2="74" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(162, 76, 90)}
        <animateTransform attributeName="transform" type="rotate" values="68 126 62; 0 126 62; 0 126 62; 68 126 62" ${S4} dur="2.5s" repeatCount="indefinite"/>
      </g>
      ${tag('ARKA OMUZ', 26, 30)}
    `, 'Arka Omuz Açış'),

    dumbbell_shrug: wrap(`
      <circle cx="120" cy="28" r="10" fill="url(#bodySkin)"/>
      <path d="M120 42 L120 92 M113 92 L104 140 M127 92 L136 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <g>
        <path d="M98 46 L120 38 L142 46" stroke="url(#muscleHot)" stroke-width="10" stroke-linecap="round" fill="none" filter="url(#muscleGlow)">${pulse}</path>
        <line x1="96" y1="48" x2="92" y2="92" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        <line x1="144" y1="48" x2="148" y2="92" stroke="#94A3B8" stroke-width="6.5" stroke-linecap="round"/>
        ${db(92, 96, 0)}
        ${db(148, 96, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 4; 0 -11; 0 -11; 0 4" ${S4} dur="2.3s" repeatCount="indefinite"/>
      </g>
      ${tag('TRAPEZ', 168, 24)}
    `, 'Dambıl Shrug'),

    zottman_curl: wrap(`
      <circle cx="96" cy="28" r="10" fill="url(#bodySkin)"/>
      <path d="M88 40 Q96 38 104 40 L108 84 Q96 88 86 84 Z" fill="url(#bodySkin)"/>
      <path d="M90 84 L84 140 M103 84 L109 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="99" cy="60" rx="6.5" ry="14" fill="url(#muscleHot)" filter="url(#muscleGlow)">${pulse}</ellipse>
      <g>
        <line x1="98" y1="76" x2="101" y2="110" stroke="url(#muscleHot)" stroke-width="6.5" stroke-linecap="round"/>
        ${db(101, 114, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 98 76; -116 98 76; -116 98 76; 0 98 76" ${S4} dur="2.9s" repeatCount="indefinite"/>
      </g>
      ${tag('BICEPS + ÖN KOL', 136, 26)}
    `, 'Zottman Curl'),

    reverse_curl: wrap(`
      <circle cx="96" cy="28" r="10" fill="url(#bodySkin)"/>
      <path d="M88 40 Q96 38 104 40 L108 84 Q96 88 86 84 Z" fill="url(#bodySkin)"/>
      <path d="M90 84 L84 140 M103 84 L109 140" stroke="#475569" stroke-width="9" stroke-linecap="round"/>
      <line x1="98" y1="45" x2="98" y2="76" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <g>
        <line x1="98" y1="76" x2="101" y2="110" stroke="url(#muscleHot)" stroke-width="7.5" stroke-linecap="round" filter="url(#muscleGlow)">${pulse}</line>
        ${db(101, 114, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 98 76; -114 98 76; -114 98 76; 0 98 76" ${S4} dur="2.6s" repeatCount="indefinite"/>
      </g>
      ${tag('TERS ÖN KOL', 142, 26)}
    `, 'Ters Tutuş Curl')
  };

  return diagrams[key] || diagrams.dumbbell_curl;
}
