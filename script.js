// ===== DADOS DO APLICATIVO =====
const SKIN_TONES = [
  { id: 'porcelana', name: 'Porcelana', hex: '#f8dfd2', undertone: 'frio' },
  { id: 'clara', name: 'Clara Quente', hex: '#f3cbb2', undertone: 'quente' },
  { id: 'media', name: 'Média Oliva', hex: '#dfa988', undertone: 'neutro' },
  { id: 'bronzeada', name: 'Bronzeada', hex: '#c58763', undertone: 'quente' },
  { id: 'escura', name: 'Morena Escura', hex: '#8d5538', undertone: 'neutro' },
  { id: 'retinta', name: 'Retinta', hex: '#5a3220', undertone: 'frio' }
];

const SHAPES = [
  { id: 'round', name: 'Redonda' },
  { id: 'square', name: 'Quadrada' },
  { id: 'almond', name: 'Amendoada' },
  { id: 'coffin', name: 'Bailarina' },
  { id: 'stiletto', name: 'Stiletto' }
];

const POLISHES = [
  { id: 'nude-rosado', name: 'Nude Rosé', hex: '#e8b4b8', cat: 'Nudes', undertone: 'frio' },
  { id: 'areia', name: 'Areia Chic', hex: '#d8b89e', cat: 'Nudes', undertone: 'quente' },
  { id: 'capuccino', name: 'Capuccino', hex: '#9e7463', cat: 'Nudes', undertone: 'neutro' },
  { id: 'leite', name: 'Renda Leite', hex: '#f7efe9', cat: 'Nudes', undertone: 'neutro' },
  { id: 'lavanda', name: 'Lavanda', hex: '#c9b6e4', cat: 'Pastéis', undertone: 'frio' },
  { id: 'menta', name: 'Verde Menta', hex: '#b5dfd3', cat: 'Pastéis', undertone: 'frio' },
  { id: 'pessego', name: 'Pêssego', hex: '#f6c2a8', cat: 'Pastéis', undertone: 'quente' },
  { id: 'amarelo-manteiga', name: 'Manteiga', hex: '#f5e39c', cat: 'Pastéis', undertone: 'quente' },
  { id: 'cereja', name: 'Cereja Vivo', hex: '#c81d3a', cat: 'Clássicos', undertone: 'frio' },
  { id: 'vinho', name: 'Vinho Bordô', hex: '#6e192b', cat: 'Clássicos', undertone: 'frio' },
  { id: 'coral', name: 'Coral Solar', hex: '#eb6854', cat: 'Vibrantes', undertone: 'quente' },
  { id: 'fucsia', name: 'Pink Fúcsia', hex: '#d92b78', cat: 'Vibrantes', undertone: 'frio' },
  { id: 'azul-cobalto', name: 'Azul Royal', hex: '#2852a8', cat: 'Vibrantes', undertone: 'frio' },
  { id: 'esmeralda', name: 'Esmeralda', hex: '#1d6f56', cat: 'Escuros', undertone: 'quente' },
  { id: 'ameixa', name: 'Ameixa', hex: '#47213c', cat: 'Escuros', undertone: 'frio' },
  { id: 'espresso', name: 'Café Espresso', hex: '#38221b', cat: 'Escuros', undertone: 'neutro' }
];

const FINISHES = [
  { id: 'gloss', name: 'Brilho' },
  { id: 'matte', name: 'Fosco' },
  { id: 'glitter', name: 'Glitter' }
];

const ARTS = [
  { id: 'none', name: 'Lisa' },
  { id: 'french', name: 'Francesinha' },
  { id: 'dots', name: 'Poá' },
  { id: 'heart', name: 'Coração' }
];

// Posições das 5 unhas na mão SVG
const NAIL_SLOTS = [
  { name: 'Polegar', x: 82, y: 238, w: 18, h: 26, rot: -38 },
  { name: 'Indicador', x: 146, y: 122, w: 19, h: 30, rot: -2 },
  { name: 'Médio', x: 195, y: 80, w: 20, h: 32, rot: 0 },
  { name: 'Anelar', x: 247, y: 92, w: 19, h: 30, rot: 3 },
  { name: 'Mínimo', x: 299, y: 136, w: 16, h: 25, rot: 10 }
];

