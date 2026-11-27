// Animated Biomechanical SVG Exercise Diagrams (60fps SMIL + CSS, 100% Offline)
// Target muscles highlighted in #FF5A36 with subtle pulse, movement arrows in #10B981

function getExerciseSVG(key) {
  const wrap = (inner, label = '') => `
    <svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="dbGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
        <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981"/>
        </marker>
      </defs>
      <rect width="220" height="150" rx="12" fill="#0B0E14"/>
      <line x1="16" y1="134" x2="204" y2="134" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>
      ${inner}
    </svg>`;

  const db = (x, y, rot = 0) => `
    <g transform="translate(${x},${y}) rotate(${rot})">
      <rect x="-11" y="-2.5" width="22" height="5" rx="2" fill="#94A3B8"/>
      <rect x="-14" y="-7" width="5" height="14" rx="2" fill="url(#dbGrad)"/>
      <rect x="9" y="-7" width="5" height="14" rx="2" fill="url(#dbGrad)"/>
    </g>`;

  const pulse = `<animate attributeName="opacity" values="0.75;1;0.75" dur="1.4s" repeatCount="indefinite"/>`;

  const diagrams = {
    dumbbell_curl: wrap(`
      <circle cx="95" cy="28" r="10" fill="#475569"/>
      <path d="M95 38 L95 82 M95 82 L85 132 M95 82 L105 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <line x1="95" y1="45" x2="95" y2="75" stroke="#FF5A36" stroke-width="9" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="95" y1="75" x2="98" y2="108" stroke="#94A3B8" stroke-width="7" stroke-linecap="round"/>
        ${db(98, 112, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 95 75; -115 95 75; 0 95 75" keyTimes="0;0.4;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
      <path d="M114 102 Q132 82 124 62" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrow)"/>
      <text x="148" y="34" fill="#9CA3AF" font-size="10" font-weight="700">BICEPS</text>
    `, 'Ayakta Dambıl Curl'),

    hammer_curl: wrap(`
      <circle cx="95" cy="28" r="10" fill="#475569"/>
      <path d="M95 38 L95 82 M95 82 L85 132 M95 82 L105 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <line x1="95" y1="45" x2="95" y2="75" stroke="#FF5A36" stroke-width="9" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="95" y1="75" x2="98" y2="108" stroke="#FF5A36" stroke-width="6" stroke-linecap="round"/>
        ${db(98, 112, 90)}
        <animateTransform attributeName="transform" type="rotate" values="0 95 75; -110 95 75; 0 95 75" keyTimes="0;0.4;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
      <path d="M112 100 Q132 82 126 65" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrow)"/>
      <text x="142" y="34" fill="#9CA3AF" font-size="9.5" font-weight="700">BRACHIALIS</text>
    `, 'Hammer Curl'),

    concentration_curl: wrap(`
      <path d="M55 92 L95 92 L95 132 M62 92 L62 132" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
      <circle cx="95" cy="36" r="10" fill="#475569"/>
      <path d="M92 46 L78 90 L114 92 L118 132" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <line x1="90" y1="52" x2="106" y2="82" stroke="#FF5A36" stroke-width="8" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="106" y1="82" x2="110" y2="114" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(110, 118, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 106 82; -110 106 82; 0 106 82" keyTimes="0;0.4;1" dur="2.5s" repeatCount="indefinite"/>
      </g>
      <text x="142" y="42" fill="#9CA3AF" font-size="9.5" font-weight="700">İZOLASYON</text>
    `, 'Konsantrasyon Curl'),

    wrist_curl: wrap(`
      <path d="M45 96 L88 96 L88 132 M52 96 L52 132" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
      <circle cx="72" cy="40" r="9" fill="#475569"/>
      <path d="M72 50 L68 94 L106 94 L108 132" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <line x1="74" y1="56" x2="112" y2="90" stroke="#FF5A36" stroke-width="7" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="112" y1="90" x2="134" y2="92" stroke="#94A3B8" stroke-width="5" stroke-linecap="round"/>
        ${db(136, 92, 15)}
        <animateTransform attributeName="transform" type="rotate" values="18 112 90; -34 112 90; 18 112 90" keyTimes="0;0.45;1" dur="2s" repeatCount="indefinite"/>
      </g>
      <text x="142" y="56" fill="#9CA3AF" font-size="9.5" font-weight="700">ÖN KOL</text>
    `, 'Ön Kol Bilek Curl'),

    bent_over_row: wrap(`
      <circle cx="136" cy="44" r="10" fill="#475569"/>
      <line x1="128" y1="52" x2="80" y2="76" stroke="#FF5A36" stroke-width="10" stroke-linecap="round">${pulse}</line>
      <path d="M80 76 L76 105 L82 132" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <g>
        <line x1="122" y1="56" x2="116" y2="104" stroke="#94A3B8" stroke-width="7" stroke-linecap="round"/>
        ${db(116, 108, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 0; -10 -24; 0 0" keyTimes="0;0.4;1" dur="2.5s" repeatCount="indefinite"/>
      </g>
      <text x="38" y="42" fill="#9CA3AF" font-size="9.5" font-weight="700">SIRT & BICEPS</text>
    `, 'Bent Over Row'),

    single_arm_row: wrap(`
      <path d="M126 78 L166 78 L166 132 M132 78 L132 132" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
      <circle cx="132" cy="44" r="9" fill="#475569"/>
      <line x1="124" y1="52" x2="78" y2="74" stroke="#FF5A36" stroke-width="10" stroke-linecap="round">${pulse}</line>
      <path d="M78 74 L74 104 L80 132" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <line x1="122" y1="54" x2="136" y2="78" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
      <g>
        <line x1="104" y1="62" x2="100" y2="106" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(100, 110, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 0; -6 -24; 0 0" keyTimes="0;0.4;1" dur="2.4s" repeatCount="indefinite"/>
      </g>
    `, 'Tek Kol Row'),

    floor_press: wrap(`
      <rect x="34" y="124" width="152" height="6" rx="3" fill="#1E293B"/>
      <circle cx="62" cy="112" r="9" fill="#475569"/>
      <line x1="72" y1="116" x2="122" y2="116" stroke="#FF5A36" stroke-width="10" stroke-linecap="round">${pulse}</line>
      <path d="M122 116 L146 92 L166 122" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <g>
        <line x1="90" y1="114" x2="90" y2="66" stroke="#94A3B8" stroke-width="7" stroke-linecap="round"/>
        ${db(90, 62, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 24; 0 0; 0 24" keyTimes="0;0.38;1" dur="2.5s" repeatCount="indefinite"/>
      </g>
      <text x="120" y="54" fill="#9CA3AF" font-size="9.5" font-weight="700">GÖĞÜS & TRICEPS</text>
    `, 'Zeminde Göğüs Press'),

    close_grip_floor_press: wrap(`
      <rect x="34" y="124" width="152" height="6" rx="3" fill="#1E293B"/>
      <circle cx="62" cy="112" r="9" fill="#475569"/>
      <line x1="72" y1="116" x2="122" y2="116" stroke="#64748B" stroke-width="10" stroke-linecap="round"/>
      <path d="M122 116 L146 92 L166 122" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <g>
        <line x1="90" y1="114" x2="90" y2="66" stroke="#FF5A36" stroke-width="7" stroke-linecap="round">${pulse}</line>
        ${db(90, 62, 90)}
        <animateTransform attributeName="transform" type="translate" values="0 24; 0 0; 0 24" keyTimes="0;0.38;1" dur="2.4s" repeatCount="indefinite"/>
      </g>
      <text x="118" y="52" fill="#9CA3AF" font-size="9.5" font-weight="700">DAR TUTUŞ TRICEPS</text>
    `, 'Dar Tutuş Zemin Press'),

    floor_fly: wrap(`
      <rect x="34" y="124" width="152" height="6" rx="3" fill="#1E293B"/>
      <circle cx="110" cy="40" r="9" fill="#475569"/>
      <ellipse cx="110" cy="64" rx="22" ry="12" fill="#FF5A36" opacity="0.85">${pulse}</ellipse>
      <g>
        <path d="M90 60 L54 74" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(50, 76, 90)}
        <animateTransform attributeName="transform" type="rotate" values="0 90 60; 48 90 60; 0 90 60" keyTimes="0;0.45;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
      <g>
        <path d="M130 60 L166 74" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(170, 76, 90)}
        <animateTransform attributeName="transform" type="rotate" values="0 130 60; -48 130 60; 0 130 60" keyTimes="0;0.45;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
    `, 'Zeminde Göğüs Açış'),

    lateral_raise: wrap(`
      <circle cx="110" cy="28" r="10" fill="#475569"/>
      <path d="M110 38 L110 84 M110 84 L98 132 M110 84 L122 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <circle cx="94" cy="46" r="7" fill="#FF5A36">${pulse}</circle>
      <circle cx="126" cy="46" r="7" fill="#FF5A36">${pulse}</circle>
      <g>
        <line x1="94" y1="46" x2="50" y2="50" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(46, 50, 0)}
        <animateTransform attributeName="transform" type="rotate" values="-72 94 46; 0 94 46; -72 94 46" keyTimes="0;0.4;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
      <g>
        <line x1="126" y1="46" x2="170" y2="50" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(174, 50, 0)}
        <animateTransform attributeName="transform" type="rotate" values="72 126 46; 0 126 46; 72 126 46" keyTimes="0;0.4;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
    `, 'Yana Omuz Açış'),

    overhead_triceps: wrap(`
      <circle cx="105" cy="38" r="10" fill="#475569"/>
      <path d="M105 48 L105 90 M105 90 L95 132 M105 90 L115 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <line x1="102" y1="48" x2="98" y2="18" stroke="#FF5A36" stroke-width="8" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="98" y1="18" x2="122" y2="14" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(126, 14, 90)}
        <animateTransform attributeName="transform" type="rotate" values="-115 98 18; -55 98 18; -115 98 18" keyTimes="0;0.4;1" dur="2.5s" repeatCount="indefinite"/>
      </g>
      <text x="136" y="42" fill="#9CA3AF" font-size="9.5" font-weight="700">TRICEPS</text>
    `, 'Baş Üstü Triceps Extension'),

    triceps_kickback: wrap(`
      <circle cx="136" cy="46" r="10" fill="#475569"/>
      <line x1="128" y1="54" x2="82" y2="76" stroke="#64748B" stroke-width="10" stroke-linecap="round"/>
      <path d="M82 76 L78 106 L84 132" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <line x1="122" y1="58" x2="96" y2="64" stroke="#FF5A36" stroke-width="7" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="96" y1="64" x2="64" y2="62" stroke="#FF5A36" stroke-width="6" stroke-linecap="round"/>
        ${db(60, 62, 90)}
        <animateTransform attributeName="transform" type="rotate" values="-80 96 64; 0 96 64; -80 96 64" keyTimes="0;0.45;1" dur="2.4s" repeatCount="indefinite"/>
      </g>
    `, 'Triceps Kickback'),

    floor_skull_crusher: wrap(`
      <rect x="34" y="124" width="152" height="6" rx="3" fill="#1E293B"/>
      <circle cx="64" cy="112" r="9" fill="#475569"/>
      <line x1="74" y1="116" x2="124" y2="116" stroke="#64748B" stroke-width="10" stroke-linecap="round"/>
      <path d="M124 116 L146 92 L166 122" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <line x1="88" y1="112" x2="88" y2="76" stroke="#FF5A36" stroke-width="7" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="88" y1="76" x2="88" y2="44" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(88, 40, 0)}
        <animateTransform attributeName="transform" type="rotate" values="-95 88 76; 0 88 76; -95 88 76" keyTimes="0;0.4;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
    `, 'Zeminde Skull Crusher'),

    goblet_squat: wrap(`
      <g>
        <circle cx="110" cy="36" r="10" fill="#475569"/>
        <path d="M110 46 L100 84 L126 96 L112 132" stroke="#FF5A36" stroke-width="9" stroke-linecap="round" fill="none">${pulse}</path>
        <line x1="106" y1="54" x2="128" y2="62" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(132, 62, 90)}
        <animateTransform attributeName="transform" type="translate" values="0 -14; 0 6; 0 -14" keyTimes="0;0.45;1" dur="2.6s" repeatCount="indefinite"/>
      </g>
      <text x="148" y="42" fill="#9CA3AF" font-size="9.5" font-weight="700">BACAK & CORE</text>
    `, 'Goblet Squat'),

    dumbbell_rdl: wrap(`
      <path d="M86 74 L90 132" stroke="#FF5A36" stroke-width="9" stroke-linecap="round">${pulse}</path>
      <g>
        <circle cx="138" cy="48" r="10" fill="#475569"/>
        <line x1="130" y1="56" x2="86" y2="74" stroke="#64748B" stroke-width="10" stroke-linecap="round"/>
        <line x1="124" y1="60" x2="112" y2="104" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(112, 108, 0)}
        <animateTransform attributeName="transform" type="rotate" values="-48 86 74; 0 86 74; -48 86 74" keyTimes="0;0.5;1" dur="2.8s" repeatCount="indefinite"/>
      </g>
    `, 'Dambıl RDL'),

    reverse_lunge: wrap(`
      <g>
        <circle cx="112" cy="32" r="10" fill="#475569"/>
        <line x1="112" y1="42" x2="112" y2="82" stroke="#64748B" stroke-width="9" stroke-linecap="round"/>
        <path d="M112 82 L140 94 L140 132" stroke="#FF5A36" stroke-width="8" stroke-linecap="round" fill="none">${pulse}</path>
        <path d="M112 82 L82 114 L62 128" stroke="#FF5A36" stroke-width="8" stroke-linecap="round" fill="none">${pulse}</path>
        <line x1="112" y1="50" x2="112" y2="88" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(112, 92, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 -10; 0 6; 0 -10" keyTimes="0;0.45;1" dur="2.5s" repeatCount="indefinite"/>
      </g>
    `, 'Geriye Adım Lunge'),

    plank: wrap(`
      <rect x="26" y="124" width="168" height="6" rx="3" fill="#1E293B"/>
      <circle cx="60" cy="86" r="9" fill="#475569"/>
      <line x1="68" y1="92" x2="168" y2="116" stroke="#FF5A36" stroke-width="9" stroke-linecap="round">${pulse}</line>
      <path d="M68 94 L66 122 L82 122" stroke="#94A3B8" stroke-width="6" stroke-linecap="round" fill="none"/>
      <text x="98" y="76" fill="#10B981" font-size="10" font-weight="700">DÜZ OMURGA • CORE</text>
    `, 'Plank'),

    superman_hold: wrap(`
      <rect x="26" y="124" width="168" height="6" rx="3" fill="#1E293B"/>
      <circle cx="68" cy="96" r="8" fill="#475569"/>
      <g>
        <path d="M38 88 L74 108 L134 112 L176 96" stroke="#FF5A36" stroke-width="8" stroke-linecap="round" fill="none">${pulse}</path>
        <animateTransform attributeName="transform" type="translate" values="0 4; 0 -6; 0 4" keyTimes="0;0.5;1" dur="2.4s" repeatCount="indefinite"/>
      </g>
      <text x="86" y="74" fill="#9CA3AF" font-size="9.5" font-weight="700">POSTÜR & SIRT</text>
    `, 'Superman Postür'),

    arnold_press: wrap(`
      <circle cx="110" cy="36" r="10" fill="#475569"/>
      <path d="M110 46 L110 90 M110 90 L98 132 M110 90 L122 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <circle cx="94" cy="52" r="7" fill="#FF5A36">${pulse}</circle>
      <circle cx="126" cy="52" r="7" fill="#FF5A36">${pulse}</circle>
      <g>
        <path d="M94 52 L82 28" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        <path d="M126 52 L138 28" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(80, 24, 0)}
        ${db(140, 24, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 18; 0 -4; 0 18" keyTimes="0;0.42;1" dur="2.5s" repeatCount="indefinite"/>
      </g>
    `, 'Arnold Press'),

    rear_delt_fly: wrap(`
      <circle cx="136" cy="48" r="10" fill="#475569"/>
      <line x1="128" y1="56" x2="82" y2="76" stroke="#64748B" stroke-width="10" stroke-linecap="round"/>
      <path d="M82 76 L78 106 L84 132" stroke="#64748B" stroke-width="8" stroke-linecap="round" fill="none"/>
      <circle cx="120" cy="60" r="7" fill="#FF5A36">${pulse}</circle>
      <g>
        <line x1="120" y1="60" x2="148" y2="72" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(152, 74, 90)}
        <animateTransform attributeName="transform" type="rotate" values="65 120 60; 0 120 60; 65 120 60" keyTimes="0;0.42;1" dur="2.4s" repeatCount="indefinite"/>
      </g>
    `, 'Arka Omuz Açış'),

    dumbbell_shrug: wrap(`
      <circle cx="110" cy="28" r="10" fill="#475569"/>
      <g>
        <path d="M92 44 L110 38 L128 44" stroke="#FF5A36" stroke-width="9" stroke-linecap="round" fill="none">${pulse}</path>
        <line x1="90" y1="46" x2="86" y2="88" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        <line x1="130" y1="46" x2="134" y2="88" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
        ${db(86, 92, 0)}
        ${db(134, 92, 0)}
        <animateTransform attributeName="transform" type="translate" values="0 4; 0 -10; 0 4" keyTimes="0;0.45;1" dur="2.2s" repeatCount="indefinite"/>
      </g>
      <path d="M110 42 L110 88 M110 88 L98 132 M110 88 L122 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
    `, 'Dambıl Shrug'),

    zottman_curl: wrap(`
      <circle cx="95" cy="28" r="10" fill="#475569"/>
      <path d="M95 38 L95 82 M95 82 L85 132 M95 82 L105 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <line x1="95" y1="45" x2="95" y2="75" stroke="#FF5A36" stroke-width="9" stroke-linecap="round">${pulse}</line>
      <g>
        <line x1="95" y1="75" x2="98" y2="108" stroke="#FF5A36" stroke-width="6" stroke-linecap="round"/>
        ${db(98, 112, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 95 75; -112 95 75; 0 95 75" keyTimes="0;0.35;1" dur="2.8s" repeatCount="indefinite"/>
      </g>
      <text x="144" y="54" fill="#9CA3AF" font-size="9" font-weight="700">YAVAŞ İNİŞ</text>
    `, 'Zottman Curl'),

    reverse_curl: wrap(`
      <circle cx="95" cy="28" r="10" fill="#475569"/>
      <path d="M95 38 L95 82 M95 82 L85 132 M95 82 L105 132" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
      <line x1="95" y1="45" x2="95" y2="75" stroke="#94A3B8" stroke-width="8" stroke-linecap="round"/>
      <g>
        <line x1="95" y1="75" x2="98" y2="108" stroke="#FF5A36" stroke-width="7" stroke-linecap="round">${pulse}</line>
        ${db(98, 112, 0)}
        <animateTransform attributeName="transform" type="rotate" values="0 95 75; -110 95 75; 0 95 75" keyTimes="0;0.4;1" dur="2.5s" repeatCount="indefinite"/>
      </g>
      <text x="142" y="34" fill="#9CA3AF" font-size="9.5" font-weight="700">TERS ÖN KOL</text>
    `, 'Ters Tutuş Curl')
  };

  return diagrams[key] || diagrams.dumbbell_curl;
}
