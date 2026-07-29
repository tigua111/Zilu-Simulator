// script.js
let phase = 0;
let phaseTimer = null;

const STATUS_TEXT = {
  0: "READY_TO_MINCE",
  1: "KNIFE_STORM_ACTIVE",
  2: "TARGET_DOWN",
  3: "PULVERIZING",
  4: "PROCESSING_MEAT",
  5: "SIMULATION_COMPLETE"
};

const STREAM_TEXT = {
  0: "Sequence Start Trigger Required",
  1: "KNIFE_STORM_ACTIVE...",
  2: "TARGET_DOWN...",
  3: "PULVERIZING...",
  4: "PROCESSING_MEAT...",
  5: "SIMULATION_COMPLETE"
};

// Initialize Attackers
const attackersContainer = document.getElementById('attackers-container');
const attackers = Array.from({ length: 40 }).map((_, i) => {
    const isLeft = i % 2 === 0;
    const startX = isLeft ? -800 - (i * 20) : 800 + (i * 20);
    const startY = (Math.random() - 0.5) * 400;
    const targetX = isLeft ? (Math.random() * -100 - 50) : (Math.random() * 100 + 50);
    const targetY = (Math.random() - 0.5) * 150 + 50;
    
    const el = document.createElement('div');
    el.className = 'absolute flex items-center transition-all duration-1000 ease-out opacity-0';
    el.style.transform = `translate(${startX}px, ${startY}px) scaleX(${isLeft ? -1 : 1})`;
    
    el.innerHTML = `
        <span class="text-6xl">🥷</span>
        <div class="knife text-6xl ml-[-10px] mt-[-20px] z-40 drop-shadow-md" style="transform-origin: 0% 100%">🔪</div>
    `;
    
    el.dataset.startX = startX;
    el.dataset.startY = startY;
    el.dataset.targetX = targetX;
    el.dataset.targetY = targetY;
    el.dataset.isLeft = isLeft;
    
    attackersContainer.appendChild(el);
    return el;
});

// Initialize Meat Chunks
const meatContainer = document.getElementById('meat-container');
for(let i = 0; i < 15; i++) {
    const meat = document.createElement('div');
    meat.className = 'text-5xl m-1 meat-chunk';
    meat.innerText = '🥩';
    meat.style.transform = 'scale(0)';
    meatContainer.appendChild(meat);
}

function setPhase(p) {
    phase = p;
    document.body.setAttribute('data-phase', phase);
    
    // update status texts
    const statusTextEl = document.getElementById('status-text');
    if(statusTextEl) statusTextEl.innerText = `STATUS: ${STATUS_TEXT[phase]}`;
    
    // Attackers
    if (phase === 1) {
        attackers.forEach(el => {
            el.style.transform = `translate(${el.dataset.targetX}px, ${el.dataset.targetY}px) scaleX(${el.dataset.isLeft === 'true' ? -1 : 1})`;
            el.style.opacity = '1';
            el.querySelector('.knife').classList.add('knife-animate');
        });
    } else {
        attackers.forEach(el => {
            el.style.transform = `translate(${el.dataset.startX}px, ${el.dataset.startY}px) scaleX(${el.dataset.isLeft === 'true' ? -1 : 1})`;
            el.style.opacity = '0';
            el.querySelector('.knife').classList.remove('knife-animate');
        });
    }
    
    // Meat chunks reset
    const meatChunks = document.querySelectorAll('.meat-chunk');
    if (phase === 0) {
        meatChunks.forEach(el => {
            el.style.animation = 'none';
        });
    } else if (phase === 3) {
        meatChunks.forEach((el, i) => {
            el.style.animation = `meat-spawn 0.5s ${0.5 + i * 0.2}s forwards`;
        });
    }

    // Button state
    const btnProcessingText = document.getElementById('btn-processing-text');
    if (btnProcessingText && phase !== 0 && phase !== 5) {
        btnProcessingText.innerText = STREAM_TEXT[phase];
    }
    
    // Zilu squash
    const ziluInner = document.getElementById('zilu-inner');
    ziluInner.style.animation = 'none';
    ziluInner.offsetHeight; // reflow
    if(phase === 3) {
        ziluInner.style.animation = `squash 3.5s forwards`;
    }

    // Hammer guy
    const hammer = document.getElementById('hammer');
    hammer.style.animation = 'none';
    hammer.offsetHeight; // reflow
    if (phase === 3) {
        hammer.style.animation = 'hammer-swing 3.5s forwards';
        hammer.style.transformOrigin = '20% 80%';
    } 

    clearTimeout(phaseTimer);
    if (phase === 1) phaseTimer = setTimeout(() => setPhase(2), 3500);
    else if (phase === 2) phaseTimer = setTimeout(() => setPhase(3), 2500);
    else if (phase === 3) phaseTimer = setTimeout(() => setPhase(4), 4000);
    else if (phase === 4) phaseTimer = setTimeout(() => setPhase(5), 4500);
}

// Init
setPhase(0);