// Estado atual do estúdio
const state = {
  skin: SKIN_TONES[1],
  shape: 'almond',
  applyMode: 'all',
  selectedCategory: 'Todas',
  selectedPolish: POLISHES[0],
  nails: Array.from({ length: 5 }, () => ({
    color: '#e8b4b8',
    finish: 'gloss',
    art: 'none'
  })),
  savedLooks: []
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  renderStudioControls();
  renderHand();
  setupColorGuide();
  setupCareGuide();
});

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

// ===== ESTÚDIO VIRTUAL =====
function renderStudioControls() {
  // Tons de pele
  const skinContainer = document.getElementById('skin-swatches');
  skinContainer.innerHTML = SKIN_TONES.map(s => `
    <button class="skin-btn ${s.id === state.skin.id ? 'active' : ''}"
      style="background:${s.hex}" title="${s.name}" data-skin="${s.id}"></button>
  `).join('');

  skinContainer.querySelectorAll('.skin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.skin = SKIN_TONES.find(s => s.id === btn.dataset.skin);
      document.getElementById('hand-skin').setAttribute('fill', state.skin.hex);
      renderStudioControls();
      updateStylistTip();
    });
  });

  // Formatos
  const shapeContainer = document.getElementById('shape-options');
  shapeContainer.innerHTML = SHAPES.map(sh => `
    <button class="pill-btn ${sh.id === state.shape ? 'active' : ''}" data-shape="${sh.id}">
      ${sh.name}
    </button>
  `).join('');

  shapeContainer.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.shape = btn.dataset.shape;
      renderStudioControls();
      renderHand();
    });
  });

  // Modo de aplicação
  document.querySelectorAll('#apply-mode .pill-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#apply-mode .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.applyMode = btn.dataset.mode;
    };
  });

  // Categorias de Esmaltes
  const categories = ['Todas', ...new Set(POLISHES.map(p => p.cat))];
  const catContainer = document.getElementById('color-categories');
  catContainer.innerHTML = categories.map(c => `
    <button class="cat-btn ${c === state.selectedCategory ? 'active' : ''}" data-cat="${c}">${c}</button>
  `).join('');

  catContainer.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedCategory = btn.dataset.cat;
      renderStudioControls();
    });
  });

  // Paleta de cores
  const filtered = state.selectedCategory === 'Todas'
    ? POLISHES
    : POLISHES.filter(p => p.cat === state.selectedCategory);

  const polishGrid = document.getElementById('polish-grid');
  polishGrid.innerHTML = filtered.map(p => `
    <div class="polish-item ${p.id === state.selectedPolish.id ? 'active' : ''}" data-polish="${p.id}">
      <div class="polish-dot" style="background:${p.hex}"></div>
      <span class="polish-name">${p.name}</span>
    </div>
  `).join('');

  polishGrid.querySelectorAll('.polish-item').forEach(item => {
    item.addEventListener('click', () => {
      const polish = POLISHES.find(p => p.id === item.dataset.polish);
      state.selectedPolish = polish;
      applyColorByMode(polish.hex);
      renderStudioControls();
      renderHand();
      updateStylistTip();
    });
  });

  // Acabamentos
  const finishContainer = document.getElementById('finish-options');
  finishContainer.innerHTML = FINISHES.map(f => `
    <button class="pill-btn" data-finish="${f.id}">${f.name}</button>
  `).join('');
  finishContainer.querySelectorAll('.pill-btn').forEach(btn => {
    btn.onclick = () => {
      applyPropertyByMode('finish', btn.dataset.finish);
      renderHand();
    };
  });

  // Nail Arts
  const artContainer = document.getElementById('art-options');
  artContainer.innerHTML = ARTS.map(a => `
    <button class="pill-btn" data-art="${a.id}">${a.name}</button>
  `).join('');
  artContainer.querySelectorAll('.pill-btn').forEach(btn => {
    btn.onclick = () => {
      applyPropertyByMode('art', btn.dataset.art);
      renderHand();
    };
  });

  // Botões Limpar e Salvar
  document.getElementById('btn-reset').onclick = () => {
    state.nails = Array.from({ length: 5 }, () => ({ color: '#f7efe9', finish: 'gloss', art: 'none' }));
    renderHand();
  };

  document.getElementById('btn-save-look').onclick = saveCurrentLook;
}

function applyColorByMode(hex) {
  if (state.applyMode === 'all') {
    state.nails.forEach(n => (n.color = hex));
  } else if (state.applyMode === 'accent') {
    state.nails[3].color = hex; // Anelar
  }
}

function applyPropertyByMode(prop, value) {
  if (state.applyMode === 'accent') {
    state.nails[3][prop] = value;
  } else {
    state.nails.forEach(n => (n[prop] = value));
  }
}

function getNailPath(w, h, shape) {
  const hw = w / 2;
  const hh = h / 2;
  switch (shape) {
    case 'square':
      return `M ${-hw},${hh} L ${-hw},${-hh + 3} Q ${-hw},${-hh} ${-hw + 3},${-hh} L ${hw - 3},${-hh} Q ${hw},${-hh} ${hw},${-hh + 3} L ${hw},${hh} Z`;
    case 'almond':
      return `M ${-hw},${hh} C ${-hw},0 ${-hw * 0.7},${-hh} 0,${-hh - 4} C ${hw * 0.7},${-hh} ${hw},0 ${hw},${hh} Z`;
    case 'coffin':
      return `M ${-hw},${hh} L ${-hw * 0.55},${-hh - 3} L ${hw * 0.55},${-hh - 3} L ${hw},${hh} Z`;
    case 'stiletto':
      return `M ${-hw},${hh} Q ${-hw * 0.6},${-hh * 0.2} 0,${-hh - 7} Q ${hw * 0.6},${-hh * 0.2} ${hw},${hh} Z`;
    default: // round
      return `M ${-hw},${hh} L ${-hw},0 A ${hw} ${hh} 0 0 1 ${hw},0 L ${hw},${hh} Z`;
  }
}

function renderHand() {
  const layer = document.getElementById('nails-layer');
  layer.innerHTML = '';

  NAIL_SLOTS.forEach((slot, idx) => {
    const nail = state.nails[idx];
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${slot.x}, ${slot.y}) rotate(${slot.rot})`);
    g.classList.add('nail-shape');

    const d = getNailPath(slot.w, slot.h, state.shape);

    // Base da cor
    const base = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    base.setAttribute('d', d);
    base.setAttribute('fill', nail.color);
    base.setAttribute('stroke', 'rgba(60, 30, 40, 0.22)');
    base.setAttribute('stroke-width', '1');
    g.appendChild(base);

    // Nail Art
    if (nail.art === 'french') {
      const tip = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      tip.setAttribute('cx', '0');
      tip.setAttribute('cy', `${-slot.h / 2 + 2}`);
      tip.setAttribute('rx', `${slot.w * 0.42}`);
      tip.setAttribute('ry', '4.5');
      tip.setAttribute('fill', '#ffffff');
      g.appendChild(tip);
    } else if (nail.art === 'dots') {
      [[-3, -2], [3, 2], [0, 7]].forEach(([dx, dy]) => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', dx);
        dot.setAttribute('cy', dy);
        dot.setAttribute('r', '1.6');
        dot.setAttribute('fill', '#ffffff');
        g.appendChild(dot);
      });
    } else if (nail.art === 'heart') {
      const heart = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      heart.setAttribute('x', '0');
      heart.setAttribute('y', '4');
      heart.setAttribute('text-anchor', 'middle');
      heart.setAttribute('font-size', '9');
      heart.setAttribute('fill', '#ffffff');
      heart.textContent = '♥';
      g.appendChild(heart);
    }

    // Acabamento
    if (nail.finish === 'gloss') {
      const gloss = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      gloss.setAttribute('d', d);
      gloss.setAttribute('fill', 'url(#glossOverlay)');
      g.appendChild(gloss);
    } else if (nail.finish === 'glitter') {
      const glitter = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      glitter.setAttribute('d', d);
      glitter.setAttribute('fill', 'url(#glitterPattern)');
      g.appendChild(glitter);
    }

    // Clique direto no dedo
    g.addEventListener('click', () => {
      state.nails[idx].color = state.selectedPolish.hex;
      renderHand();
      updateStylistTip();
    });

    layer.appendChild(g);
  });
}

function updateStylistTip() {
  const p = state.selectedPolish;
  const s = state.skin;
  const text = document.getElementById('stylist-text');

  if (p.undertone === s.undertone || p.undertone === 'neutro') {
    text.textContent = `Excelente escolha! O tom "${p.name}" harmoniza perfeitamente com o subtom ${s.undertone} da pele ${s.name}, trazendo luminosidade natural às mãos.`;
  } else {
    text.textContent = `Contraste moderno! "${p.name}" cria um ponto de destaque ousado na pele ${s.name}. Experimente usar um tom neutro no anelar para equilibrar.`;
  }
}

function saveCurrentLook() {
  state.savedLooks.unshift({
    id: Date.now(),
    skin: state.skin.name,
    shape: SHAPES.find(s => s.id === state.shape).name,
    nails: JSON.parse(JSON.stringify(state.nails))
  });
  renderSavedLooks();
}

function renderSavedLooks() {
  const grid = document.getElementById('saved-looks-grid');
  document.getElementById('saved-count').textContent = `${state.savedLooks.length} combinações salvas`;

  grid.innerHTML = state.savedLooks.map(look => `
    <div class="saved-item">
      <div class="mini-nails">
        ${look.nails.map(n => `<div class="mini-nail" style="background:${n.color}"></div>`).join('')}
      </div>
      <div style="font-size:0.8rem;">
        <strong>Formato ${look.shape}</strong> · Pele ${look.skin}
      </div>
    </div>
  `).join('');
}

// ===== GUIA DE CORES =====
function setupColorGuide() {
  let depth = 'clara';
  let undertone = 'frio';

  const renderRec = () => {
    const tips = {
      'clara-frio': {
        desc: 'Peles claras de subtom frio brilham com rosados suaves, malva, vermelho cereja e tons pastel.',
        colors: ['nude-rosado', 'lavanda', 'cereja', 'menta']
      },
      'clara-quente': {
        desc: 'Subtons quentes em pele clara pedem pêssego, coral vibrante, nude areia e dourados suaves.',
        colors: ['areia', 'pessego', 'coral', 'amarelo-manteiga']
      },
      'clara-neutro': {
        desc: 'Você tem versatilidade total! Nudes rosados, capuccino suave e clássicos como vinho ficam impecáveis.',
        colors: ['leite', 'capuccino', 'vinho', 'nude-rosado']
      },
      'media-frio': {
        desc: 'Tons de ameixa, fúcsia, azul royal e nudes frios criam um contraste sofisticado na pele média/oliva.',
        colors: ['ameixa', 'fucsia', 'azul-cobalto', 'nude-rosado']
      },
      'media-quente': {
        desc: 'Terrosos, coral intenso, verde esmeralda e tons amanteigados realçam o dourado natural da pele.',
        colors: ['capuccino', 'coral', 'esmeralda', 'areia']
      },
      'media-neutro': {
        desc: 'Equilíbrio perfeito para apostar tanto em tons cremosos quanto em escuros elegantes como café.',
        colors: ['capuccino', 'vinho', 'espresso', 'pessego']
      },
      'retinta-frio': {
        desc: 'Cores vibrantes como fúcsia, azul royal, branco leite e vinho profundo criam um contraste deslumbrante.',
        colors: ['leite', 'fucsia', 'azul-cobalto', 'vinho']
      },
      'retinta-quente': {
        desc: 'Coral solar, amarelo manteiga, verde esmeralda e tons caramelo valorizam o brilho quente da pele.',
        colors: ['coral', 'amarelo-manteiga', 'esmeralda', 'areia']
      },
      'retinta-neutro': {
        desc: 'Desde o branco leite minimalista até o café espresso e cereja intenso: tudo ganha destaque.',
        colors: ['leite', 'cereja', 'espresso', 'lavanda']
      }
    };

    const data = tips[`${depth}-${undertone}`];
    const box = document.getElementById('undertone-result');
    box.innerHTML = `
      <p style="font-size:0.88rem;">${data.desc}</p>
      <div class="rec-swatches">
        ${data.colors.map(id => {
          const p = POLISHES.find(item => item.id === id);
          return `<div class="rec-swatch-card"><span class="pair-dot" style="background:${p.hex}"></span>${p.name}</div>`;
        }).join('')}
      </div>
    `;
  };

  document.querySelectorAll('#guide-skin-depth .pill-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#guide-skin-depth .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      depth = btn.dataset.depth;
      renderRec();
    };
  });

  document.querySelectorAll('#guide-undertone .pill-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#guide-undertone .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      undertone = btn.dataset.undertone;
      renderRec();
    };
  });

  renderRec();

  // Simulador de Harmonias
  let basePolish = POLISHES[0];
  const picker = document.getElementById('harmony-base-picker');

  const renderHarmonies = () => {
    picker.innerHTML = POLISHES.slice(0, 12).map(p => `
      <div class="polish-item ${p.id === basePolish.id ? 'active' : ''}" data-id="${p.id}" title="${p.name}">
        <div class="polish-dot" style="background:${p.hex}; margin-bottom:0;"></div>
      </div>
    `).join('');

    picker.querySelectorAll('.polish-item').forEach(el => {
      el.onclick = () => {
        basePolish = POLISHES.find(p => p.id === el.dataset.id);
        renderHarmonies();
      };
    });

    const neutralPartner = POLISHES.find(p => p.id === 'leite');
    const darkPartner = POLISHES.find(p => p.id === 'espresso');
    const contrasting = POLISHES.find(p => p.cat !== basePolish.cat) || POLISHES[4];

    const combos = [
      { title: 'Clássico Equilibrado', desc: 'Ideal para filha única discreta e elegante.', partner: neutralPartner },
      { title: 'Contraste Moderno', desc: 'Combinação criativa para nail art geométrica.', partner: contrasting },
      { title: 'Tom Profundo', desc: 'Sofisticação noturna com acabamento brilhante.', partner: darkPartner }
    ];

    document.getElementById('harmony-results').innerHTML = combos.map(c => `
      <div class="harmony-card">
        <div>
          <strong style="font-size:0.9rem;">${c.title}</strong>
          <p class="subtitle">${c.desc}</p>
        </div>
        <div class="harmony-pair">
          <span class="pair-dot" style="background:${basePolish.hex}" title="${basePolish.name}"></span>
          <span>+</span>
          <span class="pair-dot" style="background:${c.partner.hex}" title="${c.partner.name}"></span>
          <button class="btn btn-ghost" onclick="testComboInStudio('${basePolish.hex}', '${c.partner.hex}')">Testar</button>
        </div>
      </div>
    `).join('');
  };

  renderHarmonies();
}

window.testComboInStudio = (mainHex, accentHex) => {
  state.nails.forEach((n, i) => {
    n.color = i === 3 ? accentHex : mainHex;
  });
  renderHand();
  document.querySelector('[data-tab="studio"]').click();
};

// ===== GUIA DE CUIDADOS =====
function setupCareGuide() {
  const protocols = {
    fraca: '<strong>Protocolo Fortalecimento:</strong> Faça uma pausa de 3 dias sem esmalte. Aplique base enriquecida com queratina ou cálcio 2x na semana e mantenha as unhas mais curtas e arredondadas até recuperarem a resistência.',
    ressecada: '<strong>Protocolo Hidratação Intensiva:</strong> Evite remover totalmente a cutícula com alicate — apenas empurre suavemente após o banho. Aplique óleo vegetal (jojoba ou amêndoas) 2 vezes ao dia.',
    manchada: '<strong>Protocolo Clareamento Suave:</strong> Use base niveladora antes de esmaltes escuros e prefira removedores sem acetona. Polir levemente com lixa bloco (lado mais fino) a cada 15 dias ajuda a devolver o brilho.',
    saudavel: '<strong>Protocolo Manutenção:</strong> Continue hidratando as cutículas diariamente, use luvas em tarefas domésticas e troque o esmalte a cada 7 dias para a lâmina respirar.'
  };

  const box = document.getElementById('protocol-result');
  box.innerHTML = `<p style="font-size:0.9rem;">${protocols.fraca}</p>`;

  document.querySelectorAll('#nail-condition-picker .pill-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#nail-condition-picker .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      box.innerHTML = `<p style="font-size:0.9rem;">${protocols[btn.dataset.cond]}</p>`;
    };
  });

  const tasks = [
    'Hidratar cutículas com óleo ou creme antes de dormir',
    'Usar base protetora antes de esmaltar',
    'Usar luvas ao lavar louça ou mexer com produtos químicos',
    'Lixar as unhas em uma única direção',
    'Deixar as unhas sem esmalte por pelo menos 24h entre esmaltações'
  ];
